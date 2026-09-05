import {
  BruteForceVisual,
  ComplexityScaleVisual,
  HypothesisLoopVisual,
  StoryToModelVisual,
  StlToolboxVisual,
} from '@/components/content/intro-lesson-visuals';
import {
  CodeBlock,
  Formula,
  InlineCode,
  LessonCallout,
  LessonList,
  LessonQuote,
  LessonSection,
  LessonTable,
  LessonText,
  NumberedSteps,
  Remember,
} from '@/components/content/lesson-ui';
import { SelfCheck } from '@/components/content/self-check';

interface SectionLink {
  id: string;
  title: string;
}

const sectionLinks: Record<string, SectionLink[]> = {
  'ch-01': [
    { id: 'goal', title: 'Знайди ціль' },
    { id: 'model', title: 'Відкинь сюжет' },
    { id: 'constraints', title: 'Випиши обмеження' },
    { id: 'small-example', title: 'Маленький приклад' },
    { id: 'before-code', title: '6 питань перед кодом' },
  ],
  'ch-02': [
    { id: 'complexity-classes', title: 'Класи складності' },
    { id: 'complexity-map', title: 'Орієнтовна карта' },
    { id: 'all-parameters', title: 'Усі параметри' },
    { id: 'test-cases', title: 'T тестів та sum(n)' },
    { id: 'memory', title: 'Пам’ять' },
    { id: 'complexity-example', title: 'Приклад' },
  ],
  'ch-03': [
    { id: 'simple-solution', title: 'Просте рішення' },
    { id: 'wasted-work', title: 'Зайва робота' },
    { id: 'optimization-tools', title: 'Способи оптимізації' },
    { id: 'representation', title: 'Нове представлення' },
    { id: 'subtasks', title: 'Підзадачі' },
  ],
  'ch-04': [
    { id: 'properties', title: 'Властивості задачі' },
    { id: 'signals', title: 'Типові сигнали' },
    { id: 'context', title: 'Контекст патерну' },
    { id: 'verify', title: 'Перевірка гіпотези' },
    { id: 'counterexample', title: 'Контрприклади' },
    { id: 'verdicts', title: 'WA / TLE / MLE / RE' },
  ],
  'ch-05': [
    { id: 'cpp-template', title: 'Базовий шаблон' },
    { id: 'number-types', title: 'Числові типи' },
    { id: 'sequences', title: 'Vector і sorting' },
    { id: 'search-containers', title: 'Пошук і словники' },
    { id: 'queues', title: 'Черги' },
    { id: 'choose-container', title: 'Вибір контейнера' },
  ],
};

export function getIntroductionSectionLinks(chapterId: string) {
  return sectionLinks[chapterId] ?? [];
}

export function IntroductionLesson({ chapterId }: { chapterId: string }) {
  if (chapterId === 'ch-01') return <ReadingProblemLesson />;
  if (chapterId === 'ch-02') return <ComplexityLesson />;
  if (chapterId === 'ch-03') return <BruteForceLesson />;
  if (chapterId === 'ch-04') return <PatternRecognitionLesson />;
  if (chapterId === 'ch-05') return <CppStlLesson />;
  return null;
}

