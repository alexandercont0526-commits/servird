"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function RestablecerPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace inválido</h2>
        <p className="text-gray-500 text-sm mb-4">El enlace de recuperación no es válido o ya expiró.</p>
        <Link href="/recuperar-password" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Error al restablecer");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Contraseña actualizada</h2>
        <p className="text-gray-500 text-sm">Serás redirigido al login en unos segundos...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Restablecer contraseña</h2>
      <p className="text-gray-500 text-sm mb-6">Ingresa tu nueva contraseña.</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nueva contraseña" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 8 caracteres" required />
        <Input label="Confirmar contraseña" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repite tu contraseña" required />
        <Button type="submit" isLoading={isLoading} className="w-full">
          Restablecer contraseña
        </Button>
      </form>
    </div>
  );
}

export default function RestablecerPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8">Cargando...</div>}>
      <RestablecerPasswordForm />
    </Suspense>
  );
}
