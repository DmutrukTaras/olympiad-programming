import { createLearningStages } from '@/content/task-template';
import {
  code,
  cpp,
  example as foundationExample,
  note,
  p,
  table,
} from '@/content/foundation/helpers';
import type {
  ChallengeVisualKind,
  ContentBlock,
  LearningProblem,
  Pattern,
  PracticeProblem,
  TaskExample,
} from '@/types/content';

export { code, cpp, note, p, table };

const restoreNewlines = (value: string) => value.replaceAll('\\n', '\n');

export const example = (
  input: string,
  output: string,
  explanation?: string,
): TaskExample =>
  foundationExample(
    restoreNewlines(input),
    restoreNewlines(output),
    explanation ? restoreNewlines(explanation) : undefined,
  );

export const lines = (...source: string[]) => source.join('\n');

export const visual = (kind: ChallengeVisualKind): ContentBlock => ({
  type: 'challenge-visual',
  kind,
});

type ChallengePatternInput = Pick<
  Pattern,
  | 'id'
  | 'chapterId'
  | 'title'
  | 'description'
  | 'intuition'
  | 'modeling'
  | 'priorKnowledge'
  | 'recognitionSigns'
  | 'constraintSignals'
  | 'notApplicableSigns'
  | 'theory'
  | 'extensions'
> & {
  knowledge: ContentBlock[];
  cppNotes: ContentBlock[];
};

export function pattern({
  knowledge,
  cppNotes,
  ...meta
}: ChallengePatternInput): Pattern {
  return {
    ...meta,
    slug: meta.id,
    level: 'challenge',
    preparation: {
      introduction:
        'Challenge-патерн потрібно вивчати не як готовий шаблон коду, а як ланцюжок еквівалентних моделей. Перед задачею сформулюй початкову множину допустимих рішень, нове представлення та відповідність між ними в обидва боки. Далі назви інваріант структури, математичну умову оптимізації й точну складність усіх вкладених частин. Якщо переформулювання додає стан, ребро, лінію або часовий вимір, поясни, чому воно не створює заборонених рішень і не губить дозволених. C++17-код тут є останнім кроком: спочатку вручну пройди маленький приклад, вироджений випадок і контрприклад до найпростішої евристики. Особливо уважно перевіряй напрям ребер, нейтральні значення, overflow, порядок обчислення DP та припущення про монотонність. Саме на Challenge схожа recurrence або знайома назва ще не дають права застосувати оптимізацію — кожну передумову потрібно явно знайти в умові або довести.',
      sections: [
        { title: 'Модель, reduction і необхідні поняття', blocks: knowledge },
        { title: 'C++17: реалізаційний каркас', blocks: cppNotes },
      ],
      questions: [],
    },
    practiceStatus: 'complete',
    hasContent: true,
  };
}

type ProblemInput = Pick<
  LearningProblem,
  'id' | 'title' | 'statement' | 'input' | 'output' | 'constraints' | 'trainer'
> & { examples: TaskExample[] };

type LessonInput = ProblemInput & {
  tryYourself: string;
  hint: string;
  firstApproach: ContentBlock[];
  approachReview: string;
  observation: ContentBlock[];
  algorithm: string[];
  proof: string;
  complexity: string;
  solution: string;
  takeaway: string;
};

export function learning(
  patternId: string,
  content: LessonInput,
): LearningProblem {
  const {
    tryYourself,
    hint,
    firstApproach,
    approachReview,
    observation,
    algorithm,
    proof,
    complexity,
    solution,
    takeaway,
    ...problem
  } = content;
  return {
    ...problem,
    slug: problem.id,
    kind: 'learning',
    source: 'author',
    status: 'published',
    level: 'challenge',
    patternIds: [patternId],
    hasEditorial: true,
    stages: createLearningStages({
      'try-yourself': [p(tryYourself)],
      hint: [p(hint)],
      'brute-force': firstApproach,
      'why-slow': [p(approachReview)],
      observation,
      algorithm: [{ type: 'list', items: algorithm }],
      proof: [p(proof)],
      complexity: [p(complexity)],
      solution: [code(solution, 'Повне рішення · GNU C++17')],
      takeaway: [note('Reduction → інваріант → реалізація', takeaway)],
    }),
  };
}

export function practice(
  patternId: string,
  content: ProblemInput & { hint: string },
): PracticeProblem {
  return {
    ...content,
    slug: content.id,
    kind: 'practice',
    source: 'author',
    status: 'published',
    level: 'challenge',
    patternIds: [patternId],
    stages: [],
    hasEditorial: false,
  };
}
