import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { chapters, patterns, problemTypeGroups, tasks } from '@/content';
import { chapterOutlines } from '@/content/chapter-outlines';
import { foundationPreparation } from '@/content/foundation/preparation';
import {
  createLearningStages,
  learningStageDefinitions,
  practiceTaskRange,
} from '@/content/task-template';
import {
  getPatternsForChapter,
  getProblemTypesForChapter,
  getTasksForPattern,
} from '@/lib/content-selectors';
import { LearningTask } from '@/components/content/learning-task';
import { PatternPreparation } from '@/components/content/pattern-preparation';
import { PracticeTaskCard } from '@/components/content/practice-task-card';
import { IntroductionLesson } from '@/components/content/introduction-lessons';
import type { PracticeProblem } from '@/types/content';

const unique = (items: string[]) =>
  assert.equal(new Set(items).size, items.length);

await test('every Foundation pattern has beginner preparation with C++ examples and two self-checks', () => {
  const foundation = patterns.filter(
    (pattern) => pattern.level === 'foundation',
  );
  assert.deepEqual(
    Object.keys(foundationPreparation).sort(),
    foundation.map((pattern) => pattern.id).sort(),
  );
  for (const pattern of foundation) {
    const preparation = pattern.preparation;
    assert.ok(preparation, pattern.id);
    assert.ok(preparation.introduction.trim(), pattern.id);
    assert.ok(preparation.sections.length >= 2, pattern.id);
    assert.ok(pattern.intuition?.length, pattern.id);
    unique(preparation.sections.map((section) => section.title));
    for (const section of preparation.sections) {
      assert.ok(section.title.trim() && section.blocks.length > 0);
    }
    const blocks = preparation.sections.flatMap((section) => section.blocks);
    assert.ok(
      blocks.some(
        (block) =>
          block.type === 'code' &&
          block.language === 'cpp' &&
          block.code.trim(),
      ),
    );
    assert.ok(blocks.some((block) => block.type === 'table'));
    assert.ok(blocks.some((block) => block.type === 'callout'));
    assert.equal(preparation.questions.length, 2);
    assert.ok(
      preparation.questions.every(
        ({ question, answer }) => question.trim() && answer.trim(),
      ),
    );
  }
});

await test('preparation and its self-check answers are collapsed by default without client state', () => {
  for (const content of Object.values(foundationPreparation)) {
    const html = renderToStaticMarkup(
      createElement(PatternPreparation, { content }),
    );
    assert.ok(html.includes('id="preparation"'));
    assert.ok(html.includes('Теорія та C++: заповнити прогалини'));
    const details = html.match(/<details\b[^>]*>/g) ?? [];
    assert.equal(details.length, 1 + content.questions.length);
    for (const tag of details) assert.doesNotMatch(tag, /\sopen(?:\s|=|>)/);
    assert.equal((html.match(/<summary\b/g) ?? []).length, details.length);
  }
});

await test('Foundation has exactly 12 complete patterns, each with one lesson and two hinted practice tasks', () => {
  const foundation = patterns.filter(
    (pattern) => pattern.level === 'foundation',
  );
  const foundationIds = new Set(foundation.map((pattern) => pattern.id));
  const foundationTasks = tasks.filter((task) =>
    task.patternIds.some((id) => foundationIds.has(id)),
  );
  assert.equal(foundation.length, 12);
  assert.equal(foundationTasks.length, 37);
  for (const pattern of foundation) {
    assert.equal(pattern.hasContent, true);
    assert.equal(pattern.practiceStatus, 'complete');
    const items = getTasksForPattern(pattern.id);
    assert.equal(items.filter((task) => task.kind === 'learning').length, 1);
    const practice = items.filter((task) => task.kind === 'practice');
    assert.equal(practice.filter((task) => !task.extension).length, 2);
    for (const task of items) {
      assert.ok(task.examples?.length);
      assert.ok(
        task.examples.every(
          (example) => example.input.trim() && example.output.trim(),
        ),
      );
    }
    for (const task of practice) {
      assert.ok(task.hint?.trim());
      assert.equal(task.hasEditorial, false);
      assert.equal(task.stages.length, 0);
    }
  }
});

