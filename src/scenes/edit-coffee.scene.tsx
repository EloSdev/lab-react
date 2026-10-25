import { Link, useNavigate } from "@tanstack/react-router";
import { EditCoffeeContainer } from "../pods/edicion";

interface EditCoffeeSceneProps {
  coffeeId: number;
}

export function EditCoffeeScene({ coffeeId }: EditCoffeeSceneProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <Link
        to="/coffees/$coffeeId"
        params={{ coffeeId: String(coffeeId) }}
        className="inline-block"
      >
        ← Volver al café
      </Link>
      <h1>Editar café</h1>
      <EditCoffeeContainer
        coffeeId={coffeeId}
        onSaved={(coffee) =>
          navigate({
            to: "/coffees/$coffeeId",
            params: { coffeeId: String(coffee.id) },
          })
        }
      />
    </div>
  );
}
