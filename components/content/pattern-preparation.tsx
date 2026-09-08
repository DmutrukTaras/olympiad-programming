import { ChevronDown } from 'lucide-react';
import { ContentBlocks } from '@/components/content/content-blocks';
import type { PatternPreparation as Preparation } from '@/types/content';

export function PatternPreparation({ content }: { content: Preparation }) {
  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.045] p-5 sm:p-6">
        <p className="eyebrow">Перед першою спробою · база знань</p>
        <p className="mt-3 leading-7 text-muted-foreground">
          {content.introduction}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Приклади нижче — окремі навчальні фрагменти, не розв’язок задачі.
          Якщо не зазначено інше, розміщуй їх усередині main(), додавши потрібні
          заголовки та using namespace std; перед main(). Для вводу й виводу
          потрібен заголовок &lt;iostream&gt;.
        </p>
      </div>

      {content.sections.map((section, index) => (
        <section
          id={`section-${index + 1}`}
          key={section.title}
          className="scroll-mt-28 border-t border-border pt-9 first:border-t-0 first:pt-0"
        >
          <p className="font-mono text-xs text-primary">
            {String(index + 1).padStart(2, '0')}
          </p>
          <h2 className="mb-5 mt-2 text-2xl font-semibold tracking-tight">
            {section.title}
          </h2>
          <ContentBlocks blocks={section.blocks} />
        </section>
      ))}

      {content.questions.length > 0 && (
        <section id="self-check" className="scroll-mt-28 border-t border-border pt-9">
          <h2 className="text-2xl font-semibold tracking-tight">
            Перевір себе перед задачею
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Спробуй відповісти подумки, а тоді відкрий пояснення.
          </p>
          <div className="mt-5 space-y-3">
            {content.questions.map(({ question, answer }, index) => (
              <details
                key={question}
                className="group/question rounded-xl border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-start gap-3 rounded-xl p-4 text-sm font-medium leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                  <span className="font-mono text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">{question}</span>
                  <ChevronDown
                    className="mt-1 size-4 shrink-0 text-muted-foreground motion-safe:transition-transform group-open/question:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="border-t border-border px-4 py-4 text-sm leading-7 text-muted-foreground">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
