import { signOut } from '@/lib/auth-client';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { LoaderIcon, LogOutIcon } from 'lucide-react';
import { useState } from 'react';

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsPending(true);
    await signOut();
    router.push('/sign-in');
    setIsPending(false);
  };

  return (
    <Button
      className="rounded-full !px-3"
      variant="secondary"
      size="sm"
      disabled={isPending}
      onClick={handleSignOut}
    >
      {isPending ? <LoaderIcon className="animate-spin" /> : <LogOutIcon />}
      Sign Out
    </Button>
  );
}
