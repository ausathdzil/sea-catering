'use client';

import { CircleCheckIcon, CircleXIcon, LoaderIcon } from 'lucide-react';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Subscription } from '@/db/schema';
import { editSubscription, EditSubscriptionState } from '../../admin-actions';

const initialState: EditSubscriptionState = {
  success: false,
  message: '',
  errors: {},
};

export default function EditSubscriptionForm({
  subscription,
}: {
  subscription: Subscription;
}) {
  const editSubscriptionWithId = editSubscription.bind(null, subscription.id);
  const [state, formAction, isPending] = useActionState(
    editSubscriptionWithId,
    initialState
  );

  useEffect(() => {
    if (state && state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form className="w-full max-w-xl space-y-4" action={formAction}>
      <div className="grid gap-2">
        <Label htmlFor="name">User Name</Label>
        <Input
          id="name"
          defaultValue={subscription.name}
          className="w-full"
          disabled
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          defaultValue={subscription.phoneNumber}
          className="w-full"
          disabled
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          defaultValue={subscription.mealPlan.planName}
          className="w-full"
          disabled
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <RadioGroup
          id="status"
          name="status"
          defaultValue={subscription.status}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="active" id="active" />
            <Label htmlFor="active">
              <Badge>
                <CircleCheckIcon />
                Active
              </Badge>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="canceled" id="canceled" />
            <Label htmlFor="canceled">
              <Badge variant="destructive">
                <CircleXIcon />
                Canceled
              </Badge>
            </Label>
          </div>
        </RadioGroup>
        {state?.errors.status && (
          <span className="text-sm text-destructive">
            {state.errors.status[0]}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="button" disabled={isPending} asChild>
          <Link href={`/dashboard/subscriptions`}>Cancel</Link>
        </Button>
        <Button className="min-w-" type="submit" disabled={isPending}>
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </form>
  );
}
