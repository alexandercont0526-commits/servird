import { NextRequest } from "next/server";
import { getProfesionalesCercanos, getPerfilProfesionalById } from "@/services/profesional.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radioKm = parseFloat(searchParams.get("radio_km") || "25");
    const categoriaId = searchParams.get("categoria_id") || undefined;
    const minCalificacion = searchParams.get("min_calificacion")
      ? parseFloat(searchParams.get("min_calificacion")!)
      : undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!lat || !lng) {
      return errorResponse(new Error("Se requieren latitud y longitud"));
    }

    const result = await getProfesionalesCercanos({
      lat,
      lng,
      radioKm,
      categoriaId,
      minCalificacion,
      page,
      limit,
    });

    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
