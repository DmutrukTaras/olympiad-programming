import { BookOpenCheck } from 'lucide-react';
import { ProgressiveTaskStages } from '@/components/content/progressive-task-stages';
import { LevelBadge } from '@/components/content/level-badge';
import { TaskExamples } from '@/components/content/task-examples';
import type { LearningProblem } from '@/types/content';

export function LearningTask({ task }: { task: LearningProblem }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="border-b border-border p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-primary">
            <BookOpenCheck className="size-4" aria-hidden="true" />
            Навчальна задача
          </div>
          <LevelBadge level={task.level} />
        </div>
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">
          {task.title}
        </h3>
        <p className="mt-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Умова · Авторська задача
        </p>
        <div className="mt-3 space-y-3 leading-7 text-muted-foreground">
          {task.statement.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2">
        <div className="bg-card p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Вхідні дані
          </p>
          <p className="mt-2 text-sm leading-6">{task.input}</p>
        </div>
        <div className="bg-card p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Вихідні дані
          </p>
          <p className="mt-2 text-sm leading-6">{task.output}</p>
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-7">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Constraints
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {task.constraints.map((constraint) => (
            <code
              key={constraint}
              className="rounded-lg bg-muted px-2.5 py-1.5 text-xs"
            >
              {constraint}
            </code>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-5 sm:px-7">
        <div className="pt-5">
          <TaskExamples examples={task.examples} />
        </div>
        <ProgressiveTaskStages key={task.id} stages={task.stages} />
      </div>
    </article>
  );
}
