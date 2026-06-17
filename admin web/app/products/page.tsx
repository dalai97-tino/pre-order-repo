"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Icon } from "@/components/icon";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { productMetrics } from "@/lib/mock-data";
import { adminApi } from "@/lib/api";
import type { Product, ProductPayload } from "@/lib/types";

type ProductFormState = {
  name: string;
  sku: string;
  category: string;
  price: string;
  deposit: string;
  china_price: string;
  image: string;
  status: ProductPayload["status"];
  estimated_arrival: string;
  stock: string;
  description: string;
};

const emptyForm: ProductFormState = {
  name: "",
  sku: "",
  category: "",
  price: "",
  deposit: "",
  china_price: "",
  image: "",
  status: "available",
  estimated_arrival: "7-10 хоног",
  stock: "0",
  description: "",
};

function toPayload(form: ProductFormState): ProductPayload {
  return {
    name: form.name,
    sku: form.sku,
    category: form.category,
    price: Number(form.price),
    deposit: Number(form.deposit),
    china_price: form.china_price ? Number(form.china_price) : null,
    image: form.image,
    status: form.status,
    estimated_arrival: form.estimated_arrival,
    stock: Number(form.stock),
    description: form.description || null,
  };
}

function fromProduct(product: Product): ProductFormState {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price.replace(/[₮,]/g, ""),
    deposit: product.deposit?.replace(/[₮,]/g, "") ?? "",
    china_price: product.chinaPrice ?? "",
    image: product.image ?? "",
    status: product.rawStatus ?? "available",
    estimated_arrival: product.estimatedArrival ?? "7-10 хоног",
    stock: String(product.stock),
    description: product.description ?? "",
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const activeProductMetrics = useMemo(() => {
    if (!products.length) return productMetrics;
    const active = products.filter((product) => product.rawStatus !== "inactive").length;
    const inactive = products.filter((product) => product.rawStatus === "inactive").length;
    const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 10).length;
    return [
      { label: "Нийт бараа", value: String(products.length), trend: `${active} идэвхтэй`, icon: "inventory_2" },
      { label: "Идэвхтэй", value: String(active), trend: `${inactive} идэвхгүй`, icon: "check_circle" },
      { label: "Дуусах гэж байна", value: String(lowStock), trend: "Дахин захиалга хэрэгтэй", icon: "warning" },
    ];
  }, [products]);

  async function loadProducts() {
    try {
      setIsLoading(true);
      setError(null);
      const nextProducts = await adminApi.getProducts();
      setProducts(nextProducts);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Бараа ачаалж чадсангүй");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateForm(field: keyof ProductFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(product: Product) {
    setEditingProduct(product);
    setForm(fromProduct(product));
    setMessage(null);
    setError(null);
  }

  function resetForm() {
    setEditingProduct(null);
    setForm(emptyForm);
  }

  async function handleSaveProduct() {
    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      if (editingProduct?.backendId) {
        await adminApi.updateProduct(editingProduct.backendId, toPayload(form));
        setMessage("Бараа амжилттай шинэчлэгдлээ.");
      } else {
        await adminApi.createProduct(toPayload(form));
        setMessage("Шинэ бараа амжилттай нэмэгдлээ.");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Бараа хадгалж чадсангүй");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteProduct(product: Product) {
    if (!product.backendId) return;

    try {
      setError(null);
      setMessage(null);
      await adminApi.deleteProduct(product.backendId);
      setMessage("Барааг идэвхгүй болголоо.");
      await loadProducts();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Бараа устгаж чадсангүй");
    }
  }

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Каталог"
        title="Бараа бүтээгдэхүүн"
        description="Pre-order худалдаанд оруулах бараа, SKU, үнэ болон нөөцийн төлөв."
        actions={
          <button className="primaryButton" onClick={resetForm}>
            <Icon name="add" />
            Шинэ бараа
          </button>
        }
      />

      {(message || error) && (
        <section className="card totalBox" style={{ marginBottom: 20 }}>
          {message && <div className="badge badge-green" style={{ width: "fit-content" }}>{message}</div>}
          {error && <div className="badge" style={{ background: "#ffdad6", color: "#93000a", width: "fit-content" }}>{error}</div>}
        </section>
      )}

      <section className="grid cols3">
        {activeProductMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <div className="sectionHeader">
          <h2>Барааны жагсаалт</h2>
          <button className="secondaryButton">
            <Icon name="filter_list" />
            Шүүлтүүр
          </button>
        </div>
        {isLoading && (
          <div className="totalBox">
            <p className="muted">Бараа ачаалж байна...</p>
          </div>
        )}
        {!isLoading && (
          <DataTable<Product>
            columns={[
              { header: "Бараа", cell: (product) => <strong>{product.name}</strong> },
              { header: "SKU", cell: (product) => product.sku },
              { header: "Ангилал", cell: (product) => product.category },
              { header: "Өртөг", cell: (product) => product.cost },
              { header: "Зарах үнэ", cell: (product) => product.price },
              { header: "Нөөц", className: "right", cell: (product) => product.stock },
              { header: "Төлөв", className: "center", cell: (product) => <span className="badge badge-neutral">{product.status}</span> },
              {
                header: "Үйлдэл",
                className: "center",
                cell: (product) => (
                  <div className="topActions" style={{ justifyContent: "center" }}>
                    <button className="secondaryButton" onClick={() => startEdit(product)}>Засах</button>
                    <button className="secondaryButton" onClick={() => handleDeleteProduct(product)}>Идэвхгүй</button>
                  </div>
                ),
              },
            ]}
            rowKey={(product) => product.sku}
            rows={products}
          />
        )}
      </section>

      <section className="card" style={{ marginTop: 20 }}>
        <div className="sectionHeader">
          <h2>{editingProduct ? "Бараа засах" : "Шинэ бараа нэмэх"}</h2>
          {editingProduct && <button className="secondaryButton" onClick={resetForm}>Цуцлах</button>}
        </div>
        <div className="formGrid">
          <div className="field">
            <label>Нэр</label>
            <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} />
          </div>
          <div className="field">
            <label>SKU</label>
            <input value={form.sku} onChange={(event) => updateForm("sku", event.target.value)} />
          </div>
          <div className="field">
            <label>Ангилал</label>
            <input value={form.category} onChange={(event) => updateForm("category", event.target.value)} />
          </div>
          <div className="field">
            <label>Төлөв</label>
            <select value={form.status} onChange={(event) => updateForm("status", event.target.value)}>
              <option value="available">Идэвхтэй</option>
              <option value="pre-order">Урьдчилсан</option>
              <option value="inactive">Идэвхгүй</option>
            </select>
          </div>
          <div className="field">
            <label>Зарах үнэ</label>
            <input type="number" value={form.price} onChange={(event) => updateForm("price", event.target.value)} />
          </div>
          <div className="field">
            <label>Урьдчилгаа</label>
            <input type="number" value={form.deposit} onChange={(event) => updateForm("deposit", event.target.value)} />
          </div>
          <div className="field">
            <label>Хятадын үнэ</label>
            <input type="number" value={form.china_price} onChange={(event) => updateForm("china_price", event.target.value)} />
          </div>
          <div className="field">
            <label>Нөөц</label>
            <input type="number" value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} />
          </div>
          <div className="field">
            <label>Ирэх хугацаа</label>
            <input value={form.estimated_arrival} onChange={(event) => updateForm("estimated_arrival", event.target.value)} />
          </div>
          <div className="field">
            <label>Зураг URL</label>
            <input value={form.image} onChange={(event) => updateForm("image", event.target.value)} />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Тайлбар</label>
            <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <button className="primaryButton" disabled={isSaving} onClick={handleSaveProduct}>
              {isSaving ? "Хадгалж байна..." : editingProduct ? "Шинэчлэх" : "Бараа нэмэх"}
            </button>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
