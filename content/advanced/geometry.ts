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

export const geometryPatterns = [
  pattern({
    id: 'points-vectors-cross',
    chapterId: 'ch-19',
    title: 'Точки, вектори та Cross Product',
    description:
      'Перекладаємо положення трьох точок на знак цілочисельного визначника без кутів і похибки floating point.',
    intuition: [
      p(
        'Вектори B−A і C−A мають орієнтовану площу. Її знак одразу показує лівий поворот, правий поворот або collinearity.',
      ),
      visual('orientation'),
    ],
    modeling: [
      table(
        ['cross(B−A,C−A)', 'Геометричне значення'],
        [
          ['> 0', 'C ліворуч від напрямленої AB'],
          ['< 0', 'C праворуч від AB'],
          ['= 0', 'A, B, C лежать на одній прямій'],
        ],
      ),
      note(
        'Потрібен лише знак',
        'Не обчислюй atan, кут або нормалізовані вектори, якщо умова питає тільки orientation.',
      ),
    ],
    priorKnowledge: [
      'Foundation → long long та overflow',
      'Core → comparator',
      'Combination → алгебраїчна модель',
    ],
    recognitionSigns: [
      'Потрібно визначити сторону від напрямленої прямої.',
      'Умова містить поворот, collinearity або орієнтацію polygon.',
      'Потрібна подвоєна площа без square root.',
    ],
    constraintSignals: [
      '|coordinate| до 10⁹ робить добуток порядку 10¹⁸.',
      'Для різниць до 2·10⁹ long long близький до межі; інколи потрібен __int128.',
      'Integer coordinates дозволяють точні знакові перевірки.',
    ],
    notApplicableSigns: [
      'Потрібна фактична евклідова відстань — знадобиться sqrt і double.',
      'Координати дробові й гарантованої epsilon-policy немає.',
      'Одного orientation недостатньо для належності точці відрізку.',
    ],
    knowledge: [
      p(
        'Point описує положення, а vector — різницю двох точок. Dot product відповідає за проєкцію й кут, cross product — за orientation та орієнтовану площу.',
      ),
      visual('orientation'),
      note(
        'Порядок аргументів',
        'cross(A,B,C) змінює знак, якщо поміняти B і C. Напрям AB є частиною питання.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'struct Point { long long x, y; };',
          '',
          '__int128 cross(Point a, Point b, Point c) {',
          '    return (__int128)(b.x - a.x) * (c.y - a.y)',
          '         - (__int128)(b.y - a.y) * (c.x - a.x);',
          '}',
        ),
        'Точний cross для великих координат',
      ),
    ],
    theory: [
      p(
        'Абсолютне значення cross(B−A,C−A) дорівнює подвоєній площі трикутника ABC. Знак додає інформацію про напрям обходу.',
      ),
      note(
        'Degenerate cases',
        'A=B дає нульовий напрям і cross=0 для будь-якої C; умова повинна визначати, чи такий випадок можливий.',
      ),
    ],
    extensions: [
      {
        title: 'Dot Product, polygon area і polar order',
        blocks: [
          p(
            'Dot product допомагає перевіряти гостроту кута та проєкцію. Shoelace formula складає cross сусідніх вершин і дає подвоєну площу polygon.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'intersections-conditions',
    chapterId: 'ch-19',
    title: 'Segment Intersections',
    description:
      'Поєднуємо чотири orientation-перевірки з точним boundary handling для замкнених відрізків.',
    intuition: [
      p(
        'У загальному випадку кінці кожного відрізка лежать по різні боки прямої іншого. Collinear cases потребують окремої перевірки bounding box.',
      ),
      visual('segment-intersection'),
    ],
    modeling: [
      table(
        ['Випадок', 'Перевірка'],
        [
          ['strict crossing', 'orientation мають протилежні знаки'],
          ['кінець на відрізку', 'cross=0 і координати всередині bounds'],
          ['collinear overlap', 'перетинаються проєкції на x та y'],
          ['спільна вершина', 'YES для замкнених відрізків'],
        ],
      ),
    ],
    priorKnowledge: [
      'Advanced → orientation',
      'Foundation → min/max',
      'Core → систематичні edge cases',
    ],
    recognitionSigns: [
      'Потрібно перевірити перетин двох відрізків.',
      'Є collinear, touching або overlap cases.',
      'Відповідь — булева геометрична умова.',
    ],
    constraintSignals: [
      'Цілі координати дозволяють exact arithmetic.',
      'Багато незалежних пар дають O(q) перевірок.',
      'Усі пари серед n segments потребують O(n²) і можуть вимагати Sweep Line.',
    ],
    notApplicableSigns: [
      'Потрібно знайти всі перетини великої множини відрізків.',
      'Потрібна точна координата intersection, а не YES/NO.',
      'Об’єкти є нескінченними прямими або променями з іншими boundary rules.',
    ],
    knowledge: [
      p(
        'Функція onSegment(a,b,p) має перевірити одночасно collinearity та належність обом координатним проєкціям. Одного bounding box недостатньо.',
      ),
      visual('segment-intersection'),
      note(
        'Замкнені межі',
        'Для замкнених segments використовуй <=. Якщо дотик не вважається перетином, модель і нерівності змінюються.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'bool onSegment(Point a, Point b, Point p) {',
          '    return cross(a, b, p) == 0',
          '        && min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x)',
          '        && min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);',
          '}',
        ),
        'Точка на замкненому відрізку',
      ),
    ],
    theory: [
      p(
        'Strict crossing визначається добутками знаків o1·o2<0 та o3·o4<0. Щоб не множити потенційно великі значення, безпечніше порівнювати їх знаки.',
      ),
      note(
        'Geometry checklist',
        'Окремо перевір спільний кінець, point segment, повне вкладення, часткове overlap і паралельні різні прямі.',
      ),
    ],
    extensions: [
      {
        title: 'Відстань до прямої та Sweep Line',
        blocks: [
          p(
            'Відстань використовує |cross|/|AB| і double. Для всіх перетинів серед багатьох segments події сортують за x — це Sweep Line preview.',
          ),
        ],
      },
    ],
  }),
  pattern({
    id: 'convex-hull',
    chapterId: 'ch-19',
    title: 'Convex Hull',
    description:
      'Сортуємо точки та stack-подібно видаляємо повороти, які не можуть належати boundary опуклої оболонки.',
    intuition: [
      p(
        'Гумка навколо точок торкається лише зовнішніх. Після сортування нижню й верхню boundary можна будувати послідовно.',
      ),
      visual('convex-hull'),
    ],
    modeling: [
      table(
        ['Рішення про collinear points', 'Умова pop'],
        [
          ['лишити лише крайні', 'cross <= 0 для lower hull'],
          [
            'лишити всі boundary points',
            'cross < 0, але потрібна обробка дублікатів',
          ],
        ],
      ),
      note(
        'Політика є частиною задачі',
        'Різні правильні реалізації можуть повертати різний hull на collinear boundary.',
      ),
    ],
    priorKnowledge: [
      'Core → sorting',
      'Core → monotonic stack',
      'Advanced → cross product',
    ],
    recognitionSigns: [
      'Потрібна найменша convex boundary для множини точок.',
      'Подальша задача працює лише з крайніми точками.',
      'Згадано огорожу, зовнішній контур або extreme points.',
    ],
    constraintSignals: [
      'n до 2·10⁵ підказує O(n log n).',
      'Сортування домінує; побудова hull після нього O(n).',
      'Дублікати потрібно видалити до побудови.',
    ],
    notApplicableSigns: [
      'Потрібен boundary довільного неопуклого polygon.',
      'Точки додаються онлайн і hull треба підтримувати динамічно.',
      'Усі внутрішні точки впливають на відповідь, а не лише extreme points.',
    ],
    knowledge: [
      p(
        'Monotonic Chain будує lower та upper hull. Поки три останні точки роблять заборонений поворот, середня видаляється: новий chord лежить не гірше для convex boundary.',
      ),
      visual('convex-hull'),
      note(
        'Degenerate input',
        'Після unique можуть лишитися 0, 1 або 2 точки; поверни їх без загального циклу.',
      ),
    ],
    cppNotes: [
      code(
        lines(
          'vector<Point> hull;',
          'for (Point p : points) {',
          '    while (hull.size() >= 2',
          '        && cross(hull[hull.size()-2], hull.back(), p) <= 0)',
          '        hull.pop_back();',
          '    hull.push_back(p);',
          '}',
        ),
        'Одна половина Monotonic Chain',
      ),
    ],
    theory: [
      p(
        'Кожна точка додається один раз і видаляється не більше одного разу в кожній половині. Після sorting це O(n), як у monotonic stack.',
      ),
      note(
        'Порядок результату',
        'Стандартна побудова повертає вершини cyclic order без повторення першої точки. Це зручно для perimeter та area.',
      ),
    ],
    extensions: [
      {
        title: 'Point in convex polygon і Rotating Calipers',
        blocks: [
          p(
            'У convex polygon належність можна перевіряти за O(log n) через сектор і binary search. Diameter hull знаходять rotating calipers за O(h).',
          ),
        ],
      },
    ],
  }),
];

export const geometryTasks = [
  learning('points-vectors-cross', {
    id: 'left-or-right',
    title: 'Ліворуч чи праворуч',
    statement: [
      'Дано три цілі точки A, B, C. Визнач положення C відносно напрямленої прямої AB.',
    ],
    input: 'Шість координат xA yA xB yB xC yC.',
    output: 'LEFT, RIGHT або COLLINEAR.',
    constraints: ['|coordinate| ≤ 10⁹', 'A ≠ B'],
    examples: [example('0 0 4 0 2 3', 'LEFT')],
    tryYourself:
      'Яка алгебраїчна величина змінює знак разом із напрямом повороту?',
    hint: 'Обчисли cross(B−A,C−A).',
    firstApproach: [p('Обчислити кути через atan2 і порівняти їх як double.')],
    approachReview:
      'Кути додають зайві функції, нормалізацію та похибку; потрібен лише знак.',
    observation: [
      p('Знак орієнтованої площі повністю визначає сторону.'),
      visual('orientation'),
    ],
    algorithm: [
      'Обчисли cross у __int128.',
      'Порівняй із нулем.',
      'Виведи відповідний напрям.',
    ],
    proof:
      'Determinant двох векторів додатний для повороту проти годинникової стрілки, від’ємний для повороту за нею і нульовий саме для лінійно залежних векторів.',
    complexity: 'O(1) часу й пам’яті.',
    solution: cpp(
      lines(
        '    long long ax,ay,bx,by,cx,cy;',
        '    cin>>ax>>ay>>bx>>by>>cx>>cy;',
        '    __int128 value=(__int128)(bx-ax)*(cy-ay)',
        '                  -(__int128)(by-ay)*(cx-ax);',
        '    if(value>0) cout<<"LEFT\\n";',
        '    else if(value<0) cout<<"RIGHT\\n";',
        '    else cout<<"COLLINEAR\\n";',
      ),
    ),
    takeaway:
      'Orientation — це знак cross; integer arithmetic дає точну відповідь без кутів.',
  }),
  practice('points-vectors-cross', {
    id: 'collinear-points',
    title: 'Точки на одній прямій',
    statement: ['Для кожної трійки визнач, чи точки collinear.'],
    input: 'q та q трійок точок.',
    output: 'YES/NO для кожної.',
    constraints: ['q ≤ 200000', '|coordinate| ≤ 10⁹'],
    examples: [example('1\\n0 0 1 1 2 2', 'YES')],
    hint: 'cross(A,B,C)=0.',
  }),
  practice('points-vectors-cross', {
    id: 'polygon-orientation',
    title: 'Орієнтація полігона',
    statement: [
      'Вершини простого polygon подані в порядку обходу. Визнач CLOCKWISE або COUNTERCLOCKWISE.',
    ],
    input: 'n і n точок.',
    output: 'Напрям обходу.',
    constraints: ['3 ≤ n ≤ 200000', '|coordinate| ≤ 10⁹'],
    examples: [example('4\\n0 0\\n2 0\\n2 2\\n0 2', 'COUNTERCLOCKWISE')],
    hint: 'Знак суми cross(pi,p(i+1)) — signed doubled area.',
  }),
  practice('points-vectors-cross', {
    id: 'triangle-double-area',
    title: 'Площа трикутника ×2',
    statement: ['Виведи подвоєну площу трикутника з цілими координатами.'],
    input: 'Три точки.',
    output: 'Невід’ємне ціле число.',
    constraints: ['|coordinate| ≤ 10⁹'],
    examples: [example('0 0 4 0 0 3', '12')],
    hint: 'Візьми absolute value cross(A,B,C).',
  }),

  learning('intersections-conditions', {
    id: 'crossroads',
    title: 'Перехрестя',
    statement: [
      'Дано два замкнені відрізки AB і CD з цілими координатами. Перевір, чи мають вони хоча б одну спільну точку.',
    ],
    input: 'Вісім координат A, B, C, D.',
    output: 'YES або NO.',
    constraints: [
      '|coordinate| ≤ 10⁹',
      'Кінці одного відрізка можуть збігатися',
    ],
    examples: [example('0 0 4 4 0 4 4 0', 'YES')],
    tryYourself:
      'Які чотири orientation потрібні та що робити, якщо одна дорівнює нулю?',
    hint: 'General crossing плюс чотири onSegment checks.',
    firstApproach: [
      p('Знайти рівняння двох прямих у double та координату їх перетину.'),
    ],
    approachReview:
      'Паралельні й collinear прямі, point segments та похибка роблять таку модель крихкою.',
    observation: [
      p(
        'Для strict case кінці кожного segment лежать по різні боки іншого; нульові orientation обробляє onSegment.',
      ),
      visual('segment-intersection'),
    ],
    algorithm: [
      'Обчисли o1=cross(A,B,C), o2=cross(A,B,D), o3=cross(C,D,A), o4=cross(C,D,B).',
      'Перевір strict opposite signs.',
      'Для кожного oi=0 перевір відповідну точку через onSegment.',
      'Інакше відповідай NO.',
    ],
    proof:
      'Для неколінеарного перетину неперервний segment AB переходить з одного боку CD на інший і навпаки. У вироджених випадках спільна точка є кінцем, що лежить на іншому segment; усі такі випадки явно перевірені.',
    complexity: 'O(1) часу й пам’яті.',
    solution: cpp(
      lines(
        '    struct P{long long x,y;};',
        '    auto cross=[](P a,P b,P c){return (__int128)(b.x-a.x)*(c.y-a.y)-(__int128)(b.y-a.y)*(c.x-a.x);};',
        '    auto on=[&](P a,P b,P p){return cross(a,b,p)==0 && min(a.x,b.x)<=p.x && p.x<=max(a.x,b.x) && min(a.y,b.y)<=p.y && p.y<=max(a.y,b.y);};',
        '    P a,b,c,d; cin>>a.x>>a.y>>b.x>>b.y>>c.x>>c.y>>d.x>>d.y;',
        '    auto o1=cross(a,b,c),o2=cross(a,b,d),o3=cross(c,d,a),o4=cross(c,d,b);',
        '    auto opposite=[](__int128 x,__int128 y){return (x<0&&y>0)||(x>0&&y<0);};',
        '    bool ok=(opposite(o1,o2)&&opposite(o3,o4)) || on(a,b,c) || on(a,b,d) || on(c,d,a) || on(c,d,b);',
        '    cout<<(ok?"YES":"NO")<<"\\n";',
      ),
    ),
    takeaway:
      'Коректна geometry складається з основної формули та повного boundary handling.',
  }),
  practice('intersections-conditions', {
    id: 'point-on-segment',
    title: 'Точка на відрізку',
    statement: ['Для кожного запиту перевір, чи P належить замкненому AB.'],
    input: 'q і q наборів A B P.',
    output: 'YES/NO.',
    constraints: ['q ≤ 200000', '|coordinate| ≤ 10⁹'],
    examples: [example('1\\n0 0 4 0 2 0', 'YES')],
    hint: 'Потрібні і cross=0, і bounds по x/y.',
  }),
  practice('intersections-conditions', {
    id: 'road-intersections',
    title: 'Перетини доріг',
    statement: [
      'Одна нова дорога є segment AB. Порахуй, скільки з m наявних замкнених segments вона перетинає.',
    ],
    input: 'A, B, m і m segments.',
    output: 'Кількість перетинів.',
    constraints: ['m ≤ 200000', '|coordinate| ≤ 10⁹'],
    examples: [example('0 0 4 0 2\\n2 -1 2 1\\n5 0 6 0', '1')],
    hint: 'Застосуй exact segment intersection до кожної дороги.',
  }),
  practice('intersections-conditions', {
    id: 'distance-to-segment',
    title: 'Відстань до відрізка',
    statement: [
      'Знайди евклідову відстань від точки P до segment AB з похибкою 1e−9.',
    ],
    input: 'Точки A, B, P.',
    output: 'Відстань.',
    constraints: ['|coordinate| ≤ 10⁶'],
    examples: [example('0 0 4 0 2 3', '3.0000000000')],
    hint: 'Проєкція через dot product визначає: A, B або внутрішня точка segment.',
  }),

  learning('convex-hull', {
    id: 'fence',
    title: 'Огорожа',
    statement: [
      'Дано n точок дерев. Виведи вершини strict convex hull проти годинникової стрілки, починаючи з лексикографічно найменшої. Collinear точки всередині сторони не виводь.',
    ],
    input: 'n і n цілих точок.',
    output: 'Кількість h та h вершин hull.',
    constraints: ['1 ≤ n ≤ 200000', '|coordinate| ≤ 10⁹'],
    examples: [
      example('5\\n0 0\\n2 0\\n2 2\\n0 2\\n1 1', '4\\n0 0\\n2 0\\n2 2\\n0 2'),
    ],
    tryYourself:
      'Після сортування яка з трьох останніх точок стає зайвою при неправильному повороті?',
    hint: 'Побудуй lower та upper chains умовою cross<=0.',
    firstApproach: [
      p(
        'Для кожної пари точок перевірити, чи всі інші лежать з одного боку прямої.',
      ),
    ],
    approachReview: 'O(n³) або O(n²) після оптимізацій не проходить для 2·10⁵.',
    observation: [
      p(
        'Після sorting boundary будується послідовно; неправильний поворот виключає середню точку з strict hull.',
      ),
      visual('convex-hull'),
    ],
    algorithm: [
      'Відсортуй та видали дублікати.',
      'Побудуй lower chain, видаляючи cross<=0.',
      'Аналогічно побудуй upper у зворотному порядку.',
      'Прибери повторені кінці й об’єднай.',
    ],
    proof:
      'Після кожного кроку chain є convex boundary оброблених точок. Якщо останні три роблять не лівий поворот, середня лежить на або всередині chord між сусідами й не може бути strict extreme point. Інші точки не видаляються, отже lower та upper разом дають весь hull.',
    complexity: 'O(n log n) часу через sorting і O(n) пам’яті.',
    solution: cpp(
      lines(
        '    struct P{long long x,y; bool operator<(const P&o)const{return tie(x,y)<tie(o.x,o.y);} bool operator==(const P&o)const{return x==o.x&&y==o.y;}};',
        '    auto cross=[](P a,P b,P c){return (__int128)(b.x-a.x)*(c.y-a.y)-(__int128)(b.y-a.y)*(c.x-a.x);};',
        '    int n;cin>>n;vector<P>a(n);for(auto&p:a)cin>>p.x>>p.y;',
        '    sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());',
        '    if(a.size()<=2){cout<<a.size()<<"\\n";for(auto p:a)cout<<p.x<<" "<<p.y<<"\\n";return 0;}',
        '    vector<P> lower,upper;',
        '    for(P p:a){while(lower.size()>=2&&cross(lower[lower.size()-2],lower.back(),p)<=0)lower.pop_back();lower.push_back(p);}',
        '    for(int i=int(a.size())-1;i>=0;--i){P p=a[i];while(upper.size()>=2&&cross(upper[upper.size()-2],upper.back(),p)<=0)upper.pop_back();upper.push_back(p);}',
        '    lower.pop_back();upper.pop_back();lower.insert(lower.end(),upper.begin(),upper.end());',
        '    cout<<lower.size()<<"\\n";for(P p:lower)cout<<p.x<<" "<<p.y<<"\\n";',
      ),
    ),
    takeaway:
      'Convex Hull = sorting + exact orientation + amortized stack-like removal.',
  }),
  practice('convex-hull', {
    id: 'hull-perimeter',
    title: 'Периметр Hull',
    statement: ['Знайди периметр convex hull множини точок.'],
    input: 'n і точки.',
    output: 'Периметр з похибкою 1e−9.',
    constraints: ['1 ≤ n ≤ 200000', '|coordinate| ≤ 10⁹'],
    examples: [example('4\\n0 0\\n3 0\\n3 4\\n0 4', '14.0000000000')],
    hint: 'Побудуй hull, потім склади hypot для cyclic сусідів.',
  }),
  practice('convex-hull', {
    id: 'point-in-convex',
    title: 'Точки всередині опуклого многокутника',
    statement: [
      'Дано strict convex polygon CCW і q точок. Для кожної визнач INSIDE, BORDER або OUTSIDE.',
    ],
    input: 'n, polygon, q і точки.',
    output: 'Класифікація.',
    constraints: ['n,q ≤ 200000'],
    examples: [
      example('4\\n0 0\\n4 0\\n4 4\\n0 4\\n2\\n2 2\\n5 2', 'INSIDE\\nOUTSIDE'),
    ],
    hint: 'Відсічи сектор біля p0, binary search triangle і перевір три orientation.',
  }),
  practice('convex-hull', {
    id: 'point-set-diameter',
    title: 'Diameter of point set',
    statement: [
      'Знайди максимальний квадрат відстані між двома даними точками.',
    ],
    input: 'n і точки.',
    output: 'Максимальна squared distance.',
    constraints: ['n ≤ 200000', '|coordinate| ≤ 10⁹'],
    examples: [example('3\\n0 0\\n3 0\\n0 4', '25')],
    hint: 'Внутрішні точки не потрібні: hull + rotating calipers.',
  }),
];
