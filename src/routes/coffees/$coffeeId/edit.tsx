import { createFileRoute } from "@tanstack/react-router";
import { EditCoffeeScene } from "../../../scenes/edit-coffee.scene";

export const Route = createFileRoute("/coffees/$coffeeId/edit")({
  component: EditCoffeePage,
});

function EditCoffeePage() {
  const { coffeeId } = Route.useParams();
  return <EditCoffeeScene coffeeId={Number(coffeeId)} />;
}
