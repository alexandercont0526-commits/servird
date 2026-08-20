"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    nombre: string;
    apellido: string;
    avatarUrl?: string | null;
    rol: string;
  };
}

export default function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user.rol as "client" | "professional" | "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <TopBar user={user} onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
