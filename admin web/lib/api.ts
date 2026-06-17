import type { AdminOrderStatus, Customer, DashboardSummary, Order, OrderPaymentPayload, PaymentStatus, Product, ProductPayload } from "./types";
import { clearAdminSession, getAdminToken, type AdminUser } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  total_price: number;
  deposit_amount: number;
  remaining_amount: number;
  created_at: string;
  admin_note?: string | null;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    unit_price: number;
    deposit: number;
    product: {
      name: string;
      sku: string;
    };
  }>;
  payment?: {
    status: PaymentStatus;
    paid_amount: number;
    method?: string | null;
    payment_note?: string | null;
  } | null;
}

interface ApiProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  deposit: number;
  china_price?: number | null;
  image: string;
  status: "available" | "pre-order" | "inactive";
  estimated_arrival: string;
  stock: number;
  description?: string | null;
}

interface LoginResponse {
  access_token: string;
  token_type: "bearer";
  admin: AdminUser;
}

async function placeholder<T>(path: string): Promise<T> {
  throw new Error(`API not connected yet: ${API_URL}${path}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const token = getAdminToken();

  if (path.startsWith("/admin") && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearAdminSession();
      window.location.href = "/login";
    }
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function formatMoney(value: number): string {
  return `₮${Number(value).toLocaleString()}`;
}

function mapProductStatus(status: ApiProduct["status"]): string {
  if (status === "available") return "Идэвхтэй";
  if (status === "pre-order") return "Урьдчилсан";
  return "Идэвхгүй";
}

function mapProduct(product: ApiProduct): Product {
  return {
    backendId: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    cost: product.china_price == null ? "-" : `¥${Number(product.china_price).toLocaleString()}`,
    price: formatMoney(product.price),
    deposit: formatMoney(product.deposit),
    chinaPrice: product.china_price == null ? "" : String(product.china_price),
    image: product.image,
    estimatedArrival: product.estimated_arrival,
    description: product.description,
    stock: product.stock,
    status: mapProductStatus(product.status),
    rawStatus: product.status,
  };
}

function mapRawStatus(status: string): AdminOrderStatus {
  return status === "delivered" ? "completed" : status as AdminOrderStatus;
}

function mapApiStatus(status: AdminOrderStatus): string {
  return status === "completed" ? "delivered" : status;
}

function mapStatus(status: string): Order["status"] {
  if (status === "delivered") return "Биелсэн";
  if (status === "in_transit" || status === "ordered_from_china" || status === "arrived_mongolia" || status === "out_for_delivery") {
    return "Тээвэрлэлтэнд";
  }
  return "Хүлээгдэж буй";
}

function mapOrder(order: ApiOrder): Order {
  const items = order.items.map((item) => ({
    product: item.product.name,
    sku: item.product.sku,
    price: formatMoney(item.unit_price),
    qty: item.quantity,
    total: formatMoney(Number(item.unit_price) * item.quantity),
  }));
  const totalPrice = Number(order.total_price);
  const depositAmount = Number(order.deposit_amount);
  const remainingAmount = Number(order.remaining_amount);
  const paidAmount = Number(order.payment?.paid_amount ?? 0);

  return {
    id: order.order_number,
    backendId: order.id,
    customer: order.customer.name,
    phone: order.customer.phone,
    address: order.customer.address,
    product: order.items[0]?.product.name ?? "Олон бараа",
    amount: formatMoney(totalPrice),
    profit: formatMoney(Math.max(0, totalPrice - depositAmount)),
    status: mapStatus(order.status),
    rawStatus: mapRawStatus(order.status),
    date: order.created_at.slice(0, 10),
    adminNote: order.admin_note,
    items,
    paymentRows: [
      { label: "Барааны дүн", value: formatMoney(totalPrice) },
      { label: "Урьдчилгаа", value: formatMoney(depositAmount) },
      { label: "Төлсөн дүн", value: formatMoney(paidAmount) },
      { label: "Үлдэгдэл", value: formatMoney(remainingAmount) },
      { label: "Нийт", value: formatMoney(totalPrice), final: true },
    ],
    payment: {
      status: order.payment?.status ?? "pending",
      paidAmount,
      paidAmountText: formatMoney(paidAmount),
      note: order.payment?.payment_note,
      method: order.payment?.method,
    },
  };
}

export const adminApi = {
  login: (email: string, password: string) => request<LoginResponse>("/admin/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }),
  getDashboardSummary: () => placeholder<DashboardSummary[]>("/admin/dashboard/summary"),
  getProducts: async () => {
    const products = await request<ApiProduct[]>("/products");
    return products.map(mapProduct);
  },
  createProduct: async (payload: ProductPayload) => {
    const product = await request<ApiProduct>("/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return mapProduct(product);
  },
  updateProduct: async (productId: string | number, payload: Partial<ProductPayload>) => {
    const product = await request<ApiProduct>(`/admin/products/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return mapProduct(product);
  },
  deleteProduct: async (productId: string | number) => {
    const product = await request<ApiProduct>(`/admin/products/${productId}`, {
      method: "DELETE",
    });
    return mapProduct(product);
  },
  getAdminOrders: async () => {
    const orders = await request<ApiOrder[]>("/admin/orders");
    return orders.map(mapOrder);
  },
  getOrders: async () => {
    const orders = await request<ApiOrder[]>("/admin/orders");
    return orders.map(mapOrder);
  },
  getAdminOrder: async (orderId: string | number) => {
    const order = await request<ApiOrder>(`/admin/orders/${orderId}`);
    return mapOrder(order);
  },
  getOrder: async (orderId: string | number) => {
    const order = await request<ApiOrder>(`/admin/orders/${orderId}`);
    return mapOrder(order);
  },
  updateOrderStatus: async (orderId: string | number, status: AdminOrderStatus) => {
    const order = await request<ApiOrder>(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: mapApiStatus(status) }),
    });
    return mapOrder(order);
  },
  updateOrderPayment: async (orderId: string | number, payload: OrderPaymentPayload) => {
    const order = await request<ApiOrder>(`/admin/orders/${orderId}/payment`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return mapOrder(order);
  },
  getCustomers: () => placeholder<Customer[]>("/admin/customers"),
};
