import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { LevelBadge } from '@/components/content/level-badge';
import type { Chapter } from '@/types/content';

export function ChapterList({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          href={`/chapters/${chapter.slug}`}
          className="group grid gap-3 border-b border-border px-5 py-5 transition-colors last:border-b-0 hover:bg-muted/55 sm:grid-cols-[2.6rem_minmax(0,1fr)_auto] sm:items-start sm:gap-4"
        >
          <span className="pt-1 font-mono text-xs text-muted-foreground">
            {String(chapter.order).padStart(2, '0')}
          </span>
          <span>
            <span className="flex items-start gap-2 font-semibold tracking-tight">
              {chapter.title}
              <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            </span>
            <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
              {chapter.summary}
            </span>
          </span>
          <span className="self-center sm:self-start">
            <LevelBadge level={chapter.level} compact />
          </span>
        </Link>
      ))}
    </div>
  );
}
