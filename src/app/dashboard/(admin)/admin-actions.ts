'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';
import { verifySession } from '@/lib/dal';

interface UpdateSubscriptionState {
  success: boolean;
  message?: string;
  errors: {
    status?: string[] | undefined;
  };
}

export type UpdateSubscriptionStateOrNull = UpdateSubscriptionState | null;

const updateSubscriptionSchema = z.object({
  status: z.enum(['active', 'canceled']),
});

export async function updateSubscription(
  subscriptionId: string,
  prevState: UpdateSubscriptionStateOrNull,
  formData: FormData
): Promise<UpdateSubscriptionStateOrNull> {
  const session = await verifySession();
  if (session.role !== 'admin') return null;

  const rawFormData = {
    status: formData.get('status') as string,
  };

  const validatedFields = updateSubscriptionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { status } = validatedFields.data;

  const subscription = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.id, subscriptionId));

  if (!subscription[0]) {
    return {
      success: false,
      message: 'Subscription not found',
      errors: {},
    };
  }

  const mealPlan = subscription[0].mealPlan;
  let updatedPrice = mealPlan.totalPrice;

  if (status === 'canceled') {
    updatedPrice = 0;
  } else if (status === 'active') {
    const basePlanPrice = {
      diet: 30000,
      protein: 40000,
      royal: 60000,
    }[mealPlan.basePlan as 'diet' | 'protein' | 'royal'];

    updatedPrice =
      basePlanPrice *
      mealPlan.mealTypes.length *
      mealPlan.deliveryDays.length *
      4.3;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db
    .update(subscriptionsTable)
    .set({
      status,
      mealPlan: {
        ...mealPlan,
        totalPrice: updatedPrice,
      },
      canceledAt: status === 'canceled' ? tomorrow : null,
      pausedUntil: null,
    })
    .where(eq(subscriptionsTable.id, subscriptionId));

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/subscriptions');
  revalidatePath(`/dashboard/subscriptions/${subscriptionId}`);
  revalidatePath(`/dashboard/users`);

  return {
    success: true,
    message: 'Subscription updated!',
    errors: {},
  };
}

export async function deleteSubscription(subscriptionId: string) {
  const session = await verifySession();
  if (session.role !== 'admin') return null;

  await db
    .delete(subscriptionsTable)
    .where(eq(subscriptionsTable.id, subscriptionId));

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/subscriptions');
  revalidatePath(`/dashboard/subscriptions/${subscriptionId}`);
  revalidatePath(`/dashboard/users`);

  return {
    success: true,
    message: 'Subscription deleted successfully',
  };
}

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
): Promise<UpdateUserFormStateOrNull> {
  const session = await verifySession();
  if (session.role !== 'admin') return null;

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

  revalidatePath(`/dashboard/users`);
  revalidatePath(`/dashboard/users/${userId}`);

  return {
    success: true,
    message: 'User updated successfully',
    errors: {},
  };
}
