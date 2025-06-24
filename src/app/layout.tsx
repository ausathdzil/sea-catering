import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
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
          'font-sans tracking-[-0.015em]'
        )}
      >
        {children}
        <Toaster
          toastOptions={{ className: '!font-sans' }}
          richColors
          position="bottom-center"
        />
      </body>
    </html>
  );
}
