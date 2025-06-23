import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full max-w-xl mx-auto">
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
