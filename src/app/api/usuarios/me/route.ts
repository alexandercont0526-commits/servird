import { NextRequest } from "next/server";
import { getCurrentUserProfile } from "@/services/auth.service";
import { updateProfile } from "@/services/usuario.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_request: NextRequest) {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return errorResponse(new Error("No autorizado"));
    }

    const user = await getCurrentUserProfile(tokenPayload.userId);

    return successResponse(user);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const tokenPayload = await getCurrentUser();

    if (!tokenPayload) {
      return errorResponse(new Error("No autorizado"));
    }

    const body = await request.json();
    const updatedUser = await updateProfile(tokenPayload.userId, body);
    return successResponse(updatedUser, "Perfil actualizado exitosamente");
  } catch (error) {
    return errorResponse(error);
  }
}
