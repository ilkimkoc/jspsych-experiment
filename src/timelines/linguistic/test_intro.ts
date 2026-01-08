import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response";
import i18next from "i18next";

export function createTestIntroTimeline(
  baseTrial: any,
  updateSession: (idx: number, data: any) => void,
  idx: number,
  _session: any
) {
  return {
    ...baseTrial,
    type: HtmlButtonResponsePlugin,
    stimulus: `<div class="instruction-container"><p>${i18next.t(
      "intro.linguistic_test_phase"
    )}</p></div>`,
    choices: [i18next.t("buttons.start_test")],
    on_finish: (d: any) => updateSession(idx, d),
  };
}
