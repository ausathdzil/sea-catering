import 'server-only';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { db } from '@/db';
import { user } from '@/db/schema';
import { auth } from './auth';

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return {
    isAuth: true,
    userId: session.user.id,
    role: session.user.role,
  };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  const data = await db.select().from(user).where(eq(user.id, session.userId));

  return data[0];
});
