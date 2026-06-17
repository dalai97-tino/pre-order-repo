"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { adminApi } from "@/lib/api";
import { isAdminAuthenticated, saveAdminSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);
      const session = await adminApi.login(email, password);
      saveAdminSession(session.access_token, session.admin);
      router.replace("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="loginPage">
      <section className="card loginCard">
        <div className="brand" style={{ padding: 0 }}>
          <div className="brandIcon">
            <Icon name="inventory" />
          </div>
          <div>
            <strong>Admin Panel</strong>
            <small>Pre-order System</small>
          </div>
        </div>

        <div>
          <p className="eyebrow">Админ нэвтрэлт</p>
          <h1>Системд нэвтрэх</h1>
          <p className="muted">Захиалга, бараа, төлбөрийн мэдээлэл удирдах эрхээр нэвтэрнэ.</p>
        </div>

        {error && (
          <div className="badge" style={{ background: "#ffdad6", color: "#93000a", width: "fit-content" }}>
            {error}
          </div>
        )}

        <form className="formGrid" onSubmit={handleSubmit} style={{ gridTemplateColumns: "1fr", padding: 0 }}>
          <div className="field">
            <label>Email</label>
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="field">
            <label>Нууц үг</label>
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </div>
          <button className="primaryButton" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
      </section>
    </main>
  );
}
