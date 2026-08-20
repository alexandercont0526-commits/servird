import { NextRequest } from "next/server";
import { sendMessage, getMensajes } from "@/services/mensaje.service";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const { searchParams } = new URL(request.url);
    const solicitudId = searchParams.get("solicitudId");
    if (!solicitudId) {
      return errorResponse({ message: "solicitudId requerido", statusCode: 400 });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const result = await getMensajes(solicitudId, user.userId, { page, limit });
    return paginatedResponse(result.data, result.pagination.total, page, limit);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const body = await request.json();
    const mensaje = await sendMessage({
      solicitudId: body.solicitudId,
      emisorId: user.userId,
      contenido: body.contenido,
    });
    return successResponse(mensaje, "Mensaje enviado", 201);
  } catch (error) {
    return errorResponse(error);
  }
}
