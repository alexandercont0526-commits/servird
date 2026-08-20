import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  type TokenPayload,
} from "@/lib/auth";
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from "@/lib/errors";

interface RegisterInput {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: "client" | "professional";
}

interface LoginInput {
  email: string;
  password: string;
}

export async function register(data: RegisterInput) {
  // Verificar si el email ya existe
  const existingUser = await prisma.usuario.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ConflictError("El email ya está registrado");
  }

  // Hash de la contraseña
  const passwordHash = await bcrypt.hash(data.password, 12);

  // Crear usuario
  const user = await prisma.usuario.create({
    data: {
      email: data.email,
      passwordHash,
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      rol: data.rol,
    },
    select: {
      id: true,
      email: true,
      nombre: true,
      apellido: true,
      rol: true,
      createdAt: true,
    },
  });

  // Generar tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    rol: user.rol,
  };

  const accessToken = await generateAccessToken(tokenPayload);
  const refreshToken = await generateRefreshToken(tokenPayload);

  // Guardar cookies
  await setAuthCookies(accessToken, refreshToken);

  return { user, accessToken };
}

export async function login(data: LoginInput) {
  // Buscar usuario por email
  const user = await prisma.usuario.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      email: true,
      nombre: true,
      apellido: true,
      rol: true,
      passwordHash: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  if (!user.isActive) {
    throw new UnauthorizedError(
      "Tu cuenta ha sido desactivada. Contacta al administrador."
    );
  }

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  // Generar tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    rol: user.rol,
  };

  const accessToken = await generateAccessToken(tokenPayload);
  const refreshToken = await generateRefreshToken(tokenPayload);

  // Guardar cookies
  await setAuthCookies(accessToken, refreshToken);

  // No devolver passwordHash
  const { passwordHash: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken };
}

export async function refresh(refreshTokenValue: string) {
  if (!refreshTokenValue) {
    throw new UnauthorizedError("Refresh token no proporcionado");
  }

  const payload = await verifyRefreshToken(refreshTokenValue);

  if (!payload) {
    throw new UnauthorizedError("Refresh token inválido o expirado");
  }

  // Verificar que el usuario aún existe y está activo
  const user = await prisma.usuario.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      rol: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedError("Usuario no encontrado o desactivado");
  }

  // Generar nuevos tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    rol: user.rol,
  };

  const newAccessToken = await generateAccessToken(tokenPayload);
  const newRefreshToken = await generateRefreshToken(tokenPayload);

  // Guardar cookies
  await setAuthCookies(newAccessToken, newRefreshToken);

  return { accessToken: newAccessToken };
}

export async function logout() {
  await clearAuthCookies();
  return { message: "Sesión cerrada correctamente" };
}

export async function getCurrentUserProfile(userId: string) {
  const user = await prisma.usuario.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nombre: true,
      apellido: true,
      telefono: true,
      rol: true,
      avatarUrl: true,
      latitud: true,
      longitud: true,
      ciudad: true,
      direccion: true,
      isVerified: true,
      createdAt: true,
      perfilProfesional: {
        select: {
          id: true,
          nombreNegocio: true,
          descripcion: true,
          experienciaAnios: true,
          calificacionPromedio: true,
          totalResenas: true,
          trabajosCompletados: true,
          disponible: true,
          verificado: true,
          categorias: {
            select: {
              categoria: {
                select: {
                  id: true,
                  nombre: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return user;
}
