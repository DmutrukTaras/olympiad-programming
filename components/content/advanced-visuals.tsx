'use client';

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { VisualFrame } from '@/components/content/lesson-ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AdvancedVisualKind } from '@/types/content';

type VisualStep = {
  label: string;
  value: string;
  detail: string;
};

const visualData: Record<
  AdvancedVisualKind,
  { eyebrow: string; title: string; steps: VisualStep[] }
> = {
  'kmp-fallback': {
    eyebrow: 'Prefix Function / KMP',
    title: 'Mismatch не стирає вже знайдену інформацію',
    steps: [
      {
        label: 'Порівнюємо',
        value: 'abab ↔ abab',
        detail: 'Чотири символи вже збіглися.',
      },
      {
        label: 'Mismatch',
        value: 'ababc ↔ ababa',
        detail: 'П’ятий символ різний, але prefix «ab» уже є suffix збігу.',
      },
      {
        label: 'Fallback',
        value: 'j = π[j − 1] = 2',
        detail: 'Повертаємося до коротшого border, не рухаючи text назад.',
      },
      {
        label: 'Продовжуємо',
        value: 'O(n + m)',
        detail: 'Кожен символ дає амортизовано сталу кількість переходів.',
      },
    ],
  },
  'z-box': {
    eyebrow: 'Z-function',
    title: 'Відоме Z-вікно підказує стартове значення',
    steps: [
      {
        label: 'Початок',
        value: '[L, R) = [0, 0)',
        detail: 'Ще немає відомого збігу з prefix.',
      },
      {
        label: 'Новий збіг',
        value: 'z[1] = 1',
        detail: 'Розширюємо порівняння символ за символом.',
      },
      {
        label: 'Усередині box',
        value: 'z[i] ≥ min(R − i, z[i − L])',
        detail: 'Копіюємо гарантовану частину попереднього збігу.',
      },
      {
        label: 'Розширення',
        value: 'R рухається лише вправо',
        detail: 'Саме це дає сумарну складність O(n).',
      },
    ],
  },
  'rolling-hash': {
    eyebrow: 'Prefix preprocessing',
    title: 'Два підрядки стають двома числами',
    steps: [
      {
        label: 'Prefix',
        value: 'H[i + 1] = H[i]·p + s[i]',
        detail: 'Один прохід готує fingerprints усіх prefixes.',
      },
      {
        label: 'Вирізати',
        value: 'hash(l,r) = H[r] − H[l]·p^(r−l)',
        detail: 'Віднімаємо внесок символів ліворуч.',
      },
      {
        label: 'Порівняти',
        value: 'h₁ == h₂',
        detail:
          'Однакова довжина й однаковий hash означають імовірну рівність.',
      },
      {
        label: 'Захист',
        value: 'double hash',
        detail: 'Друга незалежна пара base/mod різко зменшує ризик collision.',
      },
    ],
  },
  orientation: {
    eyebrow: 'Cross Product',
    title: 'Знак визначника замінює кути',
    steps: [
      {
        label: 'Вектори',
        value: 'u = B − A, v = C − A',
        detail: 'Переносимо геометрію в початок координат.',
      },
      {
        label: 'Cross',
        value: 'u.x·v.y − u.y·v.x',
        detail: 'Площа орієнтованого паралелограма.',
      },
      {
        label: 'Знак +',
        value: 'C ліворуч від AB',
        detail: 'Поворот проти годинникової стрілки.',
      },
      {
        label: 'Знак 0 / −',
        value: 'collinear / праворуч',
        detail: 'Жодних atan або похибки double.',
      },
    ],
  },
  'segment-intersection': {
    eyebrow: 'Boundary handling',
    title: 'General case — лише частина перевірки',
    steps: [
      {
        label: 'Orientation',
        value: 'o₁,o₂,o₃,o₄',
        detail: 'Перевіряємо положення кінців відносно двох прямих.',
      },
      {
        label: 'General',
        value: 'sign(o₁) ≠ sign(o₂) і sign(o₃) ≠ sign(o₄)',
        detail: 'Відрізки строго перетинаються.',
      },
      {
        label: 'Collinear',
        value: 'orientation = 0',
        detail: 'Потрібна додаткова перевірка належності bounding box.',
      },
      {
        label: 'Closed segments',
        value: 'спільна вершина теж YES',
        detail: 'Модель меж визначає остаточні нерівності.',
      },
    ],
  },
  'convex-hull': {
    eyebrow: 'Sorting + Cross + Stack',
    title: 'Неправильний поворот видаляє внутрішню точку',
    steps: [
      {
        label: 'Sort',
        value: '(x, потім y)',
        detail: 'Отримуємо детермінований порядок точок.',
      },
      {
        label: 'Push',
        value: 'додаємо наступну точку',
        detail: 'Кандидат тимчасово входить до нижньої оболонки.',
      },
      {
        label: 'Wrong turn',
        value: 'cross ≤ 0',
        detail: 'Середня з трьох точок не потрібна для strict hull.',
      },
      {
        label: 'Upper + lower',
        value: 'O(n log n)',
        detail: 'Дві монотонні половини утворюють boundary.',
      },
    ],
  },
  'subset-mask': {
    eyebrow: '2ⁿ states',
    title: 'Число кодує вибір усієї підмножини',
    steps: [
      {
        label: 'mask = 0',
        value: '0000',
        detail: 'Жоден із чотирьох елементів не вибрано.',
      },
      {
        label: 'Увімкнути 1',
        value: 'mask | (1 << 1) = 0010',
        detail: 'Другий елемент входить до множини.',
      },
      {
        label: 'Увімкнути 3',
        value: '1010',
        detail: 'Тепер вибрано елементи 1 і 3.',
      },
      {
        label: 'Перебір',
        value: '0 … (1 << n) − 1',
        detail: 'Кожна підмножина зустрічається рівно один раз.',
      },
    ],
  },
  'bitmask-dp': {
    eyebrow: 'State compression',
    title: 'popcount(mask) прибирає зайву координату',
    steps: [
      {
        label: 'Порожньо',
        value: 'dp[0000] = 0',
        detail: 'Ще не призначено жодного працівника.',
      },
      {
        label: 'Рівень',
        value: 'worker = popcount(mask)',
        detail: 'Кількість зайнятих задач уже визначає наступного працівника.',
      },
      {
        label: 'Transition',
        value: 'mask → mask | (1 << task)',
        detail: 'Додаємо одну вільну задачу.',
      },
      {
        label: 'Фініш',
        value: 'dp[(1 << n) − 1]',
        detail: 'Усі задачі зайняті, складність O(n·2ⁿ).',
      },
    ],
  },
  'meet-in-the-middle': {
    eyebrow: '20 + 20',
    title: 'Дві половини замінюють 2⁴⁰',
    steps: [
      {
        label: 'Split',
        value: '40 → 20 + 20',
        detail: 'Кожна половина має приблизно мільйон subsets.',
      },
      {
        label: 'Enumerate',
        value: 'A і B',
        detail: 'Будуємо всі subset sums обох половин.',
      },
      {
        label: 'Sort',
        value: 'sort(B)',
        detail: 'Готуємо праві суми до швидкого пошуку.',
      },
      {
        label: 'Combine',
        value: 'upper_bound(S − a)',
        detail: 'Для кожного a знаходимо найкращий сумісний b.',
      },
    ],
  },
  'graph-decomposition': {
    eyebrow: 'Hidden structure',
    title: 'Стискаємо блоки або знаходимо критичний зв’язок',
    steps: [
      {
        label: 'Directed',
        value: 'mutual reachability → SCC',
        detail: 'Вершини всередині блоку еквівалентні за досяжністю.',
      },
      {
        label: 'Condensation',
        value: 'кожна SCC → одна вершина',
        detail: 'Отриманий граф завжди DAG.',
      },
      {
        label: 'Undirected edge',
        value: 'low[to] > tin[v]',
        detail: 'Піддерево не має обходу ребра до предка — це bridge.',
      },
      {
        label: 'Undirected vertex',
        value: 'articulation condition',
        detail: 'Видалення вершини розділяє DFS-піддерева.',
      },
    ],
  },
  'binary-lifting': {
    eyebrow: 'Powers of two',
    title: 'Підйом на 13 = 8 + 4 + 1',
    steps: [
      { label: '1 крок', value: 'up[v][0]', detail: 'Безпосередній parent.' },
      {
        label: '2,4,8…',
        value: 'up[v][k] = up[up[v][k−1]][k−1]',
        detail: 'Кожен рівень подвоює довжину стрибка.',
      },
      {
        label: 'Вирівняти',
        value: 'підняти глибшу вершину',
        detail: 'Розкладаємо різницю depth на біти.',
      },
      {
        label: 'LCA',
        value: 'стрибати зверху вниз',
        detail: 'Тримаємо вершини різними, але одразу під спільним предком.',
      },
    ],
  },
  rerooting: {
    eyebrow: 'Tree DP × 2',
    title: 'Одна відповідь переноситься через ребро за O(1)',
    steps: [
      {
        label: 'Down pass',
        value: 'size[v], dp[root]',
        detail: 'Діти передають інформацію батькові.',
      },
      {
        label: 'Edge v→to',
        value: 'size[to] вершин ближче',
        detail: 'Їхній внесок зменшується на 1.',
      },
      {
        label: 'Outside',
        value: 'n − size[to] вершин далі',
        detail: 'Їхній внесок збільшується на 1.',
      },
      {
        label: 'Formula',
        value: 'ans[to] = ans[v] + n − 2·size[to]',
        detail: 'Другий DFS обчислює відповідь для всіх roots.',
      },
    ],
  },
  'inclusion-exclusion': {
    eyebrow: 'Count without enumeration',
    title: 'Перетини виправляють подвійний підрахунок',
    steps: [
      {
        label: 'Одиночні',
        value: '+ |Aᵢ|',
        detail: 'Додаємо об’єкти, що порушують кожну умову.',
      },
      {
        label: 'Пари',
        value: '− |Aᵢ ∩ Aⱼ|',
        detail: 'Виправляємо об’єкти, додані двічі.',
      },
      {
        label: 'Трійки',
        value: '+ |Aᵢ ∩ Aⱼ ∩ Aₖ|',
        detail: 'Повертаємо те, що відняли забагато.',
      },
      {
        label: 'k умов',
        value: 'знак за parity popcount(mask)',
        detail: 'Subset enumeration реалізує загальну формулу.',
      },
    ],
  },
  'expected-value': {
    eyebrow: 'Linearity of expectation',
    title: 'Рахуємо внесок події, а не всі випадкові світи',
    steps: [
      {
        label: 'Розкласти',
        value: 'X = Σ Xᵢ',
        detail: 'Xᵢ — indicator локальної події.',
      },
      {
        label: 'Один внесок',
        value: 'E[Xᵢ] = P(Xᵢ = 1)',
        detail: 'Для indicator очікування дорівнює ймовірності.',
      },
      {
        label: 'Скласти',
        value: 'E[X] = Σ E[Xᵢ]',
        detail: 'Незалежність для цієї рівності не потрібна.',
      },
      {
        label: 'Залежність',
        value: 'потрібна лише для P(події)',
        detail: 'Наприклад, добуток імовірностей можливий не завжди.',
      },
    ],
  },
  'matrix-power': {
    eyebrow: 'Linear recurrence',
    title: 'Один і той самий перехід підносимо до степеня',
    steps: [
      {
        label: 'State',
        value: '[Fₙ, Fₙ₋₁]',
        detail: 'Двох сусідніх значень достатньо для продовження.',
      },
      {
        label: 'Transition',
        value: 'stateₙ = M · stateₙ₋₁',
        detail: 'Матриця M однакова на кожному кроці.',
      },
      {
        label: 'Jump',
        value: 'stateₙ = Mⁿ · state₀',
        detail: 'n послідовних переходів стають одним степенем.',
      },
      {
        label: 'Binary power',
        value: 'O(k³ log n)',
        detail: 'Квадратуємо матрицю та беремо потрібні біти n.',
      },
    ],
  },
};

