'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { z } from 'zod/v4';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { getSession } from '@/lib/auth';

interface EditSubscriptionState {
  success: boolean;
  message?: string;
  errors: {
    status?: string[] | undefined;
  };
}

export type EditSubscriptionStateOrNull = EditSubscriptionState | null;

const editSubscriptionSchema = z.object({
  status: z.enum(['active', 'canceled']),
});

export async function editSubscription(
  subscriptionId: string,
  prevState: EditSubscriptionStateOrNull,
  formData: FormData
): Promise<EditSubscriptionStateOrNull> {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') return null;

  const rawFormData = {
    status: formData.get('status') as string,
  };

  const validatedFields = editSubscriptionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { status } = validatedFields.data;

  await db
    .update(subscriptionsTable)
    .set({ status })
    .where(eq(subscriptionsTable.id, subscriptionId));

  return {
    success: true,
    message: 'Subscription updated!',
    errors: {},
  };
}