function ReadingProblemLesson() {
  return (
    <>
      <LessonSection id="goal" eyebrow="Крок 01" title="Спочатку знайди ціль">
        <LessonText>
          Олімпіадна задача майже ніколи не говорить прямо, який алгоритм потрібно використати.
          Умова описує ситуацію, а наше завдання — перетворити її на формальну модель.
        </LessonText>
        <LessonText>
          Головна помилка на початку — одразу відкривати редактор. Спочатку одним реченням
          сформулюй, <strong className="text-foreground">що саме потрібно знайти</strong>.
        </LessonText>
        <LessonQuote>Що саме має повернути мій алгоритм?</LessonQuote>
        <LessonList
          items={[
            'мінімальне або максимальне значення;',
            'кількість способів чи факт існування рішення;',
            'найдовший відрізок або найкоротший шлях;',
            'будь-яку конструкцію, що задовольняє умову.',
          ]}
        />
        <LessonCallout title="Порівняй формулювання">
          «Дано міста, між якими курсують автобуси» ще майже нічого не говорить. А «знайти
          мінімальну кількість переїздів між двома містами» вже вказує на тип відповіді та
          підказує модель найкоротшого шляху.
        </LessonCallout>
      </LessonSection>

      <LessonSection id="model" eyebrow="Крок 02" title="Відкинь сюжет">
        <LessonText>
          Назви об’єктів часто не мають значення. Студенти можуть стати вершинами, дружні
          зв’язки — ребрами, а передавання повідомлення — шляхом у графі.
        </LessonText>
        <StoryToModelVisual />
        <LessonQuote>
          Перепиши умову мовою масивів, множин, графів, відрізків, станів або формул.
        </LessonQuote>
        <LessonText>
          Після такого перекладу фраза «чи може студент A передати повідомлення студенту B»
          перетворюється на точне запитання: «чи існує шлях між двома вершинами?» Тепер уже
          природно перевірити DFS або BFS.
        </LessonText>
        <LessonCallout title="Preview наступних глав">
          DFS і BFS вивчатимемо в главі про графи. Зараз не потрібно знати ці алгоритми
          чи відтворювати код нижче: важливий лише перехід від історії до моделі
          «об’єкти та зв’язки». Реалізацію можна пропустити.
        </LessonCallout>
        <CodeBlock
          caption="Preview: BFS — зараз знати реалізацію не потрібно"
          code={`bool canReach(int start, int finish,
              const vector<vector<int>>& graph) {
    queue<int> q;
    vector<bool> used(graph.size(), false);

    q.push(start);
    used[start] = true;

    while (!q.empty()) {
        int vertex = q.front();
        q.pop();

        if (vertex == finish) return true;

        for (int next : graph[vertex]) {
            if (!used[next]) {
                used[next] = true;
                q.push(next);
            }
        }
    }

    return false;
}`}
        />
      </LessonSection>

      <LessonSection id="constraints" eyebrow="Крок 03" title="Випиши обмеження">
        <LessonText>
          Не ігноруй блок constraints. Два однакові сюжети з різними межами можуть вимагати
          зовсім різних алгоритмів.
        </LessonText>
        <div className="grid gap-3 sm:grid-cols-2">
          <Formula label="малий вхід">n ≤ 20</Formula>
          <Formula label="великий вхід">n ≤ 200 000</Formula>
        </div>
        <LessonText>
          У першому випадку можна перевіряти підмножини. У другому навіть перебір усіх пар,
          найімовірніше, буде надто повільним. Обмеження часто є найбільшою підказкою автора.
        </LessonText>
      </LessonSection>

      <LessonSection id="small-example" eyebrow="Крок 04" title="Розбери маленький приклад вручну">
        <LessonText>
          Не обмежуйся готовим sample. Створи власні випадки для <InlineCode>n = 1</InlineCode>,{' '}
          <InlineCode>n = 2</InlineCode> і <InlineCode>n = 3</InlineCode>, а потім пройди весь
          процес руками.
        </LessonText>
        <CodeBlock
          language="Тестові дані"
          caption="Мінімальний набір перевірок"
          code={`n = 1   // найменший можливий випадок
n = 2   // перша взаємодія між елементами
n = 3   // найменший випадок, де видно структуру`}
        />
        <LessonList
          items={[
            'закономірність або інваріант;',
            'повторні чи зайві обчислення;',
            'монотонність відповіді;',
            'можливий стан для dynamic programming.',
          ]}
        />
      </LessonSection>

      <LessonSection id="before-code" eyebrow="Крок 05" title="Перед кодом відповідай на 6 питань">
        <NumberedSteps
          items={[
            'Що потрібно знайти?',
            'Які вхідні дані?',
            'Які constraints?',
            'Яке найпростіше правильне рішення?',
            'Яка його часова й просторова складність?',
            'Чому воно проходить або не проходить?',
          ]}
        />
        <LessonCallout title="Стоп-сигнал перед редактором">
          Якщо на останні три питання ще немає відповіді, код писати зарано. Спершу заверши
          модель і оцінку рішення.
        </LessonCallout>
        <Remember>
          Умова описує історію. Алгоритм працює з моделлю. Перший крок — перейти від історії
          до структури.
        </Remember>
      </LessonSection>

      <SelfCheck
        questions={[
          {
            question: 'Яке перше речення варто сформулювати після читання умови?',
            answer: 'Одним реченням назвати точну ціль: що саме потрібно знайти або побудувати.',
          },
          {
            question: 'Навіщо відкидати назви об’єктів із сюжету?',
            answer: 'Щоб побачити формальну структуру — наприклад, граф, масив, відрізок чи стан — і вже до неї добирати алгоритм.',
          },
          {
            question: 'Чому власні приклади n = 1, 2, 3 корисніші за пасивне читання sample?',
            answer: 'Ти сам проходиш механіку задачі й швидше помічаєш крайні випадки, закономірності та помилки у своїй моделі.',
          },
        ]}
      />
    </>
  );
}

