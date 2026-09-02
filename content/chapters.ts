import type { Chapter } from '@/types/content';

const chapter = (
  id: string,
  slug: string,
  order: number,
  title: string,
  summary: string,
  level: Chapter['level'],
  taskTypes: string[],
  options: Partial<Pick<Chapter, 'prerequisiteIds' | 'patternIds' | 'takeaways' | 'hasContent'>> = {},
): Chapter => ({
  id,
  slug,
  order,
  title,
  summary,
  level,
  taskTypes,
  prerequisiteIds: options.prerequisiteIds ?? [],
  patternIds: options.patternIds ?? [],
  takeaways: options.takeaways ?? [],
  hasContent: options.hasContent ?? false,
});

export const chapters: Chapter[] = [
  chapter('ch-01', 'how-to-read', 1, 'Як читати олімпіадну задачу', 'Виділяємо дані, ціль, умови та приховані зв’язки.', 'foundation', ['пряма реалізація', 'аналіз умови'], {
    takeaways: [
      'Переписати умову мовою даних та операцій.',
      'Відокремити гарантовані властивості від прикладів.',
      'Сформулювати, що саме має повернути алгоритм.',
    ],
    hasContent: true,
  }),
  chapter('ch-02', 'constraints-complexity', 2, 'Constraints і оцінка складності', 'Перекладаємо обмеження на допустиму асимптотику.', 'foundation', ['оцінка складності'], {
    prerequisiteIds: ['ch-01'],
    takeaways: [
      'Оцінити допустимий клас складності за розміром входу.',
      'Врахувати всі параметри та помітити маленький параметр.',
      'Оцінити не лише час, а й обсяг пам’яті.',
    ],
    hasContent: true,
  }),
  chapter('ch-03', 'brute-force-to-efficient', 3, 'Від brute force до ефективного алгоритму', 'Будуємо просте рішення та знаходимо зайву роботу.', 'foundation', ['оптимізація', 'повний перебір'], {
    prerequisiteIds: ['ch-02'],
    takeaways: [
      'Сформулювати правильне brute-force рішення.',
      'Знайти операцію, що виконується повторно.',
      'Замінити перебір preprocessing, структурою даних або новою моделлю.',
    ],
    hasContent: true,
  }),
  chapter('ch-04', 'recognize-pattern', 4, 'Як розпізнати патерн і перевірити рішення', 'Формуємо гіпотезу, доведення та набір перевірок.', 'foundation', ['розпізнавання патернів'], {
    prerequisiteIds: ['ch-01', 'ch-02'],
    takeaways: [
      'Пов’язати властивості задачі з алгоритмічними кандидатами.',
      'Перевірити ключову передумову обраного патерну.',
      'Спробувати зламати рішення контрприкладом до написання коду.',
    ],
    hasContent: true,
  }),
  chapter('ch-05', 'cpp-stl', 5, 'C++ та STL для олімпіадного програмування', 'Практичний набір інструментів для швидкої реалізації.', 'foundation', ['реалізація', 'контейнери'], {
    takeaways: [
      'Безпечно працювати з числовими типами та уникати overflow.',
      'Використовувати vector, sorting і binary search у STL.',
      'Вибирати контейнер за потрібними операціями та їх складністю.',
    ],
    hasContent: true,
  }),
  chapter('ch-06', 'implementation-arrays-strings', 6, 'Implementation, масиви та рядки', 'Акуратна симуляція, індекси й обробка даних.', 'foundation', ['масиви', 'рядки']),
  chapter('ch-07', 'sorting-basic-data-structures', 7, 'Сортування та базові структури даних', 'Використовуємо порядок і стандартні структури.', 'foundation', ['сортування', 'структури даних']),
  chapter('ch-08', 'prefix-suffix-preprocessing', 8, 'Prefix, Suffix та Preprocessing', 'Один раз готуємо дані, щоб швидко відповідати багато разів.', 'foundation', ['відрізки', 'багато запитів'], {
    prerequisiteIds: ['ch-02', 'ch-06'],
    patternIds: ['prefix-sum', 'prefix-count', 'difference-array'],
    takeaways: [
      'Побачити повторне обчислення тієї самої інформації.',
      'Побудувати префіксний стан і правильно визначити його межі.',
      'Відповідати на запит за O(1) після O(n) підготовки.',
    ],
    hasContent: true,
  }),
  chapter('ch-09', 'basic-math-invariants', 9, 'Базова математика, спостереження та інваріанти', 'Використовуємо властивості чисел і незмінні величини.', 'foundation', ['математика', 'інваріанти']),
  chapter('ch-10', 'two-pointers-sliding-window', 10, 'Two Pointers та Sliding Window', 'Підтримуємо рухоме вікно без повторної роботи.', 'core', ['підмасиви', 'відрізки']),
  chapter('ch-11', 'binary-search', 11, 'Binary Search', 'Шукаємо межу у відсортованих даних або просторі відповіді.', 'core', ['пошук', 'оптимізація']),
  chapter('ch-12', 'greedy-constructive', 12, 'Greedy та Constructive Algorithms', 'Робимо локальний вибір або будуємо потрібний об’єкт.', 'core', ['вибір', 'побудова']),
  chapter('ch-13', 'stack-queue-monotonic', 13, 'Stack, Queue та Monotonic Structures', 'Підтримуємо потрібний порядок елементів онлайн.', 'core', ['стек', 'черга']),
  chapter('ch-14', 'graphs', 14, 'Графи', 'Моделюємо зв’язки, маршрути та досяжність.', 'core', ['графи', 'маршрути']),
  chapter('ch-15', 'trees-dsu-mst', 15, 'Дерева, DSU та MST', 'Працюємо з ієрархіями, компонентами та каркасами.', 'core', ['дерева', 'компоненти']),
  chapter('ch-16', 'dynamic-programming', 16, 'Dynamic Programming', 'Зберігаємо відповіді для станів і будуємо переходи.', 'core', ['оптимізація', 'підрахунок способів']),
  chapter('ch-17', 'queries-data-structures', 17, 'Запити та структури даних', 'Обробляємо багато запитів і змін даних.', 'combination', ['запити', 'оновлення']),
  chapter('ch-18', 'string-algorithms', 18, 'String Algorithms', 'Шукаємо збіги, періоди та структуру тексту.', 'combination', ['рядки', 'пошук']),
  chapter('ch-19', 'computational-geometry', 19, 'Computational Geometry', 'Перетворюємо геометричні умови на точні обчислення.', 'combination', ['координати', 'геометрія']),
  chapter('ch-20', 'small-n-bitmask-mitm', 20, 'Small-n, Bitmask та Meet in the Middle', 'Використовуємо малий параметр замість великого n.', 'combination', ['малий n', 'підмножини']),
  chapter('ch-21', 'advanced-graphs-trees', 21, 'Advanced Graphs та Trees', 'Поєднуємо структуру графа з ефективними запитами.', 'advanced', ['графи', 'дерева']),
  chapter('ch-22', 'probability-combinatorics-math', 22, 'Probability, Combinatorics та Advanced Math', 'Рахуємо конфігурації та працюємо з випадковістю.', 'advanced', ['математика', 'комбінаторика']),
  chapter('ch-23', 'matching-flow', 23, 'Matching та Flow', 'Моделюємо призначення, пропускні здатності та розподіл.', 'advanced', ['зв’язки', 'розподіл']),
  chapter('ch-24', 'dp-optimization', 24, 'Оптимізація Dynamic Programming', 'Прискорюємо переходи за допомогою додаткової структури.', 'challenge', ['оптимізація DP']),
  chapter('ch-25', 'game-theory', 25, 'Game Theory', 'Шукаємо виграшні стани та правильну модель гри.', 'challenge', ['ігри', 'стани']),
  chapter('ch-26', 'reformulation-combination', 26, 'Переформулювання та комбінування алгоритмів', 'Змінюємо погляд на задачу, коли готового патерну не видно.', 'challenge', ['переформулювання', 'комбінація']),
];
