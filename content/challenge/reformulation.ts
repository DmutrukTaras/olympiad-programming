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
} from '@/content/challenge/helpers';

export const reformulationPatterns = [
  pattern({
    id: 'state-graph-implicit-graph',
    chapterId: 'ch-26',
    title: 'State Graph та Implicit Graph',
    description:
      'Робимо стан вершиною, операцію ребром і додаємо мінімальні координати, потрібні для коректного майбутнього.',
    intuition: [
      p(
        'Граф може бути відсутній у сюжеті. Якщо є стан, допустима операція та її ціна, shortest path уже прихований у просторі конфігурацій.',
      ),
      visual('state-expansion'),
    ],
    modeling: [
      table(
        ['Питання', 'Перевірка state'],
        [
          ['Що впливає на майбутні ходи?', 'усі ці ознаки входять у state'],
          ['Яка одна операція?', 'одне directed edge'],
          ['Яка її ціна?', '0/1/unweighted/nonnegative weight'],
          ['Чи state достатній?', 'однаковий state має однакове майбутнє'],
          ['Чи state мінімальний?', 'зайва координата не множить простір'],
        ],
      ),
      note(
        'Еквівалентність шляхів',
        'Кожна допустима послідовність операцій повинна давати path і навпаки. Вартість path має точно дорівнювати вартості операцій.',
      ),
    ],
    priorKnowledge: [
      'Combination → BFS, 0-1 BFS, Dijkstra',
      'Advanced → mask і compressed state',
      'Challenge → reduction correctness',
    ],
    recognitionSigns: [
      'Потрібна мінімальна кількість або ціна операцій над конфігурацією.',
      'Є ресурс, coupon, ключі, напрям або режим, використаний не більше k разів.',
      'Повторний запуск shortest path для кожного вибору виглядає зайвим.',
    ],
    constraintSignals: [
      'Оціни кількість reachable states як добуток координат, не лише n.',
      'Unit edges → BFS, weights 0/1 → deque, nonnegative → Dijkstra.',
      'Mask із k≤15 може дати n·2^k states; k=25 уже небезпечний.',
    ],
    notApplicableSigns: [
      'State space експоненційний без малого параметра або pruning.',
      'Є negative weights, тому Dijkstra не коректний.',
      'Додаткова координата не містить усієї історії, що впливає на дозволені дії.',
    ],
    knowledge: [
      p(
        'State expansion копіює базовий graph у кілька шарів. Transition усередині шару зберігає ресурс, а edge між шарами витрачає його. Так історія стискається до невеликого sufficient state.',
      ),
      visual('state-expansion'),
      note(
        'Implicit adjacency',
        'Не створюй усі edges, якщо neighbors легко генеруються з state. Алгоритму shortest path потрібен iterator переходів, а не матеріалізований graph.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'using State = pair<long long, int>;',
          'priority_queue<State, vector<State>, greater<State>> pq;',
          'vector<array<long long, 2>> dist(n, {INF, INF});',
          '// relax (to, used) with +w',
          '// if (!used) relax (to, 1) with +0',
        ),
        'Dijkstra по двох шарах',
      ),
      note(
        'Index state',
        'Або зберігай dist[v][mode], або кодуй id=v*modes+mode. Не змішуй vertex та state id в adjacency.',
      ),
    ],
    theory: [
      p(
        'Правильний state є sufficient statistic історії: якщо дві різні послідовності дій приводять до однакового state, множина й ціни всіх продовжень збігаються.',
      ),
      note(
        'Choose the solver after the model',
        'Спочатку побудуй transitions, потім подивись на weights. Назва задачі не визначає BFS/Dijkstra; це робить граф станів.',
      ),
    ],
    extensions: [
      {
        title: 'Алгебраїчне та telescoping representation',
        blocks: [
          p(
            'Не кожна нова модель є graph. Різниці, prefix potential або telescoping sum можуть замінити довгу історію одним накопиченим значенням. Критерій той самий: зберегти exact answer і допустимі рішення.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'offline-reverse-rollback',
    chapterId: 'ch-26',
    title: 'Offline, Reverse Process та Rollback',
    description:
      'Змінюємо напрям часу або тимчасово відкочуємо структуру, щоб складні deletions стали простими additions.',
    intuition: [
      p(
        'DSU легко об’єднує компоненти, але не розділяє їх. Якщо всі deletions відомі наперед, у зворотному часі кожне видалення стає unite.',
      ),
      visual('reverse-time'),
    ],
    modeling: [
      table(
        ['Онлайн-процес', 'Offline replacement'],
        [
          ['delete edge', 'reverse add edge'],
          ['active interval [l,r)', 'segment tree over time'],
          ['тимчасові unions changes', 'stack of modifications'],
          ['return to parent recursion', 'rollback snapshot'],
        ],
      ),
      note(
        'Чи дозволений offline?',
        'Reverse працює лише коли всі операції відомі до відповіді й запит не впливає на наступний input.',
      ),
    ],
    priorKnowledge: [
      'Combination → DSU й offline processing',
      'Advanced → rollback during DFS preview',
      'Challenge → transformation of time',
    ],
    recognitionSigns: [
      'Є deletions, які важко підтримувати forward.',
      'Усі операції задані наперед, а відповіді не змінюють майбутнє.',
      'Рекурсивні гілки потребують спільної структури з поверненням стану.',
    ],
    constraintSignals: [
      'Reverse-only deletions дають майже O((n+q)α(n)).',
      'Довільні add/delete intervals ведуть до O((n+q)log q log n) rollback-підходу.',
      'Rollback DSU не використовує path compression; union by size дає O(log n).',
    ],
    notApplicableSigns: [
      'Операції приходять online і відповідь визначає наступну операцію.',
      'Reverse операція не є простішою або не відновлюється однозначно.',
      'Структура змінює багато пам’яті без можливості записати компактний undo.',
    ],
    knowledge: [
      p(
        'Простий reverse стартує з фінального набору об’єктів. Rollback узагальнює ідею: перед зміною зберігаємо рівно ті поля, що зміняться, а snapshot є розміром history stack.',
      ),
      visual('reverse-time'),
      note(
        'Path compression конфліктує з rollback',
        'Вона змінює багато parent pointers під час find. Зазвичай її вимикають і залишають union by size.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'int snapshot() const { return int(history.size()); }',
          'void rollback(int snap) {',
          '    while (int(history.size()) > snap) {',
          '        auto [child, oldSize] = history.back(); history.pop_back();',
          '        if (child == -1) continue;',
          '        int root = parent[child];',
          '        size[root] = oldSize; parent[child] = child;',
          '    }',
          '}',
        ),
        'Ідея rollback DSU',
      ),
      note(
        'No-op unite теж записуй',
        'Одна history entry на одну операцію спрощує rollback до snapshot і не плутає кількість змін.',
      ),
    ],
    theory: [
      p(
        'Reverse process зберігає відповідність моментів: state перед відновленням операції i дорівнює forward state одразу після виконання i. Відповіді записуються до unite.',
      ),
      note(
        'Segment tree over time',
        'Edge додається у nodes, що покривають interval його активності. DFS застосовує unions при вході й відкочує їх при виході.',
      ),
    ],
    extensions: [
      {
        title: 'Rollback DSU + segment tree over time',
        blocks: [
          p(
            'Це стандартна комбінація для fully dynamic offline connectivity: кожне edge active на intervals, а rollback ізолює гілки divide-and-conquer по часу.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'decomposition-multi-pattern',
    chapterId: 'ch-26',
    title: 'Decomposition та Multi-Pattern Problems',
    description:
      'Розбиваємо задачу на representation, preprocessing, локальні operations і query engine та поєднуємо вже відомі алгоритми.',
    intuition: [
      p(
        'Важка задача часто не вимагає нового алгоритму. Один патерн робить об’єкт зручним, другий швидко обробляє отримані частини, третій підтримує зміни.',
      ),
      visual('hld-decomposition'),
    ],
    modeling: [
      table(
        ['Шар рішення', 'Контрольне питання'],
        [
          ['representation', 'у якому просторі query простий?'],
          [
            'decomposition',
            'на скільки стандартних частин розпадається об’єкт?',
          ],
          ['preprocessing', 'що не змінюється й рахується один раз?'],
          ['data structure', 'які точні update/query потрібні?'],
          ['composition', 'як об’єднати відповіді без втрати інформації?'],
        ],
      ),
      note(
        'Рахуй добуток складностей',
        'O(log n) pieces × O(log n) query означає O(log² n), а не O(log n). Додай preprocessing і всі test cases.',
      ),
    ],
    priorKnowledge: [
      'Combination → trees, Euler Tour, Fenwick/Segment Tree',
      'Advanced → LCA, Small-to-Large, rollback',
      'Challenge → state/reverse/reduction proof',
    ],
    recognitionSigns: [
      'Одна частина умови природно розв’язується відомим алгоритмом, інша лишається вузьким bottleneck.',
      'Tree path потрібно перетворити на range operations.',
      'Потрібні 3–4 техніки, але кожна має чітку окрему відповідальність.',
    ],
    constraintSignals: [
      'N,Q≈2·10⁵ часто дозволяють O((N+Q)log²N).',
      'Оціни memory кожного шару, особливо tables і segment trees.',
      'Static/offline умова може прибрати складну dynamic structure.',
    ],
    notApplicableSigns: [
      'Комбінація дублює роботу або одна структура вже дає всю відповідь.',
      'Межа між шарами передає недостатню інформацію.',
      'Прихований множник робить загальну складність завеликою.',
    ],
    knowledge: [
      p(
        'Heavy-Light Decomposition — приклад separation of concerns: tree визначає chains, base array зберігає vertices, Segment Tree нічого не знає про дерево, а path query лише комбінує range maxima.',
      ),
      visual('hld-decomposition'),
      note(
        'Interface між алгоритмами',
        'Перед кодом запиши, що повертає кожен шар і які властивості очікує наступний. Це зменшує помилки не гірше за окремий proof.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'while (head[u] != head[v]) {',
          '    if (depth[head[u]] < depth[head[v]]) swap(u, v);',
          '    answer = max(answer, seg.query(pos[head[u]], pos[u]));',
          '    u = parent[head[u]];',
          '}',
          'if (depth[u] > depth[v]) swap(u, v);',
          'answer = max(answer, seg.query(pos[u], pos[v]));',
        ),
        'HLD path query',
      ),
      note(
        'Edge values',
        'Якщо значення лежать на ребрах, зберігай edge у позиції глибшого кінця й виключай pos[LCA] з останнього segment.',
      ),
    ],
    theory: [
      p(
        'Кожен перехід між chains проходить light edge. Розмір subtree щонайменше подвоюється при русі вгору через light edge, тому path містить O(log n) chain segments.',
      ),
      note(
        'Доведи reduction і composition',
        'Потрібно окремо довести, що segments точно покривають path без пропусків/повторів і що операція max асоціативно об’єднує їх.',
      ),
    ],
    extensions: [
      {
        title: 'Коли алгоритм не видно: фінальна методика',
        blocks: [
          table(
            ['Крок', 'Питання'],
            [
              ['1. Відкинь сюжет', 'які математичні об’єкти дано?'],
              ['2. Constraints', 'яка complexity можлива?'],
              ['3. Перший підхід', 'де саме bottleneck?'],
              [
                '4. Структура',
                'sorted/static/tree/DAG/small parameter/monotone?',
              ],
              [
                '5. Інше представлення',
                'tree→array, logic→graph, DP→lines, delete→add?',
              ],
              ['6. Декомпозиція', 'які частини вже вміємо розв’язувати?'],
              ['7. Correctness', 'чи нова модель еквівалентна в обидва боки?'],
            ],
          ),
        ],
      },
      {
        title: 'Final Mixed Set',
        blocks: [
          p(
            'Фінальний checkpoint варто проходити без назв патернів і hints: спочатку письмово обрати модель та складність, а вже потім писати код. Добірка має змішувати 10–15 задач з усього курсу, а не додавати нову теорію.',
          ),
        ],
      },
    ],
  }),
];

export const reformulationTasks = [
  learning('state-graph-implicit-graph', {
    id: 'one-free-road',
    title: 'Одна безкоштовна дорога',
    statement: [
      'Дано undirected weighted graph. На маршруті з 1 до n не більше одного разу можна пройти ребро безкоштовно. Знайди мінімальну вартість.',
    ],
    input: 'n, m і m ребер u v w.',
    output: 'Мінімальна вартість або −1.',
    constraints: ['2≤n≤2·10⁵', 'm≤3·10⁵', '0≤w≤10⁹'],
    examples: [example('3 3\n1 2 5\n2 3 4\n1 3 20', '0')],
    tryYourself:
      'Чому dist[v] без додаткової інформації недостатньо? Намалюй два шари кожної вершини.',
    hint: 'State (v,used) пам’ятає, чи витрачено безкоштовний прохід.',
    firstApproach: [
      p(
        'По черзі робимо кожне ребро безкоштовним і запускаємо Dijkstra заново.',
      ),
    ],
    approachReview:
      'Маємо m запусків O(m log n). Історію “чи бонус уже використано” можна включити в один state graph.',
    observation: [
      visual('state-expansion'),
      p(
        'У шарі used=0 кожне ребро має звичайний transition у той самий шар і безкоштовний transition у used=1. Назад у used=0 переходу немає.',
      ),
    ],
    algorithm: [
      'Заведи dist[v][0/1], початок dist[0][0]=0.',
      'Запусти Dijkstra по implicit states.',
      'Для edge ваги w relax (to,used) з +w.',
      'Якщо used=0, додатково relax (to,1) з +0.',
      'Відповідь min(dist[n−1][0],dist[n−1][1]).',
    ],
    proof:
      'Будь-який допустимий маршрут однозначно підіймається в шар 1 на ребрі, де використано бонус, або лишається в шарі 0. Кожен path expanded graph переходить між шарами не більше одного разу й задає допустимий маршрут тієї самої вартості.',
    complexity: 'O((n+m)log n) часу та O(n+m) пам’яті.',
    solution: cpp(
      lines(
        '    int n,m;cin>>n>>m;vector<vector<pair<int,long long>>>g(n);',
        '    while(m--){int u,v;long long w;cin>>u>>v>>w;--u;--v;g[u].push_back({v,w});g[v].push_back({u,w});}',
        '    const long long INF=(1LL<<62);vector<array<long long,2>>d(n,{INF,INF});',
        '    using S=tuple<long long,int,int>;priority_queue<S,vector<S>,greater<S>>pq;',
        '    d[0][0]=0;pq.push({0,0,0});',
        '    while(!pq.empty()){auto[dist,v,used]=pq.top();pq.pop();if(dist!=d[v][used])continue;',
        '        for(auto[to,w]:g[v]){',
        '            if(dist+w<d[to][used])d[to][used]=dist+w,pq.push({d[to][used],to,used});',
        '            if(!used && dist<d[to][1])d[to][1]=dist,pq.push({dist,to,1});',
        '        }',
        '    }',
        '    long long ans=min(d[n-1][0],d[n-1][1]);cout<<(ans==INF?-1:ans)<<"\\n";',
      ),
    ),
    takeaway:
      'Одне глобальне обмеження часто стає малою координатою state і прибирає багато повторних запусків.',
  }),
  practice('state-graph-implicit-graph', {
    id: 'shortest-path-discount',
    title: 'Знижка на квиток',
    statement: [
      'В directed graph один coupon ділить ціну обраного ребра навпіл із floor. Знайди shortest path.',
    ],
    input: 'n,m і weighted edges.',
    output: 'Minimum cost.',
    constraints: ['n,m≤2·10⁵'],
    examples: [example('3 2\n1 2 5\n2 3 5', '7')],
    hint: 'Два шари; між ними ребро ваги floor(w/2).',
  }),
  practice('state-graph-implicit-graph', {
    id: 'grid-keys-mask',
    title: 'Лабіринт із ключами',
    statement: [
      'У grid є до 10 типів ключів і дверей. Знайди мінімум кроків від S до T.',
    ],
    input: 'Grid.',
    output: 'Minimum steps або −1.',
    constraints: ['h·w≤10⁴', 'k≤10'],
    examples: [example('2 3\nSaA\n..T', '4')],
    hint: 'State=(cell,mask collected keys), edges unit.',
  }),
  practice('state-graph-implicit-graph', {
    id: 'robot-direction-state',
    title: 'Робот із напрямком',
    statement: [
      'Робот може повернутися за cost 1 або їхати вперед за cost 0. Знайди minimum cost до target cell.',
    ],
    input: 'Grid, start direction, target.',
    output: 'Minimum cost.',
    constraints: ['h·w≤2·10⁵'],
    examples: [example('1 3 E\nS.T', '0')],
    hint: 'Direction входить у state; weights 0/1 підказують deque.',
  }),
  learning('offline-reverse-rollback', {
    id: 'road-destruction',
    title: 'Руйнування доріг',
    statement: [
      'Дано undirected graph і q різних доріг, які послідовно видаляють. Після кожного видалення виведи кількість connected components.',
    ],
    input: 'n,m, edges, q і q індексів доріг.',
    output: 'q чисел у forward order.',
    constraints: ['n,m,q≤2·10⁵'],
    examples: [example('4 3\n1 2\n2 3\n3 4\n2\n2 3', '2\n3')],
    tryYourself:
      'Познач усі дороги, які колись видалять. Який graph залишиться після останньої операції?',
    hint: 'Почни з фінального graph і додавай видалені edges у reverse order.',
    firstApproach: [
      p(
        'Після кожного deletion запускаємо DFS/BFS і заново рахуємо компоненти.',
      ),
    ],
    approachReview:
      'O(q(n+m)) не проходить. Звичайний DSU не вміє split component після видалення.',
    observation: [
      visual('reverse-time'),
      p(
        'Відповідь після forward deletion i дорівнює компонентам перед reverse addition тієї самої дороги.',
      ),
    ],
    algorithm: [
      'Познач edges, які видалять, і unite всі інші.',
      'Ініціалізуй components=n і зменшуй при успішному unite.',
      'Іди deletion list справа наліво: спершу запиши current components, потім додай edge.',
      'Виведи збережені answers у початковому порядку.',
    ],
    proof:
      'Перед обробкою reverse index i DSU містить рівно edges, що залишалися після перших i+1 forward deletions. Тому записана кількість правильна. Додавання edge i встановлює invariant для наступного меншого index.',
    complexity: 'O((n+m+q)α(n)) часу й O(n+m+q) пам’яті.',
    solution: cpp(
      lines(
        '    int n,m;cin>>n>>m;vector<pair<int,int>>e(m);for(auto&[u,v]:e){cin>>u>>v;--u;--v;}',
        '    int q;cin>>q;vector<int>cut(q),removed(m);for(int&i:cut){cin>>i;--i;removed[i]=1;}',
        '    vector<int>p(n),sz(n,1);iota(p.begin(),p.end(),0);int components=n;',
        '    auto find=[&](auto&&self,int v)->int{return p[v]==v?v:p[v]=self(self,p[v]);};',
        '    auto unite=[&](int a,int b){a=find(find,a);b=find(find,b);if(a==b)return;',
        '        if(sz[a]<sz[b])swap(a,b);p[b]=a;sz[a]+=sz[b];--components;};',
        '    for(int i=0;i<m;++i)if(!removed[i])unite(e[i].first,e[i].second);',
        '    vector<int>ans(q);for(int i=q-1;i>=0;--i){ans[i]=components;unite(e[cut[i]].first,e[cut[i]].second);}',
        '    for(int x:ans)cout<<x<<"\\n";',
      ),
    ),
    takeaway:
      'Коли structure підтримує add, але не delete, перевір, чи offline reverse міняє напрям складності.',
  }),
  practice('offline-reverse-rollback', {
    id: 'reverse-connectivity-queries',
    title: 'Коли міста роз’єдналися',
    statement: [
      'Roads видаляються; після кожного кроку запитай, чи connected задані u,v.',
    ],
    input: 'Graph, deletion order і queries.',
    output: 'YES/NO.',
    constraints: ['n,m,q≤2·10⁵'],
    examples: [example('2 1\n1 2\n1\n1\n1 2', 'NO')],
    hint: 'Прив’яжи query до moment і відповідай під час reverse sweep.',
  }),
  practice('offline-reverse-rollback', {
    id: 'offline-islands',
    title: 'Острови зникають',
    statement: [
      'Клітинки land послідовно затоплюються. Після кожної операції виведи кількість islands.',
    ],
    input: 'Grid і deletion order.',
    output: 'Components after each deletion.',
    constraints: ['h·w≤2·10⁵'],
    examples: [example('1 3\n...\n2\n2\n1', '2\n1')],
    hint: 'У reverse time клітинка активується й unite-иться з активними сусідами.',
  }),
  practice('offline-reverse-rollback', {
    id: 'fully-dynamic-connectivity',
    title: 'Динамічна зв’язність offline',
    statement: [
      'Операції ADD, REMOVE та ASK для edges дані наперед. Відповідай на connectivity queries.',
    ],
    input: 'n,q і operations.',
    output: 'YES/NO для ASK.',
    constraints: ['n,q≤2·10⁵'],
    examples: [example('2 3\nADD 1 2\nASK 1 2\nREMOVE 1 2', 'YES')],
    hint: 'Знайди active interval кожного edge, segment tree over time + rollback DSU.',
  }),
  learning('decomposition-multi-pattern', {
    id: 'tree-path-maximum',
    title: 'Запити на шляху',
    statement: [
      'Дано tree з value у кожній вершині. Підтримуй UPDATE v x і QUERY u v — maximum value на простому path u→v.',
    ],
    input: 'n, values, n−1 edges, q operations.',
    output: 'Відповідь на кожний QUERY.',
    constraints: ['1≤n,q≤2·10⁵', '|value|≤10⁹'],
    examples: [
      example(
        '3\n1 5 2\n1 2\n2 3\n3\nQUERY 1 3\nUPDATE 1 7\nQUERY 1 3',
        '5\n7',
      ),
    ],
    tryYourself:
      'Чому Euler Tour не робить довільний path одним interval? Які paths уже є contiguous після Heavy-Light Decomposition?',
    hint: 'Розбий path на O(log n) heavy-chain segments і запитуй Segment Tree.',
    firstApproach: [
      p(
        'Для QUERY піднімаємося від u і v до LCA та явно переглядаємо всі вершини path.',
      ),
    ],
    approachReview:
      'Один path може мати Θ(n) вершин, тому q queries дають O(nq). Потрібне tree→array representation.',
    observation: [
      visual('hld-decomposition'),
      p(
        'HLD гарантує O(log n) heavy segments на будь-якому root-to-vertex path. Усередині chain позиції contiguous, тому працює звичайний Segment Tree.',
      ),
    ],
    algorithm: [
      'DFS1 обчисли parent, depth, subtree size і heavy child.',
      'DFS2 признач head chain та position у base array.',
      'Побудуй Segment Tree maximum по values у HLD order.',
      'Для path query підіймай глибший head, query його interval, доки heads не збіжаться.',
      'Останній interval між u,v оброби в спільному chain.',
    ],
    proof:
      'HLD intervals неперетинно покривають усі вершини path. Кожний light jump щонайменше подвоює subtree size вгору, тому їх O(log n). Segment Tree точно повертає maximum кожного interval, а max об’єднує часткові відповіді.',
    complexity:
      'Preprocessing O(n), UPDATE O(log n), QUERY O(log² n), пам’ять O(n).',
    solution: cpp(
      lines(
        '    int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;vector<vector<int>>g(n);',
        '    for(int i=1;i<n;++i){int u,v;cin>>u>>v;--u;--v;g[u].push_back(v);g[v].push_back(u);}',
        '    vector<int>par(n,-1),dep(n),sz(n),heavy(n,-1),head(n),pos(n);int timer=0;',
        '    auto dfs1=[&](auto&&self,int v)->void{sz[v]=1;int best=0;for(int to:g[v])if(to!=par[v]){',
        '        par[to]=v;dep[to]=dep[v]+1;self(self,to);sz[v]+=sz[to];if(sz[to]>best)best=sz[to],heavy[v]=to;}};',
        '    auto dfs2=[&](auto&&self,int v,int h)->void{head[v]=h;pos[v]=timer++;if(heavy[v]!=-1)self(self,heavy[v],h);',
        '        for(int to:g[v])if(to!=par[v]&&to!=heavy[v])self(self,to,to);};',
        '    dfs1(dfs1,0);dfs2(dfs2,0,0);int size=1;while(size<n)size*=2;',
        '    vector<long long>seg(2*size,LLONG_MIN);for(int v=0;v<n;++v)seg[size+pos[v]]=a[v];',
        '    for(int i=size-1;i;--i)seg[i]=max(seg[2*i],seg[2*i+1]);',
        '    auto update=[&](int p,long long x){for(seg[p+=size]=x;p>1;p/=2)seg[p/2]=max(seg[p],seg[p^1]);};',
        '    auto range=[&](int l,int r){long long res=LLONG_MIN;for(l+=size,r+=size+1;l<r;l/=2,r/=2){',
        '        if(l&1)res=max(res,seg[l++]);if(r&1)res=max(res,seg[--r]);}return res;};',
        '    auto path=[&](int u,int v){long long res=LLONG_MIN;while(head[u]!=head[v]){',
        '        if(dep[head[u]]<dep[head[v]])swap(u,v);res=max(res,range(pos[head[u]],pos[u]));u=par[head[u]];}',
        '        if(dep[u]>dep[v])swap(u,v);return max(res,range(pos[u],pos[v]));};',
        '    int q;cin>>q;while(q--){string op;int u;cin>>op>>u;--u;if(op=="UPDATE"){long long x;cin>>x;update(pos[u],x);}',
        '        else{int v;cin>>v;cout<<path(u,v-1)<<"\\n";}}',
      ),
    ),
    takeaway:
      'Складне рішення стає керованим, коли HLD відповідає лише за decomposition, а Segment Tree — лише за range operations.',
  }),
  practice('decomposition-multi-pattern', {
    id: 'subtree-add-path-query',
    title: 'Піддерева і шляхи',
    statement: ['Підтримуй додавання x до всього subtree та sum на path u→v.'],
    input: 'Tree і operations.',
    output: 'Path sums.',
    constraints: ['n,q≤2·10⁵'],
    examples: [example('2\n1 2\n1\nQUERY 1 2', '0')],
    hint: 'Порівняй Euler intervals, HLD segments і lazy propagation.',
  }),
  practice('decomposition-multi-pattern', {
    id: 'two-sat-schedule',
    title: 'Розклад із двома варіантами',
    statement: [
      'Кожна подія має два можливі часові slots; деякі пари slots несумісні. Побудуй розклад або повідом IMPOSSIBLE.',
    ],
    input: 'Events and conflicts.',
    output: 'One assignment.',
    constraints: ['n,m≤2·10⁵'],
    examples: [example('1 0\n1 2', '1')],
    hint: 'Вибір → implications → SCC → 2-SAT.',
  }),
  practice('decomposition-multi-pattern', {
    id: 'mixed-geometry-search',
    title: 'Радіус покриття',
    statement: [
      'Знайди мінімальний радіус, за якого k центрів можуть покрити всі sorted точки на прямій.',
    ],
    input: 'n,k і coordinates.',
    output: 'Minimum radius.',
    constraints: ['n≤2·10⁵'],
    examples: [example('4 2\n0 1 10 11', '1')],
    hint: 'Minimize answer → binary search; feasibility → greedy covering.',
  }),
];
