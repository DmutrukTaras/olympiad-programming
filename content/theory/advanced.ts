import type { TheorySections } from '@/content/theory/helpers';
import { list, note, paragraph, table } from '@/content/theory/helpers';

type DeepTheoryInput = {
  mechanics: string;
  representation: string;
  invariant: string;
  proof: string;
  costs: [string, string][];
  pitfalls: string[];
  selection: string;
  checks: string[];
};

const deepTheory = ({
  mechanics,
  representation,
  invariant,
  proof,
  costs,
  pitfalls,
  selection,
  checks,
}: DeepTheoryInput): TheorySections => [
  {
    title: 'Механіка алгоритму крок за кроком',
    blocks: [
      paragraph(mechanics),
      paragraph(representation),
      note(
        'Робоче представлення',
        'Спробуй назвати зміст кожної змінної стану одним реченням. Якщо визначення залежить від майбутніх кроків або двозначне на межах, реалізація ще не готова.',
      ),
    ],
  },
  {
    title: 'Інваріант, доведення та оцінка',
    blocks: [
      paragraph(invariant),
      paragraph(proof),
      table(
        ['Частина', 'Що оцінюємо'],
        costs.map(([part, value]) => [part, value]),
      ),
      note(
        'Доведення перед оптимізацією',
        'Спершу доведи, що стан не втрачає інформацію й кожен кандидат обробляється коректно. Лише після цього стискай пам’ять, міняй контейнер або додавай евристику.',
      ),
    ],
  },
  {
    title: 'Пастки, варіації та контрольний список',
    blocks: [
      paragraph(selection),
      list(...pitfalls),
      note(
        'Перед submit',
        'Перевір не тільки випадкові дані, а й найменший input, повністю вироджену структуру, дублікати, відповідь на межі типу та випадок, де оптимальна відповідь не є унікальною.',
      ),
      list(...checks),
    ],
  },
];