function ComplexityLesson() {
  return (
    <>
      <LessonSection id="complexity-classes" eyebrow="Масштаб" title="Constraints визначають поле можливих рішень">
        <LessonText>
          Constraints — це не технічний блок наприкінці умови. Вони допомагають зрозуміти,
          які алгоритми взагалі можуть вкластися в ліміт часу.
        </LessonText>
        <Formula label="якщо n = 200 000">n² = 40 000 000 000</Formula>
        <LessonText>
          Для такого <InlineCode>n</InlineCode> алгоритм <InlineCode>O(n²)</InlineCode> майже
          напевно непридатний, тоді як <InlineCode>O(n log n)</InlineCode> часто цілком
          реалістичний.
        </LessonText>
        <ComplexityScaleVisual />
        <LessonTable
          columns={['Складність', 'Типові алгоритми']}
          rows={[
            [<InlineCode key="c">O(1)</InlineCode>, 'формула, доступ за індексом'],
            [<InlineCode key="c">O(log n)</InlineCode>, 'binary search'],
            [<InlineCode key="c">O(n)</InlineCode>, 'один прохід'],
            [<InlineCode key="c">O(n log n)</InlineCode>, 'sorting, багато tree/set операцій'],
            [<InlineCode key="c">O(n²)</InlineCode>, 'перебір пар'],
            [<InlineCode key="c">O(n³)</InlineCode>, 'DP або Floyd на малому n'],
            [<InlineCode key="c">O(2ⁿ)</InlineCode>, 'перебір підмножин'],
            [<InlineCode key="c">O(n!)</InlineCode>, 'перебір перестановок'],
          ]}
        />
      </LessonSection>

      <LessonSection id="complexity-map" eyebrow="Орієнтир" title="Карта допустимих підходів">
        <LessonText>
          Точні межі залежать від мови, ліміту часу, констант і типу операцій. Але порядок
          величин допомагає швидко відкинути явно повільні ідеї.
        </LessonText>
        <LessonTable
          columns={['Значення n', 'Що варто перевірити']}
          rows={[
            [<InlineCode key="n">n ≤ 10</InlineCode>, 'повний перебір, перестановки'],
            [<InlineCode key="n">n ≤ 20–25</InlineCode>, '2ⁿ, bitmask'],
            [<InlineCode key="n">n ≈ 40</InlineCode>, 'meet in the middle'],
            [<InlineCode key="n">n ≤ 500</InlineCode>, 'часто допустиме O(n²)'],
            [<InlineCode key="n">n ≤ 2 000</InlineCode>, 'іноді допустиме O(n²)'],
            [<InlineCode key="n">n ≤ 2·10⁵</InlineCode>, 'переважно O(n) або O(n log n)'],
            [<InlineCode key="n">n ≤ 10⁶</InlineCode>, 'бажано близько до O(n)'],
          ]}
        />
        <LessonCallout title="Це карта, а не закон">
          Мільйон простих додавань і мільйон важких операцій із пам’яттю — не те саме. Не
          намагайся вивчити магічні межі; вчися оцінювати масштаб.
        </LessonCallout>
      </LessonSection>

      <LessonSection id="all-parameters" eyebrow="Сильна підказка" title="Дивись на всі параметри">
        <CodeBlock language="Constraints" caption="Велике n, але мале k" code={`n ≤ 200 000
k ≤ 18`} />
        <LessonText>
          Не треба автоматично шукати лише <InlineCode>O(n log n)</InlineCode>. Можливо,
          складна частина залежить від маленького <InlineCode>k</InlineCode>, і рішення{' '}
          <InlineCode>O(n + 2ᵏ)</InlineCode> буде допустимим.
        </LessonText>
        <Formula label="комбінуємо параметри">O(n + 2ᵏ)</Formula>
      </LessonSection>

      <LessonSection id="test-cases" eyebrow="Увесь input" title="T test cases та sum(n)">
        <LessonText>
          Один запуск програми може містити T незалежних наборів даних. Тоді час потрібно
          оцінювати для всього вводу, а не лише для найбільшого окремого тесту.
          Обмеження sum(n) = Σnᵢ задає загальну кількість елементів у всіх наборах.
        </LessonText>
        <CodeBlock language="Constraints" caption="Обмеження одного тесту та всього вводу" code={`1 ≤ T ≤ 10000
1 ≤ nᵢ ≤ 200000
sum(nᵢ) ≤ 200000`} />
        <LessonTable columns={['Підхід на один тест', 'Час для всіх тестів']} rows={[
          ['O(nᵢ)', 'O(T + Σnᵢ), а не автоматично T · 200000'],
          ['O(nᵢ log nᵢ)', 'O(T + Σ(nᵢ log nᵢ))'],
          ['O(nᵢ²)', 'O(T + Σnᵢ²): один великий тест усе ще може бути надто дорогим'],
        ]} />
        <CodeBlock caption="Стан кожного тесту створюється заново" code={`int T;
cin >> T;
while (T--) {
    int n;
    cin >> n;
    long long sum = 0;
    for (int i = 0; i < n; ++i) {
        long long x;
        cin >> x;
        sum += x;
    }
    cout << sum << '\\n';
}`} />
        <LessonCallout title="Не вигадуй гарантію sum(n)">
          Якщо сумарної межі немає, враховуй найгірший випадок T·n_max. Обнуляй
          лічильники й контейнери між тестами. Пам’ять зазвичай оцінюється за найбільшим
          одночасно збереженим станом, а не сумою пам’яті всіх послідовно оброблених тестів.
        </LessonCallout>
      </LessonSection>

      <LessonSection id="memory" eyebrow="Не лише час" title="Пам’ять теж має складність">
        <CodeBlock
          caption="Таку таблицю створювати не можна"
          code={`int dp[200000][200000];  // приблизно 160 GB пам'яті`}
        />
        <LessonText>
          Таблиця містила б 40 мільярдів значень. За чотири байти на <InlineCode>int</InlineCode>{' '}
          це приблизно 160 GB — далеко більше за типовий ліміт.
        </LessonText>
        <LessonQuote>
          Оцінюй не тільки кількість переходів, а й кількість станів, які зберігаєш.
        </LessonQuote>
      </LessonSection>

      <LessonSection id="complexity-example" eyebrow="Приклад" title="Мінімальна різниця між двома числами">
        <LessonText>
          За <InlineCode>n ≤ 200 000</InlineCode> перебір усіх пар має складність{' '}
          <InlineCode>O(n²)</InlineCode> і не проходить. Після сортування найближчі значення
          обов’язково стоять поруч, тому достатньо одного проходу.
        </LessonText>
        <CodeBlock
          caption="Сортування + сусідні пари · O(n log n)"
          code={`long long minDifference(vector<long long> values) {
    sort(values.begin(), values.end());

    long long answer = LLONG_MAX;
    for (int i = 1; i < (int)values.size(); ++i) {
        answer = min(answer, values[i] - values[i - 1]);
    }

    return answer;
}`}
        />
        <Remember>
          Constraints не говорять, який алгоритм правильний. Вони говорять, які алгоритми
          точно неправильні.
        </Remember>
      </LessonSection>

      <SelfCheck
        questions={[
          {
            question: 'n = 200 000. Чи варто будувати основне рішення O(n²)?',
            answer: 'Майже напевно ні: це близько 40 мільярдів пар. Спочатку шукай O(n log n) або O(n).',
          },
          {
            question: 'Чому маленький параметр k може бути важливішим за велике n?',
            answer: 'Експоненційна частина іноді залежить лише від k. Наприклад, O(n + 2ᵏ) при k = 18 може бути цілком практичним.',
          },
          {
            question: 'Що потрібно оцінити перед створенням DP-таблиці?',
            answer: 'Кількість станів, розмір одного значення і загальну пам’ять, а не лише час переходів.',
          },
        ]}
      />
    </>
  );
}

