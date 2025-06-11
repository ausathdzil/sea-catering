import { GitHub, Instagram, XformerlyTwitter } from '@/components/icons';
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
      <footer className="w-full max-w-6xl flex flex-col md:flex-row justify-between px-8 md:px-2 py-8 text-sm text-muted-foreground gap-8 md:gap-0">
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
