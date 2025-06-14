import {
  AlertTriangle,
  BanknoteXIcon,
  Calendar,
  CreditCard,
  MoreVerticalIcon,
  PauseIcon,
  Utensils,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { getUserSubscriptions } from '@/db/data';
import { Subscription } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { DashboardHeader } from './dashboard-header';

import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';

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
    <Card className="w-full hover:border-primary/50 transition-colors ease-out">
      <CardHeader>
        <CardTitle>{subscription.mealPlan.planName}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Subscription Status:
          </span>
          <Badge
            className="capitalize"
            variant={subscription.status === 'active' ? 'default' : 'secondary'}
          >
            {subscription.status}
          </Badge>
        </CardDescription>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <PauseIcon />
                  Pause
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BanknoteXIcon />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-4">
            <Calendar className="size-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Delivery Days</p>
              <p className="font-medium">
                {subscription.mealPlan.deliveryDays.length} days
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  /week
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Utensils className="size-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Base Plan</p>
              <p className="font-medium capitalize">
                {subscription.mealPlan.basePlan}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <CreditCard className="size-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Total Price</p>
            <p className="text-lg font-bold text-primary tabular-nums">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(subscription.mealPlan.totalPrice)}
              <span className="text-xs text-muted-foreground font-normal ml-1">
                /week
              </span>
            </p>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Utensils className="size-4 text-muted-foreground" />
            <p className="text-sm font-medium">Meal Types</p>
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
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="size-4 text-destructive" />
              <p className="text-sm font-medium">Allergies</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {subscription.mealPlan.allergies.map((allergy, index) => (
                <Badge
                  key={index}
                  variant="destructive"
                  className="text-xs bg-destructive/10 hover:bg-destructive/20"
                >
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
