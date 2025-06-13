'use server';

import { signInEmail, signUpEmail } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod/v4';

interface BetterAuthError {
  code: string;
  message: string;
}

export interface SignInFormState {
  success: boolean;
  message?: string;
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

export interface SignUpFormState {
  success: boolean;
  message?: string;
  fields?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
}

const signUpFormSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters' })
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export async function signUp(prevState: SignUpFormState, formData: FormData) {
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const validatedFields = signUpFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        name: rawFormData.name,
        email: rawFormData.email,
        password: rawFormData.password,
        confirmPassword: rawFormData.confirmPassword,
      },
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const response = await signUpEmail({
      body: {
        name,
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
          name: rawFormData.name,
          email: rawFormData.email,
          password: rawFormData.password,
          confirmPassword: rawFormData.confirmPassword,
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
