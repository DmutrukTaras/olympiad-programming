'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Braces,
  Check,
  CheckCircle2,
  Gauge,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { TrainerOptionCard } from '@/components/trainer/trainer-option-card';
import { TrainerProgress } from '@/components/trainer/trainer-progress';
import {
  complexityQuestionCount,
  createComplexitySession,
} from '@/lib/complexity-trainer';
import type {
  ComplexityMode,
  ComplexityQuestion,
  ComplexitySession,
} from '@/types/trainer';

const modes: {
  id: ComplexityMode;
  title: string;
  description: string;
}[] = [
  {
    id: 'mixed',
    title: 'Змішаний',
    description: 'Код і constraints в одній випадковій сесії.',
  },
  {
    id: 'code',
    title: 'Код → Big O',
    description: 'Цикли, STL, графи, DP та амортизована складність.',
  },
  {
    id: 'constraints',
    title: 'Constraints → Big O',
    description: 'Оціни реалістичний порядок росту без готового коду.',
  },
];

interface ComplexityAnswer {
  concept: string;
  isCorrect: boolean;
}

export function ComplexityTrainer({
  questions,
}: {
  questions: ComplexityQuestion[];
}) {
  const [selectedMode, setSelectedMode] = useState<ComplexityMode>('mixed');
  const [session, setSession] = useState<ComplexitySession | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerLocked, setAnswerLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<ComplexityAnswer[]>([]);
  const [finished, setFinished] = useState(false);

  const startSession = (mode: ComplexityMode) => {
    const nextSession = createComplexitySession(questions, mode);
    if (nextSession.questions.length === 0) return;
    setSession(nextSession);
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setAnswerLocked(false);
    setCorrectCount(0);
    setAnswers([]);
    setFinished(false);
  };

  if (!session) {
    const availableCount = complexityQuestionCount(questions, selectedMode);
    return (
      <section
        className="mt-9 max-w-4xl"
        aria-labelledby="complexity-mode-heading"
      >
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Gauge className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="complexity-mode-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                Обери режим
              </h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                У сесії 10 питань. Після відповіді розберемо не лише результат,
                а й спосіб його отримати.
              </p>
            </div>
          </div>

          <fieldset className="mt-7">
            <legend className="sr-only">Режим тренування Big O</legend>
            <div className="grid gap-3 md:grid-cols-3">
              {modes.map((mode) => (
                <label
                  key={mode.id}
                  aria-label={mode.title}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name="complexity-mode"
                    value={mode.id}
                    checked={selectedMode === mode.id}
                    onChange={() => setSelectedMode(mode.id)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-32 flex-col rounded-2xl border border-border bg-background p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{mode.title}</span>
                      {selectedMode === mode.id && (
                        <Check
                          className="size-5 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="mt-2 text-sm leading-6 text-muted-foreground">
                      {mode.description}
                    </span>
                    <span className="mt-auto pt-3 font-mono text-xs text-muted-foreground">
                      {complexityQuestionCount(questions, mode.id)} питань у
                      пулі
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-border pt-6">
            <Button
              size="lg"
              disabled={availableCount === 0}
              onClick={() => startSession(selectedMode)}
            >
              Почати тренування
              <ArrowRight aria-hidden="true" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Порядок питань і відповідей змінюється для кожної сесії.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (finished) {
    const percentage = Math.round(
      (correctCount / session.questions.length) * 100,
    );
    const mistakes = answers.reduce<Map<string, number>>((result, answer) => {
      if (answer.isCorrect) return result;
      result.set(answer.concept, (result.get(answer.concept) ?? 0) + 1);
      return result;
    }, new Map());

    return (
      <section
        className="mt-10 max-w-4xl"
        aria-labelledby="complexity-result-heading"
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border bg-primary/[0.055] p-6 sm:p-9">
            <p className="eyebrow">Тренування завершено</p>
            <h2
              id="complexity-result-heading"
              className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {correctCount} / {session.questions.length} · {percentage}%
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              {mistakes.size === 0
                ? 'Усі оцінки правильні. Спробуй ще одну випадкову добірку, щоб перевірити інші конструкції.'
                : 'Подивись, які способи підрахунку дали найбільше помилок, і повтори їх перед наступною сесією.'}
            </p>
          </div>

          {mistakes.size > 0 && (
            <div className="p-6 sm:p-9">
              <h3 className="text-lg font-semibold">Варто повторити</h3>
              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
                {[...mistakes.entries()]
                  .sort((left, right) => right[1] - left[1])
                  .map(([concept, count]) => (
                    <li
                      key={concept}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <span className="font-medium">{concept}</span>
                      <span className="text-sm text-muted-foreground">
                        помилок: {count}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-border p-6 sm:px-9">
            <Button onClick={() => startSession(session.mode)}>
              <RotateCcw aria-hidden="true" />
              Спробувати ще раз
            </Button>
            <Link
              href="/tasks"
              className={buttonVariants({ variant: 'outline' })}
            >
              До задач
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = session.questions[questionIndex];
  const selectedOption = current.options.find(
    (option) => option.id === selectedOptionId,
  );
  const correctOption = current.options.find(
    (option) => option.id === current.correctOptionId,
  );
  const isCorrect = selectedOptionId === current.correctOptionId;

  const checkAnswer = () => {
    if (!selectedOptionId || answerLocked) return;
    setAnswerLocked(true);
    if (isCorrect) setCorrectCount((count) => count + 1);
    setAnswers((items) => [
      ...items,
      {
        concept: current.concept ?? 'аналіз складності',
        isCorrect,
      },
    ]);
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= session.questions.length) {
      setFinished(true);
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedOptionId(null);
    setAnswerLocked(false);
  };

  return (
    <section className="mt-9" aria-label="Сесія тренажера Big O">
      <TrainerProgress
        current={questionIndex + 1}
        total={session.questions.length}
        correct={correctCount}
        itemLabel="Питання"
        context={
          <span className="font-mono text-xs text-muted-foreground">
            {current.type === 'code' ? 'Код → Big O' : 'Constraints → Big O'}
          </span>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.82fr)]">
        <article className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border p-5 sm:p-7">
            <div className="flex items-center gap-2 text-primary">
              {current.type === 'code' ? (
                <Braces className="size-4" aria-hidden="true" />
              ) : (
                <Gauge className="size-4" aria-hidden="true" />
              )}
              <p className="eyebrow">
                {current.type === 'code' ? 'Проаналізуй код' : 'Оціни межі'}
              </p>
            </div>
            {current.title && (
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {current.title}
              </h2>
            )}
          </div>

          {current.type === 'code' && current.code && (
            <div className="bg-[#0b1110] text-[#e7efe9] dark:bg-[#080c0b]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-xs text-white/55">
                <span>
                  {current.language === 'cpp' ? 'C++17' : 'Pseudocode'}
                </span>
                <span>лише аналіз · код не запускається</span>
              </div>
              <pre className="overflow-x-auto p-5 text-sm leading-7 sm:p-7">
                <code>{current.code}</code>
              </pre>
            </div>
          )}

          {current.type === 'constraints' && current.constraints && (
            <div className="grid gap-3 p-5 sm:p-7">
              {current.constraints.map((constraint) => (
                <div
                  key={constraint}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-4"
                >
                  <span
                    className="size-2 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <code className="font-mono text-base">{constraint}</code>
                </div>
              ))}
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Обери типовий реалістичний орієнтир, а не абсолютну гарантію
                проходження.
              </p>
            </div>
          )}
        </article>

        <aside className="rounded-3xl border border-border bg-card p-5 lg:sticky lg:top-28">
          <fieldset disabled={answerLocked}>
            <legend className="text-xl font-semibold leading-7">
              {current.question}
            </legend>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {current.options.map((option) => {
                const selected = selectedOptionId === option.id;
                const correct =
                  answerLocked && option.id === current.correctOptionId;
                const wrong = answerLocked && selected && !correct;
                const state = correct
                  ? 'correct'
                  : wrong
                    ? 'wrong'
                    : selected
                      ? 'selected'
                      : 'idle';
                return (
                  <TrainerOptionCard
                    key={option.id}
                    name={`complexity-answer-${current.id}`}
                    value={option.id}
                    label={option.label}
                    checked={selected}
                    disabled={answerLocked}
                    state={state}
                    onChange={() => setSelectedOptionId(option.id)}
                  />
                );
              })}
            </div>
          </fieldset>

          {!answerLocked && (
            <Button
              className="mt-5 w-full"
              size="lg"
              disabled={!selectedOptionId}
              onClick={checkAnswer}
            >
              Перевірити
            </Button>
          )}

          {answerLocked && correctOption && (
            <div
              className="mt-5 border-t border-border pt-5"
              aria-live="polite"
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="mt-0.5 size-5 shrink-0 text-destructive"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <h3 className="font-semibold">
                    {isCorrect
                      ? `Правильно — ${correctOption.label}`
                      : `Твоя відповідь: ${selectedOption?.label}`}
                  </h3>
                  {!isCorrect && (
                    <p className="mt-1 text-sm font-medium text-primary">
                      Правильно: {correctOption.label}
                    </p>
                  )}
                </div>
              </div>

              <h4 className="mt-5 text-sm font-semibold">Як це побачити?</h4>
              {current.reasoning?.length ? (
                <ol className="mt-3 space-y-2 pl-5 text-sm leading-6 text-muted-foreground marker:font-mono marker:text-primary">
                  {current.reasoning.map((step) => (
                    <li key={step} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ol>
              ) : null}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {current.explanation}
              </p>

              {!isCorrect && (
                <p className="mt-4 rounded-xl border border-border bg-muted/45 p-3 text-sm leading-6">
                  <strong>Пастка:</strong>{' '}
                  {selectedOptionId &&
                  current.feedbackByOptionId?.[selectedOptionId]
                    ? current.feedbackByOptionId[selectedOptionId]
                    : current.wrongAnswerNote}
                </p>
              )}

              <Button className="mt-5 w-full" size="lg" onClick={nextQuestion}>
                {questionIndex + 1 === session.questions.length
                  ? 'Показати результат'
                  : 'Наступне питання'}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
