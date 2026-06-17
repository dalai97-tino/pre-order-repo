import type { OrderStatus } from "@/lib/types";

const toneByStatus: Record<OrderStatus, string> = {
  "Биелсэн": "badge badge-green",
  "Хүлээгдэж буй": "badge badge-yellow",
  "Тээвэрлэлтэнд": "badge badge-blue",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={toneByStatus[status]}>{status}</span>;
}
