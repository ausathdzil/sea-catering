'use server';

import { eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { z } from 'zod/v4';

import { db } from '@/db';
import { user } from '@/db/schema';
import { getSession } from '@/lib/auth';

interface UpdateUserFormState {
  success: boolean;
  message?: string;
  errors: {
    role?: string[];
  };
}

export type UpdateUserFormStateOrNull = UpdateUserFormState | null;

const updateUserFormSchema = z.object({
  role: z.enum(['user', 'admin']),
});

export async function updateUser(
  userId: string,
  prevState: UpdateUserFormStateOrNull,
  formData: FormData
) {
  const session = await getSession();

  if (!session || session.user.role !== 'admin') return null;

  const rawFormData = {
    role: formData.get('role') as string,
  };

  const validatedFields = updateUserFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid fields',
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { role } = validatedFields.data;

  await db.update(user).set({ role }).where(eq(user.id, userId));

  revalidateTag(`user-${userId}`);

  return {
    success: true,
    message: 'User updated successfully',
    errors: {},
  };
}
