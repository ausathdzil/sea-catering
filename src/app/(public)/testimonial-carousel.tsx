'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { DotIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Wijaya',
    comment:
      'The personalized meal plans have been a game-changer for my fitness journey. The food is always fresh and delicious!',
  },
  {
    name: 'Budi Santoso',
    comment:
      'As a busy professional, having healthy meals delivered to my office has saved me so much time. The quality is consistently excellent.',
  },
  {
    name: 'Maya Putri',
    comment:
      'I love how they accommodate my vegan diet. The variety of options and attention to nutritional details is impressive.',
  },
  {
    name: 'Ahmad Rizki',
    comment:
      'The delivery service is incredibly reliable. My meals always arrive on time and perfectly fresh, even during peak hours.',
  },
  {
    name: 'Dewi Lestari',
    comment:
      'The transparency in nutritional information helps me stay on track with my health goals. Highly recommended!',
  },
  {
    name: 'Rudi Hartono',
    comment:
      'The premium ingredients really make a difference. You can taste the quality in every bite. Worth every penny!',
  },
];

export function TestimonialCarousel()  {
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
              key={testimonial.name}
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

function TestimonialCard({ name, comment }: { name: string; comment: string }) {
  return (
    <Card className="shadow-none border-accent hover:bg-accent transition-colors">
      <CardHeader className="flex flex-row items-center gap-2">
        <Avatar>
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base line-clamp-3">{comment}</p>
      </CardContent>
    </Card>
  );
}
