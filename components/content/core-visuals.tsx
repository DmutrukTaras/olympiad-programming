'use client';

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { VisualFrame } from '@/components/content/lesson-ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CoreVisualKind } from '@/types/content';

function Cells({
  values,
  active = [],
  removed = [],
}: {
  values: (string | number)[];
  active?: number[];
  removed?: number[];
}) {
  return (
    <div className="flex min-w-max gap-1.5">
      {values.map((value, index) => (
        <div key={index} className="w-12 text-center">
          <div
            className={cn(
              'rounded-lg border border-border bg-muted/40 py-3 font-mono text-sm transition-all',
              active.includes(index) &&
                'border-primary bg-primary/15 ring-1 ring-primary/30',
              removed.includes(index) && 'opacity-30 line-through',
            )}
          >
            {value}
          </div>
          <span className="mt-1 block font-mono text-[0.62rem] text-muted-foreground">
            {index}
          </span>
        </div>
      ))}
    </div>
  );
}

function Controls({
  step,
  total,
  setStep,
  next = 'Наступний крок',
}: {
  step: number;
  total: number;
  setStep: (value: number) => void;
  next?: string;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        disabled={step >= total}
        onClick={() => setStep(step + 1)}
        className="min-h-10"
      >
        {next}
        <ArrowRight aria-hidden="true" />
      </Button>
      <Button variant="ghost" onClick={() => setStep(0)} className="min-h-10">
        <RotateCcw aria-hidden="true" />
        Спочатку
      </Button>
      <span className="ml-auto font-mono text-xs text-muted-foreground">
        {step} / {total}
      </span>
    </div>
  );
}

function TwoPointersVisual() {
  const values = [1, 2, 4, 7, 9, 12];
  const states = [
    { l: 0, r: 5, action: '13 > 11: зсуваємо R' },
    { l: 0, r: 4, action: '10 < 11: зсуваємо L' },
    { l: 1, r: 4, action: '2 + 9 = 11: пару знайдено' },
  ];
  const [step, setStep] = useState(0);
  const state = states[step];
  return (
    <VisualFrame
      eyebrow="Sorting + Two Pointers"
      title="Одна пара меж звужує простір пошуку"
    >
      <div className="overflow-x-auto pb-1">
        <Cells values={values} active={[state.l, state.r]} />
      </div>
      <output className="mt-4 block font-mono text-sm">
        L = {state.l}, R = {state.r}: {state.action}
      </output>
      <Controls step={step} total={states.length - 1} setStep={setStep} />
    </VisualFrame>
  );
}

function SlidingWindowVisual() {
  const values = [2, 1, 5, 1, 2];
  const limit = 7;
  const [step, setStep] = useState(0);
  let l = 0,
    sum = 0,
    best = 0;
  for (let r = 0; r < step; ++r) {
    sum += values[r];
    while (sum > limit) sum -= values[l++];
    best = Math.max(best, r - l + 1);
  }
  return (
    <VisualFrame
      eyebrow="Рухоме вікно · S = 7"
      title="Кожна межа рухається тільки вперед"
    >
      <div className="overflow-x-auto pb-1">
        <Cells
          values={values}
          active={
            step
              ? values.map((_, i) => i).filter((i) => i >= l && i < step)
              : []
          }
        />
      </div>
      <output className="mt-4 block text-sm">
        {step ? (
          <>
            Після R = {step - 1}: L = {l}, sum = {sum}, best = {best}
          </>
        ) : (
          'Ще не додано жодного елемента.'
        )}
      </output>
      <Controls
        step={step}
        total={values.length}
        setStep={setStep}
        next="Розширити R"
      />
    </VisualFrame>
  );
}

function BinarySearchVisual() {
  const values = [2, 5, 8, 11, 15, 19, 25];
  const states = [
    { l: 0, r: 6 },
    { l: 4, r: 6 },
    { l: 4, r: 4 },
  ];
  const [step, setStep] = useState(0);
  const { l, r } = states[step];
  const mid = l + Math.floor((r - l) / 2);
  return (
    <VisualFrame
      eyebrow="Binary Search · шукаємо 15"
      title="Після перевірки відкидаємо половину"
    >
      <div className="overflow-x-auto pb-1">
        <Cells
          values={values}
          active={[mid]}
          removed={values.map((_, i) => i).filter((i) => i < l || i > r)}
        />
      </div>
      <output className="mt-4 block font-mono text-sm">
        [{l}, {r}], mid = {mid}, a[mid] = {values[mid]}
        {values[mid] === 15
          ? ' — знайдено'
          : values[mid] < 15
            ? ' — шукаємо праворуч'
            : ' — шукаємо ліворуч'}
      </output>
      <Controls step={step} total={states.length - 1} setStep={setStep} />
    </VisualFrame>
  );
}

