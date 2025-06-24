import { Skeleton } from '@/components/ui/skeleton';
import { DashboardHeader } from '../dashboard-header';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Edit Account" />
      <main className="flex-1 flex flex-col items-center p-8">
        <Skeleton className="w-full max-w-md h-40" />
      </main>
    </div>
  );
}
