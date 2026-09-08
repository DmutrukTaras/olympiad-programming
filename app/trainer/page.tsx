import type { Metadata } from 'next';
import { PatternTrainer } from '@/components/trainer/pattern-trainer';
import { patterns, problemTypeGroups, tasks } from '@/content';
import { buildTrainerCatalog } from '@/lib/trainer';

export const metadata: Metadata = {
  title: 'Вгадай патерн',
  description:
    'Тренажер розпізнавання алгоритмічних патернів за умовою та constraints.',
};

export default function TrainerPage() {
  const catalog = buildTrainerCatalog(tasks, patterns, problemTypeGroups);

  return (
    <main className="page-shell py-14 sm:py-20">
      <header className="max-w-3xl">
        <p className="eyebrow">Тренажер мислення перед кодом</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Вгадай патерн
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Прочитай умову та constraints і визнач, який підхід ти б перевірив
          першим.
        </p>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          Як на змаганні: назви робочу гіпотезу до того, як побачиш підказку чи
          розбір. Після відповіді тренажер покаже сигнали, правильний патерн і
          посилання на матеріал.
        </p>
      </header>

      <PatternTrainer catalog={catalog} />
    </main>
  );
}
