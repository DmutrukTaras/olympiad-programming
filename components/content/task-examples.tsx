import type { TaskExample } from '@/types/content';

export function TaskExamples({ examples }: { examples?: TaskExample[] }) {
  if (!examples?.length) return null;
  return (
    <div className="space-y-4">
      {examples.map((example, index) => (
        <figure
          key={index}
          className="overflow-hidden rounded-xl border border-border"
        >
          <figcaption className="border-b border-border bg-muted/40 px-4 py-3 text-sm font-semibold">
            Приклад {examples.length > 1 ? index + 1 : ''}
          </figcaption>
          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="min-w-0 p-4">
              <p className="mb-2 font-mono text-xs text-muted-foreground">
                Ввід
              </p>
              <pre className="overflow-x-auto font-mono text-xs leading-6 text-foreground">
                <code>{example.input}</code>
              </pre>
            </div>
            <div className="min-w-0 p-4">
              <p className="mb-2 font-mono text-xs text-muted-foreground">
                Вивід
              </p>
              <pre className="overflow-x-auto font-mono text-xs leading-6 text-foreground">
                <code>{example.output}</code>
              </pre>
            </div>
          </div>
          {example.explanation && (
            <p className="border-t border-border px-4 py-3 text-sm leading-6 text-muted-foreground">
              {example.explanation}
            </p>
          )}
        </figure>
      ))}
    </div>
  );
}
