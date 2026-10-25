import type { Coffee, CoffeeInput } from "./model";

const STORAGE_KEY = "tueste-coffees";

function readSavedCoffees(): Coffee[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export async function getCoffees(signal?: AbortSignal): Promise<Coffee[]> {
  const response = await fetch("/coffees.json", { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const initialCoffees: Coffee[] = await response.json();
  return [...initialCoffees, ...readSavedCoffees()];
}

export async function saveCoffee(input: CoffeeInput): Promise<Coffee> {
  // Simula la espera de un servidor real.
  await new Promise((resolve) => setTimeout(resolve, 600));
  const coffees = await getCoffees();
  const nextId = Math.max(0, ...coffees.map((coffee) => coffee.id)) + 1;
  const coffee: Coffee = { ...input, id: nextId };
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...readSavedCoffees(), coffee]),
  );
  return coffee;
}

export async function getCoffee(
  id: number,
  signal?: AbortSignal,
): Promise<Coffee | undefined> {
  const coffees = await getCoffees(signal);
  return coffees.find((coffee) => coffee.id === id);
}
