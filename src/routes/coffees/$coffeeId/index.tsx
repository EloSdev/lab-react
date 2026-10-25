import { createFileRoute } from "@tanstack/react-router";
import { CoffeeDetailScene } from "../../../scenes/coffee-detail.scene";

export const Route = createFileRoute("/coffees/$coffeeId/")({
  component: CoffeeDetailPage,
});

function CoffeeDetailPage() {
  const { coffeeId } = Route.useParams();
  return <CoffeeDetailScene coffeeId={Number(coffeeId)} />;
}
