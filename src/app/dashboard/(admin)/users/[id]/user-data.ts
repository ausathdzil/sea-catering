import { db } from '@/db';
import { user } from '@/db/schema';
import { Session } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function getUser(id: string, session: Session) {
  if (!session || session.user.role !== 'admin') return null;

  const data = await db.select().from(user).where(eq(user.id, id));

  return data[0];
}
