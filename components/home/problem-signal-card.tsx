'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Braces, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LevelId } from '@/types/content';

type SignalVariant = {
  cue: string;
  constraints: string;
  slowLabel: string;
  slowComplexity: string;
  fastLabel: string;
  fastComplexity: string;
  pattern: string;
  level: LevelId;
};

const variants: SignalVariant[] = [
  {
    cue: 'Багато запитів про суму на відрізку',
    constraints: 'n, q ≤ 2 · 10⁵',
    slowLabel: 'brute force',
    slowComplexity: 'O(n · q)',
    fastLabel: 'потрібен preprocessing',
    fastComplexity: 'O(n + q)',
    pattern: 'Prefix Sum',
    level: 'foundation',
  },
  {
    cue: 'Потрібно знайти найменшу допустиму відповідь',
    constraints: 'answer ∈ [1, 10¹⁸]',
    slowLabel: 'перебрати всі значення',
    slowComplexity: 'O(V)',
    fastLabel: 'умова монотонна',
    fastComplexity: 'O(log V)',
    pattern: 'Binary Search',
    level: 'core',
  },
  {
    cue: 'Найдовший відрізок із сумою не більшою за k',
    constraints: 'n ≤ 2 · 10⁵, aᵢ ≥ 0',
    slowLabel: 'усі пари меж',
    slowComplexity: 'O(n²)',
    fastLabel: 'ліва межа лише зростає',
    fastComplexity: 'O(n)',
    pattern: 'Sliding Window',
    level: 'core',
  },
  {
    cue: 'Найменша кількість переходів у неваговому графі',
    constraints: 'n, m ≤ 2 · 10⁵',
    slowLabel: 'перебір маршрутів',
    slowComplexity: 'експонента',
    fastLabel: 'рухаємось шарами',
    fastComplexity: 'O(n + m)',
    pattern: 'BFS',
    level: 'core',
  },
  {
    cue: 'Вибрати максимум відрізків, що не перетинаються',
    constraints: 'n ≤ 2 · 10⁵',
    slowLabel: 'перебрати підмножини',
    slowComplexity: 'O(2ⁿ)',
    fastLabel: 'брати найраніше завершення',
    fastComplexity: 'O(n log n)',
    pattern: 'Greedy',
    level: 'core',
  },
  {
    cue: 'Порахувати кількість способів дістатися позиції n',
    constraints: 'n ≤ 10⁶',
    slowLabel: 'рекурсія без пам’яті',
    slowComplexity: 'O(2ⁿ)',
    fastLabel: 'відповідь залежить від станів',
    fastComplexity: 'O(n)',
    pattern: 'Dynamic Programming',
    level: 'core',
  },
];

const accentClasses: Record<LevelId, string> = {
  foundation: 'text-level-foundation',
  core: 'text-level-core',
  combination: 'text-level-combination',
  advanced: 'text-level-advanced',
  challenge: 'text-level-challenge',
};

function randomOtherIndex(current: number) {
  if (variants.length < 2) return current;
  const offset = 1 + Math.floor(Math.random() * (variants.length - 1));
  return (current + offset) % variants.length;
}

export function ProblemSignalCard() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const variant = variants[selected];

  useEffect(() => {
    setSelected(Math.floor(Math.random() * variants.length));
  }, []);

  return (
    <div className="problem-note relative mx-auto max-w-lg lg:mx-0">
      <div className="mb-7 flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Сигнал у задачі
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={cn('level-dot mr-1 bg-current', accentClasses[variant.level])}
            aria-label={`Рівень ${variant.level}`}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-muted-foreground"
            onClick={() => setSelected((current) => randomOtherIndex(current))}
            aria-label="Показати інший сигнал"
            title="Інший сигнал"
          >
            <Shuffle aria-hidden="true" />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={selected}
          aria-live="polite"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="min-h-[3.5rem] text-xl font-semibold tracking-tight">
            {variant.cue}
          </h2>
          <div className="mt-6 space-y-4 font-mono text-[0.92rem] leading-7">
            <p className="rounded-xl bg-muted/70 px-4 py-3">{variant.constraints}</p>
            <div className="signal-line">
              <span>{variant.slowLabel}</span>
              <span className="shrink-0 text-destructive">{variant.slowComplexity}</span>
            </div>
            <div className="signal-line">
              <span>{variant.fastLabel}</span>
              <span className={cn('shrink-0 font-semibold', accentClasses[variant.level])}>
                {variant.fastComplexity}
              </span>
            </div>
          </div>
          <div className="mt-7 flex items-center gap-3 border-t border-border pt-5 text-sm">
            <Braces className={cn('size-4', accentClasses[variant.level])} aria-hidden="true" />
            <span className="text-muted-foreground">Патерн:</span>
            <span className="font-semibold">{variant.pattern}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
