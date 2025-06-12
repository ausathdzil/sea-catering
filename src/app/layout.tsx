import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SEA Catering',
  description: 'Healthy Meals, Anytime, Anywhere.',
};

export const experimental_ppr = true;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          dmSans.variable,
          'font-sans dark:antialiased'
        )}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster
          toastOptions={{ className: '!font-sans' }}
          richColors
          position="bottom-center"
        />
      </body>
    </html>
  );
}
