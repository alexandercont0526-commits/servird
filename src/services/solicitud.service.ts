import prisma from "@/lib/prisma";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/lib/errors";
import type { EstadoSolicitud } from "@/types";

interface CreateSolicitudInput {
  clienteId: string;
  categoriaId: string;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  direccion?: string;
  ciudad: string;
  fechaPreferida?: string;
  horaInicio?: string;
  horaFin?: string;
  presupuestoMin?: number;
  presupuestoMax?: number;
}

interface ListSolicitudesOptions {
  page?: number;
  limit?: number;
  clienteId?: string;
  profesionalId?: string;
  estado?: string;
  categoriaId?: string;
  ciudad?: string;
}

export async function createSolicitud(data: CreateSolicitudInput) {
  const categoria = await prisma.categoria.findUnique({
    where: { id: data.categoriaId },
  });
  if (!categoria) {
    throw new NotFoundError("Categoría no encontrada");
  }

  if (data.presupuestoMin && data.presupuestoMax && data.presupuestoMin > data.presupuestoMax) {
    throw new BadRequestError("El presupuesto mínimo no puede ser mayor al máximo");
  }

  const solicitud = await prisma.solicitudServicio.create({
    data: {
      clienteId: data.clienteId,
      categoriaId: data.categoriaId,
      titulo: data.titulo,
      descripcion: data.descripcion,
      latitud: data.latitud,
      longitud: data.longitud,
      direccion: data.direccion,
      ciudad: data.ciudad,
      fechaPreferida: data.fechaPreferida ? new Date(data.fechaPreferida) : null,
      horaInicio: data.horaInicio ? new Date(data.horaInicio) : null,
      horaFin: data.horaFin ? new Date(data.horaFin) : null,
      presupuestoMin: data.presupuestoMin,
      presupuestoMax: data.presupuestoMax,
      estado: "recibiendo_cotizaciones",
      historialEstados: {
        create: {
          estadoAnterior: "solicitado",
          estadoNuevo: "recibiendo_cotizaciones",
          nota: "Solicitud creada y abierta a cotizaciones",
        },
      },
    },
    include: {
      categoria: true,
      cliente: { select: { id: true, nombre: true, apellido: true, avatarUrl: true, ciudad: true } },
    },
  });

  return solicitud;
}

export async function getSolicitudes(options: ListSolicitudesOptions) {
  const { page = 1, limit = 20, clienteId, profesionalId, estado, categoriaId, ciudad } = options;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (clienteId) where.clienteId = clienteId;
  if (categoriaId) where.categoriaId = categoriaId;
  if (ciudad) where.ciudad = ciudad;
  if (estado) where.estado = estado;

  if (profesionalId) {
    where.OR = [
      { profesionalId },
      {
        estado: "recibiendo_cotizaciones",
        cotizaciones: { none: { profesionalId } },
      },
    ];
  }

  const [solicitudes, total] = await Promise.all([
    prisma.solicitudServicio.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        categoria: { select: { id: true, nombre: true, slug: true } },
        cliente: { select: { id: true, nombre: true, apellido: true, avatarUrl: true, ciudad: true } },
        profesional: {
          select: {
            id: true,
            nombreNegocio: true,
            calificacionPromedio: true,
            verificado: true,
            usuario: { select: { nombre: true, apellido: true } },
          },
        },
        _count: { select: { cotizaciones: true } },
      },
    }),
    prisma.solicitudServicio.count({ where }),
  ]);

  return { data: solicitudes, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

export async function getSolicitudById(id: string) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id },
    include: {
      categoria: { select: { id: true, nombre: true, slug: true } },
      cliente: { select: { id: true, nombre: true, apellido: true, avatarUrl: true, ciudad: true, telefono: true } },
      profesional: {
        select: {
          id: true,
          nombreNegocio: true,
          descripcion: true,
          calificacionPromedio: true,
          verificado: true,
          experienciaAnios: true,
          trabajosCompletados: true,
          usuario: { select: { id: true, nombre: true, apellido: true, avatarUrl: true, telefono: true } },
        },
      },
      cotizaciones: {
        include: {
          profesional: {
            select: {
              id: true,
              nombreNegocio: true,
              calificacionPromedio: true,
              totalResenas: true,
              verificado: true,
              experienciaAnios: true,
              trabajosCompletados: true,
              usuario: { select: { id: true, nombre: true, apellido: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      historialEstados: {
        orderBy: { createdAt: "desc" },
        include: { usuario: { select: { nombre: true, apellido: true } } },
      },
      archivos: { orderBy: { orden: "asc" } },
    },
  });

  if (!solicitud) {
    throw new NotFoundError("Solicitud no encontrada");
  }

  return solicitud;
}

export async function updateSolicitudEstado(
  id: string,
  nuevoEstado: EstadoSolicitud,
  usuarioId: string,
  nota?: string
) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id },
    select: { id: true, estado: true, clienteId: true, profesionalId: true },
  });

  if (!solicitud) {
    throw new NotFoundError("Solicitud no encontrada");
  }

  const validTransitions: Record<string, string[]> = {
    recibiendo_cotizaciones: ["profesional_seleccionado", "cancelado"],
    profesional_seleccionado: ["programado", "cancelado"],
    programado: ["en_proceso", "cancelado"],
    en_proceso: ["completado", "cancelado"],
  };

  if (!validTransitions[solicitud.estado]?.includes(nuevoEstado)) {
    throw new BadRequestError(`No se puede cambiar de "${solicitud.estado}" a "${nuevoEstado}"`);
  }

  const updated = await prisma.solicitudServicio.update({
    where: { id },
    data: {
      estado: nuevoEstado,
      historialEstados: {
        create: {
          estadoAnterior: solicitud.estado,
          estadoNuevo: nuevoEstado,
          cambiadoPor: usuarioId,
          nota,
        },
      },
    },
    include: {
      categoria: { select: { nombre: true } },
      cliente: { select: { nombre: true, apellido: true } },
    },
  });

  return updated;
}