await test('Core has 12 complete patterns, 36 tasks and collapsible implementation notes', () => {
  const core = patterns.filter((pattern) => pattern.level === 'core');
  const coreIds = new Set(core.map((pattern) => pattern.id));
  const coreTasks = tasks.filter((task) =>
    task.patternIds.some((id) => coreIds.has(id)),
  );
  assert.equal(core.length, 12);
  assert.equal(coreTasks.length, 36);
  for (const pattern of core) {
    assert.equal(pattern.hasContent, true);
    assert.equal(pattern.practiceStatus, 'complete');
    assert.ok(pattern.intuition?.length, pattern.id);
    assert.ok(pattern.priorKnowledge?.length, pattern.id);
    assert.ok(pattern.preparation, pattern.id);
    assert.ok(pattern.preparation!.sections.length >= 2, pattern.id);
    assert.equal(
      pattern.preparation!.sections[0].title,
      'Необхідна теорія простими словами',
    );
    assert.ok(pattern.preparation!.sections[0].blocks.length >= 2, pattern.id);
    assert.equal(pattern.preparation?.questions.length, 0);
    const html = renderToStaticMarkup(
      createElement(PatternPreparation, { content: pattern.preparation! }),
    );
    assert.equal((html.match(/<details\b/g) ?? []).length, 1);
    assert.doesNotMatch(html, /<details\b[^>]*\sopen(?:\s|=|>)/);

    const items = getTasksForPattern(pattern.id);
    assert.equal(items.filter((task) => task.kind === 'learning').length, 1);
    assert.equal(items.filter((task) => task.kind === 'practice').length, 2);
    for (const task of items) {
      assert.equal(task.level, 'core');
      assert.ok(task.examples?.length, task.id);
      assert.ok(task.constraints.length, task.id);
      if (task.kind === 'practice') assert.ok(task.hint?.trim(), task.id);
    }
  }
});

await test('Combination has 12 modeled patterns, 48 tasks and three practices per pattern', () => {
  const combination = patterns.filter(
    (pattern) => pattern.level === 'combination',
  );
  const combinationIds = new Set(combination.map((pattern) => pattern.id));
  const combinationTasks = tasks.filter((task) =>
    task.patternIds.some((id) => combinationIds.has(id)),
  );
  assert.equal(combination.length, 12);
  assert.equal(combinationTasks.length, 48);
  for (const pattern of combination) {
    assert.equal(pattern.hasContent, true);
    assert.equal(pattern.practiceStatus, 'complete');
    assert.ok(pattern.intuition?.length, pattern.id);
    assert.ok(pattern.modeling?.length, pattern.id);
    assert.ok(pattern.priorKnowledge?.length, pattern.id);
    assert.ok(pattern.preparation?.sections.length === 2, pattern.id);
    const items = getTasksForPattern(pattern.id);
    assert.equal(items.filter((task) => task.kind === 'learning').length, 1);
    assert.equal(items.filter((task) => task.kind === 'practice').length, 3);
    for (const task of items) {
      assert.ok(task.examples?.length, task.id);
      assert.ok(task.constraints.length, task.id);
      if (task.kind === 'practice') assert.ok(task.hint?.trim(), task.id);
    }
  }
});

