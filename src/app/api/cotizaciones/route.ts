import { NextRequest } from "next/server";
import { createCotizacion, getCotizacionesByProfesional } from "@/services/cotizacion.service";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    if (user.rol !== "professional") throw new ForbiddenError();

    const prismaMod = await import("@/lib/prisma");
    const perfil = await prismaMod.default.perfilProfesional.findUnique({
      where: { usuarioId: user.userId },
      select: { id: true },
    });
    if (!perfil) throw new ForbiddenError("No tienes perfil profesional");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getCotizacionesByProfesional(perfil.id, { page, limit });
    return paginatedResponse(result.data, result.pagination.total, page, limit);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    if (user.rol !== "professional") throw new ForbiddenError("Solo profesionales pueden enviar cotizaciones");

    const prismaMod = await import("@/lib/prisma");
    const perfil = await prismaMod.default.perfilProfesional.findUnique({
      where: { usuarioId: user.userId },
      select: { id: true },
    });
    if (!perfil) throw new ForbiddenError("No tienes perfil profesional");

    const body = await request.json();
    const cotizacion = await createCotizacion({ ...body, profesionalId: perfil.id });
    return successResponse(cotizacion, "Cotización enviada", 201);
  } catch (error) {
    return errorResponse(error);
  }
}
