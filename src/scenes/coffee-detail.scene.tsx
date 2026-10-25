import { Link } from "@tanstack/react-router";
import { CoffeeDetailContainer } from "../pods/catalogo";

interface CoffeeDetailSceneProps {
  coffeeId: number;
}

export function CoffeeDetailScene({ coffeeId }: CoffeeDetailSceneProps) {
  return (
    <div className="space-y-5">
      <Link to="/coffees" className="inline-block">
        ← Volver al catálogo
      </Link>
      <CoffeeDetailContainer coffeeId={coffeeId} />
    </div>
  );
}
