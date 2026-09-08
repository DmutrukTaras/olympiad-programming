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

export const gamePatterns = [
  pattern({
    id: 'winning-losing-states',
    chapterId: 'ch-25',
    title: 'Winning та Losing States',
    description:
      'Перетворюємо гру без нічиїх на state graph і класифікуємо позиції за переходами до вже відомих станів.',
    intuition: [
      p(
        'Не потрібно перебирати всі партії. Losing state не має ходу в програш суперника; winning state має хоча б один такий хід.',
      ),
      visual('game-states'),
    ],
    modeling: [
      table(
        ['Ігрове поняття', 'State graph'],
        [
          ['позиція', 'вершина'],
          ['допустимий хід', 'directed edge'],
          ['немає ходів', 'terminal losing state'],
          ['є edge у losing', 'winning'],
          ['усі edges у winning', 'losing'],
        ],
      ),
      note(
        'Правила завершення',
        'Normal play, misère play та можливість нічиєї дають різні базові стани. Зафіксуй їх до побудови DP.',
      ),
    ],
    priorKnowledge: [
      'Combination → DP на DAG',
      'Advanced → graph states та topological order',
      'Новий крок → квантори “існує” і “для всіх” для двох гравців',
    ],
    recognitionSigns: [
      'Двоє гравців по черзі змінюють один повністю видимий state.',
      'Ходи детерміновані, інформація повна, випадковості немає.',
      'Потрібно визначити переможця за оптимальної гри.',
    ],
    constraintSignals: [
      'Якщо state — число до 10⁶, можливий лінійний DP.',
      'Для explicit DAG потрібен O(V+E) аналіз.',
      'State graph із циклами може мати draws і потребує retrograde analysis.',
    ],
    notApplicableSigns: [
      'У грі є прихована інформація або випадкові події.',
      'Гравці можуть ходити одночасно або мають різні набори ходів без state turn.',
      'Цикли допускають нескінченну гру, а модель має лише W/L.',
    ],
    knowledge: [
      p(
        'W/L recurrence є minimax для boolean outcome: поточний гравець обирає один successor, суперник потім теж грає оптимально. Тому достатньо знати outcome state, а не весь шлях гри.',
      ),
      visual('game-states'),
      note(
        'Dependency order',
        'Обчислюй state лише після всіх successors: за зростанням ресурсу, reverse topological order або memoized DFS на acyclic graph.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'vector<char> win(n + 1);',
          'for (int state = 1; state <= n; ++state) {',
          '    for (int move : moves) {',
          '        if (move <= state && !win[state - move]) {',
          '            win[state] = true;',
          '            break;',
          '        }',
          '    }',
          '}',
        ),
        'Subtraction game DP',
      ),
      note(
        'Не плутай turn',
        'win[state] означає результат для гравця, який зараз ходить, тому окрема координата turn часто не потрібна у симетричній грі.',
      ),
    ],
    theory: [
      p(
        'Для terminal state твердження очевидне. Індукція по dependency order доводить recurrence: хід у L дає виграш, а якщо всі варіанти W, суперник виграє після будь-якого ходу.',
      ),
      note(
        'Відновлення стратегії',
        'Для winning state збережи будь-який move у losing state. Це certificate першого кроку оптимальної стратегії.',
      ),
    ],
    extensions: [
      {
        title: 'Retrograde analysis і draws',
        blocks: [
          p(
            'На graph із циклами стартуємо з terminal states, поширюємо W/L через reverse edges і remaining degree. Невизначені вершини після процесу відповідають позиціям, де можлива нічия.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'nim-xor',
    chapterId: 'ch-25',
    title: 'Nim та XOR',
    description:
      'Розпізнаємо незалежні купи Nim і доводимо виграшність через інваріант нульового XOR.',
    intuition: [
      p(
        'Nim sum не є випадковою формулою. Із XOR=0 будь-який один хід робить XOR ненульовим, а з ненульового XOR існує хід назад у zero.',
      ),
      visual('nim-xor'),
    ],
    modeling: [
      table(
        ['Властивість', 'Nim'],
        [
          ['компоненти', 'незалежні купи'],
          ['хід', 'зменшити рівно одну купу'],
          ['normal play', 'останній хід виграє'],
          ['інваріант P-position', 'xor усіх розмірів = 0'],
        ],
      ),
    ],
    priorKnowledge: [
      'Foundation → bitwise XOR',
      'Advanced → highest set bit',
      'Challenge → winning/losing proof',
    ],
    recognitionSigns: [
      'Є кілька незалежних ресурсів/куп.',
      'За хід змінюється рівно одна компонента.',
      'Компоненту можна зменшити до будь-якого меншого невід’ємного значення.',
    ],
    constraintSignals: [
      'Потрібен один O(n) XOR навіть для величезних pile sizes.',
      'Для відновлення winning move достатньо другого проходу.',
      'Змінені дозволені ходи вимагають Grundy, а не розміру купи.',
    ],
    notApplicableSigns: [
      'Хід одночасно змінює кілька куп.',
      'Компоненти взаємодіють спільним обмеженням.',
      'Misère rule застосовано без окремої обробки випадку всіх одиниць.',
    ],
    knowledge: [
      p(
        'Позиції XOR=0 називають P-positions: попередній гравець може форсувати виграш. XOR≠0 — N-positions: наступний гравець має хід у P-position.',
      ),
      visual('nim-xor'),
      note(
        'Побудова ходу',
        'Нехай X — загальний XOR. Для купи a обчисли target=a⊕X; якщо target<a, зменшення a до target робить XOR нульовим.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'long long nimSum = 0;',
          'for (long long pile : piles) nimSum ^= pile;',
          'if (nimSum != 0) {',
          '    for (int i = 0; i < int(piles.size()); ++i) {',
          '        long long target = piles[i] ^ nimSum;',
          '        if (target < piles[i]) { /* winning move i -> target */ break; }',
          '    }',
          '}',
        ),
        'Winner і winning move',
      ),
      note(
        'Тип числа',
        'XOR виконуй у безпечному цілому типі, який містить найбільший pile. Не змішуй signed shift із від’ємними значеннями.',
      ),
    ],
    theory: [
      p(
        'У найстаршому встановленому bit X є непарна кількість куп із 1. Обрана така купа після a→a⊕X строго зменшується й зануляє кожен bit загального XOR.',
      ),
      note(
        'Nim як базова система',
        'Sprague–Grundy theorem покаже, чому складні незалежні impartial games теж комбінуються XOR-ом.',
      ),
    ],
    extensions: [
      {
        title: 'Misère Nim',
        blocks: [
          p(
            'Коли останній хід програє, звичайне правило XOR працює, доки є купа >1. Якщо всі купи одиничні, результат визначає parity їх кількості.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'sprague-grundy',
    chapterId: 'ch-25',
    title: 'Sprague–Grundy Theory',
    description:
      'Присвоюємо impartial state еквівалентний розмір Nim-купи через mex і XOR-комбінуємо незалежні ігри.',
    intuition: [
      p(
        'Grundy number state — це номер Nim-купи з такою самою поведінкою у сумі з будь-якою іншою impartial game. Він дорівнює mex Grundy усіх ходів.',
      ),
      visual('grundy-mex'),
    ],
    modeling: [
      table(
        ['Умова theorem', 'Зміст'],
        [
          ['impartial', 'набір ходів однаковий для обох гравців'],
          ['normal play', 'хто не може ходити — програє'],
          ['finite/acyclic', 'гра гарантовано завершується'],
          ['disjunctive sum', 'за хід змінюється одна незалежна компонента'],
        ],
      ),
      note(
        'MEX повертається',
        'Foundation-операція “найменше відсутнє” тут будує повний algebraic value state, а не просто локальну статистику.',
      ),
    ],
    priorKnowledge: [
      'Foundation → MEX',
      'Advanced → DAG DP',
      'Challenge → Nim invariant',
    ],
    recognitionSigns: [
      'Гра складається з кількох незалежних boards/tokens.',
      'Хід обирає рівно одну компоненту.',
      'Кожна компонента є finite impartial normal-play game.',
    ],
    constraintSignals: [
      'Explicit DAG дозволяє O(V+E) Grundy computation плюс mex.',
      'MEX successor values не перевищує outdegree, тож можна використовувати timestamp array.',
      'Дуже великий numeric state може мати periodic Grundy extension.',
    ],
    notApplicableSigns: [
      'Partizan game: гравці мають різні ходи.',
      'Misère play без спеціальної theorem.',
      'Компоненти не незалежні або один хід змінює кілька з них.',
    ],
    knowledge: [
      p(
        'Terminal state має g=0. Для іншого state g=mex{g(to)}: отже він має хід до кожного меншого Grundy і не має ходу до такого самого value. Саме це відтворює поведінку Nim pile.',
      ),
      visual('grundy-mex'),
      note(
        'Сума ігор',
        'Grundy незалежних компонент XOR-иться. Нуль означає losing position, ненульове значення — існування ходу в zero.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'vector<int> grundy(n);',
          'vector<int> seen(maxOutDegree + 2, -1);',
          'for (int v : reverseTopologicalOrder) {',
          '    for (int to : g[v])',
          '        if (grundy[to] < int(seen.size())) seen[grundy[to]] = v;',
          '    while (grundy[v] < int(seen.size()) && seen[grundy[v]] == v)',
          '        ++grundy[v];',
          '}',
        ),
        'MEX без очищення масиву',
      ),
      note(
        'Order',
        'У reverse topological order усі g[to] уже відомі. Для numeric state той самий принцип задає напрям циклу або memoized DFS.',
      ),
    ],
    theory: [
      p(
        'Sprague–Grundy theorem є reduction: не симулюємо комбінацію всіх boards, а стискаємо кожну до одного числа. XOR зберігає точний W/L outcome їх суми.',
      ),
      note(
        'Не лише winner',
        'Winning move знаходять перебором однієї компоненти: потрібен successor, після заміни Grundy якого загальний XOR стане нулем.',
      ),
    ],
    extensions: [
      {
        title: 'Grundy periodicity',
        blocks: [
          p(
            'Для деяких subtraction games послідовність Grundy стає періодичною. Період треба довести через достатній state window, а не вгадати за кількома значеннями.',
          ),
        ],
      },
    ],
  }),
];

export const gameTasks = [
  learning('winning-losing-states', {
    id: 'stones-134',
    title: 'Камінці',
    statement: [
      'Є n камінців. За хід можна забрати 1, 3 або 4 камінці. Хто не може зробити хід, програє. Визнач переможця за оптимальної гри.',
    ],
    input: 'Одне число n.',
    output: 'FIRST або SECOND.',
    constraints: ['0 ≤ n ≤ 10⁷'],
    examples: [example('7', 'SECOND')],
    tryYourself:
      'Випиши результати для n=0..10 і поясни кожен через outcomes доступних наступних станів.',
    hint: 'State виграшний, якщо існує хід у програшний state.',
    firstApproach: [
      p('Будуємо повне дерево всіх партій і запускаємо minimax від листків.'),
    ],
    approachReview:
      'Один і той самий залишок камінців виникає в багатьох гілках. Дерево експоненційне, хоча різних states лише n+1.',
    observation: [
      visual('game-states'),
      p(
        'Майбутнє залежить лише від числа камінців. Це DP на acyclic state graph із базою win[0]=false.',
      ),
    ],
    algorithm: [
      'Створи win[0..n], win[0]=false.',
      'Для state від 1 до n перевір ходи 1,3,4.',
      'Познач state winning, якщо хоча б один допустимий predecessor state losing.',
      'Виведи результат win[n].',
    ],
    proof:
      'Індукція по n. Якщо існує хід у losing state, перший гравець обирає його й виграє. Якщо всі допустимі ходи ведуть у winning states, суперник після будь-якого вибору має виграшну стратегію.',
    complexity: 'O(n) часу й O(n) пам’яті; пам’ять можна стиснути до 5 states.',
    solution: cpp(
      lines(
        '    int n;cin>>n;vector<char> win(n+1);',
        '    vector<int> moves={1,3,4};',
        '    for(int s=1;s<=n;++s)for(int d:moves)',
        '        if(d<=s && !win[s-d]){win[s]=1;break;}',
        '    cout<<(win[n]?"FIRST":"SECOND")<<"\\n";',
      ),
    ),
    takeaway:
      'State graph стискає однакові підпартії; W/L recurrence є boolean DP з правильними кванторами.',
  }),
  practice('winning-losing-states', {
    id: 'custom-removal-game',
    title: 'Removal Game',
    statement: [
      'Є n жетонів і k дозволених розмірів ходу. Визнач outcomes для всіх стартів 1..n.',
    ],
    input: 'n, k та moves.',
    output: 'Рядок W/L довжини n.',
    constraints: ['n≤10⁶', 'k≤20'],
    examples: [example('5 2\n1 2', 'WWLWW')],
    hint: 'Один DP одночасно відповідає для всіх стартів.',
  }),
  practice('winning-losing-states', {
    id: 'token-on-dag',
    title: 'Фішка на DAG',
    statement: [
      'Фішка стоїть у вершині DAG. За хід її рухають ребром; хто не може ходити, програє. Визнач outcome кожної вершини.',
    ],
    input: 'DAG n,m.',
    output: 'W або L для всіх вершин.',
    constraints: ['n,m≤2·10⁵'],
    examples: [example('3 2\n1 2\n2 3', 'L W L')],
    hint: 'Потрібен reverse topological order.',
  }),
  practice('winning-losing-states', {
    id: 'cyclic-game-draws',
    title: 'Гра з нічиїми',
    statement: [
      'У directed graph можуть бути цикли. Класифікуй старт як WIN, LOSE або DRAW за нескінченної гри.',
    ],
    input: 'Graph і start.',
    output: 'Один із трьох outcomes.',
    constraints: ['n,m≤2·10⁵'],
    examples: [example('2 2 1\n1 2\n2 1', 'DRAW')],
    hint: 'Поширюй від terminal states через reverse graph; невизначені states — draws.',
  }),
  learning('nim-xor', {
    id: 'coin-heaps-nim',
    title: 'Купки монет',
    statement: [
      'Є n куп монет. За хід гравець обирає одну купу й забирає будь-яку додатну кількість. Хто забирає останню монету, виграє. Визнач переможця.',
    ],
    input: 'n і розміри куп.',
    output: 'FIRST або SECOND.',
    constraints: ['1≤n≤2·10⁵', '0≤a[i]≤10¹⁸'],
    examples: [example('3\n3 4 5', 'FIRST')],
    tryYourself:
      'Перевір кілька позицій із двома малими купами. Які з них програшні?',
    hint: 'Обчисли XOR усіх pile sizes.',
    firstApproach: [
      p(
        'Рекурсивно перебираємо всі можливі зменшення кожної купи та memoize весь vector sizes.',
      ),
    ],
    approachReview:
      'Кількість vectors величезна, а один state має до суми розмірів ходів. Потрібен algebraic invariant.',
    observation: [
      visual('nim-xor'),
      p(
        'Zero XOR є losing: будь-яка зміна однієї купи робить його nonzero. Із nonzero XOR існує зменшення однієї купи до zero XOR.',
      ),
    ],
    algorithm: [
      'Обчисли nimSum як XOR усіх a[i].',
      'Якщо nimSum=0, виведи SECOND.',
      'Інакше виведи FIRST; за потреби знайди pile з (a[i] xor nimSum)<a[i].',
    ],
    proof:
      'Будь-який хід із zero XOR змінює найстарший bit, де стара й нова купа різняться, тому XOR стає nonzero. Для nonzero X вибираємо купу з найстаршим встановленим bit X; a xor X менше a й зануляє загальний XOR.',
    complexity: 'O(n) часу та O(1) додаткової пам’яті.',
    solution: cpp(
      lines(
        '    int n;cin>>n;unsigned long long x=0;',
        '    for(int i=0;i<n;++i){unsigned long long a;cin>>a;x^=a;}',
        '    cout<<(x?"FIRST":"SECOND")<<"\\n";',
      ),
    ),
    takeaway:
      'Nim formula працює через доведений invariant, а не через схожість гри на купи.',
  }),
  practice('nim-xor', {
    id: 'find-nim-move',
    title: 'Знайди виграшний хід',
    statement: [
      'Для виграшної Nim-позиції виведи номер купи та її новий розмір, що залишає zero XOR.',
    ],
    input: 'n і piles.',
    output: 'i newSize або -1 для losing state.',
    constraints: ['n≤2·10⁵'],
    examples: [example('3\n3 4 5', '1 1')],
    hint: 'target=a[i] xor nimSum має бути меншим за a[i].',
  }),
  practice('nim-xor', {
    id: 'staircase-nim',
    title: 'Монети на сходах',
    statement: [
      'Кожна монета може рухатися вниз, не перетинаючи наступну. Визнач winner.',
    ],
    input: 'Позиції монет у sorted порядку.',
    output: 'FIRST або SECOND.',
    constraints: ['n≤2·10⁵'],
    examples: [example('2\n1 3', 'FIRST')],
    hint: 'Перетвори незалежні проміжки між парними позиціями на Nim piles.',
  }),
  practice('nim-xor', {
    id: 'misere-nim',
    title: 'Misère Nim',
    statement: [
      'У Nim той, хто забирає останню монету, програє. Визнач winner.',
    ],
    input: 'n і piles.',
    output: 'FIRST або SECOND.',
    constraints: ['n≤2·10⁵'],
    examples: [example('3\n1 1 1', 'SECOND')],
    hint: 'Окремо оброби позицію, де всі непорожні купи дорівнюють 1.',
  }),
  learning('sprague-grundy', {
    id: 'tokens-on-tracks',
    title: 'Фішки на доріжках',
    statement: [
      'Дано DAG і k фішок у його вершинах. За хід перемісти рівно одну фішку вздовж outgoing edge. Хто не може ходити, програє. Визнач переможця.',
    ],
    input: 'n,m,k, edges DAG і k стартових вершин.',
    output: 'FIRST або SECOND.',
    constraints: ['n,m≤2·10⁵', 'k≤2·10⁵'],
    examples: [example('4 4 2\n1 2\n1 3\n2 4\n3 4\n1 2', 'FIRST')],
    tryYourself:
      'Порахуй Grundy terminal вершини, її predecessors і XOR для двох фішок у sample.',
    hint: 'g[v]=mex Grundy усіх outgoing neighbors.',
    firstApproach: [
      p(
        'Будуємо загальний state як k позицій фішок і запускаємо W/L DP по декартовому добутку.',
      ),
    ],
    approachReview:
      'Кількість combined states може бути n^k. Незалежність компонент дозволяє стиснути кожну фішку окремо.',
    observation: [
      visual('grundy-mex'),
      p(
        'Кожна позиція фішки еквівалентна Nim pile розміру g[v]. Сума незалежних ігор має Grundy, рівний XOR.',
      ),
    ],
    algorithm: [
      'Знайди topological order DAG.',
      'У reverse order обчисли g[v]=mex{g[to]}.',
      'XOR Grundy усіх стартових вершин.',
      'Nonzero означає FIRST, zero — SECOND.',
    ],
    proof:
      'За Sprague–Grundy theorem кожна finite impartial component еквівалентна Nim pile її Grundy size. Хід змінює рівно одну фішку, тому гра є disjunctive sum, значення якої дорівнює XOR компонент.',
    complexity: 'O(n+m+k) очікуваного часу та O(n+m) пам’яті.',
    solution: cpp(
      lines(
        '    int n,m,k;cin>>n>>m>>k;vector<vector<int>>g(n);vector<int>indeg(n);',
        '    for(int i=0;i<m;++i){int u,v;cin>>u>>v;g[--u].push_back(--v);++indeg[v];}',
        '    queue<int>q;for(int v=0;v<n;++v)if(!indeg[v])q.push(v);vector<int>ord;',
        '    while(!q.empty()){int v=q.front();q.pop();ord.push_back(v);for(int to:g[v])if(--indeg[to]==0)q.push(to);}',
        '    vector<int>gr(n),seen(n+1,-1);',
        '    for(int z=n-1;z>=0;--z){int v=ord[z];for(int to:g[v])if(gr[to]<=n)seen[gr[to]]=v;',
        '        while(gr[v]<=n && seen[gr[v]]==v)++gr[v];}',
        '    int total=0;while(k--){int v;cin>>v;total^=gr[v-1];}',
        '    cout<<(total?"FIRST":"SECOND")<<"\\n";',
      ),
    ),
    takeaway:
      'Grundy стискає одну гру до Nim value; незалежні компоненти комбінуються XOR без product state.',
  }),
  practice('sprague-grundy', {
    id: 'subtraction-grundy',
    title: 'Grundy subtraction game',
    statement: [
      'Для moves set обчисли Grundy states 0..n та winner для кількох незалежних куп.',
    ],
    input: 'moves, n і piles.',
    output: 'FIRST або SECOND.',
    constraints: ['n≤10⁶', 'moves≤30'],
    examples: [example('2 5\n1 3\n2\n4 5', 'FIRST')],
    hint: 'Для однієї купи розмір уже не обов’язково дорівнює її Grundy.',
  }),
  practice('sprague-grundy', {
    id: 'split-pile-game',
    title: 'Розділення купи',
    statement: [
      'За хід одну купу можна розбити на дві нерівні додатні купи. Визнач winner для кількох стартових куп.',
    ],
    input: 'n і sizes.',
    output: 'FIRST або SECOND.',
    constraints: ['max size≤5000'],
    examples: [example('1\n3', 'FIRST')],
    hint: 'Grundy одного ходу дорівнює XOR двох нових компонент.',
  }),
  practice('sprague-grundy', {
    id: 'hidden-independent-boards',
    title: 'Незалежні роботи',
    statement: [
      'Кілька роботів рухаються по однаковому DAG; за хід можна пересунути одного. Визнач winner і один winning move.',
    ],
    input: 'DAG і positions.',
    output: 'Outcome та move.',
    constraints: ['n,m,k≤2·10⁵'],
    examples: [example('2 1 1\n1 2\n1', 'FIRST\n1 2')],
    hint: 'Після XOR знайди component successor, який занулить total.',
  }),
];
