const IS_TEST_MODE = false;

export const FAVICON_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23474747'/%3E%3Ccircle cx='16' cy='14' r='7' stroke='white' stroke-width='2' fill='none'/%3E%3Ccircle cx='16' cy='14' r='2.5' fill='%233498db'/%3E%3Crect x='9' y='23' width='14' height='2' rx='1' fill='white'/%3E%3Crect x='12' y='27' width='8' height='2' rx='1' fill='%233498db'/%3E%3C/svg%3E";

export const GLOBAL_CONFIG = {
  CHECK_PREVIOUS_PARTICIPATION: true,
  SUPABASE_URL: "https://khgtbanehpmhnqewxgsg.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_FH5v9XGBtcTUlgFsXxgbxg_2ZG1_vOO",
  MAX_PRELOAD_TIME_MS: 30000,
  THEME_STORAGE_KEY: "theme",
  EXPERIMENT_VERSION: "v1.0",
};

export const TIMING_CONFIG = {
  FIXATION_DURATION_MS: IS_TEST_MODE ? 100 : 500,
  STUDY_DELAY_LINGUISTIC: IS_TEST_MODE ? 500 : 3000,
  STUDY_DELAY_VISUAL: IS_TEST_MODE ? 500 : 3000,
  WELCOME_SCREEN_DURATION: IS_TEST_MODE ? 500 : 5000,
  DISTRACTOR_TRIAL_LIMIT: IS_TEST_MODE ? 1000 : 5000,
};

export const DISTRACTOR_CONFIG = {
  TRIAL_COUNT: IS_TEST_MODE ? 4 : 40,
  KEYS: ["even", "odd"],
  NUMBER_RANGE: { MIN: 1, MAX: 99 },
};

export const EXPERIMENT_CONFIGS = {
  linguistic: {
    ITEM_COUNT_LEARNING: IS_TEST_MODE ? 4 : 20,
    TEST_OLD_COUNT: IS_TEST_MODE ? 2 : 10,
    TEST_NEW_COUNT: IS_TEST_MODE ? 2 : 10,
  },
  visual: {
    ITEM_COUNT_LEARNING: IS_TEST_MODE ? 4 : 20,
    TEST_OLD_COUNT: IS_TEST_MODE ? 2 : 10,
    TEST_NEW_COUNT: IS_TEST_MODE ? 2 : 10,
  },
};

export const DATAPIPE_IDS = {
  linguistic: {
    de: "iJT0OqZnKvDT",
    tr: "BpMS2zQypzAm",
    heritage: "wzRQtviBoXTw",
  },
  visual: {
    de: "QAdbPm1UnbdF",
    tr: "zg6Pog54Ap02",
    heritage: "x2TrrRzOeZmh",
  },
};
