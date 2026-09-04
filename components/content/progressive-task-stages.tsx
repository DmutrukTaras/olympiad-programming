'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ContentBlocks } from '@/components/content/content-blocks';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { TaskStage } from '@/types/content';

export function ProgressiveTaskStages({ stages }: { stages: TaskStage[] }) {
  const [revealed, setRevealed] = useState(1);
  const [opened, setOpened] = useState<string[]>(
    stages[0] ? [stages[0].id] : [],
  );
  const nextStage = stages[revealed];

  if (stages.length === 0) return null;

  return (
    <div className="py-5">
      <p className="text-sm font-semibold">Відкривай розбір поступово</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Зупинись на кожному кроці й сформулюй власну ідею. До відкритих кроків
        можна повертатися.
      </p>
      <Accordion
        multiple
        value={opened}
        onValueChange={setOpened}
        className="mt-3"
      >
        {stages.slice(0, revealed).map((stage, index) => (
          <AccordionItem key={stage.id} value={stage.id}>
            <AccordionTrigger className="py-4 hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {stage.title}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-5 sm:pl-8">
              <ContentBlocks blocks={stage.blocks} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <output className="font-mono text-xs text-muted-foreground">
          Відкрито {Math.min(revealed, stages.length)} із {stages.length} кроків
        </output>
        {nextStage ? (
          <Button
            variant="outline"
            className="h-auto min-h-10 whitespace-normal py-2 text-left"
            onClick={() => {
              setRevealed((count) => Math.min(count + 1, stages.length));
              setOpened([nextStage.id]);
            }}
          >
            Далі: {nextStage.title}
            <ArrowRight className="shrink-0" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              setRevealed(1);
              setOpened([stages[0].id]);
            }}
          >
            Почати спочатку
          </Button>
        )}
      </div>
    </div>
  );
}
