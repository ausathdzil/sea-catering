'use server';

import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

import { auth } from '@/lib/auth';
import { verifySession } from '@/lib/dal';

interface UpdatePasswordFormState {
  success: boolean;
  message?: string;
  errors: {
    currentPassword?: string[];
    newPassword?: string[];
    confirmPassword?: string[];
  };
  fields: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
}

export type UpdatePasswordFormStateOrNull = UpdatePasswordFormState | null;

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Include an uppercase letter' })
      .regex(/[a-z]/, { message: 'Include a lowercase letter' })
      .regex(/[0-9]/, { message: 'Include a number' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Include a special character',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function updatePassword(
  prevState: UpdatePasswordFormStateOrNull,
  formData: FormData
): Promise<UpdatePasswordFormStateOrNull> {
  const session = await verifySession();
  if (!session) return null;

  const rawFormData = {
    currentPassword: formData.get('current-password') as string,
    newPassword: formData.get('new-password') as string,
    confirmPassword: formData.get('confirm-password') as string,
  };

  const parsedFormData = updatePasswordSchema.safeParse(rawFormData);

  if (!parsedFormData.success) {
    return {
      success: false,
      message: 'Invalid form data',
      errors: z.flattenError(parsedFormData.error).fieldErrors,
      fields: {
        currentPassword: rawFormData.currentPassword,
        newPassword: rawFormData.newPassword,
        confirmPassword: rawFormData.confirmPassword,
      },
    };
  }

  const { currentPassword, newPassword } = parsedFormData.data;

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
    });
  } catch (error) {
    if (error instanceof APIError) {
      return {
        success: false,
        message: error.message,
        errors: {},
        fields: {
          currentPassword: rawFormData.currentPassword,
          newPassword: rawFormData.newPassword,
          confirmPassword: rawFormData.confirmPassword,
        },
      };
    }

    return {
      success: false,
      message: 'An error occurred while updating your password',
      errors: {},
      fields: {
        currentPassword: rawFormData.currentPassword,
        newPassword: rawFormData.newPassword,
        confirmPassword: rawFormData.confirmPassword,
      },
    };
  }

  return {
    success: true,
    message: 'Password updated successfully',
    errors: {},
    fields: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  };
}
