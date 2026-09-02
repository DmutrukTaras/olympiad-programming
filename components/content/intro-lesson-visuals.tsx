import {
  ArrowDown,
  ArrowRight,
  Binary,
  BookOpenText,
  Boxes,
  Braces,
  CheckCircle2,
  GitBranch,
  ListOrdered,
  Network,
  PackageSearch,
  Search,
  Target,
  TestTube2,
  Waypoints,
} from 'lucide-react';
import { VisualFrame } from '@/components/content/lesson-ui';
import { cn } from '@/lib/utils';

function FlowArrow() {
  return (
    <>
      <ArrowRight className="hidden size-5 shrink-0 text-primary/70 sm:block" aria-hidden="true" />
      <ArrowDown className="size-5 shrink-0 text-primary/70 sm:hidden" aria-hidden="true" />
    </>
  );
}

export function StoryToModelVisual() {
  const nodes = [
    {
      title: 'Сюжет',
      text: 'студенти й дружба',
      icon: BookOpenText,
    },
    {
      title: 'Модель',
      text: 'вершини й ребра',
      icon: Network,
    },
    {
      title: 'Ціль',
      text: 'чи існує шлях?',
      icon: Target,
    },
  ];

  return (
    <VisualFrame eyebrow="Переклад умови" title="Від історії — до структури, з якою працює алгоритм">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.title} className="contents">
              <div className="w-full flex-1 rounded-2xl border border-border bg-background p-4">
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-3 font-semibold">{node.title}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{node.text}</p>
              </div>
              {index < nodes.length - 1 ? <FlowArrow /> : null}
            </div>
          );
        })}
      </div>
    </VisualFrame>
  );
}

export function ComplexityScaleVisual() {
  const rows = [
    { label: 'O(n)', value: '≈ 200 000', width: 'w-[18%]', tone: 'bg-primary' },
    { label: 'O(n log n)', value: '≈ 3 600 000', width: 'w-[38%]', tone: 'bg-level-combination' },
    { label: 'O(n²)', value: '40 000 000 000', width: 'w-full', tone: 'bg-destructive' },
  ];

  return (
    <VisualFrame eyebrow="n = 200 000" title="Різниця між класами складності — це не дрібна оптимізація">
      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex items-baseline justify-between gap-4 font-mono text-xs">
              <span className="font-semibold text-foreground">{row.label}</span>
              <span className="text-muted-foreground">{row.value} умовних кроків</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div className={cn('h-full rounded-full', row.width, row.tone)} />
            </div>
          </div>
        ))}
        <p className="border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
          Шкала умовна, але співвідношення показове: квадратичний алгоритм виходить далеко за межі
          типового ліміту.
        </p>
      </div>
    </VisualFrame>
  );
}

export function BruteForceVisual() {
  return (
    <VisualFrame eyebrow="Two Sum" title="Замість усіх пар — один конкретний пошук для кожного елемента">
      <div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.045] p-4">
          <p className="font-mono text-xs font-semibold text-destructive">BRUTE FORCE · O(n²)</p>
          <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden="true">
            {Array.from({ length: 16 }, (_, index) => {
              const row = Math.floor(index / 4);
              const column = index % 4;
              const active = column > row;
              return (
                <span
                  key={index}
                  className={cn(
                    'aspect-square rounded-md border',
                    active ? 'border-destructive/35 bg-destructive/20' : 'border-border bg-muted/50',
                  )}
                />
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Перевіряємо кожну можливу пару.</p>
        </div>

        <ArrowRight className="mx-auto hidden size-5 text-primary sm:block" aria-hidden="true" />
        <ArrowDown className="mx-auto size-5 text-primary sm:hidden" aria-hidden="true" />

        <div className="rounded-2xl border border-primary/25 bg-primary/[0.055] p-4">
          <p className="font-mono text-xs font-semibold text-primary">HASHING · O(n)</p>
          <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-border bg-background p-4">
            <span className="font-mono text-sm">a[i]</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary px-3 py-2 font-mono text-sm text-primary-foreground">
              x − a[i]
            </span>
            <Search className="size-4 text-primary" aria-hidden="true" />
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Шукаємо лише потрібне доповнення.</p>
        </div>
      </div>
    </VisualFrame>
  );
}

export function HypothesisLoopVisual() {
  const steps = [
    { title: 'Сигнал', text: 'мінімізувати максимум', icon: Search },
    { title: 'Гіпотеза', text: 'binary search?', icon: PackageSearch },
    { title: 'Перевірка', text: 'чи can(x) монотонна?', icon: TestTube2 },
    { title: 'Рішення', text: 'доведення або контрприклад', icon: CheckCircle2 },
  ];

  return (
    <VisualFrame eyebrow="Мислення патернами" title="Патерн — це кандидат, а не готовий діагноз">
      <div className="grid gap-3 sm:grid-cols-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/[0.09] text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.13em] text-muted-foreground">
                  Крок {index + 1}
                </p>
                <p className="mt-1 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">{step.text}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 font-mono text-xs text-primary">
        <GitBranch className="size-4" aria-hidden="true" />
        якщо перевірка не пройдена — повертаємось до моделі
      </div>
    </VisualFrame>
  );
}

export function StlToolboxVisual() {
  const tools = [
    { name: 'vector', use: 'індекс і послідовність', icon: ListOrdered },
    { name: 'set / map', use: 'пошук і ключі', icon: Binary },
    { name: 'queue', use: 'порядок FIFO', icon: Waypoints },
    { name: 'priority_queue', use: 'поточний min / max', icon: Boxes },
  ];

  return (
    <VisualFrame eyebrow="STL toolbox" title="Спочатку потрібна операція — потім назва контейнера">
      <div className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div key={tool.name} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/[0.09] text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold text-foreground">{tool.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{tool.use}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] px-4 py-3 font-mono text-xs text-muted-foreground">
        <Braces className="size-4 text-primary" aria-hidden="true" />
        операції
        <ArrowRight className="size-3.5 text-primary" aria-hidden="true" />
        складність
        <ArrowRight className="size-3.5 text-primary" aria-hidden="true" />
        контейнер
      </div>
    </VisualFrame>
  );
}
