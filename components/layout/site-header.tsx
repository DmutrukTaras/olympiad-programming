import Link from 'next/link';
import { Braces } from 'lucide-react';
import { MobileNavigation } from '@/components/layout/mobile-navigation';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-[4.5rem] border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="page-shell flex h-full items-center justify-between gap-5">
        <Link href="/" className="group flex items-center gap-3" aria-label="Посібник з олімпіадного програмування — головна">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:-rotate-3">
            <Braces className="size-[1.15rem]" aria-hidden="true" />
          </span>
          <span className="max-w-[12rem] text-sm font-semibold leading-tight tracking-[-0.02em] sm:max-w-none sm:text-base">
            Посібник з олімпіадного програмування
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="mr-3 hidden items-center gap-1 md:flex" aria-label="Основна навігація">
            <Link href="/contents" className="nav-link">Зміст</Link>
            <Link href="/tasks" className="nav-link">Задачі</Link>
          </nav>
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
