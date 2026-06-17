import type { Order, Product, CartItem, CheckoutFormData, CreateOrderPayload, OrderTrackingStatus } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

interface ApiProduct {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  deposit: number;
  china_price?: number | null;
  image: string;
  status: Product["status"];
  estimated_arrival: string;
  stock: number;
  description?: string | null;
}

interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  total_price: number;
  deposit_amount: number;
  remaining_amount: number;
  estimated_arrival?: string | null;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    unit_price: number;
    product: ApiProduct;
  }>;
}

async function placeholder<T>(path: string): Promise<T> {
  throw new Error(`API not connected yet: ${API_URL}${path}`);
}

function mapProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    deposit: Number(product.deposit),
    image: product.image,
    status: product.status,
    category: product.category,
    estimatedArrival: product.estimated_arrival,
    chinaPrice: product.china_price == null ? undefined : Number(product.china_price),
    description: product.description ?? undefined,
  };
}

function mapOrderStatus(status: string): OrderTrackingStatus {
  if (status === "delivered") return "completed";
  return status as OrderTrackingStatus;
}

function mapOrder(order: ApiOrder): Order {
  return {
    id: order.id,
    orderNumber: order.order_number,
    status: mapOrderStatus(order.status),
    customerName: order.customer.name,
    phone: order.customer.phone,
    address: order.customer.address,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.product.name,
      quantity: item.quantity,
      price: Number(item.unit_price),
      image: item.product.image,
    })),
    totalPrice: Number(order.total_price),
    depositPaid: Number(order.deposit_amount),
    remaining: Number(order.remaining_amount),
    estimatedArrival: order.estimated_arrival ?? "",
  };
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getProducts: async () => {
    const products = await request<ApiProduct[]>("/products");
    return products.map(mapProduct);
  },
  getProductById: async (id: number | string) => {
    const product = await request<ApiProduct>(`/products/${id}`);
    return mapProduct(product);
  },
  getProduct: async (id: number | string) => {
    const product = await request<ApiProduct>(`/products/${id}`);
    return mapProduct(product);
  },
  createOrder: async (payload: CreateOrderPayload) => {
    const order = await request<ApiOrder>("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return mapOrder(order);
  },
  createOrderFromCart: (items: CartItem[], formData: CheckoutFormData) =>
    api.createOrder({
      customer: formData,
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    }),
  trackOrder: async ({ phone = "", orderNumber = "" }: { phone?: string; orderNumber?: string }) => {
    const params = new URLSearchParams({
      phone,
      order_number: orderNumber,
    });
    const orders = await request<ApiOrder[]>(`/orders/track?${params.toString()}`);
    return orders.map(mapOrder);
  },
  trackOrderByPhone: async (phone: string) => {
    const orders = await api.trackOrder({ phone });
    return orders[0];
  },
  trackOrderByNumber: async (orderNumber: string) => {
    const orders = await api.trackOrder({ orderNumber });
    return orders[0];
  },
};
