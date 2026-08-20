import { NextRequest } from "next/server";
import { getSolicitudById, updateSolicitudEstado, cancelSolicitud } from "@/services/solicitud.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const solicitud = await getSolicitudById(id);
    return successResponse(solicitud);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const { id } = await params;
    const body = await request.json();

    if (body.estado === "cancelado") {
      const result = await cancelSolicitud(id, user.userId, user.rol);
      return successResponse(result, "Solicitud cancelada");
    }

    if (body.estado) {
      const result = await updateSolicitudEstado(id, body.estado, user.userId, body.nota);
      return successResponse(result, "Estado actualizado");
    }

    return successResponse(null);
  } catch (error) {
    return errorResponse(error);
  }
}
