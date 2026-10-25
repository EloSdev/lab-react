import { Link, Outlet } from "@tanstack/react-router";

export function AppLayout() {
  return (
    <main>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <p className="text-2xl font-bold">☕ Tueste</p>
        <nav className="flex gap-4">
          <Link to="/coffees">Catálogo</Link>
          <Link to="/coffees/new">Añadir café</Link>
        </nav>
      </header>
      <Outlet />
    </main>
  );
}
