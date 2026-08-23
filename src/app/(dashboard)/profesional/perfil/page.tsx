"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import FileUpload from "@/components/ui/FileUpload";

interface ProfesionalProfile {
  id?: string;
  profesion?: string;
  nombreNegocio?: string;
  descripcion?: string;
  experienciaAnios?: number;
  disponible: boolean;
  verificado: boolean;
  categorias: Array<{
    categoria: {
      id: string;
      nombre: string;
      slug: string;
    };
  }>;
  usuario: {
    nombre: string;
    apellido: string;
    avatarUrl?: string;
    email: string;
  };
}

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

export default function ProfesionalPerfilPage() {
  const [perfil, setPerfil] = useState<ProfesionalProfile | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    Promise.all([fetchPerfil(), fetchCategorias()]);
  }, []);

  async function fetchPerfil() {
    try {
      const res = await fetch("/api/profesionales/me");
      if (res.ok) {
        const { data } = await res.json();
        setPerfil(data);
        setAvatarUrl(data.usuario?.avatarUrl || null);
        setSelectedCategorias(
          data.categorias.map(
            (c: { categoria: { id: string } }) => c.categoria.id
          )
        );
      } else {
        setIsNew(true);
        setPerfil({
          profesion: "",
          nombreNegocio: "",
          descripcion: "",
          experienciaAnios: 0,
          disponible: true,
          verificado: false,
          categorias: [],
          usuario: { nombre: "", apellido: "", email: "" },
        });
      }
    } catch {
      setIsNew(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCategorias() {
    try {
      const res = await fetch("/api/categorias");
      const { data } = await res.json();
      setCategorias(data || []);
    } catch {
      // Error silencioso
    }
  }

  function toggleCategoria(catId: string) {
    setSelectedCategorias((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const method = isNew ? "POST" : "PATCH";
      const otrosCat = categorias.find((c) => c.slug === "otros");
      const isOtrosSelected = otrosCat && selectedCategorias.includes(otrosCat.id);

      const res = await fetch("/api/profesionales/me", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profesion: perfil?.profesion,
          nombreNegocio: perfil?.nombreNegocio,
          descripcion: perfil?.descripcion,
          experienciaAnios: perfil?.experienciaAnios,
          categorias: selectedCategorias,
          categoriaPersonalizada:
            isOtrosSelected && customCategory ? customCategory : undefined,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: isNew
            ? "Perfil profesional creado exitosamente"
            : "Perfil actualizado exitosamente",
        });
        setIsNew(false);
        setPerfil(result.data);
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

  if (!perfil) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "Crear Perfil Profesional" : "Mi Perfil Profesional"}
        </h1>
        {!isNew && (
          <Badge variant={perfil.disponible ? "success" : "warning"}>
            {perfil.disponible ? "Disponible" : "No disponible"}
          </Badge>
        )}
      </div>

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
        {!isNew && (
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <Avatar
              src={avatarUrl || perfil.usuario.avatarUrl}
              nombre={perfil.usuario.nombre}
              apellido={perfil.usuario.apellido}
              size="xl"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {perfil.usuario.nombre} {perfil.usuario.apellido}
              </p>
              <p className="text-sm text-gray-500">{perfil.usuario.email}</p>
              {perfil.verificado && (
                <Badge variant="success" className="mt-1">
                  Verificado
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Photo upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de perfil
          </label>
          {(avatarUrl || perfil.usuario?.avatarUrl) ? (
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl || perfil.usuario.avatarUrl}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Eliminar foto
              </button>
            </div>
          ) : (
            <FileUpload
              onUpload={setAvatarUrl}
              folder="servird/avatars"
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Profesión *"
            value={perfil.profesion || ""}
            onChange={(e) =>
              setPerfil({ ...perfil, profesion: e.target.value })
            }
            placeholder="Ej: Plomero, Electricista, Pintor..."
          />

          <Input
            label="Nombre del Negocio (opcional)"
            value={perfil.nombreNegocio || ""}
            onChange={(e) =>
              setPerfil({ ...perfil, nombreNegocio: e.target.value })
            }
            placeholder="Ej: Técnico Juan Pérez"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción / Sobre ti *
            </label>
            <textarea
              value={perfil.descripcion || ""}
              onChange={(e) =>
                setPerfil({ ...perfil, descripcion: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe tu experiencia, servicios que ofreces, etc."
              required
            />
          </div>

          <Input
            label="Años de Experiencia"
            type="number"
            min="0"
            max="50"
            value={perfil.experienciaAnios || ""}
            onChange={(e) =>
              setPerfil({
                ...perfil,
                experienciaAnios: parseInt(e.target.value) || 0,
              })
            }
          />

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías de Servicio *
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Selecciona las categorías en las que trabajas
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categorias.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCategorias.includes(cat.id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategorias.includes(cat.id)}
                    onChange={() => toggleCategoria(cat.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{cat.nombre}</span>
                </label>
              ))}
            </div>

            {(() => {
              const otrosCat = categorias.find((c) => c.slug === "otros");
              if (otrosCat && selectedCategorias.includes(otrosCat.id)) {
                return (
                  <div className="mt-3 animate-fade-in">
                    <Input
                      label="¿Qué servicio ofreces? *"
                      placeholder="Ej: Instalación de pisos, Tapicería..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                    />
                  </div>
                );
              }
              return null;
            })()}
            {selectedCategorias.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                Selecciona al menos una categoría
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={selectedCategorias.length === 0}
            >
              {isNew ? "Crear Perfil" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
