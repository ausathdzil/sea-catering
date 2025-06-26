'use client';

import { LoaderIcon, SaveIcon } from 'lucide-react';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  updateAccount,
  UpdateAccountFormStateOrNull,
} from './update-account-action';

interface UpdateAccountFormProps {
  name: string;
  userId: string;
}

export function UpdateAccountForm(props: UpdateAccountFormProps) {
  const { name, userId } = props;

  const initialState: UpdateAccountFormStateOrNull = {
    success: false,
    message: '',
    errors: {},
    fields: {
      name,
    },
  };

  const updateAccountWithId = updateAccount.bind(null, userId);
  const [state, formAction, isPending] = useActionState(
    updateAccountWithId,
    initialState
  );

  useEffect(() => {
    if (state && state.message) {
      if (state.success) {
        toast.success(state.message, {
          classNames: {
            actionButton: '!bg-primary !text-primary-foreground',
          },
          action: {
            label: 'Reload',
            onClick: () => {
              window.location.reload();
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          defaultValue={state?.fields.name}
          required
          minLength={1}
          maxLength={50}
        />
        {state?.errors.name && (
          <span className="text-sm text-destructive">{state.errors.name}</span>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin" /> : <SaveIcon />}
          Save
        </Button>
      </div>
    </form>
  );
}
