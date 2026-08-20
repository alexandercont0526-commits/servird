import { NextRequest } from "next/server";
import {
  getCategorias,
  createCategoria,
  getAllCategoriasAdmin,
} from "@/services/categoria.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { createCategoriaSchema } from "@/lib/validations";
import { ForbiddenError, ValidationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");

    // Admin view
    if (admin === "true") {
      const user = await getCurrentUser();
      if (!user || user.rol !== "admin") {
        throw new ForbiddenError("Solo administradores");
      }
      const categorias = await getAllCategoriasAdmin();
      return successResponse(categorias);
    }

    // Public view
    const categorias = await getCategorias();
    return successResponse(categorias);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.rol !== "admin") {
      throw new ForbiddenError("Solo los administradores pueden crear categorías");
    }

    const body = await request.json();

    const result = createCategoriaSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      throw new ValidationError("Errores de validación", errors);
    }

    const categoria = await createCategoria(result.data);

    return successResponse(categoria, "Categoría creada exitosamente", 201);
  } catch (error) {
    return errorResponse(error);
  }
}
