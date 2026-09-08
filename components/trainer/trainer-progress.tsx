import type { ReactNode } from 'react';

export function TrainerProgress({
  current,
  total,
  correct,
  itemLabel,
  context,
}: {
  current: number;
  total: number;
  correct: number;
  itemLabel: 'Задача' | 'Питання';
  context?: ReactNode;
}) {
  return (
    <div className="mb-7 rounded-2xl border border-border bg-card px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold">
            {itemLabel} {current} з {total}
          </span>
          {context}
        </div>
        <span className="text-muted-foreground">
          Правильно: <strong className="text-foreground">{correct}</strong>
        </span>
      </div>
      <progress
        className="mt-3 block h-1.5 w-full overflow-hidden rounded-full bg-muted accent-primary [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
        aria-label="Прогрес тренування"
        max={total}
        value={current}
      />
    </div>
  );
}
