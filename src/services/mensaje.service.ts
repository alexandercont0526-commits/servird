import prisma from "@/lib/prisma";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/lib/errors";

interface SendMessageInput {
  solicitudId: string;
  emisorId: string;
  contenido: string;
}

export async function sendMessage(data: SendMessageInput) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: data.solicitudId },
    select: { id: true, clienteId: true, profesionalId: true },
  });

  if (!solicitud) throw new NotFoundError("Solicitud no encontrada");

  let puedeEnviar = false;
  if (solicitud.clienteId === data.emisorId) puedeEnviar = true;
  if (solicitud.profesionalId) {
    const perfil = await prisma.perfilProfesional.findUnique({
      where: { id: solicitud.profesionalId },
      select: { usuarioId: true },
    });
    if (perfil?.usuarioId === data.emisorId) puedeEnviar = true;
  }

  if (!puedeEnviar) throw new ForbiddenError("No tienes acceso a esta conversación");

  const mensaje = await prisma.mensaje.create({
    data: {
      solicitudId: data.solicitudId,
      emisorId: data.emisorId,
      contenido: data.contenido.trim(),
    },
    include: {
      emisor: {
        select: { id: true, nombre: true, apellido: true, avatarUrl: true },
      },
    },
  });

  return mensaje;
}

export async function getMensajes(solicitudId: string, usuarioId: string, options?: { page?: number; limit?: number }) {
  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const skip = (page - 1) * limit;

  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    select: { id: true, clienteId: true, profesionalId: true },
  });

  if (!solicitud) throw new NotFoundError("Solicitud no encontrada");

  let tieneAcceso = false;
  if (solicitud.clienteId === usuarioId) tieneAcceso = true;
  if (solicitud.profesionalId) {
    const perfil = await prisma.perfilProfesional.findUnique({
      where: { id: solicitud.profesionalId },
      select: { usuarioId: true },
    });
    if (perfil?.usuarioId === usuarioId) tieneAcceso = true;
  }

  if (!tieneAcceso) throw new ForbiddenError("No tienes acceso");

  const [mensajes, total] = await Promise.all([
    prisma.mensaje.findMany({
      where: { solicitudId },
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
      include: {
        emisor: {
          select: { id: true, nombre: true, apellido: true, avatarUrl: true },
        },
      },
    }),
    prisma.mensaje.count({ where: { solicitudId } }),
  ]);

  return { data: mensajes, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getConversaciones(usuarioId: string) {
  const solicitudesCliente = await prisma.solicitudServicio.findMany({
    where: { clienteId: usuarioId },
    select: {
      id: true,
      titulo: true,
      estado: true,
      cliente: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
      profesional: {
        select: {
          id: true,
          usuario: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
        },
      },
      mensajes: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { emisor: { select: { nombre: true, apellido: true } } },
      },
      _count: { select: { mensajes: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const perfilesProfesionales = await prisma.perfilProfesional.findMany({
    where: { usuarioId },
    select: { id: true },
  });

  const perfilIds = perfilesProfesionales.map((p) => p.id);

  const solicitudesProfesional = await prisma.solicitudServicio.findMany({
    where: { profesionalId: { in: perfilIds } },
    select: {
      id: true,
      titulo: true,
      estado: true,
      cliente: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
      profesional: {
        select: {
          id: true,
          usuario: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
        },
      },
      mensajes: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { emisor: { select: { nombre: true, apellido: true } } },
      },
      _count: { select: { mensajes: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const allIds = new Set<string>();
  const conversaciones: Array<{
    solicitudId: string;
    titulo: string;
    estado: string;
    otroUsuario: { id: string; nombre: string; apellido: string; avatarUrl?: string | null } | null;
    ultimoMensaje: string | null;
    totalMensajes: number;
  }> = [];

  for (const sol of [...solicitudesCliente, ...solicitudesProfesional]) {
    if (allIds.has(sol.id)) continue;
    allIds.add(sol.id);

    const esCliente = sol.cliente.id === usuarioId;
    const otroUsuario = esCliente
      ? sol.profesional?.usuario || null
      : sol.cliente;

    conversaciones.push({
      solicitudId: sol.id,
      titulo: sol.titulo,
      estado: sol.estado,
      otroUsuario,
      ultimoMensaje: sol.mensajes[0]?.contenido || null,
      totalMensajes: sol._count.mensajes,
    });
  }

  conversaciones.sort((a, b) => {
    if (!a.ultimoMensaje) return 1;
    if (!b.ultimoMensaje) return -1;
    return 0;
  });

  return conversaciones;
}

export async function marcarMensajesLeidos(solicitudId: string, usuarioId: string) {
  await prisma.mensaje.updateMany({
    where: {
      solicitudId,
      emisorId: { not: usuarioId },
      leido: false,
    },
    data: { leido: true },
  });
  return { success: true };
}
