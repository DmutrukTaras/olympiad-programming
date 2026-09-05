'use client';

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { VisualFrame } from '@/components/content/lesson-ui';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CombinationVisualKind } from '@/types/content';

function StepControls({
  step,
  total,
  setStep,
  label = 'Наступний крок',
}: {
  step: number;
  total: number;
  setStep: (step: number) => void;
  label?: string;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        disabled={step === total}
        onClick={() => setStep(Math.min(total, step + 1))}
      >
        {label} <ArrowRight aria-hidden="true" />
      </Button>
      <Button variant="ghost" onClick={() => setStep(0)}>
        <RotateCcw aria-hidden="true" /> Спочатку
      </Button>
      <span className="ml-auto font-mono text-xs text-muted-foreground">
        {step} / {total}
      </span>
    </div>
  );
}

function GraphGridVisual() {
  const grid = ['##..#', '.#..#', '..###'];
  const order = [0, 1, 6, 14, 9, 13, 12];
  const [step, setStep] = useState(0);
  return (
    <VisualFrame
      eyebrow="Grid → Graph"
      title="Один обхід позначає всю компоненту"
    >
      <div className="grid w-fit grid-cols-5 gap-1">
        {grid
          .join('')
          .split('')
          .map((cell, index) => (
            <div
              key={index}
              className={cn(
                'grid size-10 place-items-center rounded-md border font-mono text-sm',
                cell === '.'
                  ? 'border-border bg-muted/30 text-muted-foreground'
                  : 'border-primary/30 bg-primary/10',
                order.slice(0, step).includes(index) &&
                  'border-primary bg-primary text-primary-foreground',
              )}
            >
              {cell}
            </div>
          ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Вершина — клітинка суші; ребро — спільна сторона. Граф будується неявно.
      </p>
      <StepControls
        step={step}
        total={order.length}
        setStep={setStep}
        label="Відвідати клітинку"
      />
    </VisualFrame>
  );
}

function ShortestPathsVisual() {
  const options = [
    ['Усі переходи однакові', 'BFS'],
    ['Ваги лише 0 або 1', '0-1 BFS'],
    ['Усі ваги невід’ємні', 'Dijkstra'],
    ['Є від’ємні ребра', 'Bellman–Ford'],
    ['Малий n, усі пари', 'Floyd–Warshall'],
  ] as const;
  const [selected, setSelected] = useState(0);
  return (
    <VisualFrame eyebrow="Decision tree" title="Алгоритм визначає модель ваг">
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map(([condition, algorithm], index) => (
          <button
            key={condition}
            type="button"
            onClick={() => setSelected(index)}
            className={cn(
              'rounded-xl border p-3 text-left text-sm transition-colors',
              selected === index
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/40',
            )}
          >
            <span className="block text-muted-foreground">{condition}</span>
            <strong className="mt-1 block text-foreground">{algorithm}</strong>
          </button>
        ))}
      </div>
      <output className="mt-4 block rounded-lg bg-muted/40 px-3 py-2 font-mono text-sm">
        {options[selected][0]} → {options[selected][1]}
      </output>
    </VisualFrame>
  );
}

function TopologicalVisual() {
  const labels = ['Алгоритми', 'Графи', 'DP', 'Проєкт'];
  const states = [
    { order: [] as number[], ready: [0] },
    { order: [0], ready: [1] },
    { order: [0, 1], ready: [2] },
    { order: [0, 1, 2], ready: [3] },
    { order: [0, 1, 2, 3], ready: [] },
  ];
  const [step, setStep] = useState(0);
  return (
    <VisualFrame
      eyebrow="Kahn's algorithm"
      title="Беремо лише вершини з indegree = 0"
    >
      <div className="flex flex-wrap gap-2">
        {labels.map((label, index) => (
          <div
            key={label}
            className={cn(
              'rounded-xl border border-border px-3 py-2 text-sm',
              states[step].ready.includes(index) &&
                'border-primary bg-primary/10',
              states[step].order.includes(index) && 'opacity-35 line-through',
            )}
          >
            {label}
          </div>
        ))}
      </div>
      <output className="mt-4 block text-sm text-muted-foreground">
        Порядок:{' '}
        {states[step].order.map((index) => labels[index]).join(' → ') ||
          'ще порожній'}
      </output>
      <StepControls
        step={step}
        total={states.length - 1}
        setStep={setStep}
        label="Виконати доступну вершину"
      />
    </VisualFrame>
  );
}

function EulerTourVisual() {
  const tour = [1, 2, 4, 5, 3, 6];
  const [vertex, setVertex] = useState(2);
  const ranges: Record<number, [number, number]> = {
    1: [0, 5],
    2: [1, 3],
    3: [4, 5],
    4: [2, 2],
    5: [3, 3],
    6: [5, 5],
  };
  const [left, right] = ranges[vertex];
  return (
    <VisualFrame
      eyebrow="Tree → Array"
      title="Піддерево стає неперервним Euler-відрізком"
    >
      <div className="flex flex-wrap gap-2">
        {tour.map((value, index) => (
          <button
            key={value}
            type="button"
            onClick={() => setVertex(value)}
            className={cn(
              'size-11 rounded-lg border border-border font-mono',
              index >= left && index <= right && 'border-primary bg-primary/15',
            )}
          >
            {value}
          </button>
        ))}
      </div>
      <output className="mt-4 block font-mono text-sm">
        subtree({vertex}) → tin = {left}, tout = {right}, range [{left}, {right}
        ]
      </output>
    </VisualFrame>
  );
}

function DsuVisual() {
  const operations = [
    [1, 2],
    [4, 5],
    [2, 3],
    [3, 4],
  ];
  const [step, setStep] = useState(0);
  const parent = [0, 1, 2, 3, 4, 5];
  const find = (value: number) => {
    while (parent[value] !== value) value = parent[value];
    return value;
  };
  for (const [a, b] of operations.slice(0, step)) {
    const first = find(a);
    const second = find(b);
    if (first !== second) parent[second] = first;
  }
  return (
    <VisualFrame
      eyebrow="Disjoint Set Union"
      title="Компоненти лише об’єднуються"
    >
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <div
            key={value}
            className="rounded-xl border border-border px-3 py-2 text-center"
          >
            <span className="block font-mono">{value}</span>
            <span className="text-xs text-muted-foreground">
              root {find(value)}
            </span>
          </div>
        ))}
      </div>
      <StepControls
        step={step}
        total={operations.length}
        setStep={setStep}
        label="Об’єднати наступну пару"
      />
    </VisualFrame>
  );
}

