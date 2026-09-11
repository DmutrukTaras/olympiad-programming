import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { icpcContests, icpcProblemHref } from '@/content/icpc';

export function generateStaticParams() {
  return icpcContests.map((contest) => ({ contest: contest.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ contest: string }>;
}): Promise<Metadata> {
  const { contest } = await params;
  const icpcContest = icpcContests.find((item) => item.slug === contest);
  if (!icpcContest) return {};
  return { title: icpcContest.title, description: icpcContest.description };
}

export default async function ContestPage({
  params,
}: {
  params: Promise<{ contest: string }>;
}) {
  const { contest } = await params;
  const icpcContest = icpcContests.find((item) => item.slug === contest);
  if (!icpcContest) notFound();
  return (
    <main className="page-shell py-12 sm:py-16">
      <Link
        href="/icpc"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" /> Усі змагання
      </Link>
      <header className="mt-8 max-w-4xl">
        <p className="eyebrow">
          Розбір задач ICPC · {icpcContest.problems.length} задач
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
          {icpcContest.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {icpcContest.description} Оберіть задачу, щоб відкрити її повний
          розбір.
        </p>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Основа — наданий короткий розбір; пояснення доповнено та звірено з
          умовами Algotester. Позначення складності відповідають наданому списку
          задач.
        </p>
      </header>
      <nav
        className="mt-10 grid gap-4 md:grid-cols-2"
        aria-label="Задачі етапу"
      >
        {icpcContest.problems.map((problem) => (
          <Link
            key={problem.slug}
            href={icpcProblemHref(problem, icpcContest.slug)}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 font-mono font-semibold text-primary">
                {problem.letter}
              </span>
              <span className="text-xs text-muted-foreground">
                {problem.difficulty}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              {problem.title}
            </h2>
            <p className="mt-3 grow text-sm leading-6 text-muted-foreground">
              {problem.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {problem.patterns.map((pattern) => (
                <span
                  key={pattern.label}
                  className="rounded-lg bg-muted px-2.5 py-1 text-xs leading-5"
                >
                  {pattern.label}
                </span>
              ))}
            </div>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Читати розбір{' '}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
