import { currentLang } from "./helpers";
import { getOrCreateSubjectId, SessionManager } from "./session_manager";
import { DATAPIPE_IDS } from "../config/constants";
import { ParticipantGroup, Language } from "../types/enums";
import { SavedSession } from "../types/interfaces";

export function getExperimentContext<T>(expType: string) {
  let subject_id = getOrCreateSubjectId();
  const params = new URLSearchParams(window.location.search);
  const groupParam = params.get("group");

  const isValid =
    groupParam === ParticipantGroup.STANDARD ||
    groupParam === ParticipantGroup.HERITAGE;

  if (!isValid) {
    return {
      isValid: false,
      lang: Language.TR,
      subject_id,
      group: null,
      activeDataPipeId: null,
      savedSession: null,
    };
  }

  const group = groupParam as ParticipantGroup;
  let lang = currentLang() as Language;

  if (group === ParticipantGroup.HERITAGE) {
    lang = Language.TR;
  }

  let savedSession = SessionManager.load<SavedSession<T>>(expType, subject_id);

  if (savedSession) {
    if (savedSession.group !== group) {
      SessionManager.clear(expType, subject_id);
      localStorage.removeItem("subject_id");
      subject_id = Math.random().toString(36).substring(2, 12);
      localStorage.setItem("subject_id", subject_id);
      savedSession = null;
    } else {
      lang = (savedSession as any).lang || lang;
    }
  } else {
    localStorage.removeItem("subject_id");
    subject_id = Math.random().toString(36).substring(2, 12);
    localStorage.setItem("subject_id", subject_id);
  }

  let activeDataPipeId = null;
  const expTypeKey = expType as keyof typeof DATAPIPE_IDS;
  const pipePool = DATAPIPE_IDS[expTypeKey];

  if (group === ParticipantGroup.HERITAGE) {
    activeDataPipeId = (pipePool as any).heritage;
  } else {
    const lookupLang = lang || Language.TR;
    activeDataPipeId = (pipePool as any)[lookupLang];
  }

  return {
    isValid: true,
    lang,
    group,
    subject_id,
    activeDataPipeId,
    savedSession,
  };
}
