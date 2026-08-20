import { NextRequest } from "next/server";
import { createResena, getResenasByProfesional } from "@/services/resena.service";
import { successResponse, errorResponse, paginatedResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profesionalId = searchParams.get("profesionalId");
    if (!profesionalId) {
      return errorResponse({ message: "profesionalId requerido", statusCode: 400 });
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const result = await getResenasByProfesional(profesionalId, { page, limit });
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
    const resena = await createResena({ ...body, autorId: user.userId });
    return successResponse(resena, "Reseña creada", 201);
  } catch (error) {
    return errorResponse(error);
  }
}
