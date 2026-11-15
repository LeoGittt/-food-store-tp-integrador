import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
      <footer className="border-t border-gray-300 p-4 text-center text-sm">Leonel González</footer>
    </div>
  );
}
