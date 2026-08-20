import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError, UnauthorizedError } from "@/lib/errors";
import { verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "servird-jwt-secret-change-in-production-2024"
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) throw new BadRequestError("Token y contraseña requeridos");
    if (password.length < 8) throw new BadRequestError("La contraseña debe tener al menos 8 caracteres");

    let payload: { userId: string; email: string } | null = null;
    try {
      const result = await jwtVerify(token, JWT_SECRET);
      payload = result.payload as unknown as { userId: string; email: string };
    } catch {
      throw new UnauthorizedError("Token inválido o expirado");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.usuario.update({
      where: { id: payload.userId },
      data: { passwordHash },
    });

    return successResponse({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return errorResponse(error);
  }
}
