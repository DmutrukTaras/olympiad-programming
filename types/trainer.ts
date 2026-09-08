import type { LevelId } from '@/types/content';

export type ComplexityQuestionType = 'code' | 'constraints';
export type ComplexityMode = 'mixed' | ComplexityQuestionType;

export interface ComplexityOption {
  id: string;
  label: string;
}

export interface ComplexityQuestion {
  id: string;
  type: ComplexityQuestionType;
  title?: string;
  code?: string;
  language?: 'cpp' | 'pseudo';
  constraints?: string[];
  question: string;
  options: ComplexityOption[];
  correctOptionId: string;
  explanation: string;
  reasoning?: string[];
  wrongAnswerNote?: string;
  feedbackByOptionId?: Record<string, string>;
  difficulty: LevelId;
  concept?: string;
}

export interface ComplexitySession {
  mode: ComplexityMode;
  questions: ComplexityQuestion[];
}
