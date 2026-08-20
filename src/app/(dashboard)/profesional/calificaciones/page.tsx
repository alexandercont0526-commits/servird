"use client";

import { useState, useEffect } from "react";
import StarRating from "@/components/ui/StarRating";
import Avatar from "@/components/ui/Avatar";

interface Resena {
  id: string;
  calificacion: number;
  comentario?: string | null;
  createdAt: string;
  autor: { nombre: string; apellido: string; avatarUrl?: string | null };
  solicitud: { titulo: string; categoria: { nombre: string } };
}

export default function ProfesionalCalificacionesPage() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ promedio: 0, total: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/usuarios/me").then((r) => r.json()),
      fetch("/api/resenas?limit=50").then((r) => r.json()),
    ]).then(([profileRes, resenasRes]) => {
      const perfil = profileRes.data?.perfilProfesional;
      if (perfil) {
        setStats({ promedio: Number(perfil.calificacionPromedio), total: perfil.totalResenas });
      }
      setResenas(resenasRes.data || []);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Calificaciones</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-900">{stats.promedio.toFixed(1)}</p>
            <StarRating rating={stats.promedio} />
            <p className="text-sm text-gray-500 mt-1">{stats.total} reseñas</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : resenas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aún no tienes reseñas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resenas.map((resena) => (
            <div key={resena.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start gap-3">
                <Avatar nombre={resena.autor.nombre} apellido={resena.autor.apellido} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-gray-900">{resena.autor.nombre} {resena.autor.apellido}</p>
                    <StarRating rating={resena.calificacion} size="sm" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    {resena.solicitud.titulo} · {resena.solicitud.categoria.nombre} · {new Date(resena.createdAt).toLocaleDateString("es-DO")}
                  </p>
                  {resena.comentario && (
                    <p className="text-sm text-gray-600">{resena.comentario}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
