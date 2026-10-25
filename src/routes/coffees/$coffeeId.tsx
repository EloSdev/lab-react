import { createFileRoute, Link } from "@tanstack/react-router";
import type { Roast } from "../../model";
import { useCoffee } from "../../use-coffees";

export const Route = createFileRoute("/coffees/$coffeeId")({
  component: CoffeeDetailPage,
});

const roastLabels: Record<Roast, string> = {
  light: "Claro",
  medium: "Medio",
  dark: "Oscuro",
};

function CoffeeDetailPage() {
  const { coffeeId } = Route.useParams();
  const { coffee, loading, error } = useCoffee(Number(coffeeId));

  return (
    <div className="space-y-5">
      <Link to="/coffees">← Volver al catálogo</Link>

      {loading ? (
        <p>Cargando…</p>
      ) : error ? (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      ) : !coffee ? (
        <p>Café no encontrado</p>
      ) : (
        <article className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1>{coffee.name}</h1>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="font-semibold">Origen</dt>
            <dd>{coffee.origin}</dd>
            <dt className="font-semibold">Tueste</dt>
            <dd>{roastLabels[coffee.roast]}</dd>
            <dt className="font-semibold">Precio</dt>
            <dd>{coffee.price.toFixed(2)} €</dd>
            <dt className="font-semibold">Notas de cata</dt>
            <dd>{coffee.notes}</dd>
          </dl>
        </article>
      )}
    </div>
  );
}