function BruteForceLesson() {
  return (
    <>
      <LessonSection id="simple-solution" eyebrow="Початкова модель" title="Почни з найпростішого правильного рішення">
        <LessonText>
          Brute force — не погане рішення. Це спосіб точно сформулювати, що ми перебираємо,
          де витрачаємо час і яка інформація обчислюється повторно.
        </LessonText>
        <LessonText>
          Нехай у масиві потрібно знайти два елементи із сумою <InlineCode>x</InlineCode>.
          Найпростіший підхід перевіряє кожну пару.
        </LessonText>
        <CodeBlock
          caption="Перебір усіх пар · O(n²)"
          code={`bool hasPairWithSum(const vector<int>& a, int target) {
    for (int i = 0; i < (int)a.size(); ++i) {
        for (int j = i + 1; j < (int)a.size(); ++j) {
            if (a[i] + a[j] == target) return true;
        }
    }

    return false;
}`}
        />
        <LessonText>
          За <InlineCode>n ≤ 2 000</InlineCode> цього іноді достатньо. За{' '}
          <InlineCode>n ≤ 200 000</InlineCode> потрібно знайти інший погляд.
        </LessonText>
      </LessonSection>

      <LessonSection id="wasted-work" eyebrow="Ключове питання" title="Знайди зайву роботу">
        <LessonText>
          Для кожного <InlineCode>a[i]</InlineCode> нам не потрібні всі інші елементи. Потрібна
          лише відповідь на питання: чи вже зустрічалося значення{' '}
          <InlineCode>target − a[i]</InlineCode>?
        </LessonText>
        <BruteForceVisual />
        <CodeBlock
          caption="Hash set · у середньому O(n)"
          code={`bool hasPairWithSum(const vector<int>& a, int target) {
    unordered_set<int> seen;

    for (int value : a) {
        int need = target - value;
        if (seen.count(need)) return true;
        seen.insert(value);
    }

    return false;
}`}
        />
      </LessonSection>

      <LessonSection id="optimization-tools" eyebrow="Шпаргалка" title="Типові переходи від brute force">
        <LessonTable
          columns={['Де витрачається час', 'Що перевірити']}
          rows={[
            ['Повторно рахуємо те саме', 'preprocessing або dynamic programming'],
            ['Перебираємо всі пари', 'sorting, hashing, two pointers'],
            ['Багато разів рахуємо суму відрізку', 'prefix sum'],
            ['Перевіряємо багато можливих відповідей', 'binary search'],
            ['Постійно потрібен minimum / maximum', 'heap'],
            ['Перераховуємо однакові стани', 'memoization'],
            ['Маємо багато однакових запитів', 'структура даних'],
            ['Симулюємо довгий процес', 'формула або інваріант'],
          ]}
        />
        <LessonCallout title="Не оптимізуй навмання">
          Назви конкретну операцію, яка повторюється надто багато разів. Саме вона підказує,
          яку інформацію варто зберегти або як змінити порядок обчислень.
        </LessonCallout>
      </LessonSection>

      <LessonSection id="representation" eyebrow="Інший погляд" title="Іноді треба змінити представлення">
        <LessonText>
          Якщо умова працює з послідовністю, але відповідь залежить лише від різниць сусідніх
          значень, корисно перейти від самих значень до масиву різниць.
        </LessonText>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Formula label="початкові дані">a₁, a₂, …, aₙ</Formula>
          <span className="mx-auto text-primary">→</span>
          <Formula label="нове представлення">dᵢ = aᵢ − aᵢ₋₁</Formula>
        </div>
        <LessonQuote>
          Оптимізація — не завжди «візьмемо швидшу структуру». Іноді треба переформулювати
          саму задачу.
        </LessonQuote>
      </LessonSection>

      <LessonSection id="subtasks" eyebrow="Сходинки" title="Підзадачі показують шлях до повного рішення">
        <CodeBlock
          language="Subtasks"
          caption="Три масштаби однієї задачі"
          code={`n ≤ 20       // повний перебір
n ≤ 2 000    // проміжна оптимізація
n ≤ 200 000  // повне рішення`}
        />
        <LessonText>
          Спочатку розв’яжи найменшу підзадачу. Потім запитай: яка частина цього рішення стає
          занадто дорогою зі зростанням <InlineCode>n</InlineCode>? Відповідь часто прямо веде
          до наступної оптимізації.
        </LessonText>
        <Remember>
          Не намагайся одразу придумати оптимальне рішення. Спочатку придумай правильне, а
          потім знайди, де воно робить зайву роботу.
        </Remember>
      </LessonSection>

      <SelfCheck
        questions={[
          {
            question: 'Чому brute force корисний, навіть якщо він не проходить?',
            answer: 'Він точно описує простір варіантів і показує, яка робота повторюється. Це відправна точка для оптимізації.',
          },
          {
            question: 'У Two Sum що замінює внутрішній цикл?',
            answer: 'Швидкий пошук конкретного доповнення target − a[i] у set, unordered_set або у відсортованому масиві.',
          },
          {
            question: 'Коли зміна представлення корисніша за нову структуру даних?',
            answer: 'Коли відповідь залежить не від початкових об’єктів напряму, а від похідної властивості: різниць, порядку, парності чи іншого інваріанта.',
          },
        ]}
      />
    </>
  );
}

