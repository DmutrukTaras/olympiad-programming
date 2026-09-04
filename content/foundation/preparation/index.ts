import { implementationPreparation } from '@/content/foundation/preparation/implementation';
import { sortingPreparation } from '@/content/foundation/preparation/sorting';
import { preprocessingPreparation } from '@/content/foundation/preparation/preprocessing';
import { mathPreparation } from '@/content/foundation/preparation/math';
import type { PatternPreparation } from '@/types/content';

export const foundationPreparation: Record<string, PatternPreparation> = {
  ...implementationPreparation,
  ...sortingPreparation,
  ...preprocessingPreparation,
  ...mathPreparation,
};
