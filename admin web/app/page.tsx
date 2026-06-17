import { AdminShell } from "@/components/admin-shell";
import { Icon } from "@/components/icon";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { orders, summaryCards } from "@/lib/mock-data";
import type { Order } from "@/lib/types";

export default function DashboardPage() {
  return (
    <AdminShell>
      <PageHeader
        eyebrow="Өнөөдрийн тойм"
        title="Хянах самбар"
        description="Pre-order захиалга, тээвэрлэлт, орлогын ерөнхий гүйцэтгэл."
        actions={
        <button className="secondaryButton">
          <Icon name="download" />
          Тайлан татах
        </button>
        }
      />

      <section className="grid cols6">
        {summaryCards.map((card) => (
          <MetricCard key={card.label} metric={card} />
        ))}
      </section>

      <section className="grid cols12" style={{ marginTop: 20 }}>
        <article className="card span8">
          <div className="sectionHeader">
            <h2>Сүүлийн захиалгууд</h2>
            <a className="badge badge-neutral" href="/orders/ORD-94281">Дэлгэрэнгүй</a>
          </div>
          <DataTable<Order>
            columns={[
              { header: "Захиалга", cell: (order) => <strong>{order.id}</strong> },
              { header: "Харилцагч", cell: (order) => order.customer },
              { header: "Бүтээгдэхүүн", cell: (order) => order.product },
              { header: "Дүн", cell: (order) => order.amount },
              { header: "Төлөв", className: "center", cell: (order) => <StatusBadge status={order.status} /> },
            ]}
            rowKey={(order) => order.id}
            rows={orders}
          />
        </article>
        <article className="card span4 insight">
          <p className="eyebrow">Санхүүгийн дохио</p>
          <h2>Ашгийн margin 25.8%</h2>
          <p className="muted">Тээврийн зардал өссөн ч smartwatch ангиллын борлуулалт нийт ашгийг тогтвортой барьж байна.</p>
          <p className="metricValue">₮21.7M</p>
          <p className="muted">Энэ сарын тооцоолсон цэвэр ашиг</p>
        </article>
      </section>
    </AdminShell>
  );
}
