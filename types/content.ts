export type LevelId =
  | 'foundation'
  | 'core'
  | 'combination'
  | 'advanced'
  | 'challenge';

export type TaskKind = 'learning' | 'practice';

export interface PatternOutline {
  id: string;
  title: string;
  parts?: { id: string; title: string }[];
}

export interface ChapterOutline {
  mainPatterns: PatternOutline[];
  additionalTopics: string[];
  optionalTopics: string[];
}

export type ContentBlock =
  | { type: 'visual'; kind: FoundationVisualKind }
  | { type: 'core-visual'; kind: CoreVisualKind }
  | { type: 'combination-visual'; kind: CombinationVisualKind }
  | { type: 'advanced-visual'; kind: AdvancedVisualKind }
  | { type: 'challenge-visual'; kind: ChallengeVisualKind }
  | { type: 'table'; columns: string[]; rows: string[][] }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'code'; language: 'cpp' | 'text'; code: string; caption?: string };

export type FoundationVisualKind =
  | 'scan'
  | 'robot'
  | 'sorting'
  | 'prefix'
  | 'difference'
  | 'grid'
  | 'cycle'
  | 'invariant';

export type CoreVisualKind =
  | 'two-pointers'
  | 'sliding-window'
  | 'binary-search'
  | 'greedy-order'
  | 'interval-greedy'
  | 'brackets'
  | 'monotonic-stack'
  | 'monotonic-queue';

export type CombinationVisualKind =
  | 'graph-grid'
  | 'shortest-paths'
  | 'topological'
  | 'euler-tour'
  | 'dsu'
  | 'kruskal'
  | 'dp-grid'
  | 'range-structures';

export type AdvancedVisualKind =
  | 'kmp-fallback'
  | 'z-box'
  | 'rolling-hash'
  | 'orientation'
  | 'segment-intersection'
  | 'convex-hull'
  | 'subset-mask'
  | 'bitmask-dp'
  | 'meet-in-the-middle'
  | 'graph-decomposition'
  | 'binary-lifting'
  | 'rerooting'
  | 'inclusion-exclusion'
  | 'expected-value'
  | 'matrix-power';

export type ChallengeVisualKind =
  | 'augmenting-path'
  | 'residual-flow'
  | 'min-cut-model'
  | 'divide-conquer-opt'
  | 'knuth-window'
  | 'cht-lines'
  | 'game-states'
  | 'nim-xor'
  | 'grundy-mex'
  | 'state-expansion'
  | 'reverse-time'
  | 'hld-decomposition';

export interface TaskExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TrainerTaskMetadata {
  enabled?: boolean;
  primaryPatternId?: string;
  distractorPatternIds?: string[];
  explanation?: string;
  signals?: string[];
  feedbackByPatternId?: Record<string, string>;
}

export interface Chapter {
  id: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  level: LevelId;
  prerequisiteIds: string[];
  taskTypes: string[];
  outline?: ChapterOutline;
  takeaways: string[];
  hasContent: boolean;
}

export interface PatternPreparation {
  introduction: string;
  sections: { title: string; blocks: ContentBlock[] }[];
  questions: { question: string; answer: string }[];
}

export interface Pattern {
  id: string;
  slug: string;
  chapterId: string;
  title: string;
  level: LevelId;
  description: string;
  intuition?: ContentBlock[];
  modeling?: ContentBlock[];
  priorKnowledge?: string[];
  recognitionSigns: string[];
  constraintSignals: string[];
  notApplicableSigns: string[];
  preparation?: PatternPreparation;
  theory: ContentBlock[];
  extensions?: { title: string; blocks: ContentBlock[] }[];
  practiceStatus: 'planned' | 'complete';
  hasContent: boolean;
}

export type LearningStageId =
  | 'try-yourself'
  | 'hint'
  | 'brute-force'
  | 'why-slow'
  | 'observation'
  | 'algorithm'
  | 'proof'
  | 'complexity'
  | 'solution'
  | 'takeaway';

export interface TaskStage {
  id: LearningStageId;
  title: string;
  blocks: ContentBlock[];
}

interface TaskBase {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  level: LevelId;
  patternIds: string[];
  statement: string[];
  input: string;
  output: string;
  constraints: string[];
  examples?: TaskExample[];
  trainer?: TrainerTaskMetadata;
  hint?: string;
  stages: TaskStage[];
  hasEditorial: boolean;
}

export type LearningProblem = TaskBase & {
  kind: 'learning';
  source: 'author';
  externalUrl?: never;
};

export type PracticeProblem = TaskBase & {
  kind: 'practice';
  source: 'author' | 'algotester';
  externalUrl?: string;
  extension?: boolean;
};

export type Task = LearningProblem | PracticeProblem;

export interface ProblemTypeGroup {
  id: string;
  title: string;
  description: string;
  topics: string[];
  chapterIds: string[];
}
