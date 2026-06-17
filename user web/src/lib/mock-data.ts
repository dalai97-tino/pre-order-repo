import { CheckCircle, CreditCard, MapPin, Package, ShoppingBag, ShoppingCart, Truck } from "lucide-react";
import type { CartItem, Product, TrackingStatus, Order } from "./types";

export const categories = ["Бүгд", "Электроникс", "Хувцас", "Гоо сайхан", "Гэр ахуй", "Тоглоом", "Спорт"];

export const products: Product[] = [
  { id: 1, name: "Xiaomi Redmi Buds 5 Pro", price: 185000, deposit: 55000, image: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde9?w=400", status: "available", category: "Электроникс", estimatedArrival: "7-10 хоног" },
  { id: 2, name: "Удаан унтлагын самбар", price: 125000, deposit: 40000, image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400", status: "pre-order", category: "Гэр ахуй", estimatedArrival: "14-20 хоног" },
  { id: 3, name: "LED гэрэлт толь", price: 95000, deposit: 30000, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400", status: "available", category: "Гоо сайхан", estimatedArrival: "5-7 хоног" },
  { id: 4, name: "Утасгүй зөөврийн чанга яригч", price: 75000, deposit: 25000, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", status: "pre-order", category: "Электроникс", estimatedArrival: "10-15 хоног" },
  { id: 5, name: "Гар цүнх эмэгтэй", price: 145000, deposit: 45000, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", status: "available", category: "Хувцас", estimatedArrival: "7-10 хоног" },
  { id: 6, name: "Ухаалаг цаг Xiaomi Band 8", price: 165000, deposit: 50000, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400", status: "pre-order", category: "Электроникс", estimatedArrival: "12-15 хоног" },
  { id: 7, name: "Кофены машин автомат", price: 285000, deposit: 95000, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400", status: "available", category: "Гэр ахуй", estimatedArrival: "8-12 хоног" },
  { id: 8, name: "Гоо сайхны багц арьс арчилгаа", price: 195000, deposit: 60000, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", status: "pre-order", category: "Гоо сайхан", estimatedArrival: "10-14 хоног" },
];

export const featuredProducts = products.slice(0, 4);

export const productDetail: Product = {
  ...products[0],
  images: [
    "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde9?w=800",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800",
  ],
  chinaPrice: 120000,
  description: "Xiaomi-н хамгийн сүүлийн үеийн утасгүй чихэвч. Дуу чимээг бууруулах, 40 цагийн ажиллах хугацаа, усанд тэсвэртэй IP55 зэрэглэл.",
  features: [
    "Идэвхтэй дуу чимээ бууруулах технологи",
    "40 цагийн ажиллах хугацаа",
    "IP55 усанд тэсвэртэй",
    "Bluetooth 5.3 холболт",
    "Өндөр чанарын аудио кодек",
    "Хөнгөн жинтэй, эргономик загвар",
  ],
  specifications: {
    "Брэнд": "Xiaomi",
    "Загвар": "Redmi Buds 5 Pro",
    "Өнгө": "Хар, Цагаан",
    "Холболт": "Bluetooth 5.3",
    "Батерей": "500mAh (зай)",
    "Усны эсэргүүцэл": "IP55",
  },
};

export const cartItems: CartItem[] = [
  { id: 1, name: "Xiaomi Redmi Buds 5 Pro", price: 185000, deposit: 55000, image: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde9?w=200", quantity: 1 },
  { id: 2, name: "LED гэрэлт толь", price: 95000, deposit: 30000, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=200", quantity: 1 },
];

export const orderStatuses: TrackingStatus[] = [
  { id: 1, status: "new", label: "Шинэ захиалга", icon: ShoppingCart, date: "2026-05-28", completed: true },
  { id: 2, status: "deposit_paid", label: "Урьдчилгаа төлсөн", icon: CreditCard, date: "2026-05-28", completed: true },
  { id: 3, status: "ordered_from_china", label: "Хятадаас захиалсан", icon: Package, date: "2026-05-29", completed: true },
  { id: 4, status: "in_transit", label: "Замдаа", icon: Truck, date: "2026-06-01", completed: true },
  { id: 5, status: "arrived_mongolia", label: "Монголд ирсэн", icon: MapPin, date: "", completed: false },
  { id: 6, status: "out_for_delivery", label: "Хүргэлтэнд", icon: Truck, date: "", completed: false },
  { id: 7, status: "completed", label: "Дууссан", icon: CheckCircle, date: "", completed: false },
];

export const orderDetails: Order = {
  orderNumber: "MN9X4K2L7P",
  status: "in_transit",
  customerName: "Б. Энхбат",
  phone: "99119911",
  address: "СБД, 1-р хороо, Их тэнгэр комплекс 201 тоот",
  items: [
    { id: 1, name: "Xiaomi Redmi Buds 5 Pro", quantity: 1, price: 185000, image: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde9?w=200" },
    { id: 2, name: "LED гэрэлт толь", quantity: 1, price: 95000, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=200" },
  ],
  totalPrice: 280000,
  depositPaid: 85000,
  remaining: 195000,
  estimatedArrival: "2026-06-10 - 2026-06-15",
};

export const steps = [
  { icon: ShoppingBag, title: "Бараагаа сонгоно", description: "Хятадын онлайн дэлгүүрээс дуртай бараагаа хайж олно уу" },
  { icon: Package, title: "Урьдчилгаа төлнө", description: "Нийт үнийн 30-50% урьдчилгаа төлөөд захиалга баталгаажуулна" },
  { icon: Truck, title: "Хятадаас захиална", description: "Манай баг таны сонгосон бараагаа Хятадаас захиалж, Монголд хүргүүлнэ" },
  { icon: CheckCircle, title: "Монголд ирээд хүргэгдэнэ", description: "Барааг хүлээж авмагц үлдэх төлбөрөө төлж, таны гэрт хүргүүлнэ" },
];
