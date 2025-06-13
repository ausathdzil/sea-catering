'use client';

import { LoaderIcon, LogOutIcon } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function AuthHeader() {
  const { data: session } = useSession();

  return session ? (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">👋 Hey, {session.user.name}!</span>
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
  );
}

function SignOutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onSuccess: () => {
          router.push('/sign-in');
          setIsPending(false);
        },
      },
    });
  };

  return (
    <Button
      className="rounded-full !px-3"
      variant="secondary"
      size="sm"
      disabled={isPending}
      onClick={handleSignOut}
    >
      {isPending ? <LoaderIcon className="animate-spin" /> : <LogOutIcon />}
      Sign Out
    </Button>
  );
}
