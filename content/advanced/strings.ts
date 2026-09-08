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

export const stringPatterns = [
  pattern({
    id: 'prefix-function-kmp',
    chapterId: 'ch-18',
    title: 'Prefix Function та KMP',
    description:
      'Зберігаємо найдовший border кожного prefix і після mismatch продовжуємо з уже відомого збігу.',
    intuition: [
      p(
        'Один mismatch не стирає всі попередні збіги. Prefix Function показує, який коротший prefix уже є suffix обробленої частини.',
      ),
      visual('kmp-fallback'),
    ],
    modeling: [
      table(
        ['Об’єкт', 'Значення'],
        [
          ['π[i]', 'найдовший власний prefix = suffix для s[0..i]'],
          ['j', 'поточна довжина збігу'],
          ['fallback', 'j = π[j−1]'],
          ['повне входження', 'j = |pattern|'],
        ],
      ),
      note(
        'Border є власним',
        'Він коротший за весь розглянутий рядок, тому π[i] не перевищує i.',
      ),
    ],
    priorKnowledge: [
      'Foundation → string як послідовність',
      'Core → монотонний прохід',
      'Combination → інваріант алгоритму',
    ],
    recognitionSigns: [
      'Потрібно знайти всі входження pattern.',
      'Умова питає про borders, prefix=suffix або періодичність.',
      'Наївний пошук повторно порівнює ті самі символи.',
    ],
    constraintSignals: [
      '|text|+|pattern| до 4·10⁵ вимагає O(n+m).',
      'Алфавіт не впливає на складність.',
      'Багато patterns можуть вимагати Aho–Corasick.',
    ],
    notApplicableSigns: [
      'Потрібні довільні substring-equality queries.',
      'Потрібні palindromic radii для всіх центрів.',
      'Pattern змінюється після кожного запиту.',
    ],
    knowledge: [
      p(
        'Border — непорожній власний prefix, який одночасно є suffix. Після mismatch усі можливі коротші кандидати лежать у ланцюжку π.',
      ),
      visual('kmp-fallback'),
      note(
        'Чому лінійно',
        'j зростає лише під час успішних порівнянь, а fallback строго його зменшує.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'vector<int> prefixFunction(const string& s) {',
          '    vector<int> pi(s.size());',
          '    for (int i = 1; i < int(s.size()); ++i) {',
          '        int j = pi[i - 1];',
          '        while (j > 0 && s[i] != s[j]) j = pi[j - 1];',
          '        if (s[i] == s[j]) ++j;',
          '        pi[i] = j;',
          '    }',
          '    return pi;',
          '}',
        ),
        'Prefix Function за O(n)',
      ),
      note(
        'Роздільник',
        'У pattern + separator + text обери символ, якого гарантовано немає у вхідному алфавіті.',
      ),
    ],
    theory: [
      p(
        'Перед позицією i значення j є найбільшою довжиною prefix, що збігається із suffix s[0..i). Fallback перебирає borders від довших до коротших.',
      ),
      note(
        'KMP — застосування',
        'Prefix Function описує структуру рядка, а KMP використовує цю структуру, щоб не рухати позицію text назад.',
      ),
    ],
    extensions: [
      {
        title: 'Trie та Aho–Corasick',
        blocks: [
          p(
            'Trie спільно зберігає prefixes багатьох patterns. Aho–Corasick додає failure links — аналог KMP fallback для всього trie.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'z-function',
    chapterId: 'ch-18',
    title: 'Z-function',
    description:
      'Для кожної позиції знаходимо довжину збігу substring із prefix та перевикористовуємо відомий Z-box.',
    intuition: [
      p(
        'Z[i] показує, скільки символів від позиції i повторюють початок рядка. Усередині вже відомого збігу частину відповіді можна скопіювати.',
      ),
      visual('z-box'),
    ],
    modeling: [
      table(
        ['Стан', 'Інваріант'],
        [
          ['[L,R)', 'найправіший substring, рівний prefix'],
          ['i ≥ R', 'розширення починається з нуля'],
          ['i < R', 'старт із min(R−i,z[i−L])'],
        ],
      ),
    ],
    priorKnowledge: [
      'Foundation → string та індекси',
      'Core → рухомий інтервал',
      'Нове → копіювання гарантованого збігу',
    ],
    recognitionSigns: [
      'Для кожної позиції потрібен LCP із початком рядка.',
      'Потрібно знайти входження, повтори або occurrences prefixes.',
      'Відповідь природно формулюється як z[i].',
    ],
    constraintSignals: [
      '|s| до 10⁶ потребує O(n).',
      'Достатньо одного масиву з n цілих.',
      'Для довільних пар suffix одного Z-масиву недостатньо.',
    ],
    notApplicableSigns: [
      'Порівнюються довільні substrings, не лише з prefix.',
      'Рядок змінюється онлайн.',
      'Головна структура — palindrome навколо центра.',
    ],
    knowledge: [
      p(
        'Для i>0 z[i] — максимальне k, для якого s[0..k)=s[i..i+k). Значення z[0] може бути 0 або n; у посібнику використовуємо n.',
      ),
      visual('z-box'),
      note(
        'Півінтервал',
        '[L,R) має довжину R−L, а R є першим ще не перевіреним символом.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'vector<int> zFunction(const string& s) {',
          '    int n = int(s.size());',
          '    vector<int> z(n);',
          '    if (n) z[0] = n;',
          '    for (int i = 1, l = 0, r = 0; i < n; ++i) {',
          '        if (i < r) z[i] = min(r - i, z[i - l]);',
          '        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];',
          '        if (i + z[i] > r) { l = i; r = i + z[i]; }',
          '    }',
          '    return z;',
          '}',
        ),
        'Z-function із box [l,r)',
      ),
    ],
    theory: [
      p(
        'Копіюється лише частина, що гарантовано лежить до R. Якщо відповідь доходить до межі box, подальші символи перевіряються явно.',
      ),
      note(
        'KMP чи Z?',
        'Обидва алгоритми лінійні. Обирай представлення, яке напряму відповідає потрібній величині.',
      ),
    ],
    extensions: [
      {
        title: 'Prefix occurrences і компресія',
        blocks: [
          p(
            'Значення z[i] описує діапазон prefixes, що починаються в i. Частоти довжин можна агрегувати suffix sums.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'string-hashing',
    chapterId: 'ch-18',
    title: 'String Hashing',
    description:
      'Перетворюємо static substring на числовий fingerprint і після preprocessing порівнюємо фрагменти за O(1).',
    intuition: [
      p(
        'Polynomial hash працює як число у системі з основою base. Prefix hashes дозволяють відняти все, що лежить ліворуч від substring.',
      ),
      visual('rolling-hash'),
    ],
    modeling: [
      table(
        ['Елемент', 'Роль'],
        [
          ['base', 'позиційна вага символів'],
          ['modulus', 'утримує числа у діапазоні'],
          ['powers[k]', 'масштабує prefix на k позицій'],
          ['double hash', 'зменшує ризик collision'],
        ],
      ),
      note(
        'Ймовірнісність',
        'Однакові рядки завжди мають однаковий hash, але різні теоретично можуть зіткнутися.',
      ),
    ],
    priorKnowledge: [
      'Foundation → Prefix Sum',
      'Core → Binary Search',
      'Advanced → modular arithmetic',
    ],
    recognitionSigns: [
      'Є багато запитів рівності static substrings.',
      'Потрібно binary search довжину LCP.',
      'Треба групувати fragments однакової довжини.',
    ],
    constraintSignals: [
      'n,q до 2·10⁵: O(length) на query не проходить.',
      'O(n) preprocessing і O(1) query достатні.',
      'Абсолютна гарантія може виключати hashing.',
    ],
    notApplicableSigns: [
      'Рядок часто змінюється.',
      'Потрібен lexicographic order усіх suffix.',
      'Навіть мізерна ймовірність collision неприйнятна.',
    ],
    knowledge: [
      p(
        'Для recurrence H[i+1]=(H[i]·base+value(s[i])) mod M hash [l,r) дорівнює H[r]−H[l]·base^(r−l).',
      ),
      visual('rolling-hash'),
      note(
        'Довжина є частиною ключа',
        'Порівнюй fingerprints, побудовані тією самою схемою, для fragments однакової довжини.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'long long getHash(int l, int r) { // [l, r)',
          '    long long removed = pref[l] * power[r - l] % mod;',
          '    return (pref[r] - removed + mod) % mod;',
          '}',
        ),
        'Вилучення substring hash',
      ),
      note(
        'Практичний захист',
        'Використовуй дві незалежні компоненти hash або перевірену 64-bit схему.',
      ),
    ],
    theory: [
      p(
        'Hashing повторює Prefix Sum, але символи мають позиційні ваги. Множник base^(r−l) вирівнює внесок prefix перед відніманням.',
      ),
      note(
        'Collision policy',
        'Для доказово точної відповіді обирай suffix structures, trie або пряме порівняння після сильного фільтра.',
      ),
    ],
    extensions: [
      {
        title: 'Suffix Array, Manacher та Suffix Automaton',
        blocks: [
          p(
            'Suffix Array детерміновано сортує suffix; Manacher знаходить усі palindromic radii; Suffix Automaton компактно представляє всі substrings і лишається optional.',
          ),
        ],
      },
    ],
  }),
];

export const stringTasks = [
  learning('prefix-function-kmp', {
    id: 'fragment-search',
    title: 'Пошук фрагмента',
    statement: [
      'Дано pattern P і text T. Виведи всі 0-based позиції, з яких у T починається точне входження P.',
    ],
    input: 'Два непорожні рядки P і T з малих латинських літер.',
    output: 'Кількість входжень і всі їх початкові позиції.',
    constraints: ['1 ≤ |P|,|T|', '|P|+|T| ≤ 400000'],
    examples: [example('aba\\nabacaba', '2\\n0 4')],
    tryYourself:
      'Як після mismatch використати вже збіглий suffix pattern, не повертаючи позицію text назад?',
    hint: 'Побудуй Prefix Function для P + # + T.',
    firstApproach: [
      p('Для кожної позиції text порівнювати pattern посимвольно.'),
    ],
    approachReview:
      'На повторюваних рядках однакові prefixes порівнюються знову, що дає O(|P|·|T|).',
    observation: [
      p('π[i]=|P| саме в кінцях повних входжень pattern.'),
      visual('kmp-fallback'),
    ],
    algorithm: [
      'Побудуй combined=P+# +T.',
      'Обчисли Prefix Function.',
      'Для π[i]=|P| перетвори i на старт у T.',
      'Виведи позиції.',
    ],
    proof:
      'Prefix Function у позиції i дає найдовший prefix combined, що закінчується в i. Роздільник забороняє збіг довший за P, тому рівність |P| точно відповідає входженню.',
    complexity: 'O(|P|+|T|) часу й пам’яті.',
    solution: cpp(
      lines(
        '    string p, t; cin >> p >> t;',
        '    string s = p + "#" + t;',
        '    vector<int> pi(s.size());',
        '    for (int i = 1; i < int(s.size()); ++i) {',
        '        int j = pi[i - 1];',
        '        while (j > 0 && s[i] != s[j]) j = pi[j - 1];',
        '        if (s[i] == s[j]) ++j;',
        '        pi[i] = j;',
        '    }',
        '    vector<int> answer;',
        '    for (int i = int(p.size()) + 1; i < int(s.size()); ++i)',
        '        if (pi[i] == int(p.size()))',
        '            answer.push_back(i - 2 * int(p.size()));',
        "    cout << answer.size() << '\\n';",
        "    for (int pos : answer) cout << pos << ' ';",
        "    cout << '\\n';",
      ),
    ),
    takeaway:
      'KMP не повторює відомі порівняння: fallback переходить між borders.',
  }),
  practice('prefix-function-kmp', {
    id: 'string-borders',
    title: 'Borders рядка',
    statement: [
      'Виведи всі довжини непорожніх власних prefixes s, які одночасно є suffix s.',
    ],
    input: 'Рядок s.',
    output: 'Довжини у зростаючому порядку.',
    constraints: ['1 ≤ |s| ≤ 200000'],
    examples: [example('ababa', '1 3')],
    hint: 'Почни з π[n−1], переходь k=π[k−1], потім розверни відповідь.',
  }),
  practice('prefix-function-kmp', {
    id: 'minimum-string-period',
    title: 'Мінімальний період',
    statement: [
      'Знайди найменшу довжину блока, повтореннями якого повністю утворюється s.',
    ],
    input: 'Рядок s.',
    output: 'Довжина мінімального періоду.',
    constraints: ['1 ≤ |s| ≤ 200000'],
    examples: [example('abcabcabc', '3')],
    hint: 'Кандидат p=n−π[n−1] є періодом лише якщо n%p=0.',
  }),
  practice('prefix-function-kmp', {
    id: 'prefix-occurrence-count',
    title: 'Кількість входжень prefixes',
    statement: [
      'Для кожної довжини k порахуй occurrences prefix довжини k у s.',
    ],
    input: 'Рядок s.',
    output: '|s| чисел.',
    constraints: ['1 ≤ |s| ≤ 200000'],
    examples: [example('aaaa', '4 3 2 1')],
    hint: 'Передай частоти від довгого border до його suffix-link.',
  }),

  learning('z-function', {
    id: 'prefix-match-lengths',
    title: 'Наскільки збігається?',
    statement: [
      'Для кожної позиції i виведи LCP рядка s і suffix s[i..]. Для i=0 виведи |s|.',
    ],
    input: 'Рядок s.',
    output: '|s| значень z[i].',
    constraints: ['1 ≤ |s| ≤ 400000'],
    examples: [example('aabcaab', '7 1 0 0 3 1 0')],
    tryYourself:
      'Що гарантовано відомо, якщо i лежить усередині вже відомого prefix-збігу?',
    hint: 'Підтримуй найправіший box [L,R).',
    firstApproach: [p('Для кожного i порівнювати prefix і suffix з нуля.')],
    approachReview: 'На рядку з однакових символів це виконає Θ(n²) порівнянь.',
    observation: [
      p('Усередині [L,R) частину відповіді можна взяти з z[i−L].'),
      visual('z-box'),
    ],
    algorithm: [
      'Поклади z[0]=n.',
      'Для i<R скопіюй min(R−i,z[i−L]).',
      'Розшир збіг.',
      'За потреби онови box.',
    ],
    proof:
      'До R рівність із prefix вже доведена. Поза R символи перевіряються явно, тому z[i] точне; права межа рухається лише вперед.',
    complexity: 'O(n) часу й O(n) пам’яті.',
    solution: cpp(
      lines(
        '    string s; cin >> s; int n = int(s.size());',
        '    vector<int> z(n); z[0] = n;',
        '    for (int i = 1, l = 0, r = 0; i < n; ++i) {',
        '        if (i < r) z[i] = min(r - i, z[i - l]);',
        '        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];',
        '        if (i + z[i] > r) { l = i; r = i + z[i]; }',
        '    }',
        "    for (int x : z) cout << x << ' ';",
        "    cout << '\\n';",
      ),
    ),
    takeaway:
      'Z-box копіює гарантований збіг; явно перевіряються лише нові символи.',
  }),
  practice('z-function', {
    id: 'z-pattern-matching',
    title: 'Pattern через Z',
    statement: ['Знайди всі 1-based входження P у T через Z-function.'],
    input: 'P і T.',
    output: 'Позиції входжень.',
    constraints: ['1 ≤ |P|+|T| ≤ 400000'],
    examples: [example('aa\\naaaa', '1 2 3')],
    hint: 'Побудуй Z для P#T і шукай z[i]≥|P|.',
  }),
  practice('z-function', {
    id: 'z-prefix-occurrences',
    title: 'Prefix occurrences через Z',
    statement: [
      'Для кожного запиту k порахуй позиції i, де prefix довжини k починається в i.',
    ],
    input: 's, q та q значень k.',
    output: 'Відповіді.',
    constraints: ['|s|,q ≤ 200000'],
    examples: [example('aaaa 3\\n1\\n2\\n4', '4\\n3\\n1')],
    hint: 'Побудуй частоти z і suffix sums.',
  }),
  practice('z-function', {
    id: 'z-compression',
    title: 'Компресія рядка',
    statement: [
      'Знайди найкоротший prefix p, нескінченним повторенням якого починається весь s.',
    ],
    input: 'Рядок s.',
    output: 'Мінімальна |p|.',
    constraints: ['1 ≤ |s| ≤ 200000'],
    examples: [example('abcabca', '3')],
    hint: 'Для кандидата len перевір, чи z[len] покриває потрібні повтори.',
  }),

  learning('string-hashing', {
    id: 'equal-substrings',
    title: 'Рівні підрядки',
    statement: [
      'Дано s і q запитів l1 r1 l2 r2 з 1-based inclusive межами. Перевір рівність substrings.',
    ],
    input: 's, q та q четвірок індексів.',
    output: 'YES або NO для кожного запиту.',
    constraints: ['1 ≤ |s|,q ≤ 200000'],
    examples: [
      example('abacaba 3\\n1 3 5 7\\n1 2 2 3\\n3 4 3 4', 'YES\\nNO\\nYES'),
    ],
    tryYourself: 'Як вилучити fingerprint [l,r) із двох prefix fingerprints?',
    hint: 'H[r]−H[l]·base^(r−l).',
    firstApproach: [p('Порівнювати fragments символ за символом.')],
    approachReview:
      'Один query може коштувати O(n), разом O(nq); рядок static.',
    observation: [
      p('Prefix hash дає fingerprint будь-якого substring за O(1).'),
      visual('rolling-hash'),
    ],
    algorithm: [
      'Побудуй powers і дві prefix-hash компоненти.',
      'Порівняй довжини.',
      'Отримай hashes обох fragments.',
      'Порівняй обидві компоненти.',
    ],
    proof:
      'H[r] складається з H[l], зсунутого на r−l позицій, і substring hash. Віднімання лишає потрібний fingerprint. Рівні substrings дають рівні hashes; double hash лишає лише мізерну ймовірність collision.',
    complexity: 'O(n+q) часу й O(n) пам’яті.',
    solution: cpp(
      lines(
        '    string s; cin >> s; int n = int(s.size()), q; cin >> q;',
        "    const long long B=911382323, M1=1'000'000'007, M2=1'000'000'009;",
        '    vector<long long> p1(n+1,1),p2(n+1,1),h1(n+1),h2(n+1);',
        '    for(int i=0;i<n;++i){ long long v=(unsigned char)s[i]+1;',
        '        p1[i+1]=p1[i]*B%M1; p2[i+1]=p2[i]*B%M2;',
        '        h1[i+1]=(h1[i]*B+v)%M1; h2[i+1]=(h2[i]*B+v)%M2; }',
        '    auto get=[&](const vector<long long>& h,const vector<long long>& pw,long long mod,int l,int r){',
        '        return (h[r]-h[l]*pw[r-l]%mod+mod)%mod; };',
        '    while(q--){ int l1,r1,l2,r2; cin>>l1>>r1>>l2>>r2; --l1; --l2;',
        '        bool same = r1-l1 == r2-l2;',
        '        if(same) same = get(h1,p1,M1,l1,r1)==get(h1,p1,M1,l2,r2)',
        '                         && get(h2,p2,M2,l1,r1)==get(h2,p2,M2,l2,r2);',
        '        cout << (same ? "YES" : "NO") << \'\\n\';',
        '    }',
      ),
    ),
    takeaway: 'String Hashing — Prefix Sum для позиційно зважених символів.',
  }),
  practice('string-hashing', {
    id: 'periodic-substrings',
    title: 'Періодичні підрядки',
    statement: ['Для query l r p перевір, чи substring s[l..r] має період p.'],
    input: 's, q і запити.',
    output: 'YES/NO.',
    constraints: ['|s|,q ≤ 200000'],
    examples: [example('abcabcx 2\\n1 6 3\\n1 7 3', 'YES\\nNO')],
    hint: 'Порівняй hash [l,r−p] і [l+p,r].',
  }),
  practice('string-hashing', {
    id: 'suffix-lcp-queries',
    title: 'LCP двох suffix',
    statement: [
      'Для кожної пари позицій i,j знайди LCP suffix s[i..] і s[j..].',
    ],
    input: 's, q та q пар позицій.',
    output: 'LCP кожної пари.',
    constraints: ['|s|,q ≤ 200000'],
    examples: [example('banana 2\\n2 4\\n1 3', '3\\n0')],
    hint: 'Binary Search on Answer, predicate — рівність hashes.',
  }),
  practice('string-hashing', {
    id: 'distinct-fixed-substrings',
    title: 'Різні підрядки заданої довжини',
    statement: [
      'Для кожного k порахуй кількість різних substrings s довжини k.',
    ],
    input: 's, q та q значень k.',
    output: 'Відповіді.',
    constraints: ['|s| ≤ 50000', 'q ≤ 30'],
    examples: [example('ababa 2\\n2\\n3', '2\\n2')],
    hint: 'Поклади double hashes усіх fragments довжини k у set.',
  }),
  practice('string-hashing', {
    id: 'palindrome-hash-queries',
    title: 'Дзеркальні фрагменти',
    statement: ['Для кожного query l r перевір, чи s[l..r] є palindrome.'],
    input: 's, q та запити.',
    output: 'YES/NO.',
    constraints: ['|s|,q ≤ 200000'],
    examples: [example('abacaba 2\\n1 7\\n2 5', 'YES\\nNO')],
    hint: 'Порівняй hash s із відповідним фрагментом reversed(s).',
  }),
];
