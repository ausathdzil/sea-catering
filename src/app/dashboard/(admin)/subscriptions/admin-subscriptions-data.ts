import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';
import { Session } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function getSubscriptionsWithUsers(session: Session) {
  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const data = await db
    .select({
      id: subscriptionsTable.id,
      userName: user.name,
      userEmail: user.email,
      mealPlan: subscriptionsTable.mealPlan,
      numberOfPayments: subscriptionsTable.numberOfPayments,
      status: subscriptionsTable.status,
      createdAt: subscriptionsTable.createdAt,
    })
    .from(subscriptionsTable)
    .innerJoin(user, eq(subscriptionsTable.userId, user.id));

  return data.map((subscription) => ({
    id: subscription.id,
    user: subscription.userName,
    email: subscription.userEmail,
    amount: subscription.mealPlan.totalPrice,
    date: subscription.createdAt,
    status: subscription.numberOfPayments > 0 ? 'paid' : 'pending',
  }));
}
