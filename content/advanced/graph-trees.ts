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

export const advancedGraphTreePatterns = [
  pattern({
    id: 'scc-bridges-articulation',
    chapterId: 'ch-21',
    title: 'SCC, Bridges та Articulation Points',
    description:
      'Розкладаємо граф на максимальні взаємно досяжні блоки або знаходимо ребра й вершини, через які тримається зв’язність.',
    intuition: [
      p(
        'У directed graph шукаємо еквівалентні за взаємною досяжністю вершини. В undirected graph low-link показує, чи має DFS-піддерево обхідний шлях до предків.',
      ),
      visual('graph-decomposition'),
    ],
    modeling: [
      table(
        ['Фраза умови', 'Структура'],
        [
          ['u досягає v і v досягає u', 'SCC'],
          ['critical edge', 'bridge'],
          ['critical vertex', 'articulation point'],
          ['логічні implications', '2-SAT через SCC'],
        ],
      ),
      note(
        'Directed та undirected — різні моделі',
        'Формули bridges не можна переносити на directed graph, а SCC не відповідає на критичні дороги.',
      ),
    ],
    priorKnowledge: [
      'Combination → DFS та DAG',
      'Combination → Euler entry times',
      'Нове → low-link і condensation',
    ],
    recognitionSigns: [
      'Потрібні maximal mutual-reachability groups.',
      'Питають, що зламається після видалення ребра або вершини.',
      'Після стискання циклічних залежностей потрібен DAG.',
    ],
    constraintSignals: [
      'n,m до 2·10⁵ вимагає O(V+E).',
      'Рекурсивний DFS на ланцюжку може переповнити stack.',
      'Паралельні edges вимагають edge id у bridge algorithm.',
    ],
    notApplicableSigns: [
      'Потрібна лише звичайна компонента в undirected graph.',
      'Граф змінюється між запитами.',
      'Питають minimum cut за кількістю/вагою більше одного ребра.',
    ],
    knowledge: [
      p(
        'SCC — максимальна множина, де кожна пара взаємно досяжна. Condensation стискає кожну SCC в одну вершину й завжди є DAG.',
      ),
      p(
        'Для undirected DFS low[v] — найменший tin, досяжний із піддерева v через tree edges і не більше одне back edge.',
      ),
      visual('graph-decomposition'),
    ],
    cppNotes: [
      code(
        lines(
          'void dfs1(int v) {',
          '    used[v] = true;',
          '    for (int to : graph[v]) if (!used[to]) dfs1(to);',
          '    order.push_back(v);',
          '}',
          'void dfs2(int v, int color) {',
          '    component[v] = color;',
          '    for (int to : reversed[v])',
          '        if (component[to] == -1) dfs2(to, color);',
          '}',
        ),
        'Два проходи Kosaraju',
      ),
      note(
        'Parent edge id',
        'У bridge DFS пропускай лише те саме edge id. Пропуск усіх edges до parent ламає паралельні ребра.',
      ),
    ],
    theory: [
      p(
        'Kosaraju завершує перший DFS у порядку finish time, а другий обходить reversed graph у зворотному порядку. Перша невідвідана вершина не може вийти за межі своєї source-SCC у залишку.',
      ),
      note(
        'Bridge criterion',
        'Tree edge v→to є bridge тоді й лише тоді, коли low[to]>tin[v]. Для articulation root має окрему умову: щонайменше двоє DFS-дітей.',
      ),
    ],
    extensions: [
      {
        title: '2-SAT',
        blocks: [
          p(
            'Clause A∨B створює implications ¬A→B і ¬B→A. Формула неможлива, якщо literal x і ¬x лежать в одній SCC.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'lca-binary-lifting',
    chapterId: 'ch-21',
    title: 'LCA та Binary Lifting',
    description:
      'Preprocess-имо предків на відстанях 1,2,4,8,… і відповідаємо на ancestor/path queries за O(log n).',
    intuition: [
      p(
        'Щоб піднятися на 13 рівнів, достатньо стрибків 8+4+1. Таблиця up[v][k] зберігає результат кожного степеня двійки.',
      ),
      visual('binary-lifting'),
    ],
    modeling: [
      table(
        ['Величина', 'Значення'],
        [
          ['up[v][0]', 'parent v'],
          ['up[v][k]', 'предок на 2^k рівнів'],
          ['depth[v]', 'відстань у ребрах від root'],
          ['LCA(u,v)', 'найглибший спільний предок'],
        ],
      ),
      note(
        'Два етапи query',
        'Спочатку вирівняй depth, потім піднімай обидві вершини від найбільшого k до нуля.',
      ),
    ],
    priorKnowledge: [
      'Combination → rooted tree',
      'Advanced → binary representation',
      'Foundation → preprocessing',
    ],
    recognitionSigns: [
      'Є багато ancestor або path queries у static tree.',
      'Потрібен LCA, k-th ancestor, distance чи k-th vertex on path.',
      'Parent links відомі наперед і не змінюються.',
    ],
    constraintSignals: [
      'n,q до 2·10⁵: O(height) на query не проходить.',
      'LOG≈ceil(log2 n)+1.',
      'Пам’ять O(n log n) треба оцінити.',
    ],
    notApplicableSigns: [
      'Дерево динамічно змінює edges/root без спеціальної адаптації.',
      'Є path updates/aggregates, для яких потрібен HLD або інша структура.',
      'Граф не є деревом і між вершинами кілька шляхів.',
    ],
    knowledge: [
      p(
        'Recurrence up[v][k]=up[up[v][k−1]][k−1] поєднує два стрибки довжини 2^(k−1). Таблицю можна будувати під час DFS або після parents.',
      ),
      visual('binary-lifting'),
      note(
        'Sentinel parent',
        'Зручно зробити parent[root]=root, тоді всі степені предка root теж root і не потрібні −1 checks.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'int lift(int v, int distance) {',
          '    for (int bit = 0; bit < LOG; ++bit)',
          '        if (distance & (1 << bit)) v = up[v][bit];',
          '    return v;',
          '}',
        ),
        'Підйом на задану кількість рівнів',
      ),
    ],
    theory: [
      p(
        'Після вирівнювання depth, якщо u≠v, шукаємо найбільші стрибки, після яких ancestors ще різні. Наприкінці u і v є різними дітьми їхнього LCA.',
      ),
      note(
        'Distance',
        'dist(u,v)=depth[u]+depth[v]−2·depth[lca(u,v)] для невагового дерева; для weighted зберігай rootDistance.',
      ),
    ],
    extensions: [
      {
        title: 'Path aggregates та Heavy-Light Decomposition',
        blocks: [
          p(
            'Binary Lifting може зберігати min/max уздовж стрибка. Для updates і загальніших path queries HLD розкладає шлях на O(log n) array segments.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'rerooting-small-to-large',
    chapterId: 'ch-21',
    title: 'Rerooting та Small-to-Large',
    description:
      'Переносимо tree-DP між сусідніми roots або зливаємо множини піддерев так, щоб кожен елемент переміщувався рідко.',
    intuition: [
      p(
        'Rerooting відповідає для всіх roots двома проходами. Small-to-Large контролює сумарну вартість merges, завжди переносячи менший контейнер у більший.',
      ),
      visual('rerooting'),
    ],
    modeling: [
      table(
        ['Ситуація', 'Техніка'],
        [
          ['відповідь для кожного можливого root', 'rerooting'],
          ['map/set інформація для кожного subtree', 'small-to-large'],
          ['path queries з updates', 'HLD preview'],
          [
            'динамічна відстань до marked vertices',
            'centroid decomposition preview',
          ],
        ],
      ),
    ],
    priorKnowledge: [
      'Combination → Tree DP',
      'Core → set/map',
      'Combination → Euler Tour',
    ],
    recognitionSigns: [
      'Naive запускає DFS із кожної вершини.',
      'Відповідь parent можна швидко перерахувати для child.',
      'Потрібно об’єднувати множини або maps із дочірніх піддерев.',
    ],
    constraintSignals: [
      'n до 2·10⁵ виключає O(n²).',
      'O(1) reroot transition дає O(n).',
      'Small-to-large зазвичай дає O(n log² n) із std::map або O(n log n) для простіших merges.',
    ],
    notApplicableSigns: [
      'Transition при зміні root потребує перегляду всього дерева.',
      'Container не підтримує merge елемент-за-елементом.',
      'Є багато online path updates — потрібна інша decomposition.',
    ],
    knowledge: [
      p(
        'Для sum of distances перший DFS рахує subtree size і answer[root]. При переході v→to всі size[to] вершин ближчають на 1, решта n−size[to] віддаляються.',
      ),
      visual('rerooting'),
      note(
        'Doubling argument',
        'У small-to-large елемент переходить лише в контейнер щонайменше вдвічі більшого розміру, тому не більше O(log n) разів.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'answer[to] = answer[v] - subtree[to] + (n - subtree[to]);',
          '// те саме: answer[v] + n - 2 * subtree[to]',
        ),
        'Reroot formula для sum of distances',
      ),
      code(
        lines(
          'if (colors[a].size() < colors[b].size()) swap(colors[a], colors[b]);',
          'for (int color : colors[b]) colors[a].insert(color);',
          'colors[b].clear();',
        ),
        'Малий set переносимо у великий',
      ),
    ],
    theory: [
      p(
        'Rerooting потребує двох напрямів інформації: from children і from outside subtree. Другий DFS переносить уже повну відповідь parent у child.',
      ),
      note(
        'Не одна техніка',
        'Rerooting і Small-to-Large об’єднані темою складного tree aggregation, але мають різні інваріанти та застосування.',
      ),
    ],
    extensions: [
      {
        title: 'HLD, rollback і Centroid Decomposition',
        blocks: [
          p(
            'HLD розкладає path на heavy segments. Rollback повертає структуру після виходу з DFS. Centroid Decomposition будує ієрархію збалансованих піддерев.',
          ),
        ],
      },
    ],
  }),
];

export const advancedGraphTreeTasks = [
  learning('scc-bridges-articulation', {
    id: 'mutual-reachability-groups',
    title: 'Групи взаємної досяжності',
    statement: [
      'Дано directed graph. Розбий вершини на максимальні групи, всередині яких кожна вершина досяжна з кожної.',
    ],
    input: 'n, m і m directed edges.',
    output: 'Кількість SCC та component id 1..k для кожної вершини.',
    constraints: ['1 ≤ n,m ≤ 200000'],
    examples: [
      example('5 6\\n1 2\\n2 1\\n2 3\\n3 4\\n4 3\\n4 5', '3\\n1 1 2 2 3'),
    ],
    tryYourself:
      'Чому звичайні reachability sets для кожної вершини повторюють надто багато роботи?',
    hint: 'Kosaraju: finish order у graph, потім DFS у reversed graph.',
    firstApproach: [
      p(
        'Запустити DFS з кожної вершини й порівнювати взаємну досяжність усіх пар.',
      ),
    ],
    approachReview:
      'Це O(n(n+m)). Потрібно використати порядок завершення, який відділяє source components.',
    observation: [
      p(
        'У reversed graph sink/source ролі міняються; finish order першого проходу дозволяє забрати одну SCC за раз.',
      ),
      visual('graph-decomposition'),
    ],
    algorithm: [
      'Побудуй graph і reversed graph.',
      'DFS1 додає вершину після дітей до order.',
      'Розверни order.',
      'DFS2 у reversed graph фарбує одну SCC.',
    ],
    proof:
      'У condensation DAG вершина з найбільшим finish time належить source component відносно ще не оброблених. Після reversing edges DFS не може вийти з неї до іншої невідвіданої component, але досягає всю власну SCC.',
    complexity: 'O(n+m) часу й пам’яті.',
    solution: cpp(
      lines(
        '    int n,m;cin>>n>>m;vector<vector<int>>g(n),rg(n);',
        '    while(m--){int u,v;cin>>u>>v;--u;--v;g[u].push_back(v);rg[v].push_back(u);}',
        '    vector<char>used(n);vector<int>order,comp(n,-1);',
        '    function<void(int)>dfs1=[&](int v){used[v]=1;for(int to:g[v])if(!used[to])dfs1(to);order.push_back(v);};',
        '    function<void(int,int)>dfs2=[&](int v,int c){comp[v]=c;for(int to:rg[v])if(comp[to]==-1)dfs2(to,c);};',
        '    for(int v=0;v<n;++v)if(!used[v])dfs1(v);reverse(order.begin(),order.end());',
        '    int count=0;for(int v:order)if(comp[v]==-1)dfs2(v,count++);',
        '    cout<<count<<"\\n";for(int c:comp)cout<<c+1<<" ";cout<<"\\n";',
      ),
    ),
    takeaway:
      'SCC стискає взаємну досяжність, після чого циклічний directed graph стає DAG.',
  }),
  practice('scc-bridges-articulation', {
    id: 'condensation-graph',
    title: 'Стиснення графа',
    statement: [
      'Побудуй condensation directed graph: виведи кількість SCC і кількість різних edges між ними.',
    ],
    input: 'n, m та edges.',
    output: 'Два числа.',
    constraints: ['n,m ≤ 200000'],
    examples: [example('3 3\\n1 2\\n2 1\\n2 3', '2 1')],
    hint: 'Після SCC склади pairs {comp[u],comp[v]} для різних components і unique.',
  }),
  practice('scc-bridges-articulation', {
    id: 'critical-roads',
    title: 'Критичні дороги',
    statement: ['Виведи всі bridge edge ids у undirected multigraph.'],
    input: 'n, m та edges у порядку id.',
    output: 'Кількість і ids.',
    constraints: ['n,m ≤ 200000'],
    examples: [example('4 4\\n1 2\\n2 3\\n3 1\\n3 4', '1\\n4')],
    hint: 'DFS tin/low; пропускай parent edge id, не parent vertex.',
  }),
  practice('scc-bridges-articulation', {
    id: 'critical-servers',
    title: 'Критичні сервери',
    statement: ['Знайди articulation points у undirected graph.'],
    input: 'n, m та edges.',
    output: 'Кількість і вершини.',
    constraints: ['n,m ≤ 200000'],
    examples: [example('4 3\\n1 2\\n2 3\\n2 4', '1\\n2')],
    hint: 'Для non-root low[to]≥tin[v]; root critical при childCount>1.',
  }),
  practice('scc-bridges-articulation', {
    id: 'two-sat-switches',
    title: 'Сумісні перемикачі',
    statement: [
      'Є n boolean variables і m clauses (a∨b), literals задані signed числами. Знайди assignment або IMPOSSIBLE.',
    ],
    input: 'n, m та clauses.',
    output: 'Assignment 0/1 або IMPOSSIBLE.',
    constraints: ['n,m ≤ 200000'],
    examples: [example('2 2\\n1 2\\n-1 2', '0 1')],
    hint: 'Кожна clause дає два implication edges; x і ¬x не можуть бути в одній SCC.',
  }),

  learning('lca-binary-lifting', {
    id: 'common-manager',
    title: 'Спільний керівник',
    statement: [
      'Дано rooted tree підпорядкування з root 1 і q пар працівників. Для кожної знайди їх lowest common ancestor.',
    ],
    input: 'n, q, parent[2..n], потім q пар.',
    output: 'LCA кожної пари.',
    constraints: ['1 ≤ n,q ≤ 200000'],
    examples: [example('5 3\\n1 1 2 2\\n4 5\\n3 4\\n2 4', '2\\n1\\n2')],
    tryYourself: 'Як підняти вершину на довільну різницю depths за O(log n)?',
    hint: 'Розклади різницю на біти таблиці up.',
    firstApproach: [
      p('Піднімати глибшу вершину parent-by-parent, потім обидві разом.'),
    ],
    approachReview: 'У дереві-ланцюжку один query коштує O(n), разом O(nq).',
    observation: [
      p(
        'Предки на степенях двійки дозволяють і вирівнювати depth, і перескакувати однакові blocks.',
      ),
      visual('binary-lifting'),
    ],
    algorithm: [
      'Побудуй depth та up[v][0].',
      'Заповни up[v][k].',
      'Вирівняй depth u,v.',
      'Стрибай k від LOG−1 до 0, коли ancestors різні.',
    ],
    proof:
      'Binary decomposition точно реалізує будь-який підйом. Після вирівнювання найбільші безпечні стрибки тримають u,v нижче LCA; коли жоден неможливий, їхні parents однакові й це найнижчий спільний предок.',
    complexity:
      'O(n log n) preprocessing, O(log n) на query, O(n log n) пам’яті.',
    solution: cpp(
      lines(
        '    int n,q;cin>>n>>q;int LOG=1;while((1<<LOG)<=n)++LOG;',
        '    vector<vector<int>>up(n,vector<int>(LOG));vector<int>depth(n);up[0][0]=0;',
        '    for(int v=1;v<n;++v){cin>>up[v][0];--up[v][0];depth[v]=depth[up[v][0]]+1;}',
        '    for(int k=1;k<LOG;++k)for(int v=0;v<n;++v)up[v][k]=up[up[v][k-1]][k-1];',
        '    auto lift=[&](int v,int d){for(int k=0;k<LOG;++k)if(d&(1<<k))v=up[v][k];return v;};',
        '    auto lca=[&](int a,int b){if(depth[a]<depth[b])swap(a,b);a=lift(a,depth[a]-depth[b]);if(a==b)return a;',
        '        for(int k=LOG-1;k>=0;--k)if(up[a][k]!=up[b][k]){a=up[a][k];b=up[b][k];}return up[a][0];};',
        '    while(q--){int a,b;cin>>a>>b;cout<<lca(--a,--b)+1<<"\\n";}',
      ),
    ),
    takeaway:
      'Binary Lifting перетворює довгий parent-chain на O(log n) степеневих стрибків.',
  }),
  practice('lca-binary-lifting', {
    id: 'tree-distance-lca',
    title: 'Відстань у дереві',
    statement: ['Для q пар знайди кількість edges на path між ними.'],
    input: 'Tree і queries.',
    output: 'Distances.',
    constraints: ['n,q ≤ 200000'],
    examples: [example('3 1\\n1 2\\n1 3\\n2 3', '2')],
    hint: 'depth[u]+depth[v]−2·depth[lca].',
  }),
  practice('lca-binary-lifting', {
    id: 'kth-ancestor',
    title: 'K-th ancestor',
    statement: ['Для query v,k виведи k-th ancestor або −1, якщо його немає.'],
    input: 'Parent tree та queries.',
    output: 'Відповіді.',
    constraints: ['n,q ≤ 200000', 'k ≤ 10¹⁸'],
    examples: [example('3 2\\n1 2\\n3 2\\n3 5', '1\\n-1')],
    hint: 'LOG має покривати k або спочатку порівняй k з depth[v].',
  }),
  practice('lca-binary-lifting', {
    id: 'kth-path-vertex',
    title: 'K-th vertex on path',
    statement: ['Для u,v,k виведи k-th вершину на path u→v, де k=0 означає u.'],
    input: 'Tree та queries.',
    output: 'Вершини або −1.',
    constraints: ['n,q ≤ 200000'],
    examples: [example('3 1\\n1 2\\n2 3\\n1 3 1', '2')],
    hint: 'Розбий path у LCA: якщо k у верхній частині, lift u; інакше lift v з кінця.',
  }),
  practice('lca-binary-lifting', {
    id: 'max-edge-on-path',
    title: 'Найважче ребро шляху',
    statement: [
      'У weighted tree для кожної пари знайди maximum edge weight на path.',
    ],
    input: 'Weighted tree та queries.',
    output: 'Maximums.',
    constraints: ['n,q ≤ 200000'],
    examples: [example('3 1\\n1 2 5\\n2 3 7\\n1 3', '7')],
    hint: 'Разом з up[v][k] preprocess maxWeight[v][k].',
  }),

  learning('rerooting-small-to-large', {
    id: 'all-distance-sums',
    title: 'Сума відстаней',
    statement: [
      'Для кожної вершини невагового дерева знайди суму відстаней до всіх інших вершин.',
    ],
    input: 'n і n−1 edges.',
    output: 'n сум.',
    constraints: ['1 ≤ n ≤ 200000'],
    examples: [example('4\\n1 2\\n2 3\\n2 4', '5 3 5 5')],
    tryYourself: 'Що зміниться у сумі, коли root перейти через edge v→to?',
    hint: 'subtree[to] вершин ближчають, решта віддаляються.',
    firstApproach: [p('Запустити BFS/DFS із кожної вершини.')],
    approachReview:
      'O(n²) на дереві-ланцюжку. Відповіді сусідніх roots відрізняються простою формулою.',
    observation: [
      p('ans[to]=ans[v]−subtree[to]+(n−subtree[to]).'),
      visual('rerooting'),
    ],
    algorithm: [
      'DFS1 рахує subtree size, depth і ans[root].',
      'DFS2 переносить answer з parent у child формулою.',
      'Повтори для всіх edges.',
      'Виведи ans.',
    ],
    proof:
      'При reroot v→to шлях до кожної вершини subtree[to] коротшає на 1, а до кожної з решти n−subtree[to] довшає на 1. Формула враховує всі вершини рівно раз.',
    complexity: 'O(n) часу й пам’яті.',
    solution: cpp(
      lines(
        '    int n;cin>>n;vector<vector<int>>g(n);for(int i=1;i<n;++i){int u,v;cin>>u>>v;--u;--v;g[u].push_back(v);g[v].push_back(u);}',
        '    vector<int>sz(n);vector<long long>ans(n);',
        '    function<void(int,int,int)>dfs1=[&](int v,int p,int d){sz[v]=1;ans[0]+=d;for(int to:g[v])if(to!=p){dfs1(to,v,d+1);sz[v]+=sz[to];}};',
        '    function<void(int,int)>dfs2=[&](int v,int p){for(int to:g[v])if(to!=p){ans[to]=ans[v]+n-2LL*sz[to];dfs2(to,v);}};',
        '    dfs1(0,-1,0);dfs2(0,-1);for(long long x:ans)cout<<x<<" ";cout<<"\\n";',
      ),
    ),
    takeaway:
      'Rerooting переносить повну відповідь між сусідами замість повторного обходу дерева.',
  }),
  practice('rerooting-small-to-large', {
    id: 'distinct-subtree-labels',
    title: 'Distinct labels in subtree',
    statement: [
      'Для кожної вершини знайди кількість різних colors у її subtree.',
    ],
    input: 'Rooted tree і colors.',
    output: 'n чисел.',
    constraints: ['n ≤ 200000'],
    examples: [example('3\\n1 2 1\\n1 2\\n1 3', '2 1 1')],
    hint: 'DFS і small-to-large merging sets; або Euler Tour + offline technique.',
  }),
  practice('rerooting-small-to-large', {
    id: 'most-frequent-subtree-color',
    title: 'Most frequent color',
    statement: [
      'Для кожного subtree виведи найменший color із максимальною частотою.',
    ],
    input: 'Tree і colors.',
    output: 'n colors.',
    constraints: ['n ≤ 200000'],
    examples: [example('3\\n2 1 1\\n1 2\\n1 3', '1 1 1')],
    hint: 'У великій map підтримуй frequency та current best.',
  }),
  practice('rerooting-small-to-large', {
    id: 'weighted-reroot-profit',
    title: 'Зважений центр',
    statement: [
      'Кожна вершина має weight. Для кожного root знайди Σ weight[u]·dist(root,u).',
    ],
    input: 'Tree і weights.',
    output: 'n sums.',
    constraints: ['n ≤ 200000', 'weight≤10⁹'],
    examples: [example('2\\n3 5\\n1 2', '5 3')],
    hint: 'Заміни subtree size на subtree weight sum у reroot formula.',
  }),
];
