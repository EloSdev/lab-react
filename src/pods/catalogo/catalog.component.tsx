import { useRef } from "react";
import type { Coffee } from "../../core/coffees/model";
import { CoffeeCard } from "./coffee-card.component";

interface CatalogProps {
  coffees: Coffee[];
  totalCoffees: number;
  bags: number;
  total: number;
  search: string;
  onSearchChange: (search: string) => void;
  onAdd: (coffee: Coffee) => void;
  onEmptyCart: () => void;
}

export function Catalog({
  coffees,
  totalCoffees,
  bags,
  total,
  search,
  onSearchChange,
  onAdd,
  onEmptyCart,
}: CatalogProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-4">
        <h1>Catálogo de cafés</h1>
        <button onClick={() => searchInputRef.current?.focus()}>Buscar</button>
      </header>

      <section className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
        <p aria-live="polite">
          {bags} bolsas · {total.toFixed(2)} €
        </p>
        <button onClick={onEmptyCart} disabled={bags === 0}>
          Vaciar
        </button>
      </section>

      <div className="flex flex-col gap-1">
        <label htmlFor="search">Buscar por nombre</label>
        <input
          ref={searchInputRef}
          id="search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <p>{totalCoffees} cafés este mes</p>
      {coffees.length === 0 ? (
        <p>Sin resultados</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {coffees.map((coffee) => (
            <li key={coffee.id}>
              <CoffeeCard coffee={coffee} onAdd={onAdd} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
