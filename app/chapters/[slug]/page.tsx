import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import {
  getIntroductionSectionLinks,
  IntroductionLesson,
} from '@/components/content/introduction-lessons';
import { ChapterCurriculum } from '@/components/content/chapter-curriculum';
import { LevelBadge } from '@/components/content/level-badge';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { chapters } from '@/content';
import {
  getChapterById,
  getChapterBySlug,
  getProblemTypesForChapter,
} from '@/lib/content-selectors';
import { cn } from '@/lib/utils';

type ChapterPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return chapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return {};
  return { title: chapter.title, description: chapter.summary };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const prerequisites = chapter.prerequisiteIds
    .map(getChapterById)
    .filter((item) => Boolean(item));
  const nextChapter = chapters.find((item) => item.order === chapter.order + 1);
  const introductionSections = getIntroductionSectionLinks(chapter.id);
  const isIntroduction = introductionSections.length > 0;

  return (
    <main className="page-shell py-10 sm:py-14">
      <Link
        href="/contents"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        До змісту
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[14rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
        <aside className="hidden lg:block">
          <nav
            className="sticky top-28 space-y-1 text-sm"
            aria-label="Навігація по главі"
          >
            <p className="mb-3 font-mono text-[0.67rem] uppercase tracking-[0.16em] text-muted-foreground">
              У цій главі
            </p>
            <a href="#overview" className="article-nav-link">
              Огляд
            </a>
            {isIntroduction ? (
              <>
                {introductionSections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="article-nav-link"
                  >
                    {section.title}
                  </a>
                ))}
                <a href="#self-check" className="article-nav-link">
                  Перевір себе
                </a>
              </>
            ) : (
              <>
                {chapter.takeaways.length > 0 && (
                  <a href="#outcomes" className="article-nav-link">
                    Після глави
                  </a>
                )}
                <a href="#patterns" className="article-nav-link">
                  Основні патерни
                </a>
                {Boolean(chapter.outline?.additionalTopics.length) && (
                  <a href="#additional" className="article-nav-link">
                    Додаткові теми
                  </a>
                )}
                {Boolean(chapter.outline?.optionalTopics.length) && (
                  <a href="#optional" className="article-nav-link">
                    Optional / later
                  </a>
                )}
                {chapter.id === 'ch-26' && (
                  <a href="#final-mixed-set" className="article-nav-link">
                    Final Mixed Set
                  </a>
                )}
                {getProblemTypesForChapter(chapter.id).length > 0 && (
                  <a href="#related-types" className="article-nav-link">
                    Пов’язані типи задач
                  </a>
                )}
                {prerequisites.length > 0 && (
                  <a href="#prerequisites" className="article-nav-link">
                    Передумови
                  </a>
                )}
              </>
            )}
          </nav>
        </aside>

        <article className="min-w-0">
          <header
            id="overview"
            className="scroll-mt-28 border-b border-border pb-10"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                {isIntroduction ? 'Вступ · ' : ''}Глава{' '}
                {String(chapter.order).padStart(2, '0')}
              </span>
              {!isIntroduction ? <LevelBadge level={chapter.level} /> : null}
            </div>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              {chapter.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {chapter.summary}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {chapter.taskTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>
          </header>

          {isIntroduction ? (
            <IntroductionLesson chapterId={chapter.id} />
          ) : (
            <>
              <ChapterCurriculum chapter={chapter} />

              {prerequisites.length > 0 && (
                <section
                  id="prerequisites"
                  className="scroll-mt-28 border-t border-border py-10"
                >
                  <p className="eyebrow">Перед початком</p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                    Передумови
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {prerequisites.map(
                      (item) =>
                        item && (
                          <Link
                            key={item.id}
                            href={`/chapters/${item.slug}`}
                            className={buttonVariants({
                              variant: 'outline',
                              size: 'sm',
                            })}
                          >
                            {item.title}
                          </Link>
                        ),
                    )}
                  </div>
                </section>
              )}
            </>
          )}

          {nextChapter && (
            <footer
              className={cn(
                'border-t border-border py-10',
                isIntroduction && 'border-t-0 pt-2',
              )}
            >
              {isIntroduction ? (
                <Link
                  href={`/chapters/${nextChapter.slug}`}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'h-auto w-full justify-between rounded-2xl px-5 py-4 text-left text-base sm:px-6',
                  )}
                >
                  <span>
                    <span className="block font-mono text-[0.65rem] uppercase tracking-[0.14em] opacity-70">
                      Далі
                    </span>
                    <span className="mt-1 block">{nextChapter.title}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Наступна глава
                  </p>
                  <Link
                    href={`/chapters/${nextChapter.slug}`}
                    className="mt-3 flex items-center justify-between gap-4 text-lg font-semibold hover:text-primary"
                  >
                    {nextChapter.title}
                    <ArrowRight
                      className="size-5 shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                </>
              )}
            </footer>
          )}
        </article>
      </div>
    </main>
  );
}
