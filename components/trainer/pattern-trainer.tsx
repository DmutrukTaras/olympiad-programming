'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Target,
  X,
  XCircle,
} from 'lucide-react';
import { LevelBadge } from '@/components/content/level-badge';
import { TaskExamples } from '@/components/content/task-examples';
import { Button, buttonVariants } from '@/components/ui/button';
import { levelOrder } from '@/content/levels';
import {
  createTrainerSession,
  trainerTaskCount,
  type TrainerCatalog,
  type TrainerLevelId,
  type TrainerPattern,
  type TrainerSession,
} from '@/lib/trainer';
import { cn } from '@/lib/utils';

const levelAccentClasses = {
  foundation:
    'border-level-foundation/35 peer-checked:border-level-foundation peer-checked:bg-level-foundation/10',
  core: 'border-level-core/35 peer-checked:border-level-core peer-checked:bg-level-core/10',
  combination:
    'border-level-combination/35 peer-checked:border-level-combination peer-checked:bg-level-combination/10',
  advanced:
    'border-level-advanced/35 peer-checked:border-level-advanced peer-checked:bg-level-advanced/10',
  challenge:
    'border-level-challenge/35 peer-checked:border-level-challenge peer-checked:bg-level-challenge/10',
} as const;

interface TrainerAnswer {
  primaryPattern: TrainerPattern;
  isCorrect: boolean;
}

