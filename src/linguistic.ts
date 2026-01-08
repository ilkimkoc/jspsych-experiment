/**
 * @title Linguistic Test Experiment
 * @description Tez çalışması için geliştirilen dilsel deney uygulaması
 * @version 1.0
 */

import "../styles/main.scss";
import i18next from "i18next";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import { setupExperiment } from "./utils/startup";
import { SessionManager } from "./utils/session_manager";
import { registerParticipant } from "./utils/database";
import { generateLinguisticStimuli } from "./utils/stimuli_factory";
import { foilPool, studyPool } from "./data/linguistic_stimuli";

import trTranslations from "../src/locales/tr/translation.json";
import deTranslations from "../src/locales/de/translation.json";
import { RunOptions, LinguisticTestData } from "./types/interfaces";

import { createPreloadTimeline } from "./timelines/shared/preload";
import { createWelcomeTimeline } from "./timelines/shared/welcome";
import { createStudyIntroTimeline } from "./timelines/linguistic/study_intro";
import { createStudyPhaseTimeline } from "./timelines/linguistic/study_phase";
import { createTestIntroTimeline } from "./timelines/linguistic/test_intro";
import { createTestPhaseTimeline } from "./timelines/linguistic/test_phase";
import { createSaveTimeline } from "./timelines/shared/save";
import { createCompletionTimeline } from "./timelines/shared/completion";
import { createDemographicsTimeline } from "./timelines/shared/demographics";
import { createLanguageSelectionTimeline } from "./timelines/shared/language_selection";
import { getExperimentContext } from "./utils/experiment_loader";
import {
  ExperimentType,
  Language,
  ParticipantGroup,
  Phase,
} from "./types/enums";
import { createInvalidPathTimeline } from "./timelines/shared/error_screens";
import { createDistractorIntro } from "./timelines/shared/distractor_intro";
import { createDistractorTimeline } from "./timelines/shared/distractor_phase";

import {
  GLOBAL_CONFIG,
  EXPERIMENT_CONFIGS,
  TIMING_CONFIG,
  DISTRACTOR_CONFIG,
  DATAPIPE_IDS,
} from "./config/constants";

const EXP_TYPE = ExperimentType.LINGUISTIC;
const LING_CONFIG = EXPERIMENT_CONFIGS.linguistic;

export async function run(_options: RunOptions) {
  const { jsPsych } = await setupExperiment({
    trResources: trTranslations,
    deResources: deTranslations,
  });

  const context = getExperimentContext<LinguisticTestData>(EXP_TYPE);
  if (!context.isValid) {
    await jsPsych.run([createInvalidPathTimeline()]);
    return jsPsych;
  }

  const { group, subject_id, savedSession: loadedSession } = context;

  let sessionToUse = loadedSession;

  jsPsych.data.addProperties({
    subject_id,
    experiment_type: EXP_TYPE,
    participant_group: group,
    version: GLOBAL_CONFIG.EXPERIMENT_VERSION,
  });

  if (
    GLOBAL_CONFIG.CHECK_PREVIOUS_PARTICIPATION &&
    SessionManager.isCompleted(EXP_TYPE)
  ) {
    await jsPsych.run([
      {
        type: HtmlKeyboardResponsePlugin,
        stimulus: `<p>${i18next.t("feedback.already_participated")}</p>`,
        choices: "NO_KEYS",
      },
    ]);
    return jsPsych;
  }

  let finalLang = context.lang;

  if (!sessionToUse) {
    if (group !== ParticipantGroup.HERITAGE) {
      await jsPsych.run([createLanguageSelectionTimeline(jsPsych)]);
      const lastTrialData = jsPsych.data.get().last(1).values()[0];
      finalLang = lastTrialData.lang as Language;
      if (!finalLang) throw new Error("Language selection failed.");
    }

    await i18next.changeLanguage(finalLang);

    const displayElement = jsPsych.getDisplayElement();
    if (displayElement) {
      displayElement.innerHTML = `
        <div class="spinner-container">
          <div class="spinner"></div>
          <p style="margin-top:20px;">${i18next.t("setup.preparing")}</p>
        </div>
      `;
    }

    try {
      const participantNumber = await registerParticipant(
        finalLang,
        subject_id,
        EXP_TYPE,
        group!
      );
      jsPsych.data.addProperties({
        lang: finalLang,
        participant_number: participantNumber,
      });

      const { learningPhaseStimuli, testPhaseStimuli } =
        generateLinguisticStimuli(studyPool, foilPool, {
          itemCountLearning: LING_CONFIG.ITEM_COUNT_LEARNING,
          testOldCount: LING_CONFIG.TEST_OLD_COUNT,
          testNewCount: LING_CONFIG.TEST_NEW_COUNT,
          lang: finalLang,
          participantNumber: participantNumber,
        });

      sessionToUse = {
        studyStimuli: learningPhaseStimuli,
        testStimuli: testPhaseStimuli,
        trialIndex: -1,
        trialData: [],
        participantNumber: participantNumber,
        lang: finalLang,
        group: group!,
      } as any;

      SessionManager.save(EXP_TYPE, subject_id, sessionToUse);
    } catch (error) {
      if (displayElement) {
        displayElement.innerHTML = `<p style='color:red;'>${i18next.t(
          "setup.error"
        )}: ${error}</p>`;
      }
      return jsPsych;
    }
  } else {
    if (sessionToUse.trialData?.length > 0) {
      sessionToUse.trialData.forEach((d: any) => {
        jsPsych.data.get().push({
          ...d,
          subject_id,
          experiment_type: EXP_TYPE,
          participant_group: group,
          lang: sessionToUse!.lang,
          participant_number: sessionToUse!.participantNumber,
          version: GLOBAL_CONFIG.EXPERIMENT_VERSION,
        });
      });
    }
    await i18next.changeLanguage(sessionToUse.lang);
    jsPsych.data.addProperties({
      lang: sessionToUse.lang,
      participant_number: sessionToUse.participantNumber,
    });
    finalLang = sessionToUse.lang;
  }

  const activeDataPipeId =
    group === ParticipantGroup.HERITAGE
      ? (DATAPIPE_IDS[EXP_TYPE] as any).heritage
      : (DATAPIPE_IDS[EXP_TYPE] as any)[finalLang];

  const finalDisplay = jsPsych.getDisplayElement();
  if (finalDisplay) finalDisplay.innerHTML = "";

  const mainTimeline = buildLinguisticTimeline(
    jsPsych,
    sessionToUse!,
    subject_id,
    group!,
    activeDataPipeId
  );
  const startIndex =
    sessionToUse!.trialIndex === -1 ? 0 : sessionToUse!.trialIndex + 1;
  const timelineToRun = mainTimeline.slice(startIndex);

  await jsPsych.run(timelineToRun);
  return jsPsych;
}

