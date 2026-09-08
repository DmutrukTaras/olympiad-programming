import {
  dpOptimizationPatterns,
  dpOptimizationTasks,
} from '@/content/challenge/dp-optimization';
import { flowPatterns, flowTasks } from '@/content/challenge/flow';
import { gamePatterns, gameTasks } from '@/content/challenge/games';
import {
  reformulationPatterns,
  reformulationTasks,
} from '@/content/challenge/reformulation';

export const challengePatterns = [
  ...flowPatterns,
  ...dpOptimizationPatterns,
  ...gamePatterns,
  ...reformulationPatterns,
];

export const challengeTasks = [
  ...flowTasks,
  ...dpOptimizationTasks,
  ...gameTasks,
  ...reformulationTasks,
];
