import { Icon } from "@/components/icon";
import type { DashboardSummary } from "@/lib/types";

export function MetricCard({ metric, featured = false }: { metric: DashboardSummary; featured?: boolean }) {
  return (
    <article className={featured ? "card metric insight" : "card metric"}>
      <div className="metricTop">
        <span>{metric.label}</span>
        <Icon name={metric.icon} />
      </div>
      <p className="metricValue">{metric.value}</p>
      <p className={featured ? "muted" : "metricTrend"}>{metric.trend}</p>
    </article>
  );
}
