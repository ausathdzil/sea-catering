'use client';

import {
  BookUserIcon,
  ChefHatIcon,
  GaugeIcon,
  LockIcon,
  UsersRoundIcon,
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

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
    title: 'Users',
    url: '/dashboard/users',
    icon: UsersRoundIcon,
  },
  {
    title: 'Subscriptions',
    url: '/dashboard/subscriptions',
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

export function DashboardSidebar() {
  const { data: session } = useSession();

  const items = session?.user.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <Sidebar className="gap-0">
      <SidebarHeader className="pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-1 gap-3 text-accent-foreground"
              size="lg"
              asChild
            >
              <Link href="/">
                <Image src="/logo.png" alt="logo" width={30} height={30} />
                <span className="text-lg font-semibold font-dm-sans">
                  SEA Catering
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