export async function selectProfesional(solicitudId: string, cotizacionId: string, clienteId: string) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    select: { id: true, clienteId: true, estado: true },
  });

  if (!solicitud) throw new NotFoundError("Solicitud no encontrada");
  if (solicitud.clienteId !== clienteId) throw new ForbiddenError("Solo el cliente puede seleccionar un profesional");
  if (solicitud.estado !== "recibiendo_cotizaciones") {
    throw new BadRequestError("Esta solicitud no está recibiendo cotizaciones");
  }

  const cotizacion = await prisma.cotizacion.findUnique({
    where: { id: cotizacionId },
    select: { id: true, solicitudId: true, profesionalId: true },
  });

  if (!cotizacion || cotizacion.solicitudId !== solicitudId) {
    throw new NotFoundError("Cotización no encontrada para esta solicitud");
  }

  const [updated] = await prisma.$transaction([
    prisma.solicitudServicio.update({
      where: { id: solicitudId },
      data: {
        estado: "profesional_seleccionado",
        profesionalId: cotizacion.profesionalId,
        historialEstados: {
          create: {
            estadoAnterior: "recibiendo_cotizaciones",
            estadoNuevo: "profesional_seleccionado",
            cambiadoPor: clienteId,
            nota: "Profesional seleccionado",
          },
        },
      },
    }),
    prisma.cotizacion.updateMany({
      where: { solicitudId, id: { not: cotizacionId } },
      data: { estado: "rejected" },
    }),
    prisma.cotizacion.update({
      where: { id: cotizacionId },
      data: { estado: "accepted" },
    }),
  ]);

  return updated;
}

export async function cancelSolicitud(id: string, usuarioId: string, rol: string) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id },
    select: { id: true, clienteId: true, estado: true },
  });

  if (!solicitud) throw new NotFoundError("Solicitud no encontrada");
  if (rol !== "admin" && solicitud.clienteId !== usuarioId) {
    throw new ForbiddenError("No tienes permiso para cancelar esta solicitud");
  }

  const updated = await prisma.solicitudServicio.update({
    where: { id },
    data: {
      estado: "cancelado",
      historialEstados: {
        create: {
          estadoAnterior: solicitud.estado,
          estadoNuevo: "cancelado",
          cambiadoPor: usuarioId,
          nota: "Solicitud cancelada",
        },
      },
    },
  });

  return updated;
}
