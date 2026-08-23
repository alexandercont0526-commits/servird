import Link from "next/link";

const categories = [
  { name: "Electricidad", icon: "⚡", slug: "electricidad", color: "from-amber-400 to-orange-500", bg: "bg-amber-50" },
  { name: "Plomería", icon: "🔧", slug: "plomeria", color: "from-blue-400 to-cyan-500", bg: "bg-blue-50" },
  { name: "Pintura", icon: "🎨", slug: "pintura", color: "from-pink-400 to-rose-500", bg: "bg-pink-50" },
  { name: "Carpintería", icon: "🪚", slug: "carpinteria", color: "from-amber-600 to-yellow-600", bg: "bg-amber-50" },
  { name: "Limpieza", icon: "🧹", slug: "limpieza", color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50" },
  { name: "Mudanzas", icon: "📦", slug: "mudanzas", color: "from-violet-400 to-purple-500", bg: "bg-violet-50" },
  { name: "Cerrajería", icon: "🔐", slug: "cerrajeria", color: "from-slate-500 to-gray-600", bg: "bg-slate-50" },
  { name: "Aire Acondicionado", icon: "❄️", slug: "aire-acondicionado", color: "from-cyan-400 to-blue-500", bg: "bg-cyan-50" },
];

const steps = [
  {
    number: "01",
    title: "Publica tu Solicitud",
    description: "Describe el servicio que necesitas, sube fotos y selecciona tu ubicación.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Recibe Cotizaciones",
    description: "Profesionales cercanos te enviarán sus propuestas con precios y tiempos.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Elige y Comunícate",
    description: "Selecciona al profesional que prefieras y coordina por chat en tiempo real.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-dim">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ServiRD</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/categorias"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
              >
                Categorías
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/60 rounded-xl transition-all duration-200"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="ml-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="hero-gradient min-h-[600px] lg:min-h-[680px] flex items-center relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/80 text-sm font-medium mb-8 animate-fade-in">
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse-soft" />
                La plataforma #1 de servicios en República Dominicana
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up">
                Encuentra los mejores{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                    profesionales
                  </span>
                </span>{" "}
                para tus servicios
              </h1>

              <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-slide-up-delayed leading-relaxed">
                Conectamos personas que necesitan servicios con profesionales
                calificados y verificados. Fácil, rápido y seguro.
              </p>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 mt-8 text-white/50 text-sm animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verificados
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gratis
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Seguro
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 relative">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Servicios
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categorías Populares
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Explora nuestras categorías de servicios más solicitados en todo el país
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, i) => (
              <Link
                key={category.slug}
                href={`/categorias/${category.slug}`}
                className="group bg-white rounded-2xl p-6 text-center shadow-card hover:shadow-elevated border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`w-14 h-14 ${category.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
              Proceso
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              En tres simples pasos obtén el servicio que necesitas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <div key={step.number} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-200 to-transparent" />
                )}
                <div className="relative bg-surface-dim rounded-2xl p-8 text-center group-hover:bg-white group-hover:shadow-card transition-all duration-300 border border-transparent group-hover:border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                    <span className="text-white">{step.icon}</span>
                  </div>
                  <div className="text-xs font-bold text-primary-400 tracking-widest uppercase mb-3">
                    Paso {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2,500+", label: "Profesionales", icon: "👷" },
              { value: "15,000+", label: "Servicios Completados", icon: "✅" },
              { value: "4.8", label: "Calificación Promedio", icon: "⭐" },
              { value: "50+", label: "Ciudades", icon: "🏙️" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-card border border-gray-100 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Eres Profesional?
          </h2>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto text-lg">
            Únete a ServiRD y encuentra clientes cerca de ti. Expande tu negocio
            y aumenta tus ingresos.
          </p>
          <Link
            href="/registro"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-elevated hover:shadow-glow hover:-translate-y-1 text-lg"
          >
            Regístrate Gratis
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-white">ServiRD</span>
              </div>
              <p className="text-sm leading-relaxed">
                Conectamos personas con los mejores profesionales de servicios
                locales en República Dominicana.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm">Servicios</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/categorias" className="hover:text-white transition-colors">
                    Categorías
                  </Link>
                </li>
                <li>
                  <Link href="/registro" className="hover:text-white transition-colors">
                    Ser Profesional
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm">Empresa</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm">
            <p>&copy; 2024 ServiRD. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
