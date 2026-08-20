"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  isActive: boolean;
  isVerified: boolean;
  ciudad?: string;
  createdAt: string;
  perfilProfesional?: {
    id: string;
    calificacionPromedio: number;
    trabajosCompletados: number;
    verificado: boolean;
  };
}

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rolFilter, setRolFilter] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, rolFilter]);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      if (search) params.set("search", search);
      if (rolFilter) params.set("rol", rolFilter);

      const res = await fetch(`/api/admin/usuarios?${params}`);
      const { data } = await res.json();
      setUsers(data.data || []);
      setPagination(data.pagination);
    } catch {
      console.error("Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleActive(userId: string) {
    try {
      await fetch(`/api/usuarios/${userId}`, { method: "DELETE" });
      fetchUsers();
    } catch {
      console.error("Error al cambiar estado");
    }
  }

  async function handleVerifyProfessional(perfilId: string) {
    try {
      await fetch(`/api/admin/profesionales/${perfilId}`, {
        method: "PATCH",
      });
      fetchUsers();
    } catch {
      console.error("Error al verificar");
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Gestionar Usuarios
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={rolFilter}
            onChange={(e) => {
              setRolFilter(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Todos los roles</option>
            <option value="client">Clientes</option>
            <option value="professional">Profesionales</option>
            <option value="admin">Administradores</option>
          </select>
          <Button type="submit" variant="outline">
            Buscar
          </Button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        nombre={user.nombre}
                        apellido={user.apellido}
                        size="sm"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.nombre} {user.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        user.rol === "admin"
                          ? "danger"
                          : user.rol === "professional"
                          ? "info"
                          : "default"
                      }
                    >
                      {user.rol === "client"
                        ? "Cliente"
                        : user.rol === "professional"
                        ? "Profesional"
                        : "Admin"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.isActive ? "success" : "warning"}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("es-DO")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.rol === "professional" &&
                        user.perfilProfesional && (
                          <Button
                            size="sm"
                            variant={
                              user.perfilProfesional.verificado
                                ? "secondary"
                                : "primary"
                            }
                            onClick={() =>
                              handleVerifyProfessional(
                                user.perfilProfesional!.id
                              )
                            }
                          >
                            {user.perfilProfesional.verificado
                              ? "Verificado"
                              : "Verificar"}
                          </Button>
                        )}
                      <Button
                        size="sm"
                        variant={user.isActive ? "danger" : "secondary"}
                        onClick={() => handleToggleActive(user.id)}
                      >
                        {user.isActive ? "Bloquear" : "Activar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
