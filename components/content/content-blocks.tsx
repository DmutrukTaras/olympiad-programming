import { Lightbulb } from 'lucide-react';
import { FoundationVisual } from '@/components/content/foundation-visuals';
import { CoreVisual } from '@/components/content/core-visuals';
import { CombinationVisual } from '@/components/content/combination-visuals';
import { LessonTable } from '@/components/content/lesson-ui';
import type { ContentBlock } from '@/types/content';

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === 'visual')
          return <FoundationVisual key={index} kind={block.kind} />;
        if (block.type === 'core-visual')
          return <CoreVisual key={index} kind={block.kind} />;
        if (block.type === 'combination-visual')
          return <CombinationVisual key={index} kind={block.kind} />;
        if (block.type === 'table')
          return (
            <LessonTable
              key={index}
              columns={block.columns}
              rows={block.rows}
            />
          );
        if (block.type === 'paragraph') {
          return (
            <p key={index} className="leading-7 text-muted-foreground">
              {block.text}
            </p>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="space-y-2.5 pl-1">
              {block.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 leading-7 text-muted-foreground"
                >
                  <span
                    className="mt-[0.7rem] size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'callout') {
          return (
            <aside
              key={index}
              className="rounded-2xl border border-primary/20 bg-primary/[0.06] p-5"
            >
              <div className="flex gap-3">
                <Lightbulb
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">{block.title}</p>
                  <p className="mt-2 leading-7 text-muted-foreground">
                    {block.text}
                  </p>
                </div>
              </div>
            </aside>
          );
        }

        return (
          <figure
            key={index}
            className="overflow-hidden rounded-2xl border border-border bg-[oklch(0.16_0.012_155)] text-[oklch(0.9_0.01_110)] shadow-sm"
          >
            {block.caption && (
              <figcaption className="border-b border-white/10 px-4 py-3 font-mono text-xs text-white/55">
                {block.caption}
              </figcaption>
            )}
            <pre className="overflow-x-auto p-4 text-[0.82rem] leading-6 sm:p-5 sm:text-sm">
              <code>{block.code}</code>
            </pre>
          </figure>
        );
      })}
    </div>
  );
}
