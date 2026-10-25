import { ErrorMessage } from "../../common/components/error-message";
import { LoadingMessage } from "../../common/components/loading-message";
import { useCoffee } from "../../core/coffees/hooks";
import { CoffeeDetail } from "./coffee-detail.component";

interface CoffeeDetailContainerProps {
  coffeeId: number;
}

export function CoffeeDetailContainer({ coffeeId }: CoffeeDetailContainerProps) {
  const { coffee, loading, error } = useCoffee(coffeeId);

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;
  if (!coffee) return <p>Café no encontrado</p>;

  return <CoffeeDetail coffee={coffee} />;
}
