import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError, ConflictError } from "@/lib/errors";

interface CreateCotizacionInput {
  solicitudId: string;
  profesionalId: string;
  precio: number;
  duracionEstimada?: string;
  fechaInicioEstimada?: string;
  comentarios?: string;
}

export async function createCotizacion(data: CreateCotizacionInput) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: data.solicitudId },
    select: { id: true, estado: true, clienteId: true, profesionalId: true },
  });

  if (!solicitud) throw new NotFoundError("Solicitud no encontrada");
  if (solicitud.estado !== "recibiendo_cotizaciones") {
    throw new BadRequestError("Esta solicitud no está recibiendo cotizaciones");
  }

  const existing = await prisma.cotizacion.findUnique({
    where: { solicitudId_profesionalId: { solicitudId: data.solicitudId, profesionalId: data.profesionalId } },
  });
  if (existing) {
    throw new ConflictError("Ya has enviado una cotización para esta solicitud");
  }

  const cotizacion = await prisma.cotizacion.create({
    data: {
      solicitudId: data.solicitudId,
      profesionalId: data.profesionalId,
      precio: data.precio,
      duracionEstimada: data.duracionEstimada,
      fechaInicioEstimada: data.fechaInicioEstimada ? new Date(data.fechaInicioEstimada) : null,
      comentarios: data.comentarios,
    },
    include: {
      profesional: {
        select: {
          id: true,
          nombreNegocio: true,
          calificacionPromedio: true,
          verificado: true,
          usuario: { select: { nombre: true, apellido: true, avatarUrl: true } },
        },
      },
    },
  });

  return cotizacion;
}

export async function getCotizacionesBySolicitud(solicitudId: string) {
  const cotizaciones = await prisma.cotizacion.findMany({
    where: { solicitudId },
    orderBy: { createdAt: "asc" },
    include: {
      profesional: {
        select: {
          id: true,
          nombreNegocio: true,
          descripcion: true,
          calificacionPromedio: true,
          totalResenas: true,
          verificado: true,
          experienciaAnios: true,
          trabajosCompletados: true,
          usuario: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
        },
      },
    },
  });

  return cotizaciones;
}

export async function getCotizacionesByProfesional(perfilId: string, options?: { page?: number; limit?: number }) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  const [cotizaciones, total] = await Promise.all([
    prisma.cotizacion.findMany({
      where: { profesionalId: perfilId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        solicitud: {
          select: {
            id: true,
            titulo: true,
            estado: true,
            ciudad: true,
            presupuestoMin: true,
            presupuestoMax: true,
            categoria: { select: { nombre: true, slug: true } },
            cliente: { select: { nombre: true, apellido: true, avatarUrl: true } },
          },
        },
      },
    }),
    prisma.cotizacion.count({ where: { profesionalId: perfilId } }),
  ]);

  return { data: cotizaciones, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function updateCotizacionEstado(cotizacionId: string, estado: "accepted" | "rejected" | "withdrawn") {
  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id: cotizacionId },
    select: { id: true, solicitudId: true, estado: true },
  });

  if (!cotizacion) throw new NotFoundError("Cotización no encontrada");
  if (cotizacion.estado !== "pending") {
    throw new BadRequestError("Solo se pueden modificar cotizaciones pendientes");
  }

  const updated = await prisma.cotizacion.update({
    where: { id: cotizacionId },
    data: { estado },
  });

  return updated;
}
