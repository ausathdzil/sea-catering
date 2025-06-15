'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';
import { getSubscriptions } from './admin-dashboard-data';

const chartConfig = {
  count: {
    label: 'Count',
  },
  active: {
    label: 'Active',
    color: 'var(--primary)',
  },
  canceled: {
    label: 'Canceled',
    color: 'var(--destructive)',
  },
} satisfies ChartConfig;

export function SubscriptionsChart({
  subscriptions,
}: {
  subscriptions: Awaited<ReturnType<typeof getSubscriptions>>;
}) {
  const isMobile = useIsMobile();

  const chartData = subscriptions?.map((subscription) => ({
    month: subscription.month,
    active: subscription.active,
    canceled: subscription.canceled,
  }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Active Subscriptions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Active for the last 6 months
          </span>
          <span className="@[540px]/card:hidden">Last 6 months</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillActive" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCanceled" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-destructive)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-destructive)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="active"
              type="natural"
              fill="url(#fillActive)"
              stroke="var(--color-primary)"
            />
            <Area
              dataKey="canceled"
              type="natural"
              fill="url(#fillCanceled)"
              stroke="var(--color-destructive)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
