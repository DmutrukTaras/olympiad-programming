import { createLearningStages } from '@/content/task-template';
import type {
  ContentBlock,
  FoundationVisualKind,
  LearningProblem,
  Pattern,
  PracticeProblem,
  TaskExample,
} from '@/types/content';

export const p = (text: string): ContentBlock => ({ type: 'paragraph', text });
export const note = (title: string, text: string): ContentBlock => ({
  type: 'callout',
  title,
  text,
});
export const code = (code: string, caption = 'C++17'): ContentBlock => ({
  type: 'code',
  language: 'cpp',
  code,
  caption,
});
export const visual = (kind: FoundationVisualKind): ContentBlock => ({
  type: 'visual',
  kind,
});
export const table = (columns: string[], rows: string[][]): ContentBlock => ({
  type: 'table',
  columns,
  rows,
});
export const example = (
  input: string,
  output: string,
  explanation?: string,
): TaskExample => ({ input, output, explanation });
export const cpp = (
  body: string,
  declarations = '',
) => `#include <bits/stdc++.h>
using namespace std;
${declarations}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

${body}
}
`;

export function pattern(
  meta: Pick<
    Pattern,
    | 'id'
    | 'chapterId'
    | 'title'
    | 'description'
    | 'recognitionSigns'
    | 'constraintSignals'
    | 'notApplicableSigns'
    | 'theory'
  >,
): Pattern {
  return {
    ...meta,
    slug: meta.id,
    level: 'foundation',
    hasContent: true,
    practiceStatus: 'complete',
  };
}

type ProblemInput = Pick<
  LearningProblem,
  'id' | 'title' | 'statement' | 'input' | 'output' | 'constraints'
> & { examples: TaskExample[] };
type LessonInput = ProblemInput & {
  tryYourself: string;
  hint: string;
  bruteForce: ContentBlock[];
  whySlow: string;
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
    bruteForce,
    whySlow,
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
    level: 'foundation',
    patternIds: [patternId],
    hasEditorial: true,
    stages: createLearningStages({
      'try-yourself': [p(tryYourself)],
      hint: [p(hint)],
      'brute-force': bruteForce,
      'why-slow': [p(whySlow)],
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
  content: ProblemInput & { hint: string; level?: 'foundation' | 'core' },
): PracticeProblem {
  return {
    level: 'foundation',
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
