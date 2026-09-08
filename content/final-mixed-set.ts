export type FinalMixedProblem = {
  id: string;
  title: string;
  statement: string;
  input: string;
  output: string;
  constraints: string[];
};

export const finalMixedSet: FinalMixedProblem[] = [
  {
    id: 'expedition-pass',
    title: 'Експедиційний пропуск',
    statement:
      'У directed weighted graph потрібно дістатися з 1 до n. Не більше одного разу можна використати пропуск і пройти вибране ребро за половину його ціни з округленням униз. Знайди мінімальну вартість маршруту.',
    input: 'n, m, потім m ребер u v w.',
    output: 'Мінімальна вартість або −1, якщо маршруту немає.',
    constraints: ['2 ≤ n ≤ 2·10⁵', 'm ≤ 3·10⁵', '0 ≤ w ≤ 10⁹'],
  },
  {
    id: 'laboratory-teams',
    title: 'Лабораторні команди',
    statement:
      'Є студенти, лабораторії та список сумісностей. Кожна лабораторія має власний ліміт місць, а один студент може потрапити не більше ніж в одну лабораторію. Максимізуй кількість призначених студентів.',
    input:
      'Кількості студентів і лабораторій, capacities лабораторій та список допустимих пар.',
    output: 'Максимальна кількість коректно призначених студентів.',
    constraints: ['до 500 студентів', 'до 500 лабораторій', 'до 10⁴ зв’язків'],
  },
  {
    id: 'dependent-modules',
    title: 'Залежні модулі',
    statement:
      'Кожен програмний модуль має прибуток або вартість підтримки. Якщо взяти модуль A, потрібно взяти всі модулі, від яких він залежить. Вибери набір із максимальною сумарною цінністю.',
    input: 'n, values модулів і directed dependencies.',
    output: 'Максимальна сумарна цінність.',
    constraints: ['n ≤ 700', 'dependencies ≤ 10⁴', '|value| ≤ 10⁹'],
  },
  {
    id: 'archive-partition',
    title: 'Архів вимірювань',
    statement:
      'Послідовність невід’ємних вимірювань треба розбити на рівно k непорожніх contiguous blocks. Вартість блока дорівнює квадрату суми його елементів. Знайди мінімальну загальну вартість.',
    input: 'n, k і масив вимірювань.',
    output: 'Мінімальна вартість.',
    constraints: ['n ≤ 5·10⁴', 'k ≤ 30'],
  },
  {
    id: 'adaptive-tariffs',
    title: 'Адаптивні тарифи',
    statement:
      'Потрібно обробити online-операції: додати тариф f(x)=ax+b, активний лише на integer interval [l,r], або запитати мінімальну ціну в точці x.',
    input: 'q операцій ADD a b l r або QUERY x.',
    output: 'Відповідь на кожний QUERY або EMPTY.',
    constraints: ['q ≤ 2·10⁵', '|a|,|b|,|x| ≤ 10⁹'],
  },
  {
    id: 'several-boards',
    title: 'Кілька дощок',
    statement:
      'Є кілька незалежних DAG-дощок із фішками. Хід переміщує одну фішку ребром; деякі ходи розщеплюють її на дві фішки в указаних вершинах. Хто не має ходу, програє. Визнач переможця.',
    input: 'Опис DAG, splitting moves і стартових фішок.',
    output: 'FIRST або SECOND.',
    constraints: ['сума vertices і edges ≤ 2·10⁵'],
  },
  {
    id: 'changing-alliance',
    title: 'Мінливий альянс',
    statement:
      'Спочатку graph порожній. Далі виконуються ADD edge, REMOVE edge та ASK u v. Усі операції відомі наперед; виведи, чи connected u та v у момент кожного ASK.',
    input: 'n, q і список операцій.',
    output: 'YES або NO для кожного запиту.',
    constraints: ['n,q ≤ 2·10⁵'],
  },
  {
    id: 'colored-tree-routes',
    title: 'Маршрутні дільники',
    statement:
      'Вершини tree мають цілі значення. Підтримуй point update та запит найбільшого спільного дільника всіх значень на path u→v.',
    input: 'Tree, початкові values і q operations.',
    output: 'Відповідь на кожний path query.',
    constraints: ['n,q ≤ 10⁵', 'colors ≤ 10⁵'],
  },
  {
    id: 'signal-radius',
    title: 'Радіус сигналу',
    statement:
      'На прямій дано координати користувачів. Можна поставити не більше k станцій у довільних real positions. Знайди мінімальний integer радіус, за якого кожен користувач покритий хоча б однією станцією.',
    input: 'n, k і координати користувачів.',
    output: 'Мінімальний integer радіус.',
    constraints: ['n ≤ 2·10⁵', 'k ≤ n', '|coordinate| ≤ 10⁹'],
  },
  {
    id: 'compressed-history',
    title: 'Стиснена історія',
    statement:
      'Дано рядок і q запитів. Запит додає символ у кінець однієї з версій або питає найдовший спільний prefix двох версій. Усі версії зберігаються.',
    input: 'Початковий рядок і дерево q version operations.',
    output: 'Довжина LCP для кожного запиту.',
    constraints: ['загальна довжина доданих символів ≤ 2·10⁵'],
  },
];
