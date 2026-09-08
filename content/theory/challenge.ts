import type { TheorySections } from '@/content/theory/helpers';
import { list, note, paragraph, table } from '@/content/theory/helpers';

type DeepTheoryInput = {
  reduction: string;
  mechanics: string;
  invariant: string;
  proof: string;
  costs: [string, string][];
  failures: string[];
  variants: string;
  checks: string[];
};

const deepTheory = ({
  reduction,
  mechanics,
  invariant,
  proof,
  costs,
  failures,
  variants,
  checks,
}: DeepTheoryInput): TheorySections => [
  {
    title: 'Переформулювання і механіка крок за кроком',
    blocks: [
      paragraph(reduction),
      paragraph(mechanics),
      note(
        'Два напрямки reduction',
        'Окремо опиши, як початкове рішення переходить у нову модель і як результат алгоритму перетворюється назад. Збіг лише optimal values без відповідності допустимих рішень часто приховує помилку.',
      ),
    ],
  },
  {
    title: 'Інваріант, коректність і повна оцінка',
    blocks: [
      paragraph(invariant),
      paragraph(proof),
      table(
        ['Частина', 'Оцінка або ресурс'],
        costs.map(([part, value]) => [part, value]),
      ),
      note(
        'Не ховай множники',
        'Порахуй кількість states, transitions, шарів DP, сегментів декомпозиції та запусків структури окремо. Для Challenge-вправ фінальна складність часто є добутком двох знайомих оцінок.',
      ),
    ],
  },
  {
    title: 'Межі застосовності, варіанти й stress-check',
    blocks: [
      paragraph(variants),
      list(...failures),
      note(
        'Перед submit',
        'Порівняй optimized solution із простим exact алгоритмом на малих random tests. Окремо перевір найменшу структуру, порожній набір переходів, однакові optimum, великі значення та випадок, де локальна евристика навмисно помиляється.',
      ),
      list(...checks),
    ],
  },
];

