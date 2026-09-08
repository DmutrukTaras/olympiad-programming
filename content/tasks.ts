import { advancedTasks } from '@/content/advanced';
import { challengeTasks } from '@/content/challenge';
import { combinationTasks } from '@/content/combination';
import { coreTasks } from '@/content/core';
import { foundationTasks } from '@/content/foundation';
import type { Task } from '@/types/content';

export const tasks: Task[] = [
  ...foundationTasks,
  ...coreTasks,
  ...combinationTasks,
  ...advancedTasks,
  ...challengeTasks,
];
