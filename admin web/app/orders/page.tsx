"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { DataTable } from "@/components/data-table";
import { Icon } from "@/components/icon";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { adminApi } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setIsLoading(true);
        setError(null);
        const orders = await adminApi.getAdminOrders();
        if (isMounted) {
          setOrders(orders);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Захиалга ачаалж чадсангүй");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Захиалга"
        title="Захиалгын жагсаалт"
        description="Харилцагчийн pre-order захиалга, төлбөр болон тээвэрлэлтийн төлөв."
        actions={
          <button className="secondaryButton">
            <Icon name="filter_list" />
            Шүүлтүүр
          </button>
        }
      />

      <section className="card">
        <div className="sectionHeader">
          <h2>Бүх захиалга</h2>
          <span className="badge badge-neutral">{orders.length} захиалга</span>
        </div>

        {isLoading && (
          <div className="totalBox">
            <p className="muted">Захиалга ачаалж байна...</p>
          </div>
        )}

        {error && (
          <div className="totalBox">
            <div className="badge" style={{ background: "#ffdad6", color: "#93000a", width: "fit-content" }}>
              Захиалга ачаалж чадсангүй. {error}
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <DataTable<Order>
            columns={[
              {
                header: "Захиалга",
                cell: (order) => (
                  <Link href={`/orders/${order.backendId ?? order.id}`}>
                    <strong>{order.id}</strong>
                  </Link>
                ),
              },
              { header: "Харилцагч", cell: (order) => order.customer },
              { header: "Утас", cell: (order) => order.phone },
              { header: "Бүтээгдэхүүн", cell: (order) => order.product },
              { header: "Дүн", className: "right", cell: (order) => order.amount },
              { header: "Огноо", cell: (order) => order.date },
              { header: "Төлөв", className: "center", cell: (order) => <StatusBadge status={order.status} /> },
            ]}
            rowKey={(order) => order.id}
            rows={orders}
          />
        )}
      </section>
    </AdminShell>
  );
}
