import {
  code,
  cpp,
  example,
  learning,
  lines,
  note,
  p,
  pattern,
  practice,
  table,
  visual,
} from '@/content/advanced/helpers';

export const bitmaskPatterns = [
  pattern({
    id: 'subset-enumeration',
    chapterId: 'ch-20',
    title: 'Subset Enumeration',
    description:
      'Кодуємо підмножину бітами mask і свідомо використовуємо O(2ⁿ), коли малий параметр робить повний перебір реальним.',
    intuition: [
      p(
        'Біт i відповідає одному рішенню «взяти/не взяти». Числа від 0 до 2ⁿ−1 перебирають усі комбінації рівно по одному разу.',
      ),
      visual('subset-mask'),
    ],
    modeling: [
      table(
        ['Операція', 'Вираз'],
        [
          ['перевірити i', 'mask & (1LL<<i)'],
          ['додати i', 'mask | (1LL<<i)'],
          ['видалити i', 'mask & ~(1LL<<i)'],
          ['перемкнути i', 'mask ^ (1LL<<i)'],
          ['кількість бітів', 'popcount(mask)'],
        ],
      ),
      note(
        'Малий параметр',
        'Велике n не забороняє exponential algorithm, якщо експонента залежить лише від k≤20.',
      ),
    ],
    priorKnowledge: [
      'Foundation → brute force',
      'Foundation → binary representation',
      'Core → constraints-driven choice',
    ],
    recognitionSigns: [
      'Є мала множина об’єктів і кожен або вибраний, або ні.',
      'n або окремий параметр k не перевищує приблизно 20–24.',
      'Потрібно перебрати subsets, submasks або всі набори ознак.',
    ],
    constraintSignals: [
      '2²⁰≈10⁶, але n·2ⁿ уже додає множник.',
      '1<<n має тип int; для n≥31 використовуй 1LL<<n.',
      'Пам’ять O(2ⁿ) не завжди потрібна для простого enumeration.',
    ],
    notApplicableSigns: [
      'Малий параметр сягає 35–45 — перевір Meet in the Middle.',
      'Стан залежить не лише від вибраної множини, а й від порядку без компактного параметра.',
      '2ⁿ помножене на дорогий O(n²) check перевищує ліміт.',
    ],
    knowledge: [
      p(
        'Mask — unsigned pattern бітів. Наймолодший встановлений біт можна взяти як bit=mask&−mask, а mask&(mask−1) видаляє його.',
      ),
      visual('subset-mask'),
      note(
        'Submask enumeration',
        'Цикл sub=(sub−1)&mask перебирає всі непорожні submasks; загалом по всіх masks це O(3ⁿ), не O(2ⁿ).',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'for (int mask = 0; mask < (1 << n); ++mask) {',
          '    long long sum = 0;',
          '    for (int i = 0; i < n; ++i)',
          '        if (mask & (1 << i)) sum += value[i];',
          '}',
        ),
        'Перебір subsets',
      ),
      code(
        lines(
          'for (int sub = mask; sub; sub = (sub - 1) & mask) {',
          '    // усі непорожні submasks',
          '}',
        ),
        'Перебір submasks',
      ),
    ],
    theory: [
      p(
        'Експоненційність оцінюють чисельно. 2²⁰ і 20·2²⁰ — різні workloads, а 3²⁰ вже приблизно 3.4·10⁹.',
      ),
      note(
        'Не маскуй повільний check',
        'Попередньо кодуй конфлікти, ваги або властивості, щоб перевірка mask була O(1) чи O(n), а не повторювала складну роботу.',
      ),
    ],
    extensions: [
      {
        title: 'Gray code, submasks і SOS-style preview',
        blocks: [
          p(
            'Gray code змінює один біт між сусідніми subsets. SOS DP агрегує значення по всіх submasks за O(n·2ⁿ) і є наступним кроком.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'bitmask-dp',
    chapterId: 'ch-20',
    title: 'Bitmask DP',
    description:
      'Зберігаємо найкращу відповідь для множини вже використаних об’єктів і додаємо один новий елемент переходом.',
    intuition: [
      p(
        'Mask стискає цілу історію до відповіді на питання «які об’єкти вже використані?». Якщо їх кількість визначає наступний крок, додаткова координата часто не потрібна.',
      ),
      visual('bitmask-dp'),
    ],
    modeling: [
      table(
        ['Стан', 'Типова задача'],
        [
          ['dp[mask]', 'assignment, порядок визначає popcount'],
          ['dp[mask][v]', 'маршрут закінчується у v'],
          ['ways[mask]', 'кількість способів утворити subset'],
        ],
      ),
      note(
        'State completeness',
        'Додавай last vertex лише тоді, коли майбутня ціна залежить від того, де завершився маршрут.',
      ),
    ],
    priorKnowledge: [
      'Combination → Dynamic Programming',
      'Advanced → bit operations',
      'Foundation → INF та overflow',
    ],
    recognitionSigns: [
      'Стан визначає множина вже використаних об’єктів.',
      'Потрібне assignment, Hamiltonian path або TSP на малому n.',
      'Наступний вибір — один елемент поза mask.',
    ],
    constraintSignals: [
      'n≤18–20 допускає O(n·2ⁿ).',
      'dp[mask][v] потребує O(n·2ⁿ) пам’яті.',
      'Для counting потрібен modulus; для min — INF.',
    ],
    notApplicableSigns: [
      'n близько 40 без додаткової структури.',
      'Множина не визначає майбутнє — потрібен додатковий state.',
      'Є симетрія або групи взаємозамінних елементів, які можна стиснути сильніше.',
    ],
    knowledge: [
      p(
        'Transition додає один unset bit. Граф станів є DAG за popcount: усі ребра ведуть із шару k у k+1.',
      ),
      visual('bitmask-dp'),
      note(
        'Порядок уже готовий',
        'Звичайний цикл mask=0..2ⁿ−1 коректний, якщо переходи тільки додають біти.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'int total = 1 << n;',
          'vector<long long> dp(total, INF);',
          'dp[0] = 0;',
          'for (int mask = 0; mask < total; ++mask) {',
          '    int worker = __builtin_popcount((unsigned)mask);',
          '    for (int task = 0; task < n; ++task)',
          '        if (!(mask & (1 << task)))',
          '            dp[mask | (1 << task)] = min(',
          '                dp[mask | (1 << task)], dp[mask] + cost[worker][task]);',
          '}',
        ),
        'Assignment DP',
      ),
    ],
    theory: [
      p(
        'Кожен повний assignment відповідає шляху від mask=0 до all bits. DP залишає мінімальну вартість серед усіх шляхів, що приходять до однакової множини.',
      ),
      note(
        'Reconstruction',
        'Збережи chosen[mask] або parent mask, якщо треба вивести саме призначення.',
      ),
    ],
    extensions: [
      {
        title: 'TSP та Hamiltonian paths',
        blocks: [
          p(
            'Для маршруту потрібен стан dp[mask][last]. Transition додає next і вартість edge(last,next).',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'meet-in-the-middle',
    chapterId: 'ch-20',
    title: 'Meet in the Middle',
    description:
      'Ділимо 35–45 об’єктів на дві половини, окремо перебираємо їх результати й ефективно поєднуємо.',
    intuition: [
      p(
        '2⁴⁰ занадто багато, але дві таблиці по 2²⁰ цілком реальні. Після sorting або hashing пари половин шукаються швидко.',
      ),
      visual('meet-in-the-middle'),
    ],
    modeling: [
      table(
        ['Крок', 'Вартість'],
        [
          ['subset sums ліворуч', 'O(2^(n/2))'],
          ['subset sums праворуч', 'O(2^(n/2))'],
          ['sort правих', 'O(2^(n/2)·n)'],
          ['combine binary search', 'O(2^(n/2)·n)'],
        ],
      ),
    ],
    priorKnowledge: [
      'Advanced → Subset Enumeration',
      'Core → Binary Search',
      'Core → Sorting',
    ],
    recognitionSigns: [
      'n≈35–45 і повний subset enumeration не проходить.',
      'Внесок subset розкладається на незалежні половини.',
      'Результати половин можна combine через sum, xor, pair або constraint.',
    ],
    constraintSignals: [
      '2^(n/2) має міститися і в часі, і в пам’яті.',
      'Для n=50 це вже близько 33 мільйонів на половину.',
      'Nonnegative values спрощують closest-sum search, але не обов’язкові для самого MITM.',
    ],
    notApplicableSigns: [
      'Між половинами є складні взаємні залежності, які не стискаються.',
      'n≤25 — прямий enumeration простіший.',
      'Потрібен порядок усіх елементів, а не комбінація незалежних результатів.',
    ],
    knowledge: [
      p(
        'Meet in the Middle зменшує експоненту вдвічі, але часто витрачає багато пам’яті. Результати половини можна sort+unique або стискати Pareto frontier.',
      ),
      visual('meet-in-the-middle'),
      note(
        'Combine є серцем',
        'Після enumeration сформулюй точний query до другої половини: predecessor, exact complement, count in range або minimum.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'vector<long long> subsetSums(const vector<long long>& a) {',
          '    vector<long long> sums(1 << a.size());',
          '    for (int mask = 1; mask < int(sums.size()); ++mask) {',
          '        int bit = __builtin_ctz((unsigned)mask);',
          '        sums[mask] = sums[mask ^ (1 << bit)] + a[bit];',
          '    }',
          '    return sums;',
          '}',
        ),
        'Subset sums через видалення одного біта',
      ),
    ],
    theory: [
      p(
        'Для кожного subset повної множини існує єдина пара: його перетин із left і його перетин із right. Отже перебір усіх пар результатів не втрачає рішень.',
      ),
      note(
        'Не роби Cartesian product',
        '2^(n/2)×2^(n/2)=2ⁿ повертає початкову проблему. Потрібен binary search, two pointers або hash lookup.',
      ),
    ],
    extensions: [
      {
        title: 'Pareto compression',
        blocks: [
          p(
            'Коли половина дає пару {cost,value}, відкидай dominated states перед combine. Це часто робить memory practical.',
          ),
        ],
      },
    ],
  }),
];

export const bitmaskTasks = [
  learning('subset-enumeration', {
    id: 'best-team',
    title: 'Найкраща команда',
    statement: [
      'Є n кандидатів із цінностями value[i] та m несумісних пар. Знайди максимальну суму цінностей допустимої підмножини.',
    ],
    input: 'n, m, n цінностей і m пар 1-based індексів.',
    output: 'Максимальна сумарна цінність.',
    constraints: ['1 ≤ n ≤ 20', '0 ≤ m ≤ n(n−1)/2', '0 ≤ value[i] ≤ 10⁹'],
    examples: [example('4 2\\n5 6 4 7\\n1 2\\n2 4', '16')],
    tryYourself: 'Як одним числом представити всю вибрану команду?',
    hint: 'Перебери mask і закодуй конфлікти кожного i теж як mask.',
    firstApproach: [
      p('Будувати команди рекурсією без явної оцінки кількості станів.'),
    ],
    approachReview:
      'Рекурсія може бути коректною, але mask робить простір 2ⁿ явним і спрощує перевірку та оцінку.',
    observation: [
      p(
        'n≤20 означає близько мільйона subsets; кожен можна перевірити за O(n).',
      ),
      visual('subset-mask'),
    ],
    algorithm: [
      'Побудуй conflictMask[i].',
      'Для кожного mask пройди встановлені біти.',
      'Якщо вибрано конфліктну пару, відкинь mask.',
      'Інакше онови maximum sum.',
    ],
    proof:
      'Кожна команда має єдину mask і буде перевірена. Перевірка відкидає рівно ті masks, що містять обидва кінці хоча б однієї несумісної пари; серед решти береться найбільша сума.',
    complexity: 'O(n·2ⁿ + m) часу й O(n) пам’яті.',
    solution: cpp(
      lines(
        '    int n,m;cin>>n>>m;vector<long long> value(n);for(auto&x:value)cin>>x;',
        '    vector<int> conflict(n);while(m--){int a,b;cin>>a>>b;--a;--b;conflict[a]|=1<<b;conflict[b]|=1<<a;}',
        '    long long answer=0;',
        '    for(int mask=0;mask<(1<<n);++mask){bool ok=true;long long sum=0;',
        '        for(int i=0;i<n;++i)if(mask&(1<<i)){',
        '            if(conflict[i]&mask){ok=false;break;}sum+=value[i];',
        '        }',
        '        if(ok)answer=max(answer,sum);',
        '    }',
        '    cout<<answer<<"\\n";',
      ),
    ),
    takeaway:
      'Constraints можуть прямо дозволяти правильний exponential algorithm по малому параметру.',
  }),
  practice('subset-enumeration', {
    id: 'small-subset-sum',
    title: 'Subset Sum при n≤20',
    statement: ['Визнач, чи існує subset із сумою рівно S.'],
    input: 'n, S і n цілих чисел.',
    output: 'YES/NO.',
    constraints: ['n ≤ 20', '|a[i]|,|S| ≤ 10⁹'],
    examples: [example('4 9\\n2 4 5 8', 'YES')],
    hint: 'Перебери 2ⁿ masks і накопич суму.',
  }),
  practice('subset-enumeration', {
    id: 'small-independent-set',
    title: 'Незалежна множина малого графа',
    statement: ['Знайди maximum size subset вершин без ребер усередині.'],
    input: 'n, m та edges.',
    output: 'Максимальний розмір.',
    constraints: ['n ≤ 22'],
    examples: [example('3 2\\n1 2\\n2 3', '2')],
    hint: 'Закодуй adjacency кожної вершини mask.',
  }),
  practice('subset-enumeration', {
    id: 'enumerate-submasks',
    title: 'Сума по submasks',
    statement: ['Для заданої mask порахуй суму value[sub] по всіх submasks.'],
    input: 'k, mask і 2^k значень.',
    output: 'Сума.',
    constraints: ['k ≤ 22'],
    examples: [example('2 3\\n1 2 3 4', '10')],
    hint: 'Після sub=0 цикл треба завершити окремо.',
  }),

  learning('bitmask-dp', {
    id: 'task-assignment',
    title: 'Розподіл завдань',
    statement: [
      'Є n працівників і n задач. cost[i][j] — вартість призначити задачу j працівнику i. Знайди minimum cost bijection.',
    ],
    input: 'n і матриця cost.',
    output: 'Мінімальна сумарна вартість.',
    constraints: ['1 ≤ n ≤ 18', '0 ≤ cost[i][j] ≤ 10⁹'],
    examples: [example('3\\n9 2 7\\n6 4 3\\n5 8 1', '9')],
    tryYourself:
      'Чи потрібна координата worker, якщо mask уже знає кількість призначених задач?',
    hint: 'worker=popcount(mask).',
    firstApproach: [p('Перебрати всі n! bijections.')],
    approachReview:
      '18! недосяжне. Багато часткових порядків мають однакову множину зайнятих задач і однакове майбутнє.',
    observation: [
      p(
        'dp[mask] об’єднує всі способи призначити перших popcount(mask) працівників на задачі mask.',
      ),
      visual('bitmask-dp'),
    ],
    algorithm: [
      'dp[0]=0, решта INF.',
      'Для mask визнач worker=popcount(mask).',
      'Додай кожну вільну task.',
      'Відповідь dp[all].',
    ],
    proof:
      'Індукція за popcount: dp[mask] є мінімумом усіх призначень перших k працівників саме на mask. Кожне призначення для k+1 має унікальний останній task і походить із меншої mask, тому transitions повні.',
    complexity: 'O(n·2ⁿ) часу й O(2ⁿ) пам’яті.',
    solution: cpp(
      lines(
        '    int n;cin>>n;vector<vector<long long>>c(n,vector<long long>(n));for(auto&r:c)for(auto&x:r)cin>>x;',
        '    const long long INF=4e18;vector<long long>dp(1<<n,INF);dp[0]=0;',
        '    for(int mask=0;mask<(1<<n);++mask){int worker=__builtin_popcount((unsigned)mask);if(worker==n)continue;',
        '        for(int task=0;task<n;++task)if(!(mask&(1<<task)))',
        '            dp[mask|(1<<task)]=min(dp[mask|(1<<task)],dp[mask]+c[worker][task]);',
        '    }',
        '    cout<<dp.back()<<"\\n";',
      ),
    ),
    takeaway:
      'Bitmask DP об’єднує історії, якщо множина використаних об’єктів повністю визначає майбутнє.',
  }),
  practice('bitmask-dp', {
    id: 'travelling-salesperson',
    title: 'TSP',
    statement: [
      'Знайди minimum Hamiltonian cycle від вершини 1 у повному weighted graph.',
    ],
    input: 'n і матриця ваг.',
    output: 'Minimum cost.',
    constraints: ['n ≤ 18', 'w ≥ 0'],
    examples: [example('3\\n0 2 5\\n2 0 1\\n5 1 0', '8')],
    hint: 'dp[mask][last], стартова вершина завжди в mask.',
  }),
  practice('bitmask-dp', {
    id: 'perfect-assignment-count',
    title: 'Perfect Assignment Count',
    statement: [
      'Матриця allowed задає допустимі призначення. Порахуй perfect assignments modulo 1e9+7.',
    ],
    input: 'n і binary matrix.',
    output: 'Кількість.',
    constraints: ['n ≤ 21'],
    examples: [example('2\\n1 1\\n1 0', '1')],
    hint: 'ways[mask], worker=popcount(mask), додавай лише allowed task.',
  }),
  practice('bitmask-dp', {
    id: 'hamiltonian-path-count',
    title: 'Hamiltonian Paths',
    statement: [
      'Порахуй Hamiltonian paths із 1 у n в directed graph modulo 1e9+7.',
    ],
    input: 'n, m та edges.',
    output: 'Кількість.',
    constraints: ['n ≤ 20'],
    examples: [example('3 3\\n1 2\\n2 3\\n1 3', '1')],
    hint: 'ways[mask][last]; не дозволяй n з’явитися до фінального mask.',
  }),
  practice('bitmask-dp', {
    id: 'minimum-feature-cover',
    title: 'Невидимий набір ознак',
    statement: [
      'Кожен із m інструментів має cost і покриває subset із k ознак. Знайди minimum cost покрити всі ознаки.',
    ],
    input: 'k, m та інструменти.',
    output: 'Minimum cost або −1.',
    constraints: ['k ≤ 20', 'm ≤ 200000'],
    examples: [example('3 3\\n5 3\\n4 4\\n3 6', '8')],
    hint: 'Стан — mask уже покритих ознак; transition додає mask інструмента.',
  }),

  learning('meet-in-the-middle', {
    id: 'closest-subset-sum',
    title: 'Найближча сума',
    statement: [
      'Дано до 40 невід’ємних чисел і S. Знайди maximum subset sum, що не перевищує S.',
    ],
    input: 'n, S і n чисел.',
    output: 'Найкраща сума.',
    constraints: ['1 ≤ n ≤ 40', '0 ≤ a[i],S ≤ 10¹⁸'],
    examples: [example('5 17\\n3 5 8 10 12', '17')],
    tryYourself:
      'Як перетворити subset повної множини на пару subsets двох половин?',
    hint: 'Перебери sums A/B, відсортуй B, для a шукай predecessor S−a.',
    firstApproach: [p('Перебрати 2⁴⁰ subsets.')],
    approachReview: 'Понад трильйон masks, але одна половина має лише 2²⁰.',
    observation: [
      p(
        'Кожен subset однозначно розкладається на left і right; їхні суми додаються.',
      ),
      visual('meet-in-the-middle'),
    ],
    algorithm: [
      'Розділи масив навпіл.',
      'Побудуй усі sums A і B.',
      'Відсортуй B.',
      'Для кожного a≤S знайди найбільший b≤S−a.',
    ],
    proof:
      'Оптимальний subset має пару сум a у A та b у B. Коли алгоритм розглядає це a, upper_bound обирає b не менше оптимального серед допустимих, тому знайдена відповідь не гірша; вона завжди допустима.',
    complexity: 'O(2^(n/2)·n) часу з sorting і O(2^(n/2)) пам’яті.',
    solution: cpp(
      lines(
        '    int n;long long S;cin>>n>>S;vector<long long>a(n);for(auto&x:a)cin>>x;',
        '    int mid=n/2;vector<long long>L(a.begin(),a.begin()+mid),R(a.begin()+mid,a.end());',
        '    auto sums=[](const vector<long long>&v){vector<long long>r(1<<v.size());for(int m=1;m<int(r.size());++m){int b=__builtin_ctz((unsigned)m);r[m]=r[m^(1<<b)]+v[b];}return r;};',
        '    auto A=sums(L),B=sums(R);sort(B.begin(),B.end());long long answer=0;',
        '    for(long long x:A)if(x<=S){auto it=upper_bound(B.begin(),B.end(),S-x);if(it!=B.begin())answer=max(answer,x+*prev(it));}',
        '    cout<<answer<<"\\n";',
      ),
    ),
    takeaway:
      'Meet in the Middle зменшує exponent удвічі, а sorting робить combine не декартовим.',
  }),
  practice('meet-in-the-middle', {
    id: 'subset-sum-forty',
    title: 'Subset Sum n≤40',
    statement: ['Визнач, чи існує subset із сумою рівно X.'],
    input: 'n, X і числа.',
    output: 'YES/NO.',
    constraints: ['n ≤ 40', '|a[i]|≤10⁹'],
    examples: [example('4 11\\n2 4 7 9', 'YES')],
    hint: 'Hash set правих sums і complement X−left.',
  }),
  practice('meet-in-the-middle', {
    id: 'count-subsets-exact',
    title: 'Count subsets with sum X',
    statement: ['Порахуй subsets із сумою X.'],
    input: 'n, X і числа.',
    output: 'Кількість.',
    constraints: ['n ≤ 40'],
    examples: [example('3 3\\n1 2 3', '2')],
    hint: 'Sort B; для кожного a додай upper_bound−lower_bound для X−a.',
  }),
  practice('meet-in-the-middle', {
    id: 'four-sum-halves',
    title: 'Four Sum через дві половини',
    statement: ['Обери по одному числу з чотирьох масивів, щоб сума була X.'],
    input: 'n, X і чотири масиви довжини n.',
    output: 'YES/NO.',
    constraints: ['n ≤ 2000'],
    examples: [example('2 10\\n1 2\\n3 4\\n2 5\\n4 1', 'YES')],
    hint: 'Збери всі A+B та C+D, потім two pointers або binary search.',
  }),
];
