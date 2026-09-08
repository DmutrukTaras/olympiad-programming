import type {
  ComplexityMode,
  ComplexityQuestion,
  ComplexitySession,
} from '@/types/trainer';

const shuffle = <T>(items: readonly T[], random: () => number): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
};

export function createComplexitySession(
  questions: ComplexityQuestion[],
  mode: ComplexityMode,
  random: () => number = Math.random,
): ComplexitySession {
  const pool = questions.filter(
    (question) => mode === 'mixed' || question.type === mode,
  );

  return {
    mode,
    questions: shuffle(pool, random)
      .slice(0, 10)
      .map((question) => ({
        ...question,
        constraints: question.constraints
          ? [...question.constraints]
          : undefined,
        options: shuffle(question.options, random),
        reasoning: question.reasoning ? [...question.reasoning] : undefined,
        feedbackByOptionId: question.feedbackByOptionId
          ? { ...question.feedbackByOptionId }
          : undefined,
      })),
  };
}

export const complexityQuestionCount = (
  questions: ComplexityQuestion[],
  mode: ComplexityMode,
) =>
  questions.filter((question) => mode === 'mixed' || question.type === mode)
    .length;
