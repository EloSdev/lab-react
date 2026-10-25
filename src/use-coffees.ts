import { useEffect, useState } from "react";
import type { Coffee } from "./model";

export function useCoffees() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { coffees, loading, error };
}
