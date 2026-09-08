import { bitmaskPatterns, bitmaskTasks } from '@/content/advanced/bitmask';
import { geometryPatterns, geometryTasks } from '@/content/advanced/geometry';
import {
  advancedGraphTreePatterns,
  advancedGraphTreeTasks,
} from '@/content/advanced/graph-trees';
import {
  advancedMathPatterns,
  advancedMathTasks,
} from '@/content/advanced/math';
import { stringPatterns, stringTasks } from '@/content/advanced/strings';

export const advancedPatterns = [
  ...stringPatterns,
  ...geometryPatterns,
  ...bitmaskPatterns,
  ...advancedGraphTreePatterns,
  ...advancedMathPatterns,
];

export const advancedTasks = [
  ...stringTasks,
  ...geometryTasks,
  ...bitmaskTasks,
  ...advancedGraphTreeTasks,
  ...advancedMathTasks,
];
