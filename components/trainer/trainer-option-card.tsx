'use client';

import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TrainerOptionState = 'idle' | 'selected' | 'correct' | 'wrong';

export function TrainerOptionCard({
  name,
  value,
  label,
  checked,
  disabled,
  state,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  state: TrainerOptionState;
  onChange: () => void;
}) {
  return (
    <label
      aria-label={label}
      className={cn(
        'relative cursor-pointer rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/45 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50',
        state === 'selected' && 'border-primary/60 bg-primary/5',
        state === 'correct' && 'border-primary bg-primary/10',
        state === 'wrong' && 'border-destructive bg-destructive/10',
        disabled && 'cursor-default',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="sr-only"
      />
      <span className="flex items-start gap-3">
        <span
          className={cn(
            'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-border',
            checked && 'border-primary',
            state === 'correct' &&
              'border-primary bg-primary text-primary-foreground',
            state === 'wrong' && 'border-destructive bg-destructive text-white',
          )}
          aria-hidden="true"
        >
          {state === 'correct' && <Check className="size-3" />}
          {state === 'wrong' && <X className="size-3" />}
        </span>
        <span className="min-w-0 text-sm font-medium leading-5">
          {label}
          {state === 'correct' && (
            <span className="mt-1 block text-xs font-normal text-primary">
              Правильна відповідь
            </span>
          )}
          {state === 'wrong' && (
            <span className="mt-1 block text-xs font-normal text-destructive">
              Твоя відповідь
            </span>
          )}
        </span>
      </span>
    </label>
  );
}
