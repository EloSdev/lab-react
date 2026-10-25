import { useEffect, useState } from "react";
import { getCoffee, getCoffees } from "./api";
import type { Coffee } from "./model";

export function useCoffees() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCoffees() {
      try {
        setCoffees(await getCoffees(controller.signal));
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

export function useCoffee(id: number) {
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCoffee() {
      setLoading(true);
      setError(null);
      try {
        const found = await getCoffee(id, controller.signal);
        setCoffee(found ?? null);
      } catch {
        if (!controller.signal.aborted) {
          setError("No se ha podido cargar el café.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCoffee();
    return () => controller.abort();
  }, [id]);

  return { coffee, loading, error };
}
