'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { BookUserIcon, ChefHatIcon, LockIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
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

export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={pathname === item.url}
                size="lg"
                asChild
              >
                <Link href={item.url}>
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