await test('Foundation revisions keep routes and distinguish core content from extensions', () => {
  const prefix = patterns.find((pattern) => pattern.id === 'prefix-sum');
  const grid = patterns.find((pattern) => pattern.id === 'prefix-xor-2d');
  assert.equal(grid?.title, '2D Prefix');
  assert.equal(grid?.slug, 'prefix-xor-2d');
  assert.equal(chapterOutlines['ch-08'].mainPatterns[2].title, '2D Prefix');
  assert.ok(
    prefix?.extensions?.some((extension) => extension.title === 'Prefix XOR'),
  );
  const xor = tasks.find((task) => task.id === 'xor-queries');
  assert.ok(xor?.kind === 'practice' && xor.extension);
  assert.deepEqual(xor.patternIds, ['prefix-sum']);
  assert.ok(
    getTasksForPattern('prefix-xor-2d').some(
      (task) => task.id === 'occupied-seats',
    ),
  );
  assert.ok(
    getTasksForPattern('frequency-counting').some(
      (task) => task.id === 'rarest-letter' && task.kind === 'practice',
    ),
  );
  const invariants = patterns.find(
    (pattern) => pattern.id === 'invariants-observations',
  );
  assert.ok(
    invariants?.extensions?.some((extension) =>
      extension.title.includes('Contribution'),
    ),
  );
  assert.ok(!JSON.stringify(invariants?.theory).includes('Contribution'));
  assert.ok(
    chapterOutlines['ch-09'].optionalTopics.some((topic) =>
      topic.includes('Contribution'),
    ),
  );
  const math = patterns.find((pattern) => pattern.id === 'gcd-lcm-primes');
  assert.ok(
    math?.extensions?.some((extension) =>
      extension.title.includes('факторизація'),
    ),
  );
  assert.ok(
    math?.extensions?.some((extension) =>
      extension.title.includes('Binary Exponentiation'),
    ),
  );
  assert.equal(
    learningStageDefinitions.find((stage) => stage.id === 'brute-force')?.title,
    'Перший підхід',
  );
  assert.equal(
    learningStageDefinitions.find((stage) => stage.id === 'why-slow')?.title,
    'Що з ним не так?',
  );
  assert.ok(
    JSON.stringify(
      tasks.find((task) => task.id === 'track-robot')?.stages,
    ).includes('уже оптимальний'),
  );
});

await test('pattern template presents concepts before optional C++ notes and the learning task', async () => {
  const source = await readFile(
    new URL('../app/patterns/[slug]/page.tsx', import.meta.url),
    'utf8',
  );
  const sections = [
    ...source.matchAll(
      /id="(overview|intuition|modeling|recognize|constraints|not-applicable|task|theory|practice)"|<PatternPreparation content=/g,
    ),
  ].map((match) => match[1] ?? 'preparation');
  assert.deepEqual(sections, [
    'overview',
    'intuition',
    'modeling',
    'recognize',
    'constraints',
    'not-applicable',
    'preparation',
    'task',
    'theory',
    'practice',
  ]);
});

await test('intro explains total input, verdicts and explicitly marks future algorithms as preview', () => {
  const render = (chapterId: string) =>
    renderToStaticMarkup(createElement(IntroductionLesson, { chapterId }));
  const complexity = render('ch-02');
  assert.ok(
    complexity.includes('T test cases') && complexity.includes('sum(n)'),
  );
  const recognition = render('ch-04');
  for (const verdict of [
    'Wrong Answer',
    'Time Limit Exceeded',
    'Memory Limit Exceeded',
    'Runtime Error',
  ])
    assert.ok(recognition.includes(verdict));
  assert.ok(recognition.includes('Preview, а не передумова'));
  assert.ok(render('ch-01').includes('Preview: BFS'));
});

await test('26 chapters, stable published URLs and the five revised level ranges', () => {
  assert.deepEqual(
    chapters.map((chapter) => chapter.order),
    Array.from({ length: 26 }, (_, i) => i + 1),
  );
  unique(chapters.map((chapter) => chapter.id));
  unique(chapters.map((chapter) => chapter.slug));
  const ranges = {
    foundation: [6, 7, 8, 9],
    core: [10, 11, 12, 13],
    combination: [14, 15, 16, 17],
    advanced: [18, 19, 20, 21, 22],
    challenge: [23, 24, 25, 26],
  };
  for (const [level, orders] of Object.entries(ranges)) {
    assert.deepEqual(
      chapters
        .filter((chapter) => chapter.order > 5 && chapter.level === level)
        .map((chapter) => chapter.order),
      orders,
    );
  }
  assert.equal(
    chapters.find((chapter) => chapter.id === 'ch-11')?.title,
    'Search Techniques',
  );
  assert.equal(
    chapters.find((chapter) => chapter.id === 'ch-11')?.slug,
    'binary-search',
  );
  assert.equal(
    patterns.find((pattern) => pattern.id === 'prefix-sum')?.slug,
    'prefix-sum',
  );
});

