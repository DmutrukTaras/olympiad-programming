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
  ContentBlock,
  CoreVisualKind,
  LearningProblem,
  Pattern,
  PracticeProblem,
  TaskExample,
} from '@/types/content';

export { code, cpp, example, note, p, table };

export const visual = (kind: CoreVisualKind): ContentBlock => ({
  type: 'core-visual',
  kind,
});

type CorePatternInput = Pick<
  Pattern,
  | 'id'
  | 'chapterId'
  | 'title'
  | 'description'
  | 'intuition'
  | 'priorKnowledge'
  | 'recognitionSigns'
  | 'constraintSignals'
  | 'notApplicableSigns'
  | 'theory'
  | 'extensions'
> & { cppNotes: ContentBlock[] };

type CorePatternWithPreparation = CorePatternInput & {
  knowledge: ContentBlock[];
};

export function pattern({
  cppNotes,
  knowledge,
  ...meta
}: CorePatternWithPreparation): Pattern {
  return {
    ...meta,
    slug: meta.id,
    level: 'core',
    preparation: {
      introduction:
        'Цей блок допомагає швидко відновити саме ті поняття, які потрібні для патерну. Його можна пропустити, якщо терміни та операції нижче вже впевнено знайомі.',
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
    level: 'core',
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
      takeaway: [note('Головна ідея', takeaway)],
    }),
  };
}

export function practice(
  patternId: string,
  content: ProblemInput & { hint: string; extension?: boolean },
): PracticeProblem {
  return {
    ...content,
    slug: content.id,
    kind: 'practice',
    source: 'author',
    status: 'published',
    level: 'core',
    patternIds: [patternId],
    stages: [],
    hasEditorial: false,
  };
}
