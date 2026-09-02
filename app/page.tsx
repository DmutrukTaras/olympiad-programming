import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { ProblemSignalCard } from '@/components/home/problem-signal-card';
import { Reveal } from '@/components/shared/reveal';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const learningSteps = [
  {
    number: '01',
    title: 'Прочитай',
    text: 'Відділи історію задачі від того, що насправді потрібно знайти.',
  },
  {
    number: '02',
    title: 'Проаналізуй',
    text: 'Перетвори constraints на межу для допустимої складності.',
  },
  {
    number: '03',
    title: 'Розпізнай',
    text: 'Знайди знайому структуру: відрізок, порядок, граф або стан.',
  },
  {
    number: '04',
    title: 'Розв’яжи',
    text: 'Доведи ідею, оціни складність і лише тоді переходь до коду.',
  },
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="page-shell grid min-h-[calc(100svh-4.5rem)] items-center gap-14 py-16 lg:grid-cols-[1.14fr_0.86fr] lg:py-24">
          <Reveal className="max-w-3xl">
            <div className="eyebrow">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Мислити до того, як кодувати
            </div>
            <h1 className="mt-7 text-balance text-[clamp(2.85rem,7vw,6.4rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
              Навчись бачити
              <span className="block text-primary"> алгоритм у задачі.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              Не колекція готових алгоритмів, а послідовний шлях від умови
              та обмежень до спостереження, патерну й надійної реалізації.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/chapters/how-to-read"
                className={cn(buttonVariants({ size: 'lg' }), 'h-11 px-5')}
              >
                Почати навчання
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/contents"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-11 px-5',
                )}
              >
                Перейти до змісту
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:justify-self-end">
            <ProblemSignalCard />
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-28" aria-labelledby="learning-path-title">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="eyebrow">
                <BookOpen className="size-3.5" aria-hidden="true" />
                Метод посібника
              </div>
              <h2
                id="learning-path-title"
                className="mt-5 max-w-md text-3xl font-semibold tracking-[-0.035em] sm:text-4xl"
              >
                Рішення починається не з коду
              </h2>
              <p className="mt-5 max-w-md leading-7 text-muted-foreground">
                Кожна тема показує не лише алгоритм, а й сигнали, за якими його
                можна впізнати в новій умові.
              </p>
            </div>
          </Reveal>

          <div className="divide-y divide-border border-y border-border">
            {learningSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 0.05}>
                <article className="grid gap-3 py-6 sm:grid-cols-[3.25rem_10rem_1fr] sm:items-baseline sm:gap-5 sm:py-7">
                  <span className="font-mono text-xs text-muted-foreground">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="leading-7 text-muted-foreground">{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
