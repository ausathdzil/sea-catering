'use client';

import { LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUp, SignUpFormState } from '../auth-actions';

const initialState: SignUpFormState = {
  success: false,
  message: '',
  errors: {},
};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  useEffect(() => {
    if (state && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-medium font-dm-sans">Sign Up</h1>
        <p className="text-sm text-muted-foreground text-balance">
          Create your account to get started
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            defaultValue={state?.fields?.name}
            required
          />
          {state?.errors?.name && (
            <span className="text-destructive text-sm">
              {state.errors.name}
            </span>
          )}
        </div>

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
          <Input
            type="password"
            id="password"
            name="password"
            defaultValue={state?.fields?.password}
            required
          />
          {state?.errors?.password && (
            <span className="text-destructive text-sm">
              {state.errors.password}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            defaultValue={state?.fields?.confirmPassword}
            required
          />
          {state?.errors?.confirmPassword && (
            <span className="text-destructive text-sm">
              {state.errors.confirmPassword}
            </span>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Sign Up'}
        </Button>
      </div>

      <div className="text-center text-sm">
        <Link href="/sign-in">
          Already have an account?{' '}
          <span className="font-medium text-primary underline underline-offset-4">
            Sign In
          </span>
        </Link>
      </div>
    </form>
  );
}
