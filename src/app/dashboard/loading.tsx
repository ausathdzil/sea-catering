import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from './dashboard-header';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Dashboard" />
      <main className="flex-1 p-8 mx-auto w-full space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 w-full" />
          ))}
        </div>
      </main>
    </div>
  );
}
