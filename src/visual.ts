/**
 * @title Visual Test Experiment
 * @description Görsel uyaranlar üzerinden kaynak bellek ölçümü
 * @version 1.0
 * @assets assets/visual/img/
 */

import "../styles/main.scss";
import i18next from "i18next";
import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";

import { setupExperiment } from "./utils/startup";
import { SessionManager } from "./utils/session_manager";
import { registerParticipant } from "./utils/database";
import { generateVisualStimuli } from "./utils/stimuli_factory";
import { studyPool, foilPool } from "./data/visual_stimuli";

import trTranslations from "../src/locales/tr/translation.json";
import deTranslations from "../src/locales/de/translation.json";
import { RunOptions, VisualTestData } from "./types/interfaces";

import {
  GLOBAL_CONFIG,
  EXPERIMENT_CONFIGS,
  TIMING_CONFIG,
  DISTRACTOR_CONFIG,
  DATAPIPE_IDS,
} from "./config/constants";

import { createPreloadTimeline } from "./timelines/shared/preload";
import { createWelcomeTimeline } from "./timelines/shared/welcome";
import { createSaveTimeline } from "./timelines/shared/save";
import { createCompletionTimeline } from "./timelines/shared/completion";
import { createStudyPhaseTimeline } from "./timelines/visual/study_phase";
import { createTestPhaseTimeline } from "./timelines/visual/test_phase";
import { createStudyIntroTimeline } from "./timelines/visual/study_intro";
import { createTestIntroTimeline } from "./timelines/visual/test_intro";
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

const EXP_TYPE = ExperimentType.VISUAL;
const VIS_CONFIG = EXPERIMENT_CONFIGS.visual;

export async function run({ assetPaths }: RunOptions) {
  const { jsPsych } = await setupExperiment({
    trResources: trTranslations,
    deResources: deTranslations,
  });

  const context = getExperimentContext<VisualTestData>(EXP_TYPE);
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

      const { learningPhaseStimuli, testPhaseStimuli } = generateVisualStimuli(
        studyPool,
        foilPool,
        {
          itemCountLearning: VIS_CONFIG.ITEM_COUNT_LEARNING,
          testOldCount: VIS_CONFIG.TEST_OLD_COUNT,
          testNewCount: VIS_CONFIG.TEST_NEW_COUNT,
          lang: finalLang,
          participantNumber: participantNumber,
        },
        assetPaths.images
      );

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

  const mainTimeline = buildExperimentTimeline(
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

function buildExperimentTimeline(
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

  const images = session.studyStimuli
    .map((i: any) => i.image_path)
    .filter((p: any) => !!p);
  const preload = createPreloadTimeline(images);
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
    TIMING_CONFIG.STUDY_DELAY_VISUAL
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
  currentIdx += session.testStimuli.length * 2;

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
