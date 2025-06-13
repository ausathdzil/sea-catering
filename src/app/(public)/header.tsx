'use client';

import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { SignOutButton } from '@/components/sign-out-button';
import { buttonVariants } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

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
  const { data: session } = useSession();
  const user = session?.user;

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
        <div className="flex items-center gap-8">
          <Link
            className="flex items-center gap-1 font-dm-sans font-semibold"
            href="/"
          >
            <Image src="/logo.png" alt="SEA Catering" width={32} height={32} />
            <span className="hidden md:block">SEA Catering</span>
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

        {session && user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">👋 Hey, {user.name}!</span>
            <SignOutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'rounded-full'
              )}
              href="/sign-in"
            >
              Sign In
            </Link>
            <Link
              className={cn(buttonVariants({ size: 'sm' }), 'rounded-full')}
              href="/sign-up"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