export const advancedTheoryAdditions: Record<string, TheorySections> = {
  'prefix-function-kmp': deepTheory({
    mechanics:
      'Побудова π рухається зліва направо. Для нового символу стартовим кандидатом є π[i−1]: це найдовший border попереднього prefix. Якщо s[i] не продовжує його, повний кандидат неможливий, але його власний border ще може підійти. Тому j переходить у π[j−1], доки не знайдеться сумісний символ або j не стане нулем. Після збігу j збільшується, і це точне π[i]. У KMP той самий fallback застосовується до pattern, тоді як позиція text ніколи не рухається назад.',
    representation:
      'Корисно уявляти всі borders одного prefix як ланцюжок suffix links. Значення j не є індексом останнього збіглого символу: це довжина збігу й одночасно індекс наступного символу pattern. Для пошуку можна будувати combined string із separator або обробляти text потоком, підтримуючи j. Потоковий варіант економить combined array і працює навіть коли text надходить частинами.',
    invariant:
      'Перед обробкою s[i] значення j є найбільшою довжиною prefix, який дорівнює suffix s[0..i). Після невдалого порівняння будь-який можливий новий border мусить бути border самого prefix довжини j, тому перехід π[j−1] не пропускає кандидатів. Коли символи збігаються, довжина j+1 досяжна; усі довші кандидати вже були відкинуті.',
    proof:
      'Лінійність випливає не з одного while, а з амортизації: успішні кроки збільшують j не більше ніж n разів, а кожна ітерація fallback строго його зменшує. Для pattern matching повний збіг фіксується при j=m; після запису occurrence можна перейти до π[m−1] і шукати overlapping matches. Роздільник у combined string гарантує, що border не перетне межу між pattern і text.',
    costs: [
      ['Prefix Function', 'O(n) часу, O(n) пам’яті'],
      ['KMP search', 'O(n+m) часу'],
      ['Streaming KMP', 'O(m) preprocessing і O(m) пам’яті'],
    ],
    pitfalls: [
      'Після mismatch використовувати if замість while: одного fallback може бути недостатньо.',
      'Плутати π[i] з кількістю входжень або з Z[i].',
      'Взяти separator, який трапляється у вхідному алфавіті.',
      'Після повного match не повернути j до π[j−1] і втратити overlapping occurrences.',
    ],
    selection:
      'Prefix Function особливо природна, коли відповідь формулюється через borders, periods або стан automaton після прочитаного prefix. Z-function часто коротша, коли потрібна довжина збігу з початком для кожної позиції. Для одного pattern обидва підходи лінійні; для багатьох patterns окремі KMP запускаються повторно, тому слід перевірити Trie/Aho–Corasick.',
    checks: [
      'Рядки довжини 1, pattern довший за text і відсутність matches.',
      'Усі символи однакові — найбільша кількість overlapping matches.',
      'Періодичний рядок із кількома рівнями borders.',
      'Формула перетворення combined index у позицію text перевірена вручну.',
    ],
  }),
  'z-function': deepTheory({
    mechanics:
      'Алгоритм підтримує найправіший box [L,R), для якого s[L..R)=s[0..R−L). Якщо i поза box, z[i] починається з нуля. Якщо i всередині, позиція i−L у prefix має вже відоме z; гарантовано можна скопіювати min(z[i−L],R−i). Лише коли цей збіг доходить до R, алгоритм порівнює нові символи й, можливо, пересуває праву межу.',
    representation:
      'Z[i] — довжина, а не права координата. Конвенція z[0]=n корисна у задачах про occurrences prefixes, але деякі джерела залишають нуль; формули мають бути узгоджені. Box не обов’язково відповідає найбільшому z — він має найбільшу праву межу. L потрібне, щоб відобразити позицію всередині box назад у prefix.',
    invariant:
      'На початку ітерації [L,R) є найправішим серед уже знайдених prefix-збігів. Усі символи до R всередині box вже доведено рівні відповідним символам prefix. Тому копіювання до межі безпечне. Поза R жодної гарантії немає, і while перевіряє кожен новий символ явно.',
    proof:
      'Кожне пряме порівняння, що завершується успіхом за межами box, збільшує R. Права межа не зменшується, отже таких успіхів O(n). Невдалі порівняння трапляються щонайбільше один раз на позицію i. Скопійовані значення не потребують порівнянь і не можуть завищити z[i], бо обрізані межею відомої рівності.',
    costs: [
      ['Побудова Z', 'O(n) часу'],
      ['Пам’ять', 'O(n) integers'],
      ['Pattern search', 'O(n+m)'],
    ],
    pitfalls: [
      'Змішати inclusive [L,R] і half-open [L,R).',
      'Скопіювати z[i−L] без min із R−i.',
      'Оновлювати box при коротшій правій межі.',
      'Забути перевірку i+z[i]<n у while.',
    ],
    selection:
      'Z-function виграє, коли кожна позиція напряму питає «наскільки suffix схожий на весь рядок». Для exact arbitrary-substring queries потрібен інший preprocessing. Для періодів обидві string functions працюють, але критерій потрібно вивести з обраного визначення, а не механічно переносити формулу Prefix Function.',
    checks: [
      'Рядок з усіх однакових символів.',
      'Рядок без повторення першого символу.',
      'Box, усередині якого скопійоване значення коротше за R−i.',
      'Box, де копія рівно доходить до R і потребує розширення.',
    ],
  }),
  'string-hashing': deepTheory({
    mechanics:
      'Prefix hash будується recurrence H[i+1]=H[i]·base+code(s[i]). Це означає, що старий prefix зсувається на одну позицію й отримує новий символ. У H[r] внесок H[l] зсунутий на r−l позицій, тому його можна вилучити множенням на power[r−l]. Після normalization отримуємо fingerprint [l,r) незалежно від його абсолютної позиції.',
    representation:
      'Один hash є residue polynomial modulo M. Практичний ключ substring зазвичай містить дві residues та довжину. Base не повинен бути 0,1 або близьким до тривіальних значень; codes символів не варто починати з нуля. Powers і prefix arrays мають використовувати ті самі base/mod. 64-bit arithmetic або __int128 потрібне до взяття modulo.',
    invariant:
      'H[i] дорівнює polynomial hash перших i символів. Індукційний крок recurrence додає s[i] у наймолодшу позицію й зсуває всі попередні ваги. Тому algebraic subtraction точно відновлює polynomial потрібного fragment. Рівні fragments однакової довжини мають однакові coefficients і гарантовано однаковий hash.',
    proof:
      'Зворотне твердження ймовірнісне: різниця двох різних polynomials може випадково дати нуль modulo M. Дві незалежні moduli вимагають одночасної collision у двох полях і роблять ризик практично мізерним, але не нульовим. Якщо adversarial input може залежати від constants, randomized base зменшує можливість сконструйованих collisions.',
    costs: [
      ['Preprocessing', 'O(n)'],
      ['Substring hash', 'O(1)'],
      ['LCP через Binary Search', 'O(log n) на query'],
    ],
    pitfalls: [
      'Порівнювати fragments різної довжини лише за hash.',
      'Не нормалізувати від’ємну різницю після modulo.',
      'Перемножити int до перетворення в long long.',
      'Називати hashing абсолютно точним алгоритмом у доведенні.',
    ],
    selection:
      'Hashing сильний для static text, великої кількості equality checks та поєднання з Binary Search. Suffix Array/LCP дає детерміновані відповіді й кращий глобальний lexicographic structure. Trie корисний для набору цілих strings. Manacher спеціалізований на palindromes і не має collision.',
    checks: [
      'Однакові fragments на різних позиціях.',
      'Однаковий hash-query для [0,n) і prefix array.',
      'Fragments довжини 0 або 1 відповідно до контракту.',
      'Індекси reversed string для palindrome query перевірені на папері.',
    ],
  }),
  'points-vectors-cross': deepTheory({
    mechanics:
      'Віднімання точок створює вектор: B−A описує напрям і довжину переходу. Cross двох 2D vectors u і v — scalar ux·vy−uy·vx. Для orientation використовуються vectors з одним початком A. Додатний знак означає, що коротший поворот від AB до AC відбувається проти годинникової стрілки; від’ємний — за нею; нуль означає лінійну залежність.',
    representation:
      'Point і Vector можуть мати однакову структуру полів, але різну семантику. Додавати дві точки зазвичай беззмістовно, тоді як point+vector дає point. У невеликому contest-коді один struct прийнятний, якщо назви функцій cross(a,b,c), dot(a,b,c) чітко вказують модель. Для coordinates до 10⁹ різниці досягають 2·10⁹, а products — 4·10¹⁸.',
    invariant:
      'Affine translation не змінює orientation: перенесення всіх точок на однаковий vector залишає B−A і C−A незмінними. Cross також масштабується разом із координатами, але його знак зберігається при додатному масштабі. Саме тому algebraic determinant є точною характеристикою лівого/правого повороту.',
    proof:
      'Абсолютне значення determinant дорівнює площі parallelogram, побудованого на vectors, а половина — площі triangle. Якщо vectors collinear, площа нульова. Перестановка vectors міняє орієнтацію parallelogram і знак. Отже три можливі знаки вичерпують LEFT, RIGHT і COLLINEAR без обчислення angle.',
    costs: [
      ['Одна orientation', 'O(1)'],
      ['Тип проміжного добутку', '__int128 для великих coordinates'],
      ['Додаткова пам’ять', 'O(1)'],
    ],
    pitfalls: [
      'Відняти координати в long long вже після overflow у int.',
      'Поміняти порядок B і C та інтерпретувати старий знак.',
      'Використати cross=0 як повну перевірку point-on-segment.',
      'Застосувати epsilon до exact integer computation.',
    ],
    selection:
      'Cross потрібен для orientation, area, intersections і convex hull. Dot product краще відповідає на projection, acute/obtuse angle та положення точки відносно кінців segment. Euclidean length потребує square root лише на фінальному етапі; порівнювати відстані часто можна за squared length.',
    checks: [
      'Горизонтальний AB і точки зверху/знизу.',
      'Vertical та diagonal directions.',
      'A, B, C з однаковими або крайніми coordinates.',
      'Порядок обходу polygon та знак signed area узгоджені.',
    ],
  }),
  'intersections-conditions': deepTheory({
    mechanics:
      'Для segments AB і CD обчислюються чотири orientations: C,D відносно AB та A,B відносно CD. Якщо обидві пари мають протилежні ненульові знаки, прямі перетинаються всередині обох segments. Коли orientation нульова, точка лежить на supporting line, але ще потрібно перевірити, чи її x і y потрапляють у закриті діапазони кінців.',
    representation:
      'Замість множення o1·o2<0, яке може overflow навіть для __int128 у загальніших типах, зручно мати function oppositeSigns. onSegment поєднує cross==0 та bounds. Якщо segment може бути точкою A=B, ця ж функція коректна: bounding box стискається до однієї coordinate pair.',
    invariant:
      'Orientation точно класифікує кожен endpoint відносно supporting line. Для неколінеарних segments умова різних сторін є необхідною й достатньою за неперервністю segment. Усі інші intersections містять endpoint, collinear з іншим segment; чотири onSegment checks вичерпують ці випадки.',
    proof:
      'Якщо C і D по різні боки AB, segment CD перетинає line AB. Симетрична умова гарантує, що точка перетину лежить також у AB, а не лише на його продовженні. За нульового orientation спільна точка існує рівно тоді, коли відповідний endpoint входить у bounds другого segment.',
    costs: [
      ['Одна пара segments', 'O(1)'],
      ['Нова дорога проти m доріг', 'O(m)'],
      ['Усі пари m segments', 'O(m²), часто надто дорого'],
    ],
    pitfalls: [
      'Перевірити лише strict case і втратити touching.',
      'Перевірити лише x-projection для vertical/horizontal особливостей.',
      'Вважати перетин supporting lines перетином segments.',
      'Не уточнити, чи segments відкриті або замкнені.',
    ],
    selection:
      'Constant-time predicate підходить для одного або лінійної кількості незалежних checks. Якщо треба знайти всі intersections великої множини, потрібна Sweep Line або спеціальна геометрична структура. Для distance to segment orientation недостатньо: потрібні dot projection і floating-point output.',
    checks: [
      'Strict X-перетин.',
      'Спільний endpoint.',
      'Повний і частковий collinear overlap.',
      'Collinear disjoint та parallel non-collinear segments.',
    ],
  }),
  'convex-hull': deepTheory({
    mechanics:
      'Monotonic Chain починає з lexicographic sorting і unique. Lower chain читає точки зліва направо. Після push останні три точки повинні робити дозволений поворот; інакше середня pop-иться, доки convexity не відновиться. Upper chain повторює процес у зворотному порядку. Крайні endpoints потрапляють в обидві половини, тому перед concatenation їх видаляють по одному разу.',
    representation:
      'Hull зберігається cyclic order без повтореного першого елемента. Політика collinear points визначається знаком pop: <=0 дає strict vertices, <0 залишає boundary points, але повністю collinear input потребує окремої уваги. Після unique випадки n≤2 повертаються без загального алгоритму.',
    invariant:
      'Після обробки чергової точки lower є convex нижньою boundary для всіх уже прочитаних points. Якщо A,B,C не роблять лівий поворот, B лежить на або вище segment AC і не може бути extreme point нижньої оболонки. Її видалення не прибирає жодної точки нижче нового edge.',
    proof:
      'Sorting гарантує монотонність x. Кожна extreme point нижньої оболонки з’являється в chain і не буде видалена дозволеним поворотом; кожна non-extreme рано чи пізно опиняється середньою у неправильному повороті. Симетричний аргумент працює для upper. Кожна точка push/pop не більше одного разу на половину.',
    costs: [
      ['Sorting + unique', 'O(n log n)'],
      ['Дві chains', 'O(n) amortized'],
      ['Подальший алгоритм', 'часто O(h) або O(log h)'],
    ],
    pitfalls: [
      'Не видалити дублікати й отримати нульові edges.',
      'Змішати бажану collinear policy з оператором pop.',
      'Повторити endpoints під час злиття upper/lower.',
      'Вважати perimeter нульовим/подвоєним для h=2 без явної моделі.',
    ],
    selection:
      'Hull корисний, якщо внутрішні points гарантовано не впливають на extreme objective: maximum distance, supporting lines, minimum enclosing convex fence. Він не відновлює non-convex boundary набору й не зберігає interior multiplicities. Dynamic hull — окрема значно складніша задача.',
    checks: [
      'Усі points однакові.',
      'Усі points collinear.',
      'Багато points на сторонах rectangle.',
      'Порядок CCW та старт із lexicographic minimum.',
    ],
  }),
  'subset-enumeration': deepTheory({
    mechanics:
      'Повний цикл mask від 0 до 2ⁿ−1 кодує всі незалежні рішення take/skip. Усередині можна перевіряти біти, але часто швидше будувати значення mask із меншого стану: видалити lowest set bit і додати внесок відповідного елемента. Конфлікти, allowed sets і coverage також кодуються masks, перетворюючи цикли на bitwise operations.',
    representation:
      'Тип mask має покривати n bits. int зручний до 30, unsigned long long — до 64, але 2⁶⁴ перебрати неможливо. Вираз 1<<i обчислюється як int; для ширшого типу потрібен 1ULL<<i. popcount, countr_zero або GNU builtins мають відповідати типу аргументу.',
    invariant:
      'Між числами 0..2ⁿ−1 і subsets n елементів існує bijection: binary digit i є 1 рівно для вибраного елемента i. Тому enumeration повний і без повторів. Якщо check(mask) точно еквівалентний вимогам задачі, максимум або count по всіх masks є правильною відповіддю.',
    proof:
      'Кожен subset визначає унікальну суму різних powers of two, а кожна mask має унікальний binary representation. Оптимізація через previousMask=mask without one bit коректна, бо current subset відрізняється рівно цим елементом. Для submask loop операція (sub−1)&mask переходить до найбільшого меншого числа, що не має bits поза mask.',
    costs: [
      ['Masks', '2ⁿ'],
      ['Scan усіх bits', 'O(n·2ⁿ)'],
      ['Усі submasks усіх masks', 'O(3ⁿ)'],
    ],
    pitfalls: [
      'Оцінити лише 2ⁿ і забути дорогий check усередині.',
      'Undefined/overflow shift для неправильного типу.',
      'Забути subset mask=0.',
      'Зациклити submask enumeration після sub=0.',
    ],
    selection:
      'До n≈20 enumeration часто є чесним основним алгоритмом. Для n≈40 перевір MITM. Якщо потрібно найкраще значення для повторюваного subset state, переходь до Bitmask DP. Якщо невелика не кількість об’єктів, а інший parameter k, mask кодує лише цей parameter.',
    checks: [
      'Порожній і повний subsets.',
      'n=0 або n=1, якщо дозволено.',
      'Усі values нульові чи від’ємні.',
      'Числова оцінка operations для максимального n.',
    ],
  }),
  'bitmask-dp': deepTheory({
    mechanics:
      'Bitmask DP розміщує subsets шарами за popcount. Для assignment стан dp[mask] зберігає optimum після призначення перших k=popcount(mask) workers задачам mask. Transition вибирає unset task і переходить у mask|bit. Для TSP множини недостатньо: додається last vertex, бо ціна наступного edge залежить від поточного кінця.',
    representation:
      'Перед вибором dimensions проведи тест state completeness: чи два різні partial solutions із однаковим state мають однаковий набір майбутніх можливостей і однакові майбутні costs? Якщо ні, додай мінімально потрібну координату. INF/NEG_INF відділяє unreachable state від досяжного з нульовою вартістю.',
    invariant:
      'Після завершення шару k кожен state з k bits містить optimum серед усіх partial solutions, що використовують саме цей subset. Кожний transition додає один елемент, тому граф станів acyclic і всі predecessors мають на один bit менше. Це дозволяє простий порядок masks.',
    proof:
      'Візьмемо оптимальне рішення для current mask. Його останній доданий object визначає predecessor без одного біта. За індукційним припущенням dp predecessor не гірший за prefix оптимального рішення, отже transition відтворить не гіршу value. Зворотно кожен transition будує допустиме partial solution.',
    costs: [
      ['dp[mask]', 'O(n·2ⁿ) переходів, O(2ⁿ) пам’яті'],
      ['dp[mask][last]', 'O(n²·2ⁿ) naive transitions'],
      ['Reconstruction', 'додатковий parent на state'],
    ],
    pitfalls: [
      'Вивести worker окремою dimension, хоча його задає popcount.',
      'Забути last, коли future залежить від кінця маршруту.',
      'Додавати cost до INF.',
      'Зайняти сотні MB через vector<vector> overhead.',
    ],
    selection:
      'Bitmask DP потрібен, коли однакові використані множини виникають багатьма порядками. Якщо кожен subset перевіряється незалежно, достатньо enumeration. Якщо n≈40 і objective розкладається між halves, MITM сильніший. Для symmetric objects іноді можлива count-based DP без mask.',
    checks: [
      'All bits state і правильне місце відповіді.',
      'Transition не додає вже встановлений bit.',
      'Exact memory у bytes для максимального n.',
      'Малий n перевірений повним permutation brute force.',
    ],
  }),
  'meet-in-the-middle': deepTheory({
    mechanics:
      'Множина ділиться на L і R близьких розмірів. Для кожної половини генеруються всі можливі результати: sums, xors, pairs cost/value або endpoints. Далі одна таблиця індексується sorting/hash. Для closest sum≤S праві sums сортуються, а для кожної лівої sum x через upper_bound знаходиться найбільша y≤S−x.',
    representation:
      'Розмір halves варто балансувати за реальною кількістю states, не обов’язково за числом сирих елементів. Результати можуть мати дублікати: для existence їх можна unique, для counting треба зберігати multiplicity. Якщо result є pair, dominated states можна викидати, утворюючи Pareto frontier.',
    invariant:
      'Кожен full subset однозначно розкладається на його перетини з L і R. Отже простір усіх full solutions дорівнює Cartesian product двох result sets. Алгоритм не перебирає product явно, але data structure query для кожного left result повертає найкращий compatible right result.',
    proof:
      'Оптимальна full solution має пару (x,y). Під час обробки x query розглядає всі right results, що задовольняють constraint, у compressed form. Якщо query повертає predecessor не гірший за y, candidate не гірший за optimum і залишається допустимим; тому він мусить мати ту саму оптимальну value.',
    costs: [
      ['Generation', 'O(2^(n/2)) states на половину'],
      ['Sorting', 'O(2^(n/2)·n)'],
      ['Combine', 'O(2^(n/2) log 2^(n/2))'],
    ],
    pitfalls: [
      'Після split все одно перебрати всі pairs A×B.',
      'Видалити duplicates у counting problem.',
      'Не врахувати negative values у pruning.',
      'Зберегти 2^25 чи більше важких objects без memory estimate.',
    ],
    selection:
      'MITM працює, коли contributions halves комбінуються простою associative operation і constraint можна перевірити query до другої таблиці. Якщо сильні залежності перетинають split, state result повинен їх кодувати, що може знищити виграш. Для n≤25 простий mask code зазвичай коротший.',
    checks: [
      'Оптимум використовує тільки одну половину або empty subset.',
      'Duplicate sums у counting version.',
      'Негативні числа, якщо вони дозволені.',
      'upper_bound не розіменовується при it==begin.',
    ],
  }),
  'scc-bridges-articulation': deepTheory({
    mechanics:
      'Цей патерн має дві гілки. Для directed SCC Kosaraju робить finish-order DFS, а потім DFS у reversed graph; Tarjan використовує low-link і stack за один прохід. Для undirected bridges/articulation DFS будує tree, записує tin і мінімальний reachable ancestor low. Back edge зменшує low, tree edge передає low child батькові.',
    representation:
      'У multigraph edge повинен мати id, бо дві паралельні edges до parent не є одним і тим самим parent edge. Для SCC component[v] є equivalence class; condensation edges створюються між різними ids і зазвичай deduplicate. Для articulation root DFS tree має окреме правило, бо в нього немає предка, якого відрізає child.',
    invariant:
      'У Kosaraju finish order відображає topological direction condensation. У low-link DFS low[v] є minimum tin, досяжний із subtree v, використовуючи будь-яку кількість tree edges униз і щонайбільше одне back edge вгору. Це визначення треба підтримувати окремо для visited neighbor і DFS child.',
    proof:
      'Якщо low[to]>tin[v], subtree to не має edge до v або його предків, окрім tree edge, тому її видалення роз’єднує graph. Якщо low[to]≤tin[v], існує обхід. Для SCC другий DFS у reversed graph, запущений за decreasing finish time, не виходить із поточної SCC до ще не пофарбованої, але охоплює всю взаємну компоненту.',
    costs: [
      ['SCC', 'O(V+E)'],
      ['Bridges/articulation', 'O(V+E)'],
      ['Condensation', 'O(V+E), плюс dedup за потреби'],
    ],
    pitfalls: [
      'Застосувати bridge condition до directed graph.',
      'Для back edge взяти low[to] замість tin[to].',
      'Пропустити всі edges до parent vertex у multigraph.',
      'Використати non-root articulation criterion для DFS root.',
    ],
    selection:
      'SCC відповідає на mutual reachability й перетворює directed cycles на DAG. Bridges та articulation points відповідають на single-point failures у undirected graph. Якщо треба minimum cut із кількома edges або capacities, потрібні flow/cut алгоритми з Challenge.',
    checks: [
      'Disconnected graph — DFS запускається з кожної вершини.',
      'Self-loops і parallel edges.',
      'Одна вершина та tree-chain.',
      'Condensation справді acyclic на результаті.',
    ],
  }),
  'lca-binary-lifting': deepTheory({
    mechanics:
      'Preprocessing обирає root, рахує depth і immediate parent. Далі up[v][k] отримується композицією двох стрибків 2^(k−1). LCA query спершу піднімає глибшу вершину на depth difference. Якщо вершини не збіглися, обидві стрибають від найбільшого k до нуля лише тоді, коли їхні 2^k ancestors різні.',
    representation:
      'LOG має задовольняти 2^LOG>n для LCA або покривати maximum k для ancestor queries. Layout up[n][LOG] зручний по вершинах; up[LOG][n] іноді cache-friendly у preprocessing. parent[root]=root прибирає sentinel branches, але kth ancestor за межами depth все одно повинен повертати −1 за умовою.',
    invariant:
      'Після вирівнювання u і v мають однакову depth, тому їх LCA лежить на однаковій відстані. Під час спільних стрибків вони залишаються нижче LCA: перехід виконується лише якщо candidates різні. Обробка k від великого до малого greedily наближає обидві вершини максимально високо без перетину.',
    proof:
      'Будь-яке distance розкладається на powers of two, тому lift точний. Якщо після циклу u≠v, для k=0 їх parents вже однакові; інакше цей крок був би виконаний. Жоден нижчий common ancestor неможливий, бо u та v самі різні, а перший спільний parent є найглибшим.',
    costs: [
      ['Preprocessing', 'O(n log n)'],
      ['LCA / kth ancestor', 'O(log n)'],
      ['Пам’ять', 'O(n log n)'],
    ],
    pitfalls: [
      'LOG на один замалий для n power of two.',
      'Не вирівняти depths перед спільними стрибками.',
      'Підняти обидві вершини, коли up[u][k]==up[v][k], і перескочити LCA.',
      'Переплутати depth із weighted distance.',
    ],
    selection:
      'Binary Lifting ідеальне для static tree та ancestor-like queries. Euler Tour + RMQ дає O(1) LCA після іншого preprocessing. Для path aggregate можна додати таблиці min/max/sum, якщо operation композиційна. Для updates на paths частіше потрібен HLD.',
    checks: [
      'u=v, ancestor-descendant і різні гілки.',
      'Root у query.',
      'Tree-chain максимальної depth.',
      'k=0, k=depth[v] та k>depth[v].',
    ],
  }),
  'rerooting-small-to-large': deepTheory({
    mechanics:
      'Rerooting починається bottom-up pass, що рахує інформацію subtree та одну повну відповідь root. Top-down pass передає child інформацію про все поза його subtree або напряму перераховує answer при переході через edge. Small-to-Large розв’язує інший клас: DFS повертає container subtree, і перед merge більший container обирається destination.',
    representation:
      'Для загального rerooting зручно розділити contribution child→parent, associative merge contributions і transform parent aggregate→child. Prefix/suffix merges дітей дозволяють для кожного child виключити його contribution без O(degree²). У small-to-large container ownership треба визначити явно, особливо з pointers або move semantics.',
    invariant:
      'У top-down rerooting answer[v] вже враховує всі n вершин, а formula переходу точно змінює внесок двох груп, розділених edge v−to. У small-to-large destination після кожного merge містить union усіх уже оброблених subtree containers, а кожен перенесений елемент потрапляє у container щонайменше вдвічі більшого розміру.',
    proof:
      'Для distance sums size[to] вершин стають на одиницю ближчими, решта — на одиницю дальшими, що дає n−2·size[to]. Doubling argument обмежує кількість переміщень одного element log n; якщо insert коштує log n, загальна межа часто O(n log² n).',
    costs: [
      ['Простий rerooting', 'O(n)'],
      ['Small-to-large із set', 'O(n log² n) типово'],
      ['Generic prefix/suffix reroot', 'O(n) merges'],
    ],
    pitfalls: [
      'Використати subtree size від неправильного fixed root після переходу.',
      'Запустити другий DFS до завершення bottom-up data.',
      'Переливати великий container у малий.',
      'Очистити container, на який ще посилається parent.',
    ],
    selection:
      'Rerooting потрібен для answer for every root, коли локальний edge transition дешевий. Small-to-Large — для explicit sets/maps піддерев. Euler Tour + offline Fenwick може бути простішим для distinct colors. HLD потрібен для path operations, а Centroid Decomposition — для глобальних distance queries.',
    checks: [
      'Одна вершина та tree-chain.',
      'Star, де root degree великий.',
      'Weighted variant із subtree weight замість size.',
      'Кожен container після merge має очікуваний size на малому дереві.',
    ],
  }),
  combinatorics: deepTheory({
    mechanics:
      'Combinatorial solution починається не з формули, а з atomів вибору. Треба визначити, чи distinct objects, чи важливий order, чи дозволені repetitions. Factorials кодують permutations; ділення на internal orders перетворює їх на combinations. Inclusion–Exclusion працює з bad sets: рахує union порушень через alternating sum intersections.',
    representation:
      'Під modulo prime factorial tables будуються до maximum n серед усіх queries. invFact[n] знаходиться binary exponentiation, решта — recurrence вниз. Для Inclusion–Exclusion subset mask визначає набір одночасно активних умов; intersection count часто залежить від lcm/product, який треба зупинити до overflow.',
    invariant:
      'fact[i] та invFact[i] є взаємно оберненими residues для всіх i<MOD. У Inclusion–Exclusion один об’єкт, що належить рівно t bad sets, отримує coefficient C(t,1)−C(t,2)+…+(−1)^(t+1)C(t,t)=1, а об’єкт поза union — 0.',
    proof:
      'Формула C(n,k) ділить n! orders на k! перестановок вибраних і (n−k)! перестановок невибраних, що представляють ту саму команду. Modular inverse коректний у полі modulo prime. Alternating sum випливає з binomial identity (1−1)^t=0.',
    costs: [
      ['Factorial preprocessing', 'O(N)'],
      ['Один C(n,k)', 'O(1)'],
      ['IE для k умов', 'O(2^k · intersectionCost)'],
    ],
    pitfalls: [
      'Використати inverse через Fermat для composite modulus.',
      'Не повернути 0 для k<0 або k>n.',
      'Забути complement: good=total−bad union.',
      'Переповнити product divisors до порівняння з N.',
    ],
    selection:
      'Closed formula підходить, коли objects симетричні й constraints розкладаються. Counting DP потрібен, коли choices залежать від position/state. Inclusion–Exclusion сильний при малому числі властивостей та простих intersections; для великого k часто потрібна інша structure.',
    checks: [
      'k=0, k=n та n=0.',
      'Modular denominator не дорівнює нулю.',
      'Одна bad set і дві sets із повним overlap.',
      'IE signs перевірені вручну для mask sizes 1,2,3.',
    ],
  }),
  'expected-value-probability': deepTheory({
    mechanics:
      'Випадкова величина X описує числовий результат experiment. Якщо X є count, її часто можна подати як суму indicators Xi. Для кожного локального object/event обчислюється лише probability Xi=1, а потім probabilities додаються. Це прибирає необхідність описувати joint distribution усіх events.',
    representation:
      'Probability зберігається long double або modulo field залежно від задачі. Для real output потрібно fixed/setprecision і оцінка accumulated error. Незалежність — властивість спільного розподілу, а не синонім випадковості. Conditional probability та law of total expectation допомагають, коли event розгалужується за першим кроком.',
    invariant:
      'Linearity E[ΣXi]=ΣE[Xi] випливає без independence зі скінченних сум: кожен world додає суму local values, а перестановка порядку сумування не змінює total. Для indicator E[Xi]=0·P(0)+1·P(1)=P(Xi=1).',
    proof:
      'У pair problem кожна активна unordered pair додає рівно одиницю до X, тому indicators не пропускають і не дублюють внески. Незалежність окремих activations дозволяє P(i і j)=pi·pj. Prefix aggregation додає добуток для кожної пари рівно коли читається її більший індекс.',
    costs: [
      ['Indicator sum', 'часто O(number of local objects)'],
      ['Pair aggregation', 'O(n), якщо factorization можлива'],
      ['Expectation DP', 'O(number of states × transitions)'],
    ],
    pitfalls: [
      'Множити probabilities залежних events.',
      'Вважати E[f(X)]=f(E[X]) для nonlinear f.',
      'Плутати expected value з most probable outcome.',
      'Не перевірити, чи expected stopping time скінченний.',
    ],
    selection:
      'Indicators ідеальні для counts edges, inversions, fixed points, covered positions. Для probability exact event потрібні DP/combinatorics або complement. Для expected steps Markov-like process веде до linear equations чи DP; self-loop coefficient потрібно перенести алгебраїчно.',
    checks: [
      'Probabilities 0 і 1.',
      'n=1 для pair count.',
      'Малий experiment повністю перебраний для перевірки formula.',
      'Output precision має кілька запасних digits.',
    ],
  }),
  'advanced-number-theory': deepTheory({
    mechanics:
      'Extended Euclid рекурсивно відновлює coefficients x,y з ax+by=gcd(a,b). Після масштабування він розв’язує Diophantine equation, а modulo m дає inverse, коли gcd(a,m)=1. CRT поєднує congruences через таке саме рівняння. Matrix Exponentiation представляє fixed linear transition matrix M і застосовує binary power.',
    representation:
      'Для recurrence order k state містить k послідовних values, а companion matrix зсуває їх і рахує новий перший елемент. Identity matrix представляє нуль transitions. Порядок vectors — column або row — треба обрати один раз; він визначає, чи множимо M·state і як читаємо answer.',
    invariant:
      'Binary exponentiation підтримує result·base^remaining=M^original. Для встановленого біта base переноситься в result, після чого base квадратується, а remaining ділиться на два. У Extended Euclid substitution з рекурсивного рівня зберігає ту саму лінійну комбінацію gcd.',
    proof:
      'Композиція linear maps відповідає matrix multiplication, тому n однакових transitions є M^n. Binary decomposition представляє n як суму powers of two. Diophantine equation має розв’язок лише якщо gcd ділить c, бо всі ax+by кратні gcd; Bezout identity показує достатність після масштабування.',
    costs: [
      ['Extended Euclid', 'O(log min(a,b))'],
      ['2×2 matrix power', 'O(log n)'],
      ['k×k matrix power', 'O(k³ log n)'],
    ],
    pitfalls: [
      'Переставити порядок matrix multiplication.',
      'Забути identity для exponent 0.',
      'Шукати inverse, коли gcd≠1.',
      'Не перевірити generalized CRT compatibility.',
    ],
    selection:
      'Matrix power підходить для fixed linear recurrence і малює direct bridge від DP до algebra. Для дуже великого k кубічний множник поганий; існують polynomial methods. CRT потрібен для simultaneous residues. Gaussian Elimination працює з general linear system, але потребує поля або спеціальної обробки.',
    checks: [
      'n=0 і n=1 для recurrence.',
      'MOD=2 та coefficients біля MOD.',
      'Equation c=0, negative coefficients і gcd sign.',
      'CRT із сумісними та несумісними non-coprime moduli.',
    ],
  }),
};