export const challengeTheoryAdditions: Record<string, TheorySections> = {
  'bipartite-matching': deepTheory({
    reduction:
      'Почни з визначення двох типів об’єктів. Left vertex представляє об’єкт, якому треба щось призначити; right vertex — ресурс, що може бути використаний один раз; edge існує рівно для допустимої пари. Якщо одна зі сторін має capacity k, просте копіювання vertex можливе лише для малого k, а загальна модель уже природніше є flow. Після побудови graph matching однозначно задає набір призначень без конфліктів, а будь-яке допустиме призначення є matching, тому maximum sizes збігаються.',
    mechanics:
      'Kuhn запускає DFS від ще не обробленої left vertex. Для right vertex to він або займає її, якщо mt[to]=−1, або просить поточного власника знайти інший вихід. Успішна рекурсія повертається назад і перепризначає всі пари вздовж alternating path. Масив used належить одному пошуку й забороняє повторний обхід left vertices; mt є глобальним поточним matching. Порядок left vertices і adjacency може впливати на практичний час, але не на правильність.',
    invariant:
      'До кожного DFS mt описує коректний matching. Під час успішного повернення right vertex отримує рівно одного нового власника, а попередній власник спочатку знаходить іншу right vertex. Тому жодна вершина не стає кінцем двох matching edges. Неуспішний DFS не змінює остаточний matching. Один успішний пошук збільшує його розмір рівно на один.',
    proof:
      'За теоремою Berge matching максимальний тоді й лише тоді, коли augmenting path не існує. DFS Kuhn перебирає всі alternating продовження з поточної вільної left vertex. Після спроби кожної left vertex відсутність успішного DFS означає відсутність augmenting path від будь-якого вільного start, тож поточний matching maximum. Для reconstruction пройди right vertices і прочитай пари mt[to]→to.',
    costs: [
      ['Побудова compatibility graph', 'залежить від умови; до O(L·R)'],
      ['Kuhn', 'O(VE) worst case'],
      ['Hopcroft–Karp', 'O(E√V)'],
    ],
    failures: [
      'Застосувати matching до графа, який не є bipartite.',
      'Не очистити used між стартовими DFS.',
      'Порахувати лише greedy вільні neighbors без перепризначення.',
      'Забути, що побудова всіх compatibility edges теж має складність.',
    ],
    variants:
      'Hopcroft–Karp групує augmenting paths за довжиною через BFS layers. Unit-capacity flow дає ту саму модель, але важчий код іноді зручний, коли поруч з’являються додаткові capacities. Weighted matching не розв’язується Kuhn: assignment із costs потребує Hungarian або Min-Cost Flow. Domino tiling є класичною прихованою reduction після шахового розфарбування grid.',
    checks: [
      'Одна left vertex без edges.',
      'Усі left vertices хочуть одну right vertex.',
      'Greedy counterexample із ланцюгом перепризначень.',
      'Різні розміри частин і isolated vertices.',
    ],
  }),
  'max-flow-min-cut': deepTheory({
    reduction:
      'Flow network має source, sink і directed edges з nonnegative capacity. Feasible flow задовольняє capacity constraints та conservation у всіх проміжних vertices. Початкова задача повинна пояснювати, що є одиницею ресурсу і чому вона може ділитися або, для integer capacities, відновлюватися як цілі об’єкти. Undirected edge не завжди означає два незалежні directed capacities: якщо пропускна здатність спільна в обох напрямках, модель треба формулювати уважно.',
    mechanics:
      'Dinic зберігає residual capacity. BFS будує level graph лише по positive residual edges. DFS штовхає flow через edges, що збільшують level на один; reference ptr[v] не повертається до вже вичерпаних candidates у межах фази. Після blocking flow новий BFS перебудовує levels. Reverse edge накопичує відправлений flow і дозволяє майбутній augmentation частково скасувати рішення.',
    invariant:
      'Forward і reverse residual capacities завжди описують допустиму зміну поточного flow. Push x зменшує forward residual і збільшує reverse residual на x, не порушуючи conservation у внутрішніх вершинах path. Level graph є acyclic за levels, а ptr гарантує, що DFS не переглядає безрезультатне edge двічі в одній фазі.',
    proof:
      'Коли BFS більше не досягає sink, познач vertices reachable з source у residual graph. Жодне edge з reachable у non-reachable не має залишкової capacity, отже воно saturated. Flow через cut дорівнює його capacity, а будь-який flow не може перевищити capacity жодного cut. Знайдений flow і cut мають однакове значення, тому обидва optimal. Це одночасно доводить завершення алгоритму з оптимальною відповіддю та дає certificate теореми Max-Flow Min-Cut.',
    costs: [
      ['Одна BFS-фаза', 'O(E)'],
      ['Dinic general bound', 'O(V²E)'],
      ['Residual storage', 'O(V+E) з двома records на edge'],
    ],
    failures: [
      'Не додати або неправильно індексувати reverse edge.',
      'Змінювати копію Edge замість елемента в adjacency.',
      'Використати int для суми capacities.',
      'Продовжити DFS через edge не з level+1.',
    ],
    variants:
      'Для bipartite/unit networks існують сильніші bounds. Edge-disjoint paths кодуються capacity 1, vertex-disjoint — splitting vertices. Якщо edges мають costs, Dinic оптимізує лише quantity і не дає cheapest flow. Нижні межі на flow потребують balances і super-source/super-sink. У практиці корисно зберігати original capacity, якщо потрібно відновити використані edges.',
    checks: [
      'Source без outgoing edges.',
      'Parallel і antiparallel edges.',
      'Capacity 0 та сума понад 2³¹.',
      'Мережа, де augmentation мусить використати reverse edge.',
    ],
  }),
  'flow-reformulation': deepTheory({
    reduction:
      'Flow modeling починається не з запуску Dinic, а з feasibility. Для vertex capacity розщеплюємо v на in/out і змушуємо весь транзит пройти через єдине capacity edge. Для selection constraints source/sink edges кодують вигоду або штраф, а implication A→B стає infinite edge: cut не може дешево обрати A без B. Для minimum disconnect ціна видалення стає capacity. Кожна construction потребує пояснення, як cut або integral flow відновлює початковий вибір.',
    mechanics:
      'Після max flow residual reachability визначає S-side minimum cut. Original edge u→v входить у cut, якщо u reachable, v not reachable. У maximum closure positive profit з’єднується від source, negative cost — до sink, dependencies — INF edges. Objective зазвичай має форму totalPositive−minCut. Для Min-Cost Flow кожен residual reverse edge отримує negative cost, а augmenting path обирається за shortest reduced cost.',
    invariant:
      'INF edge не може входити в optimal finite cut, тому воно логічно забороняє відповідну комбінацію сторін. Значення INF повинно перевищувати суму всіх finite contributions. Integral capacities разом із augmenting algorithms зберігають integral flow, що дозволяє декомпозувати його на discrete assignments або paths без дробових об’єктів.',
    proof:
      'Доказ reduction має три шари. Soundness: будь-який solution, відновлений із cut/flow, виконує всі початкові обмеження. Completeness: кожне допустиме початкове solution задає network solution не дорожче/не менше відповідного objective. Cost preservation: формула objective точно пов’язує значення. Після цього оптимальність network algorithm автоматично переноситься назад.',
    costs: [
      ['Розмір після vertex splitting', 'до 2V vertices, E+V edges'],
      ['Min cut після побудови', 'вартість обраного max-flow algorithm'],
      ['Min-Cost Flow', 'залежить від потрібного flow і shortest-path engine'],
    ],
    failures: [
      'Вибрати INF менше можливої finite answer.',
      'Переплутати напрям implication edge.',
      'Повернути maxflow там, де objective є totalPositive−minCut.',
      'Використати ordinary max flow для оптимізації costs.',
    ],
    variants:
      'Hungarian Algorithm спеціалізовано розв’язує square assignment за O(n³). Min-Cost Flow гнучкіший для capacities і неповної мережі, але складніший. Vertex cover у bipartite graph пов’язаний із matching theorem König, а minimum path cover у DAG редукується до matching. Project selection/maximum closure є важливим мостом від логічних dependencies до min cut.',
    checks: [
      'Усі finite costs нульові.',
      'Dependency chain і cycle.',
      'Vertex capacity для source/sink.',
      'Відновлений cut перевірити в початковій умові.',
    ],
  }),
  'divide-conquer-optimization': deepTheory({
    reduction:
      'Типовий state dp[k][i] означає optimum для перших i елементів у k groups, а transition обирає останню межу j. D&C Optimization не змінює recurrence: воно використовує monotonicity opt[k][i]≤opt[k][i+1]. Часто її доводять через Monge/quadrangle inequality cost(a,c)+cost(b,d)≤cost(a,d)+cost(b,c) для a≤b≤c≤d. Перед оптимізацією потрібно визначити tie policy для argmin і переконатися, що cost доступна за O(1) або amortized O(1).',
    mechanics:
      'Для одного k функція solve(l,r,optL,optR) обчислює mid. Вона перебирає j лише у [optL,min(mid−1,optR)], записує bestOpt, потім викликає left half із upper bound bestOpt і right half із lower bound bestOpt. Значення prev належать завершеному шару k−1, cur — поточному; in-place update зламає recurrence. Недосяжні states і допустимість непорожніх groups задають нижню межу j.',
    invariant:
      'Кожний recursive call гарантує: справжній opt для всіх позицій [l,r] лежить у [optL,optR]. Після точного пошуку mid monotonicity дає opt[i]≤bestOpt для i<mid і opt[i]≥bestOpt для i>mid. Отже обидва дочірні calls отримують коректні ranges. Усі cur positions обчислюються рівно один раз.',
    proof:
      'Naive recurrence є correct через вибір останнього segment. Monge-умова породжує totally monotone minima й потрібний порядок argmin; цей theorem є єдиною причиною, чому звуження безпечне. Індукція по recursive calls показує, що optimum mid завжди перебирається. Отже optimized layer повертає ті самі exact values, що й quadratic layer.',
    costs: [
      ['Один layer', 'O(N log N) стандартно'],
      ['K layers', 'O(KN log N)'],
      ['Пам’ять', 'O(N) для двох layers плюс cost data'],
    ],
    failures: [
      'Припустити monotonicity за кількома samples.',
      'Передати best=−1 у дочірній call для unreachable mid.',
      'Дозволити empty segment через неправильні межі j.',
      'Залишити O(N) cost і фактично отримати O(KN²logN).',
    ],
    variants:
      'Для Monge arrays існує SMAWK із сильнішими bounds, але складнішим застосуванням. Cost window іноді підтримується add/remove операціями, як у Mo, під час recursive порядку. Aliens Trick прибирає dimension “кількість groups” через penalty та binary search; це інша theorem і не автоматичне продовження D&C DP.',
    checks: [
      'K=1 і K=N.',
      'Нульові елементи та кілька однакових optimum.',
      'Порівняння з O(KN²) на N≤30.',
      'Окремо stress-test межі optL/optR.',
    ],
  }),
  'knuth-optimization': deepTheory({
    reduction:
      'Knuth застосовується до interval recurrence, де split k розділяє [l,r] на дві підзадачі, а weight w(l,r) не залежить від k. Потрібні quadrangle inequality та monotonicity weights; вони ведуть до opt[l][r−1]≤opt[l][r]≤opt[l+1][r]. Різні conventions — [l,k]+[k+1,r] або [l,k]+[k,r] — змінюють base і допустимі k, тому формулу не можна переносити без узгодження.',
    mechanics:
      'Intervals обробляються за зростанням length. Для singleton dp=0 і opt=i. Для [l,r] обидві межі optimum вже відомі з коротших intervals. Перебираємо k у затиснутому window, додаємо w(l,r), а при tie зберігаємо consistent крайній optimum. Prefix sums зазвичай дають interval weight за O(1). Таблиці dp та opt мають triangular зміст, але часто виділяються як n×n arrays.',
    invariant:
      'Перед обчисленням length усі коротші intervals мають exact dp і opt. Knuth theorem гарантує, що хоча б один optimal split поточного interval лежить у computed window. Relaxations використовують лише менші intervals, тому dependency order коректний. Збережений opt підтримує inequalities для наступних lengths за обраної tie policy.',
    proof:
      'Recurrence є exact через останнє merge/root decision. Quadrangle inequality забезпечує Monge-структуру marginal costs, із якої випливає sandwich property optimum. Ми перебираємо весь sandwich interval, тому знаходимо той самий minimum, що cubic DP. Телескопування ширин windows за l для кожної length дає загалом O(N²) transitions.',
    costs: [
      ['Naive interval DP', 'O(N³)'],
      ['Knuth DP', 'O(N²) часу'],
      ['dp + opt tables', 'O(N²) пам’яті'],
    ],
    failures: [
      'Застосувати theorem без перевірки cost conditions.',
      'Взяти opt[l+1][r] до його обчислення.',
      'Переплутати inclusive та half-open intervals.',
      'Недооцінити O(N²) bytes при малому memory limit.',
    ],
    variants:
      'Optimal BST, merging stones та alphabetic coding є канонічними families. Якщо theorem не працює, cubic DP може бути єдиним exact варіантом для малого n; D&C Optimization має іншу recurrence і не є взаємозамінною. Іноді reconstruction потребує лише opt table, але її не можна викинути, якщо вона задає наступні windows.',
    checks: [
      'N=1 та N=2.',
      'Усі weights однакові.',
      'Prefix sums біля overflow.',
      'Порівняй opt inequalities на naive tables для random N≤20.',
    ],
  }),
  'cht-li-chao': deepTheory({
    reduction:
      'Розкрий transition і згрупуй терміни: частина лише від i виходить за min, частина лише від j стає intercept, добуток величини j на величину i — m_jx_i. Після цього кожний processed j додає line, а поточний i робить query. Треба встановити: min чи max, порядок slopes, порядок x, integer чи floating domain, чи lines активні глобально або лише на segment. Ці властивості визначають data structure.',
    mechanics:
      'Monotone deque CHT зберігає lines в order slopes і їх intervals оптимальності. При insert middle line видаляється, якщо перетин із новою настає не пізніше за перетин із попередньою. При increasing queries front видаляється, коли наступна line уже не гірша. Li Chao Tree тримає одну line в node interval: у midpoint лишає кращу, а гіршу рекурсивно передає в half, де вона ще може перемогти.',
    invariant:
      'У deque жодна збережена line не є всюди dominated, а точки зміни optimum впорядковані. Query pointer ніколи не повертається через monotone x. У Li Chao кожен inserted line порівнюється з resident line так, що на кожному x уздовж root-to-leaf path присутній кандидат, здатний бути global optimum. Equal slopes обробляються окремо.',
    proof:
      'Affine functions перетинаються не більше одного разу. Саме тому empty interval optimality дозволяє назавжди видалити line, а monotone query переходить лише вперед. У Li Chao після порівняння в midpoint одна line гарантовано краща там; друга може виграти лише з одного боку через єдиний перетин, тому достатньо одного recursive child.',
    costs: [
      ['Monotone deque CHT', 'O(1) amortized add/query'],
      ['Li Chao Tree', 'O(log C) на operation'],
      ['Segment Li Chao', 'O(log² C) типово'],
    ],
    failures: [
      'Використати deque при довільному порядку x.',
      'Переплутати inequality для min/max або slope order.',
      'Ділити floating intersections і втратити точність.',
      'Переповнити m·x+b або cross product без __int128.',
    ],
    variants:
      'Dynamic hull у multiset підтримує arbitrary slopes/queries, але має складну реалізацію. Li Chao на compressed coordinates корисний, якщо всі query x відомі. Segment-restricted lines додаються у segment tree of Li Chao або спеціальний segment insertion. CHT також з’являється після розкриття квадратів у distance DP.',
    checks: [
      'Одна line й одна query.',
      'Однакові slopes з різними intercepts.',
      'Queries у зворотному порядку.',
      'Порівняння з O(N²) DP на random малих inputs.',
    ],
  }),
  'winning-losing-states': deepTheory({
    reduction:
      'State повинен містити всю інформацію про legal moves і terminal outcome для гравця, який зараз ходить. У симетричній impartial game turn не потрібен: після кожного edge роль гравців автоматично міняється. Якщо гравці мають різні ходи, turn або identity входить у state. Для normal play state без outgoing moves є losing; для misère terminal convention інша. Cycles вимагають третього outcome draw або додаткової умови завершення.',
    mechanics:
      'На acyclic states обчислюємо outcomes після successors. State winning, якщо знайдено хоча б один losing successor; інакше losing. Memoized DFS використовує recursion color для гарантії DAG, iterative DP — natural resource order або reverse topological order. Для reconstruction зберігаємо move у losing state. Retrograde analysis на cyclic graph стартує з terminals і поширює results через reverse edges та лічильник ще не доведених moves.',
    invariant:
      'Коли outcome state фіксується, outcomes усіх потрібних successors already correct. Winning certificate — конкретний edge у losing state. Losing certificate — факт, що всі outgoing edges ведуть у winning states. У retrograde method predecessor стає winning після першого losing child і losing лише коли всі moves доведено ведуть у winning.',
    proof:
      'Індукція по довжині до terminal або topological order. Для W-state обраний move залишає супернику L-state, звідки він не може форсувати перемогу. Для L-state кожен move дає супернику W-state. Це вичерпує всі legal first moves. У cyclic graph states, не класифіковані propagation, утворюють область, де обидва можуть уникати поразки, якщо правила дозволяють infinite play.',
    costs: [
      ['Numeric DP', 'O(states·moves)'],
      ['DAG outcomes', 'O(V+E)'],
      ['Retrograde graph', 'O(V+E)'],
    ],
    failures: [
      'Неправильно визначити terminal state.',
      'Змішати outcome поточного та першого гравця.',
      'Рекурсивно обійти cycle як DAG.',
      'Використати “усі” замість “існує” для winning recurrence.',
    ],
    variants:
      'Partizan games потребують більш загального state/minimax. Якщо є числовий payoff, boolean W/L замінюється minimax value. Для багатьох незалежних impartial components Sprague–Grundy стискає outcome краще, ніж product state. Симетрія та strategy stealing можуть дати proof без explicit DP, але їх теж треба формалізувати.',
    checks: [
      'Terminal start.',
      'Один forced chain парної/непарної довжини.',
      'State із одним losing і багатьма winning moves.',
      'Cycle без виходу та cycle з edge у terminal.',
    ],
  }),
  'nim-xor': deepTheory({
    reduction:
      'Класичний Nim має independent piles, і хід зменшує рівно одну pile до будь-якого меншого nonnegative size. Якщо умова обмежує дозволене зменшення, pile size перестає бути її Grundy number. Якщо хід змінює дві piles або існує shared resource, компоненти не незалежні. Після перевірки правил весь state стискається до XOR pile sizes, а для winning move потрібні самі sizes.',
    mechanics:
      'Обчисли X=a1 xor … xor an. Якщо X=0, позиція losing. Інакше знайди будь-яку pile a, для якої target=a xor X < a; така pile обов’язково існує через highest set bit X. Зменши a до target. Новий XOR дорівнює X xor a xor target = 0. За normal play empty/all-zero position має XOR 0 і є terminal losing.',
    invariant:
      'Zero-XOR positions утворюють P-set: жоден legal move не лишає XOR нульовим, бо зміна однієї pile з a на b змінює total у a xor b≠0. Із кожної nonzero-XOR position є edge у P-set через construction target. Ці дві властивості повністю характеризують losing/winning states.',
    proof:
      'Розглянь highest bit, де X має 1. Непарна кількість piles має там 1, тож вибираємо одну з них. У target=a xor X цей bit стане 0, а вищі bits не зміняться, тому target<a. Algebra XOR показує новий total zero. Із zero position будь-яке a→b дає newTotal=a xor b, що nonzero.',
    costs: [
      ['Winner', 'O(n) часу, O(1) пам’яті'],
      ['Winning move', 'ще O(n) у worst case'],
      ['Pile sizes', 'unsigned 64-bit за умовою'],
    ],
    failures: [
      'Застосувати XOR до subtraction game з обмеженими moves.',
      'Забути special case Misère Nim.',
      'XOR-ити labels замість exact Grundy components.',
      'Побудувати target, але не перевірити target<a.',
    ],
    variants:
      'Misère Nim відрізняється лише endgame, коли всі piles мають size 1: winner визначає parity. Staircase Nim спершу редукує gaps до independent piles. Moore’s Nim та інші зміни “можна змінити k piles” мають інші invariants. Для довільних impartial piles обчисли Grundy, а потім застосуй той самий XOR.',
    checks: [
      'Усі piles нульові.',
      'Одна непорожня pile.',
      'Дві однакові piles.',
      'Усі piles size 1 для normal і misère rules.',
    ],
  }),
  'sprague-grundy': deepTheory({
    reduction:
      'Sprague–Grundy theorem вимагає finite impartial normal-play game. Кожний state однієї component отримує g(state)=mex successor Grundy values. Terminal має mex empty set=0. Якщо гра складається з independent components і один хід змінює рівно одну, їхня disjunctive sum еквівалентна Nim piles із sizes g_i. Загальний Grundy/XOR дає outcome без побудови product graph.',
    mechanics:
      'Обчислюй successors first: reverse topological order для DAG, increasing size для decreasing numeric moves, memoized DFS для acyclic implicit graph. Для mex достатньо array size outdegree+1, бо множина d successors не може містити всі числа 0..d. Timestamp array уникає O(V²) очищення. Потім XOR Grundy стартових components. Для move reconstruction перебери successor однієї component і перевір, чи він зануляє total.',
    invariant:
      'State із Grundy g має successor з кожним value 0..g−1 і не має successor із g — саме визначення mex. Це відтворює legal moves Nim pile g щодо outcome у сумі з будь-якою іншою game. Під час DP всі позначені successor values already final, тому mex exact.',
    proof:
      'Індукція за game graph доводить еквівалентність state та Nim pile його Grundy. Для sum theorem розглядаємо XOR G. Якщо G=0, зміна однієї component робить XOR nonzero за властивістю її mex. Якщо G≠0, highest-bit argument разом із доступністю всіх менших Grundy values дає move до zero. Отже W/L поведінка повністю збігається з Nim.',
    costs: [
      ['Explicit DAG Grundy', 'O(V+E) з efficient mex'],
      ['Combine k components', 'O(k)'],
      ['Naive product state', 'може бути Θ(V^k) — його уникаємо'],
    ],
    failures: [
      'Застосувати theorem до partizan або misère game.',
      'Вважати interacting boards незалежними.',
      'Обчислювати mex у неправильному order.',
      'Очищати O(V)-масив для кожної малої adjacency.',
    ],
    variants:
      'У split games Grundy ходу може бути XOR кількох нових components. Для cyclic games classical finite theorem не застосовується напряму. Grundy sequence subtraction game іноді periodic, але period потребує доказу finite-state recurrence. У деяких tasks потрібно не лише winner, а count winning moves — тоді перевіряється кожен legal successor.',
    checks: [
      'Terminal state і edge прямо в terminal.',
      'Duplicate successor Grundy values.',
      'Outdegree 0 та великий outdegree.',
      'Дві однакові components мають XOR 0.',
    ],
  }),
  'state-graph-implicit-graph': deepTheory({
    reduction:
      'Визнач state як мінімальну інформацію, що робить майбутнє незалежним від повної історії. Position alone може бути недостатньою через coupon, keys mask, direction, parity або remaining resource. Vertex count дорівнює product sizes усіх coordinates; це треба оцінити до реалізації. Кожна allowed operation стає directed edge, а її cost — weight. Soundness і completeness шляхів перевіряються буквально по одній операції.',
    mechanics:
      'Adjacency часто генерується on the fly. Вибір solver робиться після weights: BFS для unit, 0-1 BFS для {0,1}, Dijkstra для nonnegative, DAG shortest path для acyclic state graph. Layered graph для одноразової дії має modes unused/used; ordinary edge зберігає mode, special edge переходить лише вперед. Mask додає collected resources, але ніколи не видаляє їх, якщо правила цього не дозволяють.',
    invariant:
      'dist[state] є найкращою відомою ціною exact configuration, а стандартний invariant обраного shortest-path algorithm залишається чинним у expanded graph. Mode transition точно відповідає витраті ресурсу й не має reverse edge, якщо ресурс не відновлюється. Дві histories, стиснуті в один state, мають однаковий набір continuation edges і costs.',
    proof:
      'Підійми будь-яку допустиму sequence у state path, оновлюючи mode/mask після кожної operation; weights зберігають total cost. Проєкція будь-якого state path назад дає legal operations, бо кожне generated edge перевіряє правила. Отже shortest paths мають ті самі feasible costs і той самий optimum. Далі коректність дає вибраний solver.',
    costs: [
      ['States', 'base vertices × number of modes/masks'],
      ['Transitions', 'середній degree × states'],
      ['Dijkstra', 'O((S+E_state)log S)'],
    ],
    failures: [
      'Забути coordinate, що впливає на future moves.',
      'Додати зайву history й отримати завеликий state space.',
      'Запустити Dijkstra з negative edge.',
      'Матеріалізувати graph, який легше генерувати.',
    ],
    variants:
      'Product graph по двох agents, automaton state для forbidden substrings, digit DP state та shortest path із fuel — та сама ідея. Bidirectional BFS допомагає лише коли reverse transitions легко описати. Algebraic/potential representation іноді стискає history краще, ніж graph layers; спершу шукай найменший sufficient state.',
    checks: [
      'Start уже target.',
      'Special resource не використано або використано на першому edge.',
      'Два різні histories приходять в один state.',
      'Недосяжний target і переповнення INF+w.',
    ],
  }),
  'offline-reverse-rollback': deepTheory({
    reduction:
      'Offline processing дозволяє змінити порядок операцій, якщо весь input відомий наперед і answers не впливають на майбутнє. Для delete-only connectivity фінальний graph стає стартом, а кожний deletion у reverse є addition. Якщо edges мають кілька active intervals, простого reverse недостатньо: intervals розкладаються по segment tree over time, а rollback DSU ізолює recursive branches.',
    mechanics:
      'У reverse sweep спершу відповідай для current state, потім відновлюй operation i — це головне off-by-one. Rollback DSU використовує union by size без path compression. Перед union записує changed child і previous size root; failed union теж може записати marker. snapshot=history.size(), rollback pop-ить зміни до snapshot. Segment-tree DFS робить unions node, обробляє leaf time й відкочує state.',
    invariant:
      'Перед reverse index i структура дорівнює forward state після operation i. У recursion rollback invariant сильніший: при вході node DSU містить рівно edges active протягом усього його time segment плюс ancestors; після rollback стан ідентичний моменту до входу. Union by size гарантує logarithmic tree depth без compression.',
    proof:
      'Reverse correspondence доводиться індукцією по i: base — final graph, step відновлює саме edge, щойно видалене у forward. Для segment tree кожний active interval покривається disjoint canonical nodes; на leaf присутні рівно edges active у цей time. Rollback видаляє тільки зміни поточної branch, тому sibling не забруднюється.',
    costs: [
      ['Delete-only reverse DSU', 'O((N+Q)α(N))'],
      ['Rollback find/union', 'O(log N) без compression'],
      ['Segment tree over time', 'O(Q log Q) edge placements'],
    ],
    failures: [
      'Записати answer після reverse add замість до нього.',
      'Залишити path compression у rollback DSU.',
      'Не врахувати edge, active на кількох intervals.',
      'Не нормалізувати unordered edge key (min,max).',
    ],
    variants:
      'Parallel binary search, CDQ divide-and-conquer та Mo reorder queries з інших причин, але мають ту саму offline перевагу. Rollback застосовується не лише до DSU: будь-яка структура з компактним журналом змін може супроводжувати DFS. Persistent structure зберігає версії замість undo і має інший memory trade-off.',
    checks: [
      'Q=0 і видалення bridge/non-bridge.',
      'Edge, яке ніколи не видаляють.',
      'ADD/REMOVE того самого edge кілька разів.',
      'Nested snapshots і failed unions.',
    ],
  }),
  'decomposition-multi-pattern': deepTheory({
    reduction:
      'Multi-pattern solution починається з interfaces. Representation layer перетворює об’єкт: tree path у chain segments, subtree у Euler interval, logic у implication graph, assignment у bipartite graph. Query layer розв’язує стандартну задачу на отриманих pieces. Update layer підтримує зміни. Для кожного переходу між шарами запиши точні input/output та invariant; інакше правильні алгоритми можуть бути скомбіновані неправильно.',
    mechanics:
      'У HLD перший DFS обчислює subtree sizes і heavy child із найбільшим subtree. Другий DFS продовжує heavy edge в тому самому chain, а light child починає новий head. Positions одного chain contiguous. Path query щоразу обробляє segment від head глибшої вершини до неї й підіймається до parent head; у спільному chain залишається один final segment. Segment Tree виконує point updates/range queries.',
    invariant:
      'Оброблені chain segments разом із ще не пройденим path утворюють exact partition вихідного u–v path. Жодна вершина не повторюється, якщо inclusive boundaries узгоджені. Кожний jump переходить через light edge. Heavy child має subtree не менше за будь-якого sibling, тому при light transition розмір relevant subtree щонайменше подвоюється вгору.',
    proof:
      'HLD positions зберігають порядок уздовж chain, отже range query повертає exact aggregate цього фрагмента path. Loop відсікає один prefix до chain head і не змінює решту simple path. O(log n) light edges дають O(log n) segments; Segment Tree коштує O(log n) на segment, разом O(log² n). Асоціативність aggregate дозволяє combine; для noncommutative operation потрібен порядок напрямків.',
    costs: [
      ['HLD preprocessing', 'O(N)'],
      ['Point update', 'O(log N)'],
      ['Path query', 'O(log² N)'],
      ['Memory', 'O(N)'],
    ],
    failures: [
      'Порахувати O(log n) segments як один O(log n) query.',
      'Включити LCA двічі або пропустити його.',
      'Плутати vertex values та edge values.',
      'Комбінувати noncommutative result у неправильному порядку.',
    ],
    variants:
      'Euler Tour + Fenwick ідеальний для subtree operations, але не робить arbitrary path одним interval. LCA + prefix aggregates працює для static invertible data. Link-Cut Tree потрібен для truly dynamic forest, але це інший рівень складності. Фінальна методика універсальна: відкинь сюжет, відсічи complexity, знайди bottleneck, зміни representation, розбий рішення й доведи кожний interface.',
    checks: [
      'Path u=u та path через root.',
      'Chain tree і star tree.',
      'Negative values з correct neutral element.',
      'Random comparison із O(path length) на малих trees.',
    ],
  }),
};
