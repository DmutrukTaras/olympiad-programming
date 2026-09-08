import type {
  LevelId,
  Pattern,
  ProblemTypeGroup,
  Task,
  TrainerTaskMetadata,
} from '@/types/content';

export type TrainerLevelId = LevelId | 'all';

export interface TrainerPattern {
  id: string;
  slug: string;
  chapterId: string;
  title: string;
  level: LevelId;
  description: string;
  recognitionSigns: string[];
  constraintSignals: string[];
}

export interface TrainerTask {
  id: string;
  title: string;
  level: LevelId;
  statement: string[];
  input: string;
  output: string;
  constraints: string[];
  examples?: { input: string; output: string }[];
  externalUrl?: string;
  patternIds: string[];
  trainer?: TrainerTaskMetadata;
}

export interface TrainerCatalog {
  tasks: TrainerTask[];
  patterns: TrainerPattern[];
  problemTypeGroups: Pick<ProblemTypeGroup, 'id' | 'chapterIds'>[];
}

export interface TrainerQuestion {
  task: TrainerTask;
  primaryPattern: TrainerPattern;
  secondaryPatterns: TrainerPattern[];
  options: TrainerPattern[];
  explanation: string;
  signals: string[];
  feedbackByPatternId: Record<string, string>;
}

export interface TrainerSession {
  level: TrainerLevelId;
  questions: TrainerQuestion[];
}

const primaryPatternId = (task: TrainerTask) =>
  task.trainer?.primaryPatternId ?? task.patternIds[0];

const shuffle = <T>(items: readonly T[], random: () => number): T[] => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
};

const uniquePatterns = (patterns: TrainerPattern[]) => {
  const seen = new Set<string>();
  return patterns.filter((pattern) => {
    if (seen.has(pattern.id)) return false;
    seen.add(pattern.id);
    return true;
  });
};

export function buildTrainerCatalog(
  sourceTasks: Task[],
  sourcePatterns: Pattern[],
  sourceGroups: ProblemTypeGroup[],
): TrainerCatalog {
  const patterns = sourcePatterns
    .filter((pattern) => pattern.hasContent)
    .map<TrainerPattern>((pattern) => ({
      id: pattern.id,
      slug: pattern.slug,
      chapterId: pattern.chapterId,
      title: pattern.title,
      level: pattern.level,
      description: pattern.description,
      recognitionSigns: [...pattern.recognitionSigns],
      constraintSignals: [...pattern.constraintSignals],
    }));
  const validPatternIds = new Set(patterns.map((pattern) => pattern.id));

  const tasks = sourceTasks
    .filter((task) => {
      const primary = task.trainer?.primaryPatternId ?? task.patternIds[0];
      return (
        task.status === 'published' &&
        task.trainer?.enabled !== false &&
        task.statement.length > 0 &&
        task.constraints.length > 0 &&
        Boolean(primary && validPatternIds.has(primary))
      );
    })
    .map<TrainerTask>((task) => ({
      id: task.id,
      title: task.title,
      level: task.level,
      statement: [...task.statement],
      input: task.input,
      output: task.output,
      constraints: [...task.constraints],
      examples: task.examples?.map(({ input, output }) => ({ input, output })),
      externalUrl: task.externalUrl,
      patternIds: [...task.patternIds],
      trainer: task.trainer
        ? {
            ...task.trainer,
            distractorPatternIds: task.trainer.distractorPatternIds
              ? [...task.trainer.distractorPatternIds]
              : undefined,
            signals: task.trainer.signals
              ? [...task.trainer.signals]
              : undefined,
            feedbackByPatternId: task.trainer.feedbackByPatternId
              ? { ...task.trainer.feedbackByPatternId }
              : undefined,
          }
        : undefined,
    }));

  return {
    tasks,
    patterns,
    problemTypeGroups: sourceGroups.map(({ id, chapterIds }) => ({
      id,
      chapterIds: [...chapterIds],
    })),
  };
}

function distractorsFor(
  task: TrainerTask,
  correct: TrainerPattern,
  patternPool: TrainerPattern[],
  groups: TrainerCatalog['problemTypeGroups'],
  random: () => number,
) {
  const byId = new Map(patternPool.map((pattern) => [pattern.id, pattern]));
  const manual = (task.trainer?.distractorPatternIds ?? [])
    .map((id) => byId.get(id))
    .filter((pattern): pattern is TrainerPattern => Boolean(pattern));
  const sameChapter = shuffle(
    patternPool.filter((pattern) => pattern.chapterId === correct.chapterId),
    random,
  );
  const sameLevel = shuffle(
    patternPool.filter((pattern) => pattern.level === correct.level),
    random,
  );
  const relatedChapterIds = new Set(
    groups
      .filter((group) => group.chapterIds.includes(correct.chapterId))
      .flatMap((group) => group.chapterIds),
  );
  const relatedTypes = shuffle(
    patternPool.filter((pattern) => relatedChapterIds.has(pattern.chapterId)),
    random,
  );
  const fallback = shuffle(patternPool, random);

  return uniquePatterns([
    ...manual,
    ...sameChapter,
    ...sameLevel,
    ...relatedTypes,
    ...fallback,
  ])
    .filter((pattern) => pattern.id !== correct.id)
    .slice(0, 7);
}

export function createTrainerSession(
  catalog: TrainerCatalog,
  level: TrainerLevelId,
  random: () => number = Math.random,
): TrainerSession {
  const patternPool = catalog.patterns.filter(
    (pattern) => level === 'all' || pattern.level === level,
  );
  const patternById = new Map(
    catalog.patterns.map((pattern) => [pattern.id, pattern]),
  );
  const allowedPatternIds = new Set(patternPool.map((pattern) => pattern.id));
  const eligibleTasks = catalog.tasks.filter((task) => {
    const primary = primaryPatternId(task);
    return (
      (level === 'all' || task.level === level) &&
      Boolean(primary && allowedPatternIds.has(primary))
    );
  });

  const questions = shuffle(eligibleTasks, random)
    .slice(0, 10)
    .map<TrainerQuestion>((task) => {
      const primary = patternById.get(primaryPatternId(task));
      if (!primary) throw new Error(`Unknown primary pattern for ${task.id}`);

      const secondaryPatterns = task.patternIds
        .filter((id) => id !== primary.id)
        .map((id) => patternById.get(id))
        .filter((pattern): pattern is TrainerPattern => Boolean(pattern));
      const distractors = distractorsFor(
        task,
        primary,
        patternPool,
        catalog.problemTypeGroups,
        random,
      );

      return {
        task,
        primaryPattern: primary,
        secondaryPatterns,
        options: shuffle([primary, ...distractors], random),
        explanation:
          task.trainer?.explanation ??
          `Центральна модель цієї задачі — «${primary.title}». ${primary.description}`,
        signals: task.trainer?.signals ?? [
          ...primary.recognitionSigns.slice(0, 2),
          ...primary.constraintSignals.slice(0, 1),
        ],
        feedbackByPatternId: task.trainer?.feedbackByPatternId ?? {},
      };
    });

  return { level, questions };
}

export function trainerTaskCount(
  catalog: TrainerCatalog,
  level: TrainerLevelId,
) {
  const allowedPatternIds = new Set(
    catalog.patterns
      .filter((pattern) => level === 'all' || pattern.level === level)
      .map((pattern) => pattern.id),
  );
  return catalog.tasks.filter(
    (task) =>
      (level === 'all' || task.level === level) &&
      allowedPatternIds.has(primaryPatternId(task)),
  ).length;
}
