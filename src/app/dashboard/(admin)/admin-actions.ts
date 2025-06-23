'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';
import { verifySession } from '@/lib/dal';

export interface EditSubscriptionState {
  success: boolean;
  message?: string;
  errors: {
    status?: string[] | undefined;
  };
}

const editSubscriptionSchema = z.object({
  status: z.enum(['active', 'canceled']),
});

export async function editSubscription(
  subscriptionId: string,
  prevState: EditSubscriptionState,
  formData: FormData
): Promise<EditSubscriptionState> {
  const session = await verifySession();

  if (session.role !== 'admin') {
    return {
      success: false,
      message: 'You are not authorized to edit this subscription',
      errors: {},
    };
  }

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

  if (session.role !== 'admin') {
    return {
      success: false,
      message: 'You are not authorized to delete this subscription',
    };
  }

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

export interface UpdateUserFormState {
  success: boolean;
  message?: string;
  errors: {
    role?: string[];
  };
}

const updateUserFormSchema = z.object({
  role: z.enum(['user', 'admin']),
});

export async function updateUser(
  userId: string,
  prevState: UpdateUserFormState,
  formData: FormData
): Promise<UpdateUserFormState> {
  const session = await verifySession();

  if (session.role !== 'admin') {
    return {
      success: false,
      message: 'You are not authorized to update this user',
      errors: {},
    };
  }

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

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/users`);
  revalidatePath(`/dashboard/users/${userId}`);

  return {
    success: true,
    message: 'User updated successfully',
    errors: {},
  };
}
