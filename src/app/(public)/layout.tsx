import { GitHub, Instagram, XformerlyTwitter } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, TelescopeIcon } from 'lucide-react';
import Link from 'next/link';
import { Header } from './header';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Header />
      {children}
      <footer className="w-full flex flex-col">
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-12 bg-accent/25 text-accent-foreground">
          <TelescopeIcon className="size-12 stroke-primary" />
          <h2 className="text-xl md:text-3xl font-dm-sans font-semibold">
            Join Our Community
          </h2>
          <p className="max-w-2xl text-center px-8 text-sm md:text-base">
            SEA Catering is a catering service that provides a wide range of
            meal plans and subscription options to meet your needs.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'lg' }),
              'text-primary bg-none hover:bg-primary/5 hover:text-primary hover:scale-105 transition-all'
            )}
          >
            Get Started
            <ArrowRightIcon />
          </Link>
        </div>
        <div className="py-12 w-full max-w-6xl flex flex-col md:flex-row gap-8 mx-auto px-8 md:px-2 text-sm text-muted-foreground">
          <div className="md:flex-1 flex flex-col md:flex-row gap-8 md:gap-16">
            <span>&copy; 2025</span>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-foreground">Resources</span>
              <ul className="space-y-2 [&>li]:hover:text-foreground [&>li]:transition-colors">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/meal-plans">Meal Plans</Link>
                </li>
                <li>
                  <Link href="/subscription">Subscription</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact Us</Link>
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
                <a
                  href="https://github.com/ausathdzil/sea-catering"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHub className="size-4 fill-muted-foreground hover:fill-foreground transition-colors" />
                </a>
                <a
                  href="https://www.x.com/ausathdzil"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <XformerlyTwitter className="size-4 fill-muted-foreground hover:fill-foreground transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com/ausathikram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="size-4 fill-muted-foreground hover:fill-foreground transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
