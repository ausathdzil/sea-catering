'use client';

import { LoaderIcon } from 'lucide-react';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignInFormState, signInWithEmail } from '../auth-actions';
import { PasswordInput } from '../password-input';

const initialState: SignInFormState = {
  success: false,
  message: '',
  errors: {},
};

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(
    signInWithEmail,
    initialState
  );

  useEffect(() => {
    if (state && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-medium font-dm-sans">Sign In</h1>
        <p className="text-sm text-muted-foreground text-balance">
          Enter your credentials to sign in
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="m@example.com"
            defaultValue={state?.fields?.email}
            required
          />
          {state?.errors?.email && (
            <span className="text-destructive text-sm">
              {state.errors.email}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            name="password"
            defaultValue={state?.fields?.password}
          />
          {state?.errors?.password && (
            <span className="text-destructive text-sm">
              {state.errors.password}
            </span>
          )}
        </div>
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Sign In'}
        </Button>
      </div>

      <div className="text-center text-sm">
        <Link href="/sign-up">
          Don&apos;t have an account?{' '}
          <span className="font-medium text-primary underline underline-offset-4">
            Sign Up
          </span>
        </Link>
      </div>
    </form>
  );
}
