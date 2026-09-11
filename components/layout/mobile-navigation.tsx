'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Gauge, ListTree, Menu, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const links = [
  { href: '/contents', label: 'Зміст', icon: ListTree },
  { href: '/tasks', label: 'Задачі', icon: BookOpen },
  { href: '/icpc', label: 'Розбір задач ICPC', icon: BookOpen },
  { href: '/trainer/pattern', label: 'Вгадай патерн', icon: Target },
  { href: '/trainer/complexity', label: 'Визначте Big O', icon: Gauge },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full xl:hidden"
          />
        }
      >
        <Menu />
        <span className="sr-only">Відкрити навігацію</span>
      </SheetTrigger>
      <SheetContent className="w-[88%] max-w-sm border-border bg-background p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle>Навігація</SheetTitle>
          <SheetDescription>Розділи онлайн-посібника</SheetDescription>
        </SheetHeader>
        <nav className="grid gap-2 p-4" aria-label="Мобільна навігація">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <SheetClose
                key={href}
                nativeButton={false}
                render={
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                  />
                }
              >
                <span
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium hover:bg-muted',
                    active && 'bg-muted text-foreground',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4 text-muted-foreground',
                      active && 'text-primary',
                    )}
                    aria-hidden="true"
                  />
                  {label}
                </span>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
