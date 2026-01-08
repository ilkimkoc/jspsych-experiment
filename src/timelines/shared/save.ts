import i18next from "i18next";
import { SessionManager } from "../../utils/session_manager";
import { completeParticipant } from "../../utils/database";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";

function downloadData(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function createSaveTimeline(
  subject_id: string,
  jsPsych: any,
  expType: string,
  experimentId: string
) {
  return {
    type: htmlButtonResponse,
    stimulus: `
      <div id="save-status-container" class="save-status-wrapper">
        <p>${i18next.t("feedback.saving_data")}</p>
        <div class="spinner"></div>
      </div>
    `,
    choices: [],
    on_load: async () => {
      const filteredData = jsPsych.data
        .get()
        .filter({ experiment_type: expType });

      const experiment_values = filteredData.values();

      try {
        await completeParticipant(
          subject_id,
          expType,
          experimentId,
          experiment_values
        );
        SessionManager.setCompleted(expType);
        jsPsych.finishTrial();
      } catch (error) {
        const container = document.getElementById("save-status-container");
        if (container) {
          container.innerHTML = `
            <div class="save-error-box">
              <p><strong>${i18next.t("feedback.save_error_title")}</strong></p>
              <p>${i18next.t("feedback.save_error_text")}</p>
              <button id="manual-download-btn" class="manual-download-btn">
                ${i18next.t("feedback.download_button")}
              </button>
            </div>
          `;

          document
            .getElementById("manual-download-btn")
            ?.addEventListener("click", () => {
              downloadData(experiment_values, `${subject_id}_backup.json`);
            });
        }
      }
    },
    on_finish: () => {
      jsPsych.getDisplayElement().innerHTML = "";
    },
  };
}
