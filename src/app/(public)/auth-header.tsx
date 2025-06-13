'use client';

import { HomeIcon } from 'lucide-react';

import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function AuthHeader() {
  const { data: session } = useSession();

  return session ? (
    <div className="flex flex-1 justify-end items-center gap-4">
      <span className="text-sm font-medium hidden lg:block">
        👋 Hey, {session.user.name}!
      </span>
      <Link
        className={cn(
          buttonVariants({ variant: 'secondary', size: 'sm' }),
          'rounded-full !px-3'
        )}
        href="/dashboard"
      >
        <HomeIcon />
        Dashboard
      </Link>
    </div>
  ) : (
    <div className="flex flex-1 justify-end items-center gap-2">
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
  );
}
