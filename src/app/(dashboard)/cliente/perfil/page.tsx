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
  latitud?: number | null;
  longitud?: number | null;
}

export default function ClientePerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
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
          latitud: user?.latitud,
          longitud: user?.longitud,
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

  function detectarUbicacion() {
    if (!navigator.geolocation) {
      setLocationStatus("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLocating(true);
    setLocationStatus("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                latitud: position.coords.latitude,
                longitud: position.coords.longitude,
              }
            : prev
        );
        setLocationStatus("Ubicación detectada correctamente");
        setIsLocating(false);
      },
      () => {
        setLocationStatus("No se pudo obtener tu ubicación. Verifica los permisos del navegador.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-gray-700">Dirección</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={detectarUbicacion}
                disabled={isLocating}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {isLocating ? "Detectando..." : "Detectar ubicación"}
              </Button>
            </div>
            {locationStatus && (
              <p className={`text-xs mb-2 flex items-center gap-1 ${user.latitud ? "text-green-600" : "text-amber-600"}`}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {locationStatus}
              </p>
            )}
            <Input
              value={user.direccion || ""}
              onChange={(e) => setUser({ ...user, direccion: e.target.value })}
              placeholder="Calle, número, sector"
            />
          </div>

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
