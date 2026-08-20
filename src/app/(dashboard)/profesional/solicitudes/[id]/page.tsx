"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SolicitudData {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  ciudad: string;
  direccion?: string | null;
  fechaPreferida?: string | null;
  presupuestoMin?: number | null;
  presupuestoMax?: number | null;
  createdAt: string;
  categoria: { nombre: string; slug: string };
  cliente: { nombre: string; apellido: string; ciudad?: string | null };
}

export default function ProfesionalSolicitudDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<SolicitudData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    precio: "",
    duracionEstimada: "",
    fechaInicioEstimada: "",
    comentarios: "",
  });

  useEffect(() => {
    fetch(`/api/solicitudes/${id}`)
      .then((r) => r.json())
      .then(({ data }) => setSolicitud(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmitQuote(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solicitudId: id,
          precio: Number(form.precio),
          duracionEstimada: form.duracionEstimada || undefined,
          fechaInicioEstimada: form.fechaInicioEstimada || undefined,
          comentarios: form.comentarios || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Error al enviar cotización");
        return;
      }
      setShowQuoteForm(false);
      fetch(`/api/solicitudes/${id}`).then((r) => r.json()).then(({ data }) => setSolicitud(data));
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  }

  if (!solicitud) {
    return <div className="text-center py-12"><p className="text-gray-500">Solicitud no encontrada</p></div>;
  }

  const canQuote = solicitud.estado === "recibiendo_cotizaciones";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/profesional/solicitudes" className="text-sm text-blue-600 hover:text-blue-700">&larr; Volver a solicitudes</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{solicitud.titulo}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{solicitud.categoria.nombre}</span>
          <span>{solicitud.ciudad}</span>
          <span>{new Date(solicitud.createdAt).toLocaleDateString("es-DO")}</span>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap mb-4">{solicitud.descripcion}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {solicitud.direccion && (
            <div><span className="text-gray-400">Dirección:</span> <span className="text-gray-700">{solicitud.direccion}</span></div>
          )}
          {solicitud.fechaPreferida && (
            <div><span className="text-gray-400">Fecha preferida:</span> <span className="text-gray-700">{new Date(solicitud.fechaPreferida).toLocaleDateString("es-DO")}</span></div>
          )}
          {solicitud.presupuestoMin && (
            <div><span className="text-gray-400">Presupuesto:</span> <span className="text-gray-700">RD${Number(solicitud.presupuestoMin).toLocaleString()} - RD${Number(solicitud.presupuestoMax || 0).toLocaleString()}</span></div>
          )}
          <div><span className="text-gray-400">Cliente:</span> <span className="text-gray-700">{solicitud.cliente.nombre} {solicitud.cliente.apellido}</span></div>
        </div>
      </div>

      {canQuote && !showQuoteForm && (
        <Button onClick={() => setShowQuoteForm(true)}>Enviar Cotización</Button>
      )}

      {showQuoteForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enviar Cotización</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmitQuote} className="space-y-4">
            <Input label="Precio (RD$) *" name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="2500" required />
            <Input label="Duración estimada" name="duracionEstimada" value={form.duracionEstimada} onChange={handleChange} placeholder="Ej: 2-3 horas" />
            <Input label="Fecha de inicio estimada" name="fechaInicioEstimada" type="date" value={form.fechaInicioEstimada} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comentarios</label>
              <textarea
                name="comentarios"
                value={form.comentarios}
                onChange={handleChange}
                rows={3}
                placeholder="Describe tu propuesta, experiencia relevante..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => setShowQuoteForm(false)}>Cancelar</Button>
              <Button type="submit" isLoading={submitting}>Enviar Cotización</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
