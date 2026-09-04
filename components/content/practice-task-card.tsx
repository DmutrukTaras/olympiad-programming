import { ExternalLink } from 'lucide-react';
import { LevelBadge } from '@/components/content/level-badge';
import { ProgressiveTaskStages } from '@/components/content/progressive-task-stages';
import { TaskExamples } from '@/components/content/task-examples';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PracticeProblem } from '@/types/content';

export function PracticeTaskCard({ task }: { task: PracticeProblem }) {
  return (
    <article
      id={`practice-${task.id}`}
      className="scroll-mt-28 rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
            Самостійна практика ·{' '}
            {task.source === 'author' ? 'Авторська' : 'Algotester'}
          </p>
          <h3 className="mt-2 font-semibold">{task.title}</h3>
        </div>
        <LevelBadge level={task.level} compact />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {task.statement[0]}
      </p>
      {task.source === 'author' && (
        <details className="mt-4 rounded-xl border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium">
            Повна умова
          </summary>
          <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
            {task.statement.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div>
              <h4 className="font-semibold text-foreground">Вхідні дані</h4>
              <p>{task.input}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Вихідні дані</h4>
              <p>{task.output}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Constraints</h4>
              <ul className="mt-2 space-y-1 font-mono text-xs">
                {task.constraints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <TaskExamples examples={task.examples} />
          </div>
          {task.hint && (
            <details className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <summary className="cursor-pointer text-sm font-semibold">
                Відкрити одну підказку
              </summary>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {task.hint}
              </p>
            </details>
          )}
          {task.hasEditorial && (
            <ProgressiveTaskStages key={task.id} stages={task.stages} />
          )}
        </details>
      )}
      {task.externalUrl && (
        <a
          href={task.externalUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'mt-5',
          )}
        >
          Розв’язати на Algotester
          <ExternalLink aria-hidden="true" />
        </a>
      )}
    </article>
  );
}
