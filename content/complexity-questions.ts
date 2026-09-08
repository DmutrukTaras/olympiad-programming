import type { ComplexityOption, ComplexityQuestion } from '@/types/trainer';

const options = (...labels: string[]): ComplexityOption[] =>
  labels.map((label) => ({ id: label, label }));

const lines = (...source: string[]) => source.join('\n');

const question = ({
  optionLabels,
  ...item
}: Omit<ComplexityQuestion, 'options'> & {
  optionLabels: string[];
}): ComplexityQuestion => ({
  ...item,
  options: options(...optionLabels),
});

const codeQuestions: ComplexityQuestion[] = [
  question({
    id: 'constant-index-access',
    type: 'code',
    title: 'Один доступ',
    code: lines('int answer = a[k];', 'cout << answer;'),
    language: 'cpp',
    question: 'Яка часова складність цього коду?',
    optionLabels: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)', 'O(n log n)'],
    correctOptionId: 'O(1)',
    explanation:
      'Доступ до елемента vector або масиву за відомим індексом і один вивід не залежать від n.',
    reasoning: [
      'a[k] — O(1).',
      'Присвоєння та один cout — O(1).',
      'Сума сталої кількості операцій залишається O(1).',
    ],
    wrongAnswerNote:
      'Наявність масиву не означає, що алгоритм проходить усі його елементи.',
    difficulty: 'foundation',
    concept: 'сталі операції',
  }),
  question({
    id: 'single-linear-loop',
    type: 'code',
    title: 'Один прохід',
    code: lines(
      'long long sum = 0;',
      'for (int i = 0; i < n; ++i) {',
      '    sum += a[i];',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність цього коду?',
    optionLabels: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctOptionId: 'O(n)',
    explanation:
      'Цикл виконується n разів, а одна ітерація містить сталу кількість операцій.',
    reasoning: ['n ітерацій.', 'Кожна ітерація — O(1).', 'n · O(1) = O(n).'],
    wrongAnswerNote: 'Доступ a[i] за індексом не додає ще один множник n.',
    difficulty: 'foundation',
    concept: 'прості цикли',
  }),
  question({
    id: 'two-independent-loops',
    type: 'code',
    title: 'Два цикли поспіль',
    code: lines(
      'for (int i = 0; i < n; ++i) read(a[i]);',
      'for (int i = 0; i < n; ++i) print(a[i]);',
    ),
    language: 'pseudo',
    question: 'Яка часова складність цього коду?',
    optionLabels: ['O(1)', 'O(n)', 'O(2n)', 'O(n log n)', 'O(n²)'],
    correctOptionId: 'O(n)',
    explanation:
      'Незалежні послідовні цикли додаються: O(n) + O(n) = O(2n), а стала 2 у Big O відкидається.',
    reasoning: [
      'Перший цикл — O(n).',
      'Другий цикл — O(n).',
      'O(n + n) = O(n).',
    ],
    wrongAnswerNote:
      'O(n²) виникло б для вкладених циклів, а не для двох циклів один після одного.',
    difficulty: 'foundation',
    concept: 'послідовні операції',
  }),
  question({
    id: 'square-nested-loops',
    type: 'code',
    title: 'Усі пари',
    code: lines(
      'for (int i = 0; i < n; ++i) {',
      '    for (int j = 0; j < n; ++j) {',
      '        use(a[i], a[j]);',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність цього коду?',
    optionLabels: ['O(n)', 'O(2n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
    correctOptionId: 'O(n²)',
    explanation:
      'Для кожної з n ітерацій зовнішнього циклу внутрішній цикл виконує n ітерацій.',
    reasoning: [
      'Зовнішній цикл — n разів.',
      'Внутрішній — n разів для кожного i.',
      'n · n = n².',
    ],
    wrongAnswerNote:
      'Вкладені повні проходи множаться, бо внутрішній цикл починається заново для кожного i.',
    difficulty: 'foundation',
    concept: 'вкладені цикли',
  }),
  question({
    id: 'rectangular-nested-loops',
    type: 'code',
    title: 'Прямокутна таблиця',
    code: lines(
      'for (int i = 0; i < n; ++i) {',
      '    for (int j = 0; j < m; ++j) {',
      '        sum += grid[i][j];',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність цього коду?',
    optionLabels: ['O(n + m)', 'O(nm)', 'O(n²)', 'O(m²)', 'O(max(n, m))'],
    correctOptionId: 'O(nm)',
    explanation: 'Алгоритм відвідує кожну з n · m клітинок рівно один раз.',
    reasoning: [
      'n рядків.',
      'У кожному рядку m клітинок.',
      'Разом n · m операцій.',
    ],
    wrongAnswerNote:
      'Не можна замінювати два незалежні параметри на n², якщо умова не гарантує n = m.',
    difficulty: 'foundation',
    concept: 'кілька параметрів',
  }),
  question({
    id: 'doubling-loop',
    type: 'code',
    title: 'Подвоєння індексу',
    code: lines(
      'for (long long x = 1; x <= n; x *= 2) {',
      '    process(x);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність цього коду?',
    optionLabels: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctOptionId: 'O(log n)',
    explanation:
      'Після k ітерацій x = 2ᵏ. Цикл зупиниться, коли 2ᵏ стане більшим за n, тобто k ≈ log₂ n.',
    reasoning: [
      'Значення не збільшується на 1, а подвоюється.',
      'Кількість подвоєнь до n — log₂ n.',
    ],
    wrongAnswerNote:
      'Верхня межа n сама по собі не робить цикл лінійним: важливий крок зміни змінної.',
    difficulty: 'core',
    concept: 'логарифмічні цикли',
  }),
  question({
    id: 'linear-times-log',
    type: 'code',
    title: 'Подвоєння для кожного елемента',
    code: lines(
      'for (int i = 0; i < n; ++i) {',
      '    for (int x = 1; x < n; x *= 2) {',
      '        process(i, x);',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність цього коду?',
    optionLabels: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
    correctOptionId: 'O(n log n)',
    explanation:
      'Зовнішній цикл має n ітерацій, а внутрішній — приблизно log₂ n для кожного i.',
    reasoning: [
      'Зовнішній цикл — O(n).',
      'Внутрішній цикл — O(log n).',
      'Вкладені цикли дають O(n log n).',
    ],
    wrongAnswerNote: 'Внутрішній цикл не лінійний: x щоразу подвоюється.',
    difficulty: 'core',
    concept: 'композиція складностей',
  }),
  question({
    id: 'plain-sort',
    type: 'code',
    title: 'Сортування',
    code: 'sort(a.begin(), a.end());',
    language: 'cpp',
    question: 'Яка часова складність цієї операції для n елементів?',
    optionLabels: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctOptionId: 'O(n log n)',
    explanation:
      'Стандартне порівняльне sort у C++ має гарантовану асимптотичну складність O(n log n).',
    wrongAnswerNote:
      'Не плутай sort із одним проходом масиву або з квадратичним простим сортуванням.',
    difficulty: 'core',
    concept: 'сортування',
  }),
  question({
    id: 'sort-plus-scan',
    type: 'code',
    title: 'Сортування та прохід',
    code: lines(
      'sort(a.begin(), a.end());',
      'for (int i = 1; i < n; ++i) {',
      '    answer = min(answer, a[i] - a[i - 1]);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка загальна часова складність?',
    optionLabels: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)', 'O(n log² n)'],
    correctOptionId: 'O(n log n)',
    explanation:
      'Послідовні частини додаються: O(n log n) для sort і O(n) для проходу. Домінує O(n log n).',
    reasoning: [
      'sort → O(n log n).',
      'цикл → O(n).',
      'O(n log n + n) = O(n log n).',
    ],
    wrongAnswerNote:
      'Лінійний прохід після сортування не множиться на складність sort.',
    difficulty: 'core',
    concept: 'домінантний доданок',
  }),
  question({
    id: 'manual-binary-search',
    type: 'code',
    title: 'Ділення діапазону навпіл',
    code: lines(
      'int l = 0, r = n - 1;',
      'while (l <= r) {',
      '    int mid = l + (r - l) / 2;',
      '    if (a[mid] < x) l = mid + 1;',
      '    else r = mid - 1;',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність цього пошуку?',
    optionLabels: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctOptionId: 'O(log n)',
    explanation:
      'На кожній ітерації довжина активного відрізка зменшується приблизно вдвічі.',
    reasoning: [
      'Стартова довжина — n.',
      'Після k кроків залишається n / 2ᵏ.',
      'До довжини 1 потрібно O(log n) кроків.',
    ],
    wrongAnswerNote:
      'while не обов’язково означає O(n): подивись, наскільки швидко зменшується простір пошуку.',
    difficulty: 'core',
    concept: 'binary search',
  }),
  question({
    id: 'set-insertions',
    type: 'code',
    title: 'Вставки у set',
    code: lines(
      'set<int> values;',
      'for (int x : a) {',
      '    values.insert(x);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка складність для n елементів?',
    optionLabels: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
    correctOptionId: 'O(n log n)',
    explanation:
      'Одна вставка у std::set коштує O(log n), а виконується до n разів.',
    reasoning: [
      'До n вставок.',
      'Кожна вставка в збалансоване дерево — O(log n).',
      'Разом O(n log n).',
    ],
    wrongAnswerNote:
      'set не є hash-таблицею: його пошук і вставка логарифмічні.',
    difficulty: 'core',
    concept: 'set і map',
  }),
  question({
    id: 'unordered-frequency',
    type: 'code',
    title: 'Частоти в unordered_map',
    code: lines(
      'unordered_map<int, int> frequency;',
      'for (int x : a) {',
      '    ++frequency[x];',
      '}',
    ),
    language: 'cpp',
    question: 'Яка очікувана часова складність?',
    optionLabels: ['O(1)', 'O(log n)', 'O(n) expected', 'O(n log n)', 'O(n²)'],
    correctOptionId: 'O(n) expected',
    explanation:
      'Операція unordered_map у середньому очікувано O(1), тому n оновлень дають очікувано O(n).',
    reasoning: [
      'n звернень до hash-таблиці.',
      'Одне звернення очікувано O(1).',
      'Разом очікувано O(n).',
    ],
    wrongAnswerNote:
      'Це не безумовна гарантія: за невдалих колізій найгірший випадок може бути значно гіршим.',
    difficulty: 'core',
    concept: 'hash-таблиці',
  }),
  question({
    id: 'bfs-adjacency-list',
    type: 'code',
    title: 'BFS зі списками суміжності',
    code: lines(
      'queue<int> q;',
      'q.push(start);',
      'while (!q.empty()) {',
      '    int v = q.front(); q.pop();',
      '    for (int to : graph[v]) {',
      '        if (!used[to]) { used[to] = true; q.push(to); }',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка складність BFS для V вершин і E ребер?',
    optionLabels: ['O(V)', 'O(E)', 'O(V + E)', 'O(VE)', 'O(V²)'],
    correctOptionId: 'O(V + E)',
    explanation:
      'Кожна вершина потрапляє в чергу не більше одного разу, а кожне ребро переглядається сталу кількість разів.',
    reasoning: [
      'Робота з вершинами — O(V).',
      'Сумарна довжина списків суміжності — O(E).',
      'Разом O(V + E).',
    ],
    wrongAnswerNote:
      'Вкладений for не дає O(VE), бо списки різних вершин разом містять лише O(E) записів.',
    difficulty: 'combination',
    concept: 'graph complexity',
  }),
  question({
    id: 'dfs-adjacency-list',
    type: 'code',
    title: 'DFS',
    code: lines(
      'void dfs(int v) {',
      '    used[v] = true;',
      '    for (int to : graph[v])',
      '        if (!used[to]) dfs(to);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка складність повного DFS зі списками суміжності?',
    optionLabels: ['O(log V)', 'O(V)', 'O(E)', 'O(V + E)', 'O(VE)'],
    correctOptionId: 'O(V + E)',
    explanation:
      'Позначка used не дозволяє повторно обробляти вершини, а всі списки суміжності сумарно мають O(E) елементів.',
    wrongAnswerNote:
      'Рекурсія не множить автоматично V на E; рахуємо сумарну кількість унікальної роботи.',
    difficulty: 'combination',
    concept: 'graph complexity',
  }),
  question({
    id: 'dijkstra-priority-queue',
    type: 'code',
    title: 'Dijkstra з priority_queue',
    code: lines(
      'priority_queue<State, vector<State>, greater<State>> pq;',
      'while (!pq.empty()) {',
      '    auto [distV, v] = pq.top(); pq.pop();',
      '    if (distV != dist[v]) continue;',
      '    for (auto [to, w] : graph[v]) relax(v, to, w, pq);',
      '}',
    ),
    language: 'pseudo',
    question: 'Яка типова складність цієї реалізації?',
    optionLabels: [
      'O(V + E)',
      'O(V²)',
      'O(V log V)',
      'O((V + E) log V)',
      'O(VE)',
    ],
    correctOptionId: 'O((V + E) log V)',
    explanation:
      'Обхід графа дає O(V + E) подій, а операції з бінарною купою додають логарифмічний множник.',
    reasoning: [
      'Переглядаємо вершини та ребра.',
      'push/pop у priority_queue — O(log V) за звичною оцінкою.',
      'Разом O((V + E) log V).',
    ],
    wrongAnswerNote:
      'O(V + E) було б для BFS без ваг; priority_queue має не сталу вартість.',
    difficulty: 'combination',
    concept: 'graph complexity',
  }),
  question({
    id: 'kruskal-edge-sorting',
    type: 'code',
    title: 'Kruskal у простому графі',
    code: lines(
      'sort(edges.begin(), edges.end());',
      'for (Edge edge : edges) {',
      '    if (dsu.find(edge.u) != dsu.find(edge.v))',
      '        dsu.unite(edge.u, edge.v);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка типова складність для V вершин і E ребер?',
    optionLabels: ['O(V + E)', 'O(E log V)', 'O(V²)', 'O(VE)', 'O(2^V)'],
    correctOptionId: 'O(E log V)',
    explanation:
      'Сортування ребер коштує O(E log E). Для простого графа E ≤ V², тому log E = O(log V); DSU додає майже лінійну роботу.',
    reasoning: [
      'Сортування — O(E log E).',
      'У простому графі log E = O(log V).',
      'Операції DSU не домінують над сортуванням.',
    ],
    wrongAnswerNote:
      'Перегляд ребер майже лінійний, але перед ним потрібно відсортувати всі E ребер.',
    difficulty: 'combination',
    concept: 'graph complexity',
  }),
  question({
    id: 'fenwick-queries',
    type: 'code',
    title: 'Запити Fenwick Tree',
    code: lines(
      'for (int i = 0; i < q; ++i) {',
      '    if (type[i] == 1) fenwick.add(pos[i], delta[i]);',
      '    else answer(fenwick.sum(right[i]));',
      '}',
    ),
    language: 'pseudo',
    question: 'Яка складність q операцій після створення Fenwick Tree?',
    optionLabels: ['O(q)', 'O(log n)', 'O(q log n)', 'O(nq)', 'O(n log q)'],
    correctOptionId: 'O(q log n)',
    explanation:
      'І update, і prefix sum у Fenwick Tree змінюють індекс логарифмічно, тому одна операція — O(log n).',
    reasoning: [
      'Одна операція — O(log n).',
      'Операцій q.',
      'Разом O(q log n).',
    ],
    wrongAnswerNote:
      'Не плутай складність однієї операції зі складністю всієї послідовності запитів.',
    difficulty: 'combination',
    concept: 'структури даних',
  }),
  question({
    id: 'segment-tree-build-and-queries',
    type: 'code',
    title: 'Segment Tree: build і запити',
    code: lines(
      'SegmentTree tree(a);       // build',
      'for (int i = 0; i < q; ++i) {',
      '    tree.update(pos[i], value[i]);',
      '    cout << tree.query(l[i], r[i]);',
      '}',
    ),
    language: 'pseudo',
    question: 'Яка загальна складність?',
    optionLabels: [
      'O(n + q)',
      'O(n log n)',
      'O(q log n)',
      'O(n + q log n)',
      'O(nq)',
    ],
    correctOptionId: 'O(n + q log n)',
    explanation:
      'Класичний build займає O(n), а кожна пара update/query — O(log n); стала кількість операцій на запит не змінює Big O.',
    reasoning: [
      'Побудова — O(n).',
      'Кожен із q кроків — O(log n).',
      'Разом O(n + q log n).',
    ],
    wrongAnswerNote:
      'Не губи ні одноразову побудову, ні кількість q подальших операцій.',
    difficulty: 'combination',
    concept: 'структури даних',
  }),
  question({
    id: 'grid-dp',
    type: 'code',
    title: 'DP по таблиці',
    code: lines(
      'for (int i = 0; i < n; ++i) {',
      '    for (int j = 0; j < m; ++j) {',
      '        dp[i][j] = transition(i, j); // O(1)',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність DP?',
    optionLabels: ['O(n + m)', 'O(nm)', 'O(n²m)', 'O(2^n)', 'O(nm log n)'],
    correctOptionId: 'O(nm)',
    explanation: 'Є n · m станів, і кожен стан обчислюється за O(1).',
    reasoning: [
      'Кількість станів — n · m.',
      'Перехід — O(1).',
      'Загалом O(nm).',
    ],
    wrongAnswerNote:
      'Для DP треба множити кількість станів на вартість одного переходу.',
    difficulty: 'combination',
    concept: 'DP dimensions',
  }),
  question({
    id: 'enumerate-subsets',
    type: 'code',
    title: 'Усі підмножини',
    code: lines(
      'for (int mask = 0; mask < (1 << n); ++mask) {',
      '    process(mask); // O(1)',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність?',
    optionLabels: ['O(n)', 'O(n²)', 'O(2^n)', 'O(n · 2^n)', 'O(n!)'],
    correctOptionId: 'O(2^n)',
    explanation:
      'n бітів утворюють рівно 2ⁿ різних масок, і кожна обробляється за O(1).',
    wrongAnswerNote:
      'Не додавай множник n, якщо process(mask) не проходить усі біти.',
    difficulty: 'advanced',
    concept: 'subset enumeration',
  }),
  question({
    id: 'masks-times-bits',
    type: 'code',
    title: 'Маски та всі біти',
    code: lines(
      'for (int mask = 0; mask < (1 << n); ++mask) {',
      '    for (int bit = 0; bit < n; ++bit) {',
      '        if (mask & (1 << bit)) use(bit);',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність?',
    optionLabels: ['O(2^n)', 'O(n · 2^n)', 'O(n²)', 'O(3^n)', 'O(n!)'],
    correctOptionId: 'O(n · 2^n)',
    explanation: 'Для кожної з 2ⁿ масок код перевіряє всі n позицій бітів.',
    reasoning: ['Масок — 2ⁿ.', 'На маску — n перевірок.', 'Разом O(n · 2ⁿ).'],
    wrongAnswerNote:
      'Внутрішній цикл додає множник n навіть тоді, коли встановлених бітів мало.',
    difficulty: 'advanced',
    concept: 'subset enumeration',
  }),
  question({
    id: 'all-submasks',
    type: 'code',
    title: 'Усі підмаски всіх масок',
    code: lines(
      'for (int mask = 0; mask < (1 << n); ++mask) {',
      '    for (int sub = mask; sub; sub = (sub - 1) & mask) {',
      '        process(mask, sub);',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка сумарна часова складність?',
    optionLabels: ['O(2^n)', 'O(n · 2^n)', 'O(3^n)', 'O(4^n)', 'O(n!)'],
    correctOptionId: 'O(3^n)',
    explanation:
      'Для кожного біта є три сумарні стани: не входить у mask, входить лише в mask або входить і в sub. Тому пар (mask, sub) — 3ⁿ.',
    wrongAnswerNote:
      'Не можна оцінювати лише кількість mask: число підмасок залежить від кількості встановлених бітів.',
    difficulty: 'advanced',
    concept: 'submask enumeration',
  }),
  question({
    id: 'two-pointers-monotone-left',
    type: 'code',
    title: 'Вкладений while, але не квадрат',
    code: lines(
      'int l = 0;',
      'for (int r = 0; r < n; ++r) {',
      '    add(a[r]);',
      '    while (!valid()) {',
      '        remove(a[l]);',
      '        ++l;',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка сумарна часова складність, якщо add/remove/valid — O(1)?',
    optionLabels: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
    correctOptionId: 'O(n)',
    explanation:
      'r рухається n разів, а l за всю роботу також лише збільшується від 0 до n. Внутрішній while сумарно має не більше n ітерацій.',
    reasoning: [
      'r проходить масив один раз.',
      'l ніколи не повертається назад.',
      'Сумарно обидва вказівники роблять O(n) кроків.',
    ],
    wrongAnswerNote:
      'Синтаксична вкладеність не гарантує O(n²). Рахуй сумарний рух монотонного вказівника.',
    feedbackByOptionId: {
      'O(n²)':
        'Це головна пастка: while не запускає n нових кроків для кожного r — l має спільний ліміт n на всю програму.',
    },
    difficulty: 'challenge',
    concept: 'amortized complexity',
  }),
  question({
    id: 'sliding-window-frequency',
    type: 'code',
    title: 'Sliding Window',
    code: lines(
      'int l = 0;',
      'for (int r = 0; r < n; ++r) {',
      '    ++freq[a[r]];',
      '    while (badKinds > k) --freq[a[l++]];',
      '    answer = max(answer, r - l + 1);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка амортизована часова складність?',
    optionLabels: ['O(n)', 'O(n log n)', 'O(n²)', 'O(k n)', 'O(2^n)'],
    correctOptionId: 'O(n)',
    explanation:
      'Кожен елемент один раз входить у вікно через r і не більше одного разу виходить через l.',
    wrongAnswerNote:
      'Сумарна кількість ітерацій while обмежена n, якщо l лише збільшується.',
    difficulty: 'core',
    concept: 'amortized complexity',
  }),
  question({
    id: 'monotonic-stack',
    type: 'code',
    title: 'Monotonic Stack',
    code: lines(
      'for (int i = 0; i < n; ++i) {',
      '    while (!st.empty() && a[st.top()] <= a[i]) st.pop();',
      '    st.push(i);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка амортизована часова складність?',
    optionLabels: [
      'O(log n)',
      'O(n) amortized',
      'O(n log n)',
      'O(n²)',
      'O(2^n)',
    ],
    correctOptionId: 'O(n) amortized',
    explanation:
      'Кожен індекс додається в стек один раз і може бути видалений зі стека не більше одного разу.',
    reasoning: [
      'push виконується n разів.',
      'Кожен елемент має щонайбільше один pop.',
      'Разом O(n) стекових операцій.',
    ],
    wrongAnswerNote:
      'Хоча while вкладений у for, один і той самий елемент не можна видалити зі стека двічі.',
    difficulty: 'challenge',
    concept: 'amortized complexity',
  }),
  question({
    id: 'monotonic-queue',
    type: 'code',
    title: 'Монотонна черга',
    code: lines(
      'for (int i = 0; i < n; ++i) {',
      '    while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();',
      '    dq.push_back(i);',
      '    if (dq.front() <= i - k) dq.pop_front();',
      '}',
    ),
    language: 'cpp',
    question: 'Яка амортизована складність для всього масиву?',
    optionLabels: ['O(k)', 'O(n) amortized', 'O(n log n)', 'O(nk)', 'O(n²)'],
    correctOptionId: 'O(n) amortized',
    explanation:
      'Індекс входить у deque один раз і видаляється не більше одного разу з кожного релевантного боку.',
    wrongAnswerNote:
      'Розмір вікна k не множить n: черга не перебудовується з нуля для кожного вікна.',
    difficulty: 'challenge',
    concept: 'amortized complexity',
  }),
  question({
    id: 'triangular-pairs',
    type: 'code',
    title: 'Трикутний перебір',
    code: lines(
      'for (int i = 0; i < n; ++i) {',
      '    for (int j = i + 1; j < n; ++j) {',
      '        check(a[i], a[j]);',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність?',
    optionLabels: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2^n)'],
    correctOptionId: 'O(n²)',
    explanation:
      'Кількість пар дорівнює n(n−1)/2. Сталий множник 1/2 не змінює O(n²).',
    wrongAnswerNote:
      'Те, що внутрішній цикл стає коротшим, змінює константу, але не порядок росту.',
    difficulty: 'foundation',
    concept: 'вкладені цикли',
  }),
  question({
    id: 'recursive-halving',
    type: 'code',
    title: 'Рекурсивне ділення навпіл',
    code: lines(
      'void solve(long long n) {',
      '    if (n <= 1) return;',
      '    work();',
      '    solve(n / 2);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність, якщо work() — O(1)?',
    optionLabels: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(2^n)'],
    correctOptionId: 'O(log n)',
    explanation:
      'Глибина рекурсії дорівнює кількості ділень n навпіл до 1 — O(log n).',
    wrongAnswerNote:
      'Тут лише один рекурсивний виклик на рівень, тому дерево викликів не розгалужується.',
    difficulty: 'core',
    concept: 'рекурсія',
  }),
  question({
    id: 'priority-queue-all-elements',
    type: 'code',
    title: 'Усі елементи через купу',
    code: lines(
      'priority_queue<int> pq;',
      'for (int x : a) pq.push(x);',
      'while (!pq.empty()) {',
      '    pq.pop();',
      '}',
    ),
    language: 'cpp',
    question: 'Яка загальна часова складність?',
    optionLabels: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
    correctOptionId: 'O(n log n)',
    explanation:
      'Є n вставок і n видалень; кожна така операція priority_queue коштує O(log n).',
    wrongAnswerNote:
      'top() має O(1), але push() і pop() відновлюють властивість купи за O(log n).',
    difficulty: 'core',
    concept: 'priority queue',
  }),
  question({
    id: 'adjacency-matrix-scan',
    type: 'code',
    title: 'Обхід матриці суміжності',
    code: lines(
      'for (int v = 0; v < V; ++v) {',
      '    for (int to = 0; to < V; ++to) {',
      '        if (adj[v][to]) inspect(v, to);',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка часова складність незалежно від кількості E ребер?',
    optionLabels: ['O(V)', 'O(E)', 'O(V + E)', 'O(V²)', 'O(VE)'],
    correctOptionId: 'O(V²)',
    explanation:
      'Код перевіряє всі V² клітинки матриці, навіть якщо ребер у графі дуже мало.',
    wrongAnswerNote:
      'Оцінка O(V + E) властива обходу списків суміжності, а не повної матриці.',
    difficulty: 'combination',
    concept: 'graph complexity',
  }),
  question({
    id: 'sort-each-query',
    type: 'code',
    title: 'Сортування для кожного запиту',
    code: lines(
      'for (int query = 0; query < q; ++query) {',
      '    vector<int> copy = a;      // n elements',
      '    sort(copy.begin(), copy.end());',
      '    answer(copy);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка складність за n та q?',
    optionLabels: [
      'O(n log n)',
      'O(q + n log n)',
      'O(qn)',
      'O(qn log n)',
      'O(n^q)',
    ],
    correctOptionId: 'O(qn log n)',
    explanation:
      'Кожен із q запитів заново копіює O(n) елементів і сортує їх за O(n log n); сортування домінує.',
    reasoning: [
      'Один запит — O(n + n log n) = O(n log n).',
      'Запитів q.',
      'Разом O(qn log n).',
    ],
    wrongAnswerNote:
      'Якщо дорога операція справді виконується всередині циклу q разів, складності множаться.',
    difficulty: 'challenge',
    concept: 'кілька параметрів',
  }),
  question({
    id: 'map-query-loop',
    type: 'code',
    title: 'Пошуки у map',
    code: lines(
      'map<int, int> value;',
      '// map already contains n keys',
      'for (int i = 0; i < q; ++i) {',
      '    auto it = value.find(key[i]);',
      '}',
    ),
    language: 'cpp',
    question: 'Яка складність q пошуків?',
    optionLabels: ['O(q)', 'O(log n)', 'O(q log n)', 'O(nq)', 'O(q²)'],
    correctOptionId: 'O(q log n)',
    explanation:
      'std::map — збалансоване дерево: find займає O(log n), а викликів q.',
    wrongAnswerNote:
      'Кількість елементів структури n визначає ціну одного пошуку, а q — кількість пошуків.',
    difficulty: 'core',
    concept: 'set і map',
  }),
  question({
    id: 'harmonic-inner-loop',
    type: 'code',
    title: 'Гармонічна сума',
    code: lines(
      'for (int step = 1; step <= n; ++step) {',
      '    for (int j = step; j <= n; j += step) {',
      '        process(j);',
      '    }',
      '}',
    ),
    language: 'cpp',
    question: 'Яка сумарна часова складність?',
    optionLabels: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n√n)', 'O(2^n)'],
    correctOptionId: 'O(n log n)',
    explanation:
      'Для step = k внутрішній цикл має приблизно n/k ітерацій. Сума n(1 + 1/2 + … + 1/n) дорівнює O(n log n).',
    wrongAnswerNote:
      'Межі двох вкладених циклів залежать одна від одної, тому груба оцінка n · n не є точною.',
    difficulty: 'challenge',
    concept: 'амортизовані суми',
  }),
];

const constraintQuestions: ComplexityQuestion[] = [
  question({
    id: 'constraints-n-10',
    type: 'constraints',
    title: 'Дуже мале n',
    constraints: ['n ≤ 10', 'Time limit: 2 seconds'],
    question:
      'Яку найповільнішу з наведених складностей ще варто перевірити як реалістичний кандидат?',
    optionLabels: ['O(n)', 'O(n²)', 'O(2^n)', 'O(n!)', 'O(n^n)'],
    correctOptionId: 'O(n!)',
    explanation:
      'Для n ≤ 10 перебір перестановок часто можливий: 10! ≈ 3.6 мільйона. Це орієнтир, а не гарантія.',
    wrongAnswerNote:
      'Мале n може дозволити значно повільніший алгоритм, але константи й робота на одну перестановку все одно важливі.',
    difficulty: 'foundation',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-n-20',
    type: 'constraints',
    title: 'Підмножини',
    constraints: ['n ≤ 20', 'Time limit: 2 seconds'],
    question: 'Який підхід виглядає типовим реалістичним орієнтиром?',
    optionLabels: ['O(n!)', 'O(3^n)', 'O(2^n)', 'O(n³)', 'O(log n) only'],
    correctOptionId: 'O(2^n)',
    explanation:
      '2²⁰ — приблизно мільйон станів, тому перебір підмножин часто реалістичний. Точний час залежить від переходу.',
    wrongAnswerNote:
      'n! уже надто швидко росте, а вимога лише O(log n) була б невиправдано суворою.',
    difficulty: 'advanced',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-n-40',
    type: 'constraints',
    title: 'Meet in the Middle',
    constraints: ['n ≤ 40', 'Time limit: 2 seconds'],
    question: 'Яку експоненційну складність варто перевірити першою?',
    optionLabels: ['O(2^n)', 'O(2^(n/2))', 'O(n!)', 'O(n³)', 'O(n² log n)'],
    correctOptionId: 'O(2^(n/2))',
    explanation:
      '2⁴⁰ зазвичай завелике, але поділ множини навпіл дає близько 2²⁰ станів на частину — типовий сигнал Meet in the Middle.',
    wrongAnswerNote:
      'Це не автоматична відповідь для будь-якої задачі з n = 40; структура має дозволяти поєднати дві половини.',
    difficulty: 'advanced',
    concept: 'Meet in the Middle',
  }),
  question({
    id: 'constraints-n-500',
    type: 'constraints',
    title: 'Кубічна межа',
    constraints: ['n ≤ 500', 'Time limit: 3 seconds'],
    question: 'Яку складність іноді ще можна розглядати за простих операцій?',
    optionLabels: ['O(n!)', 'O(2^n)', 'O(n⁴)', 'O(n³)', 'O(n^5)'],
    correctOptionId: 'O(n³)',
    explanation:
      '500³ = 125 мільйонів простих кроків. O(n³) іноді можливе, але дуже залежить від мови, констант і тіла циклу.',
    wrongAnswerNote:
      'Слово «іноді» важливе: складні операції або жорсткий limit можуть зробити навіть цю оцінку непридатною.',
    difficulty: 'combination',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-n-2000',
    type: 'constraints',
    title: 'Квадратична межа',
    constraints: ['n ≤ 2000', 'Time limit: 2 seconds'],
    question: 'Яка складність часто є реалістичним орієнтиром?',
    optionLabels: ['O(2^n)', 'O(n³)', 'O(n²)', 'O(n!)', 'O(n^4)'],
    correctOptionId: 'O(n²)',
    explanation:
      'n² — близько 4 мільйонів ітерацій, тому квадратичний алгоритм часто прийнятний. Реальна ціна однієї ітерації має значення.',
    wrongAnswerNote:
      'O(n³) для 2000 означає близько 8 мільярдів кроків і зазвичай уже нереалістичне.',
    difficulty: 'foundation',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-n-200000',
    type: 'constraints',
    title: 'Типовий великий масив',
    constraints: ['n ≤ 200000', 'Time limit: 2 seconds'],
    question: 'Яку складність ти б вважав типовим реалістичним орієнтиром?',
    optionLabels: ['O(n!)', 'O(2^n)', 'O(n²)', 'O(n log n)', 'O(n³)'],
    correctOptionId: 'O(n log n)',
    explanation:
      'Для n ≈ 2·10⁵ квадратичне рішення зазвичай занадто повільне. O(n) або O(n log n) — типовий орієнтир.',
    wrongAnswerNote:
      'Це не абсолютна гарантія: час залежить від констант, мови, операцій і кількості test cases.',
    difficulty: 'core',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-n-1000000',
    type: 'constraints',
    title: 'Мільйон елементів',
    constraints: ['n ≤ 1000000', 'Time limit: 1 second'],
    question: 'Який орієнтир найобережніше перевірити першим?',
    optionLabels: ['O(n)', 'O(n log² n)', 'O(n²)', 'O(2^n)', 'O(n³)'],
    correctOptionId: 'O(n)',
    explanation:
      'Для мільйона елементів за короткого limit зазвичай шукають один або кілька лінійних проходів.',
    wrongAnswerNote:
      'Навіть O(n log n) іноді проходить, але запропонований O(n) є безпечнішим типовим орієнтиром серед варіантів.',
    difficulty: 'core',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-n-1e18',
    type: 'constraints',
    title: 'Величезне числове n',
    constraints: ['n ≤ 10^18', 'Time limit: 2 seconds'],
    question: 'Яка залежність від n виглядає реалістичною?',
    optionLabels: ['O(n)', 'O(√n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
    correctOptionId: 'O(log n)',
    explanation:
      'Лінійно пройти до 10¹⁸ неможливо. Часто потрібні ділення навпіл, binary exponentiation або інша логарифмічна модель.',
    wrongAnswerNote:
      'Навіть O(√n) — близько 10⁹ кроків — зазвичай надто багато.',
    difficulty: 'advanced',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-sum-n',
    type: 'constraints',
    title: 'Багато test cases',
    constraints: ['T ≤ 10000', 'sum(n) ≤ 200000', 'Time limit: 2 seconds'],
    question: 'Яку сумарну складність варто оцінювати для всього input?',
    optionLabels: [
      'O(T · n²)',
      'O(T!)',
      'O(sum(n) log sum(n))',
      'O(2^sum(n))',
      'O(n^T)',
    ],
    correctOptionId: 'O(sum(n) log sum(n))',
    explanation:
      'Важлива сумарна довжина всіх тестів. Алгоритм O(n log n) на кожен тест вкладається в типовий орієнтир O(sum(n) log sum(n)).',
    wrongAnswerNote:
      'Не множ T на максимальне n, якщо умова окремо обмежує sum(n).',
    difficulty: 'core',
    concept: 'constraints',
  }),
  question({
    id: 'constraints-sparse-graph',
    type: 'constraints',
    title: 'Великий розріджений граф',
    constraints: ['V ≤ 200000', 'E ≤ 200000', 'Time limit: 2 seconds'],
    question: 'Який обхід графа виглядає природним реалістичним орієнтиром?',
    optionLabels: ['O(V!)', 'O(V²)', 'O(VE)', 'O(V + E)', 'O(2^V)'],
    correctOptionId: 'O(V + E)',
    explanation:
      'Для розрідженого графа зі списками суміжності DFS або BFS обробляє вершини та ребра за O(V + E).',
    wrongAnswerNote:
      'Матриця O(V²) тут була б і повільною, і надто великою за пам’яттю.',
    difficulty: 'combination',
    concept: 'graph complexity',
  }),
];

export const complexityQuestions: ComplexityQuestion[] = [
  ...codeQuestions,
  ...constraintQuestions,
];
