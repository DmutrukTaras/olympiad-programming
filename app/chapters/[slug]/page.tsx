import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ChevronLeft, Clock3, LockKeyhole } from 'lucide-react';
import { LevelBadge } from '@/components/content/level-badge';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { chapters } from '@/content';
import { getChapterById, getChapterBySlug, getPatternsForChapter } from '@/lib/content-selectors';
import { cn } from '@/lib/utils';

type ChapterPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return {};
  return { title: chapter.title, description: chapter.summary };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const chapterPatterns = getPatternsForChapter(chapter.id);
  const prerequisites = chapter.prerequisiteIds
    .map(getChapterById)
    .filter((item) => Boolean(item));
  const nextChapter = chapters.find((item) => item.order === chapter.order + 1);

  return (
    <main className="page-shell py-10 sm:py-14">
      <Link href="/contents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden="true" />
        До змісту
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[14rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-1 text-sm" aria-label="Навігація по главі">
            <p className="mb-3 font-mono text-[0.67rem] uppercase tracking-[0.16em] text-muted-foreground">У цій главі</p>
            <a href="#overview" className="article-nav-link">Огляд</a>
            <a href="#outcomes" className="article-nav-link">Після глави</a>
            <a href="#patterns" className="article-nav-link">Патерни задач</a>
            {prerequisites.length > 0 && <a href="#prerequisites" className="article-nav-link">Передумови</a>}
          </nav>
        </aside>

        <article className="min-w-0">
          <header id="overview" className="scroll-mt-28 border-b border-border pb-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">Глава {String(chapter.order).padStart(2, '0')}</span>
              <LevelBadge level={chapter.level} />
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              {chapter.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{chapter.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {chapter.taskTypes.map((type) => <Badge key={type} variant="secondary">{type}</Badge>)}
            </div>
          </header>

          <section id="outcomes" className="scroll-mt-28 py-10">
            <p className="eyebrow">Навчальна ціль</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Після цієї глави ти зможеш</h2>
            {chapter.takeaways.length > 0 ? (
              <ul className="mt-6 space-y-4">
                {chapter.takeaways.map((item) => (
                  <li key={item} className="flex gap-3 leading-7 text-muted-foreground">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-5 text-muted-foreground">
                Детальні навчальні цілі буде додано разом із матеріалом глави.
              </div>
            )}
          </section>

          <section id="patterns" className="scroll-mt-28 border-t border-border py-10">
            <p className="eyebrow">Розпізнавання</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Патерни задач</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Кожен патерн починається із сигналів в умові, а не з готового коду.
            </p>
            {chapterPatterns.length > 0 ? (
              <div className="mt-7 space-y-3">
                {chapterPatterns.map((pattern, index) => {
                  const content = (
                    <>
                      <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{pattern.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{pattern.description}</span>
                      </span>
                      {pattern.hasContent ? <ArrowRight className="size-4 shrink-0 text-muted-foreground" /> : <Clock3 className="size-4 shrink-0 text-muted-foreground" />}
                    </>
                  );

                  return pattern.hasContent ? (
                    <Link key={pattern.id} href={`/patterns/${pattern.slug}`} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/35 hover:bg-muted/45">
                      {content}
                    </Link>
                  ) : (
                    <div key={pattern.id} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 opacity-75">
                      {content}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-7 flex gap-3 rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-muted-foreground">
                <LockKeyhole className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Патерни цієї глави додаватимуться поступово. Структура сторінки вже готова до наповнення.
              </div>
            )}
          </section>

          {prerequisites.length > 0 && (
            <section id="prerequisites" className="scroll-mt-28 border-t border-border py-10">
              <p className="eyebrow">Перед початком</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Передумови</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {prerequisites.map((item) => item && (
                  <Link key={item.id} href={`/chapters/${item.slug}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                    {item.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {nextChapter && (
            <footer className="border-t border-border py-10">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Наступна глава</p>
              <Link href={`/chapters/${nextChapter.slug}`} className="mt-3 flex items-center justify-between gap-4 text-lg font-semibold hover:text-primary">
                {nextChapter.title}
                <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
              </Link>
            </footer>
          )}
        </article>
      </div>
    </main>
  );
}
