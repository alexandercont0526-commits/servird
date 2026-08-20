import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/lib/auth";
import AppShell from "@/components/layout/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyAccessToken(token);

  if (!payload) {
    redirect("/login");
  }

  // Fetch user data
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/usuarios/me`,
    {
      headers: {
        Cookie: `access_token=${token}`,
      },
    }
  );

  if (!response.ok) {
    redirect("/login");
  }

  const { data: user } = await response.json();

  return <AppShell user={user}>{children}</AppShell>;
}
