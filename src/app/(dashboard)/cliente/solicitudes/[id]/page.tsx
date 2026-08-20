"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import Avatar from "@/components/ui/Avatar";

interface CotizacionData {
  id: string;
  precio: number;
  duracionEstimada?: string | null;
  comentarios?: string | null;
  estado: string;
  createdAt: string;
  profesional: {
    id: string;
    nombreNegocio?: string | null;
    calificacionPromedio: number;
    verificado: boolean;
    experienciaAnios?: number | null;
    trabajosCompletados: number;
    usuario: { id: string; nombre: string; apellido: string; avatarUrl?: string | null };
  };
}

interface SolicitudData {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  ciudad: string;
  createdAt: string;
  categoria: { nombre: string };
  cliente: { id: string; nombre: string; apellido: string };
  profesional?: { id: string; nombreNegocio?: string | null; usuario: { nombre: string; apellido: string } } | null;
  cotizaciones: CotizacionData[];
}

export default function ClienteSolicitudDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<SolicitudData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/solicitudes/${id}`)
      .then((r) => r.json())
      .then(({ data }) => setSolicitud(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleSelectProfesional(cotizacionId: string) {
    setSelecting(cotizacionId);
    try {
      const res = await fetch(`/api/solicitudes/${id}/seleccionar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cotizacionId }),
      });
      const data = await res.json();
      if (data.success) {
        setSolicitud((prev) => prev ? { ...prev, estado: "profesional_seleccionado" } : prev);
        fetch(`/api/solicitudes/${id}`).then((r) => r.json()).then(({ data }) => setSolicitud(data));
      }
    } catch {
      console.error("Error al seleccionar");
    } finally {
      setSelecting(null);
    }
  }

  async function handleCancel() {
    if (!confirm("¿Estás seguro de cancelar esta solicitud?")) return;
    try {
      await fetch(`/api/solicitudes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "cancelado" }),
      });
      router.push("/cliente/solicitudes");
    } catch {
      console.error("Error al cancelar");
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  }

  if (!solicitud) {
    return <div className="text-center py-12"><p className="text-gray-500">Solicitud no encontrada</p></div>;
  }

  const canCancel = ["recibiendo_cotizaciones", "profesional_seleccionado", "programado"].includes(solicitud.estado);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/cliente/solicitudes" className="text-sm text-blue-600 hover:text-blue-700">&larr; Volver a mis solicitudes</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{solicitud.titulo}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Badge variant="info">{solicitud.categoria.nombre}</Badge>
              <span>{solicitud.ciudad}</span>
              <span>{new Date(solicitud.createdAt).toLocaleDateString("es-DO")}</span>
            </div>
          </div>
          <Badge variant={
            solicitud.estado === "completado" ? "success" :
            solicitud.estado === "cancelado" ? "danger" :
            solicitud.estado === "en_proceso" ? "info" : "warning"
          }>
            {solicitud.estado.replace(/_/g, " ")}
          </Badge>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{solicitud.descripcion}</p>

        {solicitud.profesional && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm font-medium text-green-800">
              Profesional asignado: {solicitud.profesional.nombreNegocio || `${solicitud.profesional.usuario.nombre} ${solicitud.profesional.usuario.apellido}`}
            </p>
          </div>
        )}

        {canCancel && (
          <div className="mt-4">
            <Button variant="danger" size="sm" onClick={handleCancel}>Cancelar Solicitud</Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Cotizaciones ({solicitud.cotizaciones.length})
        </h2>

        {solicitud.cotizaciones.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aún no hay cotizaciones para esta solicitud</p>
        ) : (
          <div className="space-y-4">
            {solicitud.cotizaciones.map((cot) => (
              <div key={cot.id} className={`border rounded-lg p-5 ${cot.estado === "accepted" ? "border-green-300 bg-green-50" : "border-gray-200"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar nombre={cot.profesional.usuario.nombre} apellido={cot.profesional.usuario.apellido} size="md" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {cot.profesional.nombreNegocio || `${cot.profesional.usuario.nombre} ${cot.profesional.usuario.apellido}`}
                        </p>
                        {cot.profesional.verificado && (
                          <span className="text-green-600 text-xs font-medium">Verificado</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <StarRating rating={Number(cot.profesional.calificacionPromedio)} size="sm" />
                        <span>{cot.profesional.experienciaAnios || 0} años exp.</span>
                        <span>{cot.profesional.trabajosCompletados} trabajos</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">RD${Number(cot.precio).toLocaleString()}</p>
                    {cot.duracionEstimada && <p className="text-xs text-gray-500">{cot.duracionEstimada}</p>}
                  </div>
                </div>

                {cot.comentarios && (
                  <p className="mt-3 text-sm text-gray-600">{cot.comentarios}</p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{new Date(cot.createdAt).toLocaleDateString("es-DO")}</span>
                  {cot.estado === "pending" && solicitud.estado === "recibiendo_cotizaciones" && (
                    <Button size="sm" onClick={() => handleSelectProfesional(cot.id)} isLoading={selecting === cot.id}>
                      Seleccionar
                    </Button>
                  )}
                  {cot.estado === "accepted" && (
                    <Badge variant="success">Seleccionada</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
