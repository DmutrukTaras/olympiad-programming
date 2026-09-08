import type { ContentBlock, PatternPreparation } from '@/types/content';

export type TheorySections = PatternPreparation['sections'];

export const paragraph = (text: string): ContentBlock => ({
  type: 'paragraph',
  text,
});

export const list = (...items: string[]): ContentBlock => ({
  type: 'list',
  items,
});

export const note = (title: string, text: string): ContentBlock => ({
  type: 'callout',
  title,
  text,
});

export const code = (source: string, caption = 'C++17'): ContentBlock => ({
  type: 'code',
  language: 'cpp',
  code: source,
  caption,
});

export const table = (
  columns: string[],
  rows: string[][],
): ContentBlock => ({ type: 'table', columns, rows });
