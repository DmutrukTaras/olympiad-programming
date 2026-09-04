import {
  implementationPatterns,
  implementationTasks,
} from '@/content/foundation/implementation';
import { sortingPatterns, sortingTasks } from '@/content/foundation/sorting';
import {
  preprocessingPatterns,
  preprocessingTasks,
} from '@/content/foundation/preprocessing';
import { mathPatterns, mathTasks } from '@/content/foundation/math';

export const foundationPatterns = [
  ...implementationPatterns,
  ...sortingPatterns,
  ...preprocessingPatterns,
  ...mathPatterns,
];
export const foundationTasks = [
  ...implementationTasks,
  ...sortingTasks,
  ...preprocessingTasks,
  ...mathTasks,
];
