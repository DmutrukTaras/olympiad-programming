'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/contents', label: 'Зміст' },
  { href: '/tasks', label: 'Задачі' },
  { href: '/trainer/pattern', label: 'Вгадай патерн' },
  { href: '/trainer/complexity', label: 'Визначте Big O' },
];

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="mr-3 hidden items-center gap-1 lg:flex"
      aria-label="Основна навігація"
    >
      {links.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn('nav-link', active && 'bg-muted text-foreground')}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
