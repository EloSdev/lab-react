import { useEffect, useState } from "react";
import { CoffeeCard } from "./coffee-card";
import type { Coffee } from "./model";

export function App() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Coffee[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCoffees() {
      try {
        const response = await fetch("/coffees.json", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data: Coffee[] = await response.json();
        setCoffees(data);
      } catch {
        if (!controller.signal.aborted) {
          setError("No se han podido cargar los cafés.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCoffees();
    return () => controller.abort();
  }, []);

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
