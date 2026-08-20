"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";

interface Profesional {
  id: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    avatarUrl?: string | null;
    ciudad?: string | null;
  };
  nombreNegocio?: string | null;
  calificacionPromedio: number;
  totalResenas: number;
  trabajosCompletados: number;
  verificado: boolean;
  disponible: boolean;
  categorias: Array<{ categoria: { nombre: string } }>;
}

export default function AdminProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfesionales();
  }, []);

  async function fetchProfesionales() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/usuarios?rol=professional&limit=100");
      const { data } = await res.json();
      const users = data.data || [];
      const mapped: Profesional[] = [];
      for (const u of users) {
        if (u.perfilProfesional) {
          mapped.push({
            id: u.perfilProfesional.id,
            usuario: {
              id: u.id,
              nombre: u.nombre,
              apellido: u.apellido,
              email: u.email,
              avatarUrl: u.avatarUrl,
              ciudad: u.ciudad,
            },
            nombreNegocio: u.perfilProfesional.nombreNegocio,
            calificacionPromedio: u.perfilProfesional.calificacionPromedio,
            totalResenas: u.perfilProfesional.totalResenas,
            trabajosCompletados: u.perfilProfesional.trabajosCompletados,
            verificado: u.perfilProfesional.verificado,
            disponible: u.perfilProfesional.disponible,
            categorias: [],
          });
        }
      }
      setProfesionales(mapped);
    } catch {
      console.error("Error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify(perfilId: string) {
    await fetch(`/api/admin/profesionales/${perfilId}`, { method: "PATCH" });
    fetchProfesionales();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profesionales</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesional</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categorías</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trabajos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {profesionales.map((pro) => (
                <tr key={pro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar nombre={pro.usuario.nombre} apellido={pro.usuario.apellido} size="sm" />
                      <div>
                        <div className="font-medium text-gray-900">{pro.usuario.nombre} {pro.usuario.apellido}</div>
                        <div className="text-sm text-gray-500">{pro.usuario.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {pro.categorias?.map((cat, i) => (
                        <Badge key={i} variant="info">{cat.categoria.nombre}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StarRating rating={Number(pro.calificacionPromedio)} size="sm" />
                    <span className="text-xs text-gray-500 ml-1">({pro.totalResenas})</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pro.trabajosCompletados}</td>
                  <td className="px-6 py-4">
                    <Badge variant={pro.verificado ? "success" : "warning"}>
                      {pro.verificado ? "Verificado" : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant={pro.verificado ? "secondary" : "primary"}
                        onClick={() => handleVerify(pro.id)}
                      >
                        {pro.verificado ? "Revocar" : "Verificar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