function PatternRecognitionLesson() {
  return (
    <>
      <LessonSection id="properties" eyebrow="Не ключове слово" title="Шукай властивості задачі">
        <LessonText>
          Фраза «знайти мінімальне можливе <InlineCode>X</InlineCode>» ще не означає binary
          search. Важлива інша властивість: чи можна швидко перевірити кандидат і чи є ця
          перевірка монотонною.
        </LessonText>
        <CodeBlock
          caption="Форма монотонного predicate"
          code={`bool can(long long x) {
    // Чи можна отримати допустиме рішення з межею x?
}

// Значення can(x):
// false false false true true true`}
        />
        <LessonText>
          Якщо після деякої межі всі відповіді стають <InlineCode>true</InlineCode>, Binary
          Search on Answer — сильний кандидат. Але монотонність ще потрібно довести.
        </LessonText>
        <HypothesisLoopVisual />
      </LessonSection>

      <LessonSection id="signals" eyebrow="Кандидати" title="Приклади типових сигналів">
        <LessonTable
          columns={['Що бачимо', 'Про що варто подумати']}
          rows={[
            [<>багато запитів <InlineCode>[l, r]</InlineCode></>, 'Prefix; Fenwick / Segment Tree — preview'],
            ['найдовший допустимий відрізок', 'Two Pointers / Sliding Window'],
            ['мінімальна кількість переходів без ваг', 'BFS — preview'],
            ['мінімальний шлях із невід’ємними вагами', 'Dijkstra — preview'],
            ['залежності між об’єктами', 'Graph / DAG'],
            ['кількість способів', 'DP / Combinatorics'],
            [<InlineCode key="n">n ≤ 20</InlineCode>, 'Bitmask / Subsets'],
            ['мінімізувати максимум', 'Binary Search on Answer'],
            ['постійно потрібен min / max', 'Priority Queue'],
            ['відповідь залежить від піддерев', 'Tree DP'],
          ]}
        />
        <LessonQuote>Побачив сигнал — сформував гіпотезу. Не автоматичну відповідь.</LessonQuote>
        <LessonCallout title="Preview, а не передумова">
          Знати BFS, Fenwick Tree чи Segment Tree зараз не потрібно. Це назви майбутніх
          інструментів: вони показують, як змінюється вибір при інших властивостях задачі.
          Реалізації з’являться у відповідних главах; зараз достатньо розуміти запитання.
        </LessonCallout>
      </LessonSection>

      <LessonSection id="context" eyebrow="Уточнення" title="Один сигнал може вести до різних алгоритмів">
        <LessonText>
          Нехай потрібно знаходити максимум на багатьох відрізках. Якщо масив не змінюється,
          можна зробити preprocessing. Якщо між запитами є оновлення, потрібна динамічна
          структура.
        </LessonText>
        <LessonList
          items={[
            'який саме тип запиту виконується;',
            'які constraints мають усі параметри;',
            'чи змінюються дані між запитами;',
            'що саме потрібно повертати.',
          ]}
        />
      </LessonSection>

      <LessonSection id="verify" eyebrow="Доведення" title="Як перевірити свою гіпотезу">
        <LessonText>
          «Схоже на greedy» або «тут, мабуть, DP» — це лише початок. Для кожного класу
          алгоритмів є своє контрольне питання.
        </LessonText>
        <LessonTable
          columns={['Гіпотеза', 'Контрольне питання']}
          rows={[
            ['Greedy', 'Чому локальний вибір не може погіршити оптимальну відповідь?'],
            ['Dynamic Programming', 'Чи містить стан усю інформацію для продовження?'],
            ['Binary Search', 'Predicate справді монотонний на всьому діапазоні?'],
            ['Graph', 'Чи кожен допустимий перехід точно представлений ребром?'],
          ]}
        />
        <LessonCallout title="Корисний формат доведення">
          Сформулюй інваріант або обмінний аргумент одним абзацом. Якщо пояснення не вдається
          написати без слів «очевидно» і «здається», модель варто перевірити ще раз.
        </LessonCallout>
      </LessonSection>

      <LessonSection id="counterexample" eyebrow="Стрес-тест" title="Шукай контрприклад до власного рішення">
        <LessonText>
          Перед кодом спробуй навмисно зламати ідею. Знайдений контрприклад до відправки — це
          заощаджена спроба, а не невдача.
        </LessonText>
        <LessonList
          items={[
            'найменший допустимий input;',
            'усі значення однакові;',
            'строго зростаючі та строго спадні дані;',
            'дуже великі значення й можливий overflow;',
            'випадок, де greedy робить привабливий локальний вибір, але програє глобально.',
          ]}
        />
        <Remember>
          Патерн дає гіпотезу. Доведення або контрприклад визначає, чи ця гіпотеза правильна.
        </Remember>
      </LessonSection>

      <LessonSection id="verdicts" eyebrow="Після відправки" title="Що означають WA, TLE, MLE та RE">
        <LessonText>
          Verdict — результат перевірки посилки. Він допомагає вибрати напрямок пошуку
          помилки, але не називає конкретний неправильний рядок коду.
        </LessonText>
        <LessonTable columns={['Verdict', 'Значення', 'Що перевірити спочатку']} rows={[
          ['WA · Wrong Answer', 'Неправильна відповідь', 'Умова, межі, рівності, індекси, overflow, формат виводу'],
          ['TLE · Time Limit Exceeded', 'Перевищено час', 'Складність для всіх тестів, зайві цикли, повторні обчислення'],
          ['MLE · Memory Limit Exceeded', 'Перевищено пам’ять', 'Розмір таблиць, копії контейнерів, збереження зайвої історії'],
          ['RE · Runtime Error', 'Помилка під час виконання', 'Вихід за межі, доступ до порожнього контейнера, ділення на нуль, переповнення стека'],
        ]} />
        <LessonCallout title="Вердикт — підказка, не доказ причини">
          Вихід за межі або інша невизначена поведінка можуть дати не лише RE, а й WA
          або непостійний результат. Спочатку відтвори збій на маленькому тесті;
          не змінюй алгоритм навмання лише за назвою verdict.
        </LessonCallout>
      </LessonSection>

      <SelfCheck
        questions={[
          {
            question: 'Чи достатньо фрази «мінімізувати X», щоб застосувати binary search?',
            answer: 'Ні. Потрібна функція can(X), значення якої змінюються монотонно, і це треба довести.',
          },
          {
            question: 'Чому однаковий запит на відрізку може вимагати різних структур?',
            answer: 'Вирішальним є контекст: статичні дані дозволяють preprocessing, а оновлення між запитами потребують динамічної структури.',
          },
          {
            question: 'Чому перед greedy-рішенням варто шукати контрприклад?',
            answer: 'Greedy часто виглядає переконливо локально. Контрприклад перевіряє, чи не руйнує цей вибір глобальний оптимум.',
          },
        ]}
      />
    </>
  );
}

