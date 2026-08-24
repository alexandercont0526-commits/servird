"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export default function NuevaSolicitudPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [form, setForm] = useState({
    categoriaId: "",
    titulo: "",
    descripcion: "",
    ciudad: "",
    direccion: "",
    fechaPreferida: "",
    presupuestoMin: "",
    presupuestoMax: "",
  });

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(({ data }) => setCategorias(data || []));

    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus("Ubicación detectada automáticamente");
          setIsLocating(false);
        },
        () => {
          setLocationStatus("No se pudo detectar ubicación — se usará ubicación por defecto");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const lat = location?.lat ?? 18.4861;
      const lng = location?.lng ?? -69.9312;
      const payload = {
        ...form,
        latitud: lat,
        longitud: lng,
        presupuestoMin: form.presupuestoMin ? Number(form.presupuestoMin) : undefined,
        presupuestoMax: form.presupuestoMax ? Number(form.presupuestoMax) : undefined,
      };
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Error al crear solicitud");
        return;
      }
      router.push(`/cliente/solicitudes/${data.data.id}`);
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Solicitud de Servicio</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
          <select
            name="categoriaId"
            value={form.categoriaId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>

        <Input label="Título *" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ej: Reparación de tubería del baño" required />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            required
            placeholder="Describe tu problema con detalle..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-gray-700">Ubicación del servicio</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!navigator.geolocation) return;
                setIsLocating(true);
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setLocationStatus("Ubicación detectada correctamente");
                    setIsLocating(false);
                  },
                  () => {
                    setLocationStatus("No se pudo detectar ubicación");
                    setIsLocating(false);
                  },
                  { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
                );
              }}
              disabled={isLocating}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {isLocating ? "Detectando..." : "Usar mi ubicación"}
            </Button>
          </div>
          {locationStatus && (
            <p className={`text-xs mb-3 flex items-center gap-1 ${location ? "text-green-600" : "text-amber-600"}`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {locationStatus}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Ciudad *" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Santo Domingo" required />
            <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, número..." />
          </div>
        </div>

        <Input label="Fecha preferida" name="fechaPreferida" type="date" value={form.fechaPreferida} onChange={handleChange} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Presupuesto mínimo (RD$)" name="presupuestoMin" type="number" value={form.presupuestoMin} onChange={handleChange} placeholder="500" />
          <Input label="Presupuesto máximo (RD$)" name="presupuestoMax" type="number" value={form.presupuestoMax} onChange={handleChange} placeholder="5000" />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>Publicar Solicitud</Button>
        </div>
      </form>
    </div>
  );
}
