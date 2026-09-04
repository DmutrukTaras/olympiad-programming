import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LevelBadge } from '@/components/content/level-badge';
import { chapters } from '@/content';
import {
  getPatternsForChapter,
  getTasksForPattern,
} from '@/lib/content-selectors';

export const metadata: Metadata = {
  title: 'Задачі',
  description: 'Авторські навчальні та практичні задачі рівня Foundation.',
};

export default function TasksPage() {
  const foundation = chapters.filter(
    (chapter) => chapter.order >= 6 && chapter.order <= 9,
  );
  return (
    <main className="page-shell py-14 sm:py-20">
      <header className="mb-12 max-w-3xl">
        <LevelBadge level="foundation" />
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          Задачі Foundation
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          12 навчальних задач із поступовим розбором і 24 задачі для самостійної
          роботи. Уся практика авторська, з повними умовами й однією підказкою.
        </p>
      </header>
      <div className="space-y-12">
        {foundation.map((chapter) => (
          <section key={chapter.id}>
            <h2 className="mb-5 text-2xl font-semibold">
              <Link
                href={`/chapters/${chapter.slug}`}
                className="hover:text-primary"
              >
                {chapter.order}. {chapter.title}
              </Link>
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {getPatternsForChapter(chapter.id)
                .filter((pattern) => pattern.hasContent)
                .map((pattern, index) => {
                  const tasks = getTasksForPattern(pattern.id);
                  const lesson = tasks.find((task) => task.kind === 'learning');
                  return (
                    <article
                      key={pattern.id}
                      className="flex flex-col rounded-2xl border border-border bg-card p-5"
                    >
                      <p className="font-mono text-xs text-primary">
                        {chapter.order}.{index + 1}
                      </p>
                      <h3 className="mt-3 font-semibold">{pattern.title}</h3>
                      {lesson && (
                        <Link
                          href={`/patterns/${pattern.slug}#task`}
                          className="mt-5 block text-sm leading-6 hover:text-primary"
                        >
                          <span className="mb-1 block text-xs text-muted-foreground">
                            Навчальна задача
                          </span>
                          {lesson.title}
                        </Link>
                      )}
                      <p className="mb-2 mt-5 text-xs text-muted-foreground">
                        Самостійна практика
                      </p>
                      <ul className="space-y-2">
                        {tasks
                          .filter((task) => task.kind === 'practice')
                          .map((task) => (
                            <li key={task.id}>
                              <Link
                                href={`/patterns/${pattern.slug}#practice-${task.id}`}
                                className="flex items-start justify-between gap-2 text-sm leading-6 hover:text-primary"
                              >
                                {task.title}
                                <LevelBadge level={task.level} compact />
                              </Link>
                            </li>
                          ))}
                      </ul>
                      <Link
                        href={`/patterns/${pattern.slug}`}
                        className="mt-auto flex items-center justify-between gap-2 pt-6 text-sm font-medium text-primary"
                      >
                        Перейти до патерну
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </article>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
