import type { Pattern } from '@/types/content';

export const patterns: Pattern[] = [
  {
    id: 'prefix-sum',
    slug: 'prefix-sum',
    chapterId: 'ch-08',
    title: 'Сума на відрізку → Prefix Sum',
    level: 'foundation',
    description:
      'Префіксні суми перетворюють багато запитів про суму на відрізку з лінійного проходу на одну різницю.',
    recognitionSigns: [
      'Є незмінний масив і багато незалежних запитів [l, r].',
      'Для кожного запиту потрібно агрегувати суму сусідніх елементів.',
      'Прямий прохід по відрізку повторює більшу частину вже виконаної роботи.',
    ],
    constraintSignals: [
      'n та q близькі до 2 · 10⁵ — O(n · q) точно не пройде.',
      'Масив не змінюється між запитами — можна виконати preprocessing.',
      'Значення та суми можуть не вміщатися в int — потрібен long long.',
    ],
    theory: [
      {
        type: 'paragraph',
        text: 'Нехай pref[i] — сума перших i елементів. Тоді pref[0] = 0, а кожен наступний стан отримуємо як pref[i] = pref[i − 1] + a[i].',
      },
      {
        type: 'callout',
        title: 'Ключова формула',
        text: 'Сума елементів від l до r включно дорівнює pref[r] − pref[l − 1]. Частина до l − 1 віднімається від усього префікса до r.',
      },
      {
        type: 'list',
        items: [
          'Побудова масиву pref займає O(n).',
          'Кожен запит обробляється за O(1).',
          'Загальна складність для q запитів — O(n + q).',
        ],
      },
      {
        type: 'code',
        language: 'cpp',
        caption: 'Мінімальний шаблон префіксних сум',
        code: `vector<long long> pref(n + 1, 0);\nfor (int i = 1; i <= n; ++i) {\n    pref[i] = pref[i - 1] + a[i];\n}\n\nlong long range_sum(int l, int r) {\n    return pref[r] - pref[l - 1];\n}`,
      },
    ],
    taskIds: ['controlled-sum', 'quiet-segments'],
    hasContent: true,
  },
  {
    id: 'prefix-count',
    slug: 'prefix-count',
    chapterId: 'ch-08',
    title: 'Частота на відрізку → Prefix Count',
    level: 'foundation',
    description: 'Зберігаємо кількість появ потрібної ознаки на кожному префіксі.',
    recognitionSigns: [],
    constraintSignals: [],
    theory: [],
    taskIds: [],
    hasContent: false,
  },
  {
    id: 'difference-array',
    slug: 'difference-array',
    chapterId: 'ch-08',
    title: 'Багато змін на відрізках → Difference Array',
    level: 'foundation',
    description: 'Позначаємо лише початок і кінець кожної масової зміни.',
    recognitionSigns: [],
    constraintSignals: [],
    theory: [],
    taskIds: [],
    hasContent: false,
  },
];
