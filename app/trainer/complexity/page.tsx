import type { Metadata } from 'next';
import { ComplexityTrainer } from '@/components/trainer/complexity-trainer';
import { complexityQuestions } from '@/content/complexity-questions';

export const metadata: Metadata = {
  title: 'Визначте Big O',
  description:
    'Тренажер аналізу часової складності коду й реалістичних оцінок за constraints.',
};

export default function ComplexityTrainerPage() {
  return (
    <main className="page-shell py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="eyebrow">Тренажер асимптотичного мислення</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Визначте Big O
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Проаналізуйте код або constraints і визначте асимптотичну складність.
        </p>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          Рахуйте не кількість вкладених дужок, а сумарну роботу: скільки разів
          змінюється стан, що коштує одна операція і який доданок домінує.
        </p>
      </header>

      <ComplexityTrainer questions={complexityQuestions} />
    </main>
  );
}
