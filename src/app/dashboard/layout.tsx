import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from './dashboard-sidebar';

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

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="p-4 relative border-b">
      <SidebarTrigger className="absolute left-8 top-1/2 -translate-y-1/2" />
      <h1 className="font-semibold text-center">{title}</h1>
    </header>
  );
}
