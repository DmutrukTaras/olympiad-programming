'use client';

import Link from 'next/link';
import { BookOpen, ListTree, Menu } from 'lucide-react';
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

const links = [
  { href: '/contents', label: 'Зміст', icon: ListTree },
  { href: '/tasks', label: 'Задачі', icon: BookOpen },
];

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" />
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
          {links.map(({ href, label, icon: Icon }) => (
            <SheetClose key={href} nativeButton={false} render={<Link href={href} />}>
              <span className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium hover:bg-muted">
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                {label}
              </span>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
