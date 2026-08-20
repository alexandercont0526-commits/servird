import Link from "next/link";

interface CategoriaCount {
  solicitudes: number;
  profCategorias: number;
}

interface CategoriaData {
  id: string;
  nombre: string;
  slug: string;
  iconoUrl?: string | null;
  descripcion?: string | null;
  _count: CategoriaCount;
}

async function getCategorias(): Promise<CategoriaData[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/categorias`,
    { cache: "no-store" }
  );
  const { data } = await res.json();
  return data || [];
}

export const metadata = {
  title: "Categorías - ServiRD",
  description: "Explora todas las categorías de servicios disponibles en ServiRD",
};

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Categorías de Servicios
          </h1>
          <p className="mt-2 text-gray-600">
            Encuentra el profesional que necesitas
          </p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categorias.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay categorías disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">
                      {cat.iconoUrl ? (
                        <img
                          src={cat.iconoUrl}
                          alt={cat.nombre}
                          className="w-6 h-6"
                        />
                      ) : (
                        "🔧"
                      )}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {cat.nombre}
                    </h3>
                    {cat.descripcion && (
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {cat.descripcion}
                      </p>
                    )}
                  </div>
                </div>
                {cat._count?.profCategorias > 0 && (
                  <p className="mt-4 text-sm text-blue-600">
                    {cat._count.profCategorias} profesionales
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
