import type { Coffee } from "./model";

export async function getCoffees(signal?: AbortSignal): Promise<Coffee[]> {
  const response = await fetch("/coffees.json", { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export async function getCoffee(
  id: number,
  signal?: AbortSignal,
): Promise<Coffee | undefined> {
  const coffees = await getCoffees(signal);
  return coffees.find((coffee) => coffee.id === id);
}
