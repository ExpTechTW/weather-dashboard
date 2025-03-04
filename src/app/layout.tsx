import { Manrope } from 'next/font/google';

import { ThemeProvider } from '@/components/theme/provider';
import { cn } from '@/lib/utils';

import '@/app/globals.css';

type Props = Readonly<{
  children: React.ReactNode;
}>;

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({ children }: Props) {
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
          <main className={cn(
            `flex min-h-dvh flex-col items-center tabular-nums`,
            manrope.className,
          )}
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