function GreedyOrderVisual() {
  const [sorted, setSorted] = useState(false);
  const values = sorted ? [1, 2, 4, 8] : [8, 2, 4, 1];
  let elapsed = 0,
    waiting = 0;
  for (const value of values) {
    waiting += elapsed;
    elapsed += value;
  }
  return (
    <VisualFrame
      eyebrow="Sorting + Greedy"
      title="Короткі роботи раніше — менше очікування"
    >
      <Cells values={values} />
      <output className="mt-4 block text-sm">
        Сумарне очікування: <strong>{waiting}</strong>
      </output>
      <Button
        variant="outline"
        className="mt-4 min-h-10"
        onClick={() => setSorted(!sorted)}
      >
        {sorted ? 'Початковий порядок' : 'Впорядкувати за тривалістю'}
      </Button>
    </VisualFrame>
  );
}

function IntervalVisual() {
  const intervals = [
    [2, 3],
    [1, 4],
    [3, 5],
    [5, 7],
    [6, 8],
  ];
  const [step, setStep] = useState(0);
  let last = -1,
    taken: number[] = [];
  for (let i = 0; i < step; ++i)
    if (intervals[i][0] >= last) {
      taken.push(i);
      last = intervals[i][1];
    }
  return (
    <VisualFrame
      eyebrow="Interval Greedy"
      title="Переглядаємо інтервали за правим кінцем"
    >
      <div className="space-y-2">
        {intervals.map(([l, r], i) => (
          <div
            key={i}
            className={cn(
              'rounded-lg border border-border px-3 py-2 font-mono text-sm',
              taken.includes(i) && 'border-primary bg-primary/10',
              i >= step && 'opacity-45',
            )}
          >
            [{l}, {r}]{' '}
            {taken.includes(i) ? '· взяли' : i < step ? '· пропустили' : ''}
          </div>
        ))}
      </div>
      <Controls
        step={step}
        total={intervals.length}
        setStep={setStep}
        next="Розглянути інтервал"
      />
    </VisualFrame>
  );
}

function BracketsVisual() {
  const text = '([]{})';
  const [step, setStep] = useState(0);
  const stack: string[] = [];
  let ok = true;
  const pair: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  for (const c of text.slice(0, step)) {
    if (pair[c]) {
      if (stack.pop() !== pair[c]) ok = false;
    } else {
      stack.push(c);
    }
  }
  return (
    <VisualFrame
      eyebrow="Stack · LIFO"
      title="Закриваємо останню незавершену дужку"
    >
      <Cells values={text.split('')} active={step ? [step - 1] : []} />
      <output className="mt-4 block font-mono text-sm">
        stack = [{stack.join(' ')}] ·{' '}
        {ok
          ? step === text.length && stack.length === 0
            ? 'правильно'
            : 'поки правильно'
          : 'помилка'}
      </output>
      <Controls
        step={step}
        total={text.length}
        setStep={setStep}
        next="Прочитати символ"
      />
    </VisualFrame>
  );
}

function MonotonicStackVisual() {
  const values = [2, 4, 3, 7];
  const [step, setStep] = useState(0);
  const stack: number[] = [],
    answer = Array(values.length).fill('—');
  for (let i = 0; i < step; ++i) {
    while (stack.length && values[stack.at(-1)!] < values[i])
      answer[stack.pop()!] = values[i];
    stack.push(i);
  }
  return (
    <VisualFrame
      eyebrow="Monotonic Stack"
      title="Кожен індекс входить і виходить не більше одного разу"
    >
      <Cells values={values} active={stack} />
      <output className="mt-4 block font-mono text-sm leading-7">
        stack indices = [{stack.join(', ')}]<br />
        next greater = [{answer.join(', ')}]
      </output>
      <Controls
        step={step}
        total={values.length}
        setStep={setStep}
        next="Додати індекс"
      />
    </VisualFrame>
  );
}

function MonotonicQueueVisual() {
  const values = [2, 1, 5, 3, 4, 8],
    k = 3;
  const [step, setStep] = useState(0);
  const deque: number[] = [],
    answers: number[] = [];
  for (let i = 0; i < step; ++i) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && values[deque.at(-1)!] <= values[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) answers.push(values[deque[0]]);
  }
  return (
    <VisualFrame
      eyebrow="Sliding Window + Monotonic Queue"
      title="Deque зберігає лише кандидатів на максимум"
    >
      <div className="overflow-x-auto pb-1">
        <Cells values={values} active={deque} />
      </div>
      <output className="mt-4 block font-mono text-sm leading-7">
        deque indices = [{deque.join(', ')}]<br />
        готові максимуми = [{answers.join(', ')}]
      </output>
      <Controls
        step={step}
        total={values.length}
        setStep={setStep}
        next="Посунути праву межу"
      />
    </VisualFrame>
  );
}

export function CoreVisual({ kind }: { kind: CoreVisualKind }) {
  const views = {
    'two-pointers': TwoPointersVisual,
    'sliding-window': SlidingWindowVisual,
    'binary-search': BinarySearchVisual,
    'greedy-order': GreedyOrderVisual,
    'interval-greedy': IntervalVisual,
    brackets: BracketsVisual,
    'monotonic-stack': MonotonicStackVisual,
    'monotonic-queue': MonotonicQueueVisual,
  };
  const View = views[kind];
  return <View />;
}
