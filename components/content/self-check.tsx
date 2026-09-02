'use client';

import { CircleHelp, Sparkles } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface SelfCheckQuestion {
  question: string;
  answer: string;
}

export function SelfCheck({ questions }: { questions: SelfCheckQuestion[] }) {
  return (
    <section id="self-check" className="scroll-mt-28 border-t border-border py-10">
      <div className="rounded-3xl border border-primary/20 bg-primary/[0.045] p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CircleHelp className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="eyebrow">Коротка самоперевірка</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Перевір себе</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Спробуй відповісти самостійно, а потім відкрий пояснення.
            </p>
          </div>
        </div>

        <Accordion multiple className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          {questions.map((item, index) => (
            <AccordionItem key={item.question} value={`question-${index + 1}`} className="px-4 sm:px-5">
              <AccordionTrigger className="gap-4 py-4 text-[0.95rem] no-underline hover:no-underline">
                <span className="flex gap-3">
                  <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, '0')}</span>
                  <span>{item.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pl-7 pr-8 text-sm leading-6 text-muted-foreground">
                <p className="flex items-start gap-2">
                  <Sparkles className="mt-1 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item.answer}</span>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
