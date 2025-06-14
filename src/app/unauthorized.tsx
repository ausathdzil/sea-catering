import { buttonVariants } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-screen">
      <h1 className="text-2xl font-semibold">401 | Unauthorized</h1>
      <p className="text-muted-foreground">
        You are not authorized to access this page.
      </p>
      <Link className={buttonVariants()} href="/">
        <HomeIcon />
        Home
      </Link>
    </div>
  );
}
