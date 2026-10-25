import { ErrorMessage } from "../../common/components/error-message";
import { LoadingMessage } from "../../common/components/loading-message";
import { saveCoffee } from "../../core/coffees/api";
import { useCoffee } from "../../core/coffees/hooks";
import type { Coffee, CoffeeInput } from "../../core/coffees/model";
import { CoffeeForm } from "./coffee-form.component";

interface EditCoffeeContainerProps {
  coffeeId: number;
  onSaved: (coffee: Coffee) => void;
}

export function EditCoffeeContainer({
  coffeeId,
  onSaved,
}: EditCoffeeContainerProps) {
  const { coffee, loading, error } = useCoffee(coffeeId);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;
  if (!coffee) return <p>Café no encontrado</p>;

  async function handleSubmit(input: CoffeeInput) {
    // Pasamos el id: así saveCoffee sustituye el café en vez de crear otro.
    onSaved(await saveCoffee(input, coffeeId));
  }

  return <CoffeeForm initialValues={coffee} onSubmit={handleSubmit} />;
}
