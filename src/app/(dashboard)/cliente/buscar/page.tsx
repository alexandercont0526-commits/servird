"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import StarRating from "@/components/ui/StarRating";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

interface Profesional {
  id: string;
  profesion: string | null;
  nombreNegocio: string | null;
  descripcion: string | null;
  calificacionPromedio: number;
  totalResenas: number;
  trabajosCompletados: number;
  verificado: boolean;
  distancia: number | null;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    avatarUrl: string | null;
    ciudad: string | null;
  };
  categorias: {
    categoria: { id: string; nombre: string; slug: string };
  }[];
}

export default function BuscarProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");
  const [locationError, setLocationError] = useState("");

  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetch("/api/categorias")
      .then((r) => r.json())
      .then(({ data }) => setCategorias(data || []))
      .catch(() => {});
  }, []);

  const fetchProfesionales = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      let url: string;

      if (location) {
        const params = new URLSearchParams({
          lat: location.lat.toString(),
          lng: location.lng.toString(),
          limit: "20",
          page: page.toString(),
        });
        if (selectedCategoria) params.set("categoria_id", selectedCategoria);
        url = `/api/profesionales/cercanos?${params}`;
      } else {
        const params = new URLSearchParams({
          limit: "20",
          page: page.toString(),
        });
        if (selectedCategoria) params.set("categoria_id", selectedCategoria);
        if (searchQuery) params.set("q", searchQuery);
        url = `/api/profesionales?${params}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Error al buscar profesionales");
        setProfesionales([]);
        return;
      }

      setProfesionales(json.data.data || []);
      setTotalPages(json.data.pagination?.totalPages || 1);
    } catch {
      setError("Error de conexión");
      setProfesionales([]);
    } finally {
      setIsLoading(false);
    }
  }, [location, selectedCategoria, searchQuery, page]);

  useEffect(() => {
    fetchProfesionales();
  }, [fetchProfesionales]);

  function detectarUbicacion() {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        setPage(1);
      },
      () => {
        setLocationError("No se pudo obtener tu ubicación. Asegúrate de permitir el acceso a la ubicación.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  }

  function limpiarFiltros() {
    setSelectedCategoria("");
    setSearchQuery("");
    setLocation(null);
    setPage(1);
    setLocationError("");
  }

  function formatDistancia(km: number | null): string {
    if (km === null) return "";
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Buscar Profesionales</h1>
        <p className="text-gray-500 mt-1">Encuentra al profesional ideal para lo que necesitas</p>
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Tu ubicación</h3>
            {location ? (
              <p className="text-sm text-green-600 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ubicación detectada — mostrando profesionales cercanos
              </p>
            ) : (
              <p className="text-sm text-gray-500">Detecta tu ubicación para ver profesionales cercanos</p>
            )}
            {locationError && (
              <p className="text-sm text-amber-600 mt-1">{locationError}</p>
            )}
          </div>
          <div className="flex gap-2">
            {location && (
              <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            )}
            <Button
              variant={location ? "outline" : "primary"}
              size="sm"
              onClick={detectarUbicacion}
              isLoading={isLocating}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location ? "Actualizar ubicación" : "Usar mi ubicación"}
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por profesión o nombre..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
          <div className="sm:w-64">
            <select
              value={selectedCategoria}
              onChange={(e) => { setSelectedCategoria(e.target.value); setPage(1); }}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : profesionales.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No se encontraron profesionales</h3>
          <p className="text-gray-500 text-sm mb-4">Intenta con otros filtros o detecta tu ubicación</p>
          <Button variant="outline" onClick={limpiarFiltros}>Limpiar filtros</Button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {profesionales.length} profesional{profesionales.length !== 1 ? "es" : ""} encontrado{profesionales.length !== 1 ? "s" : ""}
            {location && " — ordenados por cercanía"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profesionales.map((pro) => (
              <Link
                key={pro.id}
                href={`/profesionales/${pro.id}`}
                className="group bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <Avatar
                    src={pro.usuario.avatarUrl}
                    nombre={pro.usuario.nombre}
                    apellido={pro.usuario.apellido}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                        {pro.usuario.nombre} {pro.usuario.apellido}
                      </h3>
                      {pro.verificado && (
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    {pro.profesion && (
                      <p className="text-sm font-medium text-primary-600 mb-1">{pro.profesion}</p>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={Number(pro.calificacionPromedio)} size="sm" showValue />
                      <span className="text-xs text-gray-400">({pro.totalResenas})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {pro.usuario.ciudad && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {pro.usuario.ciudad}
                        </span>
                      )}
                      {pro.trabajosCompletados > 0 && (
                        <span>{pro.trabajosCompletados} trabajos</span>
                      )}
                      {pro.distancia !== null && (
                        <span className="font-medium text-primary-600">
                          {formatDistancia(pro.distancia)}
                        </span>
                      )}
                    </div>

                    {pro.categorias.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {pro.categorias.slice(0, 3).map((cp) => (
                          <span
                            key={cp.categoria.id}
                            className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium"
                          >
                            {cp.categoria.nombre}
                          </span>
                        ))}
                        {pro.categorias.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md text-xs">
                            +{pro.categorias.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span className="flex items-center px-3 text-sm text-gray-500">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
