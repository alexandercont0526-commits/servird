import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "servird-jwt-secret-change-in-production-2024"
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) throw new BadRequestError("Email requerido");

    const user = await prisma.usuario.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return successResponse({ message: "Si el email existe, se enviarán instrucciones" });
    }

    const resetToken = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/restablecer-password?token=${resetToken}`;

    console.log(`[Password Reset] URL: ${resetUrl}`);

    return successResponse({ message: "Si el email existe, se enviarán instrucciones" });
  } catch (error) {
    return errorResponse(error);
  }
}
