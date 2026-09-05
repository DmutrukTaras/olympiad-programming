import { graphPatterns, graphTasks } from '@/content/combination/graphs';
import { treePatterns, treeTasks } from '@/content/combination/trees';
import { dpPatterns, dpTasks } from '@/content/combination/dp';
import { queryPatterns, queryTasks } from '@/content/combination/queries';

export const combinationPatterns = [
  ...graphPatterns,
  ...treePatterns,
  ...dpPatterns,
  ...queryPatterns,
];

export const combinationTasks = [
  ...graphTasks,
  ...treeTasks,
  ...dpTasks,
  ...queryTasks,
];
