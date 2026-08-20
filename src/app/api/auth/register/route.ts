import { NextRequest } from "next/server";
import { register } from "@/services/auth.service";
import { registerSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path.join(".");
        if (!errors[field]) errors[field] = [];
        errors[field].push(issue.message);
      });
      throw new ValidationError("Errores de validación", errors);
    }

    const { confirmPassword, ...registerData } = result.data;
    const response = await register(registerData);

    return successResponse(response, "Usuario registrado exitosamente", 201);
  } catch (error) {
    return errorResponse(error);
  }
}
