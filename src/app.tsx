import { useState } from "react";
import { CoffeeCard } from "./coffee-card";
import type { Coffee } from "./model";

const coffees: Coffee[] = [
  {
    id: 1,
    name: "Etiopía Yirgacheffe",
    origin: "Etiopía",
    roast: "light",
    price: 14.9,
    notes: "Floral, bergamota y té negro.",
  },
  {
    id: 2,
    name: "Colombia Huila",
    origin: "Colombia",
    roast: "medium",
    price: 12.9,
    notes: "Caramelo y manzana roja.",
  },
  {
    id: 3,
    name: "Kenia AA",
    origin: "Kenia",
    roast: "light",
    price: 15.5,
    notes: "Frutos rojos y pomelo.",
  },
  {
    id: 4,
    name: "Brasil Cerrado",
    origin: "Brasil",
    roast: "dark",
    price: 10.5,
    notes: "Chocolate y avellana."
  },
];

export function App() {
  const [cart, setCart] = useState<Coffee[]>([]);
  const [search, setSearch] = useState("");

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
      <h1>Tueste · Catálogo de cafés</h1>
      <p>{coffees.length} cafés este mes</p>

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
          id="search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

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
    </main>
  );
}
