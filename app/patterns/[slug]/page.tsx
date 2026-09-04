import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Gauge,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { ContentBlocks } from '@/components/content/content-blocks';
import { LearningTask } from '@/components/content/learning-task';
import { LevelBadge } from '@/components/content/level-badge';
import { PracticeTaskCard } from '@/components/content/practice-task-card';
import { chapters, patterns } from '@/content';
import { practiceTaskRange } from '@/content/task-template';
import {
  getChapterById,
  getPatternBySlug,
  getPatternsForChapter,
  getTasksForPattern,
} from '@/lib/content-selectors';

type PatternPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return patterns
    .filter((pattern) => pattern.hasContent)
    .map((pattern) => ({ slug: pattern.slug }));
}

export async function generateMetadata({
  params,
}: PatternPageProps): Promise<Metadata> {
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
  const chapterPatterns = getPatternsForChapter(chapter.id).filter(
    (item) => item.hasContent,
  );
  const position = chapterPatterns.findIndex((item) => item.id === pattern.id);
  const nextPattern = chapterPatterns[position + 1];
  const nextChapter = chapters.find((item) => item.order === chapter.order + 1);

  return (
    <main className="page-shell py-10 sm:py-14">
      <Link
        href={`/chapters/${chapter.slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
        {chapter.title}
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[14rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
        <aside className="hidden lg:block">
          <nav
            className="sticky top-28 space-y-1 text-sm"
            aria-label="Навігація по патерну"
          >
            <p className="mb-3 font-mono text-[0.67rem] uppercase tracking-[0.16em] text-muted-foreground">
              На сторінці
            </p>
            <a href="#overview" className="article-nav-link">
              Огляд
            </a>
            <a href="#task" className="article-nav-link">
              Навчальна задача
            </a>
            <a href="#recognize" className="article-nav-link">
              Як розпізнати
            </a>
            <a href="#constraints" className="article-nav-link">
              Constraints-сигнали
            </a>
            <a href="#not-applicable" className="article-nav-link">
              Коли НЕ підходить
            </a>
            <a href="#theory" className="article-nav-link">
              Теорія та шаблон
            </a>
            <a href="#practice" className="article-nav-link">
              Практика
            </a>
            {chapterPatterns.length > 1 && (
              <div className="mt-6 border-t border-border pt-5">
                <p className="mb-3 font-mono text-xs text-muted-foreground">
                  Патерни глави {chapter.order}
                </p>
                {chapterPatterns.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/patterns/${item.slug}`}
                    aria-current={item.id === pattern.id ? 'page' : undefined}
                    className="article-nav-link aria-[current=page]:text-primary"
                  >
                    {chapter.order}.{index + 1} {item.title}
                  </Link>
                ))}
              </div>
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
              Патерн {chapter.order}.{position + 1} · 1 розбір +{' '}
              {practiceTasks.length} задачі
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              {pattern.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {pattern.description}
            </p>
          </header>

          {learningTask && (
            <section
              id="task"
              className="scroll-mt-28 border-t border-border py-10"
            >
              <p className="eyebrow mb-5">Спробуй пройти шлях самостійно</p>
              <LearningTask key={learningTask.id} task={learningTask} />
            </section>
          )}

          <section id="recognize" className="scroll-mt-28 py-10">
            <div className="flex items-center gap-2 text-primary">
              <Search className="size-4" aria-hidden="true" />
              <p className="eyebrow">Як розпізнати в умові</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Сигнали патерну
            </h2>
            <ul className="mt-6 space-y-4">
              {pattern.recognitionSigns.map((sign) => (
                <li
                  key={sign}
                  className="flex gap-3 leading-7 text-muted-foreground"
                >
                  <Check
                    className="mt-1 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {sign}
                </li>
              ))}
            </ul>
          </section>

          <section
            id="constraints"
            className="scroll-mt-28 border-t border-border py-10"
          >
            <div className="flex items-center gap-2 text-primary">
              <Gauge className="size-4" aria-hidden="true" />
              <p className="eyebrow">Constraints-сигнали</p>
            </div>
            <div className="mt-6 grid gap-3">
              {pattern.constraintSignals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-xl border border-border bg-card px-4 py-3.5 font-mono text-sm leading-6 text-muted-foreground"
                >
                  {signal}
                </div>
              ))}
            </div>
          </section>

          <section
            id="not-applicable"
            className="scroll-mt-28 border-t border-border py-10"
          >
            <div className="flex items-center gap-2 text-primary">
              <ShieldAlert className="size-4" aria-hidden="true" />
              <p className="eyebrow">Перевір передумови</p>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Коли цей алгоритм НЕ підходить?
            </h2>
            <ul className="mt-6 space-y-4">
              {pattern.notApplicableSigns.map((sign) => (
                <li
                  key={sign}
                  className="border-l-2 border-border pl-4 leading-7 text-muted-foreground"
                >
                  {sign}
                </li>
              ))}
            </ul>
          </section>

          <section
            id="theory"
            className="scroll-mt-28 border-t border-border py-10"
          >
            <p className="eyebrow">Після власної спроби</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Теорія та C++ шаблон
            </h2>
            <details className="mt-6 rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold">
                Відкрити узагальнення патерну
              </summary>
              <div className="mt-6">
                <ContentBlocks blocks={pattern.theory} />
              </div>
            </details>
          </section>

          <section
            id="practice"
            className="scroll-mt-28 border-t border-border py-10"
          >
            <p className="eyebrow">Самостійна практика</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Закріпи патерн
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {pattern.practiceStatus === 'complete'
                ? 'Авторські задачі для самостійної роботи. Усередині — повна умова, приклад і одна прихована підказка, без готового розв’язку.'
                : `Для кожного патерну плануємо ${practiceTaskRange.min}–${practiceTaskRange.max} задачі: авторські або з Algotester.`}{' '}
              Спробуй спочатку назвати сигнал і складність, а вже потім писати
              код.
            </p>
            {practiceTasks.length < practiceTaskRange.min && (
              <p className="mt-5 rounded-2xl border border-dashed border-border p-5 text-sm leading-6 text-muted-foreground">
                {practiceTasks.length === 0
                  ? 'Добірка практики готується.'
                  : 'Добірка практики ще доповнюється.'}{' '}
                Повні умови та перевірені посилання з’являться разом із
                матеріалами.
              </p>
            )}
            <div className="mt-6 grid gap-4">
              {practiceTasks.map((task) => (
                <PracticeTaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
          {(nextPattern || nextChapter) && (
            <footer className="border-t border-border py-8">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                {nextPattern ? 'Наступний патерн' : 'Наступна глава'}
              </p>
              <Link
                href={
                  nextPattern
                    ? `/patterns/${nextPattern.slug}`
                    : `/chapters/${nextChapter!.slug}`
                }
                className="mt-3 flex items-center justify-between gap-4 text-lg font-semibold hover:text-primary"
              >
                {nextPattern?.title ?? nextChapter?.title}
                <ArrowRight className="size-5 shrink-0" aria-hidden="true" />
              </Link>
            </footer>
          )}
        </article>
      </div>
    </main>
  );
}
