import { ExternalLink } from 'lucide-react';
import { LevelBadge } from '@/components/content/level-badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/content';

export function PracticeTaskCard({ task }: { task: Task }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">Самостійна практика</p>
          <h3 className="mt-2 font-semibold">{task.title}</h3>
        </div>
        <LevelBadge level={task.level} compact />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{task.statement[0]}</p>
      {task.externalUrl && (
        <a
          href={task.externalUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-5')}
        >
          Розв’язати на Algotester
          <ExternalLink aria-hidden="true" />
        </a>
      )}
    </article>
  );
}
