"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      rol: "client",
    },
  });

  const selectedRole = watch("rol");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Error al registrar");
        return;
      }

      // Redirect based on role
      const redirectPath =
        data.rol === "professional" ? "/profesional" : "/cliente";
      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Crear Cuenta
      </h1>
      <p className="text-gray-600 mb-8">
        Únete a ServiRD y encuentra los mejores servicios
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cómo quieres usar ServiRD?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedRole === "client"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value="client"
                className="sr-only"
                {...register("rol")}
              />
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900">Cliente</span>
                <p className="text-xs text-gray-500 mt-1">
                  Buscar servicios
                </p>
              </div>
            </label>

            <label
              className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedRole === "professional"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                value="professional"
                className="sr-only"
                {...register("rol")}
              />
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium text-gray-900">Profesional</span>
                <p className="text-xs text-gray-500 mt-1">
                  Ofrecer servicios
                </p>
              </div>
            </label>
          </div>
          {errors.rol && (
            <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            placeholder="Juan"
            error={errors.nombre?.message}
            {...register("nombre")}
          />

          <Input
            label="Apellido"
            placeholder="Pérez"
            error={errors.apellido?.message}
            {...register("apellido")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Teléfono (opcional)"
          type="tel"
          placeholder="809-123-4567"
          error={errors.telefono?.message}
          {...register("telefono")}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          helperText="Mínimo 8 caracteres"
          {...register("password")}
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Crear Cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
}
