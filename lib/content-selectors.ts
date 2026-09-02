import { chapters, patterns, tasks } from '@/content';

export const getChapterById = (id: string) => chapters.find((item) => item.id === id);
export const getChapterBySlug = (slug: string) => chapters.find((item) => item.slug === slug);
export const getPatternBySlug = (slug: string) => patterns.find((item) => item.slug === slug);
export const getPatternsForChapter = (chapterId: string) =>
  patterns.filter((item) => item.chapterId === chapterId);
export const getTaskById = (id: string) => tasks.find((item) => item.id === id);
export const getTasksForPattern = (patternId: string) =>
  tasks.filter((item) => item.patternIds.includes(patternId));
