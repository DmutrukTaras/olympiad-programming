import type { ReactNode } from 'react';
import { Braces, Lightbulb, Quote } from 'lucide-react';

export function LessonSection({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border py-10 first:border-t-0">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

export function LessonText({ children }: { children: ReactNode }) {
  return <p className="text-[1.02rem] leading-8 text-muted-foreground">{children}</p>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.88em] text-foreground">
      {children}
    </code>
  );
}

export function LessonQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.055] px-5 py-5 sm:px-6">
      <Quote className="absolute right-5 top-4 size-8 text-primary/15" aria-hidden="true" />
      <p className="relative pr-8 text-lg font-medium leading-8 text-foreground">{children}</p>
    </blockquote>
  );
}

export function LessonList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-[1.02rem] leading-7 text-muted-foreground">
          <span className="mt-[0.7rem] size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function NumberedSteps({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-4 text-[1.02rem] leading-7 text-muted-foreground">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.07] font-mono text-xs font-semibold text-primary">
            {index + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function CodeBlock({
  code,
  caption,
  language = 'C++',
}: {
  code: string;
  caption?: string;
  language?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.16_0.012_155)] text-[oklch(0.9_0.01_110)] shadow-sm">
      <figcaption className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 font-mono text-xs text-white/55">
        <span className="flex items-center gap-2">
          <Braces className="size-3.5" aria-hidden="true" />
          {caption ?? 'Приклад'}
        </span>
        <span>{language}</span>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-[0.82rem] leading-6 sm:p-5 sm:text-sm">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export function Formula({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/55 px-5 py-5 text-center">
      {label ? (
        <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
      ) : null}
      <p className="font-mono text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {children}
      </p>
    </div>
  );
}

export function LessonTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead className="bg-muted/65">
          <tr>
            {columns.map((column) => (
              <th key={column} className="border-b border-border px-4 py-3 font-semibold text-foreground">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/75 last:border-b-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3.5 align-top leading-6 text-muted-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LessonCallout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="rounded-2xl border border-primary/20 bg-primary/[0.055] p-5 sm:p-6">
      <div className="flex gap-3">
        <Lightbulb className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <div className="mt-2 leading-7 text-muted-foreground">{children}</div>
        </div>
      </div>
    </aside>
  );
}

export function Remember({ children }: { children: ReactNode }) {
  return (
    <aside className="relative overflow-hidden rounded-3xl border border-primary/25 bg-primary/[0.075] p-6 sm:p-8">
      <div className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden="true" />
      <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-primary">
        Що потрібно запам’ятати
      </p>
      <div className="mt-3 text-xl font-semibold leading-8 tracking-tight text-foreground">
        {children}
      </div>
    </aside>
  );
}

export function VisualFrame({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_70px_-50px_color-mix(in_oklch,var(--foreground)_45%,transparent)]">
      <figcaption className="border-b border-border bg-muted/45 px-5 py-4 sm:px-6">
        <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.15em] text-primary">
          {eyebrow}
        </p>
        <p className="mt-1.5 font-semibold tracking-tight text-foreground">{title}</p>
      </figcaption>
      <div className="p-5 sm:p-6">{children}</div>
    </figure>
  );
}
