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
    <div className="min-h-screen bg-surface-dim">
      {/* Header */}
      <div className="bg-white border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Explorar
          </span>
          <h1 className="text-3xl font-bold text-gray-900">
            Categorías de Servicios
          </h1>
          <p className="mt-2 text-gray-500">
            Encuentra el profesional que necesitas
          </p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categorias.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-400 font-medium">No hay categorías disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categorias.map((cat) => (
              <Link
                key={cat.id}
                href={`/categorias/${cat.slug}`}
                className="group bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
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
                    <h3 className="font-bold text-gray-900">
                      {cat.nombre}
                    </h3>
                    {cat.descripcion && (
                      <p className="text-sm text-gray-400 line-clamp-1 mt-0.5">
                        {cat.descripcion}
                      </p>
                    )}
                  </div>
                </div>
                {cat._count?.profCategorias > 0 && (
                  <div className="mt-4 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                    <p className="text-sm text-primary-600 font-medium">
                      {cat._count.profCategorias} profesionales
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
