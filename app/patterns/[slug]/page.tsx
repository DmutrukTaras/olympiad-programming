import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ChevronLeft, Gauge, Search } from 'lucide-react';
import { ContentBlocks } from '@/components/content/content-blocks';
import { LearningTask } from '@/components/content/learning-task';
import { LevelBadge } from '@/components/content/level-badge';
import { PracticeTaskCard } from '@/components/content/practice-task-card';
import { patterns } from '@/content';
import { getChapterById, getPatternBySlug, getTasksForPattern } from '@/lib/content-selectors';

type PatternPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return patterns.filter((pattern) => pattern.hasContent).map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) return {};
  return { title: pattern.title, description: pattern.description };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern || !pattern.hasContent) notFound();

  const chapter = getChapterById(pattern.chapterId);
  if (!chapter) notFound();
  const patternTasks = getTasksForPattern(pattern.id);
  const learningTask = patternTasks.find((task) => task.kind === 'learning');
  const practiceTasks = patternTasks.filter((task) => task.kind === 'practice');

  return (
    <main className="page-shell py-10 sm:py-14">
      <Link href={`/chapters/${chapter.slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden="true" />
        {chapter.title}
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[14rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 space-y-1 text-sm" aria-label="Навігація по патерну">
            <p className="mb-3 font-mono text-[0.67rem] uppercase tracking-[0.16em] text-muted-foreground">На сторінці</p>
            <a href="#overview" className="article-nav-link">Огляд</a>
            <a href="#recognize" className="article-nav-link">Як розпізнати</a>
            <a href="#constraints" className="article-nav-link">Constraints-сигнали</a>
            <a href="#theory" className="article-nav-link">Теорія та приклад</a>
            <a href="#task" className="article-nav-link">Навчальна задача</a>
            <a href="#practice" className="article-nav-link">Практика</a>
          </nav>
        </aside>

        <article className="min-w-0">
          <header id="overview" className="scroll-mt-28 border-b border-border pb-10">
            <LevelBadge level={pattern.level} />
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Патерн задачі</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{pattern.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{pattern.description}</p>
          </header>

          <section id="recognize" className="scroll-mt-28 py-10">
            <div className="flex items-center gap-2 text-primary">
              <Search className="size-4" aria-hidden="true" />
              <p className="eyebrow">Як розпізнати в умові</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Сигнали патерну</h2>
            <ul className="mt-6 space-y-4">
              {pattern.recognitionSigns.map((sign) => (
                <li key={sign} className="flex gap-3 leading-7 text-muted-foreground">
                  <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {sign}
                </li>
              ))}
            </ul>
          </section>

          <section id="constraints" className="scroll-mt-28 border-t border-border py-10">
            <div className="flex items-center gap-2 text-primary">
              <Gauge className="size-4" aria-hidden="true" />
              <p className="eyebrow">Constraints-сигнали</p>
            </div>
            <div className="mt-6 grid gap-3">
              {pattern.constraintSignals.map((signal) => (
                <div key={signal} className="rounded-xl border border-border bg-card px-4 py-3.5 font-mono text-sm leading-6 text-muted-foreground">{signal}</div>
              ))}
            </div>
          </section>

          <section id="theory" className="scroll-mt-28 border-t border-border py-10">
            <p className="eyebrow">Теорія та приклад</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Від повторної роботи до preprocessing</h2>
            <div className="mt-6">
              <ContentBlocks blocks={pattern.theory} />
            </div>
          </section>

          {learningTask && (
            <section id="task" className="scroll-mt-28 border-t border-border py-10">
              <p className="eyebrow mb-5">Спробуй пройти шлях самостійно</p>
              <LearningTask task={learningTask} />
            </section>
          )}

          <section id="practice" className="scroll-mt-28 border-t border-border py-10">
            <p className="eyebrow">Самостійна практика</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">Закріпи патерн</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Спробуй спочатку назвати сигнал і складність, а вже потім писати код.</p>
            <div className="mt-6 grid gap-4">
              {practiceTasks.map((task) => <PracticeTaskCard key={task.id} task={task} />)}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
