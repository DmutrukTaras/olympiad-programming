import type { Pattern } from '@/types/content';
import { chapters } from '@/content/chapters';
import { corePatterns } from '@/content/core';
import { foundationPatterns } from '@/content/foundation';
import { foundationPreparation } from '@/content/foundation/preparation';

const publishedPatterns: Record<string, Pattern> = Object.fromEntries(
  [
    ...foundationPatterns.map((pattern) => ({
      ...pattern,
      preparation: foundationPreparation[pattern.id],
    })),
    ...corePatterns,
  ].map((pattern) => [pattern.id, pattern]),
);

// Drafts come from the chapter outline, so navigation cannot drift away from it.
export const patterns: Pattern[] = chapters.flatMap((chapter) =>
  (chapter.outline?.mainPatterns ?? []).flatMap((group) =>
    (group.parts ?? [group]).map(
      (item): Pattern =>
        publishedPatterns[item.id] ?? {
          id: item.id,
          slug: item.id,
          chapterId: chapter.id,
          title: item.title,
          level: chapter.level,
          description: '',
          recognitionSigns: [],
          constraintSignals: [],
          notApplicableSigns: [],
          theory: [],
          practiceStatus: 'planned',
          hasContent: false,
        },
    ),
  ),
);
