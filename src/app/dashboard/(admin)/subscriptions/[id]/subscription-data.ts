import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';

export async function getSubsriptionById(id: string) {
  const data = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.id, id));

  return data[0];
}
