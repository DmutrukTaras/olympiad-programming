import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ChapterList } from '@/components/content/chapter-list';
import { ContentsExplorer } from '@/components/content/contents-explorer';
import { chapters, problemTypeGroups } from '@/content';

export const metadata: Metadata = {
  title: 'Зміст',
  description: 'Навчальні глави, згруповані за складністю або типом задачі.',
};

export default function ContentsPage() {
  const commonChapters = chapters.filter((chapter) => chapter.order <= 5);
  const categorizedChapters = chapters.filter((chapter) => chapter.order > 5);

  return (
    <main className="page-shell py-14 sm:py-20">
      <header className="mb-10 max-w-3xl sm:mb-14">
        <p className="eyebrow">Навчальна карта</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Зміст
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Спочатку — п’ять вступних розділів про читання умов, constraints і
          побудову рішення. Далі оберіть зручний алгоритмічний маршрут.
        </p>
      </header>
      <Link
        href="/icpc"
        className="mb-12 block rounded-2xl border border-primary/20 bg-primary/[0.05] p-6 transition-colors hover:border-primary"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          Розбір задач ICPC →
        </h2>
        <p className="mt-2 leading-7 text-muted-foreground">
          Окремі добірки за змаганнями та етапами. Для кожної задачі —
          пояснення, патерни й практика на Algotester.
        </p>
      </Link>
      <section
        aria-labelledby="introduction-heading"
        className="mb-14 sm:mb-16"
      >
        <div className="mb-6 max-w-3xl">
          <h2
            className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
            id="introduction-heading"
          >
            Вступ
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            База, яку варто пройти незалежно від рівня підготовки та обраної
            категорії задач.
          </p>
        </div>
        <ChapterList chapters={commonChapters} showLevel={false} />
      </section>

      <section
        aria-label="Алгоритмічні розділи"
        className="border-t border-border pt-10 sm:pt-12"
      >
        <Suspense fallback={<ChapterList chapters={categorizedChapters} />}>
          <ContentsExplorer
            chapters={categorizedChapters}
            groups={problemTypeGroups}
          />
        </Suspense>
      </section>
    </main>
  );
}
