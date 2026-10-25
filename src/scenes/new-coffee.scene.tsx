import { useNavigate } from "@tanstack/react-router";
import { NewCoffeeContainer } from "../pods/edicion";

export function NewCoffeeScene() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <h1>Añadir café</h1>
      <NewCoffeeContainer
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
