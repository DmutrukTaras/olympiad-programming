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

const dinicCode = lines(
  'struct Edge { int to, rev; long long cap; };',
  'struct Dinic {',
  '    int n; vector<vector<Edge>> g; vector<int> level, ptr;',
  '    Dinic(int n): n(n), g(n), level(n), ptr(n) {}',
  '    void addEdge(int v, int to, long long cap) {',
  '        Edge a{to, int(g[to].size()), cap};',
  '        Edge b{v, int(g[v].size()), 0};',
  '        g[v].push_back(a); g[to].push_back(b);',
  '    }',
  '    bool bfs(int s, int t) {',
  '        fill(level.begin(), level.end(), -1);',
  '        queue<int> q; q.push(s); level[s] = 0;',
  '        while (!q.empty()) {',
  '            int v = q.front(); q.pop();',
  '            for (const Edge& e : g[v])',
  '                if (e.cap > 0 && level[e.to] == -1)',
  '                    level[e.to] = level[v] + 1, q.push(e.to);',
  '        }',
  '        return level[t] != -1;',
  '    }',
  '    long long dfs(int v, int t, long long pushed) {',
  '        if (v == t || pushed == 0) return pushed;',
  '        for (int& cid = ptr[v]; cid < int(g[v].size()); ++cid) {',
  '            Edge& e = g[v][cid];',
  '            if (e.cap == 0 || level[e.to] != level[v] + 1) continue;',
  '            long long tr = dfs(e.to, t, min(pushed, e.cap));',
  '            if (!tr) continue;',
  '            e.cap -= tr; g[e.to][e.rev].cap += tr;',
  '            return tr;',
  '        }',
  '        return 0;',
  '    }',
  '    long long maxFlow(int s, int t) {',
  '        long long flow = 0, pushed, INF = (1LL << 62);',
  '        while (bfs(s, t)) {',
  '            fill(ptr.begin(), ptr.end(), 0);',
  '            while ((pushed = dfs(s, t, INF))) flow += pushed;',
  '        }',
  '        return flow;',
  '    }',
  '};',
);

