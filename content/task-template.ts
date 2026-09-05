import type { ContentBlock, LearningStageId, TaskStage } from '@/types/content';

export const learningStageDefinitions: {
  id: LearningStageId;
  title: string;
}[] = [
  { id: 'try-yourself', title: 'Спробуй сам' },
  { id: 'hint', title: 'Підказка' },
  // Keep internal IDs stable; the first approach need not be brute force or slow.
  { id: 'brute-force', title: 'Перший підхід' },
  { id: 'why-slow', title: 'Що з ним не так?' },
  { id: 'observation', title: 'Ключове спостереження' },
  { id: 'algorithm', title: 'Алгоритм' },
  { id: 'proof', title: 'Доведення' },
  { id: 'complexity', title: 'Складність' },
  { id: 'solution', title: 'C++ рішення' },
  { id: 'takeaway', title: 'Що треба запам’ятати' },
];

export const practiceTaskRange = { min: 2, max: 4 } as const;

export function createLearningStages(
  blocks: Record<LearningStageId, ContentBlock[]>,
): TaskStage[] {
  return learningStageDefinitions.map((stage) => ({
    ...stage,
    blocks: blocks[stage.id],
  }));
}
