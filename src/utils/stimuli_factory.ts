import { shuffleArray } from "./helpers";
import {
  LinguisticStimulusItem,
  LinguisticTestData,
  StimuliConfig,
  VisualStimulusItem,
  VisualTestData,
} from "../types/interfaces";
import { ItemType, Condition, Language } from "../types/enums";

export function generateLinguisticStimuli(
  studyPool: LinguisticStimulusItem[],
  foilPool: LinguisticStimulusItem[],
  config: StimuliConfig & { participantNumber: number }
) {
  const {
    itemCountLearning,
    testOldCount,
    testNewCount,
    lang,
    participantNumber,
  } = config;

  const evenPool = studyPool.filter((i) => i.id % 2 === 0);
  const oddPool = studyPool.filter((i) => i.id % 2 !== 0);
  const halfCount = Math.floor(itemCountLearning / 2);

  const selectedStudyItems = shuffleArray([
    ...shuffleArray(evenPool).slice(0, halfCount),
    ...shuffleArray(oddPool).slice(0, halfCount),
  ]);

  const learningPhaseStimuli: LinguisticTestData[] = selectedStudyItems.map(
    (item) => {
      const stem = lang === Language.TR ? item.tr_stem : item.de_stem;
      const opt1 = lang === Language.TR ? item.tr_direct : item.de_direct;
      const opt2 = lang === Language.TR ? item.tr_indirect : item.de_indirect;

      const isDirect = (participantNumber + item.id) % 2 === 0;
      const shown = isDirect ? opt1 : opt2;

      return {
        id: item.id,
        sentence: stem,
        option1: opt1,
        option2: opt2,
        item_type: ItemType.OLD,
        shownVersion: shown,
        condition: isDirect ? Condition.DIRECT : Condition.INDIRECT,
      };
    }
  );

  const directOldPool = learningPhaseStimuli.filter(
    (item) => item.condition === Condition.DIRECT
  );
  const indirectOldPool = learningPhaseStimuli.filter(
    (item) => item.condition === Condition.INDIRECT
  );
  const halfOld = Math.floor(testOldCount / 2);

  const testOldItems = [
    ...shuffleArray(directOldPool).slice(0, halfOld),
    ...shuffleArray(indirectOldPool).slice(0, halfOld),
  ];

  const testNewItems: LinguisticTestData[] = shuffleArray(foilPool)
    .slice(0, testNewCount)
    .map((item) => ({
      id: item.id,
      sentence: lang === Language.TR ? item.tr_stem : item.de_stem,
      option1: lang === Language.TR ? item.tr_direct : item.de_direct,
      option2: lang === Language.TR ? item.tr_indirect : item.de_indirect,
      item_type: ItemType.NEW,
      condition: Condition.NEW_ITEM,
    }));

  return {
    learningPhaseStimuli,
    testPhaseStimuli: shuffleArray([...testOldItems, ...testNewItems]),
  };
}

export function generateVisualStimuli(
  studyPool: VisualStimulusItem[],
  foilPool: VisualStimulusItem[],
  config: StimuliConfig & { participantNumber: number },
  availableImages: string[]
) {
  const {
    itemCountLearning,
    testOldCount,
    testNewCount,
    lang,
    participantNumber,
  } = config;

  const evenPool = studyPool.filter((i) => i.id % 2 === 0);
  const oddPool = studyPool.filter((i) => i.id % 2 !== 0);
  const halfCount = Math.floor(itemCountLearning / 2);

  const selectedStudyItems = shuffleArray([
    ...shuffleArray(evenPool).slice(0, halfCount),
    ...shuffleArray(oddPool).slice(0, halfCount),
  ]);

  const learningPhaseStimuli: VisualTestData[] = selectedStudyItems.map(
    (item) => {
      const isDirect = (participantNumber + item.id) % 2 === 0;
      const conditionValue = isDirect ? Condition.DIRECT : Condition.INDIRECT;
      const idFormatted = String(item.id).padStart(2, "0");

      const searchPattern = `${idFormatted}_${item.action_key}_${conditionValue}_${item.gender}.jpg`;

      const actualPath = availableImages.find((path) =>
        path.toLowerCase().includes(searchPattern.toLowerCase())
      );

      return {
        id: item.id,
        image_path: actualPath || "undefined_fallback.jpg",
        sentence: lang === Language.TR ? item.tr : item.de,
        item_type: ItemType.OLD,
        condition: conditionValue,
        gender: item.gender,
      };
    }
  );

  const directOldPool = learningPhaseStimuli.filter(
    (item) => item.condition === Condition.DIRECT
  );
  const indirectOldPool = learningPhaseStimuli.filter(
    (item) => item.condition === Condition.INDIRECT
  );
  const halfOld = Math.floor(testOldCount / 2);

  const testOldItems = [
    ...shuffleArray(directOldPool).slice(0, halfOld),
    ...shuffleArray(indirectOldPool).slice(0, halfOld),
  ];

  const testNewItems: VisualTestData[] = shuffleArray(foilPool)
    .slice(0, testNewCount)
    .map((item) => ({
      id: item.id,
      sentence: lang === Language.TR ? item.tr : item.de,
      item_type: ItemType.NEW,
      condition: Condition.NEW_ITEM,
      gender: item.gender,
    }));

  return {
    learningPhaseStimuli,
    testPhaseStimuli: shuffleArray([...testOldItems, ...testNewItems]),
  };
}
