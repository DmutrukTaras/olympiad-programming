import { createLearningStages } from '@/content/task-template';
import {
  code,
  cpp,
  example,
  note,
  p,
  table,
} from '@/content/foundation/helpers';
import type {
  CombinationVisualKind,
  ContentBlock,
  LearningProblem,
  Pattern,
  PracticeProblem,
  TaskExample,
} from '@/types/content';

export { code, cpp, example, note, p, table };

export const visual = (kind: CombinationVisualKind): ContentBlock => ({
  type: 'combination-visual',
  kind,
});

type CombinationPatternInput = Pick<
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
}: CombinationPatternInput): Pattern {
  return {
    ...meta,
    slug: meta.id,
    level: 'combination',
    preparation: {
      introduction:
        'Відкрий цей блок, якщо для моделі бракує графової, DP або структурної бази. Він пояснює потрібні поняття й мінімальний C++17 API, але не підміняє власну спробу.',
      sections: [
        { title: 'Необхідна теорія простими словами', blocks: knowledge },
        { title: 'C++17: операції, шаблон і пастки', blocks: cppNotes },
      ],
      questions: [],
    },
    practiceStatus: 'complete',
    hasContent: true,
  };
}

type ProblemInput = Pick<
  LearningProblem,
  'id' | 'title' | 'statement' | 'input' | 'output' | 'constraints'
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
    level: 'combination',
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
      takeaway: [note('Модель → комбінація', takeaway)],
    }),
  };
}

export function practice(
  patternId: string,
  content: ProblemInput & {
    hint: string;
    level?: 'combination' | 'advanced';
  },
): PracticeProblem {
  return {
    level: 'combination',
    ...content,
    slug: content.id,
    kind: 'practice',
    source: 'author',
    status: 'published',
    patternIds: [patternId],
    stages: [],
    hasEditorial: false,
  };
}
