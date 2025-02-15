'use client';

import { Home, Radar } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import ThemeSelector from '@/components/theme/theme-selector';

export default function AppHeader() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: '/',
      icon: Home,
      text: '首頁',
      isActive: pathname === '/',
    },
    {
      href: '/dashboard',
      icon: Radar,
      text: '面板',
      isActive: pathname === '/dashboard',
    },
  ];

  return (
    <header className={`
      fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-center border-b
      bg-background/95 backdrop-blur
      supports-[backdrop-filter]:bg-background/60
    `}
    >
      <div className="container flex items-center justify-between px-4">
        <nav className={`
          flex gap-1
          sm:gap-2
        `}
        >
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              variant={item.isActive ? 'default' : 'ghost'}
              className={`
                flex items-center gap-2 px-2
                sm:px-4
              `}
              asChild
            >
              <Link href={item.href}>
                <item.icon className={`
                  h-4 w-4
                  sm:h-5 sm:w-5
                `}
                />
                <span className={`
                  hidden
                  sm:inline
                `}
                >
                  {item.text}
                </span>
              </Link>
            </Button>
          ))}
        </nav>
        <ThemeSelector />
      </div>
    </header>
  );
}
