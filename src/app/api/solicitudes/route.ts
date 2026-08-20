import { NextRequest } from "next/server";
import { createSolicitud, getSolicitudes } from "@/services/solicitud.service";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const estado = searchParams.get("estado") || undefined;
    const categoriaId = searchParams.get("categoriaId") || undefined;
    const ciudad = searchParams.get("ciudad") || undefined;

    let clienteId: string | undefined;
    let profesionalId: string | undefined;

    if (user.rol === "client") {
      clienteId = user.userId;
    } else if (user.rol === "professional") {
      const prismaMod = await import("@/lib/prisma");
      const perfil = await prismaMod.default.perfilProfesional.findUnique({
        where: { usuarioId: user.userId },
        select: { id: true },
      });
      profesionalId = perfil?.id;
    }

    const result = await getSolicitudes({ page, limit, clienteId, profesionalId, estado, categoriaId, ciudad });
    return paginatedResponse(result.data, result.pagination.total, page, limit);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    if (user.rol !== "client") throw new ForbiddenError("Solo clientes pueden crear solicitudes");

    const body = await request.json();
    const solicitud = await createSolicitud({ ...body, clienteId: user.userId });
    return successResponse(solicitud, "Solicitud creada exitosamente", 201);
  } catch (error) {
    return errorResponse(error);
  }
}
