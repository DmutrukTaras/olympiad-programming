'use client';

import { BookOpenCheck, ExternalLink } from 'lucide-react';
import { ContentBlocks } from '@/components/content/content-blocks';
import { LevelBadge } from '@/components/content/level-badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/content';

export function LearningTask({ task }: { task: Task }) {
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
        <h3 className="mt-5 text-2xl font-semibold tracking-tight">{task.title}</h3>
        <div className="mt-4 space-y-3 leading-7 text-muted-foreground">
          {task.statement.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2">
        <div className="bg-card p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Вхідні дані</p>
          <p className="mt-2 text-sm leading-6">{task.input}</p>
        </div>
        <div className="bg-card p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Вихідні дані</p>
          <p className="mt-2 text-sm leading-6">{task.output}</p>
        </div>
      </div>

      <div className="border-t border-border p-5 sm:p-7">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Constraints</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {task.constraints.map((constraint) => (
            <code key={constraint} className="rounded-lg bg-muted px-2.5 py-1.5 text-xs">{constraint}</code>
          ))}
        </div>
      </div>

      <div className="border-t border-border px-5 py-2 sm:px-7">
        <p className="pb-2 pt-4 text-sm font-semibold">Відкривай розбір поступово</p>
        <Accordion multiple className="pb-3">
          {task.stages.map((stage, index) => (
            <AccordionItem key={stage.id} value={stage.id}>
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {stage.title}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-8">
                <ContentBlocks blocks={stage.blocks} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {task.externalUrl && (
        <div className="border-t border-border p-5 sm:p-7">
          <a
            href={task.externalUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4')}
          >
            Розв’язати на Algotester
            <ExternalLink aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}
