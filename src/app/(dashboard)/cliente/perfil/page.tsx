"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";

interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  avatarUrl?: string;
  ciudad?: string;
  direccion?: string;
}

export default function ClientePerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch("/api/usuarios/me");
      const { data } = await res.json();
      setUser(data);
    } catch {
      setMessage({ type: "error", text: "Error al cargar perfil" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/usuarios/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: user?.nombre,
          apellido: user?.apellido,
          telefono: user?.telefono,
          ciudad: user?.ciudad,
          direccion: user?.direccion,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage({ type: "success", text: "Perfil actualizado exitosamente" });
      } else {
        setMessage({ type: "error", text: result.error || "Error al guardar" });
      }
    } catch {
      setMessage({ type: "error", text: "Error al conectar con el servidor" });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Error al cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <Avatar
            src={user.avatarUrl}
            nombre={user.nombre}
            apellido={user.apellido}
            size="xl"
          />
          <div>
            <p className="font-medium text-gray-900">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={user.nombre}
              onChange={(e) => setUser({ ...user, nombre: e.target.value })}
            />
            <Input
              label="Apellido"
              value={user.apellido}
              onChange={(e) => setUser({ ...user, apellido: e.target.value })}
            />
          </div>

          <Input
            label="Teléfono"
            value={user.telefono || ""}
            onChange={(e) => setUser({ ...user, telefono: e.target.value })}
            placeholder="809-123-4567"
          />

          <Input
            label="Ciudad"
            value={user.ciudad || ""}
            onChange={(e) => setUser({ ...user, ciudad: e.target.value })}
            placeholder="Santo Domingo"
          />

          <Input
            label="Dirección"
            value={user.direccion || ""}
            onChange={(e) => setUser({ ...user, direccion: e.target.value })}
            placeholder="Calle, número, sector"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
