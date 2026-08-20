import { NextRequest } from "next/server";
import { getAdminStats } from "@/services/usuario.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.rol !== "admin") {
      throw new ForbiddenError("Solo administradores pueden acceder");
    }

    const stats = await getAdminStats();
    return successResponse(stats);
  } catch (error) {
    return errorResponse(error);
  }
}