function CppStlLesson() {
  return (
    <>
      <LessonSection id="cpp-template" eyebrow="Старт" title="Базовий шаблон">
        <LessonText>
          Для алгоритмічних задач не потрібно знати весь C++. Потрібно впевнено володіти
          невеликим набором інструментів і розуміти складність їх операцій.
        </LessonText>
        <StlToolboxVisual />
        <CodeBlock
          caption="Стартовий шаблон для GCC"
          code={`#include <bits/stdc++.h>

using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;

    return 0;
}`}
        />
        <LessonText>
          <InlineCode>bits/stdc++.h</InlineCode> не є частиною стандарту C++, але підтримується
          GCC і використовується на більшості олімпіадних платформ. Якщо платформа інша,
          підключай потрібні стандартні заголовки окремо.
        </LessonText>
      </LessonSection>

      <LessonSection id="number-types" eyebrow="Типова помилка" title="Числові типи та overflow">
        <CodeBlock
          caption="Перетворення має відбутися до множення"
          code={`int a = 1'000'000;
int b = 1'000'000;

long long wrong = a * b;        // overflow відбувся раніше
long long correct = 1LL * a * b;`}
        />
        <LessonText>
          Навіть якщо результат зберігається у <InlineCode>long long</InlineCode>, множення двох{' '}
          <InlineCode>int</InlineCode> спочатку виконується як <InlineCode>int</InlineCode>. Саме
          тому множник <InlineCode>1LL</InlineCode> принципово важливий.
        </LessonText>
      </LessonSection>

      <LessonSection id="sequences" eyebrow="Послідовності" title="Vector і sorting">
        <CodeBlock
          caption="Читання масиву"
          code={`vector<int> a(n);

for (int& value : a) {
    cin >> value;
}

a.push_back(42);  // додати в кінець
cout << a[0];     // доступ за індексом`}
        />
        <CodeBlock
          caption="Сортування і власний comparator"
          code={`sort(a.begin(), a.end());       // за зростанням
sort(a.rbegin(), a.rend());     // за спаданням

sort(teams.begin(), teams.end(), [](const auto& left,
                                    const auto& right) {
    if (left.solved != right.solved) {
        return left.solved > right.solved;
    }
    return left.penalty < right.penalty;
});`}
        />
      </LessonSection>

      <LessonSection id="search-containers" eyebrow="Пошук і ключі" title="Binary search, set і map">
        <CodeBlock
          caption="Пошук у відсортованому vector"
          code={`sort(a.begin(), a.end());

auto firstNotLess = lower_bound(a.begin(), a.end(), x); // перший >= x
auto firstGreater = upper_bound(a.begin(), a.end(), x); // перший > x`}
        />
        <LessonText>
          <InlineCode>lower_bound</InlineCode> і <InlineCode>upper_bound</InlineCode> коректні
          лише на відсортованому діапазоні. Для довільного масиву їх результат не має сенсу.
        </LessonText>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock
            caption="set · унікальні впорядковані значення"
            code={`set<int> values;

values.insert(10);
values.erase(5);

if (values.count(10)) {
    // елемент існує
}`}
          />
          <CodeBlock
            caption="map · ключ → значення"
            code={`map<int, int> frequency;

for (int value : a) {
    ++frequency[value];
}

cout << frequency[42];`}
          />
        </div>
        <LessonCallout title="Ordered чи unordered?">
          <InlineCode>set</InlineCode> і <InlineCode>map</InlineCode> підтримують порядок та
          працюють за <InlineCode>O(log n)</InlineCode>. Hash-контейнери{' '}
          <InlineCode>unordered_set</InlineCode> і <InlineCode>unordered_map</InlineCode> не
          зберігають порядок, але в середньому дають <InlineCode>O(1)</InlineCode>.
        </LessonCallout>
      </LessonSection>

      <LessonSection id="queues" eyebrow="Порядок обробки" title="Queue і priority_queue">
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock
            caption="queue · FIFO"
            code={`queue<int> q;

q.push(5);
int first = q.front();
q.pop();

// BFS — preview наступних глав, зараз знати його не потрібно.`}
          />
          <CodeBlock
            caption="priority_queue · поточний min / max"
            code={`priority_queue<int> maximums;

priority_queue<
    int,
    vector<int>,
    greater<int>
> minimums;`}
          />
        </div>
        <LessonText>
          Типовий сигнал для <InlineCode>priority_queue</InlineCode>: ми часто додаємо нові
          елементи й щоразу хочемо швидко отримувати поточний мінімум або максимум.
        </LessonText>
      </LessonSection>

      <LessonSection id="choose-container" eyebrow="Практичний вибір" title="Не вибирай структуру за назвою">
        <LessonText>
          Спочатку випиши потрібні операції. Після цього контейнер і його складність зазвичай
          стають очевидними.
        </LessonText>
        <LessonTable
          columns={['Потрібні операції', 'Кандидат', 'Типова складність']}
          rows={[
            ['доступ за індексом, прохід', <InlineCode key="v">vector</InlineCode>, 'O(1) доступ'],
            ['унікальні значення + порядок', <InlineCode key="s">set</InlineCode>, 'O(log n)'],
            ['ключ → значення + порядок', <InlineCode key="m">map</InlineCode>, 'O(log n)'],
            ['ключ → значення без порядку', <InlineCode key="u">unordered_map</InlineCode>, 'у середньому O(1)'],
            ['обробка в порядку додавання', <InlineCode key="q">queue</InlineCode>, 'O(1) push/pop'],
            ['постійно діставати min або max', <InlineCode key="p">priority_queue</InlineCode>, 'O(log n) push/pop'],
            ['відсортувати весь діапазон', <InlineCode key="sort">sort</InlineCode>, 'O(n log n)'],
          ]}
        />
        <Remember>
          STL — набір готових інструментів, а не заміна алгоритмічного мислення. Спочатку
          визнач потрібні операції, потім вибирай контейнер.
        </Remember>
      </LessonSection>

      <SelfCheck
        questions={[
          {
            question: 'Чому long long result = a * b не завжди захищає від overflow?',
            answer: 'Якщо a і b мають тип int, множення виконується як int ще до присвоєння. Використай 1LL * a * b або явно перетвори операнд.',
          },
          {
            question: 'Яка передумова для lower_bound і upper_bound?',
            answer: 'Діапазон має бути відсортований у тому самому порядку, який використовує пошук.',
          },
          {
            question: 'Який контейнер перевірити, якщо постійно потрібен поточний мінімум?',
            answer: 'Мінімальну priority_queue: priority_queue<T, vector<T>, greater<T>>. Вставка і видалення вершини працюють за O(log n).',
          },
        ]}
      />
    </>
  );
}
