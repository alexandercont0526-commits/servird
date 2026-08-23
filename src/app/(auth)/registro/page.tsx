"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import FileUpload from "@/components/ui/FileUpload";

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      rol: "client",
    },
  });

  const selectedRole = watch("rol");

  useEffect(() => {
    if (selectedRole === "professional") {
      fetch("/api/categorias")
        .then((res) => res.json())
        .then(({ data }) => setCategorias(data || []))
        .catch(() => {});
    }
  }, [selectedRole]);

  useEffect(() => {
    if (avatarUrl) {
      setValue("avatarUrl", avatarUrl, { shouldValidate: true });
    }
  }, [avatarUrl, setValue]);

  useEffect(() => {
    setValue("categorias", selectedCategorias as RegisterInput["categorias"], {
      shouldValidate: true,
    });
  }, [selectedCategorias, setValue]);

  function toggleCategoria(catId: string) {
    setSelectedCategorias((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  }

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        avatarUrl: avatarUrl || undefined,
        categorias: selectedRole === "professional" ? selectedCategorias : undefined,
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || "Error al registrar");
        return;
      }

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
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Crear Cuenta
      </h1>
      <p className="text-gray-500 mb-8">
        Únete a ServiRD y encuentra los mejores servicios
      </p>

      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ¿Cómo quieres usar ServiRD?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedRole === "client"
                  ? "border-primary-500 bg-primary-50 shadow-soft"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                value="client"
                className="sr-only"
                {...register("rol")}
              />
              <div className="text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  selectedRole === "client"
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 text-sm">Cliente</span>
                <p className="text-xs text-gray-400 mt-1">
                  Buscar servicios
                </p>
              </div>
            </label>

            <label
              className={`flex items-center justify-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedRole === "professional"
                  ? "border-primary-500 bg-primary-50 shadow-soft"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                value="professional"
                className="sr-only"
                {...register("rol")}
              />
              <div className="text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  selectedRole === "professional"
                    ? "bg-primary-100 text-primary-600"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900 text-sm">Profesional</span>
                <p className="text-xs text-gray-400 mt-1">
                  Ofrecer servicios
                </p>
              </div>
            </label>
          </div>
          {errors.rol && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.rol.message}</p>
          )}
        </div>

        {/* Professional-specific fields */}
        {selectedRole === "professional" && (
          <div className="space-y-4 p-4 bg-primary-50/50 border border-primary-100 rounded-xl animate-fade-in">
            <p className="text-sm font-semibold text-primary-700 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Información profesional
            </p>

            <Input
              label="Profesión *"
              placeholder="Ej: Plomero, Electricista, Pintor..."
              error={errors.profesion?.message}
              {...register("profesion")}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción de tus servicios *
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Describe brevemente qué haces, tu experiencia, etc."
              />
              {errors.descripcion && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.descripcion.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de perfil
              </label>
              {avatarUrl ? (
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                  />
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(null)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <FileUpload
                  onUpload={setAvatarUrl}
                  folder="servird/avatars"
                  className="bg-white"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorías de servicio *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Selecciona las categorías en las que trabajas
              </p>
              {categorias.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {categorias.map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors text-sm ${
                        selectedCategorias.includes(cat.id)
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategorias.includes(cat.id)}
                        onChange={() => toggleCategoria(cat.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>{cat.nombre}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Cargando categorías...</p>
              )}
              {errors.categorias && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.categorias.message}</p>
              )}
            </div>
          </div>
        )}

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
          variant="gradient"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          Crear Cuenta
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
}
