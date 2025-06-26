import { ArrowRightIcon, TelescopeIcon } from 'lucide-react';

import Link from 'next/link';
import { SVGProps, unstable_ViewTransition as ViewTransition } from 'react';
import { Header } from './header';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col items-center min-h-screen">
      <Header />
      <ViewTransition name="content">{children}</ViewTransition>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full flex flex-col">
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-12 bg-accent/25 text-accent-foreground">
        <TelescopeIcon className="size-12 stroke-primary" />
        <h2 className="text-xl md:text-3xl font-dm-sans font-semibold">
          Join Our Community
        </h2>
        <p className="max-w-2xl text-center px-8 text-sm md:text-base">
          SEA Catering is a catering service that provides a wide range of meal
          plans and subscription options to meet your needs.
        </p>
        <Link
          href="/sign-in"
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
  );
}

const GitHub = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 1024 1024"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
      transform="scale(64)"
    />
  </svg>
);

const XformerlyTwitter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 1200 1227"
    {...props}
  >
    <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
  </svg>
);

const Instagram = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    preserveAspectRatio="xMidYMid"
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z" />
  </svg>
);
