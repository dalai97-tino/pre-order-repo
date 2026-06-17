import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { OrderTimeline } from "./OrderTimeline";
import type { Order, TrackingStatus } from "../../lib/types";

function getStatusLabel(status: Order["status"]) {
  const labels: Record<Order["status"], string> = {
    new: "Шинэ",
    deposit_paid: "Урьдчилгаа төлсөн",
    ordered_from_china: "Хятадаас захиалсан",
    in_transit: "Замдаа",
    arrived_mongolia: "Монголд ирсэн",
    out_for_delivery: "Хүргэлтэнд",
    completed: "Дууссан",
    cancelled: "Цуцлагдсан",
  };
  return labels[status];
}

function getStatusClassName(status: Order["status"]) {
  if (status === "completed") return "bg-green-500 text-white text-base px-4 py-2 w-fit";
  if (status === "cancelled") return "bg-red-500 text-white text-base px-4 py-2 w-fit";
  return "bg-orange-500 text-white text-base px-4 py-2 w-fit";
}

export function OrderTrackingResult({ order, statuses }: { order: Order; statuses: TrackingStatus[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="rounded-2xl shadow-lg mb-8">
        <CardHeader className="border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Захиалга #{order.orderNumber}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{order.customerName} • {order.phone}</p>
            </div>
            <Badge className={getStatusClassName(order.status)}>{getStatusLabel(order.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Нийт үнэ</p>
              <p className="text-2xl font-bold text-purple-600">{order.totalPrice.toLocaleString()}₮</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Төлсөн урьдчилгаа</p>
              <p className="text-2xl font-bold text-green-600">{order.depositPaid.toLocaleString()}₮</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Үлдэгдэл төлбөр</p>
              <p className="text-2xl font-bold text-blue-600">{order.remaining.toLocaleString()}₮</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4">Захиалгын явц</h3>
            <OrderTimeline statuses={statuses} />
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4">Захиалсан бараа</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                  <Card className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <p className="font-semibold mb-1">{item.name}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ширхэг: {item.quantity}</span>
                            <span className="font-bold text-purple-600">{item.price.toLocaleString()}₮</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Хүргэлтийн хаяг</h3>
            <p className="text-gray-700 flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-0.5 text-purple-600 flex-shrink-0" />
              {order.address}
            </p>
            <p className="text-sm text-gray-600 mt-3">
              Таамаглаж буй ирэх хугацаа: <span className="font-semibold text-purple-600">{order.estimatedArrival}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
