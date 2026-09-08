import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3 } from 'lucide-react';
import {
  getPatternsForChapter,
  getProblemTypesForChapter,
} from '@/lib/content-selectors';
import type { Chapter } from '@/types/content';
import { FinalMixedSet } from '@/components/content/final-mixed-set';

export function ChapterCurriculum({ chapter }: { chapter: Chapter }) {
  const patterns = getPatternsForChapter(chapter.id);
  const groups = getProblemTypesForChapter(chapter.id);

  return (
    <>
      {chapter.takeaways.length > 0 && (
        <section id="outcomes" className="scroll-mt-28 py-10">
          <p className="eyebrow">Навчальна ціль</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Після цієї глави ти зможеш
          </h2>
          <ul className="mt-6 space-y-4">
            {chapter.takeaways.map((item) => (
              <li
                key={item}
                className="flex gap-3 leading-7 text-muted-foreground"
              >
                <CheckCircle2
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section id="patterns" className="scroll-mt-28 py-10">
        <p className="eyebrow">Основні патерни</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">
          Навчальний маршрут
        </h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          {chapter.level === 'foundation'
            ? 'Три патерни: спочатку ідея й маленький приклад, потім авторська задача з розбором і дві основні вправи на кожен патерн. C++-підказки та позначені extensions відкривай за потреби.'
            : chapter.level === 'core'
              ? 'Три патерни: перед задачею можна відкрити refresher потрібної теорії та C++17, далі пройти авторський розбір і закріпити матеріал двома вправами.'
              : chapter.level === 'combination'
                ? 'Три патерни з акцентом на моделювання й комбінування: один повний авторський розбір і три вправи різного рівня на кожен патерн. Теоретичний refresher та extensions відкривай за потреби.'
                : chapter.level === 'advanced'
                  ? 'Три складні патерни: для кожного є окрема сторінка з п’яти великих частин теорії, інтерактивна модель, повний авторський розбір і 3–4 вправи — від чистого застосування до прихованого патерну.'
                  : chapter.level === 'challenge'
                    ? 'Три capstone-патерни: п’ятичастинна теорія з доказом reduction, інтерактивне переформулювання, повний авторський розбір і три вправи — від варіації до прихованої комбінації.'
                    : 'Для кожного патерну — авторська навчальна задача з розбором і 2–4 задачі для практики. Матеріали додаються поступово.'}
        </p>
        <div className="mt-7 space-y-4">
          {chapter.outline?.mainPatterns.map((group, index) => (
            <section
              key={group.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="flex items-baseline gap-4 px-5 pt-5">
                <span className="font-mono text-xs text-muted-foreground">
                  {chapter.order}.{index + 1}
                </span>
                <h3 className="font-semibold">{group.title}</h3>
              </div>
              <div className="divide-y divide-border px-5">
                {(group.parts ?? [group]).map((item) => {
                  const pattern = patterns.find(
                    (entry) => entry.id === item.id,
                  );
                  if (!pattern) return null;
                  return pattern.hasContent ? (
                    <Link
                      key={item.id}
                      href={`/patterns/${pattern.slug}`}
                      className="flex items-center justify-between gap-4 py-4 text-sm leading-6 hover:text-primary"
                    >
                      <span>
                        {group.parts
                          ? pattern.title
                          : 'Відкрити навчальний матеріал'}
                        {pattern.description && (
                          <span className="mt-1 block text-muted-foreground">
                            {pattern.description}
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  ) : (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-4 text-sm leading-6 text-muted-foreground"
                    >
                      <span>
                        {group.parts ? `${pattern.title} · ` : ''}Матеріал
                        готується
                      </span>
                      <Clock3 className="size-4 shrink-0" aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      {Boolean(chapter.outline?.additionalTopics.length) && (
        <section
          id="additional"
          className="scroll-mt-28 border-t border-border py-10"
        >
          <p className="eyebrow">Усередині глави</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            {chapter.order === 26 ? 'Типові комбінації' : 'Додаткові теми'}
          </h2>
          <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {chapter.outline?.additionalTopics.map((topic) => (
              <li
                key={topic}
                className="border-l-2 border-primary/30 pl-3 text-sm leading-6 text-muted-foreground"
              >
                {topic}
              </li>
            ))}
          </ul>
        </section>
      )}

      {Boolean(chapter.outline?.optionalTopics.length) && (
        <section
          id="optional"
          className="scroll-mt-28 border-t border-border py-10"
        >
          <p className="eyebrow">Optional / later</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Для подальшого поглиблення
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {chapter.level === 'foundation'
              ? 'Не входить до обов’язкового маршруту. Короткі previews доступні у згорнутих розширеннях відповідних патернів.'
              : 'Не входить до основного маршруту. Ці матеріали заплановані на пізніше.'}
          </p>
          <ul className="mt-5 list-inside list-disc space-y-2 text-muted-foreground">
            {chapter.outline?.optionalTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </section>
      )}

      {chapter.id === 'ch-26' && <FinalMixedSet />}

      {groups.length > 0 && (
        <section
          id="related-types"
          className="scroll-mt-28 border-t border-border py-10"
        >
          <p className="eyebrow">Інший погляд</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            Пов’язані типи задач
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/contents?view=type#type-${group.id}`}
                className="rounded-xl border border-border px-3 py-2 text-sm leading-6 transition-colors hover:border-primary/40 hover:text-primary"
              >
                {group.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
