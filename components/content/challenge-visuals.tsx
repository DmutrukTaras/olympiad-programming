'use client';

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { VisualFrame } from '@/components/content/lesson-ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChallengeVisualKind } from '@/types/content';

type Step = { label: string; before: string; after: string; detail: string };

const data: Record<
  ChallengeVisualKind,
  { eyebrow: string; title: string; steps: Step[] }
> = {
  'augmenting-path': {
    eyebrow: 'Reversible choice',
    title: 'Augmenting path перебудовує matching',
    steps: [
      {
        label: 'Greedy',
        before: 'A—X, B—∅',
        after: 'matching = 1',
        detail: 'X уже зайнятий, хоча B має альтернативу Y.',
      },
      {
        label: 'Пошук',
        before: 'A → X',
        after: 'X → B → Y',
        detail: 'Чергуємо вільні та matching-ребра.',
      },
      {
        label: 'Flip',
        before: 'A—X',
        after: 'A—X, B—Y',
        detail: 'Стан ребер уздовж шляху інвертується.',
      },
      {
        label: 'Результат',
        before: '|M| = 1',
        after: '|M| = 2',
        detail: 'Кожен augmenting path збільшує matching рівно на один.',
      },
    ],
  },
  'residual-flow': {
    eyebrow: 'Residual network',
    title: 'Зворотне ребро робить рішення виправним',
    steps: [
      {
        label: 'Capacity',
        before: 'c(u,v)=7',
        after: 'residual=7',
        detail: 'Спочатку весь ресурс доступний.',
      },
      {
        label: 'Push 4',
        before: 'f(u,v)=0',
        after: 'f(u,v)=4',
        detail: 'Пряма залишкова місткість стає 3.',
      },
      {
        label: 'Reverse',
        before: 'c(v,u)=0',
        after: 'residual(v,u)=4',
        detail: 'Чотири одиниці можна скасувати або перенаправити.',
      },
      {
        label: 'Augment',
        before: 'один локальний шлях',
        after: 'глобально кращий flow',
        detail: 'Наступний шлях може використати reverse edge.',
      },
    ],
  },
  'min-cut-model': {
    eyebrow: 'Reduction',
    title: 'Ціна розриву стає capacity',
    steps: [
      {
        label: 'Умова',
        before: 'видалити канали',
        after: 'S не досягає T',
        detail: 'Перебір наборів ребер експоненційний.',
      },
      {
        label: 'Модель',
        before: 'ціна видалення',
        after: 'capacity ребра',
        detail: 'Кожен S–T cut відповідає допустимому набору.',
      },
      {
        label: 'Теорема',
        before: 'minimum cut',
        after: 'maximum flow',
        detail: 'Оптимальні значення рівні.',
      },
      {
        label: 'Certificate',
        before: 'residual reachability',
        after: 'сторона S cut',
        detail: 'Після max flow сам cut відновлюється одним DFS.',
      },
    ],
  },
  'divide-conquer-opt': {
    eyebrow: 'Transition structure',
    title: 'Оптимальна межа звужує наступний пошук',
    steps: [
      {
        label: 'Naive',
        before: 'усі j для кожного i',
        after: 'O(KN²)',
        detail: 'State правильний, дорого коштує transition.',
      },
      {
        label: 'Monotonicity',
        before: 'opt[i] невідомий',
        after: 'opt[i] ≤ opt[i+1]',
        detail: 'Це властивість треба довести для cost.',
      },
      {
        label: 'Middle',
        before: '[L,R]',
        after: 'mid + best j',
        detail: 'Спершу обчислюємо середню позицію.',
      },
      {
        label: 'Split',
        before: 'повний діапазон j',
        after: 'ліве/праве звуження',
        detail: 'Рекурсія перевіряє лише сумісні opt ranges.',
      },
    ],
  },
  'knuth-window': {
    eyebrow: 'Interval DP',
    title: 'Два сусідні optimum утворюють вікно',
    steps: [
      {
        label: 'Recurrence',
        before: 'k ∈ [l,r)',
        after: 'O(n³)',
        detail: 'Для кожного interval перебирається split.',
      },
      {
        label: 'Умова',
        before: 'схожа формула',
        after: 'quadrangle + monotone',
        detail: 'Самої форми recurrence недостатньо.',
      },
      {
        label: 'Window',
        before: '[l,r)',
        after: '[opt[l][r−1], opt[l+1][r]]',
        detail: 'Шукаємо лише між двома відомими межами.',
      },
      {
        label: 'Order',
        before: 'невідомі підінтервали',
        after: 'зростання length',
        detail: 'Обидві межі мають бути вже пораховані.',
      },
    ],
  },
  'cht-lines': {
    eyebrow: 'DP → Geometry',
    title: 'Кожен кандидат transition стає прямою',
    steps: [
      {
        label: 'DP',
        before: 'min по j',
        after: 'dp[j]+m[j]·x[i]',
        detail: 'j визначає функцію від поточного x.',
      },
      {
        label: 'Line',
        before: 'кандидат j',
        after: 'y=m·x+b',
        detail: 'm=m[j], b=dp[j].',
      },
      {
        label: 'Query',
        before: 'усі j',
        after: 'мінімум серед ліній',
        detail: 'Замість O(n) потрібна структура нижньої оболонки.',
      },
      {
        label: 'Choose',
        before: 'порядок довільний?',
        after: 'deque або Li Chao',
        detail: 'Монотонні slopes/queries дозволяють простіший CHT.',
      },
    ],
  },
  'game-states': {
    eyebrow: 'Game as DAG',
    title: 'Виграш визначається переходом у програш',
    steps: [
      {
        label: 'Terminal',
        before: 'ходів немає',
        after: 'Losing',
        detail: 'За normal play гравець, який не може ходити, програє.',
      },
      {
        label: 'Existential',
        before: 'є перехід у L',
        after: 'Winning',
        detail: 'Можна передати супернику програшну позицію.',
      },
      {
        label: 'Universal',
        before: 'усі переходи у W',
        after: 'Losing',
        detail: 'Суперник після будь-якого ходу матиме відповідь.',
      },
      {
        label: 'Compute',
        before: 'дерево партій',
        after: 'DP по станах',
        detail: 'Однаковий state обчислюється лише раз.',
      },
    ],
  },
  'nim-xor': {
    eyebrow: 'Invariant',
    title: 'Нульовий XOR — дзеркало для будь-якого ходу',
    steps: [
      {
        label: 'Nim sum',
        before: 'купи 3,4,5',
        after: '3⊕4⊕5 = 2',
        detail: 'Позиція з ненульовим XOR виграшна.',
      },
      {
        label: 'Highest bit',
        before: 'XOR має старший 1-bit',
        after: 'обираємо купу з цим bit',
        detail: 'Таку купу можна зменшити.',
      },
      {
        label: 'Move',
        before: 'a[i]',
        after: 'a[i]⊕XOR < a[i]',
        detail: 'Новий загальний XOR стає нулем.',
      },
      {
        label: 'Reply',
        before: 'XOR=0',
        after: 'будь-який хід → XOR≠0',
        detail: 'Супернику неможливо лишити нуль після зміни однієї купи.',
      },
    ],
  },
  'grundy-mex': {
    eyebrow: 'Game reduction',
    title: 'Кожен impartial state поводиться як Nim-купа',
    steps: [
      {
        label: 'Moves',
        before: 'state v',
        after: '{g(to)}',
        detail: 'Збираємо Grundy numbers усіх наступників.',
      },
      {
        label: 'MEX',
        before: '{0,1,3}',
        after: 'g(v)=2',
        detail: 'Беремо найменше невикористане невід’ємне число.',
      },
      {
        label: 'Components',
        before: 'незалежні ігри',
        after: 'XOR Grundy',
        detail: 'Хід змінює рівно одну компоненту.',
      },
      {
        label: 'Winner',
        before: 'G=0 / G≠0',
        after: 'losing / winning',
        detail: 'Сума ігор редукується до звичайного Nim.',
      },
    ],
  },
  'state-expansion': {
    eyebrow: 'Implicit graph',
    title: 'Додаткова умова стає координатою стану',
    steps: [
      {
        label: 'Умова',
        before: 'один безкоштовний прохід',
        after: 'чи використано бонус?',
        detail: 'Однієї вершини недостатньо для майбутніх рішень.',
      },
      {
        label: 'State',
        before: 'v',
        after: '(v,used)',
        detail: 'Кожна вершина має два логічні шари.',
      },
      {
        label: 'Edges',
        before: 'вартість w',
        after: 'w або 0 між шарами',
        detail: 'Безкоштовний перехід дозволений лише з used=0.',
      },
      {
        label: 'Solve',
        before: 'm повторних Dijkstra',
        after: 'один Dijkstra на 2n states',
        detail: 'Нова модель точно кодує всі допустимі маршрути.',
      },
    ],
  },
  'reverse-time': {
    eyebrow: 'Change the timeline',
    title: 'Складне видалення назад стає простим додаванням',
    steps: [
      {
        label: 'Forward',
        before: 'DELETE edge',
        after: 'DSU не підтримує split',
        detail: 'Після видалення компоненту довелося б перебудовувати.',
      },
      {
        label: 'Final state',
        before: 'усі операції виконані',
        after: 'будуємо залишковий graph',
        detail: 'Це старт зворотного проходу.',
      },
      {
        label: 'Reverse',
        before: 'DELETE',
        after: 'ADD + unite',
        detail: 'DSU добре підтримує саме об’єднання.',
      },
      {
        label: 'Restore order',
        before: 'answers backward',
        after: 'reverse answers',
        detail: 'Отримуємо відповіді у вихідній часовій шкалі.',
      },
    ],
  },
  'hld-decomposition': {
    eyebrow: 'Multi-pattern solution',
    title: 'Деревний шлях стає кількома відрізками масиву',
    steps: [
      {
        label: 'Heavy child',
        before: 'усі діти',
        after: 'найбільше subtree',
        detail: 'Heavy edge продовжує поточний ланцюг.',
      },
      {
        label: 'Decompose',
        before: 'path у tree',
        after: 'O(log n) chains',
        detail: 'Кожен light edge щонайменше подвоює розмір піддерева вгору.',
      },
      {
        label: 'Flatten',
        before: 'chain',
        after: 'contiguous segment',
        detail: 'Позиції HLD дають звичайні range queries.',
      },
      {
        label: 'Combine',
        before: 'tree + updates',
        after: 'HLD + Segment Tree',
        detail: 'Path query працює за O(log² n).',
      },
    ],
  },
};

export function ChallengeVisual({ kind }: { kind: ChallengeVisualKind }) {
  const config = data[kind];
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
                ? 'border-red-400/70 bg-red-400/10'
                : 'border-border hover:border-red-400/40',
            )}
          >
            <span className="font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, '0')}
            </span>
            <strong className="ml-2">{item.label}</strong>
          </button>
        ))}
      </div>
      <output className="mt-4 grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <span className="font-mono text-sm">{current.before}</span>
        <ArrowRight className="size-4 text-red-400" aria-hidden="true" />
        <span className="font-mono text-sm text-red-400">{current.after}</span>
        <span className="text-sm leading-6 text-muted-foreground sm:col-span-3">
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
