import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSubscriptions } from '@/db/data';
import { Subscription } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';
import { DashboardHeader } from './dashboard-header';

export default async function DashboardPage() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  const subscriptions = await getUserSubscriptions(session.user.id, session);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Subscriptions" />
      <main className="flex-1 p-8 mx-auto w-full space-y-4">
        {subscriptions && subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">
              You don&apos;t have any subscriptions yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          {subscription.name}
        </CardTitle>
        <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
          {subscription.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Phone:</span>
            <span>{subscription.phoneNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Base Plan:</span>
            <span className="capitalize">{subscription.mealPlan.basePlan}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Days:</span>
            <span>{subscription.mealPlan.deliveryDays} days/week</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Price:</span>
            <span className="font-medium">
              IDR {subscription.mealPlan.totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-1">
              Meal Types:
            </div>
            <div className="flex flex-wrap gap-1">
              {subscription.mealPlan.mealTypes.map((type, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs capitalize"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          {subscription.mealPlan.allergies.length > 0 && (
            <div className="pt-2">
              <div className="text-sm text-muted-foreground mb-1">
                Allergies:
              </div>
              <div className="flex flex-wrap gap-1">
                {subscription.mealPlan.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
