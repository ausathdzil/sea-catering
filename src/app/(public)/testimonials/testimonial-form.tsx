'use client';

import { LoaderIcon, StarIcon } from 'lucide-react';

import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  createTestimonial,
  CreateTestimonialState,
} from './testimonial-action';

const initialState: CreateTestimonialState = {
  success: false,
  message: '',
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

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

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
          required
          minLength={1}
          maxLength={50}
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
          required
          minLength={1}
          maxLength={500}
        />
        {state.errors?.message && (
          <span className="text-destructive text-sm">
            {state.errors.message}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <RatingField state={state} />
        {state.errors?.rating && (
          <span className="text-destructive text-sm">
            {state.errors.rating}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          className="min-w-20 cursor-pointer"
          type="submit"
          disabled={isPending}
        >
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Submit'}
        </Button>
      </div>
    </form>
  );
}

function RatingField({ state }: { state: CreateTestimonialState }) {
  const [hoverRating, setHoverRating] = useState('');
  const [currentRating, setCurrentRating] = useState('');

  return (
    <fieldset className="space-y-2">
      <legend className="text-foreground text-sm leading-none font-medium">
        Rate your experience
      </legend>
      <RadioGroup
        className="inline-flex gap-0"
        onValueChange={setCurrentRating}
        name="rating"
        defaultValue={state.fields.rating}
        required
      >
        {['1', '2', '3', '4', '5'].map((value) => (
          <label
            key={value}
            className="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating('')}
          >
            <RadioGroupItem
              id={`rating-${value}`}
              value={value}
              className="sr-only"
            />
            <StarIcon
              size={24}
              className={`transition-all ${
                (hoverRating || currentRating) >= value
                  ? 'stroke-amber-500 fill-amber-500'
                  : 'text-input'
              } group-hover:scale-110`}
            />
            <span className="sr-only">
              {value} star{value === '1' ? '' : 's'}
            </span>
          </label>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