export function PatternTrainer({ catalog }: { catalog: TrainerCatalog }) {
  const [selectedLevel, setSelectedLevel] =
    useState<TrainerLevelId>('foundation');
  const [session, setSession] = useState<TrainerSession | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(
    null,
  );
  const [answerLocked, setAnswerLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<TrainerAnswer[]>([]);
  const [finished, setFinished] = useState(false);

  const startSession = (level: TrainerLevelId) => {
    const nextSession = createTrainerSession(catalog, level);
    if (nextSession.questions.length === 0) return;
    setSession(nextSession);
    setQuestionIndex(0);
    setSelectedPatternId(null);
    setAnswerLocked(false);
    setCorrectCount(0);
    setAnswers([]);
    setFinished(false);
  };

  if (!session) {
    const availableCount = trainerTaskCount(catalog, selectedLevel);
    return (
      <section
        className="mt-10 max-w-4xl"
        aria-labelledby="trainer-level-heading"
      >
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Target className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="trainer-level-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                Обери рівень
              </h2>
              <p className="mt-2 leading-7 text-muted-foreground">
                Одна сесія — до 10 різних задач. Після вибору побачиш лише
                умову, constraints і 8 правдоподібних патернів.
              </p>
            </div>
          </div>

          <fieldset className="mt-7">
            <legend className="sr-only">Рівень складності тренування</legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {levelOrder.map((level) => (
                <label key={level} className="cursor-pointer">
                  <input
                    type="radio"
                    name="trainer-level"
                    value={level}
                    checked={selectedLevel === level}
                    onChange={() => setSelectedLevel(level)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      'flex min-h-20 items-center justify-between gap-3 rounded-2xl border bg-background p-4 transition-colors peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
                      levelAccentClasses[level],
                    )}
                  >
                    <span>
                      <LevelBadge level={level} />
                      <span className="mt-2 block text-xs text-muted-foreground">
                        {trainerTaskCount(catalog, level)} задач у пулі
                      </span>
                    </span>
                    {selectedLevel === level && (
                      <Check
                        className="size-5 text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </label>
              ))}
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="trainer-level"
                  value="all"
                  checked={selectedLevel === 'all'}
                  onChange={() => setSelectedLevel('all')}
                  className="peer sr-only"
                />
                <span className="flex min-h-20 items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-background p-4 transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50">
                  <span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                      Усі рівні
                    </span>
                    <span className="mt-2 block text-xs text-muted-foreground">
                      {trainerTaskCount(catalog, 'all')} задач у пулі
                    </span>
                  </span>
                  {selectedLevel === 'all' && (
                    <Check className="size-5 text-primary" aria-hidden="true" />
                  )}
                </span>
              </label>
            </div>
          </fieldset>

          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-border pt-6">
            <Button
              size="lg"
              onClick={() => startSession(selectedLevel)}
              disabled={availableCount === 0}
            >
              Почати тренування
              <ArrowRight aria-hidden="true" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Відповіді не зберігаються після перезавантаження сторінки.
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
    const mistakes = answers.reduce<
      Map<string, TrainerAnswer & { count: number }>
    >((result, answer) => {
      if (answer.isCorrect) return result;
      const previous = result.get(answer.primaryPattern.id);
      result.set(answer.primaryPattern.id, {
        ...answer,
        count: (previous?.count ?? 0) + 1,
      });
      return result;
    }, new Map());

    return (
      <section
        className="mt-10 max-w-4xl"
        aria-labelledby="trainer-result-heading"
      >
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="border-b border-border bg-primary/[0.055] p-6 sm:p-9">
            <p className="eyebrow">Сесію завершено</p>
            <h2
              id="trainer-result-heading"
              className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {correctCount} з {session.questions.length} · {percentage}%
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              {mistakes.size === 0
                ? 'Усі патерни розпізнано правильно. Спробуй інший рівень або ще одну випадкову добірку.'
                : 'Переглянь патерни, де була помилка, а потім запусти нову добірку цього рівня.'}
            </p>
          </div>

          {mistakes.size > 0 && (
            <div className="p-6 sm:p-9">
              <h3 className="text-lg font-semibold">Що варто повторити</h3>
              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
                {[...mistakes.values()].map(({ primaryPattern, count }) => (
                  <li
                    key={primaryPattern.id}
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <span>
                      <span className="font-medium">
                        {primaryPattern.title}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        помилок: {count}
                      </span>
                    </span>
                    <Link
                      href={`/patterns/${primaryPattern.slug}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Повторити патерн →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-border p-6 sm:px-9">
            <Button onClick={() => startSession(session.level)}>
              <RotateCcw aria-hidden="true" />
              Спробувати ще раз
            </Button>
            <Button variant="outline" onClick={() => setSession(null)}>
              Змінити рівень
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const question = session.questions[questionIndex];
  const selectedPattern = question.options.find(
    (pattern) => pattern.id === selectedPatternId,
  );
  const isCorrect = selectedPatternId === question.primaryPattern.id;
  const currentLevel = session.level === 'all' ? null : session.level;

  const checkAnswer = () => {
    if (!selectedPatternId || answerLocked) return;
    setAnswerLocked(true);
    if (isCorrect) setCorrectCount((count) => count + 1);
    setAnswers((items) => [
      ...items,
      { primaryPattern: question.primaryPattern, isCorrect },
    ]);
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= session.questions.length) {
      setFinished(true);
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedPatternId(null);
    setAnswerLocked(false);
  };

  return (
    <section className="mt-9" aria-label="Сесія тренажера">
      <div className="mb-7 rounded-2xl border border-border bg-card px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              Задача {questionIndex + 1} з {session.questions.length}
            </span>
            {currentLevel && <LevelBadge level={currentLevel} compact />}
          </div>
          <span className="text-muted-foreground">
            Правильно:{' '}
            <strong className="text-foreground">{correctCount}</strong>
          </span>
        </div>
        <progress
          className="mt-3 block h-1.5 w-full overflow-hidden rounded-full bg-muted accent-primary [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
          aria-label="Прогрес тренування"
          max={session.questions.length}
          value={questionIndex + 1}
        />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.28fr)_minmax(20rem,0.72fr)]">
        <article className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="p-5 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Умова
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              {question.task.title}
            </h2>
            <div className="mt-5 space-y-3 leading-7 text-muted-foreground">
              {question.task.statement.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          {(question.task.input || question.task.output) && (
            <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
              {question.task.input && (
                <div className="bg-card p-5 sm:p-6">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Вхідні дані
                  </h3>
                  <p className="mt-2 text-sm leading-6">
                    {question.task.input}
                  </p>
                </div>
              )}
              {question.task.output && (
                <div className="bg-card p-5 sm:p-6">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Вихідні дані
                  </h3>
                  <p className="mt-2 text-sm leading-6">
                    {question.task.output}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="border-t border-border p-5 sm:p-8">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Constraints
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {question.task.constraints.map((constraint) => (
                <code
                  key={constraint}
                  className="rounded-lg bg-muted px-2.5 py-1.5 text-xs"
                >
                  {constraint}
                </code>
              ))}
            </div>
          </div>

          {Boolean(question.task.examples?.length) && (
            <div className="border-t border-border p-5 sm:p-8">
              <TaskExamples examples={question.task.examples} />
            </div>
          )}
        </article>

        <aside className="rounded-3xl border border-border bg-card p-5 lg:sticky lg:top-28">
          <fieldset disabled={answerLocked}>
            <legend className="text-xl font-semibold leading-7">
              Який патерн ти б перевірив першим?
            </legend>
            <div className="mt-5 grid gap-2.5">
              {question.options.map((pattern) => {
                const selected = selectedPatternId === pattern.id;
                const correct =
                  answerLocked && pattern.id === question.primaryPattern.id;
                const wrong = answerLocked && selected && !correct;
                return (
                  <label
                    key={pattern.id}
                    aria-label={pattern.title}
                    className={cn(
                      'relative cursor-pointer rounded-xl border border-border bg-background p-3.5 transition-colors hover:border-primary/45 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50',
                      selected &&
                        !answerLocked &&
                        'border-primary/60 bg-primary/5',
                      correct && 'border-primary bg-primary/10',
                      wrong && 'border-destructive bg-destructive/10',
                      answerLocked && 'cursor-default',
                    )}
                  >
                    <input
                      type="radio"
                      name={`trainer-answer-${question.task.id}`}
                      value={pattern.id}
                      checked={selected}
                      onChange={() => setSelectedPatternId(pattern.id)}
                      className="sr-only"
                    />
                    <span className="flex items-start gap-3">
                      <span
                        className={cn(
                          'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-border',
                          selected && 'border-primary',
                          correct &&
                            'border-primary bg-primary text-primary-foreground',
                          wrong &&
                            'border-destructive bg-destructive text-white',
                        )}
                        aria-hidden="true"
                      >
                        {correct && <Check className="size-3" />}
                        {wrong && <X className="size-3" />}
                      </span>
                      <span className="min-w-0 text-sm font-medium leading-5">
                        {pattern.title}
                        {correct && (
                          <span className="mt-1 block text-xs font-normal text-primary">
                            Правильна відповідь
                          </span>
                        )}
                        {wrong && (
                          <span className="mt-1 block text-xs font-normal text-destructive">
                            Твоя відповідь
                          </span>
                        )}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {!answerLocked && (
            <Button
              className="mt-5 w-full"
              size="lg"
              disabled={!selectedPatternId}
              onClick={checkAnswer}
            >
              Перевірити
            </Button>
          )}

          {answerLocked && (
            <div
              className="mt-5 border-t border-border pt-5"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="size-5 text-destructive"
                    aria-hidden="true"
                  />
                )}
                <h3 className="font-semibold">
                  {isCorrect ? 'Правильно' : 'Поки ні'}
                </h3>
              </div>
              {!isCorrect && selectedPattern && (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Ти обрав «{selectedPattern.title}». Першим тут варто
                  перевірити «{question.primaryPattern.title}».
                </p>
              )}
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {question.explanation}
              </p>

              {!isCorrect &&
                selectedPatternId &&
                question.feedbackByPatternId[selectedPatternId] && (
                  <p className="mt-3 rounded-xl border border-border bg-muted/45 p-3 text-sm leading-6">
                    <strong>Чому не цей варіант:</strong>{' '}
                    {question.feedbackByPatternId[selectedPatternId]}
                  </p>
                )}

              {question.signals.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Ключові сигнали</h4>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                    {question.signals.map((signal) => (
                      <li key={signal} className="flex gap-2">
                        <Check
                          className="mt-1 size-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        {signal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {question.secondaryPatterns.length > 0 && (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  <strong className="text-foreground">Також пов’язано:</strong>{' '}
                  {question.secondaryPatterns
                    .map((pattern) => pattern.title)
                    .join(', ')}
                </p>
              )}

              <div className="mt-5 grid gap-2">
                <Button size="lg" onClick={nextQuestion}>
                  {questionIndex + 1 === session.questions.length
                    ? 'Показати результат'
                    : 'Наступна задача'}
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Link
                  href={`/patterns/${question.primaryPattern.slug}`}
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  Прочитати про патерн
                </Link>
                {question.task.externalUrl && (
                  <a
                    href={question.task.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonVariants({ variant: 'ghost', size: 'lg' })}
                  >
                    Розв’язати на Algotester
                    <ExternalLink aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
