export type LevelId =
  | 'foundation'
  | 'core'
  | 'combination'
  | 'advanced'
  | 'challenge';

export type TaskKind = 'learning' | 'practice';

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'code'; language: 'cpp' | 'text'; code: string; caption?: string };

export interface Chapter {
  id: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  level: LevelId;
  prerequisiteIds: string[];
  taskTypes: string[];
  patternIds: string[];
  takeaways: string[];
  hasContent: boolean;
}

export interface Pattern {
  id: string;
  slug: string;
  chapterId: string;
  title: string;
  level: LevelId;
  description: string;
  recognitionSigns: string[];
  constraintSignals: string[];
  theory: ContentBlock[];
  taskIds: string[];
  hasContent: boolean;
}

export interface TaskStage {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface Task {
  id: string;
  slug: string;
  title: string;
  kind: TaskKind;
  level: LevelId;
  patternIds: string[];
  statement: string[];
  input: string;
  output: string;
  constraints: string[];
  stages: TaskStage[];
  externalUrl?: string;
  hasEditorial: boolean;
}

export interface ProblemTypeGroup {
  id: string;
  title: string;
  description: string;
  chapterIds: string[];
}
