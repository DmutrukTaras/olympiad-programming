import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { ContentBlocks } from '@/components/content/content-blocks';
import { icpcContests, icpcProblemHref, icpcSourceUrl } from '@/content/icpc';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Params = { contest: string; problem: string };

export function generateStaticParams() {
  return icpcContests.flatMap((contest) =>
    contest.problems.map((problem) => ({
      contest: contest.slug,
      problem: problem.slug,
    })),
  );
}

function getProblem(params: Params) {
  return icpcContests
    .find((contest) => contest.slug === params.contest)
    ?.problems.find((problem) => problem.slug === params.problem);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const problem = getProblem(await params);
  return problem
    ? {
        title: `${problem.letter}. ${problem.title} — розбір ICPC`,
        description: problem.summary,
      }
    : {};
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const route = await params;
  const icpcContest = icpcContests.find(
    (contest) => contest.slug === route.contest,
  );
  const problem = getProblem(route);
  if (!problem || !icpcContest) notFound();
  const index = icpcContest.problems.indexOf(problem);
  const previous = icpcContest.problems[index - 1];
  const next = icpcContest.problems[index + 1];
  return (
    <main className="page-shell py-10 sm:py-14">
      <nav
        aria-label="Навігаційний шлях"
        className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
      >
        <Link href="/icpc" className="hover:text-primary">
          Розбір задач ICPC
        </Link>
        <span aria-hidden="true">/</span>
        <Link href={`/icpc/${icpcContest.slug}`} className="hover:text-primary">
          {icpcContest.title}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Задача {problem.letter}</span>
      </nav>
      <div className="mt-9 grid min-w-0 gap-10 xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-16">
        <article className="min-w-0 max-w-4xl">
          <header>
            <p className="eyebrow">
              Задача {problem.letter} · {problem.difficulty}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {problem.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              {problem.summary}
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {icpcContest.title}. Умова стисло переказана; оригінальний формат
              введення та повна умова — на{' '}
              <a
                href={icpcSourceUrl(problem)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Algotester (нова вкладка)
              </a>
              .
            </p>
          </header>
          <section
            id="patterns"
            className="mt-10 scroll-mt-28 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5 sm:p-6"
          >
            <h2 className="text-2xl font-semibold tracking-tight">
              Які патерни тут працюють
            </h2>
            <div className="mt-5 space-y-5">
              {problem.patterns.map((pattern) => (
                <div key={pattern.label}>
                  <Link
                    href={`/patterns/${pattern.theoryId}/theory`}
                    className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                  >
                    {pattern.label}
                  </Link>
                  <p className="mt-1.5 leading-7 text-muted-foreground">
                    {pattern.signal}
                  </p>
                </div>
              ))}
            </div>
          </section>
          {problem.sections.map((section, i) => (
            <section
              key={section.title}
              id={`section-${i + 1}`}
              className="mt-10 scroll-mt-28 border-t border-border pt-8"
            >
              <h2 className="mb-5 text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <ContentBlocks blocks={section.blocks} />
            </section>
          ))}
          <section
            id="complexity"
            className="mt-10 scroll-mt-28 border-t border-border pt-8"
          >
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Складність
            </h2>
            <p className="leading-7 text-muted-foreground">
              {problem.complexity}
            </p>
          </section>
          <section
            id="pitfalls"
            className="mt-10 scroll-mt-28 border-t border-border pt-8"
          >
            <h2 className="mb-5 text-2xl font-semibold tracking-tight">
              Типові помилки
            </h2>
            <ContentBlocks
              blocks={[{ type: 'list', items: problem.pitfalls }]}
            />
          </section>
          <aside className="mt-10 rounded-2xl bg-muted/60 p-5 text-sm leading-6 text-muted-foreground">
            Розбір підготовлено на основі наданого короткого матеріалу з
            доповненими поясненнями, псевдокодом і перевірками. Псевдокод описує
            алгоритм; введення та виведення потрібно оформити відповідно до
            оригінальної умови.
          </aside>
          <section
            id="practice"
            className="mt-10 scroll-mt-28 rounded-2xl border border-primary/25 bg-primary/[0.06] p-6 sm:p-8"
          >
            <p className="eyebrow">Тепер ваша черга</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Спробуйте розв’язати самостійно
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Відкрийте умову, реалізуйте алгоритм і надішліть розв’язок на
              перевірку.
            </p>
            <a
              href={icpcSourceUrl(problem)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-5 h-auto min-h-11 whitespace-normal text-center',
              )}
            >
              Розв’язати на Algotester{' '}
              <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
              <span className="sr-only"> (нова вкладка)</span>
            </a>
          </section>
          <nav
            aria-label="Сусідні задачі"
            className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={icpcProblemHref(previous, icpcContest.slug)}
                className="flex items-center gap-2 rounded-xl border border-border p-4 text-sm hover:bg-muted"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
                {previous.letter}. {previous.title}
              </Link>
            ) : (
              <Link
                href={`/icpc/${icpcContest.slug}`}
                className="flex items-center gap-2 rounded-xl border border-border p-4 text-sm hover:bg-muted"
              >
                <ArrowLeft className="size-4 shrink-0" aria-hidden="true" /> Усі
                задачі етапу
              </Link>
            )}
            {next ? (
              <Link
                href={icpcProblemHref(next, icpcContest.slug)}
                className="flex items-center justify-end gap-2 rounded-xl border border-border p-4 text-right text-sm hover:bg-muted"
              >
                {next.letter}. {next.title}
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href={`/icpc/${icpcContest.slug}`}
                className="flex items-center justify-end gap-2 rounded-xl border border-border p-4 text-sm hover:bg-muted"
              >
                Усі задачі етапу
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
            )}
          </nav>
        </article>
        <aside className="hidden xl:block">
          <nav
            aria-label="На цій сторінці"
            className="sticky top-28 space-y-3 border-l border-border pl-5 text-sm"
          >
            <p className="mb-4 font-semibold">У цьому розборі</p>
            <a
              href="#patterns"
              className="block text-muted-foreground hover:text-primary"
            >
              Патерни
            </a>
            {problem.sections.map((section, i) => (
              <a
                key={section.title}
                href={`#section-${i + 1}`}
                className="block leading-6 text-muted-foreground hover:text-primary"
              >
                {section.title}
              </a>
            ))}
            <a
              href="#complexity"
              className="block text-muted-foreground hover:text-primary"
            >
              Складність
            </a>
            <a
              href="#pitfalls"
              className="block text-muted-foreground hover:text-primary"
            >
              Типові помилки
            </a>
            <a href="#practice" className="block font-medium text-primary">
              Практика на Algotester ↗
            </a>
            <Link
              href={`/icpc/${icpcContest.slug}`}
              className="mt-5 block border-t border-border pt-4 text-muted-foreground hover:text-primary"
            >
              ← Усі задачі етапу
            </Link>
          </nav>
        </aside>
      </div>
    </main>
  );
}
