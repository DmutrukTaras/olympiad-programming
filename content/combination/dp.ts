import {
  code,
  cpp,
  example,
  learning,
  note,
  p,
  pattern,
  practice,
  table,
  visual,
} from '@/content/combination/helpers';

export const dpPatterns = [
  pattern({
    id: 'sequence-dp',
    chapterId: 'ch-16',
    title: 'State / Transition / Sequence DP',
    description:
      'Стискаємо всю історію до невеликого стану й системно визначаємо transition, base cases, порядок обчислення та фінальну відповідь.',
    intuition: [
      p(
        'Не починай із формули. Спершу напиши речення: “dp[i] — мінімальна вартість дістатися до позиції i”. Тоді останній крок природно перелічує попередні стани.',
      ),
      table(
        ['Крок', 'Контрольне питання'],
        [
          ['State', 'Що точно означає dp[...]?'],
          ['Transition', 'З яких менших станів приходимо?'],
          ['Base', 'Які найменші стани відомі без формули?'],
          ['Order', 'Чи всі залежності вже обчислені?'],
          ['Answer', 'У якому стані лежить результат?'],
        ],
      ),
    ],
    modeling: [
      p(
        'Brute force дерево рішень часто повторює одну й ту саму підзадачу з однаковою позицією. DP об’єднує всі історії, які мають однакову важливу для майбутнього інформацію.',
      ),
      note(
        'Стиснення історії',
        'Стан має містити все, що впливає на наступні кроки, але нічого зайвого. Якщо дві історії з однаковим dp-index можуть мати різні дозволені продовження, стан неповний.',
      ),
    ],
    priorKnowledge: [
      'Foundation → масиви й оцінка складності',
      'Core → minimum/maximum',
      'Нове → state і transition',
    ],
    recognitionSigns: [
      'Багато різних шляхів приходять в однаковий стан.',
      'Рекурсивний brute force повторює ті самі підзадачі.',
      'Майбутнє залежить від невеликої частини минулого.',
    ],
    constraintSignals: [
      'Кількість станів × переходів має вкладатися в limit.',
      'Для n ≤ 200000 типове 1D DP O(n) або O(n log n).',
      'Значення optimum може потребувати long long; counting — modulo.',
    ],
    notApplicableSigns: [
      'Стан не має ациклічного порядку й утворює довільні цикли.',
      'Greedy-вибір можна довести без збереження всіх станів.',
      'Розмірність state дає занадто багато комбінацій.',
    ],
    knowledge: [
      p(
        'Top-down memoization обчислює лише потрібні стани рекурсивно. Bottom-up tabulation іде у відомому порядку й часто краще контролює stack та пам’ять.',
      ),
      table(
        ['Підхід', 'Перевага / ризик'],
        [
          ['Memoization', 'ближче до recurrence; ризик recursion depth'],
          ['Bottom-up', 'явний order, простіше оптимізувати пам’ять'],
          ['Rolling array', 'зберігаємо лише попередні шари'],
          ['Parent array', 'відновлюємо саме рішення'],
        ],
      ),
      note(
        'Недосяжні стани',
        'Для minimum ініціалізуй INF, для maximum — −INF, для counting — 0. Не виконуй arithmetic із недосяжного стану.',
      ),
    ],
    cppNotes: [
      code(
        'const long long INF = 4e18;\nvector<long long> dp(n, INF);\ndp[0] = 0;\nfor (int i = 1; i < n; ++i) {\n    dp[i] = min(dp[i], dp[i - 1] + cost(i - 1, i));\n    if (i >= 2) dp[i] = min(dp[i], dp[i - 2] + cost(i - 2, i));\n}',
        'Bottom-up sequence DP',
      ),
      note(
        'abs і типи',
        'Для long long використовуй llabs або std::abs з long long аргументами. Різницю краще обчислювати вже в long long.',
      ),
    ],
    theory: [
      p(
        'Коректність sequence DP доводиться індукцією за i. Будь-яке рішення для i має останній перехід із дозволеного predecessor; до нього оптимально використовувати dp[predecessor], інакше весь шлях можна покращити.',
      ),
      note(
        'DP — не формула, а п’ять рішень',
        'Навіть правильний transition не допоможе без точного state, base cases, order та answer. Записуй усі п’ять до коду.',
      ),
    ],
    extensions: [
      {
        title: 'Kadane та LIS як різні продовження Sequence DP',
        blocks: [
          p(
            'Kadane: dp[i] — найкраща сума підмасиву, що закінчується в i; dp[i] = max(a[i], dp[i−1]+a[i]). Це DP зі стисненням пам’яті до однієї змінної.',
          ),
          p(
            'LIS починається з O(n²): dp[i] — довжина LIS, що закінчується в i. O(n log n) версія змінює модель: tails[len] зберігає найменший можливий останній елемент і використовує lower_bound.',
          ),
          note(
            'Одна ціль — різні моделі',
            'Оптимізація DP часто приходить не з “швидшого циклу”, а з нового значення стану.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'knapsack-counting-dp',
    chapterId: 'ch-16',
    title: 'Knapsack та Counting DP',
    description:
      'Моделюємо вибір предметів через ресурсний стан dp[w] і змінюємо значення стану залежно від цілі: optimum, можливість або кількість способів.',
    intuition: [
      p(
        'У 0/1 Knapsack після обробки предметів майбутньому не важливо, які саме попередні предмети дали вагу w — достатньо найкращої value для цього w.',
      ),
      table(
        ['Значення dp[s]', 'Тип задачі'],
        [
          ['maximum value', 'optimization'],
          ['true/false', 'Subset Sum / feasibility'],
          ['number of ways', 'Counting DP'],
          ['minimum items', 'minimum DP з INF'],
        ],
      ),
    ],
    modeling: [
      p(
        'Повний стан dp[i][w] означає відповідь після перших i предметів. Оскільки шар i залежить лише від i−1, вимір i можна стиснути — але порядок w стає частиною correctness.',
      ),
      note(
        '0/1 чи unbounded',
        'Кожен предмет максимум раз → w справа наліво. Предмет можна брати необмежено → w зліва направо. Один напрямок циклу змінює математичну модель.',
      ),
    ],
    priorKnowledge: [
      'Foundation → subsets і complexity',
      'Core → take/skip choice',
      'Нове → resource state compression',
    ],
    recognitionSigns: [
      'Є предмети/монети та обмежений ресурс: вага, сума, час.',
      'Для кожного об’єкта є вибір take або skip.',
      'Потрібно оптимізувати, перевірити можливість або порахувати способи.',
    ],
    constraintSignals: [
      'Pseudo-polynomial O(nW) залежить від числового W, не лише від довжини вводу.',
      'W ≤ 100000 може бути допустимим; W до 10⁹ — зазвичай ні.',
      'Counting майже завжди потребує modulo або big integers.',
    ],
    notApplicableSigns: [
      'Resource W надто великий для масиву.',
      'Є дробові предмети — fractional knapsack має greedy-рішення.',
      'Вибір залежить від порядку/сусідства, якого state w не зберігає.',
    ],
    knowledge: [
      p(
        'Перехід 0/1: dp[w] = max(dp[w], dp[w−weight]+value). Рух справа наліво гарантує, що dp[w−weight] ще належить попередньому шару, тобто поточний предмет не використано двічі.',
      ),
      table(
        ['Варіант', 'Ініціалізація й напрямок'],
        [
          ['Max value, capacity ≤ W', 'dp=0, w вниз'],
          ['Exact sum possible', 'dp[0]=true, w вниз'],
          ['Unlimited coins ways', 'dp[0]=1, для монети s вгору'],
          ['0/1 counting', 'для предмета s вниз'],
        ],
      ),
      note(
        'Порядок предметів у counting',
        'Щоб рахувати комбінації монет без урахування порядку, зовнішній цикл іде по номіналах. Якщо зовнішній цикл по сумі, рахуються послідовності.',
      ),
    ],
    cppNotes: [
      code(
        'vector<long long> dp(W + 1, 0);\nfor (auto [weight, value] : items) {\n    for (int w = W; w >= weight; --w) {\n        dp[w] = max(dp[w], dp[w - weight] + value);\n    }\n}',
        '0/1 Knapsack зі стисненням шару',
      ),
      code(
        'vector<char> possible(S + 1);\npossible[0] = true;\nfor (int x : values)\n    for (int s = S; s >= x; --s)\n        possible[s] = possible[s] || possible[s - x];',
        '0/1 Subset Sum',
      ),
    ],
    theory: [
      p(
        'Після обробки перших i предметів dp[w] дорівнює найкращій value серед їх підмножин допустимої ваги. Перехід розділяє всі підмножини на ті, що не беруть i, і ті, що беруть його плюс оптимум для залишкового ресурсу.',
      ),
      note(
        'Reconstruction',
        'Щоб відновити предмети, зберігай choice/parent або повну 2D таблицю. Стиснення пам’яті часто стирає інформацію про шлях до optimum.',
      ),
    ],
    extensions: [
      {
        title: 'Reconstruction і варіанти рюкзака',
        blocks: [
          table(
            ['Варіант', 'Зміна'],
            [
              ['0/1', 'вага вниз'],
              ['Unbounded', 'вага вгору'],
              ['Bounded count', 'binary splitting або інші оптимізації'],
              ['Reconstruction', 'parent/choice для станів'],
            ],
          ),
          note(
            'Спершу напиши модель',
            'Не копіюй напрямок циклу з пам’яті: виведи, чи може transition бачити вже оновлений поточним предметом стан.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'multidimensional-dp',
    chapterId: 'ch-16',
    title: 'Grid / String / Tree / DAG DP',
    description:
      'Переносимо п’ять питань DP на дві координати або структуру, де правильний порядок задають grid, дві послідовності, DFS чи topological sort.',
    intuition: [
      p(
        'У grid state (i,j) описує позицію. У LCS — два префікси. У tree — вершину та її subtree. У DAG — вершину після всіх predecessors. Розмірність має походити з інформації, потрібної майбутньому.',
      ),
      visual('dp-grid'),
    ],
    modeling: [
      table(
        ['Структура', 'State', 'Order'],
        [
          ['Grid', 'dp[i][j]', 'рядки/стовпці за напрямками руху'],
          ['Два рядки', 'dp[i][j] для префіксів', 'зростання i,j'],
          ['Tree', 'dp[v][state]', 'postorder DFS'],
          ['DAG', 'dp[v]', 'topological order'],
          ['Interval', 'dp[l][r]', 'за зростанням довжини'],
        ],
      ),
      note(
        'Структура визначає order',
        'DP коректний лише якщо всі states у правій частині transition вже готові. DFS і topological sort часто потрібні саме для створення такого порядку.',
      ),
    ],
    priorKnowledge: [
      'Foundation → grid і strings',
      'Graphs/Trees → DFS і topological order',
      'Нове → multidimensional state',
    ],
    recognitionSigns: [
      'Стан природно має дві координати або пару префіксів.',
      'Відповідь для структури складається з дітей/predecessors.',
      'Потрібно узгодити вибори у двох послідовностях.',
    ],
    constraintSignals: [
      '2D table n·m має вкладатися і в час, і в пам’ять.',
      'n,m ≤ 5000 уже дають 25 млн states.',
      'Tree/DAG DP часто O(V+E) помножене на кількість локальних станів.',
    ],
    notApplicableSigns: [
      'Dependencies містять цикл без іншої інтерпретації стану.',
      '2D state занадто великий; можлива оптимізація пам’яті або інший алгоритм.',
      'Transition пропускає інформацію, що впливає на майбутні дозволи.',
    ],
    knowledge: [
      p(
        'Для 2D DP спершу намалюй dependency arrows. Base cases часто зручно реалізувати додатковим нульовим рядком/стовпцем або INF-рамкою.',
      ),
      table(
        ['Перевірка', 'Питання'],
        [
          [
            'State completeness',
            'Чи однаковий state має однакові майбутні можливості?',
          ],
          ['Transition coverage', 'Чи розглянуто всі можливі останні кроки?'],
          ['No double count', 'Чи один об’єкт не потрапляє в кілька випадків?'],
          ['Memory', 'Чи потрібна вся таблиця для answer/reconstruction?'],
        ],
      ),
    ],
    cppNotes: [
      code(
        'vector<vector<long long>> dp(n, vector<long long>(m, INF));\ndp[0][0] = cost[0][0];\nfor (int i = 0; i < n; ++i) for (int j = 0; j < m; ++j) {\n    if (i) dp[i][j] = min(dp[i][j], dp[i - 1][j] + cost[i][j]);\n    if (j) dp[i][j] = min(dp[i][j], dp[i][j - 1] + cost[i][j]);\n}',
        'Grid DP без виходу за межі',
      ),
      note(
        'Overflow з INF',
        'Не додавай cost до INF без перевірки. Обирай INF із запасом і перевіряй досяжність predecessor.',
      ),
    ],
    theory: [
      p(
        'Для grid кожен шлях у (i,j) має останній крок згори або зліва, тому minimum цих двох оптимумів покриває всі можливості. Для tree/DAG та сама логіка працює, коли structural order гарантує готовність predecessors.',
      ),
      note(
        'Доведення transition',
        'Розбий усі допустимі рішення за їх останнім рішенням або структурною частиною. Випадки мають бути повними, а їх підзадачі — оптимальними.',
      ),
    ],
    extensions: [
      {
        title: 'LCS, Tree DP, DAG DP та Interval DP',
        blocks: [
          p(
            'LCS: dp[i][j] — довжина longest common subsequence перших i та j символів. Tree DP рахує дітей перед батьком; DAG DP — predecessors перед successors.',
          ),
          p(
            'Interval DP має state dp[l][r] і зазвичай рахується за зростанням довжини. Transition часто вибирає перший/останній крок або точку розбиття k.',
          ),
          note(
            'Не все одразу',
            'Ці моделі об’єднує спосіб конструювання state/order, але transitions завжди залежать від конкретної задачі.',
          ),
        ],
      },
    ],
  }),
];

export const dpTasks = [
  learning('sequence-dp', {
    id: 'frog-jumps',
    title: 'Стрибки',
    statement: [
      'Є n платформ із висотами h[i]. З i можна стрибнути на i+1 або i+2, вартість — |h[i]−h[j]|. Знайди мінімальну вартість потрапити з 1 на n.',
    ],
    input: 'n і n висот.',
    output: 'Мінімальна вартість.',
    constraints: ['2 ≤ n ≤ 200000', '|h[i]| ≤ 10⁹'],
    examples: [example('4\n10 30 40 20', '30')],
    tryYourself:
      'Сформулюй dp[i] одним реченням і переліч усі можливі останні стрибки.',
    hint: 'Останній крок у i приходить лише з i−1 або i−2.',
    firstApproach: [
      p('Рекурсивно пробувати обидва стрибки з кожної платформи.'),
    ],
    approachReview:
      'Дерево має експоненційно багато шляхів і повторно обчислює найкращий шлях до однакової платформи.',
    observation: [
      p(
        'Для майбутнього не важливий повний маршрут — достатньо мінімальної вартості до поточної позиції.',
      ),
    ],
    algorithm: [
      'dp[0]=0.',
      'Для i від 1 обчисли варіант із i−1.',
      'Якщо i≥2, порівняй варіант із i−2.',
      'Відповідь dp[n−1].',
    ],
    proof:
      'Будь-який шлях до i завершується одним із двох дозволених стрибків. До predecessor оптимально використати dp, інакше заміна покращила б увесь шлях. Індукція за i доводить усі states.',
    complexity: 'O(n) часу й O(n) пам’яті; можна стиснути до O(1).',
    solution: cpp(
      `    int n;cin>>n;vector<long long> h(n),dp(n);for(auto&x:h)cin>>x;\n    dp[0]=0;\n    for(int i=1;i<n;++i){\n        dp[i]=dp[i-1]+abs(h[i]-h[i-1]);\n        if(i>=2) dp[i]=min(dp[i],dp[i-2]+abs(h[i]-h[i-2]));\n    }\n    cout<<dp[n-1]<<'\n';`,
    ),
    takeaway:
      'State реченням → усі можливі останні кроки → base/order/answer. Це надійніша процедура за запам’ятовування формули.',
  }),
  practice('sequence-dp', {
    id: 'stair-ways',
    title: 'Сходинки',
    statement: [
      'На сходинку i можна прийти з i−1 або i−2. Порахуй кількість способів дістатися сходинки n modulo 1e9+7.',
    ],
    input: 'n.',
    output: 'Кількість способів.',
    constraints: ['0 ≤ n ≤ 200000'],
    examples: [example('4', '5')],
    hint: 'dp[i] = dp[i−1] + dp[i−2]. Окремо визнач dp[0] як один порожній спосіб.',
  }),
  practice('sequence-dp', {
    id: 'max-non-adjacent-sum',
    title: 'Максимальна сума без сусідів',
    statement: [
      'Вибери підмножину елементів масиву без двох сусідніх позицій і максимізуй суму. Дозволено нічого не брати.',
    ],
    input: 'n і масив.',
    output: 'Максимальна сума.',
    constraints: ['1 ≤ n ≤ 200000', '|a[i]| ≤ 10⁹'],
    examples: [example('5\n3 2 7 10 1', '13')],
    hint: 'Для позиції i є два випадки: skip → dp[i−1], take → dp[i−2]+a[i].',
  }),
  practice('sequence-dp', {
    id: 'longest-increasing-subsequence',
    title: 'Найдовша зростаюча підпослідовність',
    statement: ['Знайди довжину строго зростаючої підпослідовності.'],
    input: 'n і масив.',
    output: 'Довжина LIS.',
    constraints: ['1 ≤ n ≤ 200000', '|a[i]| ≤ 10⁹'],
    examples: [example('6\n3 1 5 2 6 4', '3')],
    hint: 'O(n²) DP пояснює state, але limit вимагає tails + lower_bound за O(n log n).',
  }),

  learning('knapsack-counting-dp', {
    id: 'expedition-knapsack',
    title: 'Рюкзак експедиції',
    statement: [
      'Є n предметів, кожен має вагу w[i] і корисність v[i]. Кожен можна взяти не більше одного разу. Місткість рюкзака W. Знайди максимальну корисність.',
    ],
    input: 'n, W і n пар weight value.',
    output: 'Максимальна корисність.',
    constraints: ['1 ≤ n ≤ 200', '1 ≤ W ≤ 100000', '1 ≤ weight,value ≤ 10⁹'],
    examples: [example('3 7\n3 4\n4 5\n5 7', '9')],
    tryYourself:
      'Яка інформація про вже розглянуті предмети потрібна майбутньому, якщо нас цікавить лише value?',
    hint: 'dp[w] — maximum value з вагою не більше w; для 0/1 оновлюй w вниз.',
    firstApproach: [
      p('Перебрати всі 2ⁿ підмножини й перевірити сумарну вагу.'),
    ],
    approachReview:
      'n=200 виключає subsets. Багато підмножин мають однакову вагу; для майбутнього лишаємо лише найкращу value.',
    observation: [
      p(
        'Повний dp[i][w] стискається до dp[w], але рух справа наліво не дозволяє поточному предмету використати себе повторно.',
      ),
    ],
    algorithm: [
      'Створи dp[0…W]=0.',
      'Для кожного item(weight,value) пройди w від W до weight.',
      'Онови dp[w] = max(dp[w], dp[w−weight]+value).',
      'Виведи dp[W].',
    ],
    proof:
      'Індуктивно перед предметом dp описує оптимум попередніх предметів. Після оновлення кожен state або пропускає item, або бере його поверх старого state w−weight. Зворотний цикл читає ще не оновлений поточним item шар, тому item використано не більше разу.',
    complexity: 'O(nW) часу й O(W) пам’яті.',
    solution: cpp(
      `    int n,W;cin>>n>>W;vector<long long> dp(W+1);\n    for(int i=0;i<n;++i){int weight;long long value;cin>>weight>>value;\n        for(int w=W;w>=weight;--w) dp[w]=max(dp[w],dp[w-weight]+value);\n    }\n    cout<<dp[W]<<'\n';`,
    ),
    takeaway:
      'Knapsack стискає історію до ресурсу; напрямок циклу визначає, скільки разів дозволено використати предмет.',
  }),
  practice('knapsack-counting-dp', {
    id: 'coin-combinations',
    title: 'Монети',
    statement: [
      'Є необмежено монет n номіналів. Порахуй кількість комбінацій без урахування порядку, що дають суму S, modulo 1e9+7.',
    ],
    input: 'n, S і номінали.',
    output: 'Кількість комбінацій.',
    constraints: ['1 ≤ n ≤ 200', '1 ≤ S ≤ 100000'],
    examples: [example('3 5\n1 2 5', '4')],
    hint: 'Зовнішній цикл по coins, внутрішній s з coin до S. Так 2+1+1+1 не рахується в різних порядках.',
  }),
  practice('knapsack-counting-dp', {
    id: 'subset-sum',
    title: 'Subset Sum',
    statement: [
      'Кожне з n додатних чисел можна взяти максимум раз. Визнач, чи можна отримати точну суму S.',
    ],
    input: 'n, S і числа.',
    output: 'YES або NO.',
    constraints: ['1 ≤ n ≤ 200', '1 ≤ S ≤ 100000'],
    examples: [example('4 11\n2 3 7 9', 'YES')],
    hint: 'boolean possible[0]=true; для кожного x оновлюй суми справа наліво.',
  }),
  practice('knapsack-counting-dp', {
    id: 'minimum-coins',
    title: 'Мінімум монет',
    statement: [
      'Є необмежена кількість заданих номіналів. Знайди мінімальну кількість монет для суми S або −1.',
    ],
    input: 'n, S і номінали.',
    output: 'Minimum або −1.',
    constraints: ['1 ≤ n ≤ 200', '1 ≤ S ≤ 100000'],
    examples: [example('3 6\n1 3 4', '2')],
    hint: 'dp[0]=0, інші INF; dp[s] = min(dp[s], dp[s−coin]+1). Тут unlimited transitions можуть читати менші суми цього ж шару.',
  }),

  learning('multidimensional-dp', {
    id: 'robot-path',
    title: 'Шлях робота',
    statement: [
      'Є n×m таблиця вартостей. Робот стартує в (1,1), рухається лише вправо або вниз і платить cost кожної відвіданої клітинки. Знайди мінімальну суму до (n,m).',
    ],
    input: 'n, m і таблиця.',
    output: 'Мінімальна сума.',
    constraints: ['1 ≤ n,m', 'n·m ≤ 1000000', '0 ≤ cost ≤ 10⁹'],
    examples: [example('3 3\n1 3 1\n2 1 5\n4 2 1', '7')],
    tryYourself:
      'З яких клітинок може прийти останній крок у (i,j)? Намалюй стрілки залежностей.',
    hint: 'dp[i][j] = cost[i][j] + min(top,left); недоступну межу вважай INF.',
    firstApproach: [
      p('Рекурсивно перебирати всі послідовності кроків вправо/вниз.'),
    ],
    approachReview:
      'Кількість шляхів комбінаторна, а одна клітинка досягається багатьма однаковими підзадачами.',
    observation: [
      p(
        'Стан визначається лише координатами; рядковий порядок гарантує, що top і left уже готові.',
      ),
      visual('dp-grid'),
    ],
    algorithm: [
      'Ініціалізуй dp INF, dp[0][0]=cost[0][0].',
      'Обходь клітинки за рядками.',
      'Оновлюй із top та left, якщо вони існують.',
      'Відповідь dp[n−1][m−1].',
    ],
    proof:
      'Кожен шлях у клітинку закінчується кроком згори або зліва. Вибір меншого оптимального префікса та додавання поточної cost дає найкращий шлях; індукція за i+j доводить таблицю.',
    complexity: 'O(nm) часу й пам’яті; пам’ять можна стиснути до O(m).',
    solution: cpp(
      `    int n,m;cin>>n>>m;const long long INF=4e18;vector<long long> dp(m,INF);\n    for(int i=0;i<n;++i) for(int j=0;j<m;++j){long long x;cin>>x;\n        if(i==0&&j==0) dp[j]=x;\n        else { long long best=dp[j]; if(j) best=min(best,dp[j-1]); dp[j]=best+x; }\n    }\n    cout<<dp[m-1]<<'\n';`,
    ),
    takeaway:
      'Координати формують state, дозволені рухи — transition, а напрямки стрілок визначають правильний order.',
  }),
  practice('multidimensional-dp', {
    id: 'longest-common-subsequence',
    title: 'Спільна підпослідовність',
    statement: [
      'Для двох рядків знайди довжину їх longest common subsequence. Символи можна пропускати, порядок зберігається.',
    ],
    input: 'Два рядки A і B.',
    output: 'Довжина LCS.',
    constraints: ['1 ≤ |A|,|B| ≤ 3000'],
    examples: [example('abcde\nace', '3')],
    hint: 'dp[i][j] для перших i,j символів. При рівності останніх додай 1 до diagonal; інакше пропусти останній символ одного рядка.',
  }),
  practice('multidimensional-dp', {
    id: 'maximum-dag-path',
    title: 'Максимальний шлях у DAG',
    statement: [
      'Weighted DAG має source s. Знайди maximum path value до t або IMPOSSIBLE.',
    ],
    input: 'n,m,s,t і edges u v w.',
    output: 'Maximum або IMPOSSIBLE.',
    constraints: ['1 ≤ n,m ≤ 200000', '|w| ≤ 10⁹'],
    examples: [example('4 4 1 4\n1 2 3\n1 3 2\n2 4 4\n3 4 8', '10')],
    hint: 'Topological sort дає order; dp[s]=0, інші −INF, transition max через кожне edge.',
  }),
  practice('multidimensional-dp', {
    id: 'tree-independent-set',
    title: 'Свято без конфліктів',
    statement: [
      'Вершини дерева мають happiness. Вибери вершини максимальної сумарної happiness так, щоб жодні сусідні не були вибрані.',
    ],
    input: 'n, values і tree edges.',
    output: 'Максимальна сума.',
    constraints: ['1 ≤ n ≤ 200000', '0 ≤ value ≤ 10⁹'],
    examples: [example('3\n5 4 6\n1 2\n1 3', '10')],
    hint: 'Tree DP: dp[v][1] бере v і лише dp[child][0]; dp[v][0] бере max обох станів дитини.',
  }),
];
