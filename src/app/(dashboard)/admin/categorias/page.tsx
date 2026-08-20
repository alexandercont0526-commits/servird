"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  isActive: boolean;
  orden: number;
  _count: {
    solicitudes: number;
    profCategorias: number;
    subcategorias: number;
  };
}

export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    orden: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      const res = await fetch("/api/categorias?admin=true");
      const { data } = await res.json();
      setCategorias(data || []);
    } catch {
      console.error("Error al cargar categorías");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(cat: Categoria) {
    setEditingId(cat.id);
    setFormData({
      nombre: cat.nombre,
      slug: cat.slug,
      descripcion: cat.descripcion || "",
      orden: cat.orden,
    });
    setShowForm(true);
  }

  function handleNew() {
    setEditingId(null);
    setFormData({ nombre: "", slug: "", descripcion: "", orden: 0 });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `/api/categorias/${editingId}`
        : "/api/categorias";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        fetchCategorias();
      }
    } catch {
      console.error("Error al guardar");
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestionar Categorías
        </h1>
        <Button onClick={handleNew}>Nueva Categoría</Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre: e.target.value,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                required
              />
              <Input
                label="Slug (URL amigable)"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <Input
                label="Orden"
                type="number"
                min="0"
                value={formData.orden}
                onChange={(e) =>
                  setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })
                }
              />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  {editingId ? "Guardar" : "Crear"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Profesionales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categorias.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{cat.nombre}</div>
                  {cat.descripcion && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {cat.descripcion}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {cat._count.profCategorias}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={cat.isActive ? "success" : "warning"}>
                    {cat.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
