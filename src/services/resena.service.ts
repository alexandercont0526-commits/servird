import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError, ForbiddenError, ConflictError } from "@/lib/errors";

interface CreateResenaInput {
  solicitudId: string;
  autorId: string;
  calificacion: number;
  comentario?: string;
}

export async function createResena(data: CreateResenaInput) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: data.solicitudId },
    select: { id: true, estado: true, clienteId: true, profesionalId: true },
  });

  if (!solicitud) throw new NotFoundError("Solicitud no encontrada");
  if (solicitud.estado !== "completado") {
    throw new BadRequestError("Solo se puede reseñar solicitudes completadas");
  }
  if (solicitud.clienteId !== data.autorId) {
    throw new ForbiddenError("Solo el cliente puede crear una reseña");
  }
  if (!solicitud.profesionalId) {
    throw new BadRequestError("Esta solicitud no tiene un profesional asignado");
  }

  const existing = await prisma.resena.findUnique({
    where: { solicitudId_autorId: { solicitudId: data.solicitudId, autorId: data.autorId } },
  });
  if (existing) {
    throw new ConflictError("Ya has escrito una reseña para esta solicitud");
  }

  const resena = await prisma.resena.create({
    data: {
      solicitudId: data.solicitudId,
      autorId: data.autorId,
      profesionalId: solicitud.profesionalId,
      calificacion: data.calificacion,
      comentario: data.comentario,
    },
    include: {
      autor: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
    },
  });

  const stats = await prisma.resena.aggregate({
    where: { profesionalId: solicitud.profesionalId },
    _avg: { calificacion: true },
    _count: { calificacion: true },
  });

  await prisma.perfilProfesional.update({
    where: { id: solicitud.profesionalId },
    data: {
      calificacionPromedio: stats._avg.calificacion || 0,
      totalResenas: stats._count.calificacion,
    },
  });

  return resena;
}

export async function getResenasByProfesional(perfilId: string, options?: { page?: number; limit?: number }) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  const [resenas, total] = await Promise.all([
    prisma.resena.findMany({
      where: { profesionalId: perfilId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        autor: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
        solicitud: { select: { titulo: true, categoria: { select: { nombre: true } } } },
      },
    }),
    prisma.resena.count({ where: { profesionalId: perfilId } }),
  ]);

  return { data: resenas, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}
