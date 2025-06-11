import { MealPlans } from './meal-plans';

export default function MealPlansPage() {
  return (
    <main className="w-full max-w-6xl flex-1 flex flex-col py-12 px-8 md:px-2">
      <div className="space-y-2">
        <h1 className="font-dm-sans text-4xl font-semibold">Meal Plans</h1>
        <p className="text-muted-foreground">
          Choose the perfect meal plan that suits your lifestyle and dietary
          preferences
        </p>
      </div>
      <MealPlans />
    </main>
  );
}
