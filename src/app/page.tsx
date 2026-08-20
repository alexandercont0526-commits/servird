import Link from "next/link";

const categories = [
  { name: "Electricidad", icon: "⚡", slug: "electricidad" },
  { name: "Plomería", icon: "🔧", slug: "plomeria" },
  { name: "Pintura", icon: "🎨", slug: "pintura" },
  { name: "Carpintería", icon: "🪚", slug: "carpinteria" },
  { name: "Limpieza", icon: "🧹", slug: "limpieza" },
  { name: "Mudanzas", icon: "📦", slug: "mudanzas" },
  { name: "Cerrajería", icon: "🔐", slug: "cerrajeria" },
  { name: "Aire Acondicionado", icon: "❄️", slug: "aire-acondicionado" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">ServiRD</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/categorias"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Categorías
              </Link>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Encuentra los mejores profesionales para tus servicios
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Conectamos personas que necesitan servicios con profesionales
              calificados y verificados. Fácil, rápido y seguro.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl p-2 shadow-lg max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-4">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  <input
                    type="text"
                    placeholder="¿Qué servicio necesitas?"
                    className="w-full py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-4 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                  <input
                    type="text"
                    placeholder="Tu ubicación"
                    className="w-full py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Categorías Populares
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestras categorías de servicios más solicitados
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categorias/${category.slug}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En tres simples pasos obtén el servicio que necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Publica tu Solicitud
              </h3>
              <p className="text-gray-600">
                Describe el servicio que necesitas, sube fotos y selecciona tu
                ubicación.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Recibe Cotizaciones
              </h3>
              <p className="text-gray-600">
                Profesionales cercanos te enviarán sus propuestas con precios y
                tiempos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Elige y Comunícate
              </h3>
              <p className="text-gray-600">
                Selecciona al profesional que prefieras y coordina por chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Eres Profesional?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a ServiRD y encuentra clientes cerca de ti. Expande tu negocio
            y aumenta tus ingresos.
          </p>
          <Link
            href="/registro"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Regístrate Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold text-white">ServiRD</span>
              </div>
              <p className="text-sm">
                Conectamos personas con los mejores profesionales de servicios
                locales.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/categorias" className="hover:text-white">
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link href="/registro" className="hover:text-white">
                    Ser Profesional
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 ServiRD. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
