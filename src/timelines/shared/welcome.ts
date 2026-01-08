import HtmlButtonResponsePlugin from "@jspsych/plugin-html-button-response";
import i18next from "i18next";
import { Phase } from "../../types/enums";

export function createWelcomeTimeline(
  baseTrial: any,
  updateSession: (idx: number, data: any) => void,
  idx: number,
  _savedSession: any
) {
  return {
    ...baseTrial,
    type: HtmlButtonResponsePlugin,
    stimulus: `
      <div class="welcome-container">
        <p>${i18next.t("intro.welcome_task")}</p>
      </div>
    `,
    choices: [i18next.t("intro.ready_button")],
    on_finish: (d: any) => {
      d.phase = Phase.SETUP;
      updateSession(idx, d);
    },
  };
}
