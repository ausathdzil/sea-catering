import {
  AlertTriangleIcon,
  CalendarIcon,
  CreditCardIcon,
  UtensilsCrossedIcon,
  UtensilsIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Subscription } from '@/db/schema';
import { SubscriptionCardAction } from './subscription/subscription-card-action';
import { getUserSubscriptions } from './user-data';

export async function UserDashboard({ userId }: { userId: string }) {
  const subscriptions = await getUserSubscriptions(userId);

  return (
    <>
      {subscriptions && subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
    </>
  );
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <Card className="w-full hover:border-primary/50 transition-colors ease-out">
      <CardHeader>
        <CardTitle className="text-sm md:text-base">
          {subscription.mealPlan.planName}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Badge
            variant={
              subscription.status === 'paused'
                ? 'warning'
                : subscription.status === 'canceled'
                ? 'destructive'
                : 'default'
            }
            className="text-xs capitalize"
          >
            {subscription.status}
          </Badge>
          {subscription.status === 'paused' ? (
            <p className="hidden md:block text-xs font-medium">
              until{' '}
              <span className="text-amber-600">
                {subscription.pausedUntil?.toLocaleDateString('en-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
          ) : subscription.status === 'canceled' ? (
            <p className="hidden md:block text-xs font-medium">
              on{' '}
              <span className="text-destructive">
                {subscription.canceledAt?.toLocaleDateString('en-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
          ) : null}
        </CardDescription>
        <SubscriptionCardAction
          subscriptionId={subscription.id}
          status={subscription.status}
          dueDate={subscription.dueDate ?? new Date()}
        />
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="hidden md:block size-4 text-muted-foreground" />
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Delivery Days
              </p>
              <p className="font-medium text-sm md:text-base">
                {subscription.mealPlan.deliveryDays.length} days
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  /week
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UtensilsIcon className="hidden md:block size-4 text-muted-foreground" />
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">
                Base Plan
              </p>
              <p className="font-medium capitalize text-sm md:text-base">
                {subscription.mealPlan.basePlan}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <CreditCardIcon className="hidden md:block size-4 text-muted-foreground" />
          <div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Total Price
            </p>
            <p className="text-base md:text-lg font-bold text-primary tabular-nums">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(subscription.mealPlan.totalPrice)}
            </p>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <UtensilsCrossedIcon className="hidden md:block size-4 text-muted-foreground" />
            <p className="text-xs md:text-sm font-medium">Meal Types</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {subscription.mealPlan.mealTypes.map((type, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs capitalize bg-primary/5 hover:bg-primary/10"
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
        {subscription.mealPlan.allergies.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <AlertTriangleIcon className="size-4 stroke-destructive" />
              <p className="text-xs md:text-sm font-medium">Allergies</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {subscription.mealPlan.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