function KruskalVisual() {
  const edges = ['1—2 · 2', '2—3 · 3', '1—3 · 4', '3—4 · 6'];
  const decisions = ['беремо', 'беремо', 'цикл — пропускаємо', 'беремо'];
  const [step, setStep] = useState(0);
  return (
    <VisualFrame
      eyebrow="Sorting + DSU"
      title="Kruskal розглядає ребра від дешевих"
    >
      <div className="space-y-2">
        {edges.map((edge, index) => (
          <div
            key={edge}
            className={cn(
              'flex justify-between rounded-lg border border-border px-3 py-2 font-mono text-sm',
              index < step &&
                decisions[index] === 'беремо' &&
                'border-primary bg-primary/10',
              index < step &&
                decisions[index] !== 'беремо' &&
                'opacity-45 line-through',
            )}
          >
            <span>{edge}</span>
            <span>{index < step ? decisions[index] : 'ще не розглянуто'}</span>
          </div>
        ))}
      </div>
      <StepControls
        step={step}
        total={edges.length}
        setStep={setStep}
        label="Розглянути ребро"
      />
    </VisualFrame>
  );
}

function DpGridVisual() {
  const cost = [
    [1, 3, 1],
    [2, 1, 5],
    [4, 2, 1],
  ];
  const cells = cost.flat();
  const [step, setStep] = useState(0);
  const dp = Array.from({ length: 3 }, () => Array(3).fill(Infinity));
  for (let index = 0; index < step; ++index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const previous =
      row === 0 && col === 0
        ? 0
        : Math.min(
            row ? dp[row - 1][col] : Infinity,
            col ? dp[row][col - 1] : Infinity,
          );
    dp[row][col] = previous + cost[row][col];
  }
  return (
    <VisualFrame
      eyebrow="State → Transition → Order"
      title="Кожна клітинка використовує вже готові стани"
    >
      <div className="grid w-fit grid-cols-3 gap-1.5">
        {cells.map((value, index) => {
          const row = Math.floor(index / 3),
            col = index % 3;
          return (
            <div
              key={index}
              className={cn(
                'grid size-16 place-items-center rounded-lg border border-border text-center text-xs',
                index < step && 'border-primary bg-primary/10',
              )}
            >
              <span>
                cost {value}
                <br />
                <strong>
                  dp {Number.isFinite(dp[row][col]) ? dp[row][col] : '—'}
                </strong>
              </span>
            </div>
          );
        })}
      </div>
      <StepControls
        step={step}
        total={cells.length}
        setStep={setStep}
        label="Обчислити стан"
      />
    </VisualFrame>
  );
}

function RangeStructuresVisual() {
  const options = [
    ['static', 'sum', 'Prefix Sum'],
    ['point update', 'sum', 'Fenwick Tree'],
    ['point update', 'min/max/custom', 'Segment Tree'],
    ['static', 'RMQ min/max', 'Sparse Table'],
    ['range update', 'range query', 'Lazy Segment Tree'],
  ];
  const [selected, setSelected] = useState(1);
  return (
    <VisualFrame
      eyebrow="Операції → структура"
      title="Спочатку випиши updates і queries"
    >
      <div className="space-y-2">
        {options.map(([updates, query, structure], index) => (
          <button
            key={structure}
            type="button"
            onClick={() => setSelected(index)}
            className={cn(
              'grid w-full gap-1 rounded-xl border border-border px-3 py-2 text-left text-sm sm:grid-cols-[1fr_1fr_1.2fr]',
              selected === index && 'border-primary bg-primary/10',
            )}
          >
            <span>{updates}</span>
            <span>{query}</span>
            <strong>{structure}</strong>
          </button>
        ))}
      </div>
      <output className="mt-4 block text-sm text-muted-foreground">
        Для «{options[selected][0]} + {options[selected][1]}» перевір{' '}
        {options[selected][2]}.
      </output>
    </VisualFrame>
  );
}

export function CombinationVisual({ kind }: { kind: CombinationVisualKind }) {
  const views = {
    'graph-grid': GraphGridVisual,
    'shortest-paths': ShortestPathsVisual,
    topological: TopologicalVisual,
    'euler-tour': EulerTourVisual,
    dsu: DsuVisual,
    kruskal: KruskalVisual,
    'dp-grid': DpGridVisual,
    'range-structures': RangeStructuresVisual,
  };
  const View = views[kind];
  return <View />;
}
