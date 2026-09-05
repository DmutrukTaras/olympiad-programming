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

const dsuCode = `struct DSU {
    vector<int> parent, size;
    DSU(int n) : parent(n), size(n, 1) { iota(parent.begin(), parent.end(), 0); }
    int find(int v) { return v == parent[v] ? v : parent[v] = find(parent[v]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (size[a] < size[b]) swap(a, b);
        parent[b] = a; size[a] += size[b];
        return true;
    }
};`;

export const treePatterns = [
  pattern({
    id: 'rooted-tree-euler',
    chapterId: 'ch-15',
    title: 'Rooted Tree / Subtree / Euler Tour',
    description:
      'Вкорінюємо дерево, визначаємо parent і children, агрегуємо піддерева та перетворюємо кожне піддерево на неперервний відрізок масиву.',
    intuition: [
      p(
        'У дереві між двома вершинами є рівно один простий шлях. Після вибору root кожне ребро отримує напрямок parent→child, а відповідь батька часто складається з відповідей дітей.',
      ),
      visual('euler-tour'),
    ],
    modeling: [
      table(
        ['Умова', 'Деревна модель'],
        [
          ['Ієрархія керівників', 'parent і children'],
          ['Усі підлеглі v', 'subtree(v)'],
          ['Запит до піддерева', 'Euler interval [tin, tout]'],
          ['Відстань від root', 'depth або weighted distance'],
        ],
      ),
      note(
        'Переформулювання',
        'Tree subtree query → Euler Tour → Array range query. Після цього можна застосувати Prefix, Fenwick або Segment Tree залежно від оновлень.',
      ),
    ],
    priorKnowledge: [
      'Graphs → DFS/BFS',
      'Foundation → Prefix',
      'Нове → parent, subtree, tin/tout',
    ],
    recognitionSigns: [
      'Граф зв’язний, має n−1 ребро або прямо названий деревом.',
      'Потрібна інформація про descendants, ancestors чи піддерева.',
      'Відповідь вершини можна скласти після обчислення дітей.',
    ],
    constraintSignals: [
      'DFS/BFS дерева — O(n).',
      'n до 200000 може переповнити recursive call stack; iterative traversal безпечніший.',
      'n−1 ребро саме по собі не гарантує дерево без зв’язності.',
    ],
    notApplicableSigns: [
      'У графі є цикл або кілька шляхів між вершинами.',
      'Піддерево змінюється через зміни root між запитами.',
      'Для довільних path queries одного Euler interval недостатньо.',
    ],
    knowledge: [
      p(
        'Root задає parent[v], depth[v] і children. Postorder означає “діти до батька” й потрібен для subtree DP. Preorder Euler нумерує вершину при вході; всі її descendants заходять до виходу.',
      ),
      table(
        ['Масив', 'Значення'],
        [
          ['parent[v]', 'попередня вершина на шляху до root'],
          ['depth[v]', 'кількість ребер від root'],
          ['subtree[v]', 'v плюс усі descendants'],
          ['tin[v], tout[v]', 'межі піддерева в Euler order'],
        ],
      ),
      note(
        'Два Euler tours',
        'Для subtree queries достатньо записати кожну вершину один раз. Для path/LCA задач інколи записують входи й виходи; не змішуй ці представлення.',
      ),
    ],
    cppNotes: [
      code(
        'vector<int> parent(n, -1), order{0};\nfor (int i = 0; i < (int)order.size(); ++i) {\n    int v = order[i];\n    for (int to : tree[v]) if (to != parent[v]) {\n        parent[to] = v;\n        order.push_back(to);\n    }\n}\nvector<int> subtree(n, 1);\nfor (int i = n - 1; i > 0; --i)\n    subtree[parent[order[i]]] += subtree[order[i]];',
        'Iterative preorder + reverse postorder',
      ),
      code(
        'void dfs(int v, int p) {\n    tin[v] = timer++;\n    for (int to : tree[v]) if (to != p) dfs(to, v);\n    tout[v] = timer - 1;\n}',
        'Euler interval, якщо recursion depth безпечна',
      ),
    ],
    theory: [
      p(
        'Після DFS усі descendants v відвідані між входом tin[v] і виходом tout[v], а жодна зовнішня вершина не може вклинитися: DFS завершує поточну гілку перед поверненням. Тому subtree — неперервний interval.',
      ),
      note(
        'Накопичення з дітей',
        'Формула subtree[v] = 1 + Σ subtree[to] коректна, бо піддерева різних дітей не перетинаються й разом із v утворюють усе піддерево v.',
      ),
    ],
    extensions: [
      {
        title: 'Depth, distances і запити на піддерево',
        blocks: [
          p(
            'Для weighted tree distance[to] = distance[v] + weight(v,to). Euler order дозволяє записати value[v] у position tin[v].',
          ),
          p(
            'Static subtree sum → Prefix. Point updates + subtree sum → Fenwick. Range updates або складніший merge → Segment Tree.',
          ),
          note(
            'Preview наступної глави',
            'Fenwick і Segment Tree вивчаються у главі 17; зараз важливо побачити саме переформулювання дерева в масив.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'dsu',
    chapterId: 'ch-15',
    title: 'DSU: компоненти, які змінюються',
    description:
      'Підтримуємо розбиття на компоненти, коли зв’язки лише додаються: find повертає представника, unite об’єднує дві групи.',
    intuition: [
      p(
        'DFS добре знаходить компоненти один раз. Якщо після кожного FRIEND треба відповідати ASK, нам не потрібні всі шляхи — достатньо знати representative компоненти.',
      ),
      visual('dsu'),
    ],
    modeling: [
      table(
        ['Операція з умови', 'DSU'],
        [
          ['Додати зв’язок a—b', 'unite(a,b)'],
          ['Чи в одній групі?', 'find(a) == find(b)'],
          ['Розмір групи', 'size[find(v)]'],
          ['Видалити ребро онлайн', 'звичайний DSU не підтримує'],
        ],
      ),
      note(
        'Модель монотонних компонент',
        'DSU працює, коли компоненти тільки зливаються. Для видалень інколи обробляють запити у зворотному порядку offline.',
      ),
    ],
    priorKnowledge: [
      'Graphs → компоненти',
      'Core → tree-like parent array',
      'Нове → path compression + union by size',
    ],
    recognitionSigns: [
      'Зв’язки поступово додаються.',
      'Багато запитів “чи належать до однієї групи?”.',
      'Потрібен representative або розмір поточної компоненти.',
    ],
    constraintSignals: [
      'n,q ≤ 200000 вимагає майже O(1) на операцію.',
      'Path compression і union by size дають O(α(n)) amortized.',
      'Без обох евристик parent-дерево може стати довгим.',
    ],
    notApplicableSigns: [
      'Потрібно видаляти довільні ребра online.',
      'Потрібна довжина або сам шлях між вершинами.',
      'Компоненти мають напрямлену досяжність.',
    ],
    knowledge: [
      p(
        'Кожна компонента представлена rooted parent-tree. Корінь parent[v]=v є representative. find підіймається до кореня; path compression перепідвішує шлях прямо до нього.',
      ),
      table(
        ['Евристика', 'Навіщо'],
        [
          ['Path compression', 'стискає шлях після find'],
          ['Union by size/rank', 'менше дерево підвішує під більше'],
          ['size[root]', 'метадані зберігаємо лише в representative'],
        ],
      ),
      note(
        'α(n)',
        'Обернена функція Акермана росте настільки повільно, що для практичних розмірів операція DSU поводиться майже як константна.',
      ),
    ],
    cppNotes: [
      code(dsuCode, 'Повний базовий DSU'),
      note(
        'unite повертає bool',
        'true означає, що компоненти були різні й справді злилися. Це зручно для Kruskal і підрахунку компонент.',
      ),
    ],
    theory: [
      p(
        'find(v) завжди повертає корінь поточного parent-tree. unite змінює parent лише одного root, отже точно зливає дві цілі компоненти й не розриває наявні зв’язки.',
      ),
      note(
        'Що зберігати в root',
        'Крім size можна тримати sum, minimum, maximum або інші метадані компоненти й оновлювати їх під час успішного unite.',
      ),
    ],
    extensions: [
      {
        title: 'Offline connectivity із видаленнями',
        blocks: [
          p(
            'Якщо ребра лише видаляються, прочитай усі запити, почни з фінального графа й обробляй час назад: DELETE перетворюється на ADD, який підтримує DSU.',
          ),
          note(
            'Обмеження прийому',
            'Зворотна обробка працює, коли відповіді можна відновити offline й кожне видалення має однозначний момент повернення.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'minimum-spanning-tree',
    chapterId: 'ch-15',
    title: 'Minimum Spanning Tree: Kruskal + DSU',
    description:
      'З’єднуємо всі вершини n−1 ребром мінімальної сумарної вартості: sorting задає порядок, DSU не дозволяє створити цикл.',
    intuition: [
      p(
        'Дешеве ребро варто взяти, якщо воно з’єднує дві ще різні компоненти. Якщо кінці вже зв’язані, ребро лише створить цикл і не потрібне для spanning tree.',
      ),
      visual('kruskal'),
    ],
    modeling: [
      table(
        ['Постановка', 'Що оптимізуємо'],
        [
          ['Shortest path s→t', 'вартість одного маршруту'],
          ['Minimum spanning tree', 'вартість усієї зв’язної мережі'],
          ['n−1 ребро без циклів', 'spanning tree'],
          ['Граф незв’язний', 'MST не існує; можлива minimum forest'],
        ],
      ),
      note(
        'Комбінація',
        'Foundation → Sorting. Поточна глава → DSU. Нова ідея → cut property. Разом це Kruskal.',
      ),
    ],
    priorKnowledge: [
      'Foundation → Sorting',
      'Combination → DSU',
      'Нове → cut property і MST',
    ],
    recognitionSigns: [
      'Потрібно з’єднати всі об’єкти мінімальною загальною ціною.',
      'Можна обрати підмножину можливих кабелів/доріг.',
      'Зайві цикли не дають користі для зв’язності.',
    ],
    constraintSignals: [
      'Сортування E ребер дає O(E log E).',
      'Для answer використовуй long long.',
      'Після Kruskal має бути обрано n−1 ребро, інакше граф незв’язний.',
    ],
    notApplicableSigns: [
      'Потрібен найкоротший маршрут від конкретного джерела.',
      'Потрібен directed arborescence — звичайний Kruskal не працює.',
      'Є додаткові обмеження на степені чи типи ребер.',
    ],
    knowledge: [
      p(
        'Cut — поділ вершин на дві групи. Cut property: найдешевше ребро, що перетинає будь-який cut, можна включити до деякого MST. Компоненти DSU задають саме такі cuts під час Kruskal.',
      ),
      table(
        ['Крок Kruskal', 'Причина'],
        [
          [
            'Sort edges by weight',
            'спершу бачимо найдешевший безпечний зв’язок',
          ],
          ['find(u) != find(v)', 'ребро не створює цикл'],
          ['unite(u,v)', 'компоненти тепер з’єднані'],
          ['chosen == n−1', 'отримано spanning tree'],
        ],
      ),
    ],
    cppNotes: [
      code(
        'struct Edge { long long w; int u, v; };\nsort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) { return a.w < b.w; });\nlong long answer = 0; int chosen = 0;\nfor (auto [w, u, v] : edges) {\n    if (dsu.unite(u, v)) { answer += w; ++chosen; }\n}',
        'Kruskal поверх DSU',
      ),
      note(
        'Від’ємні ваги дозволені',
        'MST не потребує невід’ємності: Kruskal просто візьме корисні від’ємні ребра першими.',
      ),
    ],
    theory: [
      p(
        'Коли Kruskal бере найдешевше ребро між двома компонентами, воно є найдешевшим на cut однієї з них. За cut property цей вибір сумісний з деяким MST. Індуктивно всі вибори можна продовжити до оптимального дерева.',
      ),
      note(
        'Рівні ваги',
        'MST може бути не єдиним. Будь-який порядок ребер однакової ваги дає правильну мінімальну суму.',
      ),
    ],
    extensions: [
      {
        title: 'Prim як альтернативний погляд',
        blocks: [
          p(
            'Kruskal глобально сортує всі ребра й зливає forest. Prim стартує з однієї вершини та щоразу додає найдешевше ребро з поточного дерева назовні.',
          ),
          table(
            ['Kruskal', 'Prim'],
            [
              ['Зручно зі списком ребер', 'Зручно з adjacency list'],
              ['Sorting + DSU', 'Priority Queue'],
              ['Будує forest, що зливається', 'Розширює одне дерево'],
            ],
          ),
        ],
      },
    ],
  }),
];

export const treeTasks = [
  learning('rooted-tree-euler', {
    id: 'team-size',
    title: 'Розмір команди',
    statement: [
      'Компанія має структуру дерева з коренем 1. Для кожного працівника знайди кількість працівників у його піддереві разом із ним.',
    ],
    input: 'n і n−1 ненапрямлених ребер дерева.',
    output: 'n розмірів піддерев.',
    constraints: ['1 ≤ n ≤ 200000'],
    examples: [example('6\n1 2\n1 3\n2 4\n2 5\n3 6', '6 3 2 1 1 1')],
    tryYourself:
      'Якщо відповіді всіх дітей уже відомі, як порахувати відповідь батька?',
    hint: 'Побудуй parent і order, потім оброби order у зворотному напрямку.',
    firstApproach: [
      p('Для кожної вершини окремо запускати DFS і рахувати її descendants.'),
    ],
    approachReview:
      'Одна й та сама нижня частина дерева обходиться для багатьох ancestors: O(n²).',
    observation: [
      p(
        'Піддерева дітей не перетинаються, тому subtree[v] = 1 + сума subtree[child]. Потрібен порядок “діти до батька”.',
      ),
      visual('euler-tour'),
    ],
    algorithm: [
      'Від root побудуй parent і preorder order.',
      'Ініціалізуй subtree[v]=1.',
      'Іди order справа наліво й додавай subtree[v] до parent[v].',
      'Виведи масив.',
    ],
    proof:
      'У зворотному preorder кожна дитина стоїть раніше свого батька при обробці, тож її повний subtree вже готовий. Додавання всіх неперетинних дитячих піддерев і самої v дає точний розмір.',
    complexity: 'O(n) часу й пам’яті.',
    solution: cpp(
      `    int n; cin>>n; vector<vector<int>> tree(n);\n    for(int i=1,u,v;i<n;++i){cin>>u>>v;--u;--v;tree[u].push_back(v);tree[v].push_back(u);}\n    vector<int> parent(n,-1), order{0}; parent[0]=0;\n    for(int i=0;i<(int)order.size();++i){int v=order[i];for(int to:tree[v]) if(parent[to]==-1){parent[to]=v;order.push_back(to);}}\n    vector<int> subtree(n,1);\n    for(int i=n-1;i>0;--i){int v=order[i];subtree[parent[v]]+=subtree[v];}\n    for(int i=0;i<n;++i){if(i)cout<<' ';cout<<subtree[i];}cout<<'\n';`,
    ),
    takeaway:
      'Вкорінення дає parent/children, а postorder дозволяє один раз агрегувати відповіді від дітей до батька.',
  }),
  practice('rooted-tree-euler', {
    id: 'subtree-sum',
    title: 'Сума піддерева',
    statement: [
      'Кожна вершина дерева має value. Для кожної вершини знайди суму values у її піддереві відносно root 1.',
    ],
    input: 'n, values і n−1 ребер.',
    output: 'n сум.',
    constraints: ['1 ≤ n ≤ 200000', '|value| ≤ 10⁹'],
    examples: [example('5\n2 4 1 3 5\n1 2\n1 3\n2 4\n2 5', '15 12 1 3 5')],
    hint: 'Той самий reverse order, але початково sum[v] = value[v]. Потрібен long long.',
  }),
  practice('rooted-tree-euler', {
    id: 'subtree-online-sum',
    title: 'Запити на піддерево',
    statement: [
      'Є rooted tree та values. Операції SET v x змінюють value[v], SUM v питає суму піддерева v.',
    ],
    input: 'n, q, values, edges і q команд.',
    output: 'Відповідь для кожної SUM.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [example('3 3\n1 2 3\n1 2\n1 3\nSUM 1\nSET 2 5\nSUM 1', '6\n9')],
    hint: 'Euler Tour перетворює subtree(v) на [tin[v],tout[v]]. Далі потрібен point update + range sum — Fenwick із глави 17.',
  }),
  practice('rooted-tree-euler', {
    id: 'root-distances',
    title: 'Відстані від кореня',
    statement: [
      'Ребра дерева мають ваги. Знайди distance від root 1 до кожної вершини.',
    ],
    input: 'n і n−1 ребер u v w.',
    output: 'n відстаней.',
    constraints: ['1 ≤ n ≤ 200000', '0 ≤ w ≤ 10⁹'],
    examples: [example('4\n1 2 5\n1 3 2\n3 4 7', '0 5 2 9')],
    hint: 'Є рівно один шлях: під час DFS/BFS distance[to] = distance[v] + w.',
  }),

  learning('dsu', {
    id: 'friend-network',
    title: 'Мережа друзів',
    statement: [
      'Спочатку n людей не пов’язані. FRIEND a b об’єднує їхні групи друзів, ASK a b питає, чи вони в одній групі.',
    ],
    input: 'n, q і q команд.',
    output: 'YES/NO для кожної ASK.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [
      example(
        '5 5\nFRIEND 1 2\nASK 1 3\nFRIEND 2 3\nASK 1 3\nASK 4 5',
        'NO\nYES\nNO',
      ),
    ],
    tryYourself:
      'Чи потрібні самі шляхи між друзями, чи лише ідентифікатор компоненти?',
    hint: 'FRIEND → unite, ASK → порівняти find.',
    firstApproach: [
      p('Зберігати всі ребра й після кожного ASK запускати DFS.'),
    ],
    approachReview:
      'До q повних обходів дають O(q(n+q)). Компоненти тільки зливаються, тому можна підтримувати їх напряму.',
    observation: [
      p(
        'Representative стисло описує всю потрібну інформацію: find(a)==find(b) рівно тоді, коли група спільна.',
      ),
      visual('dsu'),
    ],
    algorithm: [
      'Створи DSU з n singleton-компонент.',
      'FRIEND: unite(a,b).',
      'ASK: порівняй find(a) і find(b).',
    ],
    proof:
      'Спочатку DSU відповідає графу без ребер. Кожен FRIEND зливає рівно компоненти кінців нового ребра; якщо вони вже однакові, нічого не змінюється. Індуктивно DSU-компоненти збігаються з компонентами графа після кожної команди.',
    complexity: 'O((n+q) α(n)) часу й O(n) пам’яті.',
    solution: cpp(
      `    ${dsuCode}\n    int n,q;cin>>n>>q;DSU dsu(n);\n    while(q--){string op;int a,b;cin>>op>>a>>b;--a;--b;\n        if(op=="FRIEND") dsu.unite(a,b);\n        else cout<<(dsu.find(a)==dsu.find(b)?"YES\n":"NO\n");\n    }`,
    ),
    takeaway:
      'Коли змінний граф потрібен лише як розбиття на компоненти й ребра додаються, DSU замінює повторні обходи.',
  }),
  practice('dsu', {
    id: 'merge-cities',
    title: 'Об’єднання міст',
    statement: [
      'Операції ROAD a b додають дорогу, COUNT питає поточну кількість компонент.',
    ],
    input: 'n, q і команди.',
    output: 'Число для кожної COUNT.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [
      example('4 5\nCOUNT\nROAD 1 2\nROAD 2 3\nCOUNT\nCOUNT', '4\n2\n2'),
    ],
    hint: 'Почни components=n і зменшуй лише коли unite повернув true.',
  }),
  practice('dsu', {
    id: 'group-size',
    title: 'Розмір групи',
    statement: [
      'Після операцій UNION a b треба відповідати SIZE v — розмір компоненти v.',
    ],
    input: 'n, q і команди.',
    output: 'Розмір для кожної SIZE.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [example('5 4\nUNION 1 2\nUNION 2 3\nSIZE 1\nSIZE 4', '3\n1')],
    hint: 'Метадані size коректні лише для root: size[find(v)].',
  }),
  practice('dsu', {
    id: 'reverse-connectivity',
    title: 'Зворотна зв’язність',
    statement: [
      'Є граф і список ребер, які по одному видаляють. Після кожного видалення знайди кількість компонент. Усі видалення відомі наперед.',
    ],
    input: 'n, m, порядок видалення всіх m ребер.',
    output: 'm кількостей компонент.',
    constraints: ['1 ≤ n,m ≤ 200000'],
    examples: [example('3 2\n1 2\n2 3\n1 2', '2 3')],
    hint: 'Почни з порожнього фінального графа й додавай ребра у зворотному порядку, записуючи відповіді назад.',
  }),

  learning('minimum-spanning-tree', {
    id: 'optical-network',
    title: 'Оптична мережа',
    statement: [
      'Є n міст і m можливих двосторонніх кабелів із ціною. З’єднай усі міста мінімальною сумарною ціною або виведи IMPOSSIBLE.',
    ],
    input: 'n, m і m ребер u v cost.',
    output: 'Вартість MST або IMPOSSIBLE.',
    constraints: ['1 ≤ n,m ≤ 200000', '|cost| ≤ 10⁹'],
    examples: [example('4 5\n1 2 2\n2 3 3\n1 3 4\n3 4 6\n2 4 9', '11')],
    tryYourself:
      'Розглядай кабелі за ціною. Коли найдешевший кабель уже не покращує зв’язність?',
    hint: 'Якщо find(u)==find(v), ребро створює цикл і його можна пропустити.',
    firstApproach: [
      p('Перебрати всі набори з n−1 ребра й перевірити зв’язність.'),
    ],
    approachReview:
      'Кількість підмножин експоненційна. Потрібен безпечний локальний вибір найдешевшого ребра між компонентами.',
    observation: [
      p(
        'Sorting + DSU = Kruskal: DSU відповідає, чи ребро з’єднує різні компоненти.',
      ),
      visual('kruskal'),
    ],
    algorithm: [
      'Відсортуй ребра за cost.',
      'Для кожного ребра: якщо unite успішний, додай cost і збільш chosen.',
      'Після проходу перевір chosen==n−1.',
    ],
    proof:
      'Кожне вибране ребро є найдешевшим, що перетинає cut поточної компоненти. За cut property його можна включити до деякого MST. Вибрані ребра не утворюють циклу; n−1 успішних злиттів дають spanning tree мінімальної вартості.',
    complexity: 'O(m log m) часу й O(n+m) пам’яті.',
    solution: cpp(
      `    ${dsuCode}\n    struct Edge{long long w;int u,v;};int n,m;cin>>n>>m;vector<Edge> e(m);\n    for(auto &x:e){cin>>x.u>>x.v>>x.w;--x.u;--x.v;}\n    sort(e.begin(),e.end(),[](const Edge&a,const Edge&b){return a.w<b.w;});\n    DSU dsu(n);long long answer=0;int chosen=0;\n    for(auto [w,u,v]:e) if(dsu.unite(u,v)){answer+=w;++chosen;}\n    if(chosen!=n-1) cout<<"IMPOSSIBLE\n"; else cout<<answer<<'\n';`,
    ),
    takeaway:
      'Kruskal — явна комбінація sorting, cut property та DSU-перевірки циклу.',
  }),
  practice('minimum-spanning-tree', {
    id: 'country-roads',
    title: 'Дороги країни',
    statement: [
      'Знайди вагу MST неорієнтованого графа або −1, якщо з’єднати всі вершини неможливо.',
    ],
    input: 'n, m і weighted edges.',
    output: 'Вага або −1.',
    constraints: ['1 ≤ n,m ≤ 200000'],
    examples: [example('3 1\n1 2 5', '-1')],
    hint: 'Недостатньо отримати деяку суму — перевір кількість успішно вибраних ребер.',
  }),
  practice('minimum-spanning-tree', {
    id: 'cable-savings',
    title: 'Економія кабелю',
    statement: [
      'Усі наявні кабелі оплачуються. Можна вимкнути частину, лишивши мережу зв’язною. Знайди максимальну економію.',
    ],
    input: 'n, m і невід’ємні вартості ребер; граф зв’язний.',
    output: 'sum(all edges) − MST.',
    constraints: ['1 ≤ n,m ≤ 200000', '0 ≤ w ≤ 10⁹'],
    examples: [example('3 3\n1 2 4\n2 3 2\n1 3 10', '10')],
    hint: 'Оптимальна залишена мережа — MST. Обчисли total під час читання.',
  }),
  practice('minimum-spanning-tree', {
    id: 'prebuilt-connections',
    title: 'Вже побудовані з’єднання',
    statement: [
      'Деякі пари міст уже з’єднані безкоштовно. Для решти можливих кабелів відомі ціни. Знайди мінімальну додаткову вартість повної зв’язності.',
    ],
    input: 'n, k безкоштовних пар, m платних ребер.',
    output: 'Мінімальна додаткова ціна або −1.',
    constraints: ['1 ≤ n,k,m ≤ 200000'],
    examples: [example('4 1 3\n1 2\n2 3 5\n3 4 2\n1 4 10', '7')],
    hint: 'Перед Kruskal зроби unite для всіх уже побудованих пар, не додаючи вартості.',
  }),
];
