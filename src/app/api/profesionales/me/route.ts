import { NextRequest } from "next/server";
import {
  getMiPerfilProfesional,
  createOrUpdatePerfilProfesional,
  toggleDisponibilidad,
} from "@/services/profesional.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";
import { createProfessionalProfileSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/errors";

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const perfil = await getMiPerfilProfesional(user.userId);
    return successResponse(perfil);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const body = await request.json();

    const result = createProfessionalProfileSchema.safeParse(body);
    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      throw new ValidationError("Errores de validación", errors);
    }

    const perfil = await createOrUpdatePerfilProfesional(user.userId, result.data);
    return successResponse(perfil, "Perfil profesional creado exitosamente", 201);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const body = await request.json();
    const perfil = await createOrUpdatePerfilProfesional(user.userId, body);
    return successResponse(perfil, "Perfil actualizado exitosamente");
  } catch (error) {
    return errorResponse(error);
  }
}
