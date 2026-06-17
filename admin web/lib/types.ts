export type OrderStatus = "Биелсэн" | "Хүлээгдэж буй" | "Тээвэрлэлтэнд";
export type AdminOrderStatus =
  | "new"
  | "deposit_paid"
  | "ordered_from_china"
  | "in_transit"
  | "arrived_mongolia"
  | "out_for_delivery"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "deposit_paid" | "paid" | "partial" | "refunded";

export interface Product {
  backendId?: number;
  name: string;
  sku: string;
  category: string;
  cost: string;
  price: string;
  deposit?: string;
  chinaPrice?: string;
  image?: string;
  estimatedArrival?: string;
  description?: string | null;
  stock: number;
  status: string;
  rawStatus?: "available" | "pre-order" | "inactive";
}

export interface ProductPayload {
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

export interface Order {
  id: string;
  backendId?: number;
  customer: string;
  phone: string;
  address?: string;
  product: string;
  amount: string;
  profit: string;
  status: OrderStatus;
  rawStatus?: AdminOrderStatus;
  date: string;
  adminNote?: string | null;
  items?: OrderItem[];
  paymentRows?: Payment[];
  payment?: OrderPayment;
}

export interface Customer {
  name: string;
  phone: string;
  orders: number;
  spent: string;
  lastOrder: string;
}

export interface Payment {
  label: string;
  value: string;
  final?: boolean;
}

export interface OrderPayment {
  status: PaymentStatus;
  paidAmount: number;
  paidAmountText: string;
  note?: string | null;
  method?: string | null;
}

export interface OrderPaymentPayload {
  paid_amount: number;
  payment_status: PaymentStatus;
  payment_note?: string | null;
}

export interface DashboardSummary {
  label: string;
  value: string;
  trend: string;
  icon: string;
}

export interface OrderItem {
  product: string;
  sku: string;
  price: string;
  qty: number;
  total: string;
}

export interface TimelineItem {
  label: string;
  date: string;
  tone: "green" | "blue" | "primary";
}
