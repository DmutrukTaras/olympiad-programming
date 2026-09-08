import type { Pattern } from '@/types/content';
import { chapters } from '@/content/chapters';
import { combinationPatterns } from '@/content/combination';
import { corePatterns } from '@/content/core';
import { foundationPatterns } from '@/content/foundation';
import { foundationPreparation } from '@/content/foundation/preparation';
import { theoryAdditions } from '@/content/theory';

const extendPreparation = (pattern: Pattern): Pattern => {
  if (!pattern.preparation) return pattern;
  return {
    ...pattern,
    preparation: {
      ...pattern.preparation,
      sections: [
        ...pattern.preparation.sections,
        ...(theoryAdditions[pattern.id] ?? []),
      ],
    },
  };
};

const publishedPatterns: Record<string, Pattern> = Object.fromEntries(
  [
    ...foundationPatterns.map((pattern) => ({
      ...pattern,
      preparation: foundationPreparation[pattern.id],
    })),
    ...corePatterns,
    ...combinationPatterns,
  ].map(extendPreparation).map((pattern) => [pattern.id, pattern]),
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
