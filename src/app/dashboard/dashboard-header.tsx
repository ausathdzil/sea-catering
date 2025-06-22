import { SidebarTrigger } from '@/components/ui/sidebar';

export function DashboardHeader({ title }: { title: string }) {
  return (
    <header className="p-4 relative border-b">
      <SidebarTrigger className="absolute md:hidden left-4 top-1/2 -translate-y-1/2" />
      <h1 className="font-semibold text-center">{title}</h1>
    </header>
  );
}
