import { motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import type { CartItem } from "../../lib/types";

export function CartItemRow({
  item,
  index,
  updateQuantity,
  removeItem,
}: {
  item: CartItem;
  index: number;
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                <span className="text-purple-600 font-bold">{item.price.toLocaleString()}₮</span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-600">Урьдчилгаа: {item.deposit.toLocaleString()}₮</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-100">
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="px-4 font-semibold">{item.quantity}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-100">
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
