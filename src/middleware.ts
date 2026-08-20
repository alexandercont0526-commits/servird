import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "servird-jwt-secret-change-in-production-2024"
);

// Rutas que requieren autenticación
const protectedRoutes = ["/cliente", "/profesional", "/admin", "/conversaciones"];

// Rutas por rol
const roleRoutes: Record<string, string[]> = {
  client: ["/cliente"],
  professional: ["/profesional"],
  admin: ["/admin"],
};

// Rutas públicas (no requieren auth)
const publicRoutes = [
  "/",
  "/login",
  "/registro",
  "/recuperar-password",
  "/categorias",
];

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; rol: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return NextResponse.next();
  }

  // Permitir archivos estáticos y API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Verificar token
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    // Si no hay token y la ruta es protegida, redirigir a login
    if (
      protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
      )
    ) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const user = await verifyToken(token);

  if (!user) {
    // Token inválido
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  // Verificar permisos de rol
  const userRoleRoutes = roleRoutes[user.rol] || [];

  if (
    userRoleRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    return NextResponse.next();
  }

  // Admin puede acceder a todas las rutas
  if (user.rol === "admin") {
    return NextResponse.next();
  }

  // Si el usuario está autenticado pero intenta acceder a una ruta de otro rol
  if (
    protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    )
  ) {
    // Redirigir a la ruta correcta según su rol
    const redirectPath =
      user.rol === "professional" ? "/profesional" : "/cliente";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
