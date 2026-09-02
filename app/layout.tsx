import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/layout/site-header';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Посібник з олімпіадного програмування',
    template: '%s · Посібник з олімпіадного програмування',
  },
  description:
    'Онлайн-посібник, що вчить бачити алгоритми в умовах задач і будувати шлях від обмежень до реалізації.',
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    title: 'Посібник з олімпіадного програмування',
    description: 'Навчись бачити алгоритм у задачі: від умови й constraints — до ідеї та коду.',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Посібник з олімпіадного програмування' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Посібник з олімпіадного програмування',
    description: 'Навчись бачити алгоритм у задачі: від умови й constraints — до ідеї та коду.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