function buildLinguisticTimeline(
  jsPsych: any,
  session: any,
  subject_id: string,
  group: any,
  activeDataPipeId: any
): any[] {
  const updateSetupSession = (idx: number, data: any) => {
    data.phase = Phase.SETUP;
    SessionManager.updateProgress(EXP_TYPE, subject_id, session, idx, data);
  };

  const updateSession = (idx: number, data: any) =>
    SessionManager.updateProgress(EXP_TYPE, subject_id, session, idx, data);

  const baseTrial = {
    on_start: () => (jsPsych.getDisplayElement().innerHTML = ""),
  };

  let currentIdx = 0;

  const preload = createPreloadTimeline([]);
  currentIdx++;

  const demographics = createDemographicsTimeline(
    jsPsych,
    group,
    updateSetupSession,
    currentIdx++,
    EXP_TYPE,
    subject_id
  );
  const welcome = createWelcomeTimeline(
    baseTrial,
    updateSetupSession,
    currentIdx++,
    session
  );
  const studyIntro = createStudyIntroTimeline(
    baseTrial,
    updateSetupSession,
    currentIdx++,
    session
  );

  const studyTrials = createStudyPhaseTimeline(
    session.studyStimuli,
    baseTrial,
    updateSession,
    currentIdx,
    session,
    TIMING_CONFIG.STUDY_DELAY_LINGUISTIC
  );
  currentIdx += session.studyStimuli.length;

  const distractorIntro = createDistractorIntro(
    baseTrial,
    updateSetupSession,
    currentIdx++
  );
  const distractorTrials = createDistractorTimeline(updateSession, currentIdx);
  currentIdx += DISTRACTOR_CONFIG.TRIAL_COUNT * 2;

  const testIntro = createTestIntroTimeline(
    baseTrial,
    updateSetupSession,
    currentIdx++,
    session
  );
  const testTrials = createTestPhaseTimeline(
    jsPsych,
    session.testStimuli,
    baseTrial,
    updateSession,
    currentIdx,
    session
  );
  currentIdx += session.testStimuli.length;

  const save = createSaveTimeline(
    subject_id,
    jsPsych,
    EXP_TYPE,
    activeDataPipeId
  );
  const completion = createCompletionTimeline(baseTrial, EXP_TYPE, subject_id);

  return [
    preload,
    demographics,
    welcome,
    studyIntro,
    ...studyTrials,
    distractorIntro,
    ...distractorTrials,
    testIntro,
    ...testTrials,
    save,
    completion,
  ];
}
