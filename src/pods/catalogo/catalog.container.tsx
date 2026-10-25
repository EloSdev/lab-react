import { useState } from "react";
import { ErrorMessage } from "../../common/components/error-message";
import { LoadingMessage } from "../../common/components/loading-message";
import { useCoffees } from "../../core/coffees/hooks";
import type { Coffee } from "../../core/coffees/model";
import { Catalog } from "./catalog.component";

export function CatalogContainer() {
  const { coffees, loading, error } = useCoffees();
  const [cart, setCart] = useState<Coffee[]>([]);
  const [search, setSearch] = useState("");

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage message={error} />;

  const total = cart.reduce((sum, coffee) => sum + coffee.price, 0);
  const visibleCoffees = coffees.filter((coffee) =>
    coffee.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function addToCart(coffee: Coffee) {
    setCart((previous) => [...previous, coffee]);
  }

  return (
    <Catalog
      coffees={visibleCoffees}
      totalCoffees={coffees.length}
      bags={cart.length}
      total={total}
      search={search}
      onSearchChange={setSearch}
      onAdd={addToCart}
      onEmptyCart={() => setCart([])}
    />
  );
}
