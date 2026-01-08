import HtmlKeyboardResponsePlugin from "@jspsych/plugin-html-keyboard-response";
import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response";
import i18next from "i18next";
import { DISTRACTOR_CONFIG, TIMING_CONFIG } from "../../config/constants";
import { Phase, TaskName } from "../../types/enums";

export function createDistractorTimeline(updateSession: any, startIdx: number) {
  const trials = Array.from({ length: DISTRACTOR_CONFIG.TRIAL_COUNT }, () => {
    const { MIN, MAX } = DISTRACTOR_CONFIG.NUMBER_RANGE;
    const randomNumber = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    const isEven = randomNumber % 2 === 0;

    return {
      number: randomNumber,
      correct_response: isEven
        ? DISTRACTOR_CONFIG.KEYS[0]
        : DISTRACTOR_CONFIG.KEYS[1],
    };
  });

  return trials.flatMap((item, i) => {
    const fixationIdx = startIdx + i * 2;
    const taskIdx = startIdx + i * 2 + 1;

    return [
      {
        type: HtmlKeyboardResponsePlugin,
        stimulus: '<div class="fixation-cross">+</div>',
        choices: "NO_KEYS",
        trial_duration: TIMING_CONFIG.FIXATION_DURATION_MS,
        on_finish: (d: any) => {
          d.phase = Phase.DISTRACTOR;
          updateSession(fixationIdx, d);
        },
      },
      {
        type: HtmlButtonResponsePlugin,
        stimulus: `
          <div class="distractor-task">
            <div class="number-display">${item.number}</div>
          </div>
        `,
        choices: [i18next.t("distractor.even"), i18next.t("distractor.odd")],
        data: {
          task: TaskName.DISTRACTOR,
          phase: Phase.DISTRACTOR,
          correct_response: item.correct_response,
          number: item.number,
        },
        on_finish: (data: any) => {
          const responseValue = DISTRACTOR_CONFIG.KEYS[data.response];
          data.response = responseValue;
          data.correct = data.response === data.correct_response;
          updateSession(taskIdx, data);
        },
      },
    ];
  });
}
