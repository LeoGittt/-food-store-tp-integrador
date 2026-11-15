import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="text-center py-8">
      <h1 className="text-xl font-bold mb-4">No tenés permiso para ver esta página</h1>
      <Link to="/" className="underline">
        Volver al inicio
      </Link>
    </div>
  );
}
