import { AdminShell } from "@/components/admin-shell";
import { Icon } from "@/components/icon";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { financeMetrics, orders } from "@/lib/mock-data";
import type { Order } from "@/lib/types";

export default function FinancePage() {
  return (
    <AdminShell>
      <PageHeader
        eyebrow="Орлого ба ашиг"
        title="Санхүү"
        description="Захиалга бүрийн өртөг, тээвэр, зарах үнэ болон ашгийн тооцоо."
        actions={
        <div className="topActions">
          <button className="secondaryButton">
            <Icon name="date_range" />
            Энэ сар
          </button>
          <button className="secondaryButton">
            <Icon name="download" />
            Export
          </button>
        </div>
        }
      />

      <section className="grid cols3">
        {financeMetrics.map((metric, index) => <MetricCard featured={index === 2} key={metric.label} metric={metric} />)}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <div className="sectionHeader">
          <h2>Захиалгын ашиг</h2>
          <span className="badge badge-neutral">CNY өртөг / MNT борлуулалт</span>
        </div>
        <DataTable<Order>
          columns={[
            { header: "Захиалгын ID", cell: (order) => <strong>{order.id}</strong> },
            { header: "Бүтээгдэхүүн", cell: (order) => order.product },
            { header: "Зарах үнэ", className: "right", cell: (order) => order.amount },
            { header: "Ашиг", className: "right", cell: (order) => <strong>{order.profit}</strong> },
            { header: "Төлөв", className: "center", cell: (order) => <StatusBadge status={order.status} /> },
          ]}
          rowKey={(order) => order.id}
          rows={orders}
        />
      </section>
    </AdminShell>
  );
}
