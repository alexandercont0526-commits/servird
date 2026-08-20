import { NextRequest } from "next/server";
import { login } from "@/services/auth.service";
import { loginSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      throw new ValidationError("Errores de validación", errors);
    }

    const response = await login(result.data);

    return successResponse(response, "Inicio de sesión exitoso");
  } catch (error) {
    return errorResponse(error);
  }
}
