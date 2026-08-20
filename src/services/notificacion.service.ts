import prisma from "@/lib/prisma";

export async function getNotificaciones(usuarioId: string, options?: { page?: number; limit?: number; soloNoLeidas?: boolean }) {
  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { usuarioId };
  if (options?.soloNoLeidas) where.leido = false;

  const [notificaciones, total, noLeidas] = await Promise.all([
    prisma.notificacion.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.notificacion.count({ where }),
    prisma.notificacion.count({ where: { usuarioId, leido: false } }),
  ]);

  return { data: notificaciones, total, noLeidas, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function marcarComoLeida(notificacionId: string, usuarioId: string) {
  const notificacion = await prisma.notificacion.findUnique({
    where: { id: notificacionId },
  });
  if (!notificacion || notificacion.usuarioId !== usuarioId) {
    return null;
  }
  return prisma.notificacion.update({
    where: { id: notificacionId },
    data: { leido: true },
  });
}

export async function marcarTodasComoLeidas(usuarioId: string) {
  await prisma.notificacion.updateMany({
    where: { usuarioId, leido: false },
    data: { leido: true },
  });
  return { message: "Notificaciones marcadas como leídas" };
}

export async function crearNotificacion(usuarioId: string, tipo: string, titulo: string, mensaje?: string, datos?: Record<string, string>) {
  return prisma.notificacion.create({
    data: { usuarioId, tipo, titulo, mensaje, datos: datos ?? undefined },
  });
}
