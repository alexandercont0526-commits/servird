import { NextRequest } from "next/server";
import { getAllUsers } from "@/services/usuario.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.rol !== "admin") {
      throw new ForbiddenError("Solo administradores pueden acceder");
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const rol = searchParams.get("rol") || undefined;

    const result = await getAllUsers({ page, limit, search, rol });
    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
