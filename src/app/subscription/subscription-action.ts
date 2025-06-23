'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod/v4';

import { db } from '@/db';
import { CustomMealPlan, subscriptionsTable } from '@/db/schema';

interface CreateSubscriptionState {
  success: boolean;
  message?: string;
  errors: {
    phone?: string[] | undefined;
    basePlan?: string[] | undefined;
    mealTypes?: string[] | undefined;
    deliveryDays?: string[] | undefined;
    allergies?: string[] | undefined;
    planName?: string[] | undefined;
  };
  fields: {
    phone: string;
    basePlan: string;
    mealTypes: string[];
    deliveryDays: string[];
    allergies: string[];
    planName: string;
  };
}

export type CreateSubscriptionStateOrNull = CreateSubscriptionState | null;

const createSubscriptionSchema = z.strictObject({
  name: z.string(),
  planName: z.string().min(1, { message: 'Plan name is required' }),
  phone: z.e164({ message: 'Invalid phone number' }),
  basePlan: z.enum(['diet', 'protein', 'royal']),
  mealTypes: z
    .array(z.enum(['breakfast', 'lunch', 'dinner']))
    .min(1, { message: 'Pick at least one meal type' }),
  deliveryDays: z
    .array(
      z.enum([
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ])
    )
    .min(1, { message: 'Pick at least one day' }),
  allergies: z.array(z.string()).optional(),
});

const MEAL_PLAN_PRICE = {
  diet: 30000,
  protein: 40000,
  royal: 60000,
};

export async function createSubscription(
  userId: string,
  prevState: CreateSubscriptionStateOrNull,
  formData: FormData
): Promise<CreateSubscriptionStateOrNull> {
  const rawFormData = {
    name: formData.get('name') as string,
    planName: formData.get('plan-name') as string,
    phone: (() => {
      const phone = formData.get('phone') as string;
      return '+62' + phone.replace(/^0+/, '');
    })(),
    basePlan: formData.get('base-plan') as string,
    mealTypes: JSON.parse(formData.get('meal-types') as string) as string[],
    deliveryDays: JSON.parse(
      formData.get('delivery-days') as string
    ) as string[],
    allergies: JSON.parse(formData.get('allergies') as string) as string[],
  };

  const validatedFields = createSubscriptionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        planName: rawFormData.planName,
        basePlan: rawFormData.basePlan,
        phone: formData.get('phone') as string,
        mealTypes: rawFormData.mealTypes,
        deliveryDays: rawFormData.deliveryDays,
        allergies: rawFormData.allergies,
      },
    };
  }

  const {
    name,
    planName,
    phone,
    basePlan,
    mealTypes,
    deliveryDays,
    allergies,
  } = validatedFields.data;

  const basePlanPrice = MEAL_PLAN_PRICE[basePlan];

  const uniqueMealTypes = [...new Set(mealTypes)];
  const uniqueDeliveryDays = [...new Set(deliveryDays)];
  const uniqueAllergies = allergies ? [...new Set(allergies)] : [];

  const totalPrice =
    basePlanPrice * uniqueMealTypes.length * uniqueDeliveryDays.length * 4.3;

  const mealPlan: CustomMealPlan = {
    planName,
    basePlan,
    mealTypes: uniqueMealTypes,
    deliveryDays: uniqueDeliveryDays,
    allergies: uniqueAllergies,
    totalPrice,
  };

  await db.insert(subscriptionsTable).values({
    userId,
    name,
    phoneNumber: phone,
    mealPlan,
  });

  revalidateTag('subscriptions-with-users');
  revalidateTag('users-with-subscriptions');
  revalidateTag(`user-subscriptions-${userId}`);

  return {
    success: true,
    message: 'Subscribed!',
    errors: {},
    fields: {
      phone: '',
      basePlan: '',
      mealTypes: [],
      deliveryDays: [],
      allergies: [],
      planName: '',
    },
  };
}
