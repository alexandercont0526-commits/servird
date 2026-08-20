import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-blue-600 font-bold text-2xl">S</span>
            </div>
            <span className="text-3xl font-bold">ServiRD</span>
          </Link>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Conectamos personas con los mejores profesionales
          </h2>
          <p className="text-blue-100 text-center max-w-md">
            Encuentra servicios de calidad cerca de ti. Electricidad, plomería,
            pintura y mucho más.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-blue-200 text-sm">Profesionales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1,200+</div>
              <div className="text-blue-200 text-sm">Servicios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-blue-200 text-sm">Calificación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
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
