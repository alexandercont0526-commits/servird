import { NextRequest } from "next/server";
import { verifyProfessional, toggleUserActive } from "@/services/usuario.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.rol !== "admin") {
      throw new ForbiddenError("Solo administradores pueden acceder");
    }

    const { id } = await params;
    const result = await verifyProfessional(id);
    return successResponse(result, "Estado de verificación actualizado");
  } catch (error) {
    return errorResponse(error);
  }
}
