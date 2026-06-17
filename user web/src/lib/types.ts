import type { LucideIcon } from "lucide-react";

export type ProductStatus = "available" | "pre-order" | "inactive";
export type OrderTrackingStatus =
  | "new"
  | "deposit_paid"
  | "ordered_from_china"
  | "in_transit"
  | "arrived_mongolia"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export interface Product {
  id: number;
  name: string;
  price: number;
  deposit: number;
  image: string;
  images?: string[];
  status: ProductStatus;
  category?: string;
  estimatedArrival: string;
  chinaPrice?: number;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  deposit: number;
  image: string;
  quantity: number;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  note: string;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id?: number;
  orderNumber: string;
  status: OrderTrackingStatus;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  depositPaid: number;
  remaining: number;
  estimatedArrival: string;
}

export interface CreateOrderPayload {
  customer: CheckoutFormData;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface Customer {
  name: string;
  phone: string;
  address?: string;
}

export interface Payment {
  totalPrice: number;
  totalDeposit: number;
  remainingPayment: number;
}

export interface DashboardSummary {
  label: string;
  value: string;
  trend: string;
}

export interface TrackingStatus {
  id: number;
  status: OrderTrackingStatus;
  label: string;
  icon: LucideIcon;
  date: string;
  completed: boolean;
}
