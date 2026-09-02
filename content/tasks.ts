import type { Task } from '@/types/content';

export const tasks: Task[] = [
  {
    id: 'controlled-sum',
    slug: 'controlled-sum',
    title: 'Сума під контролем',
    kind: 'learning',
    level: 'foundation',
    patternIds: ['prefix-sum'],
    statement: [
      'Лабораторія записала n послідовних вимірювань. Для кожного з q запитів потрібно знайти суму вимірювань із позицій від l до r включно.',
      'Масив вимірювань не змінюється. Запити потрібно опрацювати у заданому порядку.',
    ],
    input: 'У першому рядку задано n і q. У другому — n цілих чисел. Далі йдуть q пар l, r.',
    output: 'Для кожного запиту виведіть суму елементів на відрізку [l, r].',
    constraints: ['1 ≤ n, q ≤ 2 · 10⁵', '−10⁹ ≤ aᵢ ≤ 10⁹', '1 ≤ l ≤ r ≤ n'],
    stages: [
      {
        id: 'hint',
        title: 'Підказка',
        blocks: [
          { type: 'paragraph', text: 'Подумай, яку інформацію про перші i елементів можна порахувати один раз, а потім використати для кожного запиту.' },
        ],
      },
      {
        id: 'brute-force',
        title: 'Brute force',
        blocks: [
          { type: 'paragraph', text: 'Для кожної пари l, r пройти циклом від l до r і додати всі елементи.' },
          { type: 'code', language: 'cpp', code: `long long sum = 0;\nfor (int i = l; i <= r; ++i) {\n    sum += a[i];\n}` },
        ],
      },
      {
        id: 'why-slow',
        title: 'Чому він не проходить',
        blocks: [
          { type: 'paragraph', text: 'Один запит може охоплювати весь масив, тобто коштувати O(n). Для q запитів маємо O(n · q), що в гіршому випадку становить приблизно 4 · 10¹⁰ операцій.' },
        ],
      },
      {
        id: 'observation',
        title: 'Ключове спостереження',
        blocks: [
          { type: 'callout', title: 'Відрізок — це різниця двох префіксів', text: 'У сумі від початку до r уже міститься потрібний відрізок. Достатньо відняти суму елементів, що стоять до l.' },
        ],
      },
      {
        id: 'algorithm',
        title: 'Алгоритм',
        blocks: [
          { type: 'list', items: ['Побудувати pref, де pref[i] — сума перших i елементів.', 'Для кожного запиту обчислити pref[r] − pref[l − 1].', 'Вивести отриману відповідь.'] },
        ],
      },
      {
        id: 'complexity',
        title: 'Оцінка складності',
        blocks: [
          { type: 'paragraph', text: 'Підготовка займає O(n), усі запити — O(q). Загалом O(n + q) часу та O(n) додаткової пам’яті.' },
        ],
      },
      {
        id: 'solution',
        title: 'C++ рішення',
        blocks: [
          {
            type: 'code',
            language: 'cpp',
            code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n, q;\n    cin >> n >> q;\n\n    vector<long long> pref(n + 1, 0);\n    for (int i = 1; i <= n; ++i) {\n        long long value;\n        cin >> value;\n        pref[i] = pref[i - 1] + value;\n    }\n\n    while (q--) {\n        int l, r;\n        cin >> l >> r;\n        cout << pref[r] - pref[l - 1] << '\\n';\n    }\n}`,
          },
        ],
      },
    ],
    hasEditorial: true,
  },
  {
    id: 'quiet-segments',
    slug: 'quiet-segments',
    title: 'Тихі відрізки',
    kind: 'practice',
    level: 'foundation',
    patternIds: ['prefix-sum'],
    statement: ['Знайдіть суму значень для кожного заданого відрізка журналу.'],
    input: 'Масив і набір запитів.',
    output: 'Суми для всіх запитів.',
    constraints: ['1 ≤ n, q ≤ 2 · 10⁵'],
    stages: [],
    hasEditorial: false,
  },
];
