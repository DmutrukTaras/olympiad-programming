'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Layers3, Shapes } from 'lucide-react';
import { ChapterList } from '@/components/content/chapter-list';
import { LevelBadge } from '@/components/content/level-badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { levelOrder, levels } from '@/content/levels';
import type { Chapter, ProblemTypeGroup } from '@/types/content';

type ViewMode = 'difficulty' | 'type';

export function ContentsExplorer({
  chapters,
  groups,
}: {
  chapters: Chapter[];
  groups: ProblemTypeGroup[];
}) {
  const [mode, setMode] = useState<ViewMode>('difficulty');
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <Tabs value={mode} onValueChange={(value) => setMode(value as ViewMode)}>
        <TabsList className="h-auto w-full rounded-xl border border-border bg-card p-1 sm:w-auto">
          <TabsTrigger value="difficulty" className="h-9 px-3 sm:px-4">
            <Layers3 data-icon="inline-start" />
            За складністю
          </TabsTrigger>
          <TabsTrigger value="type" className="h-9 px-3 sm:px-4">
            <Shapes data-icon="inline-start" />
            За типом задачі
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
          className="mt-12"
        >
          {mode === 'difficulty' ? (
            <div className="space-y-16">
              {levelOrder.map((level) => {
                const items = chapters.filter((chapter) => chapter.level === level);
                const meta = levels[level];

                return (
                  <section key={level} aria-labelledby={`level-${level}`}>
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <LevelBadge level={level} />
                        <h2 id={`level-${level}`} className="mt-3 text-2xl font-semibold tracking-tight">
                          {meta.label}
                        </h2>
                      </div>
                      <p className="max-w-lg text-sm leading-6 text-muted-foreground">
                        {meta.description}
                      </p>
                    </div>
                    <ChapterList chapters={items} />
                  </section>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
              {groups.map((group) => {
                const items = group.chapterIds
                  .map((id) => chapters.find((chapter) => chapter.id === id))
                  .filter((chapter): chapter is Chapter => Boolean(chapter));

                return (
                  <section key={group.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                      {items.length} {items.length === 1 ? 'матеріал' : 'матеріалів'}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight">{group.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{group.description}</p>
                    <div className="mt-5 divide-y divide-border border-y border-border">
                      {items.map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/chapters/${chapter.slug}`}
                          className="flex items-start justify-between gap-4 py-3.5 text-sm transition-colors hover:text-primary"
                        >
                          <span>{chapter.title}</span>
                          <LevelBadge level={chapter.level} compact />
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
