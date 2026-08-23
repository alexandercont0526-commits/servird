import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";

async function getProfesional(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/profesionales/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pro = await getProfesional(id);
  return {
    title: pro
      ? `${pro.usuario.nombre} ${pro.usuario.apellido} - ServiRD`
      : "Profesional - ServiRD",
    description: pro?.descripcion || "Perfil profesional en ServiRD",
  };
}

export default async function ProfesionalPublicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfil = await getProfesional(id);

  if (!perfil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Profesional no encontrado
          </h1>
          <Link
            href="/categorias"
            className="text-blue-600 hover:text-blue-700"
          >
            Ver categorías
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar
              src={perfil.usuario.avatarUrl}
              nombre={perfil.usuario.nombre}
              apellido={perfil.usuario.apellido}
              size="xl"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {perfil.usuario.nombre} {perfil.usuario.apellido}
                </h1>
                {perfil.verificado && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verificado
                  </span>
                )}
              </div>

              {perfil.profesion && (
                <p className="text-sm font-medium text-primary-600 mb-1">
                  {perfil.profesion}
                </p>
              )}

              {perfil.nombreNegocio && (
                <p className="text-lg text-gray-600 mb-2">
                  {perfil.nombreNegocio}
                </p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <StarRating
                  rating={Number(perfil.calificacionPromedio)}
                  showValue
                />
                <span className="text-sm text-gray-500">
                  ({perfil.totalResenas} reseñas)
                </span>
                <span className="text-sm text-gray-500">
                  {perfil.trabajosCompletados} trabajos completados
                </span>
              </div>

              {perfil.usuario.ciudad && (
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {perfil.usuario.ciudad}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {perfil.descripcion && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Sobre mí
                </h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {perfil.descripcion}
                </p>
              </div>
            )}

            {/* Categories */}
            {perfil.categorias && perfil.categorias.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Categorías de servicio
                </h2>
                <div className="flex flex-wrap gap-2">
                  {perfil.categorias.map((cat: Record<string, unknown>) => {
                    const categoria = cat.categoria as Record<string, unknown>;
                    return (
                      <span
                        key={categoria.id as string}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {categoria.nombre as string}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Reseñas
              </h2>
              {perfil.resenasRecibidas &&
              (perfil.resenasRecibidas as Array<Record<string, unknown>>)
                .length > 0 ? (
                <div className="space-y-4">
                  {(
                    perfil.resenasRecibidas as Array<Record<string, unknown>>
                  ).map((resena) => {
                    const autor = resena.autor as Record<string, unknown>;
                    return (
                      <div
                        key={resena.id as string}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar
                            src={autor.avatarUrl as string}
                            nombre={autor.nombre as string}
                            apellido={autor.apellido as string}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {autor.nombre as string}{" "}
                              {autor.apellido as string}
                            </p>
                            <StarRating
                              rating={resena.calificacion as number}
                              size="sm"
                            />
                          </div>
                        </div>
                        {typeof resena.comentario === "string" && resena.comentario.length > 0 && (
                          <p className="text-gray-600 text-sm">
                            {resena.comentario}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aún no tiene reseñas
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Solicitar Servicio
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Publica una solicitud y este profesional podrá enviarte una
                cotización.
              </p>
              <Link
                href="/cliente/solicitudes/nueva"
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Solicitar Servicio
              </Link>
            </div>

            {/* Experience */}
            {perfil.experienciaAnios && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Experiencia
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {perfil.experienciaAnios} años
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
