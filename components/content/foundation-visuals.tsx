'use client';

import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisualFrame } from '@/components/content/lesson-ui';
import { cn } from '@/lib/utils';
import type { FoundationVisualKind } from '@/types/content';

function Cells({
  values,
  selected = [],
  labels,
}: {
  values: (string | number)[];
  selected?: number[];
  labels?: string[];
}) {
  return (
    <div
      className="grid gap-1.5"
      style={{
        gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))`,
      }}
    >
      {values.map((value, index) => (
        <div key={index} className="min-w-0 text-center">
          <div
            className={cn(
              'rounded-lg border border-border bg-muted/40 px-1 py-3 font-mono text-sm transition-colors motion-reduce:transition-none',
              selected.includes(index) &&
                'border-primary bg-primary/15 font-bold ring-1 ring-primary/30',
            )}
          >
            {value}
          </div>
          {labels && (
            <span className="mt-1 block font-mono text-[0.65rem] text-muted-foreground">
              {labels[index]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function StepControls({
  step,
  total,
  onChange,
  label,
}: {
  step: number;
  total: number;
  onChange: (step: number) => void;
  label: string;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        disabled={step >= total}
        onClick={() => onChange(step + 1)}
        className="min-h-10"
      >
        {label}
        <ArrowRight aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => onChange(0)}
        aria-label="Почати схему спочатку"
        className="min-h-10"
      >
        <RotateCcw aria-hidden="true" />
        Спочатку
      </Button>
      <span className="ml-auto font-mono text-xs text-muted-foreground">
        {step} / {total}
      </span>
    </div>
  );
}

function ScanVisual() {
  const values = [2, 3, 0, 4, 5, 6, -1, 2];
  const [step, setStep] = useState(0);
  let current = 0,
    best = 0,
    count = 0;
  for (const value of values.slice(0, step)) {
    current = value > 0 ? current + 1 : 0;
    if (value > 0) count++;
    best = Math.max(best, current);
  }
  return (
    <VisualFrame
      eyebrow="Один прохід · крок за кроком"
      title="Три лічильники замість перебору серій"
    >
      <Cells
        values={values}
        selected={step > 0 ? [step - 1] : []}
        labels={values.map((_, i) => String(i + 1))}
      />
      <output className="mt-5 block rounded-xl bg-muted/50 p-4 font-mono text-sm leading-7">
        count = {count} · current = {current} · best = {best}
        <span className="block font-sans text-muted-foreground">
          {step === 0
            ? 'Ще не прочитано жодного дня.'
            : `Оброблено день ${step}: ${values[step - 1] > 0 ? 'продовжуємо серію' : 'обриваємо серію'}.`}
        </span>
      </output>
      <StepControls
        step={step}
        total={values.length}
        onChange={setStep}
        label="Наступний день"
      />
    </VisualFrame>
  );
}

function RobotVisual() {
  const commands = 'LRRRRLL';
  const [step, setStep] = useState(0);
  let position = 1,
    moves = 0,
    ignored = false;
  for (const command of commands.slice(0, step)) {
    const candidate = position + (command === 'R' ? 1 : -1);
    ignored = candidate < 1 || candidate > 4;
    if (!ignored) {
      position = candidate;
      moves++;
    }
  }
  return (
    <VisualFrame eyebrow="Симуляція · межі стану" title="Доріжка з 4 клітинок">
      <Cells
        values={[1, 2, 3, 4]}
        selected={[position - 1]}
        labels={[1, 2, 3, 4].map((cell) =>
          cell === position ? 'Робот' : 'Клітинка',
        )}
      />
      <div className="mt-5">
        <Cells
          values={commands.split('')}
          selected={step > 0 ? [step - 1] : []}
        />
      </div>
      <output className="mt-4 block text-sm leading-7">
        position = {position}, moves = {moves}.{' '}
        {step === 0
          ? 'Початковий стан.'
          : ignored
            ? 'Останню команду ігноруємо: межа доріжки.'
            : 'Останній рух дозволений.'}
      </output>
      <StepControls
        step={step}
        total={commands.length}
        onChange={setStep}
        label="Наступна команда"
      />
    </VisualFrame>
  );
}

function SortingVisual() {
  const [sorted, setSorted] = useState(false);
  return (
    <VisualFrame
      eyebrow="Сортування · локальна властивість"
      title="Від усіх пар до сусідніх проміжків"
    >
      <Cells
        values={sorted ? [3, 8, 10, 12, 20] : [12, 3, 8, 20, 10]}
        selected={sorted ? [1, 2, 3] : []}
      />
      <output className="mt-4 block min-h-14 text-sm leading-7 text-muted-foreground">
        {sorted
          ? 'Сусідні різниці: 5, 2, 2, 8. Мінімум = 2; підходять пари (8,10) та (10,12).'
          : 'Для 5 значень є 10 різних пар. Спершу впорядкуй дані.'}
      </output>
      <Button
        variant="outline"
        className="mt-3 min-h-10"
        onClick={() => setSorted(!sorted)}
      >
        {sorted ? 'Початковий порядок' : 'Відсортувати'}
      </Button>
    </VisualFrame>
  );
}

function PrefixVisual() {
  const values = [5, -2, 4, 0, 3];
  const pref = [0, 5, 3, 7, 7, 10];
  const ranges = [
    [1, 3],
    [2, 5],
    [4, 4],
  ];
  const [selected, setSelected] = useState(0);
  const [l, r] = ranges[selected];
  return (
    <VisualFrame
      eyebrow="Prefix Sum · зміни запит"
      title="Прибираємо зайвий префікс"
    >
      <p className="mb-2 font-mono text-xs text-muted-foreground">a[1…5]</p>
      <Cells
        values={values}
        selected={values
          .map((_, i) => i)
          .filter((i) => i + 1 >= l && i + 1 <= r)}
        labels={values.map((_, i) => String(i + 1))}
      />
      <p className="mb-2 mt-5 font-mono text-xs text-muted-foreground">
        pref[0…5]
      </p>
      <Cells
        values={pref}
        selected={[l - 1, r]}
        labels={pref.map((_, i) => String(i))}
      />
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Приклади запитів">
        {ranges.map(([start, end], i) => (
          <Button
            key={i}
            variant={i === selected ? 'default' : 'outline'}
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
            className="min-h-10"
          >
            [{start}, {end}]
          </Button>
        ))}
      </div>
      <output className="mt-4 block font-mono text-sm leading-7">
        sum({l}, {r}) = pref[{r}] − pref[{l - 1}] = {pref[r]} − {pref[l - 1]} ={' '}
        {pref[r] - pref[l - 1]}
      </output>
    </VisualFrame>
  );
}

function DifferenceVisual() {
  return (
    <VisualFrame
      eyebrow="Difference Array · внесок однієї операції"
      title="Додати 3 на відрізку [2,4]"
    >
      <p className="mb-2 text-sm text-muted-foreground">
        У позиції 2 внесок починається, у 5 — закінчується.
      </p>
      <Cells
        values={[0, '+3', 0, 0, '−3', 0]}
        selected={[1, 4]}
        labels={['1', '2', '3', '4', '5', '6']}
      />
      <p className="my-4 text-sm text-muted-foreground">
        Накопичуємо зліва направо ↓
      </p>
      <Cells values={[0, 3, 3, 3, 0, 0]} selected={[1, 2, 3]} />
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        Поза [2,4] внесок нульовий. Незалежні операції просто додають свої
        позначки.
      </p>
    </VisualFrame>
  );
}

function GridVisual() {
  const matrix = [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 1, 0, 0],
  ];
  const ranges = [
    [1, 2, 3, 4],
    [1, 1, 2, 2],
    [3, 1, 3, 4],
  ];
  const [selected, setSelected] = useState(0);
  const [x1, y1, x2, y2] = ranges[selected];
  const pref = Array.from({ length: 4 }, () => Array<number>(5).fill(0));
  for (let i = 1; i <= 3; i++)
    for (let j = 1; j <= 4; j++) {
      pref[i][j] =
        matrix[i - 1][j - 1] +
        pref[i - 1][j] +
        pref[i][j - 1] -
        pref[i - 1][j - 1];
    }
  const terms = [
    pref[x2][y2],
    pref[x1 - 1][y2],
    pref[x2][y1 - 1],
    pref[x1 - 1][y1 - 1],
  ];
  return (
    <VisualFrame
      eyebrow="2D Prefix · прямокутник"
      title="Чотири префікси — одна відповідь"
    >
      <p className="mb-4 text-sm text-muted-foreground">
        Рядки й стовпці нумеруються від 1. Виділено [{x1},{y1}]…[{x2},{y2}].
      </p>
      <div className="space-y-1.5">
        {matrix.map((row, i) => (
          <Cells
            key={i}
            values={row}
            selected={row
              .map((_, j) => j)
              .filter(
                (j) => i + 1 >= x1 && i + 1 <= x2 && j + 1 >= y1 && j + 1 <= y2,
              )}
          />
        ))}
      </div>
      <div
        className="mt-5 flex flex-wrap gap-2"
        aria-label="Прямокутники для прикладу"
      >
        {ranges.map((_, i) => (
          <Button
            key={i}
            variant={selected === i ? 'default' : 'outline'}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            className="min-h-10"
          >
            Запит {i + 1}
          </Button>
        ))}
      </div>
      <output className="mt-4 block space-y-2 text-sm leading-7">
        <span className="block font-mono">
          {terms[0]} − {terms[1]} − {terms[2]} + {terms[3]} ={' '}
          {terms[0] - terms[1] - terms[2] + terms[3]}
        </span>
        <span className="block text-muted-foreground">
          Увесь префікс − верхня смуга − ліва смуга + спільний кут. Одиниця в
          клітинці означає дерево.
        </span>
      </output>
    </VisualFrame>
  );
}

function CycleVisual() {
  const [turn, setTurn] = useState(12);
  const player = ((turn - 1) % 5) + 1;
  return (
    <VisualFrame
      eyebrow="Modulo · n = 5"
      title="Повні кола не змінюють відповідь"
    >
      <Cells values={[1, 2, 3, 4, 5]} selected={[player - 1]} />
      <output className="mt-4 block font-mono text-sm leading-7">
        k = {turn}: ({turn} − 1) mod 5 + 1 = {player}
      </output>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="min-h-10"
          onClick={() => setTurn(turn + 1)}
        >
          Наступний хід
        </Button>
        <Button
          variant="outline"
          className="min-h-10"
          onClick={() => setTurn(turn + 5)}
        >
          Ще повне коло (+5)
        </Button>
        <Button variant="ghost" className="min-h-10" onClick={() => setTurn(1)}>
          До ходу 1
        </Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Після гравця 5 черга повертається до 1. Додавання 5 до номера ходу
        залишає того самого гравця.
      </p>
    </VisualFrame>
  );
}

function InvariantVisual() {
  const [cuts, setCuts] = useState(0);
  return (
    <VisualFrame
      eyebrow="Інваріант · підрахунок, не геометрія"
      title="Шоколадка 2 × 3: кожен розріз додає один шматок"
    >
      <Cells
        values={Array.from({ length: cuts + 1 }, (_, i) => i + 1)}
        selected={[cuts]}
      />
      <output className="mt-4 block text-sm leading-7">
        Розрізів: {cuts}. Шматків: {cuts + 1}. Різниця завжди 1.
        {cuts === 5 ? ' Отримали потрібні 6 шматків.' : ''}
      </output>
      <StepControls
        step={cuts}
        total={5}
        onChange={setCuts}
        label="Зробити розріз"
      />
      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        Клітинки схеми позначають кількість шматків, а не їхню форму чи розмір.
      </p>
    </VisualFrame>
  );
}

export function FoundationVisual({ kind }: { kind: FoundationVisualKind }) {
  const views = {
    scan: ScanVisual,
    robot: RobotVisual,
    sorting: SortingVisual,
    prefix: PrefixVisual,
    difference: DifferenceVisual,
    grid: GridVisual,
    cycle: CycleVisual,
    invariant: InvariantVisual,
  };
  const View = views[kind];
  return <View />;
}
