import type { Customer, DashboardSummary, Order, OrderItem, Payment, Product, TimelineItem } from "./types";

export const summaryCards: DashboardSummary[] = [
  { label: "Нийт захиалга", value: "1,284", trend: "+12% өнгөрсөн сараас", icon: "list_alt" },
  { label: "Шинэ захиалга", value: "42", trend: "Өнөөдөр", icon: "new_releases" },
  { label: "Тээвэрт", value: "318", trend: "Идэвхтэй явж байна", icon: "local_shipping" },
  { label: "Нийт орлого", value: "₮84.2M", trend: "+18% өсөлт", icon: "payments" },
  { label: "Ашиг", value: "₮21.7M", trend: "25.8% margin", icon: "trending_up" },
  { label: "Харилцагч", value: "892", trend: "+31 шинэ", icon: "group" },
];

export const productMetrics: DashboardSummary[] = [
  { label: "Нийт бараа", value: "248", trend: "32 шинэ санал", icon: "inventory_2" },
  { label: "Идэвхтэй", value: "211", trend: "85% каталог", icon: "check_circle" },
  { label: "Дуусах гэж байна", value: "18", trend: "Дахин захиалга хэрэгтэй", icon: "warning" },
];

export const customerMetrics: DashboardSummary[] = [
  { label: "Нийт харилцагч", value: "892", trend: "+31 шинэ", icon: "group" },
  { label: "Давтан худалдан авагч", value: "64%", trend: "Сүүлийн 90 хоног", icon: "repeat" },
  { label: "Дундаж захиалга", value: "₮312K", trend: "+8.5% өсөлт", icon: "receipt_long" },
];

export const financeMetrics: DashboardSummary[] = [
  { label: "Нийт орлого", value: "₮84.2M", trend: "+18% өнгөрсөн сараас", icon: "payments" },
  { label: "Тээвэр & хүргэлт", value: "₮9.6M", trend: "Олон улсын ачаа тээвэр", icon: "local_shipping" },
  { label: "Цэвэр ашиг", value: "₮21.7M", trend: "25.8% margin", icon: "trending_up" },
];

export const products: Product[] = [
  { name: "Premium Smart Watch", sku: "SW-2048", category: "Electronics", cost: "¥218", price: "₮289,000", stock: 42, status: "Идэвхтэй" },
  { name: "Red Runner Sneaker", sku: "SN-7711", category: "Fashion", cost: "¥159", price: "₮219,000", stock: 18, status: "Идэвхтэй" },
  { name: "Wireless Headphones", sku: "AU-3810", category: "Audio", cost: "¥96", price: "₮145,000", stock: 9, status: "Дуусах гэж байна" },
  { name: "Minimal Backpack", sku: "BG-1194", category: "Travel", cost: "¥132", price: "₮179,000", stock: 0, status: "Дууссан" },
];

export const orders: Order[] = [
  { id: "ORD-94281", customer: "Б. Энхжин", phone: "9911 0022", product: "Premium Smart Watch", amount: "₮867,000", profit: "₮218,000", status: "Тээвэрлэлтэнд", date: "2026-06-07" },
  { id: "ORD-94244", customer: "Д. Мөнх-Оргил", phone: "8800 1122", product: "Red Runner Sneaker", amount: "₮438,000", profit: "₮91,000", status: "Хүлээгдэж буй", date: "2026-06-06" },
  { id: "ORD-94192", customer: "С. Номин", phone: "9909 7711", product: "Wireless Headphones", amount: "₮290,000", profit: "₮74,000", status: "Биелсэн", date: "2026-06-05" },
  { id: "ORD-94133", customer: "А. Тэмүүлэн", phone: "8818 3030", product: "Minimal Backpack", amount: "₮179,000", profit: "₮43,000", status: "Биелсэн", date: "2026-06-04" },
];

export const customers: Customer[] = [
  { name: "Б. Энхжин", phone: "9911 0022", orders: 24, spent: "₮8.4M", lastOrder: "ORD-94281" },
  { name: "Д. Мөнх-Оргил", phone: "8800 1122", orders: 12, spent: "₮3.1M", lastOrder: "ORD-94244" },
  { name: "С. Номин", phone: "9909 7711", orders: 3, spent: "₮810K", lastOrder: "ORD-94192" },
  { name: "А. Тэмүүлэн", phone: "8818 3030", orders: 8, spent: "₮2.2M", lastOrder: "ORD-94133" },
  { name: "Г. Ариунзаяа", phone: "9900 5644", orders: 45, spent: "₮14.8M", lastOrder: "ORD-93910" },
];

export const orderItems: OrderItem[] = [
  { product: "Premium Smart Watch", sku: "SW-2048", price: "₮289,000", qty: 2, total: "₮578,000" },
  { product: "Red Runner Sneaker", sku: "SN-7711", price: "₮219,000", qty: 1, total: "₮219,000" },
  { product: "Wireless Headphones", sku: "AU-3810", price: "₮145,000", qty: 1, total: "₮145,000" },
];

export const timeline: TimelineItem[] = [
  { label: "Захиалга үүссэн", date: "2026-06-07 10:24", tone: "green" },
  { label: "Урьдчилгаа төлөгдсөн", date: "2026-06-07 10:41", tone: "blue" },
  { label: "Тээвэрлэлтэнд шилжсэн", date: "2026-06-07 15:10", tone: "primary" },
];

export const paymentSummary: Payment[] = [
  { label: "Барааны дүн", value: "₮942,000" },
  { label: "Хүргэлт", value: "₮5,000" },
  { label: "Урьдчилгаа 30%", value: "₮284,100" },
  { label: "Нийт", value: "₮947,000", final: true },
];
