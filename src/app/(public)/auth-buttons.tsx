'use client';

import {
  BookUserIcon,
  ChefHatIcon,
  GaugeIcon,
  HomeIcon,
  LoaderIcon,
  LockIcon,
  LogOutIcon,
  UsersRoundIcon,
} from 'lucide-react';

import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Session, signOut, useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export function AuthButtons() {
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
      <UserButton user={session.user} />
    </div>
  ) : (
    <div className="flex flex-1 justify-end items-center gap-2 md:gap-4">
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

const userNavItems = [
  {
    title: 'Subscriptions',
    url: '/dashboard',
    icon: ChefHatIcon,
  },
  {
    title: 'Account',
    url: '/dashboard/account',
    icon: BookUserIcon,
  },
  {
    title: 'Security',
    url: '/dashboard/security',
    icon: LockIcon,
  },
];

const adminNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: GaugeIcon,
  },
  {
    title: 'Subscriptions',
    url: '/dashboard/subscriptions',
    icon: ChefHatIcon,
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: UsersRoundIcon,
  },
  {
    title: 'Account',
    url: '/dashboard/account',
    icon: BookUserIcon,
  },
  {
    title: 'Security',
    url: '/dashboard/security',
    icon: LockIcon,
  },
];

function UserButton({ user }: { user: Session['user'] }) {
  const [isPending, setIsPending] = useState(false);
  const navItems = user.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-ring/50 transition-all ease-out">
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {navItems.map((item) => (
            <DropdownMenuItem
              className="cursor-pointer"
              key={item.title}
              asChild
            >
              <Link href={item.url}>
                <item.icon />
                {item.title}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isPending}
            onClick={async () =>
              await signOut({
                fetchOptions: {
                  onRequest: () => setIsPending(true),
                  onSuccess: () => {
                    window.location.href = '/sign-in';
                    setIsPending(false);
                  },
                },
              })
            }
          >
            {isPending ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <LogOutIcon />
            )}
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
