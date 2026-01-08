import { ExperimentType, ParticipantGroup } from "../types/enums";
import { supabase } from "./supabaseClient";
import { GLOBAL_CONFIG } from "../config/constants";

export async function registerParticipant(
  lang: string,
  subject_id: string,
  exp_type: ExperimentType,
  group: ParticipantGroup
): Promise<number> {
  const ua = navigator.userAgent;
  let browser = "Other";

  if (ua.includes("Firefox")) {
    browser = "Firefox";
  } else if (ua.includes("Edg/")) {
    browser = "Edge";
  } else if (ua.includes("OPR/") || ua.includes("Opera/")) {
    browser = "Opera";
  } else if (ua.includes("Chrome")) {
    browser = "Chrome";
  } else if (ua.includes("Safari")) {
    browser = "Safari";
  }

  const { data, error } = await supabase.rpc("register_participant", {
    p_subject_id: subject_id,
    p_lang: lang,
    p_exp_type: exp_type,
    p_group: group,
    p_browser: browser,
    p_mobile: /Mobi|Android/i.test(ua),
    p_res: `${window.screen.width}x${window.screen.height}`,
    p_version: GLOBAL_CONFIG.EXPERIMENT_VERSION,
  });

  if (error || data === null) {
    console.error("Registration failed:", error);
    throw new Error("participant_registration_failed");
  }

  return Number(data);
}

export async function completeParticipant(
  subject_id: string,
  exp_type: string,
  experiment_id: string,
  experiment_data: any[]
): Promise<void> {
  await supabase
    .from("participant_sequences")
    .update({ results: experiment_data })
    .eq("subject_id", subject_id);

  try {
    const response = await fetch("https://pipe.jspsych.org/api/data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        experimentID: experiment_id,
        filename: `${subject_id}.json`,
        data: JSON.stringify(experiment_data),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("DataPipe error:", errorData);
    }
  } catch (e) {
    console.error("DataPipe network error:", e);
  }

  await supabase
    .from("participant_sequences")
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
    })
    .eq("subject_id", subject_id)
    .eq("experiment_type", exp_type);
}
