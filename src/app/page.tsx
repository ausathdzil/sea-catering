import { Header } from '@/components/header';
import { GitHub, Instagram, XformerlyTwitter } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BatteryPlusIcon,
  BookOpenIcon,
  CheckIcon,
  HandPlatterIcon,
  LogInIcon,
  TruckElectricIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Personalized Meal Plans',
    description:
      'Design your perfect menu with our expert nutritionists. From keto to vegan, we accommodate all dietary preferences with premium, locally-sourced ingredients.',
    icon: <HandPlatterIcon className="stroke-blue-500 size-24 lg:size-64" />,
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
    icon: (
      <TruckElectricIcon className="stroke-emerald-500 size-24 lg:size-64" />
    ),
    tag: 'Delivery',
    checklist: ['Fast Shipping', 'Cold Chain', 'Island Coverage', 'On-Time'],
  },
  {
    title: 'Transparent Nutrition',
    description:
      'Track your wellness journey with detailed nutritional insights for every meal, helping you achieve your health and fitness goals with confidence.',
    icon: <BatteryPlusIcon className="stroke-amber-500 size-24 lg:size-64" />,
    tag: 'Transparency',
    checklist: ['Macro Details', 'Ingredient List', 'Verified Sources'],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col items-center gap-8 md:gap-16 py-8 md:py-12 px-8 md:px-0">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
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
            <h1 className="flex flex-col text-2xl md:text-5xl font-dm-sans font-semibold leading-snug">
              <span>Healthy Meals</span>
              <span>Anytime, Anywhere.</span>
            </h1>
            <p className="flex flex-col text-xs md:text-lg font-medium">
              <span>Experience healthy eating made effortless.</span>
              <span>Fresh, customizable meals delivered across Indonesia.</span>
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center gap-4">
              <Link className={buttonVariants({ size: 'lg' })} href="/login">
                <LogInIcon />
                Get Started
              </Link>
              <Link
                className={buttonVariants({ variant: 'secondary', size: 'lg' })}
                href="/"
              >
                <BookOpenIcon />
                Learn More
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
          <div className="flex flex-col items-center gap-12 md:gap-24">
            {features.map((feature, idx) => (
              <Feature
                key={feature.title}
                {...feature}
                alignReverse={idx % 2 === 1}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl flex flex-col md:flex-row justify-between px-8 md:px-0 py-8 text-sm text-muted-foreground gap-8 md:gap-0">
        <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-16">
          <span>&copy; 2025</span>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Resources</span>
            <ul className="space-y-2 [&>li]:hover:text-foreground [&>li]:transition-colors">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">Menu</Link>
              </li>
              <li>
                <Link href="/">Subscription</Link>
              </li>
              <li>
                <Link href="/">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="font-medium text-foreground">Manager</span>
            <a
              href="tel:08123456789"
              className="text-sm hover:text-foreground transition-colors"
            >
              08123456789 (Brian)
            </a>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="font-medium text-foreground">Socials</span>
            <div className="flex items-center gap-3">
              <a href="https://github.com/ausathdzil/sea-catering">
                <GitHub className="size-4 fill-muted-foreground hover:fill-foreground transition-colors" />
              </a>
              <a href="https://www.x.com/ausathdzil">
                <XformerlyTwitter className="size-4 fill-muted-foreground hover:fill-foreground transition-colors" />
              </a>
              <a href="https://www.instagram.com/ausathikram">
                <Instagram className="size-4 fill-muted-foreground hover:fill-foreground transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  title,
  description,
  icon,
  tag,
  checklist,
  alignReverse = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  checklist: string[];
  alignReverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-32 p-8 lg:p-16 ${
        alignReverse ? 'lg:flex-row-reverse' : 'bg-muted/50 rounded-lg'
      }`}
    >
      {icon}
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
