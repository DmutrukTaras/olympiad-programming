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
    description:
      '4 глави · 12 патернів · 36 основних авторських задач і необов’язкові extensions. Перетворюємо умову на простий алгоритм і вчимося оцінювати складність.',
  },
  core: {
    number: 2,
    label: 'Core',
    description:
      '4 глави · 12 патернів · 36 авторських задач. Вчимося розпізнавати рухомі межі, монотонність, greedy-вибір і структури з потрібним порядком доступу.',
  },
  combination: {
    number: 3,
    label: 'Combination',
    description:
      '4 глави · 12 патернів · 48 авторських задач. Вчимося будувати модель, переформульовувати умову та поєднувати кілька алгоритмів.',
  },
  advanced: {
    number: 4,
    label: 'Advanced',
    description:
      '5 глав · 15 патернів · 15 повних розборів і 51 вправа. Поглиблюємо рядки, геометрію, bitmask, графи, дерева та математичні моделі.',
  },
  challenge: {
    number: 5,
    label: 'Challenge',
    description:
      '4 глави · 12 патернів · 12 повних розборів і 36 вправ. Будуємо reductions, оптимізуємо переходи та комбінуємо 3–4 техніки.',
  },
};
