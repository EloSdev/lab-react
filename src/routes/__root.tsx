import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <p>Página no encontrada</p>,
});

function RootLayout() {
  return (
    <main>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-300 pb-4">
        <p className="text-2xl font-bold">☕ Tueste</p>
        <nav>
          <Link to="/coffees">Catálogo</Link>
        </nav>
      </header>
      <Outlet />
    </main>
  );
}
