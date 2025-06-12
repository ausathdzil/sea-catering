'use client';

import { buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const navItems = [
  {
    label: 'Home',
    href: '/',
  },
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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handleNavigation = useCallback(() => {
    setIsOpen(false);
  }, []);

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
      <div className="max-w-6xl w-full flex items-center justify-between">
        <Link
          className="flex items-center gap-2 text-2xl font-dm-sans font-bold"
          href="/"
        >
          <Image src="/logo.png" alt="SEA Catering" width={50} height={50} />
          <span className="hidden md:block">SEA Catering</span>
        </Link>
        <div className="flex md:hidden">
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
    </header>
  );
}
