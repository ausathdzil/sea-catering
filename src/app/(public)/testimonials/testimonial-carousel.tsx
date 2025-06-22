'use client';

import { DotIcon, StarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Testimonial } from '@/db/schema';
import { cn } from '@/lib/utils';

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex flex-col items-center gap-4 max-w-6xl">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem
              className="basis-full md:basis-1/2 lg:basis-1/3"
              key={testimonial.id}
            >
              <TestimonialCard {...testimonial} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex flex-row items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <DotIcon
            key={index}
            className={cn(
              'stroke-foreground/50',
              current === index + 1 ? 'stroke-foreground' : ''
            )}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  name,
  message,
  rating,
}: {
  name: string;
  message: string;
  rating: number;
}) {
  return (
    <Card className="border-primary/5 border-3 hover:bg-primary/5 transition-colors">
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <Avatar className="size-10">
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription className="flex flex-row items-center gap-1">
              {Array.from({ length: rating }).map((_, index) => (
                <StarIcon
                  key={index}
                  className="fill-yellow-500 stroke-yellow-500 size-4"
                />
              ))}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base line-clamp-4">{message}</p>
      </CardContent>
    </Card>
  );
}
