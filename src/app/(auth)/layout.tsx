import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            className="flex items-center gap-1 font-medium font-dm-sans"
            href="/"
          >
            <Image src="/logo.png" alt="logo" width={28} height={28} />
            SEA Catering
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="p-4 hidden lg:block">
        <div className="size-full bg-primary/20 rounded-3xl flex items-center justify-center">
          <Image
            src="/chef-3d.png"
            alt="chef"
            className="fixed right-16"
            width={500}
            height={500}
            priority
            quality={100}
          />
        </div>
      </div>
    </main>
  );
}
