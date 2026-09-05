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

export const graphPatterns = [
  pattern({
    id: 'graph-traversal',
    chapterId: 'ch-14',
    title: 'DFS / BFS та компоненти',
    description:
      'Перетворюємо об’єкти й допустимі переходи на вершини та ребра, а одним обходом знаходимо всю досяжну компоненту.',
    intuition: [
      p(
        'Граф виникає всюди, де є об’єкти та зв’язки: міста й дороги, клітинки й дозволені кроки, користувачі й дружба. Для простого обходу DFS і BFS часто взаємозамінні.',
      ),
      visual('graph-grid'),
      table(
        ['Потрібно', 'Частіше обираємо'],
        [
          ['Обійти компоненту', 'DFS або BFS'],
          ['Shortest path без ваг', 'BFS'],
          ['Рекурсивно агрегувати структуру', 'DFS'],
          ['Поширити хвилю від джерел', 'BFS'],
        ],
      ),
    ],
    modeling: [
      table(
        ['Фрагмент умови', 'Графова модель'],
        [
          ['Вільна клітинка', 'Вершина'],
          ['Перехід по стороні', 'Ребро'],
          ['Стан системи', 'Вершина станів'],
          ['Допустима операція', 'Напрямлене ребро-перехід'],
        ],
      ),
      note(
        'Не завжди будуй graph',
        'Для grid сусідів можна генерувати на льоту за чотирма напрямками. Це простіше й економить пам’ять.',
      ),
    ],
    priorKnowledge: [
      'Foundation → матриці й межі індексів',
      'Core → queue',
      'Нове → graph traversal',
    ],
    recognitionSigns: [
      'Потрібно знайти досяжність, компоненту, область або кількість груп.',
      'Є локальні переходи між станами чи клітинками.',
      'Після потрапляння в об’єкт треба відвідати все, що з нього досяжне.',
    ],
    constraintSignals: [
      'Adjacency list дає O(V + E), matrix графа — O(V²) пам’яті.',
      'Для grid V = n·m, а ребер лише O(nm).',
      'Глибокий recursive DFS може переповнити stack; iterative DFS/BFS безпечніший.',
    ],
    notApplicableSigns: [
      'Потрібен найкоротший шлях із різними вагами.',
      'Компоненти змінюються після багатьох додавань ребер — перевір DSU.',
      'Потрібно оптимізувати шлях, а не лише знайти досяжність.',
    ],
    knowledge: [
      p(
        'Adjacency list graph[v] зберігає сусідів v. Масив used гарантує, що кожну вершину обробимо один раз. У ненапрямленому графі кожне ребро додають в обидва списки.',
      ),
      table(
        ['Граф', 'Як додати ребро u—v'],
        [
          ['Ненапрямлений', 'g[u].push_back(v) і g[v].push_back(u)'],
          ['Напрямлений u→v', 'лише g[u].push_back(v)'],
          ['Grid', 'перевірити 4 або 8 сусідів на льоту'],
        ],
      ),
      note(
        'Позначай до push',
        'У BFS став used[to] = true до q.push(to), інакше одна вершина може потрапити в чергу багато разів.',
      ),
    ],
    cppNotes: [
      code(
        'vector<vector<int>> graph(n);\nvector<char> used(n, false);\nqueue<int> q;\nq.push(start);\nused[start] = true;\nwhile (!q.empty()) {\n    int v = q.front(); q.pop();\n    for (int to : graph[v]) if (!used[to]) {\n        used[to] = true;\n        q.push(to);\n    }\n}',
        'BFS однієї компоненти',
      ),
      code(
        'const int dr[4] = {-1, 1, 0, 0};\nconst int dc[4] = {0, 0, -1, 1};\nfor (int d = 0; d < 4; ++d) {\n    int nr = r + dr[d], nc = c + dc[d];\n    if (0 <= nr && nr < n && 0 <= nc && nc < m) { /* ... */ }\n}',
        'Сусіди клітинки',
      ),
    ],
    theory: [
      p(
        'Інваріант обходу: всі елементи queue/stack уже відкриті, але ще не повністю оброблені; used містить відкриті й завершені вершини. Коли структура спорожніла, від старту не лишилося недосліджених переходів.',
      ),
      note(
        'Чому O(V + E)',
        'Кожна вершина відкривається один раз, а кожен запис adjacency list переглядається один раз. У ненапрямленому графі ребро записане двічі, що не змінює асимптотику.',
      ),
    ],
    extensions: [
      {
        title: 'Bipartite Graph, cycle detection та Euler trail',
        blocks: [
          p(
            'Bipartite перевіряємо фарбуванням 0/1 під час BFS: кожен сусід отримує протилежний колір; ребро між однаковими кольорами означає конфлікт.',
          ),
          p(
            'Cycle detection додає стан вершини або parent. Euler path відповідає іншому питанню — пройти кожне ребро рівно раз — і використовує степені та алгоритм Гієргольцера.',
          ),
          note(
            'Не змішуй цілі',
            'Обхід є базовим механізмом, але критерій bipartite, cycle чи Euler trail потрібно вивести окремо.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'shortest-paths',
    chapterId: 'ch-14',
    title: 'Shortest Paths',
    description:
      'Спершу визначаємо модель ваг, а вже потім обираємо BFS, 0-1 BFS, Dijkstra або алгоритм для від’ємних ребер.',
    intuition: [
      p(
        'Shortest path — не назва одного алгоритму. BFS мінімізує кількість ребер, Dijkstra — суму невід’ємних ваг, а 0-1 BFS використовує особливість лише двох ваг.',
      ),
      visual('shortest-paths'),
    ],
    modeling: [
      table(
        ['Ваги / масштаб', 'Алгоритм'],
        [
          ['Усі переходи коштують 1', 'BFS'],
          ['Лише 0 або 1', '0-1 BFS'],
          ['Будь-які w ≥ 0', 'Dijkstra'],
          ['Є w < 0', 'Bellman–Ford / спеціальна модель'],
          ['Малий n, усі пари', 'Floyd–Warshall'],
        ],
      ),
      note(
        'Вага — це те, що мінімізуємо',
        'Дорога може мати довжину, час і ціну. Вершини й ребра однакові, але вибір ваги змінює відповідь.',
      ),
    ],
    priorKnowledge: [
      'Core → queue, deque, priority_queue',
      'Foundation → long long',
      'Нове → relaxation',
    ],
    recognitionSigns: [
      'Потрібна мінімальна вартість, час або кількість переходів.',
      'Шлях складається з локальних ребер із відомою ціною.',
      'Відповідь до багатьох вершин має спільне джерело.',
    ],
    constraintSignals: [
      'Для n,m ≤ 200000 adjacency list і O((V+E) log V) прийнятні.',
      'dist може перевищувати int; використовуй long long і великий INF.',
      'Floyd O(V³) підходить лише для малого V.',
    ],
    notApplicableSigns: [
      'Dijkstra некоректний із від’ємними вагами.',
      'BFS із різними вагами мінімізує число ребер, не суму ваг.',
      'Якщо стан шляху залежить від ресурсу чи маски, вершина має включати цей стан.',
    ],
    knowledge: [
      p(
        'Relaxation перевіряє, чи шлях до to через v кращий: dist[v] + w < dist[to]. У Dijkstra priority_queue завжди пропонує найменшу відому відстань.',
      ),
      table(
        ['Термін', 'Значення'],
        [
          ['dist[v]', 'найкраща вже відома вартість s→v'],
          ['relax edge', 'спроба покращити dist[to]'],
          ['stale entry', 'старий запис у heap, який треба пропустити'],
          ['parent[to]', 'попередник для відновлення шляху'],
        ],
      ),
      note(
        'Невід’ємність — гарантія',
        'Коли Dijkstra дістає мінімальну актуальну dist[v], майбутній шлях через ще дальші вершини не може зробити її меншою, бо всі додані ваги невід’ємні.',
      ),
    ],
    cppNotes: [
      code(
        'using Edge = pair<int, int>; // {to, weight}\nvector<vector<Edge>> graph(n);\nconst long long INF = 4e18;\nvector<long long> dist(n, INF);\npriority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<pair<long long,int>>> pq;\ndist[s] = 0; pq.push({0, s});\nwhile (!pq.empty()) {\n    auto [d, v] = pq.top(); pq.pop();\n    if (d != dist[v]) continue;\n    for (auto [to, w] : graph[v]) if (d + w < dist[to]) {\n        dist[to] = d + w;\n        pq.push({dist[to], to});\n    }\n}',
        'Dijkstra зі stale-entry check',
      ),
    ],
    theory: [
      p(
        'Dijkstra підтримує множину завершених найкоротших відстаней. Мінімальна актуальна вершина не може отримати кращий шлях через незавершену: до такої вершини вже не менша відстань, а ребро додає w ≥ 0.',
      ),
      note(
        'Не плутай shortest path і MST',
        'Shortest path оптимізує маршрут від джерела. MST мінімізує сумарну вартість мережі; шлях у MST може бути не найкоротшим.',
      ),
    ],
    extensions: [
      {
        title: 'Multi-source BFS, 0-1 BFS, Bellman–Ford і Floyd',
        blocks: [
          table(
            ['Варіація', 'Що змінюється'],
            [
              [
                'Multi-source BFS',
                'У queue спочатку кладемо всі джерела з dist=0',
              ],
              ['0-1 BFS', 'Вага 0 → push_front, вага 1 → push_back'],
              [
                'Bellman–Ford',
                'Релаксуємо всі ребра V−1 разів; працює з negative weights',
              ],
              ['Floyd–Warshall', 'dp[i][j] для all-pairs, O(V³)'],
            ],
          ),
          note(
            'Вибір від моделі',
            'Це не набір взаємозамінних шаблонів. Тип ваг, кількість джерел і потрібні пари визначають правильний алгоритм.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'dag-topological-sort',
    chapterId: 'ch-14',
    title: 'DAG та Topological Sort',
    description:
      'Перетворюємо залежність «A перед B» на напрямлене ребро й будуємо порядок, у якому кожна передумова вже виконана.',
    intuition: [
      p(
        'Вершина з indegree = 0 не має невиконаних передумов. Після її видалення деякі сусіди теж можуть стати доступними.',
      ),
      visual('topological'),
    ],
    modeling: [
      table(
        ['Умова', 'Модель'],
        [
          ['Курс A потрібен до B', 'ребро A → B'],
          ['B залежить від A', 'ребро A → B'],
          ['Тривалість роботи', 'вага вершини'],
          ['Цикл залежностей', 'виконати все неможливо'],
        ],
      ),
      note(
        'Напрямок ребра',
        'Проговори його реченням: “після u можна виконувати v”. Більшість помилок у dependency-задачах — перевернуті ребра.',
      ),
    ],
    priorKnowledge: [
      'Core → queue',
      'Graphs → adjacency list',
      'Нове → indegree і topological order',
    ],
    recognitionSigns: [
      'Є prerequisites, build dependencies або порядок виконання.',
      'Потрібно знайти допустиму послідовність чи визначити цикл.',
      'DP-стани залежать лише від попередників.',
    ],
    constraintSignals: [
      'Kahn працює за O(V + E).',
      'Якщо потрібен лексикографічно найменший порядок, queue замінюємо min-heap.',
      'Порядок може бути не єдиним — задача має уточнити вимогу.',
    ],
    notApplicableSigns: [
      'У графі дозволені цикли й усе одно потрібен шлях — topological order не існує.',
      'Зв’язок не означає часову залежність.',
      'Для загального longest path із циклами DAG DP не працює.',
    ],
    knowledge: [
      p(
        'indegree[v] — кількість ребер, що входять у v. Kahn’s algorithm поступово видаляє нульові indegree. Якщо видалено менше V вершин, решта заблокована циклом.',
      ),
      table(
        ['Крок', 'Інваріант'],
        [
          ['Покласти indegree=0', 'усі передумови вже виконані'],
          ['Видалити v', 'додати v до порядку'],
          ['Зменшити indegree[to]', 'прибрати виконану залежність'],
          ['order.size() < n', 'існує directed cycle'],
        ],
      ),
    ],
    cppNotes: [
      code(
        'vector<int> indegree(n);\nqueue<int> q;\nfor (int v = 0; v < n; ++v) if (indegree[v] == 0) q.push(v);\nvector<int> order;\nwhile (!q.empty()) {\n    int v = q.front(); q.pop();\n    order.push_back(v);\n    for (int to : graph[v]) if (--indegree[to] == 0) q.push(to);\n}\nif ((int)order.size() != n) { /* cycle */ }',
        'Kahn’s algorithm',
      ),
    ],
    theory: [
      p(
        'Кожне додане до order v має нульовий indegree серед невиконаних вершин, тому всі його predecessors уже стоять раніше. Якщо черга спорожніла до n, у залишку кожна вершина має вхідне ребро; рухаючись назад, неминуче потрапимо в цикл.',
      ),
      note(
        'Graph + ordering + DP',
        'Topological order часто не фінальна відповідь, а правильний порядок обчислення DP: relax переходи від уже порахованої вершини до її successors.',
      ),
    ],
    extensions: [
      {
        title: 'Cycle detection і DP на DAG',
        blocks: [
          p(
            'DFS може знаходити directed cycle трьома кольорами: 0 — не бачили, 1 — у recursion stack, 2 — завершили. Ребро в колір 1 утворює цикл.',
          ),
          p(
            'У topological order можна рахувати shortest/longest path у DAG навіть з від’ємними вагами, бо кожен predecessor обробляється раніше.',
          ),
        ],
      },
    ],
  }),
];

export const graphTasks = [
  learning('graph-traversal', {
    id: 'islands',
    title: 'Острови',
    statement: [
      'Дано карту n × m: # — суша, . — вода. Дві клітинки суші належать одному острову, якщо між ними можна переходити по спільній стороні.',
      'Знайди кількість островів.',
    ],
    input: 'n, m і n рядків карти.',
    output: 'Кількість островів.',
    constraints: ['1 ≤ n,m', 'n·m ≤ 200000'],
    examples: [example('4 5\n##...\n.#..#\n...##\n#....', '3')],
    tryYourself:
      'Що повинно статися, коли зовнішній цикл уперше бачить невідвідану #?',
    hint: 'Збільш відповідь і одним BFS познач увесь острів.',
    firstApproach: [
      p('Для кожної пари клітинок окремо перевіряти, чи вони з’єднані.'),
    ],
    approachReview:
      'Зв’язність усередині того самого острова обчислювалася б багато разів. Один обхід має закрити всю компоненту.',
    observation: [
      p(
        'Невідвідана суша починає нову компоненту; BFS від неї відвідує рівно всі клітинки цього острова.',
      ),
      visual('graph-grid'),
    ],
    algorithm: [
      'Пройди всі клітинки.',
      'Для кожної невідвіданої # збільш answer.',
      'Запусти BFS, додаючи лише сусідню невідвідану сушу.',
      'Виведи answer.',
    ],
    proof:
      'Кожен BFS не виходить за межі одного острова, бо переходить лише між сусідніми #. Водночас він відвідує всю досяжну сушу. Тому зовнішній цикл запускає рівно один BFS на кожен острів.',
    complexity: 'O(nm) часу й O(nm) пам’яті.',
    solution: cpp(
      `    int n, m; cin >> n >> m;\n    vector<string> a(n); for (auto &row : a) cin >> row;\n    vector<vector<char>> used(n, vector<char>(m));\n    const int dr[4] = {-1, 1, 0, 0};\n    const int dc[4] = {0, 0, -1, 1};\n    int answer = 0;\n    for (int sr = 0; sr < n; ++sr) for (int sc = 0; sc < m; ++sc) {\n        if (a[sr][sc] != '#' || used[sr][sc]) continue;\n        ++answer; queue<pair<int,int>> q; q.push({sr, sc}); used[sr][sc] = true;\n        while (!q.empty()) {\n            auto [r, c] = q.front(); q.pop();\n            for (int d = 0; d < 4; ++d) {\n                int nr = r + dr[d], nc = c + dc[d];\n                if (0 <= nr && nr < n && 0 <= nc && nc < m && a[nr][nc] == '#' && !used[nr][nc]) {\n                    used[nr][nc] = true; q.push({nr, nc});\n                }\n            }\n        }\n    }\n    cout << answer << '\n';`,
    ),
    takeaway:
      'Grid стає неявним графом: клітинки — вершини, допустимі сусідні кроки — ребра, острів — компонента.',
  }),
  practice('graph-traversal', {
    id: 'labyrinth-reachability',
    title: 'Лабіринт',
    statement: [
      'На карті . — прохід, # — стіна, S — старт, T — ціль. Дозволені кроки по сторонах. Визнач, чи можна дістатися S→T.',
    ],
    input: 'n, m і карта.',
    output: 'YES або NO.',
    constraints: ['1 ≤ n·m ≤ 200000', 'S і T трапляються рівно раз'],
    examples: [example('3 5\nS.#..\n..#T.\n.....', 'YES')],
    hint: 'S і T теж прохідні клітинки. Зупинися, коли T відкрито.',
  }),
  practice('graph-traversal', {
    id: 'largest-region',
    title: 'Найбільша область',
    statement: [
      'Дано grid із малих літер. Область — максимальна множина клітинок з однаковою літерою, з’єднаних сторонами. Знайди найбільший розмір.',
    ],
    input: 'n, m і n рядків.',
    output: 'Максимальний розмір області.',
    constraints: ['1 ≤ n·m ≤ 200000'],
    examples: [example('3 4\naabb\naacb\ndccb', '4')],
    hint: 'Запускай BFS з кожної невідвіданої клітинки та рахуй розмір поточної компоненти.',
  }),
  practice('graph-traversal', {
    id: 'two-teams',
    title: 'Дві команди',
    statement: [
      'Ненапрямлений граф конфліктів треба розділити на дві команди так, щоб кожне ребро з’єднувало різні команди. Визнач можливість і виведи колір 1/2 для кожної вершини.',
    ],
    input: 'n, m і m ребер.',
    output: 'IMPOSSIBLE або n номерів команд.',
    constraints: ['1 ≤ n,m ≤ 200000'],
    examples: [example('4 3\n1 2\n2 3\n3 4', '1 2 1 2')],
    hint: 'Запускай BFS для кожної компоненти й призначай сусіду протилежний колір.',
  }),

  learning('shortest-paths', {
    id: 'delivery',
    title: 'Доставка',
    statement: [
      'Є n міст і m двосторонніх доріг із невід’ємним часом w. Знайди мінімальний час доставки з міста 1 до кожного міста.',
    ],
    input: 'n, m, потім m рядків u v w.',
    output: 'n відстаней; для недосяжної вершини −1.',
    constraints: ['1 ≤ n,m ≤ 200000', '0 ≤ w ≤ 10⁹'],
    examples: [example('4 4\n1 2 5\n1 3 2\n3 2 1\n2 4 3', '0 3 2 6')],
    tryYourself:
      'Чому BFS обере пряму дорогу 1→2 вагою 5 раніше за шлях 1→3→2 вагою 3?',
    hint: 'Потрібна priority_queue за dist, а не FIFO queue.',
    firstApproach: [
      p('Запустити звичайний BFS, вважаючи кожну дорогу одним кроком.'),
    ],
    approachReview:
      'BFS мінімізує кількість ребер. Різні часи означають, що шлях із двох доріг може бути дешевшим за одну.',
    observation: [
      p(
        'Усі ваги невід’ємні, тому найменшу актуальну відстань можна фіналізувати першою — це Dijkstra.',
      ),
      visual('shortest-paths'),
    ],
    algorithm: [
      'Ініціалізуй dist[1]=0, інші INF.',
      'Діставай мінімальну пару {distance, vertex} з heap.',
      'Пропускай stale entry.',
      'Relax усі ребра та додавай покращення в heap.',
    ],
    proof:
      'Коли актуальна вершина v має найменшу dist у heap, будь-який шлях до неї через ще необроблену вершину має вже не меншу вартість до тієї вершини та додає невід’ємне ребро. Отже dist[v] остаточна.',
    complexity: 'O((n+m) log n) часу й O(n+m) пам’яті.',
    solution: cpp(
      `    int n, m; cin >> n >> m;\n    vector<vector<pair<int,int>>> g(n);\n    while (m--) { int u,v,w; cin>>u>>v>>w; --u;--v; g[u].push_back({v,w}); g[v].push_back({u,w}); }\n    const long long INF = 4e18; vector<long long> dist(n, INF);\n    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<pair<long long,int>>> pq;\n    dist[0]=0; pq.push({0,0});\n    while(!pq.empty()){ auto [d,v]=pq.top(); pq.pop(); if(d!=dist[v]) continue;\n        for(auto [to,w]:g[v]) if(d+w<dist[to]){ dist[to]=d+w; pq.push({dist[to],to}); }\n    }\n    for(int i=0;i<n;++i){ if(i) cout<<' '; cout<<(dist[i]==INF ? -1 : dist[i]); } cout<<'\n';`,
    ),
    takeaway:
      'Алгоритм shortest path обирається за моделлю ваг; relaxation є спільною операцією, а структура визначає порядок обробки.',
  }),
  practice('shortest-paths', {
    id: 'priced-route',
    title: 'Маршрут із ціною',
    statement: [
      'У напрямленому графі з невід’ємними вагами знайди найменшу вартість маршруту s→t.',
    ],
    input: 'n, m, s, t і m ребер u v w.',
    output: 'Вартість або −1.',
    constraints: ['1 ≤ n,m ≤ 200000', '0 ≤ w ≤ 10⁹'],
    examples: [example('4 4 1 4\n1 2 7\n1 3 2\n3 2 1\n2 4 3', '6')],
    hint: 'Додавай лише g[u].push_back({v,w}); Dijkstra можна завершити, коли дістав актуальну t.',
  }),
  practice('shortest-paths', {
    id: 'zero-one-teleports',
    title: 'Телепорти 0/1',
    statement: [
      'У напрямленому графі ребра мають вагу 0 або 1. Знайди найкоротші відстані від s.',
    ],
    input: 'n, m, s і m ребер.',
    output: 'n відстаней або −1.',
    constraints: ['1 ≤ n,m ≤ 200000', 'w ∈ {0,1}'],
    examples: [example('4 4 1\n1 2 1\n1 3 0\n3 2 0\n2 4 1', '0 0 0 1')],
    hint: 'Використай deque: покращення через вагу 0 йде в front, через 1 — у back.',
  }),
  practice('shortest-paths', {
    id: 'nearest-hospital',
    title: 'Найближча лікарня',
    statement: [
      'Є неваговий граф і k лікарень. Для кожної вершини знайди мінімальну кількість ребер до будь-якої лікарні.',
    ],
    input: 'n, m, k, список лікарень і m ребер.',
    output: 'n відстаней.',
    constraints: ['1 ≤ n,m ≤ 200000', '1 ≤ k ≤ n'],
    examples: [example('5 4 2\n1 5\n1 2\n2 3\n3 4\n4 5', '0 1 2 1 0')],
    hint: 'Це multi-source BFS: спочатку поклади всі лікарні з dist=0 в одну queue.',
  }),

  learning('dag-topological-sort', {
    id: 'study-plan',
    title: 'План навчання',
    statement: [
      'Є n курсів і m залежностей a b: курс a треба пройти до b. Виведи будь-який допустимий порядок або IMPOSSIBLE.',
    ],
    input: 'n, m і m пар a b.',
    output: 'Перестановка курсів або IMPOSSIBLE.',
    constraints: ['1 ≤ n,m ≤ 200000'],
    examples: [
      example(
        '4 3\n1 2\n1 3\n3 4',
        '1 2 3 4',
        'Можливі й інші правильні порядки.',
      ),
    ],
    tryYourself:
      'Які курси можна поставити першими? Що змінюється після виконання одного з них?',
    hint: 'Починай з усіх indegree=0 і видаляй їхні вихідні залежності.',
    firstApproach: [
      p('Перебирати всі n! перестановок і перевіряти кожну залежність.'),
    ],
    approachReview:
      'Кількість порядків величезна. Достатньо щоразу брати будь-яку вершину без невиконаних prerequisites.',
    observation: [
      p(
        'indegree=0 означає, що курс уже можна проходити. Якщо таких курсів більше не лишилося, а порядок неповний, залежності містять цикл.',
      ),
      visual('topological'),
    ],
    algorithm: [
      'Порахуй indegree.',
      'Додай усі indegree=0 у queue.',
      'Діставай курс, додавай до order і зменшуй indegree його successors.',
      'Якщо order має n елементів — виведи; інакше IMPOSSIBLE.',
    ],
    proof:
      'Курс додається лише після всіх його predecessors, тому кожне ребро йде зліва направо. Якщо алгоритм зупинився рано, кожна невидалена вершина має predecessor у залишку; ланцюг у скінченному графі утворює цикл.',
    complexity: 'O(n+m) часу й пам’яті.',
    solution: cpp(
      `    int n,m; cin>>n>>m; vector<vector<int>> g(n); vector<int> in(n);\n    while(m--){int a,b;cin>>a>>b;--a;--b;g[a].push_back(b);++in[b];}\n    queue<int> q; for(int v=0;v<n;++v) if(in[v]==0) q.push(v); vector<int> order;\n    while(!q.empty()){int v=q.front();q.pop();order.push_back(v);for(int to:g[v]) if(--in[to]==0) q.push(to);}\n    if((int)order.size()!=n){cout<<"IMPOSSIBLE\n";return 0;}\n    for(int i=0;i<n;++i){if(i)cout<<' ';cout<<order[i]+1;}cout<<'\n';`,
    ),
    takeaway:
      'Dependency → directed edge; indegree=0 → можна виконувати; неповний Kahn order → cycle.',
  }),
  practice('dag-topological-sort', {
    id: 'build-order',
    title: 'Порядок збірки',
    statement: [
      'Модулі мають build-залежності a→b. Виведи лексикографічно найменший допустимий порядок модулів або −1.',
    ],
    input: 'n, m і залежності.',
    output: 'Порядок або −1.',
    constraints: ['1 ≤ n,m ≤ 200000'],
    examples: [example('4 2\n1 3\n2 3', '1 2 3 4')],
    hint: 'Kahn, але замість queue використовуй min-priority_queue доступних вершин.',
  }),
  practice('dag-topological-sort', {
    id: 'longest-dag-path',
    title: 'Найдовший шлях у DAG',
    statement: [
      'Дано weighted DAG. Знайди найбільшу вагу шляху від s до кожної вершини; недосяжні познач −INF.',
    ],
    input: 'n, m, s і напрямлені weighted edges.',
    output: 'n значень.',
    constraints: ['1 ≤ n,m ≤ 200000', '|w| ≤ 10⁹', 'Граф гарантовано DAG'],
    examples: [example('4 4 1\n1 2 3\n1 3 2\n2 4 5\n3 4 10', '0 3 2 12')],
    hint: 'Graph + topological order + DP: обробляй relax для max лише з досяжних вершин.',
  }),
  practice('dag-topological-sort', {
    id: 'minimum-semesters',
    title: 'Мінімум семестрів',
    statement: [
      'Курс займає один семестр. Усі курси з виконаними prerequisites можна проходити паралельно. Знайди мінімальну кількість семестрів або −1 при циклі.',
    ],
    input: 'n, m і залежності a→b.',
    output: 'Мінімальна кількість семестрів або −1.',
    constraints: ['1 ≤ n,m ≤ 200000'],
    examples: [example('4 3\n1 3\n2 3\n3 4', '3')],
    hint: 'Під час topological order рахуй dp[to] = max(dp[to], dp[v] + 1), де стартові курси мають dp=1.',
  }),
];
