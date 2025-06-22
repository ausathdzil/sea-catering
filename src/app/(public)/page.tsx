import { CheckIcon, HandPlatterIcon, LogInIcon } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { getTestimonials } from './public-data';
import { TestimonialCarousel } from './testimonials/testimonial-carousel';
import { TestimonialForm } from './testimonials/testimonial-form';

const features = [
  {
    title: 'Personalized Meal Plans',
    description:
      'Design your perfect menu with our expert nutritionists. From keto to vegan, we accommodate all dietary preferences with premium, locally-sourced ingredients.',
    image: '/personalized.png',
    tag: 'Nutrition',
    checklist: [
      'Customizable',
      'Nutritionist-Designed',
      'Premium Ingredients',
      'No Lock-In',
    ],
  },
  {
    title: 'Island-Wide Delivery',
    description:
      'From Sabang to Merauke, we ensure your meals arrive fresh and on time, no matter where you are in Indonesia.',
    image: '/delivery.png',
    tag: 'Delivery',
    checklist: ['Fast Shipping', 'Cold Chain', 'Island Coverage', 'On-Time'],
  },
  {
    title: 'Transparent Nutrition',
    description:
      'Track your wellness journey with detailed nutritional insights for every meal, helping you achieve your health and fitness goals with confidence.',
    image: '/nutrition.png',
    tag: 'Transparency',
    checklist: ['Macro Details', 'Ingredient List', 'Verified Sources'],
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center gap-8 md:gap-16 py-8 md:py-12 px-8 md:px-0">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-16">
        <Image
          src="/chef.png"
          alt="Chef"
          width={400}
          height={400}
          priority
          quality={100}
          className="w-[250px] md:w-[400px]"
        />
        <div className="flex flex-col justify-center gap-4 text-left md:text-center">
          <h1 className="flex flex-col text-2xl md:text-5xl font-dm-sans font-semibold md:leading-12">
            Healthy meals <br /> anytime, anywhere.
          </h1>
          <p className="flex flex-col text-xs md:text-lg font-medium">
            Experience healthy eating made effortless. <br />
            Fresh, customizable meals delivered across Indonesia.
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-4">
            <Link
              className={cn(buttonVariants({ size: 'lg' }), 'rounded-full')}
              href="/sign-in"
            >
              <LogInIcon />
              Get Started
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'rounded-full'
              )}
              href="/meal-plans"
            >
              <HandPlatterIcon />
              See Our Plans
            </Link>
          </div>
        </div>
        <Image
          src="/bits.png"
          alt="Chef"
          width={400}
          height={400}
          priority
          quality={100}
          className="hidden 2xl:block"
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-6 md:gap-8 py-8 md:py-12">
        <h2 className="text-xl md:text-4xl font-dm-sans font-semibold">
          Why Choose Us
        </h2>
        <div className="flex flex-col items-center gap-8">
          {features.map((feature, idx) => (
            <Feature
              key={feature.title}
              {...feature}
              alignReverse={idx % 2 === 1}
            />
          ))}
        </div>
      </div>

      <Suspense fallback={<TestimonialSkeleton />}>
        <TestimnialSection />
      </Suspense>

      <div className="w-full max-w-2xl flex flex-col items-center justify-center gap-8 py-12">
        <h2 className="text-xl md:text-4xl font-dm-sans font-semibold">
          Give Us Your Feedback
        </h2>
        <TestimonialForm />
      </div>
    </main>
  );
}

async function TestimnialSection() {
  const testimonials = await getTestimonials();

  return (
    <div className="hidden xl:flex flex-col items-center justify-center gap-8 py-12">
      <h2 className="text-xl md:text-4xl font-dm-sans font-semibold">
        What Our Customers Say
      </h2>
      <TestimonialCarousel testimonials={testimonials} />
    </div>
  );
}

function Feature({
  title,
  description,
  image,
  tag,
  checklist,
  alignReverse = false,
}: {
  title: string;
  description: string;
  image: string;
  tag: string;
  checklist: string[];
  alignReverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-32 p-8 lg:p-16 ${
        alignReverse ? 'lg:flex-row-reverse' : 'bg-accent/50 rounded-lg'
      }`}
    >
      <Image
        src={image}
        alt={title}
        width={300}
        height={300}
        priority
        quality={100}
      />
      <div className="flex flex-col gap-4 max-w-xl">
        <span
          className={cn(
            'text-sm font-medium',
            tag === 'Nutrition'
              ? 'text-blue-500'
              : tag === 'Delivery'
              ? 'text-emerald-500'
              : 'text-amber-500'
          )}
        >
          {tag}
        </span>
        <h3 className="text-lg md:text-3xl font-dm-sans font-semibold">
          {title}
        </h3>
        <p className="text-sm md:text-lg">{description}</p>
        <ul className="flex flex-col gap-2 mt-2">
          {checklist.map((item) => (
            <li
              key={item}
              className={cn(
                'flex items-center gap-2 font-medium text-sm md:text-base',
                tag === 'Nutrition'
                  ? 'text-blue-500'
                  : tag === 'Delivery'
                  ? 'text-emerald-500'
                  : 'text-amber-500'
              )}
            >
              <CheckIcon /> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="w-full flex gap-4">
      <Skeleton className="basis-1/3 h-[200px] rounded-lg" />
      <Skeleton className="basis-1/3 h-[200px] rounded-lg" />
      <Skeleton className="basis-1/3 h-[200px] rounded-lg" />
    </div>
  );
}
