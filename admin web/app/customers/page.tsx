import { AdminShell } from "@/components/admin-shell";
import { Icon } from "@/components/icon";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { customerMetrics, customers } from "@/lib/mock-data";
import type { Customer } from "@/lib/types";

export default function CustomersPage() {
  return (
    <AdminShell>
      <PageHeader
        eyebrow="CRM"
        title="Харилцагчид"
        description="Захиалгын давтамж, нийт зарцуулалт, холбоо барих мэдээлэл."
        actions={
        <button className="secondaryButton">
          <Icon name="upload" />
          CSV импорт
        </button>
        }
      />

      <section className="grid cols3">
        {customerMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <div className="sectionHeader">
          <h2>Харилцагчдын жагсаалт</h2>
          <button className="secondaryButton">
            <Icon name="sort" />
            Сүүлийн захиалга
          </button>
        </div>
        <DataTable<Customer>
          columns={[
            { header: "Нэр", cell: (customer) => <strong>{customer.name}</strong> },
            { header: "Утас", cell: (customer) => customer.phone },
            { header: "Нийт захиалга", className: "right", cell: (customer) => <span className="badge badge-neutral">{customer.orders} захиалга</span> },
            { header: "Зарцуулалт", className: "right", cell: (customer) => customer.spent },
            { header: "Сүүлийн захиалга", cell: (customer) => customer.lastOrder },
          ]}
          rowKey={(customer) => customer.phone}
          rows={customers}
        />
      </section>
    </AdminShell>
  );
}
