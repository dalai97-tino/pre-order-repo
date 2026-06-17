"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { isAdminAuthenticated } from "@/lib/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="shell">
        <div className="contentFrame">
          <main className="page">
            <section className="card totalBox">
              <p className="muted">Админ эрх шалгаж байна...</p>
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <Sidebar />
      <div className="contentFrame">
        <Topbar />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
