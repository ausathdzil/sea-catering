import { DashboardHeader } from '../../dashboard-header';

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Users" />
      <main className="@container/main flex flex-1 flex-col gap-4 p-8">
        {children}
      </main>
    </div>
  );
}
