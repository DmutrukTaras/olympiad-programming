import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { icpcContests } from '@/content/icpc';

export const metadata: Metadata = {
  title: 'Розбір задач ICPC',
  description:
    'Розбори задач за змаганнями та етапами: ідеї, алгоритмічні патерни, обґрунтування й практика на Algotester.',
};

export default function IcpcPage() {
  return (
    <main className="page-shell py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="eyebrow">
          <Trophy className="size-4" aria-hidden="true" /> Від змагання до
          розуміння
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          Розбір задач ICPC
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Оберіть змагання та задачу. Кожен розбір має окрему сторінку: від
          ключового спостереження й патернів до алгоритму, обґрунтування та
          практики.
        </p>
      </header>
      <section className="mt-12" aria-labelledby="contests-title">
        <h2 id="contests-title" className="mb-5 text-2xl font-semibold">
          Змагання та етапи
        </h2>
        <div className="grid gap-5">
          {icpcContests.map((icpcContest) => (
            <Link
              key={icpcContest.slug}
              href={`/icpc/${icpcContest.slug}`}
              className="group block rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary sm:p-8"
            >
              <div className="text-sm text-muted-foreground">
                {icpcContest.problems.length} задач · Окрема добірка розборів
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {icpcContest.title}
                </h3>
                <ArrowRight
                  className="mt-1 size-6 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                {icpcContest.description}
              </p>
              <span className="mt-6 inline-block font-medium text-primary">
                Переглянути задачі
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
