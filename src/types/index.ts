export type Rol = "client" | "professional" | "admin";

export type EstadoSolicitud =
  | "solicitado"
  | "recibiendo_cotizaciones"
  | "profesional_seleccionado"
  | "programado"
  | "en_proceso"
  | "completado"
  | "cancelado";

export type EstadoCotizacion = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  rol: Rol;
  avatarUrl?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  ciudad?: string | null;
  direccion?: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export interface PerfilProfesional {
  id: string;
  usuarioId: string;
  nombreNegocio?: string | null;
  descripcion?: string | null;
  experienciaAnios?: number | null;
  calificacionPromedio: number;
  totalResenas: number;
  trabajosCompletados: number;
  disponible: boolean;
  verificado: boolean;
  usuario: Usuario;
  categorias?: CategoriaProfesional[];
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  iconoUrl?: string | null;
  descripcion?: string | null;
  categoriaPadreId?: string | null;
  isActive: boolean;
  orden: number;
  subcategorias?: Categoria[];
}

export interface CategoriaProfesional {
  perfilId: string;
  categoriaId: string;
  categoria: Categoria;
}

export interface SolicitudServicio {
  id: string;
  clienteId: string;
  categoriaId: string;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  direccion?: string | null;
  ciudad: string;
  fechaPreferida?: Date | null;
  horaInicio?: Date | null;
  horaFin?: Date | null;
  presupuestoMin?: number | null;
  presupuestoMax?: number | null;
  estado: EstadoSolicitud;
  profesionalId?: string | null;
  createdAt: Date;
  cliente?: Usuario;
  categoria?: Categoria;
  profesional?: PerfilProfesional;
  archivos?: SolicitudArchivo[];
  cotizaciones?: Cotizacion[];
}

export interface SolicitudArchivo {
  id: string;
  solicitudId: string;
  url: string;
  tipo: "image" | "video";
  orden: number;
}

export interface Cotizacion {
  id: string;
  solicitudId: string;
  profesionalId: string;
  precio: number;
  duracionEstimada?: string | null;
  fechaInicioEstimada?: Date | null;
  comentarios?: string | null;
  estado: EstadoCotizacion;
  createdAt: Date;
  profesional?: PerfilProfesional;
}

export interface Resena {
  id: string;
  solicitudId: string;
  autorId: string;
  profesionalId: string;
  calificacion: number;
  comentario?: string | null;
  createdAt: Date;
  autor?: Usuario;
}

export interface Mensaje {
  id: string;
  solicitudId: string;
  emisorId: string;
  contenido: string;
  leido: boolean;
  createdAt: Date;
  emisor?: Usuario;
}

export interface Notificacion {
  id: string;
  usuarioId: string;
  tipo: string;
  titulo: string;
  mensaje?: string | null;
  datos?: Record<string, unknown> | null;
  leido: boolean;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
