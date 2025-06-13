'use server';

import { db } from '@/db';
import { testimonialsTable } from '@/db/schema';
import { revalidateTag } from 'next/cache';
import z from 'zod/v4';

const createTestimonialSchema = z.strictObject({
  name: z.string().min(1, { error: 'Name is required' }).max(50, {
    error: 'Name must be less than 50 characters',
  }),
  message: z.string().min(1, { error: 'Message is required' }).max(500, {
    error: 'Message must be less than 500 characters',
  }),
  rating: z.number().min(1),
});

export interface CreateTestimonialState {
  success: boolean;
  message: string;
  errors: {
    name?: string[] | undefined;
    message?: string[] | undefined;
    rating?: string[] | undefined;
  };
  fields: {
    name: string;
    message: string;
    rating: string;
  };
}

export async function createTestimonial(
  prevState: CreateTestimonialState,
  formData: FormData
) {
  const rawFormData = {
    name: formData.get('name') as string,
    message: formData.get('message') as string,
    rating: formData.get('rating') as string,
  };

  const validatedFields = createTestimonialSchema.safeParse({
    ...rawFormData,
    rating: Number(rawFormData.rating),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data',
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        name: rawFormData.name,
        message: rawFormData.message,
        rating: rawFormData.rating,
      },
    };
  }

  const { name, message, rating } = validatedFields.data;

  await db
    .insert(testimonialsTable)
    .values({
      name,
      message,
      rating,
    })
    .returning();

  revalidateTag('testimonials');

  return {
    success: true,
    message: 'Thank you for your feedback!',
    errors: {},
    fields: {
      name: '',
      message: '',
      rating: '',
    },
  };
}
