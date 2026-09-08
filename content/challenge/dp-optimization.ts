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

export const dpOptimizationPatterns = [
  pattern({
    id: 'divide-conquer-optimization',
    chapterId: 'ch-24',
    title: 'Divide & Conquer DP Optimization',
    description:
      'Прискорюємо partition DP, коли індекс оптимального переходу монотонно рухається вправо.',
    intuition: [
      p(
        'DP уже правильне; дорого коштує пошук найкращого j. Якщо opt[i]≤opt[i+1], optimum для середини ділить простір кандидатів для двох рекурсивних половин.',
      ),
      visual('divide-conquer-opt'),
    ],
    modeling: [
      table(
        ['Частина recurrence', 'Роль'],
        [
          ['prev[j]', 'відповідь для попередньої кількості груп'],
          ['cost(j+1,i)', 'ціна останнього segment'],
          ['opt[i]', 'найменший/узгоджений optimal split'],
          ['opt[i]≤opt[i+1]', 'дозвіл звужувати range'],
        ],
      ),
      note(
        'Monotonicity треба довести',
        'Вона часто випливає з Monge/quadrangle inequality для cost, але ніколи — лише з того, що recurrence виглядає знайомо.',
      ),
    ],
    priorKnowledge: [
      'Combination → state і transition DP',
      'Core → Divide & Conquer і монотонність',
      'Новий крок → структура argmin, а не лише значення DP',
    ],
    recognitionSigns: [
      'Є шари DP: k груп і перші i елементів.',
      'Transition перебирає одну межу j та дає O(KN²).',
      'Оптимальна межа експериментально й доказово не рухається вліво.',
    ],
    constraintSignals: [
      'N у тисячах/десятках тисяч і мале K відсікають O(KN²).',
      'Cost має рахуватися за O(1) або amortized O(1).',
      'Пам’ять можна стиснути до двох DP-шарів.',
    ],
    notApplicableSigns: [
      'Немає доведеної monotonicity opt.',
      'Transition залежить від кількох незалежних індексів.',
      'Cost query сама коштує O(N), знищуючи прискорення.',
    ],
    knowledge: [
      p(
        'Функція compute(L,R,optL,optR) обчислює mid, перебирає допустимі j, зберігає bestOpt і рекурсивно передає [optL,bestOpt] ліворуч та [bestOpt,optR] праворуч.',
      ),
      visual('divide-conquer-opt'),
      note(
        'Tie policy',
        'Якщо optimum не єдиний, послідовно обирай найменший або найбільший j відповідно до формулювання доведення monotonicity.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'void compute(int l, int r, int optL, int optR) {',
          '    if (l > r) return;',
          '    int mid = (l + r) / 2, best = -1;',
          '    cur[mid] = INF;',
          '    for (int j = optL; j <= min(mid - 1, optR); ++j) {',
          '        long long cand = prev[j] + cost(j, mid);',
          '        if (cand < cur[mid]) cur[mid] = cand, best = j;',
          '    }',
          '    compute(l, mid - 1, optL, best);',
          '    compute(mid + 1, r, best, optR);',
          '}',
        ),
        'Каркас одного DP-шару',
      ),
      note(
        'Недосяжні states',
        'Обмеж j так, щоб prev[j] існував, і не додавай cost до INF без перевірки overflow.',
      ),
    ],
    theory: [
      p(
        'Рекурсія не ділить candidate range навпіл механічно: його розділяє знайдений bestOpt. Сукупна кількість перевірок одного шару становить O(N log N) у стандартній оцінці.',
      ),
      note(
        'Ціль оптимізації',
        'Ми не змінюємо recurrence й не апроксимуємо відповідь. Використовується лише порядок exact optimal transitions.',
      ),
    ],
    extensions: [
      {
        title: 'Monge arrays та Aliens Trick',
        blocks: [
          p(
            'Monge inequality часто дає monotone minima. Lagrangian Relaxation переносить обмеження на кількість груп у penalty та запускає параметричний пошук — це окремий складний extension.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'knuth-optimization',
    chapterId: 'ch-24',
    title: 'Knuth Optimization',
    description:
      'Звужуємо split interval DP між optimum двох сусідніх підінтервалів, коли cost виконує строгі умови Knuth.',
    intuition: [
      p(
        'У звичайному interval DP k перебирає весь [l,r). За Knuth оптимальний split затиснутий між opt[l][r−1] та opt[l+1][r].',
      ),
      visual('knuth-window'),
    ],
    modeling: [
      table(
        ['Умова', 'Навіщо'],
        [
          [
            'dp[l][r]=min(dp[l][k]+dp[k+1][r])+w(l,r)',
            'правильна форма interval DP',
          ],
          ['quadrangle inequality для w', 'Monge-структура'],
          ['w(b,c)≤w(a,d)', 'monotone intervals'],
          ['opt[l][r−1]≤opt[l][r]≤opt[l+1][r]', 'вузьке exact window'],
        ],
      ),
    ],
    priorKnowledge: [
      'Combination → Interval DP',
      'Advanced → Prefix Sum для interval cost',
      'Новий крок → доведені межі argmin',
    ],
    recognitionSigns: [
      'State — contiguous interval [l,r].',
      'Останній/перший split k ділить interval на дві частини.',
      'Cost об’єднання залежить від усього interval, часто є його сумою.',
    ],
    constraintSignals: [
      'N близько 2000–5000: O(N³) не проходить, O(N²) є ціллю.',
      'Потрібно O(N²) пам’яті для dp та opt.',
      'Для N≈10⁵ навіть Knuth зазвичай занадто важкий.',
    ],
    notApplicableSigns: [
      'Cost не виконує quadrangle inequality/monotonicity.',
      'Split має більше двох підзадач або додатковий state.',
      'Intervals обробляються не в порядку зростання довжини.',
    ],
    knowledge: [
      p(
        'Knuth Optimization є theorem про optimum, а не евристикою. Після перевірки передумов кожен interval шукає k лише у вже відомому вікні сусідніх optimum.',
      ),
      visual('knuth-window'),
      note(
        'Бази opt',
        'Зазвичай opt[i][i]=i. Межі циклу k треба узгодити з recurrence [l,k] + [k+1,r] або [l,k] + [k,r].',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'for (int i = 0; i < n; ++i) opt[i][i] = i;',
          'for (int len = 2; len <= n; ++len) {',
          '    for (int l = 0, r = len - 1; r < n; ++l, ++r) {',
          '        dp[l][r] = INF;',
          '        int from = opt[l][r - 1];',
          '        int to = min(r - 1, opt[l + 1][r]);',
          '        for (int k = from; k <= to; ++k) { /* relax */ }',
          '    }',
          '}',
        ),
        'Порядок обчислення Knuth DP',
      ),
      note(
        'Memory budget',
        'Дві n×n таблиці long long/int можуть бути головним обмеженням. Оціни bytes, а не лише O-нотацію.',
      ),
    ],
    theory: [
      p(
        'Сума ширин усіх пошукових вікон одного interval length телескопується, тому загальна кількість transitions стає O(N²). Значення DP лишаються точними.',
      ),
      note(
        'Схожа recurrence ≠ Knuth',
        'Перед submit запиши назву властивості cost і хоча б короткий доказ. Якщо цього немає, оптимізація не обґрунтована.',
      ),
    ],
    extensions: [
      {
        title: 'Optimal BST та alphabetic coding',
        blocks: [
          p(
            'Класичні застосування Knuth мають additive interval weight. Вони корисні як еталони для перевірки індексації та умов theorem.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'cht-li-chao',
    chapterId: 'ch-24',
    title: 'Convex Hull Trick та Li Chao Tree',
    description:
      'Перетворюємо лінійний за одним параметром DP-transition на додавання прямих і minimum/maximum queries.',
    intuition: [
      p(
        'Якщо кандидат j має вигляд m[j]·x[i]+b[j], то для нього це пряма. Задача DP стає підтримкою нижньої оболонки функцій.',
      ),
      visual('cht-lines'),
    ],
    modeling: [
      table(
        ['DP-частина', 'Line container'],
        [
          ['j', 'одна пряма'],
          ['коефіцієнт при x[i]', 'slope m'],
          ['решта виразу', 'intercept b'],
          ['поточне значення', 'query x'],
          ['min/max transition', 'нижня/верхня оболонка'],
        ],
      ),
      note(
        'Спочатку розкрий алгебру',
        'Винеси все, що залежить лише від i, за min; частина з j повинна стати affine function одного x.',
      ),
    ],
    priorKnowledge: [
      'Combination → DP transitions',
      'Advanced → cross multiplication і Segment Tree thinking',
      'Новий крок → algebraic DP-to-lines reformulation',
    ],
    recognitionSigns: [
      'Transition містить добуток величини від i на величину від j.',
      'Після розкриття квадратів з’являється m_j x_i+b_j.',
      'Потрібен min/max серед накопичених candidates.',
    ],
    constraintSignals: [
      'N≈2·10⁵ вимагає O(N log C) або amortized O(N).',
      'Монотонні slopes і query x дозволяють deque CHT.',
      'Довільний порядок x або slopes підказує Li Chao / dynamic hull.',
    ],
    notApplicableSigns: [
      'Transition нелінійний у двох незалежних параметрах.',
      'Лінії потрібні лише на окремих intervals без segment Li Chao.',
      'Переповнення cross products не контролюється через __int128.',
    ],
    knowledge: [
      p(
        'Deque CHT підтримує впорядковані slopes і monotone queries: непотрібні лінії видаляються з кінця при insert і з початку при query. Li Chao Tree працює на координатному домені без такого порядку.',
      ),
      visual('cht-lines'),
      note(
        'Equal slopes',
        'Для minimum із двох однакових slopes залишай line з меншим intercept. Інакше формула перетинів ділитиме на нуль.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'struct Line { long long m, b; };',
          'long long value(const Line& l, long long x) {',
          '    return l.m * x + l.b;',
          '}',
          'bool redundant(const Line& a, const Line& b, const Line& c) {',
          '    return (__int128)(b.b-a.b)*(b.m-c.m)',
          '         >= (__int128)(c.b-b.b)*(a.m-b.m);',
          '}',
        ),
        'Exact comparisons для decreasing slopes',
      ),
      note(
        'Orientation inequalities',
        'Знак redundant залежить від min/max і порядку slopes. Не копіюй формулу без перевірки на трьох простих lines.',
      ),
    ],
    theory: [
      p(
        'Line можна видалити, якщо вона ніколи не є кращою між сусідніми lines оболонки. Для monotone x точка оптимуму також рухається монотонно, тому pop-front амортизовано лінійний.',
      ),
      note(
        'Li Chao trade-off',
        'Li Chao зберігає кращу line у середині segment і рекурсивно передає гіршу туди, де вона ще може перемогти. Це простіші передумови, але O(log C) на операцію.',
      ),
    ],
    extensions: [
      {
        title: 'Monotone Queue, bitset, SOS і profile DP',
        blocks: [
          p(
            'Це інші види transition structure: moving optimum, word-level parallelism, transforms по subsets та локальний frontier. Їх не слід підміняти CHT лише через повільне DP.',
          ),
        ],
      },
    ],
  }),
];

export const dpOptimizationTasks = [
  learning('divide-conquer-optimization', {
    id: 'sequence-partition-monge',
    title: 'Розбиття послідовності',
    statement: [
      'Дано n невід’ємних чисел. Розбий їх на рівно K непорожніх contiguous segments. Ціна segment — квадрат суми його елементів. Мінімізуй суму цін.',
    ],
    input: 'n, K і масив a.',
    output: 'Мінімальна сумарна ціна.',
    constraints: ['1 ≤ K ≤ n ≤ 5000', '0 ≤ a[i] ≤ 10⁴'],
    examples: [example('4 2\n1 2 3 4', '52')],
    tryYourself:
      'Запиши recurrence для перших i елементів і k груп. Яку частину можна обчислити prefix sums?',
    hint: 'Для nonnegative a cost(j,i)=(pref[i]−pref[j])² є Monge, тому argmin монотонний.',
    firstApproach: [
      p(
        'dp[k][i]=min over j<i of dp[k−1][j]+(pref[i]−pref[j])². Це точний O(KN²) DP.',
      ),
    ],
    approachReview:
      'State і cost правильні, але перебір усіх j для кожної клітинки не вкладається в constraints.',
    observation: [
      visual('divide-conquer-opt'),
      p(
        'Monge inequality випливає з невід’ємності segment sums і гарантує opt[k][i]≤opt[k][i+1].',
      ),
    ],
    algorithm: [
      'Побудуй prefix sums і O(1) cost(j,i).',
      'Зберігай prev для k−1 груп і cur для k груп.',
      'Для кожного k виклич compute(k,n,k−1,n−1).',
      'У compute обчисли mid, best split і рекурсивно звузь opt ranges.',
    ],
    proof:
      'Recurrence перебирає останню межу кожного допустимого partition. Monge-властивість cost дає monotonicity argmin, тому рекурсивні межі не викидають optimal split. Отже значення збігаються з O(KN²) DP.',
    complexity: 'O(KN log N) часу, O(N) робочої пам’яті.',
    solution: cpp(
      lines(
        '    int n,K;cin>>n>>K; vector<long long> pref(n+1);',
        '    for(int i=1;i<=n;++i){long long x;cin>>x;pref[i]=pref[i-1]+x;}',
        '    const long long INF=(1LL<<62);',
        '    vector<long long> prev(n+1,INF),cur(n+1,INF); prev[0]=0;',
        '    auto cost=[&](int j,int i){long long s=pref[i]-pref[j];return s*s;};',
        '    for(int group=1;group<=K;++group){',
        '        fill(cur.begin(),cur.end(),INF);',
        '        auto solve=[&](auto&& self,int l,int r,int optL,int optR)->void{',
        '            if(l>r)return; int mid=(l+r)/2,best=-1;',
        '            for(int j=optL;j<=min(mid-1,optR);++j){',
        '                if(prev[j]==INF)continue; long long cand=prev[j]+cost(j,mid);',
        '                if(cand<cur[mid])cur[mid]=cand,best=j;',
        '            }',
        '            self(self,l,mid-1,optL,best); self(self,mid+1,r,best,optR);',
        '        };',
        '        solve(solve,group,n,group-1,n-1); swap(prev,cur);',
        '    }',
        '    cout<<prev[n]<<"\\n";',
      ),
    ),
    takeaway:
      'Divide & Conquer Optimization прискорює exact transition лише після доведення monotone opt.',
  }),
  practice('divide-conquer-optimization', {
    id: 'equal-frequency-groups',
    title: 'Групи однакових значень',
    statement: [
      'Розбий масив на K segments. Cost segment — кількість рівних пар усередині. Мінімізуй загальну cost.',
    ],
    input: 'n, K і масив.',
    output: 'Minimum cost.',
    constraints: ['n ≤ 10⁵', 'K ≤ 20'],
    examples: [example('4 2\n1 1 2 2', '2')],
    hint: 'D&C DP поєднується з рухомим cost window, схожим на Mo.',
  }),
  practice('divide-conquer-optimization', {
    id: 'post-offices-partition',
    title: 'Поштові центри',
    statement: [
      'Відсортовані села треба розбити на K contiguous groups; кожну обслуговує один центр у median, мінімізуй суму відстаней.',
    ],
    input: 'n, K і sorted coordinates.',
    output: 'Minimum total distance.',
    constraints: ['n ≤ 10000', 'K ≤ 50'],
    examples: [example('4 2\n1 2 10 11', '2')],
    hint: 'Порахуй interval cost за O(1) і доведи monotonicity split.',
  }),
  practice('divide-conquer-optimization', {
    id: 'hidden-monge-layer',
    title: 'Шари доставки',
    statement: [
      'Потрібно виконати K batches послідовних замовлень. Cost batch задана O(1)-функцією C(l,r), для якої гарантується Monge inequality. Знайди minimum cost.',
    ],
    input: 'n, K та параметри C.',
    output: 'Minimum cost.',
    constraints: ['n ≤ 30000', 'K ≤ 30'],
    examples: [example('3 2\n1 2 3', '18')],
    hint: 'Гарантія Monge дана саме для виведення monotone minima.',
  }),
  learning('knuth-optimization', {
    id: 'optimal-merging',
    title: 'Оптимальне об’єднання',
    statement: [
      'Є n сусідніх блоків із додатними розмірами. За операцію можна об’єднати два сусідні поточні блоки, заплативши суму їх розмірів. Знайди мінімальну повну вартість.',
    ],
    input: 'n і розміри блоків.',
    output: 'Мінімальна сумарна вартість.',
    constraints: ['1 ≤ n ≤ 4000', '1 ≤ a[i] ≤ 10⁶'],
    examples: [example('4\n1 2 3 4', '19')],
    tryYourself:
      'Розглянь останнє об’єднання interval [l,r]. На які дві частини він був розбитий перед ним?',
    hint: 'Це interval DP із weight sum(l,r), який виконує умови Knuth.',
    firstApproach: [
      p('dp[l][r]=min_k(dp[l][k]+dp[k+1][r])+sum(l,r), що напряму дає O(N³).'),
    ],
    approachReview:
      'Recurrence правильна, але для кожного з O(N²) intervals перебирає O(N) splits.',
    observation: [
      visual('knuth-window'),
      p(
        'Для interval-sum weight виконуються quadrangle inequality та monotonicity, отже opt[l][r] лежить між optimum сусідніх intervals.',
      ),
    ],
    algorithm: [
      'Побудуй prefix sums; dp[i][i]=0, opt[i][i]=i.',
      'Обробляй interval lengths від 2 до n.',
      'Перебирай k лише від opt[l][r−1] до min(r−1,opt[l+1][r]).',
      'Збережи найкраще значення й відповідний split.',
    ],
    proof:
      'Interval recurrence розглядає останнє злиття, тому є точною. Weight як сума interval виконує умови Knuth, тож theorem гарантує, що optimal k лежить у звуженому вікні. Жоден optimal transition не пропущено.',
    complexity: 'O(N²) часу та O(N²) пам’яті.',
    solution: cpp(
      lines(
        '    int n;cin>>n;vector<long long>a(n),pref(n+1);',
        '    for(int i=0;i<n;++i){cin>>a[i];pref[i+1]=pref[i]+a[i];}',
        '    const long long INF=(1LL<<62);',
        '    vector<vector<long long>> dp(n,vector<long long>(n));',
        '    vector<vector<int>> opt(n,vector<int>(n));',
        '    for(int i=0;i<n;++i)opt[i][i]=i;',
        '    for(int len=2;len<=n;++len)for(int l=0,r=len-1;r<n;++l,++r){',
        '        dp[l][r]=INF; int from=opt[l][r-1],to=min(r-1,opt[l+1][r]);',
        '        for(int k=from;k<=to;++k){',
        '            long long cand=dp[l][k]+dp[k+1][r]+pref[r+1]-pref[l];',
        '            if(cand<dp[l][r])dp[l][r]=cand,opt[l][r]=k;',
        '        }',
        '    }',
        '    cout<<dp[0][n-1]<<"\\n";',
      ),
    ),
    takeaway:
      'Knuth — це O(N²) лише разом із theorem про cost; схожої таблиці DP недостатньо.',
  }),
  practice('knuth-optimization', {
    id: 'optimal-bst',
    title: 'Optimal Binary Search Tree',
    statement: [
      'Для sorted keys задано frequencies. Побудуй BST з мінімальною зваженою глибиною пошуку.',
    ],
    input: 'n і frequencies.',
    output: 'Minimum weighted cost.',
    constraints: ['n ≤ 3000'],
    examples: [example('3\n3 1 2', '10')],
    hint: 'Корінь interval є split; weight interval додається один раз.',
  }),
  practice('knuth-optimization', {
    id: 'merge-slimes-large',
    title: 'Великі Slimes',
    statement: [
      'Об’єднуй сусідні slimes з cost, рівною сумі ваг. N завелике для cubic interval DP.',
    ],
    input: 'n і positive weights.',
    output: 'Minimum cost.',
    constraints: ['n ≤ 5000'],
    examples: [example('3\n10 20 30', '90')],
    hint: 'Це та сама математична структура, але перевір memory limit двох таблиць.',
  }),
  practice('knuth-optimization', {
    id: 'false-knuth-counterexample',
    title: 'Перевір умови',
    statement: [
      'Дано interval cost table та recurrence. Визнач DP, але cost не гарантує Monge-властивості. Потрібно отримати точну відповідь.',
    ],
    input: 'n і C[l][r].',
    output: 'Exact minimum.',
    constraints: ['n ≤ 350'],
    examples: [example('2\n0 5\n0 0', '5')],
    hint: 'Challenge тут у тому, щоб не застосувати Knuth без передумов; cubic DP проходить.',
  }),
  learning('cht-li-chao', {
    id: 'production-cost-lines',
    title: 'Вартість виробництва',
    statement: [
      'Дано strictly increasing x[0..n−1] і strictly decreasing m[0..n−1]. dp[0]=0, а dp[i]=min за 0≤j<i від dp[j]+m[j]·x[i]. Знайди dp[n−1].',
    ],
    input: 'n, масив x, масив m.',
    output: 'dp[n−1].',
    constraints: ['2 ≤ n ≤ 2·10⁵', '0 ≤ x[i],m[i] ≤ 10⁹'],
    examples: [example('4\n0 10 20 100\n10 9 1 0', '300')],
    tryYourself:
      'Для фіксованого j познач x[i] просто X. Яку функцію від X утворює transition?',
    hint: 'Line j має slope m[j] та intercept dp[j].',
    firstApproach: [
      p('Прямо обчислюємо кожне dp[i], перебираючи всі попередні j.'),
    ],
    approachReview:
      'O(N²) правильне, але повторно запитує minimum тих самих linear functions у різних x.',
    observation: [
      visual('cht-lines'),
      p(
        'Slopes додаються монотонно, queries x теж монотонні. Нижню оболонку можна підтримувати deque без binary search.',
      ),
    ],
    algorithm: [
      'Почни з line (m[0],dp[0]).',
      'Перед query видаляй першу line, доки наступна не гірша.',
      'dp[i] — value першої line у x[i].',
      'Додаючи нову line, видаляй з кінця геометрично redundant lines.',
    ],
    proof:
      'У нижній оболонці intervals оптимальності lines впорядковані за x. Через монотонні queries optimum не повертається назад. Умова redundant видаляє line лише тоді, коли interval її оптимальності порожній.',
    complexity: 'O(N) amortized часу й O(N) пам’яті.',
    solution: cpp(
      lines(
        '    int n;cin>>n;vector<long long>x(n),m(n),dp(n);',
        '    for(auto&v:x)cin>>v;for(auto&v:m)cin>>v;',
        '    struct Line{long long m,b;}; deque<Line> q;',
        '    auto val=[](Line l,long long x){return l.m*x+l.b;};',
        '    auto bad=[](Line a,Line b,Line c){',
        '        return (__int128)(b.b-a.b)*(b.m-c.m)>=',
        '               (__int128)(c.b-b.b)*(a.m-b.m);',
        '    };',
        '    q.push_back({m[0],0});',
        '    for(int i=1;i<n;++i){',
        '        while(q.size()>1 && val(q[0],x[i])>=val(q[1],x[i]))q.pop_front();',
        '        dp[i]=val(q.front(),x[i]); Line cur{m[i],dp[i]};',
        '        while(q.size()>1 && bad(q[q.size()-2],q.back(),cur))q.pop_back();',
        '        q.push_back(cur);',
        '    }',
        '    cout<<dp[n-1]<<"\\n";',
      ),
    ),
    takeaway:
      'CHT починається з алгебри transition; вибір deque або Li Chao визначає порядок slopes і queries.',
  }),
  practice('cht-li-chao', {
    id: 'quadratic-dp-lines',
    title: 'Квадратична recurrence',
    statement: ['Обчисли dp[i]=min_j(dp[j]+(x[i]−x[j])²+C) для sorted x.'],
    input: 'n, C і sorted x.',
    output: 'dp[n−1].',
    constraints: ['n ≤ 2·10⁵'],
    examples: [example('3 1\n0 2 3', '6')],
    hint: 'Розкрий квадрат і винеси x[i]²+C за minimum.',
  }),
  practice('cht-li-chao', {
    id: 'li-chao-arbitrary-order',
    title: 'Лінії без порядку',
    statement: [
      'Підтримуй ADD m b і QUERY x для довільного порядку slopes та x; повертай minimum y.',
    ],
    input: 'q online operations.',
    output: 'Відповідь на кожний QUERY.',
    constraints: ['q ≤ 2·10⁵', '|x|≤10⁹'],
    examples: [example('3\nADD 2 1\nADD -1 5\nQUERY 3', '2')],
    hint: 'Deque CHT не має потрібної монотонності; використай Li Chao Tree.',
  }),
  practice('cht-li-chao', {
    id: 'segment-lines',
    title: 'Тарифи на відрізках',
    statement: [
      'Кожна лінійна функція активна лише для x у [l,r]. Потрібно відповідати на minimum queries.',
    ],
    input: 'ADD_SEGMENT і QUERY operations.',
    output: 'Minimum або EMPTY.',
    constraints: ['q ≤ 2·10⁵'],
    examples: [example('2\nADD 0 10 1 0\nQUERY 5', '5')],
    hint: 'Line додається у O(log C) вузлів segment Li Chao.',
  }),
];
