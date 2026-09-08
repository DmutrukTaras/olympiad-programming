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
  AdvancedVisualKind,
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

export const visual = (kind: AdvancedVisualKind): ContentBlock => ({
  type: 'advanced-visual',
  kind,
});

type AdvancedPatternInput = Pick<
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
}: AdvancedPatternInput): Pattern {
  return {
    ...meta,
    slug: meta.id,
    level: 'advanced',
    preparation: {
      introduction:
        'Це повний теоретичний місток до Advanced-патерну. Пройди його перед навчальною задачею, якщо не можеш самостійно пояснити модель, інваріант і складність; приклади C++ тут демонструють інструмент, а не розв’язують задачу за тебе. Не намагайся запам’ятати код як заклинання. Після кожної частини назви своїми словами: що зберігає стан, яка операція змінює його, чому жоден потрібний кандидат не губиться та де саме виникає заявлена складність. Потім вручну пройди алгоритм на найменшому нетривіальному прикладі й на виродженому випадку. Для Advanced-тем особливо важливо відокремлювати математичну модель від технічної реалізації: спочатку зафіксуй індексацію, межі, типи чисел і значення нейтрального стану, а вже потім перенось псевдокод у C++17. Якщо якась формула здається очевидною, спробуй побудувати контрприклад — так швидко виявляються неправильний порядок переходів, подвійний підрахунок і припущення, якого не було в умові. Наприкінці сторінки є контрольний список: повернися до нього перед submit і переконайся, що складність порахована для всього input, включно з усіма test cases.',
      sections: [
        { title: 'Математична модель і необхідні поняття', blocks: knowledge },
        { title: 'C++17: надійна реалізація', blocks: cppNotes },
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
    level: 'advanced',
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
      takeaway: [note('Представлення → властивість → алгоритм', takeaway)],
    }),
  };
}

export function practice(
  patternId: string,
  content: ProblemInput & { hint: string; level?: 'advanced' | 'challenge' },
): PracticeProblem {
  return {
    level: 'advanced',
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
