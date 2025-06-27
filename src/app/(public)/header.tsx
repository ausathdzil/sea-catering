'use client';

import { MenuIcon } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  unstable_ViewTransition as ViewTransition,
} from 'react';

import { buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AuthButtons } from './auth-buttons';

const navItems = [
  {
    label: 'Meal Plans',
    href: '/meal-plans',
  },
  {
    label: 'Subscription',
    href: '/subscription',
  },
  {
    label: 'Contact Us',
    href: '/contact-us',
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full flex items-center justify-center px-6 py-4 md:p-6',
        isScrolled && 'bg-background shadow-xs'
      )}
    >
      <div className="max-w-6xl w-full flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 md:gap-8">
          <Link
            className="flex items-center gap-1 font-dm-sans font-semibold"
            href="/"
          >
            <ViewTransition name="mark">
              <Image
                src="/logo.png"
                alt="SEA Catering"
                width={32}
                height={32}
              />
              <span className="hidden md:block">SEA Catering</span>
            </ViewTransition>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
                key={item.href}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <MobileNav />
        <Suspense fallback={<AuthSkeleton />}>
          <AuthButtons />
        </Suspense>
      </div>
    </header>
  );
}

function MobileNav() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handleNavigation = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="flex flex-1 md:hidden">
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <button aria-label="Menu">
            <MenuIcon />
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only">Menu</DrawerTitle>
          </DrawerHeader>
          <nav className="p-4 flex flex-col gap-4">
            <Link
              href="/"
              onClick={handleNavigation}
              className={cn(pathname === '/' && 'text-primary', 'font-medium')}
            >
              Home
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                className={cn(
                  pathname === item.href && 'text-primary',
                  'font-medium'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function AuthSkeleton() {
  return (
    <div className="flex flex-1 justify-end">
      <Skeleton className="w-40 h-10 rounded-full" />
    </div>
  );
}
