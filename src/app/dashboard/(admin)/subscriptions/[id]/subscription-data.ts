import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';

export async function getSubsriptionById(id: string, session: Session) {
  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const data = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.id, id));

  return data[0];
}
