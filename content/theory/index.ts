import { combinationTheoryAdditions } from '@/content/theory/combination';
import { coreTheoryAdditions } from '@/content/theory/core';
import { foundationTheoryAdditions } from '@/content/theory/foundation';
import type { TheorySections } from '@/content/theory/helpers';

export const theoryAdditions: Record<string, TheorySections> = {
  ...foundationTheoryAdditions,
  ...coreTheoryAdditions,
  ...combinationTheoryAdditions,
};
