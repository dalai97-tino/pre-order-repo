import type { TimelineItem } from "@/lib/types";

export function OrderTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <div className="timelineItem" key={item.label}>
          <span className={`dot ${item.tone}`} />
          <span>
            <strong>{item.label}</strong>
            <small className="muted" style={{ display: "block" }}>{item.date}</small>
          </span>
        </div>
      ))}
    </div>
  );
}
