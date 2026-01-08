import { GLOBAL_CONFIG } from "../config/constants";

export function getOrCreateSubjectId(): string {
  let subject_id = localStorage.getItem("subject_id");
  if (!subject_id) {
    subject_id = Math.random().toString(36).substring(2, 12);
    localStorage.setItem("subject_id", subject_id);
  }
  return subject_id;
}

function getSessionKey(expType: string, subject_id: string): string {
  return `jspsych_resume_${expType}_${subject_id}`;
}

function getStatusKey(expType: string): string {
  return `experiment_status_${expType}`;
}

function getSurveyKeys(expType: string, subject_id: string): string[] {
  return [
    `survey_data_${expType}_${subject_id}`,
    `survey_state_${expType}_${subject_id}`,
  ];
}

export const SessionManager = {
  load: <T>(expType: string, subject_id: string): T | null => {
    const key = getSessionKey(expType, subject_id);
    const savedRaw = localStorage.getItem(key);

    if (!savedRaw) return null;

    try {
      const session = JSON.parse(savedRaw);

      if (session.version !== GLOBAL_CONFIG.EXPERIMENT_VERSION) {
        SessionManager.clear(expType, subject_id);
        localStorage.removeItem("subject_id");
        return null;
      }

      return session;
    } catch (e) {
      return null;
    }
  },

  save: <T>(expType: string, subject_id: string, data: T): void => {
    const key = getSessionKey(expType, subject_id);
    const dataWithVersion = {
      ...data,
      version: GLOBAL_CONFIG.EXPERIMENT_VERSION,
    };
    localStorage.setItem(key, JSON.stringify(dataWithVersion));
  },

  updateProgress: <T extends { trialIndex: number; trialData: any[] }>(
    expType: string,
    subject_id: string,
    session: T,
    idx: number,
    data: any
  ): void => {
    session.trialIndex = idx;
    session.trialData.push(data);
    const key = getSessionKey(expType, subject_id);
    const dataWithVersion = {
      ...session,
      version: GLOBAL_CONFIG.EXPERIMENT_VERSION,
    };
    localStorage.setItem(key, JSON.stringify(dataWithVersion));
  },

  clear: (expType: string, subject_id: string): void => {
    const key = getSessionKey(expType, subject_id);
    localStorage.removeItem(key);
    const surveyKeys = getSurveyKeys(expType, subject_id);
    surveyKeys.forEach((k) => localStorage.removeItem(k));
  },

  setCompleted: (expType: string): void => {
    localStorage.setItem(getStatusKey(expType), "completed");
  },

  isCompleted: (expType: string): boolean => {
    return localStorage.getItem(getStatusKey(expType)) === "completed";
  },
};
