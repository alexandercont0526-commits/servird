import { NextRequest } from "next/server";
import { getPerfilProfesionalById } from "@/services/profesional.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const perfil = await getPerfilProfesionalById(id);
    return successResponse(perfil);
  } catch (error) {
    return errorResponse(error);
  }
}
