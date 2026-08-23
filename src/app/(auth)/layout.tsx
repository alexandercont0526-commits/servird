import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-400/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white w-full">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <span className="text-3xl font-bold">ServiRD</span>
          </Link>
          <h2 className="text-2xl font-semibold text-center mb-4 leading-relaxed">
            Conectamos personas con los mejores profesionales
          </h2>
          <p className="text-white/60 text-center max-w-md leading-relaxed">
            Encuentra servicios de calidad cerca de ti. Electricidad, plomería,
            pintura y mucho más.
          </p>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-white/40 text-sm mt-1">Profesionales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1,200+</div>
              <div className="text-white/40 text-sm mt-1">Servicios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-white/40 text-sm mt-1">Calificación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-surface-dim relative">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">ServiRD</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
