import { useRef, useState } from "react";
import { CoffeeCard } from "./coffee-card";
import type { Coffee } from "./model";
import { useCoffees } from "./use-coffees";

export function App() {
  const { coffees, loading, error } = useCoffees();
  const [cart, setCart] = useState<Coffee[]>([]);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const bags = cart.length;
  const total = cart.reduce((sum, coffee) => sum + coffee.price, 0);
  const visibleCoffees = coffees.filter((coffee) =>
    coffee.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function addToCart(coffee: Coffee) {
    setCart((previous) => [...previous, coffee]);
  }

  return (
    <main>
      <header className="flex items-center justify-between gap-4">
        <h1>Tueste · Catálogo de cafés</h1>
        <button onClick={() => searchInputRef.current?.focus()}>Buscar</button>
      </header>

      <section className="flex items-center justify-between gap-4 rounded-lg bg-white p-4 shadow-sm">
        <p aria-live="polite">
          {bags} bolsas · {total.toFixed(2)} €
        </p>
        <button onClick={() => setCart([])} disabled={bags === 0}>
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
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <p>Cargando…</p>
      ) : error ? (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      ) : (
        <>
          <p>{coffees.length} cafés este mes</p>
          {visibleCoffees.length === 0 ? (
            <p>Sin resultados</p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {visibleCoffees.map((coffee) => (
                <li key={coffee.id}>
                  <CoffeeCard coffee={coffee} onAdd={addToCart} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
