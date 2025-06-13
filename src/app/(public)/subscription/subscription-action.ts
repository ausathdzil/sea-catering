'use server';

import { db } from '@/db';
import { CustomMealPlan, subscriptionsTable } from '@/db/schema';
import { revalidateTag } from 'next/cache';
import { z } from 'zod/v4';

export interface CreateSubscriptionState {
  success: boolean;
  message: string;
  errors: {
    name?: string[] | undefined;
    phone?: string[] | undefined;
    basePlan?: string[] | undefined;
    mealTypes?: string[] | undefined;
    deliveryDays?: string[] | undefined;
    allergies?: string[] | undefined;
  };
  fields: {
    name: string;
    phone: string;
    basePlan: string;
    mealTypes: string[];
    deliveryDays: number;
    allergies: string[];
  };
}

const createSubscriptionSchema = z.strictObject({
  name: z.string().min(1, { message: 'Name is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  basePlan: z.enum(['diet', 'protein', 'royal']),
  mealTypes: z
    .array(z.string())
    .min(1, { message: 'Pick at least one meal type' }),
  deliveryDays: z.number().min(1, { message: 'Pick at least one day' }),
  allergies: z.array(z.string()).optional(),
});

const MEAL_PLAN_PRICE = {
  diet: 30000,
  protein: 40000,
  royal: 60000,
};

export async function createSubscription(
  userId: string,
  prevState: CreateSubscriptionState,
  formData: FormData
) {
  const rawFormData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    basePlan: formData.get('base-plan') as string,
    mealTypes: JSON.parse(formData.get('meal-types') as string) as string[],
    deliveryDays: Number(formData.get('delivery-days')),
    allergies: formData.get('allergies')
      ? [formData.get('allergies') as string]
      : [],
  };

  const validatedFields = createSubscriptionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid form data',
      errors: z.flattenError(validatedFields.error).fieldErrors,
      fields: {
        name: rawFormData.name,
        basePlan: rawFormData.basePlan,
        phone: rawFormData.phone,
        mealTypes: rawFormData.mealTypes,
        deliveryDays: rawFormData.deliveryDays,
        allergies: rawFormData.allergies,
      },
    };
  }

  const { name, phone, basePlan, mealTypes, deliveryDays, allergies } =
    validatedFields.data;

  const basePlanPrice = MEAL_PLAN_PRICE[basePlan];

  const totalPrice = basePlanPrice * mealTypes.length * deliveryDays * 4.3;

  const mealPlan: CustomMealPlan = {
    basePlan,
    mealTypes,
    deliveryDays,
    allergies: allergies as string[],
    totalPrice,
  };

  await db.insert(subscriptionsTable).values({
    userId,
    name,
    phoneNumber: phone,
    mealPlan,
  });

  revalidateTag('subscriptions');

  return {
    success: true,
    message: 'Thank you for subscribing! We will get back to you soon.',
    errors: {},
    fields: {
      name: '',
      phone: '',
      basePlan: '',
      mealTypes: [],
      deliveryDays: 0,
      allergies: [],
    },
  };
}
