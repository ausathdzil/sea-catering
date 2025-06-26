'use client';

import { LoaderIcon, LockIcon } from 'lucide-react';

import { redirect } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { PasswordInput } from '@/app/(auth)/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { signOut } from '@/lib/auth-client';
import {
  updatePassword,
  UpdatePasswordFormStateOrNull,
} from './update-password-action';

const initialState: UpdatePasswordFormStateOrNull = {
  success: false,
  message: '',
  errors: {},
  fields: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
};

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState
  );

  useEffect(() => {
    if (state && state.message) {
      if (state.success) {
        toast.success(state.message, {
          classNames: {
            actionButton:
              '!bg-destructive !hover:bg-destructive/90 !text-destructive-foreground',
          },
          action: {
            label: 'Sign out',
            onClick: () => {
              signOut();
              redirect('/sign-in');
            },
          },
        });
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form className="w-full max-w-md space-y-8" action={formAction}>
      <div className="grid gap-2">
        <Label htmlFor="current-password">Current Password</Label>
        <PasswordInput
          id="current-password"
          name="current-password"
          defaultValue={state?.fields.currentPassword}
        />
        {state?.errors.currentPassword && (
          <span className="text-sm text-destructive">
            {state.errors.currentPassword}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new-password">New Password</Label>
        <PasswordInput
          id="new-password"
          name="new-password"
          defaultValue={state?.fields.newPassword}
        />
        {state?.errors.newPassword && (
          <span className="text-sm text-destructive">
            {state.errors.newPassword}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <PasswordInput
          id="confirm-password"
          name="confirm-password"
          defaultValue={state?.fields.confirmPassword}
        />
        {state?.errors.confirmPassword && (
          <span className="text-sm text-destructive">
            {state.errors.confirmPassword}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin" /> : <LockIcon />}
          Update Password
        </Button>
      </div>
    </form>
  );
}
