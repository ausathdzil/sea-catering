'use server';

import { db } from '@/db';
import { revalidateTag } from 'next/cache';
import z from 'zod/v4';
import { testimonialsTable } from './schema';

const createTestimonialSchema = z.strictObject({
  name: z.string().min(1, { error: 'Name is required' }),
  message: z.string().min(1, { error: 'Message is required' }),
  rating: z.number().min(1),
});

export type CreateTestimonialState = {
  errors: {
    name?: string[];
    message?: string[];
    rating?: string[];
  };
  fields: {
    name: string;
    message: string;
    rating: string;
  };
};

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
      author: name,
      content: message,
      rating,
    })
    .returning();

  revalidateTag('testimonials');

  return {
    errors: {},
    fields: {
      name: '',
      message: '',
      rating: '',
    },
  };
}
