import prisma from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export async function updateProfile(
  usuarioId: string,
  data: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    avatarUrl?: string;
    latitud?: number;
    longitud?: number;
    ciudad?: string;
    direccion?: string;
  }
) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
  });

  if (!usuario) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return prisma.usuario.update({
    where: { id: usuarioId },
    data,
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
      createdAt: true,
    },
  });
}

// Admin functions
export async function getAllUsers({
  page = 1,
  limit = 20,
  search,
  rol,
}: {
  page?: number;
  limit?: number;
  search?: string;
  rol?: string;
}) {
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: "insensitive" } },
      { apellido: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (rol) {
    where.rol = rol;
  }

  const [users, total] = await Promise.all([
    prisma.usuario.findMany({
      where,
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        telefono: true,
        rol: true,
        avatarUrl: true,
        isActive: true,
        isVerified: true,
        ciudad: true,
        createdAt: true,
        perfilProfesional: {
          select: {
            id: true,
            calificacionPromedio: true,
            trabajosCompletados: true,
            verificado: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.usuario.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function toggleUserActive(userId: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: userId },
    select: { id: true, isActive: true },
  });

  if (!usuario) {
    throw new NotFoundError("Usuario no encontrado");
  }

  return prisma.usuario.update({
    where: { id: userId },
    data: { isActive: !usuario.isActive },
    select: {
      id: true,
      email: true,
      nombre: true,
      apellido: true,
      isActive: true,
    },
  });
}

export async function verifyProfessional(perfilId: string) {
  const perfil = await prisma.perfilProfesional.findUnique({
    where: { id: perfilId },
    select: { id: true, verificado: true },
  });

  if (!perfil) {
    throw new NotFoundError("Perfil profesional no encontrado");
  }

  return prisma.perfilProfesional.update({
    where: { id: perfilId },
    data: { verificado: !perfil.verificado },
    select: {
      id: true,
      verificado: true,
    },
  });
}

export async function getAdminStats() {
  const [
    totalUsuarios,
    totalProfesionales,
    totalSolicitudes,
    solicitudesCompletadas,
    totalCotizaciones,
    totalResenas,
  ] = await Promise.all([
    prisma.usuario.count(),
    prisma.perfilProfesional.count(),
    prisma.solicitudServicio.count(),
    prisma.solicitudServicio.count({ where: { estado: "completado" } }),
    prisma.cotizacion.count(),
    prisma.resena.count(),
  ]);

  return {
    totalUsuarios,
    totalProfesionales,
    totalSolicitudes,
    solicitudesCompletadas,
    totalCotizaciones,
    totalResenas,
  };
}
