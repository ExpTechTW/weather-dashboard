'use client';

import { usePathname } from 'next/navigation';

import AppFooter from '@/components/app/footer';
import AppHeader from '@/components/app/header';
import { ThemeProvider } from '@/components/theme/provider';

import '@/app/globals.css';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <title>Weather Dashboard</title>
      <meta name="description" content="Weather Dashboard" />

      <body className="flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {!isDashboard && <AppHeader />}
          <main className={`
            flex min-h-dvh flex-col items-center
            ${!isDashboard
      ? `pt-16`
      : ''}
          `}
          >
            {children}
          </main>
          {!isDashboard && <AppFooter />}
        </ThemeProvider>
      </body>
    </html>
  );
}
