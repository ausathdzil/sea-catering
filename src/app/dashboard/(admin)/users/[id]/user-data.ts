import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { user } from '@/db/schema';

export async function getUser(id: string) {
  const data = await db.select().from(user).where(eq(user.id, id));

  return data[0];
}
