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
    description: 'Просунуті структури, графи й математичні техніки.',
  },
  challenge: {
    number: 5,
    label: 'Challenge',
    description:
      'Задачі, де алгоритм потрібно відкрити через переформулювання.',
  },
};
