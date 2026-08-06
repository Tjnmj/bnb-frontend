"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/rooms", label: "Rooms" },
  { href: "/payments", label: "Payments" },
  { href: "/users", label: "Users" },
  { href: "/customers", label: "Customers" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 bg-gray-900 text-white p-4">
      <h1 className="text-lg font-bold mb-6">BnB POS</h1>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 text-sm transition-colors ${active ? "bg-blue-600" : "hover:bg-gray-800"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
