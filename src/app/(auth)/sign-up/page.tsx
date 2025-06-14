'use client';

import { LoaderIcon } from 'lucide-react';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignUpFormState, signUpWithEmail } from '../auth-actions';
import { PasswordInput } from '../password-input';

const initialState: SignUpFormState = {
  success: false,
  message: '',
  errors: {},
};

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    signUpWithEmail,
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
          <PasswordInput
            id="password"
            name="password"
            defaultValue={state?.fields?.password}
          />
          {state?.errors?.password && (
            <div className="flex flex-col gap-1">
              <span className="text-destructive text-sm">Password must:</span>
              <ul className="text-destructive text-sm list-disc pl-4">
                {state.errors.password.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <PasswordInput
            id="confirm-password"
            name="confirm-password"
            defaultValue={state?.fields?.confirmPassword}
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
