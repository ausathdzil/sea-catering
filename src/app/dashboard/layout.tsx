import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './sidebar/dashboard-sidebar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      {children}
    </SidebarProvider>
  );
}
