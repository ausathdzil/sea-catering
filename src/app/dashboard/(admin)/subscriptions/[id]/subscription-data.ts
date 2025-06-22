import { eq } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';

export async function getSubsriptionById(id: string) {
  'use cache';

  cacheLife('hours');
  cacheTag(`subscription-${id}`);

  const data = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.id, id));

  return data[0];
}
