import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { LevelBadge } from '@/components/content/level-badge';
import { PatternPreparation } from '@/components/content/pattern-preparation';
import { patterns } from '@/content';
import { getChapterById, getPatternBySlug } from '@/lib/content-selectors';

type TheoryPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return patterns
    .filter((pattern) => pattern.hasContent && pattern.preparation)
    .map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({
  params,
}: TheoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern?.preparation) return {};
  return {
    title: `Теорія та C++ — ${pattern.title}`,
    description: `Необхідна теорія, C++17 та типові помилки для патерну «${pattern.title}».`,
  };
}

export default async function PatternTheoryPage({ params }: TheoryPageProps) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern?.hasContent || !pattern.preparation) notFound();

  const chapter = getChapterById(pattern.chapterId);
  if (!chapter) notFound();

  return (
    <main className="page-shell py-10 sm:py-14">
      <Link
        href={`/patterns/${pattern.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        До патерну «{pattern.title}»
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[14rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
        <aside className="hidden lg:block">
          <nav
            className="sticky top-28 space-y-1 text-sm"
            aria-label="Навігація по теорії"
          >
            <p className="mb-3 font-mono text-[0.67rem] uppercase tracking-[0.16em] text-muted-foreground">
              На сторінці
            </p>
            <a href="#overview" className="article-nav-link">
              Про матеріал
            </a>
            {pattern.preparation.sections.map((section, index) => (
              <a
                key={section.title}
                href={`#section-${index + 1}`}
                className="article-nav-link"
              >
                {section.title}
              </a>
            ))}
            {pattern.preparation.questions.length > 0 && (
              <a href="#self-check" className="article-nav-link">
                Перевір себе
              </a>
            )}
          </nav>
        </aside>

        <article className="min-w-0">
          <header
            id="overview"
            className="scroll-mt-28 border-b border-border pb-10"
          >
            <LevelBadge level={pattern.level} />
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Глава {chapter.order} · {pattern.title}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Теорія та C++: заповнити прогалини
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Самодостатня база для роботи з патерном: від понять і маленьких
              прикладів до потрібних операцій C++17 та типових помилок.
            </p>
          </header>

          <section className="py-10">
            <PatternPreparation content={pattern.preparation} />
          </section>

          <footer className="border-t border-border py-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Тепер спробуй застосувати знання
            </p>
            <Link
              href={`/patterns/${pattern.slug}#task`}
              className="mt-3 flex items-center justify-between gap-4 text-lg font-semibold hover:text-primary"
            >
              Перейти до навчальної задачі
              <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
            </Link>
          </footer>
        </article>
      </div>
    </main>
  );
}
