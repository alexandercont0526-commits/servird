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
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const lat = 18.4861;
      const lng = -69.9312;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Ciudad *" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Santo Domingo" required />
          <Input label="Dirección" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, número..." />
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
