import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Construction } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Задачі' };

export default function TasksPage() {
  return (
    <main className="page-shell grid min-h-[calc(100svh-4.5rem)] place-items-center py-16">
      <section className="w-full max-w-2xl rounded-3xl border border-border bg-card p-7 text-center sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-primary">
          <Construction aria-hidden="true" />
        </span>
        <p className="eyebrow mt-6">Наступний етап</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Каталог задач буде додано пізніше</h1>
        <p className="mx-auto mt-5 max-w-lg leading-7 text-muted-foreground">
          Тут з’являться авторські задачі посібника та добірки для самостійної практики.
          Поки що навчальну задачу можна відкрити у демонстраційному патерні.
        </p>
        <Link
          href="/patterns/prefix-sum"
          className={cn(buttonVariants({ size: 'lg' }), 'mt-7 h-11 px-5')}
        >
          Переглянути приклад
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
