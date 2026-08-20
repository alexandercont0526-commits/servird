import { NextRequest } from "next/server";
import { selectProfesional } from "@/services/solicitud.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const { id } = await params;
    const body = await request.json();

    const result = await selectProfesional(id, body.cotizacionId, user.userId);
    return successResponse(result, "Profesional seleccionado");
  } catch (error) {
    return errorResponse(error);
  }
}
