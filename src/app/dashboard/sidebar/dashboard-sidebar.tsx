import Image from 'next/image';
import Link from 'next/link';
import { unstable_ViewTransition as ViewTransition } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { verifySession } from '@/lib/dal';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

export async function DashboardSidebar() {
  const session = await verifySession();
  const role = session?.role;

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
                <ViewTransition name="mark">
                  <Image src="/logo.png" alt="logo" width={30} height={30} />
                  <span className="text-lg font-semibold font-dm-sans">
                    SEA Catering
                  </span>
                </ViewTransition>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain role={role ?? 'user'} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
