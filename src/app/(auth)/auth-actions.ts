'use server';

import { signInEmail } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod/v4';

interface BetterAuthError {
  code: string;
  message: string;
}

export interface SignInFormState {
  success: boolean;
  message: string;
  fields?: {
    email?: string;
    password?: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
}

const signInFormSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export async function signIn(
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validatedFields = signInFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data',
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        email: rawFormData.email,
        password: rawFormData.password,
      },
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    if (!response.ok) {
      const data: BetterAuthError = await response.json();
      throw new Error(data.message);
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        fields: {
          email: rawFormData.email,
          password: rawFormData.password,
        },
      };
    }
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }

  redirect('/');
}
