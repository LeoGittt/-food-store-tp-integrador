import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { queryClient } from "../api/queryClient";

export function Navbar() {
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const cantidadCarrito = useCartStore((state) => state.items.length);
  const navigate = useNavigate();

  async function cerrarSesion() {
    await logout();
    queryClient.clear();
    navigate("/login");
  }

  return (
    <nav className="border-b border-gray-300 px-4 py-3 flex flex-wrap gap-4 items-center">
      <Link to="/" className="font-bold">
        Food Store
      </Link>
      <Link to="/">Catálogo</Link>
      <Link to="/carrito">Carrito ({cantidadCarrito})</Link>
      {usuario && <Link to="/mis-pedidos">Mis pedidos</Link>}
      {usuario?.role === "admin" && (
        <>
          <Link to="/admin/resumen">Resumen</Link>
          <Link to="/admin/categorias">Categorías</Link>
          <Link to="/admin/productos">Productos</Link>
          <Link to="/admin/pedidos">Pedidos</Link>
          <Link to="/admin/usuarios">Usuarios</Link>
        </>
      )}
      <div className="ml-auto flex gap-4 items-center">
        {usuario ? (
          <>
            <span>
              {usuario.full_name} ({usuario.role})
            </span>
            <button onClick={cerrarSesion} className="underline">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
