'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import {
  CalendarIcon,
  ChefHatIcon,
  ClockIcon,
  UtensilsIcon,
} from 'lucide-react';
import { useState } from 'react';

type MealPlan = {
  type: 'basic' | 'premium' | 'executive';
  items: {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string | null;
    details: {
      mealsPerWeek: number;
      deliveryDays: string[];
      dietaryOptions: string[];
      customization: string;
      cancellationPolicy: string;
    };
  }[];
};

const mealPlans: MealPlan[] = [
  {
    type: 'basic',
    items: [
      {
        id: 101,
        name: 'Lite & Easy',
        price: 349000,
        description: 'Simple and healthy meals for everyday convenience.',
        image: 'https://example.com/images/basic_lite.jpg',
        details: {
          mealsPerWeek: 5,
          deliveryDays: ['Monday', 'Wednesday'],
          dietaryOptions: ['Standard', 'Vegetarian'],
          customization: 'Limited meal swaps',
          cancellationPolicy: '24 hours notice',
        },
      },
      {
        id: 102,
        name: 'Quick Start',
        price: 399000,
        description:
          'Perfect for busy individuals seeking quick, nutritious meals.',
        image: 'https://example.com/images/basic_quick.jpg',
        details: {
          mealsPerWeek: 7,
          deliveryDays: ['Tuesday', 'Thursday'],
          dietaryOptions: ['Standard', 'Pescatarian'],
          customization: 'No customization',
          cancellationPolicy: '48 hours notice',
        },
      },
      {
        id: 103,
        name: 'Family Feast',
        price: 599000,
        description:
          'Wholesome family-friendly meals that are easy to prepare.',
        image: 'https://example.com/images/basic_family.jpg',
        details: {
          mealsPerWeek: 5,
          deliveryDays: ['Wednesday', 'Friday'],
          dietaryOptions: ['Standard'],
          customization: 'Select protein preference',
          cancellationPolicy: '24 hours notice',
        },
      },
      {
        id: 104,
        name: 'Veggie Delights',
        price: 379000,
        description: 'A curated selection of delicious vegetarian meals.',
        image: 'https://example.com/images/basic_veggie.jpg',
        details: {
          mealsPerWeek: 6,
          deliveryDays: ['Monday', 'Thursday'],
          dietaryOptions: ['Vegetarian', 'Vegan'],
          customization: 'Swap one meal per week',
          cancellationPolicy: 'Same day cancellation fee',
        },
      },
      {
        id: 105,
        name: 'Student Saver',
        price: 299000,
        description: 'Budget-friendly and satisfying meals for students.',
        image: 'https://example.com/images/basic_student.jpg',
        details: {
          mealsPerWeek: 4,
          deliveryDays: ['Tuesday'],
          dietaryOptions: ['Standard'],
          customization: 'No customization',
          cancellationPolicy: '72 hours notice',
        },
      },
      {
        id: 106,
        name: 'Fit & Simple',
        price: 399000,
        description:
          'Balanced meals designed for a healthy and active lifestyle.',
        image: 'https://example.com/images/basic_fit.jpg',
        details: {
          mealsPerWeek: 6,
          deliveryDays: ['Monday', 'Wednesday', 'Friday'],
          dietaryOptions: ['Standard', 'Low-carb'],
          customization: 'Limited carb options',
          cancellationPolicy: '24 hours notice',
        },
      },
    ],
  },
  {
    type: 'premium',
    items: [
      {
        id: 201,
        name: 'Gourmet Selection',
        price: 699000,
        description:
          'Elevated dining experience with high-quality ingredients.',
        image: 'https://example.com/images/premium_gourmet.jpg',
        details: {
          mealsPerWeek: 7,
          deliveryDays: ['Monday', 'Wednesday', 'Friday'],
          dietaryOptions: ['Standard', 'Gluten-free', 'Dairy-free'],
          customization: 'Choose 3 meals from a wider selection',
          cancellationPolicy: '24 hours notice with refund',
        },
      },
      {
        id: 202,
        name: "Chef's Special",
        price: 799000,
        description:
          'Curated meals by our executive chefs, delivered to your door.',
        image: 'https://example.com/images/premium_chef.jpg',
        details: {
          mealsPerWeek: 10,
          deliveryDays: ['Tuesday', 'Thursday', 'Saturday'],
          dietaryOptions: ['Standard', 'Keto', 'Paleo'],
          customization: 'Personalized meal plan consultation',
          cancellationPolicy: '48 hours notice for full credit',
        },
      },
      {
        id: 203,
        name: 'Organic & Fresh',
        price: 749000,
        description:
          'Locally sourced, organic ingredients for a wholesome diet.',
        image: 'https://example.com/images/premium_organic.jpg',
        details: {
          mealsPerWeek: 7,
          deliveryDays: ['Monday', 'Thursday'],
          dietaryOptions: ['Vegetarian', 'Vegan', 'Organic-only'],
          customization: 'Swap any meal for a comparable organic option',
          cancellationPolicy: 'No cancellation fee within 24 hours',
        },
      },
      {
        id: 204,
        name: 'Athletic Performance',
        price: 849000,
        description: 'Optimized meals for athletes and active individuals.',
        image: 'https://example.com/images/premium_athletic.jpg',
        details: {
          mealsPerWeek: 12,
          deliveryDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
          dietaryOptions: ['High-protein', 'Low-carb', 'Performance-focused'],
          customization: 'Macro-nutrient adjustment options',
          cancellationPolicy: 'Strict 72 hours notice',
        },
      },
      {
        id: 205,
        name: 'International Flavors',
        price: 799000,
        description:
          'Explore the world through diverse and authentic cuisines.',
        image: 'https://example.com/images/premium_international.jpg',
        details: {
          mealsPerWeek: 8,
          deliveryDays: ['Tuesday', 'Friday'],
          dietaryOptions: ['Standard', 'Spicy-tolerant', 'Dairy-free'],
          customization: 'Choose 2 international themes per week',
          cancellationPolicy: '24 hours notice with partial credit',
        },
      },
      {
        id: 206,
        name: 'Wellness & Balance',
        price: 699000,
        description: 'Mindfully crafted meals to support overall well-being.',
        image: 'https://example.com/images/premium_wellness.jpg',
        details: {
          mealsPerWeek: 7,
          deliveryDays: ['Wednesday', 'Saturday'],
          dietaryOptions: ['Anti-inflammatory', 'Detox', 'Gut-friendly'],
          customization: 'Focus on specific health goals',
          cancellationPolicy: '48 hours notice for full refund',
        },
      },
    ],
  },
  {
    type: 'executive',
    items: [
      {
        id: 301,
        name: 'Signature',
        price: 1299000,
        description: 'Bespoke meal planning with personal chef consultation.',
        image: 'https://example.com/images/executive_signature.jpg',
        details: {
          mealsPerWeek: 14,
          deliveryDays: ['Daily', 'On-demand'],
          dietaryOptions: [
            'Fully customizable',
            'Allergy-specific',
            'Nutritional therapist support',
          ],
          customization: 'Unlimited customization and meal requests',
          cancellationPolicy: 'Flexible, 12 hours notice required',
        },
      },
      {
        id: 302,
        name: 'Elite Dining',
        price: 1499000,
        description:
          'Exquisite, Michelin-star inspired meals at your convenience.',
        image: 'https://example.com/images/executive_elite.jpg',
        details: {
          mealsPerWeek: 10,
          deliveryDays: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
          dietaryOptions: ['Gourmet', 'Fine Dining'],
          customization: 'Seasonal menu with off-menu options',
          cancellationPolicy: '24 hours notice, priority re-scheduling',
        },
      },
      {
        id: 303,
        name: 'Health & Longevity',
        price: 1399000,
        description:
          'Scientifically backed meals for optimal health and anti-aging.',
        image: 'https://example.com/images/executive_longevity.jpg',
        details: {
          mealsPerWeek: 14,
          deliveryDays: ['Daily'],
          dietaryOptions: [
            'Anti-aging',
            'Cellular Health',
            'Personalized supplements',
          ],
          customization: 'Ongoing nutritional coaching',
          cancellationPolicy: '48 hours notice for re-evaluation',
        },
      },
      {
        id: 304,
        name: 'Private Chef',
        price: 1799000,
        description: 'A dedicated private chef prepares and delivers meals.',
        image: 'https://example.com/images/executive_private.jpg',
        details: {
          mealsPerWeek: 18,
          deliveryDays: ['Daily', 'Cook-at-home option'],
          dietaryOptions: ['Fully tailored to preference', 'Special requests'],
          customization: 'On-site preparation available',
          cancellationPolicy: 'Negotiable based on agreement',
        },
      },
      {
        id: 305,
        name: 'Connoisseur',
        price: 1599000,
        description:
          'Rare and premium ingredients crafted into culinary masterpieces.',
        image: 'https://example.com/images/executive_connoisseur.jpg',
        details: {
          mealsPerWeek: 9,
          deliveryDays: ['Tuesday', 'Friday', 'Sunday'],
          dietaryOptions: ['Exclusive ingredients', 'Tasting menus'],
          customization: 'Wine pairing suggestions and procurement',
          cancellationPolicy: '72 hours notice for ingredient sourcing',
        },
      },
      {
        id: 306,
        name: 'Corporate Wellness',
        price: 1699000,
        description:
          'Premium meal solutions for corporate clients and executive teams.',
        image: 'https://example.com/images/executive_corporate.jpg',
        details: {
          mealsPerWeek: 20,
          deliveryDays: ['Monday - Friday'],
          dietaryOptions: [
            'Variety for group needs',
            'Allergy-friendly options',
          ],
          customization: 'On-site catering for events',
          cancellationPolicy: 'Contractual agreement based',
        },
      },
    ],
  },
];

