'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full flex justify-center p-6',
        isScrolled && 'bg-background shadow-xs'
      )}
    >
      <div className="max-w-6xl w-full">
        <Link
          className="flex items-center gap-2 text-2xl font-dm-sans font-bold"
          href="/"
        >
          <Image src="/logo.png" alt="SEA Catering" width={50} height={50} />
          <span>SEA Catering</span>
        </Link>
      </div>
    </header>
  );
}
