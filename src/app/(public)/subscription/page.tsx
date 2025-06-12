import { SubscriptionForm } from "./subscription-form";

export default function SubscriptionPage() {
  return (
    <main className="w-full max-w-6xl flex-1 flex flex-col gap-8 p-8 md:px-2">
      <div className="space-y-2 text-center">
        <h1 className="font-dm-sans text-4xl font-semibold">
          Create your own plan
        </h1>
        <p className="text-muted-foreground">
          Customize your meal plan to suit your lifestyle and dietary
          preferences
        </p>
      </div>
      <SubscriptionForm />
    </main>
  );
}
