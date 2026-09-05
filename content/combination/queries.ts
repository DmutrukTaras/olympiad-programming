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

const fenwickClass = `struct Fenwick {
    int n; vector<long long> bit;
    Fenwick(int n) : n(n), bit(n + 1) {}
    void add(int i, long long delta) {
        for (; i <= n; i += i & -i) bit[i] += delta;
    }
    long long prefix(int i) const {
        long long result = 0;
        for (; i > 0; i -= i & -i) result += bit[i];
        return result;
    }
    long long range(int l, int r) const { return prefix(r) - prefix(l - 1); }
};`;

export const queryPatterns = [
  pattern({
    id: 'fenwick-tree',
    chapterId: 'ch-17',
    title: 'Fenwick Tree',
    description:
      'Баланс між швидким point update та prefix/range sum: дерево часткових двійкових блоків дає обидві операції за O(log n).',
    intuition: [
      p(
        'Масив має update O(1), але range sum O(n). Prefix має query O(1), але update O(n). Fenwick зберігає перекривні prefix-блоки й робить обидві операції O(log n).',
      ),
      table(
        ['Представлення', 'Point update', 'Range sum'],
        [
          ['Array', 'O(1)', 'O(n)'],
          ['Prefix Sum', 'O(n)', 'O(1)'],
          ['Fenwick Tree', 'O(log n)', 'O(log n)'],
        ],
      ),
    ],
    modeling: [
      p(
        'Випиши операції без сюжету: ADD i delta та SUM l r. Range sum переформульовується як prefix(r)−prefix(l−1), тому достатньо структури для point add + prefix query.',
      ),
      note(
        '1-based indexing',
        'Класичний Fenwick використовує індекси 1…n, бо lowbit(0)=0 і цикл не рухався б. Перетворюй індекси на межі API один раз.',
      ),
    ],
    priorKnowledge: [
      'Foundation → Prefix Sum',
      'Core → binary representation',
      'Нове → lowbit blocks',
    ],
    recognitionSigns: [
      'Є багато point updates і prefix/range sum queries.',
      'Операція має природну prefix-форму.',
      'Після compression потрібні частоти/суми за порядком значень.',
    ],
    constraintSignals: [
      'n,q ≤ 200000: O(log n) на команду достатньо.',
      'Сума оновлень потребує long long.',
      'Fenwick має O(n) пам’яті й простіший за Segment Tree.',
    ],
    notApplicableSigns: [
      'Потрібен range minimum із довільними збільшеннями/зменшеннями.',
      'Потрібен складний non-invertible merge.',
      'Є range updates і range queries без відповідного Fenwick-трюку.',
    ],
    knowledge: [
      p(
        'lowbit(i)=i&−i — розмір блока, за який відповідає bit[i]. Prefix query прибирає останній блок i−=lowbit(i); update додає delta до всіх більших блоків, що містять i.',
      ),
      table(
        ['Операція', 'Рух індексу'],
        [
          ['prefix(i)', 'i -= i & -i'],
          ['add(i,delta)', 'i += i & -i'],
          ['range(l,r)', 'prefix(r) − prefix(l−1)'],
          ['SET i x', 'add(i, x−old[i])'],
        ],
      ),
      note(
        'Fenwick зберігає delta',
        'Базова операція — додати, не присвоїти. Для SET треба пам’ятати поточний array[i] і передати різницю.',
      ),
    ],
    cppNotes: [
      code(fenwickClass, 'Fenwick для сум, 1-based API'),
      note(
        'const query',
        'prefix не змінює структуру, тому може бути const. Для 0-based зовнішніх індексів викликай add(index+1,delta).',
      ),
    ],
    theory: [
      p(
        'bit[i] зберігає суму interval (i−lowbit(i), i]. Ці блоки в prefix query не перетинаються й точно розбивають [1,i], тому їх сума правильна. Update торкається рівно блоків, які містять змінену позицію.',
      ),
      note(
        'Compression + Fenwick',
        'Великі значення перетворюємо на rank, після чого prefix(rank−1) може рахувати кількість менших. Це типова Combination-комбінація.',
      ),
    ],
    extensions: [
      {
        title: 'Range update / point query і пошук kth',
        blocks: [
          p(
            'Difference Array + Fenwick підтримує ADD l r delta через add(l,+delta), add(r+1,−delta), а point value читається prefix(i).',
          ),
          p(
            'Якщо Fenwick зберігає невід’ємні частоти, binary lifting по tree може знайти найменший індекс із prefix ≥ k.',
          ),
          note(
            'Не механічно',
            'Кожен трюк починається з алгебраїчного переформулювання операцій, а не з іншого коду циклу.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'segment-tree',
    chapterId: 'ch-17',
    title: 'Segment Tree',
    description:
      'Рекурсивно розбиваємо масив на відрізки й зберігаємо у вузлі результат associative merge для sum, min, max або custom state.',
    intuition: [
      p(
        'Range [l,r) можна розкласти на O(log n) неперетинних вузлів дерева. Якщо знаємо, як merge відповіді двох сусідніх частин, отримуємо відповідь усього запиту.',
      ),
      visual('range-structures'),
    ],
    modeling: [
      table(
        ['Дані й операції', 'Інструмент'],
        [
          ['Static + sum', 'Prefix'],
          ['Static + idempotent min/max', 'Sparse Table'],
          ['Point update + sum', 'Fenwick'],
          ['Point update + min/max/custom merge', 'Segment Tree'],
          ['Range update + range query', 'Lazy Segment Tree'],
        ],
      ),
      note(
        'Головне питання',
        'Не “чи знаю я Segment Tree?”, а “який Node і як merge(left,right)?”. Для sum/min це число; для maximum subarray — структура з кількох полів.',
      ),
    ],
    priorKnowledge: [
      'Foundation → divide range і aggregation',
      'Core → tree-like indexing',
      'Нове → associative merge',
    ],
    recognitionSigns: [
      'Є point updates і range min/max/custom queries.',
      'Відповідь відрізка складається з відповідей двох половин.',
      'Потрібно шукати першу позицію за агрегатом префікса.',
    ],
    constraintSignals: [
      'Build O(n), update/query O(log n), memory O(n).',
      '4n memory для recursive tree або 2n для iterative.',
      'Identity має відповідати merge: 0 для sum, +INF для min, −INF для max.',
    ],
    notApplicableSigns: [
      'Дані статичні й Prefix/Sparse Table простіші.',
      'Merge залежить від порядку розбиття й не є associative.',
      'Потрібні масові range updates без lazy propagation.',
    ],
    knowledge: [
      p(
        'Segment Tree — binary tree intervals. Leaves відповідають одному елементу; internal node = merge(left child, right child). Associativity гарантує, що різне розбиття query дає той самий результат.',
      ),
      table(
        ['Aggregate', 'merge', 'identity'],
        [
          ['sum', 'a+b', '0'],
          ['minimum', 'min(a,b)', '+INF'],
          ['maximum', 'max(a,b)', '−INF'],
          ['GCD', 'gcd(a,b)', '0'],
        ],
      ),
      note(
        'Напівінтервал [l,r)',
        'Iterative query простіше пишеться для [l,r). Якщо умова дає inclusive [l,r], передай r+1 рівно один раз.',
      ),
    ],
    cppNotes: [
      code(
        'struct SegTree {\n    int n; vector<long long> tree; const long long INF = 4e18;\n    SegTree(const vector<long long>& a) : n(a.size()), tree(2*n, INF) {\n        for (int i=0;i<n;++i) tree[n+i]=a[i];\n        for (int i=n-1;i;--i) tree[i]=min(tree[2*i],tree[2*i+1]);\n    }\n    void setValue(int p,long long x){ for(tree[p+=n]=x;p>1;p/=2) tree[p/2]=min(tree[p],tree[p^1]); }\n    long long query(int l,int r){ long long ans=INF; for(l+=n,r+=n;l<r;l/=2,r/=2){ if(l&1) ans=min(ans,tree[l++]); if(r&1) ans=min(ans,tree[--r]); } return ans; }\n};',
        'Iterative Segment Tree для minimum',
      ),
    ],
    theory: [
      p(
        'Query вибирає вузли, intervals яких повністю лежать у запиті, і не заходить у непотрібні частини. На кожному рівні є не більше двох граничних вузлів, тому O(log n). Після point update змінюється лише шлях leaf→root.',
      ),
      note(
        'Custom Node',
        'Спершу визнач, яку інформацію повинен повертати будь-який segment. Потім виведи merge двох сусідніх segments і identity для порожньої частини.',
      ),
    ],
    extensions: [
      {
        title: 'Lazy Propagation — preview',
        blocks: [
          p(
            'Для ADD l r x + SUM l r зміна охоплює цілий вузол. lazy[node] зберігає відкладену операцію для descendants, щоб не спускатися до кожного leaf.',
          ),
          note(
            'Дві функції',
            'Потрібно правильно визначити apply(node,update) та compose(old,new). Lazy — не “ще один масив”, а алгебра відкладених операцій.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'offline-processing',
    chapterId: 'ch-17',
    title: 'Offline Processing',
    description:
      'Коли відповіді не треба видавати одразу, переставляємо запити або стискаємо координати так, щоб межі й структура змінювалися дешево.',
    intuition: [
      p(
        'Online алгоритм бачить запити по одному. Offline алгоритм знає весь набір і може сортувати його, відповідати в іншому порядку, а потім повернути результати за original index.',
      ),
      visual('range-structures'),
    ],
    modeling: [
      table(
        ['Переформулювання', 'Інструмент'],
        [
          ['Великі values, важливий лише порядок', 'Coordinate Compression'],
          ['Static RMQ', 'Sparse Table'],
          ['Баланс update/query', 'Sqrt Decomposition'],
          ['Багато static range queries + add/remove', 'Mo’s Algorithm'],
        ],
      ),
      note(
        'Ключове питання',
        'Чи обов’язково відповідати в початковому порядку? Якщо ні, sorting queries може перетворити дорогі переходи на локальні.',
      ),
    ],
    priorKnowledge: [
      'Foundation → Sorting/Preprocessing',
      'Core → Sliding Window',
      'Queries → frequency add/remove',
    ],
    recognitionSigns: [
      'Усі запити відомі до початку й дані не змінюються.',
      'Відповідь range query підтримується локальними add/remove.',
      'Координати величезні, але різних значень не більше n+q.',
    ],
    constraintSignals: [
      'Mo має приблизно O((n+q)√n) рухів, не O(log n).',
      'Sparse Table O(n log n) build і O(1) idempotent query.',
      'Compression зберігає порядок, але не числові відстані.',
    ],
    notApplicableSigns: [
      'Запити надходять online або залежать від попередніх відповідей.',
      'Між range queries є updates — класичний Mo вже недостатній.',
      'add/remove стану коштує дорого або його неможливо локально оновити.',
    ],
    knowledge: [
      p(
        'Compression: sort + erase(unique), потім lower_bound(value) дає rank. Mo: сортуємо [l,r] за block(l), потім r; підтримуємо поточний [L,R] і рухаємо межі функціями add/remove.',
      ),
      table(
        ['Метод', 'Що зберігає'],
        [
          ['Compression', 'відносний порядок values'],
          ['Sparse Table', 'відповіді для blocks довжини 2^k'],
          ['Sqrt', 'агрегат кожного блока'],
          ['Mo', 'стан поточного рухомого query range'],
        ],
      ),
      note(
        'Поверни порядок',
        'Кожен offline query зберігає id. Після обробки записуй answer[id], а виводь за id=0…q−1.',
      ),
    ],
    cppNotes: [
      code(
        'sort(values.begin(), values.end());\nvalues.erase(unique(values.begin(), values.end()), values.end());\nint rank = lower_bound(values.begin(), values.end(), x) - values.begin();',
        'Coordinate Compression',
      ),
      code(
        'int block = max(1, (int)sqrt(n));\nsort(queries.begin(), queries.end(), [&](const Query& a, const Query& b) {\n    if (a.l / block != b.l / block) return a.l < b.l;\n    return (a.l / block & 1) ? a.r > b.r : a.r < b.r;\n});',
        'Mo order із alternating R',
      ),
    ],
    theory: [
      p(
        'Mo не робить один query асимптотично швидким. Він вибирає порядок усіх queries так, щоб сумарний рух L/R був близько O((n+q)√n). Коректність зберігається, бо answer записується за original id.',
      ),
      note(
        'Не плутай compression',
        'Ranks зберігають <, =, >. Вони не зберігають різницю: між rank 1 і 2 могло бути 1 або мільярд.',
      ),
    ],
    extensions: [
      {
        title: 'Sparse Table, Sqrt Decomposition та Mo з updates',
        blocks: [
          p(
            'Sparse Table для min/max використовує overlap: min(x,x)=x. Для sum стандартний O(1) overlapping query не працює.',
          ),
          p(
            'Sqrt Decomposition розбиває array на ~√n blocks і балансує повні блоки з крайовими елементами. Mo з updates додає третю координату часу й значно складніший.',
          ),
          note(
            'Вибирай найпростішу достатню структуру',
            'Offline не означає автоматично Mo. Спочатку перевір sorting sweep, Prefix, compression, Fenwick або Sparse Table.',
          ),
        ],
      },
    ],
  }),
];

export const queryTasks = [
  learning('fenwick-tree', {
    id: 'account-balance',
    title: 'Баланс рахунків',
    statement: [
      'Є n рахунків із початковим нульовим балансом. ADD i x додає x до рахунку i, SUM l r питає суму балансів від l до r включно.',
    ],
    input: 'n, q і q команд.',
    output: 'Відповідь для кожної SUM.',
    constraints: ['1 ≤ n,q ≤ 200000', '|x| ≤ 10⁹'],
    examples: [
      example('5 5\nADD 2 7\nADD 5 3\nSUM 2 5\nADD 2 -2\nSUM 1 2', '10\n5'),
    ],
    tryYourself:
      'Порівняй array і Prefix: яка з двох операцій повільна в кожному представленні?',
    hint: 'Fenwick підтримує point add і prefix sum; range = prefix(r)−prefix(l−1).',
    firstApproach: [
      p(
        'Array: ADD O(1), але кожен SUM перебирає весь [l,r]. Або Prefix: SUM O(1), але кожен ADD змінює весь суфікс.',
      ),
    ],
    approachReview:
      'За q=200000 обидва варіанти можуть дати O(nq). Потрібен баланс O(log n)+O(log n).',
    observation: [
      p(
        'Fenwick зберігає двійкові prefix-блоки; update і query торкаються лише O(log n) блоків.',
      ),
    ],
    algorithm: [
      'Створи Fenwick n.',
      'ADD i x → bit.add(i,x).',
      'SUM l r → prefix(r)−prefix(l−1).',
    ],
    proof:
      'Fenwick prefix розбиває [1,i] на неперетинні blocks, задані lowbit. add оновлює рівно всі blocks, що містять i. Тому prefix і різниця двох prefixes завжди відповідають актуальному array.',
    complexity: 'O(q log n) часу й O(n) пам’яті.',
    solution: cpp(
      `    ${fenwickClass}\n    int n,q;cin>>n>>q;Fenwick bit(n);\n    while(q--){string op;int a;long long b;cin>>op>>a>>b;\n        if(op=="ADD") bit.add(a,b); else cout<<bit.range(a,(int)b)<<'\n';\n    }`,
    ),
    takeaway:
      'Набір операцій point add + range sum переформульовується в point add + два prefix queries — саме контракт Fenwick.',
  }),
  practice('fenwick-tree', {
    id: 'dynamic-sales',
    title: 'Динамічні продажі',
    statement: [
      'Є початковий array. SET i x змінює значення, SUM l r повертає range sum.',
    ],
    input: 'n,q,array і команди.',
    output: 'Суми.',
    constraints: ['1 ≤ n,q ≤ 200000', '|value| ≤ 10⁹'],
    examples: [example('3 3\n2 4 1\nSUM 1 3\nSET 2 7\nSUM 2 3', '7\n8')],
    hint: 'Fenwick робить ADD, тому для SET зберігай old[i] і додавай x−old[i].',
  }),
  practice('fenwick-tree', {
    id: 'count-smaller-right',
    title: 'Кількість менших',
    statement: [
      'Для кожного a[i] порахуй кількість елементів праворуч, строго менших за нього.',
    ],
    input: 'n і array.',
    output: 'n чисел.',
    constraints: ['1 ≤ n ≤ 200000', '|a[i]| ≤ 10⁹'],
    examples: [example('5\n5 2 6 1 2', '3 1 2 0 0')],
    hint: 'Compression + Fenwick frequencies. Іди справа наліво: query ranks < rank(a[i]), потім add поточний rank.',
  }),
  practice('fenwick-tree', {
    id: 'inversion-count',
    title: 'Кількість інверсій',
    statement: ['Порахуй пари i<j з a[i]>a[j].'],
    input: 'n і array.',
    output: 'Кількість інверсій.',
    constraints: ['1 ≤ n ≤ 200000', '|a[i]| ≤ 10⁹'],
    examples: [example('5\n2 4 1 3 5', '3')],
    hint: 'Це сума “менших праворуч”. Відповідь може бути O(n²), потрібен long long.',
  }),

  learning('segment-tree', {
    id: 'dynamic-minimum',
    title: 'Динамічний мінімум',
    statement: [
      'Є масив. SET i x змінює a[i], MIN l r повертає minimum на inclusive [l,r].',
    ],
    input: 'n,q,array і q команд.',
    output: 'Відповідь для кожної MIN.',
    constraints: ['1 ≤ n,q ≤ 200000', '|a[i]| ≤ 10⁹'],
    examples: [
      example('5 4\n7 2 9 4 6\nMIN 2 5\nSET 2 8\nMIN 1 3\nMIN 4 4', '2\n7\n4'),
    ],
    tryYourself:
      'Чому для minimum не можна використати pref[r]−pref[l−1]? Яку інформацію має зберігати segment node?',
    hint: 'Node зберігає min interval; merge = min(left,right), identity = +INF.',
    firstApproach: [
      p(
        'SET у array O(1), а MIN сканує O(n). Prefix minimum швидкий лише для prefixes і не має inverse для довільного [l,r].',
      ),
    ],
    approachReview:
      'Потрібна структура, що перебудовує лише O(log n) ancestors і складає query з O(log n) nodes.',
    observation: [
      p(
        'Minimum associative: min(min(A),min(B)) = min(A∪B). Тому кожен node може зберігати один minimum.',
      ),
      visual('range-structures'),
    ],
    algorithm: [
      'Побудуй leaves зі значень і internal nodes через min.',
      'SET оновлює leaf і всіх ancestors.',
      'MIN перетвори на [l−1,r) і merge покривні nodes.',
    ],
    proof:
      'Індуктивно кожен node зберігає minimum свого interval. Query розбиває [l,r) на неперетинні node intervals; minimum їх агрегатів дорівнює minimum усього range.',
    complexity: 'Build O(n), кожен query/update O(log n), memory O(n).',
    solution: cpp(
      `    struct Seg{int n;vector<long long>t;const long long INF=4e18;\n        Seg(vector<long long>a):n(a.size()),t(2*n,INF){for(int i=0;i<n;++i)t[n+i]=a[i];for(int i=n-1;i;--i)t[i]=min(t[2*i],t[2*i+1]);}\n        void setv(int p,long long x){for(t[p+=n]=x;p>1;p/=2)t[p/2]=min(t[p],t[p^1]);}\n        long long get(int l,int r){long long ans=INF;for(l+=n,r+=n;l<r;l/=2,r/=2){if(l&1)ans=min(ans,t[l++]);if(r&1)ans=min(ans,t[--r]);}return ans;}\n    };\n    int n,q;cin>>n>>q;vector<long long>a(n);for(auto&x:a)cin>>x;Seg st(a);\n    while(q--){string op;int l;long long r;cin>>op>>l>>r;if(op=="SET")st.setv(l-1,r);else cout<<st.get(l-1,(int)r)<<'\n';}`,
    ),
    takeaway:
      'Segment Tree починається з контракту Node + associative merge + identity; update/query є наслідком цієї моделі.',
  }),
  practice('segment-tree', {
    id: 'dynamic-maximum',
    title: 'Динамічний максимум',
    statement: ['Підтримуй SET i x та MAX l r для inclusive range.'],
    input: 'n,q,array і команди.',
    output: 'Maximum для кожного query.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [example('4 3\n1 7 3 2\nMAX 2 4\nSET 2 0\nMAX 1 3', '7\n3')],
    hint: 'Зміни merge на max, а identity на дуже мале значення.',
  }),
  practice('segment-tree', {
    id: 'maximum-subarray-query',
    title: 'Maximum Subarray Query',
    level: 'advanced',
    statement: [
      'Для кожного static query [l,r] знайди maximum sum непорожнього підмасиву всередині range.',
    ],
    input: 'n,q,array і ranges.',
    output: 'Відповіді.',
    constraints: ['1 ≤ n,q ≤ 200000', '|a[i]| ≤ 10⁹'],
    examples: [example('5 2\n-2 3 -1 4 -5\n1 5\n3 5', '6\n4')],
    hint: 'Custom Node: total sum, best prefix, best suffix, best subarray. Виведи merge двох сусідніх segments.',
  }),
  practice('segment-tree', {
    id: 'first-at-least',
    title: 'Перша позиція не менше X',
    statement: [
      'Є point SET. Для запиту FIRST l x знайди найменший i≥l з a[i]≥x або −1.',
    ],
    input: 'n,q,array і команди.',
    output: 'Індекс або −1.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [example('5 2\n1 7 3 9 2\nFIRST 3 8\nFIRST 5 4', '4\n-1')],
    hint: 'Segment Tree з maximum дозволяє відкинути node, якщо його max<x, і спускатися спочатку в ліву дитину.',
  }),

  learning('offline-processing', {
    id: 'distinct-range-mo',
    title: 'Різні числа на відрізку',
    statement: [
      'Дано статичний масив і q запитів [l,r]. Для кожного знайди кількість різних значень. Запити можна обробляти в іншому порядку.',
    ],
    input: 'n,q,array і q ranges.',
    output: 'Відповіді в початковому порядку.',
    constraints: ['1 ≤ n,q ≤ 200000', '|a[i]| ≤ 10⁹'],
    examples: [example('5 3\n1 2 1 3 2\n1 3\n2 5\n4 4', '2\n3\n1')],
    tryYourself:
      'Як оновлюється distinct, коли до поточного range додається або видаляється один елемент?',
    hint: 'Compress values, sort queries за Mo order і підтримуй freq та [L,R].',
    firstApproach: [
      p(
        'Для кожного query створювати set елементів range або очищати frequency array.',
      ),
    ],
    approachReview:
      'Сумарна довжина ranges може бути O(nq). Standard Segment Tree не має компактного merge для множини різних values.',
    observation: [
      p(
        'Запити offline: переставимо їх так, щоб сусідні ranges відрізнялися небагатьма рухами меж, і підтримуватимемо distinct локально.',
      ),
    ],
    algorithm: [
      'Compress a[i].',
      'Збережи queries з original id і відсортуй Mo order.',
      'Підтримуй inclusive [L,R], freq і distinct через add/remove.',
      'Запиши answer[id], потім виведи за id.',
    ],
    proof:
      'Функції add/remove підтримують freq рівно для поточного [L,R], а distinct — кількість додатних частот. Порядок обробки не змінює значення кожного query, бо результат записується за його original id.',
    complexity: 'При block≈√n — O((n+q)√n) рухів та O(n+q) пам’яті.',
    solution: cpp(
      `    struct Query{int l,r,id;};int n,q;cin>>n>>q;vector<int>a(n),vals;for(int&i:a)cin>>i;vals=a;\n    sort(vals.begin(),vals.end());vals.erase(unique(vals.begin(),vals.end()),vals.end());for(int&x:a)x=lower_bound(vals.begin(),vals.end(),x)-vals.begin();\n    vector<Query> qs(q);for(int i=0;i<q;++i){cin>>qs[i].l>>qs[i].r;--qs[i].l;--qs[i].r;qs[i].id=i;}\n    int block=max(1,(int)sqrt(n));sort(qs.begin(),qs.end(),[&](auto A,auto B){int x=A.l/block,y=B.l/block;if(x!=y)return x<y;return (x&1)?A.r>B.r:A.r<B.r;});\n    vector<int>freq(vals.size()),ans(q);int L=0,R=-1,distinct=0;\n    auto add=[&](int i){if(freq[a[i]]++==0)++distinct;};auto rem=[&](int i){if(--freq[a[i]]==0)--distinct;};\n    for(auto qu:qs){while(L>qu.l)add(--L);while(R<qu.r)add(++R);while(L<qu.l)rem(L++);while(R>qu.r)rem(R--);ans[qu.id]=distinct;}\n    for(int x:ans)cout<<x<<'\n';`,
    ),
    takeaway:
      'Offline order + coordinate compression + sliding add/remove = Mo. Перестановка queries оптимізує рух, а id відновлює порядок відповідей.',
  }),
  practice('offline-processing', {
    id: 'static-rmq',
    title: 'Статичний RMQ',
    statement: ['Масив не змінюється. Для кожного [l,r] знайди minimum.'],
    input: 'n,q,array і ranges.',
    output: 'Minimum.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [example('5 2\n7 2 9 1 5\n2 4\n3 5', '1\n1')],
    hint: 'Sparse Table: precompute min blocks 2^k; query двома overlapping blocks довжини 2^floor(log len).',
  }),
  practice('offline-processing', {
    id: 'huge-coordinate-queries',
    title: 'Запити з великими координатами',
    statement: [
      'Операції ADD x додають точку з координатою x, COUNT x питає кількість доданих точок із координатою ≤x. Усі координати команд відомі наперед.',
    ],
    input: 'q і команди.',
    output: 'Кількість для COUNT.',
    constraints: ['1 ≤ q ≤ 200000', '|x| ≤ 10¹⁸'],
    examples: [
      example(
        '5\nADD 1000000000\nADD -5\nCOUNT 0\nADD 7\nCOUNT 1000000000',
        '1\n3',
      ),
    ],
    hint: 'Збери всі x, compress, потім Fenwick frequencies; для COUNT використовуй upper_bound.',
  }),
  practice('offline-processing', {
    id: 'equal-pairs-range',
    title: 'Однакові пари на відрізку',
    level: 'advanced',
    statement: [
      'Для кожного static range [l,r] порахуй пари позицій i<j з a[i]=a[j].',
    ],
    input: 'n,q,array і ranges.',
    output: 'Кількість пар.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [example('5 2\n1 2 1 1 2\n1 5\n2 4', '4\n1')],
    hint: 'Mo: при add value з поточною частотою f виникає f нових пар; при remove спочатку зменш freq, потім відніми нове f.',
  }),
];
