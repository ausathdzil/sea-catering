import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MailIcon, PhoneIcon } from 'lucide-react';
import { TestimonialForm } from '../testimonials/testimonial-form';

export default function ContactUsPage() {
  return (
    <main className="w-full max-w-6xl flex-1 flex flex-col p-4 sm:p-6 md:p-8 gap-6 md:gap-8 xl:px-2">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="font-dm-sans text-xl md:text-4xl font-semibold">
          Contact Us
        </h1>
        <p className="text-xs md:text-base text-muted-foreground">
          We&apos;re here to help you with any questions or concerns you may have.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Brian</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Manager
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3 md:space-y-4">
            <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4 md:size-5" />
                <span className="text-sm md:text-base font-medium">Phone</span>
              </div>
              <a
                className="hover:text-primary transition-colors text-sm md:text-base break-all sm:break-normal"
                href="tel:+6281234567890"
              >
                +62 81234567890
              </a>
            </div>
            <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <MailIcon className="size-4 md:size-5" />
                <span className="text-sm md:text-base font-medium">Email</span>
              </div>
              <a
                className="hover:text-primary transition-colors text-sm md:text-base break-all sm:break-normal"
                href="mailto:brian@seacatering.com"
              >
                brian@seacatering.com
              </a>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">HQ Jakarta</CardTitle>
            <CardDescription className="text-sm md:text-base">
              Head Office
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-3 md:space-y-4">
            <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4 md:size-5" />
                <span className="text-sm md:text-base font-medium">Phone</span>
              </div>
              <a
                className="hover:text-primary transition-colors text-sm md:text-base break-all sm:break-normal"
                href="tel:+622123456789"
              >
                +62 2123456789
              </a>
            </div>
            <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <MailIcon className="size-4 md:size-5" />
                <span className="text-sm md:text-base font-medium">Email</span>
              </div>
              <a
                className="hover:text-primary transition-colors text-sm md:text-base break-all sm:break-normal"
                href="mailto:info@seacatering.com"
              >
                info@seacatering.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full flex flex-col items-center justify-center gap-6 md:gap-8 py-8 md:py-12">
        <h2 className="text-xl md:text-2xl font-dm-sans font-semibold text-center md:text-left">
          Give Us Your Feedback
        </h2>
        <TestimonialForm />
      </div>
    </main>
  );
}
