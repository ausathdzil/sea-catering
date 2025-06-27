'use client';

import {
  BookUserIcon,
  ChefHatIcon,
  GaugeIcon,
  LockIcon,
  UsersRoundIcon,
} from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

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

export function NavMain({ role }: { role: string }) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {role === 'admin'
            ? adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    size="lg"
                    asChild
                  >
                    <Link
                      onClick={() => isMobile && setOpenMobile(false)}
                      href={item.url}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            : userNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    size="lg"
                    asChild
                  >
                    <Link
                      onClick={() => isMobile && setOpenMobile(false)}
                      href={item.url}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
