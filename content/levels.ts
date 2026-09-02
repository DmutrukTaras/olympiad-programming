import type { LevelId } from '@/types/content';

export const levelOrder: LevelId[] = [
  'foundation',
  'core',
  'combination',
  'advanced',
  'challenge',
];

export const levels: Record<
  LevelId,
  { number: number; label: string; description: string }
> = {
  foundation: {
    number: 1,
    label: 'Foundation',
    description: 'Базові прийоми, реалізація та алгоритмічне мислення.',
  },
  core: {
    number: 2,
    label: 'Core',
    description: 'Основні патерни, які постійно повторюються в задачах.',
  },
  combination: {
    number: 3,
    label: 'Combination',
    description: 'Поєднання кількох ідей та складніші моделі задач.',
  },
  advanced: {
    number: 4,
    label: 'Advanced',
    description: 'Просунуті структури, графи й математичні техніки.',
  },
  challenge: {
    number: 5,
    label: 'Challenge',
    description: 'Задачі, де алгоритм потрібно відкрити через переформулювання.',
  },
};
