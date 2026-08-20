import Link from "next/link";

async function getCategoria(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/categorias/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = await getCategoria(slug);
  return {
    title: categoria ? `${categoria.nombre} - ServiRD` : "Categoría - ServiRD",
    description: categoria?.descripcion || "Servicios disponibles",
  };
}

export default async function CategoriaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = await getCategoria(slug);

  if (!categoria) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Categoría no encontrada
          </h1>
          <Link
            href="/categorias"
            className="text-blue-600 hover:text-blue-700"
          >
            Ver todas las categorías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">
              Inicio
            </Link>
            <span>/</span>
            <Link href="/categorias" className="hover:text-gray-700">
              Categorías
            </Link>
            <span>/</span>
            <span className="text-gray-900">{categoria.nombre}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900">
            {categoria.nombre}
          </h1>
          {categoria.descripcion && (
            <p className="mt-2 text-gray-600">{categoria.descripcion}</p>
          )}

          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {(categoria._count as Record<string, number>)?.profCategorias || 0}{" "}
              profesionales disponibles
            </span>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {categoria.subcategorias &&
        (categoria.subcategorias as Array<Record<string, unknown>>).length >
          0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Subcategorías
            </h2>
            <div className="flex flex-wrap gap-2">
              {(categoria.subcategorias as Array<Record<string, unknown>>).map(
                (sub) => (
                  <span
                    key={sub.id as string}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {sub.nombre as string}
                  </span>
                )
              )}
            </div>
          </div>
        )}

      {/* Placeholder for professionals list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Próximamente
          </h3>
          <p className="text-gray-500 mb-4">
            Los profesionales de esta categoría aparecerán aquí
          </p>
          <Link
            href="/cliente/solicitudes/nueva"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Publicar Solicitud
          </Link>
        </div>
      </div>
    </div>
  );
}
