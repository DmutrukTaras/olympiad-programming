import {
  twoPointerPatterns,
  twoPointerTasks,
} from '@/content/core/two-pointers';
import { searchPatterns, searchTasks } from '@/content/core/search';
import { greedyPatterns, greedyTasks } from '@/content/core/greedy';
import { monotonicPatterns, monotonicTasks } from '@/content/core/monotonic';

export const corePatterns = [
  ...twoPointerPatterns,
  ...searchPatterns,
  ...greedyPatterns,
  ...monotonicPatterns,
];

export const coreTasks = [
  ...twoPointerTasks,
  ...searchTasks,
  ...greedyTasks,
  ...monotonicTasks,
];
