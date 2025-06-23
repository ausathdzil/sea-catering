import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}
