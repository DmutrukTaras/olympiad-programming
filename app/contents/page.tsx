import type { Metadata } from 'next';
import { ContentsExplorer } from '@/components/content/contents-explorer';
import { chapters, problemTypeGroups } from '@/content';

export const metadata: Metadata = {
  title: 'Зміст',
  description: 'Навчальні глави, згруповані за складністю або типом задачі.',
};

export default function ContentsPage() {
  return (
    <main className="page-shell py-14 sm:py-20">
      <header className="mb-10 max-w-3xl sm:mb-14">
        <p className="eyebrow">Навчальна карта</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Зміст</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Ті самі матеріали можна переглядати як послідовний маршрут за складністю
          або як набір відповідей на типові форми задач.
        </p>
      </header>
      <ContentsExplorer chapters={chapters} groups={problemTypeGroups} />
    </main>
  );
}
