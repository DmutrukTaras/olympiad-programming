import { BookOpen, ChevronDown } from 'lucide-react';
import { ContentBlocks } from '@/components/content/content-blocks';
import type { PatternPreparation as Preparation } from '@/types/content';

export function PatternPreparation({ content }: { content: Preparation }) {
  return (
    <section id="preparation" className="scroll-mt-28 py-8">
      <details className="group/preparation rounded-2xl border border-primary/20 bg-card">
        <summary className="cursor-pointer list-none rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:p-6 [&::-webkit-details-marker]:hidden">
          <h2 className="flex items-start gap-3">
            <BookOpen
              className="mt-1 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-semibold tracking-tight sm:text-xl">
                Теорія та C++: заповнити прогалини
              </span>
              <span className="mt-2 block text-sm font-normal leading-6 text-muted-foreground">
                Необов’язковий refresher потрібних понять, синтаксису, STL і
                типових помилок. Відкрий, якщо щось у патерні ще незнайоме.
              </span>
            </span>
            <ChevronDown
              className="mt-1 size-5 shrink-0 text-muted-foreground motion-safe:transition-transform group-open/preparation:rotate-180"
              aria-hidden="true"
            />
          </h2>
        </summary>

        <div className="space-y-9 border-t border-border p-5 sm:p-6">
          <div>
            <p className="eyebrow">Перед першою спробою · база знань</p>
            <p className="mt-3 leading-7 text-muted-foreground">
              {content.introduction}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Приклади нижче — окремі навчальні фрагменти, не розв’язок задачі.
              Якщо не зазначено інше, розміщуй їх усередині main(), додавши
              потрібні заголовки та using namespace std; перед main(). Для вводу
              й виводу потрібен заголовок &lt;iostream&gt;.
            </p>
          </div>

          {content.sections.map((section) => (
            <section key={section.title}>
              <h3 className="mb-4 text-lg font-semibold tracking-tight">
                {section.title}
              </h3>
              <ContentBlocks blocks={section.blocks} />
            </section>
          ))}

          {content.questions.length > 0 && (
            <section className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold">
                Перевір себе перед задачею
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Спробуй відповісти подумки, а тоді відкрий пояснення.
              </p>
              <div className="mt-4 space-y-3">
                {content.questions.map(({ question, answer }, index) => (
                  <details
                    key={question}
                    className="group/question rounded-xl border border-border bg-background/50"
                  >
                    <summary className="flex cursor-pointer list-none items-start gap-3 rounded-xl p-4 text-sm font-medium leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                      <span className="font-mono text-primary">
                        0{index + 1}
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
      </details>
    </section>
  );
}
