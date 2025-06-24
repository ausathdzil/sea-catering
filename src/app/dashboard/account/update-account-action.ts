'use server';

import { z } from 'zod/v4';

import { auth } from '@/lib/auth';
import { verifySession } from '@/lib/dal';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';

interface UpdateAccountFormState {
  success: boolean;
  message?: string;
  errors: {
    name?: string[];
  };
  fields: {
    name: string;
  };
}

export type UpdateAccountFormStateOrNull = UpdateAccountFormState | null;

const updateAccountSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be less than 50 characters' }),
});

export async function updateAccount(
  userId: string,
  prevState: UpdateAccountFormStateOrNull,
  formData: FormData
): Promise<UpdateAccountFormStateOrNull> {
  const session = await verifySession();
  if (!session) return null;

  const rawFormData = {
    name: formData.get('name') as string,
  };

  const validatedFields = updateAccountSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data',
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        name: rawFormData.name,
      },
    };
  }

  const { name } = validatedFields.data;

  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message:
          error.statusCode === 401
            ? 'Unauthorized'
            : 'An unexpected error occurred',
        errors: {},
        fields: {
          name,
        },
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: {},
      fields: {
        name,
      },
    };
  }

  return {
    success: true,
    message: 'Account updated successfully',
    errors: {},
    fields: {
      name,
    },
  };
}
