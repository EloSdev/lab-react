import { saveCoffee } from "../../core/coffees/api";
import type { Coffee, CoffeeInput } from "../../core/coffees/model";
import { CoffeeForm } from "./coffee-form.component";

interface NewCoffeeContainerProps {
  onSaved: (coffee: Coffee) => void;
}

export function NewCoffeeContainer({ onSaved }: NewCoffeeContainerProps) {
  async function handleSubmit(input: CoffeeInput) {
    onSaved(await saveCoffee(input));
  }

  return <CoffeeForm onSubmit={handleSubmit} />;
}
