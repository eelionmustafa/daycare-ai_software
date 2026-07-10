import { requireUser } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { PortalShell } from "@/components/PortalShell";

export const dynamic = "force-dynamic";

const items = [
  { href: "/admin", label: "Paneli", icon: "📊" },
  { href: "/admin/femijet", label: "Fëmijët", icon: "🧒" },
  { href: "/admin/prezenca", label: "Prezenca", icon: "📅" },
  { href: "/admin/faturat", label: "Faturat", icon: "💳" },
  { href: "/admin/aplikimet", label: "Aplikimet", icon: "📥" },
  { href: "/admin/galeria", label: "Galeria", icon: "🖼️" },
  { href: "/admin/mesazhet", label: "Mesazhet", icon: "✉️" },
  { href: "/admin/cilesimet", label: "Cilësimet", icon: "⚙️" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser("ADMIN");
  return (
    <PortalShell
      items={items}
      userName={user.name}
      roleLabel="Administratë"
      logoutAction={logout}
    >
      {children}
    </PortalShell>
  );
}
