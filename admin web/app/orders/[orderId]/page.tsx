"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { Icon } from "@/components/icon";
import { DataTable } from "@/components/data-table";
import { MoneySummary } from "@/components/money-summary";
import { OrderTimeline } from "@/components/order-timeline";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { timeline } from "@/lib/mock-data";
import { adminApi } from "@/lib/api";
import type { AdminOrderStatus, Order, OrderItem, PaymentStatus } from "@/lib/types";

const statusOptions: Array<{ value: AdminOrderStatus; label: string }> = [
  { value: "new", label: "Шинэ захиалга" },
  { value: "deposit_paid", label: "Урьдчилгаа төлсөн" },
  { value: "ordered_from_china", label: "Хятадаас захиалсан" },
  { value: "in_transit", label: "Замдаа" },
  { value: "arrived_mongolia", label: "Монголд ирсэн" },
  { value: "out_for_delivery", label: "Хүргэлтэнд" },
  { value: "completed", label: "Дууссан" },
  { value: "cancelled", label: "Цуцлагдсан" },
];

const paymentStatusOptions: Array<{ value: PaymentStatus; label: string }> = [
  { value: "pending", label: "Төлбөр хүлээгдэж байна" },
  { value: "deposit_paid", label: "Урьдчилгаа төлсөн" },
  { value: "partial", label: "Хэсэгчлэн төлсөн" },
  { value: "paid", label: "Бүрэн төлсөн" },
  { value: "refunded", label: "Буцаасан" },
];

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AdminOrderStatus>("new");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [paymentNote, setPaymentNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPaymentUpdating, setIsPaymentUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadOrder() {
    try {
      setIsLoading(true);
      setError(null);
      const nextOrder = await adminApi.getAdminOrder(orderId);
      setOrder(nextOrder);
      setSelectedStatus(nextOrder.rawStatus ?? "new");
      setPaidAmount(nextOrder.payment?.paidAmount ? String(nextOrder.payment.paidAmount) : "");
      setPaymentStatus(nextOrder.payment?.status ?? "pending");
      setPaymentNote(nextOrder.payment?.note ?? "");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Захиалга ачаалж чадсангүй");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  async function handleUpdateStatus() {
    try {
      setIsUpdating(true);
      setError(null);
      setMessage(null);
      await adminApi.updateOrderStatus(orderId, selectedStatus);
      await loadOrder();
      setMessage("Захиалгын төлөв амжилттай шинэчлэгдлээ.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Төлөв шинэчилж чадсангүй");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleUpdatePayment() {
    try {
      setIsPaymentUpdating(true);
      setError(null);
      setMessage(null);
      const amount = Number(paidAmount);

      if (Number.isNaN(amount) || amount < 0) {
        setError("Төлсөн дүн зөв тоо байх ёстой.");
        return;
      }

      await adminApi.updateOrderPayment(orderId, {
        paid_amount: amount,
        payment_status: amount > 0 && paymentStatus === "pending" ? "deposit_paid" : paymentStatus,
        payment_note: paymentNote.trim() || null,
      });
      await loadOrder();
      setMessage("Төлбөрийн мэдээлэл амжилттай шинэчлэгдлээ.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Төлбөр шинэчилж чадсангүй");
    } finally {
      setIsPaymentUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell>
        <PageHeader eyebrow="Захиалга" title="Захиалгын дэлгэрэнгүй" description="Захиалгын мэдээлэл ачаалж байна." />
        <section className="card totalBox">
          <p className="muted">Захиалга ачаалж байна...</p>
        </section>
      </AdminShell>
    );
  }

  if (!order) {
    return (
      <AdminShell>
        <PageHeader eyebrow="Захиалга" title="Захиалга олдсонгүй" description="Сонгосон захиалгын мэдээлэл байхгүй байна." />
        {error && (
          <section className="card totalBox">
            <div className="badge" style={{ background: "#ffdad6", color: "#93000a", width: "fit-content" }}>{error}</div>
          </section>
        )}
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <PageHeader
        eyebrow={`Захиалга / #${order.id}`}
        title="Захиалгын дэлгэрэнгүй"
        description={`${order.customer} хэрэглэгчийн идэвхтэй захиалгын мэдээлэл.`}
        actions={
          <div className="topActions">
            <button className="secondaryButton">
              <Icon name="print" />
              Хэвлэх
            </button>
            <select
              className="secondaryButton"
              disabled={isUpdating}
              onChange={(event) => setSelectedStatus(event.target.value as AdminOrderStatus)}
              value={selectedStatus}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <button className="primaryButton" disabled={isUpdating} onClick={handleUpdateStatus}>
              {isUpdating ? "Шинэчилж байна..." : "Төлөв өөрчлөх"}
            </button>
          </div>
        }
      />

      {(message || error) && (
        <section className="card totalBox" style={{ marginBottom: 20 }}>
          {message && <div className="badge badge-green" style={{ width: "fit-content" }}>{message}</div>}
          {error && <div className="badge" style={{ background: "#ffdad6", color: "#93000a", width: "fit-content" }}>{error}</div>}
        </section>
      )}

      <section className="grid cols12">
        <article className="card span8">
          <div className="sectionHeader">
            <h2>Барааны мэдээлэл</h2>
            <span className="badge badge-neutral">{order.items?.length ?? 0} нэр төрлийн бараа</span>
          </div>
          <DataTable<OrderItem>
            columns={[
              { header: "Бараа", cell: (item) => <strong>{item.product}</strong> },
              { header: "SKU", cell: (item) => item.sku },
              { header: "Үнэ", cell: (item) => item.price },
              { header: "Тоо", className: "center", cell: (item) => item.qty },
              { header: "Нийт", className: "right", cell: (item) => item.total },
            ]}
            rowKey={(item) => item.sku}
            rows={order.items ?? []}
          />
        </article>

        <aside className="grid span4">
          <article className="card">
            <div className="sectionHeader">
              <h2>Захиалгын төлөв</h2>
              <StatusBadge status={order.status} />
            </div>
            <OrderTimeline items={timeline} />
          </article>
          <MoneySummary title="Төлбөрийн задаргаа" rows={order.paymentRows ?? []} />
          <article className="card">
            <div className="sectionHeader">
              <h2>Төлбөр шинэчлэх</h2>
              <span className="badge badge-neutral">{order.payment?.paidAmountText ?? "₮0"}</span>
            </div>
            <div className="formGrid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="field">
                <label>Төлсөн дүн</label>
                <input
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => {
                    setPaidAmount(event.target.value);
                    if (Number(event.target.value) > 0 && paymentStatus === "pending") {
                      setPaymentStatus("deposit_paid");
                    }
                  }}
                  placeholder="50000"
                  type="number"
                  value={paidAmount}
                />
              </div>
              <div className="field">
                <label>Төлбөрийн төлөв</label>
                <select
                  onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
                  value={paymentStatus}
                >
                  {paymentStatusOptions.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Төлбөрийн тэмдэглэл</label>
                <textarea
                  onChange={(event) => setPaymentNote(event.target.value)}
                  placeholder="Хаан банк шилжүүлэг"
                  value={paymentNote}
                />
              </div>
              <button className="primaryButton" disabled={isPaymentUpdating} onClick={handleUpdatePayment}>
                {isPaymentUpdating ? "Шинэчилж байна..." : "Төлбөр хадгалах"}
              </button>
            </div>
          </article>
        </aside>
      </section>

      <section className="grid cols12" style={{ marginTop: 20 }}>
        <article className="card span4 totalBox">
          <h2>Харилцагч</h2>
          <div className="totalRow"><span>Нэр</span><strong>{order.customer}</strong></div>
          <div className="totalRow"><span>Утас</span><strong>{order.phone}</strong></div>
          <div className="totalRow"><span>Хаяг</span><strong>{order.address ?? "Улаанбаатар"}</strong></div>
        </article>
        <article className="card span8">
          <div className="sectionHeader"><h2>Админ тэмдэглэл</h2></div>
          <div className="formGrid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field">
              <textarea placeholder="Захиалгатай холбоотой тэмдэглэл бичих..." defaultValue={order.adminNote ?? ""} />
            </div>
          </div>
        </article>
      </section>
    </AdminShell>
  );
}
