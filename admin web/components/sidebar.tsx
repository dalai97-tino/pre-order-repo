"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/icon";

const navItems = [
  { href: "/", label: "Хянах самбар", icon: "dashboard" },
  { href: "/products", label: "Бараа бүтээгдэхүүн", icon: "inventory_2" },
  { href: "/orders", label: "Захиалга", icon: "shopping_cart" },
  { href: "/customers", label: "Харилцагчид", icon: "group" },
  { href: "/finance", label: "Санхүү", icon: "payments" },
  { href: "/settings", label: "Тохиргоо", icon: "settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/orders")) return pathname.startsWith("/orders");
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/">
        <span className="brandIcon"><Icon name="inventory_2" /></span>
        <span>
          <strong>Admin Panel</strong>
          <small>Pre-order System</small>
        </span>
      </Link>
      <nav className="nav">
        {navItems.map((item) => (
          <Link
            aria-current={isActive(pathname, item.href) ? "page" : undefined}
            className={isActive(pathname, item.href) ? "navItem active" : "navItem"}
            href={item.href}
            key={item.href}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="adminCard">
        <div className="avatar">A</div>
        <span>
          <strong>Админ Хэрэглэгч</strong>
          <small>Системийн админ</small>
        </span>
      </div>
    </aside>
  );
}