export const flowPatterns = [
  pattern({
    id: 'bipartite-matching',
    chapterId: 'ch-23',
    title: 'Bipartite Matching',
    description:
      'Моделюємо допустимі пари між двома групами та збільшуємо призначення через augmenting paths.',
    intuition: [
      p(
        'Зайнятий об’єкт ще не означає відмову: його поточного власника можна переселити на іншу допустиму позицію. Augmenting path описує саме таку ланцюгову перебудову.',
      ),
      visual('augmenting-path'),
    ],
    modeling: [
      table(
        ['Фраза в умові', 'Елемент моделі'],
        [
          ['дві групи об’єктів', 'ліва й права частини графа'],
          ['пара сумісна', 'ребро L → R'],
          ['кожен використовується ≤1 разу', 'matching constraint'],
          ['максимум призначень', 'maximum cardinality matching'],
        ],
      ),
      note(
        'Доведи двосторонню відповідність',
        'Кожне допустиме призначення має утворювати matching, а кожен matching — коректне призначення початкової задачі.',
      ),
    ],
    priorKnowledge: [
      'Combination → DFS і bipartite graph',
      'Advanced → augmenting path як виправлення локального вибору',
      'Новий крок → reduction із призначення у граф',
    ],
    recognitionSigns: [
      'Є дві різні групи та список допустимих пар.',
      'Кожен об’єкт з обох сторін можна використати не більше одного разу.',
      'Потрібна максимальна кількість одночасних призначень.',
    ],
    constraintSignals: [
      'Простий Kuhn з O(VE) зручний для кількох тисяч вершин і помірного E.',
      'Для великих sparse graphs потрібен Hopcroft–Karp O(E√V).',
      'Capacity більша за 1 або кілька одиниць ресурсу ведуть до flow-моделі.',
    ],
    notApplicableSigns: [
      'Граф не ділиться на дві групи або допустимі пари всередині однієї групи.',
      'Потрібно мінімізувати сумарну ціну perfect assignment — потрібна cost-модель.',
      'Один об’єкт може прийняти багато інших без перетворення capacity.',
    ],
    knowledge: [
      p(
        'Matching — множина ребер без спільних кінців. Augmenting path починається у вільній лівій вершині, закінчується у вільній правій і чергує ребра поза matching та в matching.',
      ),
      visual('augmenting-path'),
      note(
        'Теорема Berge',
        'Matching максимальний тоді й лише тоді, коли augmenting path більше не існує. Саме це є критерієм завершення алгоритму.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'vector<vector<int>> g;',
          'vector<int> mt, used;',
          'bool tryKuhn(int v) {',
          '    if (used[v]) return false;',
          '    used[v] = true;',
          '    for (int to : g[v]) {',
          '        if (mt[to] == -1 || tryKuhn(mt[to])) {',
          '            mt[to] = v;',
          '            return true;',
          '        }',
          '    }',
          '    return false;',
          '}',
        ),
        'Kuhn: пошук augmenting path',
      ),
      note(
        'used очищається для кожного старту',
        'Воно захищає лише один DFS від циклічного повернення. mt зберігає matching між усіма запусками.',
      ),
    ],
    theory: [
      p(
        'Інверсія ребер augmenting path зберігає коректність matching: внутрішні вершини втрачають одне matching-ребро й отримують інше, а два вільні кінці стають matched.',
      ),
      note(
        'Модель важливіша за код',
        'Перед запуском Kuhn перевір обидві частини reduction. Інакше алгоритм може правильно розв’язати не ту задачу.',
      ),
    ],
    extensions: [
      {
        title: 'Hopcroft–Karp та matching через flow',
        blocks: [
          p(
            'Hopcroft–Karp знаходить одразу шар найкоротших augmenting paths. Matching також є flow-мережею з unit capacities source→L→R→sink.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'max-flow-min-cut',
    chapterId: 'ch-23',
    title: 'Maximum Flow та Residual Graph',
    description:
      'Передаємо максимальний ресурс із source до sink, зберігаючи можливість скасувати й перенаправити попередні рішення.',
    intuition: [
      p(
        'Flow не повинен бути незворотним. Коли надсилаємо x одиниць по u→v, residual graph додає можливість повернути до x одиниць через v→u.',
      ),
      visual('residual-flow'),
    ],
    modeling: [
      table(
        ['Поняття', 'Умова'],
        [
          ['capacity', '0 ≤ f(u,v) ≤ c(u,v)'],
          ['conservation', 'inflow = outflow для v≠S,T'],
          ['residual capacity', 'скільки ще можна додати або скасувати'],
          ['augmenting path', 'S→T шлях лише по positive residual edges'],
        ],
      ),
    ],
    priorKnowledge: [
      'Combination → BFS/DFS і weighted graph',
      'Challenge → augmenting path у matching',
      'Нове → capacity, conservation і residual network',
    ],
    recognitionSigns: [
      'Є джерело, стік і пропускні здатності каналів.',
      'Ресурс можна ділити між кількома маршрутами.',
      'Потрібний максимум переданої кількості або кількість disjoint paths.',
    ],
    constraintSignals: [
      'Long long потрібен, якщо сума capacities виходить за int.',
      'Dinic практичний для типових олімпіадних мереж; unit networks часто швидші.',
      'Дуже великі dense networks можуть вимагати спеціалізованого алгоритму.',
    ],
    notApplicableSigns: [
      'Потрібен один shortest/widest path, а ресурс не розподіляється.',
      'На ребрах є ціни й треба мінімізувати cost заданого flow.',
      'Ресурс неподільний і має додаткові глобальні обмеження, яких network не кодує.',
    ],
    knowledge: [
      p(
        'Residual graph є поточним простором дозволених змін flow. Forward residual capacity дорівнює c−f, reverse — f. Augmentation змінює обидва напрямки симетрично.',
      ),
      visual('residual-flow'),
      note(
        'Dinic',
        'BFS залишає лише ребра level+1, а DFS із ptr штовхає blocking flow без повторного перегляду вже вичерпаних ребер.',
      ),
    ],
    cppNotes: [
      code(dinicCode, 'Dinic: reusable каркас'),
      note(
        'Зберігай reverse index',
        'Посилання або індекс парного ребра потрібен для O(1) оновлення residual capacity після push.',
      ),
    ],
    theory: [
      p(
        'Кожна augmentation зберігає capacity constraints і conservation. Коли residual S→T path немає, reachable vertices утворюють cut, чия capacity дорівнює знайденому flow.',
      ),
      note(
        'Не плутай capacity і flow',
        'У компактній реалізації поле cap часто зберігає залишок, а не початкову capacity. Для відновлення flow потрібно зберегти початкове значення або читати reverse edge.',
      ),
    ],
    extensions: [
      {
        title: 'Unit networks і edge-disjoint paths',
        blocks: [
          p(
            'Capacity 1 на ребрах робить цілий flow набором edge-disjoint paths. Для vertex-disjoint paths використовують vertex splitting.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'flow-reformulation',
    chapterId: 'ch-23',
    title: 'Flow Modeling, Min Cut та Costs',
    description:
      'Перетворюємо видалення, вибір, capacities вершин і assignment на мережу, доводячи еквівалентність reduction.',
    intuition: [
      p(
        'Часто у задачі немає слова flow. Підказкою є те, що допустиме рішення розділяє source і sink або передає одиниці ресурсу через локальні обмеження.',
      ),
      visual('min-cut-model'),
    ],
    modeling: [
      table(
        ['Обмеження задачі', 'Перетворення'],
        [
          ['capacity вершини c', 'v_in → v_out з capacity c'],
          ['вибір left/right', 'source→L→R→sink'],
          ['заборонити рішення', 'ребро з INF'],
          ['ціна розірвати зв’язок', 'capacity cut edge'],
          ['capacity + cost', 'Min-Cost Max-Flow'],
        ],
      ),
      note(
        'INF — не магічне число',
        'Воно має бути строго більшим за будь-яку скінченну допустиму відповідь, але не створювати overflow.',
      ),
    ],
    priorKnowledge: [
      'Challenge → maximum flow і residual reachability',
      'Advanced → graph decomposition та shortest paths',
      'Нове → reduction correctness і extraction answer',
    ],
    recognitionSigns: [
      'Треба мінімальною ціною розірвати всі S→T шляхи.',
      'Локальні capacity constraints можна з’єднати в мережу.',
      'Вибір одного об’єкта примушує або забороняє інший.',
    ],
    constraintSignals: [
      'Integral capacities гарантують існування integral maximum flow.',
      'Для min cut відповідь може бути сумою всіх скінченних costs.',
      'Cost на одиницю flow потребує іншого алгоритму, не звичайного Dinic.',
    ],
    notApplicableSigns: [
      'Обмеження не локалізуються на ребрах/вершинах мережі.',
      'Потрібно мінімізувати число кроків одного маршруту.',
      'Reduction дозволяє рішення, які не можна відобразити назад у початкову задачу.',
    ],
    knowledge: [
      p(
        'Max-Flow Min-Cut theorem перетворює глобальне видалення шляхів на числовий максимум потоку. Після max flow вершини, reachable з S у residual graph, задають одну сторону minimum cut.',
      ),
      visual('min-cut-model'),
      note(
        'Три частини reduction',
        'Опиши побудову network, доведи correspondence між рішеннями та поясни, як із flow/cut відновити відповідь задачі.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'long long finiteSum = /* сума всіх звичайних costs */;',
          'long long INF = finiteSum + 1;',
          '// Після maxFlow:',
          'vector<char> side(n);',
          'queue<int> q; q.push(source); side[source] = true;',
          '// BFS лише по edges з cap > 0 відновлює S-side min cut.',
        ),
        'Безпечний INF і відновлення cut',
      ),
      note(
        'Vertex splitting',
        'Усі вхідні ребра веди у v_in, усі вихідні — з v_out. Єдине ребро v_in→v_out кодує обмеження вершини.',
      ),
    ],
    theory: [
      p(
        'Cut — partition (S-side,T-side); його capacity є сумою capacities ребер, що йдуть із S-side у T-side. Reverse edges не входять до capacity початкового cut.',
      ),
      note(
        'Costs змінюють ціль',
        'Min-Cost Max-Flow оптимізує cost серед потоків заданого або максимального значення. Hungarian спеціалізується на квадратному assignment.',
      ),
    ],
    extensions: [
      {
        title: 'Min-Cost Max-Flow та Hungarian',
        blocks: [
          p(
            'У MCMF residual edges мають протилежну cost; shortest augmenting paths потребують potentials або Bellman–Ford-подібної обробки. Hungarian дає O(n³) для assignment matrix.',
          ),
        ],
      },
    ],
  }),
];

export const flowTasks = [
  learning('bipartite-matching', {
    id: 'internship-assignment',
    title: 'Розподіл стажувань',
    statement: [
      'Є n студентів і m компаній. Для кожного студента задано компанії, у яких він може стажуватися. Одна компанія бере не більше одного студента. Знайди максимальну кількість призначених студентів.',
    ],
    input: 'n, m, e, потім e пар student company; нумерація з 1.',
    output: 'Максимальна кількість призначень.',
    constraints: ['1 ≤ n,m ≤ 2000', '0 ≤ e ≤ 20000'],
    examples: [example('3 3 4\n1 1\n1 2\n2 1\n3 2', '2')],
    tryYourself:
      'Намалюй дві частини графа. Знайди приклад, де вибір першої доступної компанії дає менше призначень, ніж optimum.',
    hint: 'Дозволь DFS переселити студента, який уже займає бажану компанію.',
    firstApproach: [
      p('Йдемо студентами та віддаємо кожному першу вільну сумісну компанію.'),
    ],
    approachReview:
      'Greedy фіксує ранній вибір. Студент із багатьма варіантами може забрати єдину компанію іншого студента.',
    observation: [
      visual('augmenting-path'),
      p(
        'Якщо компанія зайнята, шукаємо alternating path, що переведе її власника в інше місце. Успішний шлях збільшує matching на один.',
      ),
    ],
    algorithm: [
      'Побудуй adjacency list студент → сумісні компанії.',
      'Зберігай mt[company] — поточного студента або −1.',
      'Для кожного студента очисть used і запусти tryKuhn.',
      'У DFS займи вільну компанію або рекурсивно перепризнач її власника.',
    ],
    proof:
      'Кожен успішний DFS знаходить augmenting path, інверсія якого зберігає matching і збільшує його. Коли жодна вільна ліва вершина не має augmenting path, за теоремою Berge matching максимальний.',
    complexity: 'O(VE) часу для простого Kuhn і O(V+E) пам’яті.',
    solution: cpp(
      lines(
        '    int n,m,e; cin>>n>>m>>e;',
        '    vector<vector<int>> g(n);',
        '    while(e--){int v,to;cin>>v>>to;g[v-1].push_back(to-1);}',
        '    vector<int> mt(m,-1), used(n);',
        '    auto dfs = [&](auto&& self,int v)->bool{',
        '        if(used[v]) return false;',
        '        used[v]=1;',
        '        for(int to:g[v]) if(mt[to]==-1 || self(self,mt[to])){',
        '            mt[to]=v; return true;',
        '        }',
        '        return false;',
        '    };',
        '    int answer=0;',
        '    for(int v=0;v<n;++v){fill(used.begin(),used.end(),0);answer+=dfs(dfs,v);}',
        '    cout<<answer<<"\\n";',
      ),
    ),
    takeaway:
      'Matching потребує не незворотного greedy, а механізму перебудови попередніх призначень.',
  }),
  practice('bipartite-matching', {
    id: 'workers-and-shifts',
    title: 'Працівники та зміни',
    statement: [
      'Кожен працівник може вийти лише в деякі зміни, а на одну зміну потрібна одна людина. Знайди максимум закритих змін.',
    ],
    input: 'n, m, e та e допустимих пар.',
    output: 'Максимальна кількість пар.',
    constraints: ['n,m ≤ 1500', 'e ≤ 15000'],
    examples: [example('2 3 3\n1 1\n1 2\n2 2', '2')],
    hint: 'Явно визнач дві частини та застосуй augmenting paths.',
  }),
  practice('bipartite-matching', {
    id: 'compatible-pairs',
    title: 'Максимум сумісних пар',
    statement: [
      'Є n модулів типу A і m модулів типу B. Пара сумісна, якщо сума їх кодів є простим числом. Знайди максимум неперетинних сумісних пар.',
    ],
    input: 'n, m і два масиви кодів.',
    output: 'Максимальна кількість пар.',
    constraints: ['n,m ≤ 600', 'коди ≤ 10⁶'],
    examples: [example('2 2\n1 4\n2 3', '2')],
    hint: 'Спершу побудуй ребра за математичною умовою, далі задача вже не про числа.',
  }),
  practice('bipartite-matching', {
    id: 'domino-tiling-board',
    title: 'Domino tiling',
    statement: [
      'На дошці з заблокованими клітинками потрібно розмістити максимум доміно 1×2 без перекриттів. Виведи їх кількість.',
    ],
    input: 'h, w і grid з . та #.',
    output: 'Максимальна кількість доміно.',
    constraints: ['h·w ≤ 2500'],
    examples: [example('2 3\n...\n.#.', '2')],
    hint: 'Розфарбуй grid шахово: кожне доміно з’єднує різні кольори.',
  }),
  learning('max-flow-min-cut', {
    id: 'data-channel',
    title: 'Канал передачі',
    statement: [
      'Є directed network із source 1 і sink n. Кожен канал має пропускну здатність. Знайди максимальний обсяг даних, який можна одночасно передати.',
    ],
    input: 'n, m, далі m трійок u v capacity.',
    output: 'Значення maximum flow з 1 до n.',
    constraints: ['2 ≤ n ≤ 500', '1 ≤ m ≤ 10000', 'capacity ≤ 10⁹'],
    examples: [example('4 5\n1 2 3\n1 3 2\n2 4 2\n3 4 4\n2 3 1', '5')],
    tryYourself:
      'Спробуй відправити flow кількома шляхами. Що має змінитися в мережі після кожної відправки?',
    hint: 'Залишкова мережа повинна показувати не лише невикористану capacity, а й можливість скасувати flow.',
    firstApproach: [
      p(
        'Щоразу обираємо шлях із найбільшою bottleneck capacity і незворотно заповнюємо його.',
      ),
    ],
    approachReview:
      'Локально широкий шлях може зайняти критичне ребро. Без reverse edges алгоритм не вміє перенаправити попередній flow.',
    observation: [
      visual('residual-flow'),
      p(
        'Після push x forward residual зменшується на x, reverse residual збільшується на x. Це кодує всі допустимі виправлення поточного flow.',
      ),
    ],
    algorithm: [
      'Додай для кожного каналу forward edge і reverse edge з нульовою capacity.',
      'BFS побудуй level graph у residual network.',
      'DFS із ptr знайди blocking flow лише через level+1.',
      'Повторюй фази, поки sink досяжний.',
    ],
    proof:
      'Кожний push не перевищує residual capacity і зберігає conservation. Після завершення sink недосяжний у residual graph; reachable множина задає cut з capacity, рівною поточному flow, тому більшого flow не існує.',
    complexity:
      'Стандартна загальна оцінка Dinic — O(V²E) часу, пам’ять O(V+E); на багатьох олімпіадних мережах він значно швидший.',
    solution: cpp(
      lines(
        '    int n,m;cin>>n>>m;Dinic dinic(n);',
        '    while(m--){int u,v;long long c;cin>>u>>v>>c;dinic.addEdge(u-1,v-1,c);}',
        '    cout<<dinic.maxFlow(0,n-1)<<"\\n";',
      ),
      dinicCode,
    ),
    takeaway:
      'Residual graph — не технічна деталь, а повний простір способів змінити поточний flow.',
  }),
  practice('max-flow-min-cut', {
    id: 'water-network',
    title: 'Водопровідна мережа',
    statement: [
      'Труби можуть бути двонапрямними й мають спільну capacity. Знайди максимум води між станціями S і T.',
    ],
    input: 'n, m, S, T і m труб u v c.',
    output: 'Maximum flow.',
    constraints: ['n ≤ 500', 'm ≤ 5000'],
    examples: [example('3 2 1 3\n1 2 4\n2 3 3', '3')],
    hint: 'Уточни модель undirected capacity: додай два початкові directed edges.',
  }),
  practice('max-flow-min-cut', {
    id: 'vertex-capacities',
    title: 'Vertex capacities',
    statement: [
      'Канали необмежені, але через кожен проміжний сервер може пройти не більше c[v] одиниць. Знайди maximum flow.',
    ],
    input: 'Граф, S, T та capacities вершин.',
    output: 'Maximum flow.',
    constraints: ['n ≤ 300', 'm ≤ 5000'],
    examples: [example('3 2\n1 2\n2 3\n1 2 1\n1 3', '1')],
    hint: 'Розщепи v на v_in і v_out.',
  }),
  practice('max-flow-min-cut', {
    id: 'edge-disjoint-routes',
    title: 'Неперетинні маршрути',
    statement: [
      'Знайди максимальну кількість маршрутів S→T, які не використовують спільних directed edges.',
    ],
    input: 'n, m, S, T та ребра.',
    output: 'Максимальна кількість маршрутів.',
    constraints: ['n ≤ 1000', 'm ≤ 10000'],
    examples: [example('4 4 1 4\n1 2\n2 4\n1 3\n3 4', '2')],
    hint: 'Unit capacity і integrality theorem перетворюють flow на набір шляхів.',
  }),
  learning('flow-reformulation', {
    id: 'disconnect-network',
    title: 'Відключити мережу',
    statement: [
      'У directed network кожен канал можна знищити за задану ціну. Знайди мінімальну сумарну ціну, після якої T стане недосяжним із S.',
    ],
    input: 'n, m, S, T, потім m ребер u v cost.',
    output: 'Мінімальна ціна відключення.',
    constraints: ['2 ≤ n ≤ 500', 'm ≤ 10000', 'cost ≤ 10⁹'],
    examples: [example('4 5 1 4\n1 2 3\n1 3 2\n2 4 2\n3 4 4\n2 3 1', '5')],
    tryYourself:
      'Сформулюй, що таке набір ребер, який відділяє S від T. Яка числова характеристика цього набору?',
    hint: 'Ціну видалення ребра використай як його capacity.',
    firstApproach: [
      p(
        'Перебираємо підмножини каналів, видаляємо їх і DFS перевіряємо досяжність T.',
      ),
    ],
    approachReview:
      'Є 2^m наборів. Потрібна еквівалентна оптимізаційна модель, яка охоплює всі cuts без явного перебору.',
    observation: [
      visual('min-cut-model'),
      p(
        'Будь-яке допустиме відключення містить S–T cut. Ціна cut — сума capacities його forward edges, а minimum cut дорівнює maximum flow.',
      ),
    ],
    algorithm: [
      'Побудуй flow network із capacity, рівними цінам руйнування.',
      'Обчисли maximum flow з S до T алгоритмом Dinic.',
      'Поверни значення flow — за Max-Flow Min-Cut theorem це мінімальна ціна.',
    ],
    proof:
      'Кожен набір видалених ребер, що розриває всі S→T шляхи, містить cut не дорожчий за себе. І навпаки, ребра будь-якого cut достатньо видалити. Отже optimum задачі дорівнює minimum cut, а theorem прирівнює його до maximum flow.',
    complexity: 'O(V²E) часу в загальній оцінці Dinic та O(V+E) пам’яті.',
    solution: cpp(
      lines(
        '    int n,m,s,t;cin>>n>>m>>s>>t;Dinic dinic(n);',
        '    while(m--){int u,v;long long c;cin>>u>>v>>c;dinic.addEdge(u-1,v-1,c);}',
        '    cout<<dinic.maxFlow(s-1,t-1)<<"\\n";',
      ),
      dinicCode,
    ),
    takeaway:
      'Складне видалення перетворилося на flow лише після доказу: feasible disconnects ↔ cuts.',
  }),
  practice('flow-reformulation', {
    id: 'minimum-vertex-cut',
    title: 'Захист серверів',
    statement: [
      'Кожен проміжний сервер можна вимкнути за ціну. Мінімізуй ціну, щоб розірвати всі S→T маршрути; S і T вимикати не можна.',
    ],
    input: 'Граф і costs вершин.',
    output: 'Minimum cost.',
    constraints: ['n ≤ 300', 'm ≤ 5000'],
    examples: [example('3 2\n5 2 5\n1 2\n2 3\n1 3', '2')],
    hint: 'Vertex splitting переносить ціну вершини на одне ребро.',
  }),
  practice('flow-reformulation', {
    id: 'maximum-profit-closure',
    title: 'Залежні проєкти',
    statement: [
      'Проєкт має прибуток або витрату. Якщо обрати A, треба обрати всі його prerequisite-проєкти. Максимізуй сумарний результат.',
    ],
    input: 'Values проєктів і directed prerequisites.',
    output: 'Максимальний прибуток.',
    constraints: ['n ≤ 500', 'm ≤ 5000', '|value| ≤ 10⁹'],
    examples: [example('2 1\n10 -3\n1 2', '7')],
    hint: 'Positive values з’єднай із source, negative — із sink; implication має INF capacity.',
  }),
  practice('flow-reformulation', {
    id: 'cheap-deliveries',
    title: 'Дешеві перевезення',
    statement: [
      'Кожен канал має capacity і cost за одиницю. Треба передати рівно F одиниць із S у T з мінімальною сумарною ціною або повідомити, що це неможливо.',
    ],
    input: 'Network, capacities, costs і F.',
    output: 'Minimum cost або −1.',
    constraints: ['n ≤ 200', 'm ≤ 2000', 'F ≤ 10⁶'],
    examples: [example('2 1 3\n1 2 5 4', '12')],
    hint: 'Це extension: shortest augmenting path у residual network із costs.',
  }),
];