export function MealPlans() {
  const [selectedPlan, setSelectedPlan] = useState<
    'basic' | 'premium' | 'executive'
  >('basic');

  const plans = mealPlans.find((plan) => plan.type === selectedPlan)?.items;

  return (
    <div className="w-full flex flex-col gap-4 py-8">
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          className={`${
            selectedPlan === 'basic'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('basic')}
        >
          Basic
        </Button>
        <Button
          className={`${
            selectedPlan === 'premium'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('premium')}
        >
          Premium
        </Button>
        <Button
          className={`${
            selectedPlan === 'executive'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('executive')}
        >
          Executive
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans?.map((plan) => (
          <MealPlanCard key={plan.id} type={selectedPlan} {...plan} />
        ))}
      </div>
    </div>
  );
}

function MealPlanCard({
  type,
  name,
  price,
  description,
  details,
}: MealPlan['items'][number] & { type: 'basic' | 'premium' | 'executive' }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card
          className={cn(
            'border transition-colors shadow-none gap-2',
            type === 'basic' && 'hover:border-blue-500',
            type === 'premium' && 'hover:border-purple-500',
            type === 'executive' && 'hover:border-amber-500'
          )}
        >
          <CardHeader>
            <div className="flex flex-col">
              <CardTitle className="text-xl font-semibold font-dm-sans">
                {name}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    type === 'basic' && 'bg-blue-500/10 text-blue-500',
                    type === 'premium' && 'bg-purple-500/10 text-purple-500',
                    type === 'executive' && 'bg-amber-500/10 text-amber-500'
                  )}
                >
                  {details.mealsPerWeek} meals
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'hidden md:block',
                    type === 'basic' && 'border-blue-500/20 text-blue-500',
                    type === 'premium' &&
                      'border-purple-500/20 text-purple-500',
                    type === 'executive' && 'border-amber-500/20 text-amber-500'
                  )}
                >
                  {details.dietaryOptions[0]}
                </Badge>
              </div>
            </div>
            <CardAction>
              <Button size="sm" variant="secondary">
                Details
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xl md:text-3xl font-semibold tabluar-nums">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(price)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /week
                </span>
              </p>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">
              {description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon
                className={cn(
                  'size-4',
                  type === 'basic' && 'text-blue-500',
                  type === 'premium' && 'text-purple-500',
                  type === 'executive' && 'text-amber-500'
                )}
              />
              <span>{details.deliveryDays.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon
                className={cn(
                  'size-4',
                  type === 'basic' && 'text-blue-500',
                  type === 'premium' && 'text-purple-500',
                  type === 'executive' && 'text-amber-500'
                )}
              />
              <span>{details.cancellationPolicy}</span>
            </div>
          </CardFooter>
        </Card>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl md:text-3xl font-bold">
            {name}
          </DrawerTitle>
          <DrawerDescription className="text-xs md:text-lg">
            {description}
          </DrawerDescription>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <Badge
              variant="secondary"
              className={cn(
                type === 'basic' && 'bg-blue-100 text-blue-700',
                type === 'premium' && 'bg-purple-100 text-purple-700',
                type === 'executive' && 'bg-amber-100 text-amber-700'
              )}
            >
              {details.mealsPerWeek} meals per week
            </Badge>
            {details.dietaryOptions.map((option) => (
              <Badge
                key={option}
                variant="outline"
                className={cn(
                  type === 'basic' && 'border-blue-200 text-blue-700',
                  type === 'premium' && 'border-purple-200 text-purple-700',
                  type === 'executive' && 'border-amber-200 text-amber-700'
                )}
              >
                {option}
              </Badge>
            ))}
          </div>
        </DrawerHeader>
        <div className="w-full flex justify-center overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CalendarIcon
                  className={cn(
                    'size-5',
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Delivery Schedule</h4>
                  <p className="text-muted-foreground">
                    {details.deliveryDays.join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <UtensilsIcon
                  className={cn(
                    'size-5',
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Dietary Options</h4>
                  <p className="text-muted-foreground">
                    {details.dietaryOptions.join(', ')}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ChefHatIcon
                  className={cn(
                    'size-5',
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Customization</h4>
                  <p className="text-muted-foreground">
                    {details.customization}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ClockIcon
                  className={cn(
                    'size-5',
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Cancellation Policy</h4>
                  <p className="text-muted-foreground">
                    {details.cancellationPolicy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex items-center justify-center">
          <Button size="lg" variant="secondary" className="max-w-lg w-full">
            Subscribe Now
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
