import { z } from "zod";

// ==================== AUTH ====================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .max(100, "Máximo 100 caracteres"),
    apellido: z
      .string()
      .min(1, "El apellido es requerido")
      .max(100, "Máximo 100 caracteres"),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Email inválido"),
    telefono: z.string().optional(),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    rol: z.enum(["client", "professional"], { message: "Selecciona un tipo de cuenta" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// ==================== USUARIO ====================

export const updateProfileSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres")
    .optional(),
  apellido: z
    .string()
    .min(1, "El apellido es requerido")
    .max(100, "Máximo 100 caracteres")
    .optional(),
  telefono: z.string().max(20, "Máximo 20 caracteres").optional(),
  avatarUrl: z.string().url("URL inválida").optional().nullable(),
  latitud: z.number().min(-90).max(90).optional().nullable(),
  longitud: z.number().min(-180).max(180).optional().nullable(),
  ciudad: z.string().max(100).optional().nullable(),
  direccion: z.string().max(300).optional().nullable(),
});

// ==================== PERFIL PROFESIONAL ====================

export const createProfessionalProfileSchema = z.object({
  nombreNegocio: z.string().max(150, "Máximo 150 caracteres").optional(),
  descripcion: z
    .string()
    .min(10, "Describe tu experiencia (mínimo 10 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
  experienciaAnios: z
    .number()
    .int()
    .min(0, "No puede ser negativo")
    .max(50, "Máximo 50 años")
    .optional(),
  categorias: z
    .array(z.string().uuid())
    .min(1, "Selecciona al menos una categoría"),
});

// ==================== SOLICITUD ====================

export const createSolicitudSchema = z.object({
  categoriaId: z.string().uuid("Selecciona una categoría"),
  titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(200, "Máximo 200 caracteres"),
  descripcion: z
    .string()
    .min(10, "Describe tu problema (mínimo 10 caracteres)")
    .max(2000, "Máximo 2000 caracteres"),
  latitud: z.number().min(-90).max(90),
  longitud: z.number().min(-180).max(180),
  direccion: z.string().max(300).optional(),
  ciudad: z.string().min(1, "La ciudad es requerida").max(100),
  fechaPreferida: z.string().optional(),
  horaInicio: z.string().optional(),
  horaFin: z.string().optional(),
  presupuestoMin: z.number().positive().optional(),
  presupuestoMax: z.number().positive().optional(),
});

// ==================== COTIZACION ====================

export const createCotizacionSchema = z.object({
  precio: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .max(999999.99, "Precio demasiado alto"),
  duracionEstimada: z.string().max(50).optional(),
  fechaInicioEstimada: z.string().optional(),
  comentarios: z.string().max(2000).optional(),
});

// ==================== RESEÑA ====================

export const createResenaSchema = z.object({
  calificacion: z
    .number()
    .int()
    .min(1, "Mínimo 1 estrella")
    .max(5, "Máximo 5 estrellas"),
  comentario: z.string().max(2000, "Máximo 2000 caracteres").optional(),
});

// ==================== CATEGORIA ====================

export const createCategoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(100, "Máximo 100 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  iconoUrl: z.string().url("URL inválida").optional().nullable(),
  descripcion: z.string().max(500).optional(),
  categoriaPadreId: z.string().uuid().optional().nullable(),
  orden: z.number().int().min(0).optional(),
});

// ==================== TYPES ====================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateProfessionalProfileInput = z.infer<
  typeof createProfessionalProfileSchema
>;
export type CreateSolicitudInput = z.infer<typeof createSolicitudSchema>;
export type CreateCotizacionInput = z.infer<typeof createCotizacionSchema>;
export type CreateResenaInput = z.infer<typeof createResenaSchema>;
export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
