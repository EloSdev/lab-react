import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CoffeeForm } from "../../coffee-form";

export const Route = createFileRoute("/coffees/new")({
  component: NewCoffeePage,
});

function NewCoffeePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <h1>Añadir café</h1>
      <CoffeeForm
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
