import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { CustomerHeader } from "./CustomerHeader";
import { CartItemRow } from "./CartItemRow";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";
import { cartItems as mockCartItems } from "../../lib/mock-data";
import { api } from "../../lib/api";
import type { CheckoutFormData } from "../../lib/types";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(mockCartItems);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDeposit = items.reduce((sum, item) => sum + item.deposit * item.quantity, 0);
  const remainingPayment = totalPrice - totalDeposit;

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const order = await api.createOrder({
        customer: formData,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });
      navigate("/order-success", {
        state: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Захиалга үүсгэж чадсангүй");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader showCart={false} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/products" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Үргэлжлүүлэн худалдан авах
          </Link>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8">
          Таны сагс ({items.length})
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <CartItemRow
                index={index}
                item={item}
                key={item.id}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
              />
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <CheckoutForm formData={formData} setFormData={setFormData} />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <OrderSummary
              error={submitError}
              isSubmitting={isSubmitting}
              itemCount={items.length}
              onSubmit={handleSubmitOrder}
              remainingPayment={remainingPayment}
              totalDeposit={totalDeposit}
              totalPrice={totalPrice}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
