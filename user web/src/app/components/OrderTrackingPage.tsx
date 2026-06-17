import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Package } from "lucide-react";
import { CustomerHeader } from "./CustomerHeader";
import { OrderTrackingForm } from "./OrderTrackingForm";
import { OrderTrackingResult } from "./OrderTrackingResult";
import { orderStatuses } from "../../lib/mock-data";
import { api } from "../../lib/api";
import type { Order, OrderTrackingStatus, TrackingStatus } from "../../lib/types";

function getTimelineStatuses(status: OrderTrackingStatus): TrackingStatus[] {
  if (status === "cancelled") {
    return orderStatuses.map((item, index) => ({
      ...item,
      completed: index === 0,
      date: index === 0 ? item.date : "",
    }));
  }

  const currentIndex = orderStatuses.findIndex((item) => item.status === status);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

  return orderStatuses.map((item, index) => ({
    ...item,
    completed: index <= safeCurrentIndex,
  }));
}

export default function OrderTrackingPage() {
  const [searchType, setSearchType] = useState<"phone" | "order">("phone");
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [statuses, setStatuses] = useState<TrackingStatus[]>(orderStatuses.map((item) => ({ ...item, completed: false })));
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) {
      setError("Хайх утга оруулна уу.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      setOrder(null);

      const results = await api.trackOrder({
        phone: searchType === "phone" ? trimmedValue : "",
        orderNumber: searchType === "order" ? trimmedValue : "",
      });
      const nextOrder = results[0];

      if (!nextOrder) {
        setError("Ийм захиалга олдсонгүй.");
        setStatuses(orderStatuses.map((item) => ({ ...item, completed: false })));
        return;
      }

      setOrder(nextOrder);
      setStatuses(getTimelineStatuses(nextOrder.status));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Захиалгын мэдээлэл ачаалж чадсангүй.");
      setStatuses(orderStatuses.map((item) => ({ ...item, completed: false })));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader productLinkLabel="Бүтээгдэхүүн" showCart={false} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Нүүр хуудас
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Захиалгын төлөв шалгах
          </h1>
          <p className="text-gray-600 text-lg">Утасны дугаар эсвэл захиалгын дугаараар хайна уу</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <OrderTrackingForm
            handleSearch={handleSearch}
            searchType={searchType}
            searchValue={searchValue}
            setSearchType={setSearchType}
            setSearchValue={setSearchValue}
          />
        </motion.div>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-8">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Захиалгын мэдээлэл ачаалж байна...</p>
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </motion.div>
        )}

        {!isLoading && order && <OrderTrackingResult order={order} statuses={statuses} />}

        {!isLoading && !order && !error && !hasSearched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center text-gray-500 py-12">
            <Package className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p>Захиалга хайхын тулд утасны дугаар эсвэл захиалгын дугаараа оруулна уу</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
