import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export function OrderSummary({
  itemCount,
  totalPrice,
  totalDeposit,
  remainingPayment,
  isSubmitting = false,
  error,
  onSubmit,
}: {
  itemCount: number;
  totalPrice: number;
  totalDeposit: number;
  remainingPayment: number;
  isSubmitting?: boolean;
  error?: string | null;
  onSubmit: () => void;
}) {
  return (
    <Card className="rounded-2xl sticky top-24">
      <CardHeader>
        <CardTitle>Захиалгын дүн</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Бараа ({itemCount})</span>
            <span className="font-semibold">{totalPrice.toLocaleString()}₮</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Хүргэлт</span>
            <span className="font-semibold text-green-600">Үнэгүй</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold">Нийт үнэ</span>
            <span className="text-2xl font-bold text-purple-600">{totalPrice.toLocaleString()}₮</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Урьдчилгаа төлбөр</span>
            <span className="text-xl font-bold text-blue-600">{totalDeposit.toLocaleString()}₮</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Үлдэгдэл төлбөр</span>
            <span className="font-semibold text-gray-700">{remainingPayment.toLocaleString()}₮</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">*Барааг хүлээн авахдаа үлдэх төлбөрийг төлнө үү</p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-xl"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            {isSubmitting ? "Захиалга илгээж байна..." : "Захиалга баталгаажуулах"}
          </Button>
        </motion.div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Захиалга баталгаажуулснаар та <br />
            <span className="text-purple-600 font-medium">үйлчилгээний нөхцөлийг</span> зөвшөөрч байна
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