await test('intro stays separate; all later chapters have main, additional and optional outlines', () => {
  assert.equal(Object.keys(chapterOutlines).length, 21);
  for (const chapter of chapters) {
    if (chapter.order <= 5) {
      assert.equal(chapter.hasContent, true);
      assert.equal(chapter.outline, undefined);
    } else {
      assert.ok(chapter.outline);
      assert.equal(chapter.outline.mainPatterns.length, 3);
      assert.ok(Array.isArray(chapter.outline.additionalTopics));
      assert.ok(Array.isArray(chapter.outline.optionalTopics));
    }
  }
  assert.deepEqual(chapterOutlines['ch-18'].optionalTopics, [
    'Suffix Automaton',
  ]);
  assert.deepEqual(chapterOutlines['ch-22'].optionalTopics, [
    'FFT / NTT',
    'Polynomial Algorithms',
  ]);
});

await test('all 14 task categories reference the same chapters, with reverse relationships', () => {
  assert.equal(problemTypeGroups.length, 14);
  unique(problemTypeGroups.map((group) => group.id));
  const expected = [
    [6, 7, 8, 9],
    [8, 10, 13, 16, 17],
    [7, 11, 12, 16, 24],
    [12, 16, 22, 23],
    [16, 20, 22],
    [8, 17],
    [14, 15, 21, 23],
    [15, 16, 21],
    [20],
    [9, 22],
    [6, 10, 18],
    [7, 9, 11, 19, 22],
    [14, 15, 21, 23],
    [9, 12, 26],
  ];
  problemTypeGroups.forEach((group, index) => {
    assert.ok(group.topics.length > 0);
    unique(group.chapterIds);
    assert.deepEqual(
      group.chapterIds,
      expected[index].map((n) => `ch-${String(n).padStart(2, '0')}`),
    );
    for (const id of group.chapterIds) {
      assert.ok(
        chapters.some((chapter) => chapter.id === id && chapter.order > 5),
      );
      assert.ok(getProblemTypesForChapter(id).includes(group));
    }
  });
});

await test('main pattern groups and chapter prerequisites contain no broken references', () => {
  unique(patterns.map((pattern) => pattern.id));
  unique(patterns.map((pattern) => pattern.slug));
  for (const chapter of chapters) {
    for (const id of chapter.prerequisiteIds) {
      assert.ok(
        chapters.some((item) => item.id === id && item.order < chapter.order),
      );
    }
    const leaves = (chapter.outline?.mainPatterns ?? []).flatMap(
      (group) => group.parts ?? [group],
    );
    assert.deepEqual(
      getPatternsForChapter(chapter.id).map((pattern) => pattern.id),
      leaves.map((leaf) => leaf.id),
    );
  }
  for (const pattern of patterns) {
    const chapter = chapters.find((item) => item.id === pattern.chapterId);
    assert.equal(pattern.level, chapter?.level);
  }
});

await test('only ready tasks are exposed and all task-to-pattern relationships exist', () => {
  unique(tasks.map((task) => task.id));
  unique(tasks.map((task) => task.slug));
  for (const task of tasks) {
    assert.ok(task.patternIds.length > 0);
    unique(task.patternIds);
    for (const id of task.patternIds)
      assert.ok(patterns.some((pattern) => pattern.id === id));
    if (task.kind === 'learning') assert.equal(task.externalUrl, undefined);
    if (task.externalUrl) {
      const url = new URL(task.externalUrl);
      assert.equal(url.protocol, 'https:');
      assert.ok(
        url.hostname === 'algotester.com' ||
          url.hostname.endsWith('.algotester.com'),
      );
    }
    if (task.status === 'draft') {
      for (const id of task.patternIds)
        assert.ok(!getTasksForPattern(id).includes(task));
    } else {
      assert.ok(
        task.statement.length > 0 &&
          task.statement.every((paragraph) => paragraph.trim()),
      );
      if (task.source === 'author')
        assert.ok(task.input && task.output && task.constraints.length);
    }
  }
});

