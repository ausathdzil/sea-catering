import { getMealPlans } from '@/db/data';
import { MealPlans } from './meal-plans';

export default async function MealPlansPage() {
  const plans = await getMealPlans();

  return (
    <main className="w-full max-w-6xl flex-1 flex flex-col p-8 md:px-2">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="font-dm-sans text-xl md:text-4xl font-semibold">
          Meal Plans
        </h1>
        <p className="text-xs md:text-base text-muted-foreground">
          Choose the perfect meal plan that suits your lifestyle and dietary
          preferences.
        </p>
      </div>
      <MealPlans plans={plans} />
    </main>
  );
}
