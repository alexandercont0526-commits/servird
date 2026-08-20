export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "No autorizado") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acceso denegado") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Solicitud inválida") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflicto") {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  public errors: Record<string, string[]>;

  constructor(
    message: string = "Error de validación",
    errors: Record<string, string[]> = {}
  ) {
    super(message, 400);
    this.errors = errors;
  }
}
