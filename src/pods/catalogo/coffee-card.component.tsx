import { Link } from "@tanstack/react-router";
import type { Coffee } from "../../core/coffees/model";

interface CoffeeCardProps {
  coffee: Coffee;
  onAdd: (coffee: Coffee) => void;
}

export function CoffeeCard({ coffee, onAdd }: CoffeeCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2>
        <Link to="/coffees/$coffeeId" params={{ coffeeId: String(coffee.id) }}>
          {coffee.name}
        </Link>
      </h2>
      <p className="text-slate-600">{coffee.origin}</p>
      <p className="mt-2 font-semibold">{coffee.price.toFixed(2)} €</p>
      <button className="mt-3" onClick={() => onAdd(coffee)}>
        Añadir al carrito
      </button>
    </article>
  );
}