export function AdvancedVisual({ kind }: { kind: AdvancedVisualKind }) {
  const config = visualData[kind];
  const [step, setStep] = useState(0);
  const current = config.steps[step];

  return (
    <VisualFrame eyebrow={config.eyebrow} title={config.title}>
      <div className="grid gap-2 sm:grid-cols-2">
        {config.steps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setStep(index)}
            className={cn(
              'rounded-xl border px-3 py-3 text-left text-sm transition-colors',
              step === index
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/40',
            )}
          >
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            <strong className="ml-2">{item.label}</strong>
          </button>
        ))}
      </div>

      <output className="mt-4 block rounded-xl border border-border bg-muted/30 p-4">
        <span className="block font-mono text-sm text-primary">
          {current.value}
        </span>
        <span className="mt-2 block text-sm leading-6 text-muted-foreground">
          {current.detail}
        </span>
      </output>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={step === config.steps.length - 1}
          onClick={() =>
            setStep((value) => Math.min(value + 1, config.steps.length - 1))
          }
        >
          Наступний крок <ArrowRight aria-hidden="true" />
        </Button>
        <Button variant="ghost" onClick={() => setStep(0)}>
          <RotateCcw aria-hidden="true" /> Спочатку
        </Button>
      </div>
    </VisualFrame>
  );
}
