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
  const savedCoffees = readSavedCoffees();
  // Un café guardado con el mismo id que uno del JSON es una edición: lo sustituye.
  const merged = initialCoffees.map(
    (coffee) => savedCoffees.find((saved) => saved.id === coffee.id) ?? coffee,
  );
  const added = savedCoffees.filter(
    (saved) => !initialCoffees.some((coffee) => coffee.id === saved.id),
  );
  return [...merged, ...added];
}

export async function getCoffee(
  id: number,
  signal?: AbortSignal,
): Promise<Coffee | undefined> {
  const coffees = await getCoffees(signal);
  return coffees.find((coffee) => coffee.id === id);
}

// Sin id crea un café nuevo; con id sustituye al café que ya tiene ese id.
export async function saveCoffee(
  input: CoffeeInput,
  id?: number,
): Promise<Coffee> {
  // Simula la espera de un servidor real.
  await new Promise((resolve) => setTimeout(resolve, 600));
  const coffees = await getCoffees();
  const coffee: Coffee = {
    ...input,
    id: id ?? Math.max(0, ...coffees.map((existing) => existing.id)) + 1,
  };
  const savedCoffees = readSavedCoffees();
  const nextSaved = savedCoffees.some((saved) => saved.id === coffee.id)
    ? savedCoffees.map((saved) => (saved.id === coffee.id ? coffee : saved))
    : [...savedCoffees, coffee];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSaved));
  return coffee;
}
