import { NextRequest } from "next/server";
import { updateProfile, toggleUserActive } from "@/services/usuario.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const body = await request.json();
    const updatedUser = await updateProfile(user.userId, body);
    return successResponse(updatedUser, "Perfil actualizado exitosamente");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.rol !== "admin") {
      throw new ForbiddenError("Solo administradores pueden desactivar usuarios");
    }

    const { id } = await params;
    const result = await toggleUserActive(id);
    return successResponse(result, "Estado del usuario actualizado");
  } catch (error) {
    return errorResponse(error);
  }
}
