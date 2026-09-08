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

export const advancedMathPatterns = [
  pattern({
    id: 'combinatorics',
    chapterId: 'ch-22',
    title: 'Combinatorics та Inclusion–Exclusion',
    description:
      'Рахуємо кількість конфігурацій без їх побудови й виправляємо подвійний підрахунок через перетини умов.',
    intuition: [
      p(
        'Combination C(n,k) рахує вибір без порядку. Inclusion–Exclusion додає прості множини порушень, а потім почергово виправляє їхні перетини.',
      ),
      visual('inclusion-exclusion'),
    ],
    modeling: [
      table(
        ['Модель', 'Формула'],
        [
          ['вибір k без порядку', 'C(n,k)'],
          ['впорядкований вибір k', 'P(n,k)=n!/(n−k)!'],
          ['усі перестановки', 'n!'],
          ['union двох множин', '|A|+|B|−|A∩B|'],
        ],
      ),
      note(
        'Спочатку визнач об’єкт',
        'Формула правильна лише після відповіді: чи важливий порядок, чи дозволені повтори й чи об’єкти різні.',
      ),
    ],
    priorKnowledge: [
      'Foundation → modulo та binary exponentiation',
      'Advanced → subset masks',
      'Combination → counting DP',
    ],
    recognitionSigns: [
      'Потрібна кількість способів, а не самі конструкції.',
      'Є мала кількість заборонених властивостей.',
      'Об’єкти з кількома властивостями рахуються кілька разів.',
    ],
    constraintSignals: [
      'Багато C(n,k) з n≤2·10⁵ підказують factorial preprocessing.',
      'Мала кількість k умов дозволяє 2^k Inclusion–Exclusion.',
      'Modulo має бути prime для inverse через a^(MOD−2).',
    ],
    notApplicableSigns: [
      'Modulo composite, а формула inverse не адаптована.',
      'Умови не мають простого intersection count.',
      'k заборонених множин завелике для 2^k.',
    ],
    knowledge: [
      p(
        'За prime MOD factorial та inverse factorial дають C(n,k)=fact[n]·invFact[k]·invFact[n−k] mod MOD. Fermat: x^(MOD−2) є inverse для x≠0 mod MOD.',
      ),
      visual('inclusion-exclusion'),
      note(
        'Чергування знаків',
        'Subset непарного розміру додається до union, парного — віднімається. Для complement результат віднімають від total.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'long long choose(int n, int k) {',
          '    if (k < 0 || k > n) return 0;',
          '    return fact[n] * invFact[k] % MOD * invFact[n - k] % MOD;',
          '}',
        ),
        'C(n,k) після preprocessing',
      ),
      note(
        'Overflow',
        'Для MOD≈1e9 добуток двох residues міститься у long long. Для більшого modulus потрібен __int128.',
      ),
    ],
    theory: [
      p(
        'Inclusion–Exclusion випливає з внеску одного об’єкта: якщо він лежить у t множинах, сума C(t,1)−C(t,2)+… дорівнює 1.',
      ),
      note(
        'Counting DP чи формула',
        'Якщо структура вибору має залежності між позиціями, combinatorial formula може не існувати; тоді рахуй стани DP.',
      ),
    ],
    extensions: [
      {
        title: 'Derangements і combinatorial identities',
        blocks: [
          p(
            'Derangements можна рахувати recurrence D[n]=(n−1)(D[n−1]+D[n−2]) або Inclusion–Exclusion над fixed points.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'expected-value-probability',
    chapterId: 'ch-22',
    title: 'Probability та Expected Value',
    description:
      'Розкладаємо глобальну випадкову величину на indicators і складаємо їхні очікувані внески без перебору сценаріїв.',
    intuition: [
      p(
        'Якщо X рахує кількість локальних подій, запиши X як суму indicators. Linearity E[X+Y]=E[X]+E[Y] працює навіть без незалежності.',
      ),
      visual('expected-value'),
    ],
    modeling: [
      table(
        ['Поняття', 'Значення'],
        [
          ['indicator Xi', '0 або 1 для локальної події'],
          ['E[Xi]', 'P(Xi=1)'],
          ['linearity', 'E[ΣXi]=ΣE[Xi]'],
          [
            'independence',
            'потрібна для множення ймовірностей, не для linearity',
          ],
        ],
      ),
    ],
    priorKnowledge: [
      'Foundation → дробові обчислення',
      'Combination → counting contributions',
      'Combination → DP states',
    ],
    recognitionSigns: [
      'Питають expected number, average або probability випадкового процесу.',
      'Глобальна кількість є сумою локальних подій.',
      'Повний простір сценаріїв експоненційний.',
    ],
    constraintSignals: [
      'n до 2·10⁵ виключає pairs O(n²), якщо внески можна агрегувати.',
      'Потрібна задана точність і стабільне використання long double/double.',
      'Expected steps часто веде до системи equations або expectation DP.',
    ],
    notApplicableSigns: [
      'Потрібен розподіл або probability exact value, а не лише expectation.',
      'Локальна probability помилково множиться без незалежності.',
      'Процес може не завершитися, і expectation не є скінченним.',
    ],
    knowledge: [
      p(
        'Indicator для пари (i,j) дорівнює 1, коли обидва активні. Його expectation є probability цієї події. Для незалежних активацій це p[i]·p[j].',
      ),
      visual('expected-value'),
      note(
        'Залежність',
        'Linearity не потребує independence, але обчислення P(A∩B)=P(A)P(B) потребує.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'long double prefix = 0, expectedPairs = 0;',
          'for (long double probability : p) {',
          '    expectedPairs += probability * prefix;',
          '    prefix += probability;',
          '}',
          'cout << fixed << setprecision(12) << expectedPairs << "\\n";',
        ),
        'Σ i<j p[i]p[j] за O(n)',
      ),
    ],
    theory: [
      p(
        'Замість pair loop можна підтримувати суму попередніх probabilities. Внесок нового об’єкта в expected pairs дорівнює p[i]·Σj<i p[j].',
      ),
      note(
        'Expectation не описує типовий сценарій',
        'Середнє не гарантує, що результат близький до нього. Для variance або tail probabilities потрібні додаткові інструменти.',
      ),
    ],
    extensions: [
      {
        title: 'Expectation DP',
        blocks: [
          p(
            'Для expected steps часто пишуть E[state]=1+Σ probability·E[next]. Self-loop потрібно алгебраїчно перенести в ліву частину.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'advanced-number-theory',
    chapterId: 'ch-22',
    title: 'Advanced Number Theory та Linear Recurrences',
    description:
      'Перетворюємо congruences, Diophantine equations і повторювані лінійні переходи на алгебру, яку можна виконати за logarithmic time.',
    intuition: [
      p(
        'Extended Euclid описує всі цілочисельні комбінації gcd. Matrix Exponentiation стискає n однакових linear transitions у binary power.',
      ),
      visual('matrix-power'),
    ],
    modeling: [
      table(
        ['Структура задачі', 'Інструмент'],
        [
          ['ax+by=gcd(a,b)', 'Extended Euclid'],
          ['ax+by=c', 'Linear Diophantine Equation'],
          ['кілька congruences', 'CRT'],
          ['linear recurrence, n величезне', 'Matrix Exponentiation'],
          ['linear system', 'Gaussian Elimination extension'],
        ],
      ),
    ],
    priorKnowledge: [
      'Foundation → GCD і binary exponentiation',
      'Combination → DP recurrence',
      'Advanced → modular inverse',
    ],
    recognitionSigns: [
      'Потрібен modular inverse або integer equation.',
      'Є система congruences.',
      'Однаковий linear transition повторюється до n=10¹⁸.',
    ],
    constraintSignals: [
      'n до 10¹⁸ виключає O(n), але допускає O(log n).',
      'Matrix dimension k визначає множник O(k³).',
      'Не coprime moduli потребують generalized CRT checks.',
    ],
    notApplicableSigns: [
      'Recurrence нелінійна або transition змінюється з позицією.',
      'State dimension занадто велика для O(k³ log n).',
      'Inverse шукається для числа, не coprime з modulus.',
    ],
    knowledge: [
      p(
        'Extended Euclid повертає x,y,g з ax+by=g. Equation ax+by=c має розв’язок рівно коли g|c. Для Fibonacci state [Fn,Fn−1] переходить однією матрицею.',
      ),
      visual('matrix-power'),
      note(
        'Identity matrix',
        'Matrix power починається з I, бо M⁰=I. Це забезпечує правильний випадок n=0.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'Matrix power(Matrix base, unsigned long long exponent) {',
          '    Matrix result = identity();',
          '    while (exponent) {',
          '        if (exponent & 1) result = result * base;',
          '        base = base * base;',
          '        exponent >>= 1;',
          '    }',
          '    return result;',
          '}',
        ),
        'Binary exponentiation для матриці',
      ),
    ],
    theory: [
      p(
        'Matrix multiplication композиційно поєднує transitions: якщо B переводить state0 у state1, а A — state1 у state2, то A·B переводить state0 одразу у state2.',
      ),
      note(
        'Порядок множення',
        'Matrix multiplication некомутативне. Binary power зберігає порядок композиції, але вручну переставляти factors не можна.',
      ),
    ],
    extensions: [
      {
        title: 'Gaussian Elimination та FFT/NTT preview',
        blocks: [
          p(
            'Gaussian Elimination розв’язує linear systems над real, modular fields або GF(2). FFT/NTT прискорює convolution і лишається Advanced+ optional.',
          ),
        ],
      },
    ],
  }),
];

export const advancedMathTasks = [
  learning('combinatorics', {
    id: 'choose-team-modulo',
    title: 'Вибір команди',
    statement: [
      'Із n різних студентів потрібно вибрати k. Порахуй кількість команд modulo 1 000 000 007.',
    ],
    input: 'n і k.',
    output: 'C(n,k) modulo 1 000 000 007.',
    constraints: ['0 ≤ k ≤ n ≤ 200000'],
    examples: [example('5 2', '10')],
    tryYourself:
      'Чому n!/(k!(n−k)!) не можна ділити звичайним integer division після modulo?',
    hint: 'Ділення modulo замінюється множенням на modular inverse.',
    firstApproach: [
      p(
        'Перебрати всі subsets розміру k або обчислювати величезні factorial як exact integer.',
      ),
    ],
    approachReview:
      'Subsets експоненційні, exact factorial має сотні тисяч цифр, а звичайне ділення residues некоректне.',
    observation: [
      p(
        'За prime MOD denominator має modular inverse; factorial tables дають кожен C(n,k) за O(1).',
      ),
      visual('inclusion-exclusion'),
    ],
    algorithm: [
      'Побудуй fact[0..n].',
      'Обчисли invFact[n]=fact[n]^(MOD−2).',
      'Заповни invFact вниз.',
      'Поверни fact[n]·invFact[k]·invFact[n−k].',
    ],
    proof:
      'Кожна невпорядкована команда з k студентів з’являється k!(n−k)! разів серед n! перестановок: порядок усередині вибраних і невибраних неважливий. Modular inverses реалізують це ділення у полі modulo prime.',
    complexity: 'O(n+log MOD) часу й O(n) пам’яті.',
    solution: cpp(
      lines(
        "    const long long MOD=1'000'000'007;",
        '    auto power=[&](long long a,long long e){long long r=1;while(e){if(e&1)r=r*a%MOD;a=a*a%MOD;e>>=1;}return r;};',
        '    int n,k;cin>>n>>k;vector<long long>fact(n+1,1),inv(n+1,1);',
        '    for(int i=1;i<=n;++i)fact[i]=fact[i-1]*i%MOD;',
        '    inv[n]=power(fact[n],MOD-2);for(int i=n;i>0;--i)inv[i-1]=inv[i]*i%MOD;',
        '    cout<<fact[n]*inv[k]%MOD*inv[n-k]%MOD<<"\\n";',
      ),
    ),
    takeaway:
      'Combinatorics починається з точної моделі порядку й повторів; modulo division потребує inverse.',
  }),
  practice('combinatorics', {
    id: 'many-combinations',
    title: 'Комбінації modulo',
    statement: ['Відповідай на q запитів C(n,k) modulo 1e9+7.'],
    input: 'q та q пар n,k.',
    output: 'Відповіді.',
    constraints: ['q≤200000', 'n≤10⁶'],
    examples: [example('2\\n5 2\\n6 3', '10\\n20')],
    hint: 'Preprocess factorials до maximum n один раз.',
  }),
  practice('combinatorics', {
    id: 'derangements',
    title: 'Derangements',
    statement: [
      'Порахуй permutations n елементів без fixed points modulo 1e9+7.',
    ],
    input: 'n.',
    output: 'D[n].',
    constraints: ['n≤10⁶'],
    examples: [example('4', '9')],
    hint: 'D[0]=1,D[1]=0,D[n]=(n−1)(D[n−1]+D[n−2]).',
  }),
  practice('combinatorics', {
    id: 'forbidden-divisors',
    title: 'Inclusion–Exclusion по малому k',
    statement: [
      'Порахуй числа 1..N, що не діляться на жодне з k заданих простих чисел.',
    ],
    input: 'N, k і primes.',
    output: 'Кількість.',
    constraints: ['N≤10¹⁸', 'k≤20'],
    examples: [example('10 2\\n2 3', '3')],
    hint: 'Перебери subsets divisors; зупиняй product, якщо він перевищив N.',
  }),

  learning('expected-value-probability', {
    id: 'expected-active-pairs',
    title: 'Очікувана кількість пар',
    statement: [
      'Кожен із n об’єктів незалежно активується з probability p[i]. Знайди expected number unordered pairs активних об’єктів.',
    ],
    input: 'n і n дійсних probabilities.',
    output: 'Expectation з absolute error ≤1e−9.',
    constraints: ['1 ≤ n ≤ 200000', '0 ≤ p[i] ≤ 1'],
    examples: [example('3\\n0.5 1.0 0.5', '1.2500000000')],
    tryYourself:
      'Який indicator відповідає одній парі та яке його expectation?',
    hint: 'Xij=1, коли активні обидва; E[Xij]=pi·pj.',
    firstApproach: [
      p(
        'Перебрати всі 2ⁿ active sets і зважити кількість пар їх probabilities.',
      ),
    ],
    approachReview:
      'Простір сценаріїв експоненційний. Навіть явний pair loop O(n²) завеликий.',
    observation: [
      p(
        'Expected total є сумою pair indicators; суму pi·pj можна агрегувати prefix sum probabilities.',
      ),
      visual('expected-value'),
    ],
    algorithm: [
      'prefix=0, answer=0.',
      'Для кожного p додай p·prefix.',
      'Додай p до prefix.',
      'Виведи answer з точністю.',
    ],
    proof:
      'Кількість active pairs X=Σi<j Xij. За linearity E[X]=ΣE[Xij]. Незалежність дає E[Xij]=P(i,j active)=pi·pj. Prefix-прохід додає кожну пару рівно при обробці її правого кінця.',
    complexity: 'O(n) часу й O(1) додаткової пам’яті.',
    solution: cpp(
      lines(
        '    int n;cin>>n;long double prefix=0,answer=0;',
        '    for(int i=0;i<n;++i){long double p;cin>>p;answer+=p*prefix;prefix+=p;}',
        '    cout<<fixed<<setprecision(12)<<answer<<"\\n";',
      ),
    ),
    takeaway:
      'Linearity of expectation дозволяє складати локальні внески без незалежності між самими indicators.',
  }),
  practice('expected-value-probability', {
    id: 'expected-inversions',
    title: 'Очікувана кількість інверсій',
    statement: [
      'Випадково й рівноймовірно переставляють n різних чисел. Знайди expected inversion count.',
    ],
    input: 'n.',
    output: 'Expectation.',
    constraints: ['n≤10⁹'],
    examples: [example('3', '1.5')],
    hint: 'Для кожної unordered pair probability неправильного порядку дорівнює 1/2.',
  }),
  practice('expected-value-probability', {
    id: 'random-fixed-points',
    title: 'Випадкова перестановка',
    statement: ['Знайди expected number fixed points у random permutation n.'],
    input: 'n.',
    output: 'Expectation.',
    constraints: ['n≤10¹⁸'],
    examples: [example('100', '1')],
    hint: 'Indicator Xi: елемент i лишився на місці, probability 1/n.',
  }),
  practice('expected-value-probability', {
    id: 'expected-dice-steps',
    title: 'Expected steps',
    statement: [
      'Фішка на 0 щокроку рівноймовірно додає 1..6 і завершує при position≥n. Знайди expected steps.',
    ],
    input: 'n.',
    output: 'Expectation.',
    constraints: ['n≤200000'],
    examples: [example('1', '1.0000000000')],
    hint: 'DP назад: E[i]=1+average E[min(n,i+d)].',
  }),
  practice('expected-value-probability', {
    id: 'expected-covered-cells',
    title: 'Невидимі внески клітинок',
    statement: [
      'Кожен із m випадкових прямокутників незалежно активний. Знайди expected number grid cells, покритих хоча б одним активним прямокутником.',
    ],
    input: 'Невеликий grid, rectangles і probabilities.',
    output: 'Expectation.',
    constraints: ['n·m≤200000', 'rectangles≤20'],
    examples: [example('1 1 1\\n1 1 1 1 0.25', '0.2500000000')],
    hint: 'Indicator для клітинки; probability непокриття — product (1−p) релевантних rectangles.',
  }),

  learning('advanced-number-theory', {
    id: 'huge-fibonacci',
    title: 'Величезний Fibonacci',
    statement: ['Дано n і MOD. Знайди F[n] modulo MOD, де F0=0,F1=1.'],
    input: 'n та MOD.',
    output: 'F[n] modulo MOD.',
    constraints: ['0 ≤ n ≤ 10¹⁸', '2 ≤ MOD ≤ 10⁹+7'],
    examples: [example('10 1000', '55')],
    tryYourself:
      'Як представити перехід [Fn,Fn−1]→[Fn+1,Fn] однією сталою матрицею?',
    hint: 'M={{1,1},{1,0}}, а F[n] є елементом M^n.',
    firstApproach: [p('Обчислювати DP від 0 до n.')],
    approachReview:
      'O(n) неможливе для n=10¹⁸, але transition однаковий на кожному кроці.',
    observation: [
      p(
        'n однакових linear transitions дорівнюють M^n, який рахується binary exponentiation.',
      ),
      visual('matrix-power'),
    ],
    algorithm: [
      'Створи identity result і Fibonacci matrix base.',
      'Поки n>0, для встановленого біта помнож result на base.',
      'Квадратуй base, n поділи на 2.',
      'Виведи result[0][1].',
    ],
    proof:
      'Matrix M переводить [Fk,Fk−1] у [Fk+1,Fk], тому за індукцією M^n містить Fn. Binary exponentiation підтримує invariant result·base^remaining=M^original і завершує з result=M^n.',
    complexity: 'O(log n) часу й O(1) пам’яті для 2×2 matrix.',
    solution: cpp(
      lines(
        '    unsigned long long n;long long mod;cin>>n>>mod;',
        '    struct M{long long a[2][2];};',
        '    auto mul=[&](M x,M y){M z{};for(int i=0;i<2;++i)for(int k=0;k<2;++k)for(int j=0;j<2;++j)z.a[i][j]=(z.a[i][j]+(__int128)x.a[i][k]*y.a[k][j])%mod;return z;};',
        '    M result{{{1,0},{0,1}}},base{{{1,1},{1,0}}};',
        '    while(n){if(n&1)result=mul(result,base);base=mul(base,base);n>>=1;}',
        '    cout<<result.a[0][1]%mod<<"\\n";',
      ),
    ),
    takeaway:
      'Однаковий linear transition + величезна кількість кроків → Matrix Exponentiation.',
  }),
  practice('advanced-number-theory', {
    id: 'linear-recurrence',
    title: 'Linear recurrence',
    statement: [
      'Дано коефіцієнти recurrence order k, перші k значень і n. Знайди a[n] modulo MOD.',
    ],
    input: 'k,n,MOD, coefficients та initial values.',
    output: 'a[n].',
    constraints: ['k≤30', 'n≤10¹⁸'],
    examples: [example('2 10 1000\\n1 1\\n0 1', '55')],
    hint: 'Companion matrix k×k.',
  }),
  practice('advanced-number-theory', {
    id: 'walks-fixed-length',
    title: 'Walks of length K',
    statement: [
      'Порахуй walks довжини K з s у t у directed graph modulo 1e9+7.',
    ],
    input: 'n,m,K,s,t та edges.',
    output: 'Кількість.',
    constraints: ['n≤60', 'K≤10¹⁸'],
    examples: [example('2 2 3 1 2\\n1 2\\n2 1', '1')],
    hint: 'Adjacency matrix power: (A^K)[s][t].',
  }),
  practice('advanced-number-theory', {
    id: 'diophantine-equation',
    title: 'Diophantine equation',
    statement: ['Знайди будь-які integers x,y для ax+by=c або IMPOSSIBLE.'],
    input: 'a,b,c.',
    output: 'x y або IMPOSSIBLE.',
    constraints: ['|a|,|b|,|c|≤10¹⁸'],
    examples: [example('6 9 3', '-1 1')],
    hint: 'Extended gcd; solution існує iff c%g==0, потім масштабуй coefficients.',
  }),
  practice('advanced-number-theory', {
    id: 'two-congruences',
    title: 'Календарі CRT',
    statement: [
      'Знайди найменше невід’ємне x, що задовольняє x≡a mod m та x≡b mod n, або IMPOSSIBLE.',
    ],
    input: 'a,m,b,n.',
    output: 'x або IMPOSSIBLE.',
    constraints: ['moduli≤10¹²'],
    examples: [example('2 3 3 5', '8')],
    hint: 'Generalized CRT: різниця b−a має ділитися на gcd(m,n).',
  }),
];
