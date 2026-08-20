import { NextRequest } from "next/server";
import { getNotificaciones, marcarComoLeida, marcarTodasComoLeidas } from "@/services/notificacion.service";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const soloNoLeidas = searchParams.get("soloNoLeidas") === "true";

    const result = await getNotificaciones(user.userId, { page, limit, soloNoLeidas });
    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const body = await request.json();

    if (body.marcarTodas) {
      await marcarTodasComoLeidas(user.userId);
      return successResponse({ message: "Todas marcadas como leídas" });
    }

    if (body.notificacionId) {
      const result = await marcarComoLeida(body.notificacionId, user.userId);
      return successResponse(result);
    }

    return errorResponse({ message: "Parámetros inválidos", statusCode: 400 });
  } catch (error) {
    return errorResponse(error);
  }
}
