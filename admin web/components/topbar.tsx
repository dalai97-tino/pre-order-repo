"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { clearAdminSession } from "@/lib/auth";

export function Topbar() {
  const router = useRouter();

  function handleLogout() {
    clearAdminSession();
    router.replace("/login");
  }

  return (
    <header className="topbar">
      <label className="search">
        <Icon name="search" />
        <input placeholder="Захиалга, бараа, харилцагч хайх..." />
      </label>
      <div className="topActions">
        <button className="iconButton" aria-label="Мэдэгдэл">
          <Icon name="notifications" />
        </button>
        <button className="iconButton" aria-label="Тусламж">
          <Icon name="help" />
        </button>
        <button className="primaryButton">
          <Icon name="add" />
          Бараа нэмэх
        </button>
        <button className="secondaryButton" onClick={handleLogout}>
          Гарах
        </button>
      </div>
    </header>
  );
}
