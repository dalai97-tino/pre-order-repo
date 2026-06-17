import type { Payment } from "@/lib/types";

export function MoneySummary({ title, rows }: { title: string; rows: Payment[] }) {
  return (
    <article className="card totalBox">
      <h2>{title}</h2>
      {rows.map((row) => (
        <div className={row.final ? "totalRow final" : "totalRow"} key={row.label}>
          <span>{row.label}</span>
          {row.final ? <span>{row.value}</span> : <strong>{row.value}</strong>}
        </div>
      ))}
    </article>
  );
}
