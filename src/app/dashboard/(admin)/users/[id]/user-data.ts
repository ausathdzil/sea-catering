import { eq } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { user } from '@/db/schema';

export async function getUser(id: string) {
  'use cache';

  cacheLife('hours');
  cacheTag(`user-${id}`);

  const data = await db.select().from(user).where(eq(user.id, id));

  return data[0];
}