await test('published patterns have recognition, limits, one learning problem and bounded practice', () => {
  for (const pattern of patterns.filter((item) => item.hasContent)) {
    assert.ok(
      pattern.description &&
        pattern.recognitionSigns.length &&
        pattern.constraintSignals.length &&
        pattern.notApplicableSigns.length &&
        pattern.theory.length,
    );
    const items = getTasksForPattern(pattern.id);
    assert.equal(items.filter((task) => task.kind === 'learning').length, 1);
    const practiceCount = items.filter(
      (task) => task.kind === 'practice',
    ).length;
    assert.ok(practiceCount <= practiceTaskRange.max);
    if (pattern.practiceStatus === 'complete')
      assert.ok(practiceCount >= practiceTaskRange.min);
  }
});

await test('learning editorials use all ten steps in canonical order with a C++ solution', () => {
  for (const task of tasks.filter(
    (item) => item.kind === 'learning' && item.status === 'published',
  )) {
    assert.equal(task.source, 'author');
    assert.equal(task.hasEditorial, true);
    assert.deepEqual(
      task.stages.map(({ id, title }) => ({ id, title })),
      learningStageDefinitions,
    );
    for (const stage of task.stages) assert.ok(stage.blocks.length > 0);
    assert.ok(
      task.stages
        .find((stage) => stage.id === 'solution')
        ?.blocks.some(
          (block) => block.type === 'code' && block.language === 'cpp',
        ),
    );
    const blocks = Object.fromEntries(
      task.stages.map((stage) => [stage.id, stage.blocks]),
    ) as Parameters<typeof createLearningStages>[0];
    assert.deepEqual(createLearningStages(blocks), task.stages);
  }
});

await test('learning template shows statement and first step without rendering later answers', () => {
  const task = tasks.find(
    (item) => item.kind === 'learning' && item.status === 'published',
  );
  assert.ok(task?.kind === 'learning');
  const html = renderToStaticMarkup(createElement(LearningTask, { task }));
  const statementHtml = renderToStaticMarkup(
    createElement('span', null, task.statement[0]),
  ).slice(6, -7);
  assert.ok(html.includes(statementHtml));
  assert.ok(html.includes('Constraints'));
  assert.ok(html.includes('Спробуй сам'));
  assert.ok(html.includes('Далі: '));
  assert.ok(!html.includes('C++ рішення'));
  assert.ok(!html.includes('#include'));
  assert.ok(!html.includes('Розв’язати на Algotester'));
  for (const stage of task.stages.slice(1)) {
    for (const block of stage.blocks) {
      if (block.type === 'paragraph') assert.ok(!html.includes(block.text));
    }
  }
});

const practiceFixture: PracticeProblem = {
  id: 'test-only',
  slug: 'test-only',
  title: 'Test fixture',
  kind: 'practice',
  status: 'published',
  source: 'author',
  level: 'foundation',
  patternIds: ['prefix-sum'],
  statement: ['First paragraph', 'Full statement paragraph'],
  input: 'Input',
  output: 'Output',
  constraints: ['1 ≤ n ≤ 10'],
  stages: [],
  hasEditorial: false,
};

await test('author practice exposes full internal statement without an external button', () => {
  const html = renderToStaticMarkup(
    createElement(PracticeTaskCard, { task: practiceFixture }),
  );
  assert.ok(
    html.includes('Повна умова') &&
      html.includes('Full statement paragraph') &&
      html.includes('Constraints'),
  );
  assert.ok(!html.includes('Розв’язати на Algotester'));
});

await test('Algotester button exists only with an external URL', () => {
  const noUrl: PracticeProblem = { ...practiceFixture, source: 'algotester' };
  const html = renderToStaticMarkup(
    createElement(PracticeTaskCard, { task: noUrl }),
  );
  assert.ok(!html.includes('Розв’язати на Algotester'));
  const withUrl: PracticeProblem = {
    ...practiceFixture,
    externalUrl: 'https://algotester.com/',
  };
  const linkedHtml = renderToStaticMarkup(
    createElement(PracticeTaskCard, { task: withUrl }),
  );
  assert.ok(
    linkedHtml.includes('Розв’язати на Algotester') &&
      linkedHtml.includes('href="https://algotester.com/"'),
  );
});
