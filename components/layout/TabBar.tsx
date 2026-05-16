"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardCheck, BookOpen, User } from "lucide-react";

const TABS = [
  { href: "/", icon: LayoutDashboard, label: "工作台" },
  { href: "/verification", icon: ClipboardCheck, label: "核验" },
  { href: "/training", icon: BookOpen, label: "培训" },
  { href: "/profile", icon: User, label: "我" },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#fff", borderTop: "1px solid #ebeef2",
      display: "flex", height: 60, zIndex: 100,
      boxShadow: "0 -2px 12px rgba(10,69,149,0.06)",
    }}>
      {TABS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 2, textDecoration: "none",
              color: active ? "#1677ff" : "#8090a8",
            }}
          >
            <Icon size={22} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
