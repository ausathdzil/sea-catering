'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createTestimonial, CreateTestimonialState } from '@/db/actions';
import { Loader } from 'lucide-react';
import { useActionState } from 'react';

const initialState: CreateTestimonialState = {
  errors: {},
  fields: {
    name: '',
    message: '',
    rating: '',
  },
};

export function TestimonialForm() {
  const [state, formAction, isPending] = useActionState(
    createTestimonial,
    initialState
  );

  return (
    <form className="w-full max-w-2xl space-y-6" action={formAction}>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          defaultValue={state.fields.name}
          placeholder="John Doe"
        />
        {state.errors?.name && (
          <span className="text-destructive text-sm">{state.errors.name}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          defaultValue={state.fields.message}
          placeholder="Write your message here"
        />
        {state.errors?.message && (
          <span className="text-destructive text-sm">
            {state.errors.message}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rating">Rating</Label>
        <Select id="rating" name="rating" defaultValue={state.fields.rating}>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </Select>
        {state.errors?.rating && (
          <span className="text-destructive text-sm">
            {state.errors.rating}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader className="animate-spin" /> : 'Submit'}
        </Button>
      </div>
    </form>
  );
}
