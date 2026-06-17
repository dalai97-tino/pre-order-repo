import { motion } from "motion/react";
import { CheckCircle, Copy, Phone, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import confetti from "canvas-confetti";
import { useEffect, useMemo } from "react";

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderNumber = useMemo(() => {
    const state = location.state as { orderNumber?: string } | null;
    return state?.orderNumber ?? "MN" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }, [location.state]);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333ea', '#3b82f6', '#ec4899']
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="rounded-3xl shadow-2xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                <CheckCircle className="w-24 h-24 text-green-500 relative" strokeWidth={2} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Захиалга амжилттай!
              </h1>
              <p className="text-gray-600 text-lg">
                Таны захиалга амжилттай хүлээн авлаа
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">Захиалгын дугаар</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigator.clipboard.writeText(orderNumber)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Copy className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-3xl font-bold text-purple-600 tracking-wider">{orderNumber}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 mb-8"
            >
              <Card className="rounded-xl bg-white border-2 border-purple-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    Урьдчилгаа төлбөр төлөх
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Хаан банк</span>
                      <span className="font-mono font-semibold">5123 4567 8901 2345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Нэр</span>
                      <span className="font-semibold">Б.Батбаяр</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Дүн</span>
                      <span className="text-xl font-bold text-purple-600">55,000₮</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      *Гүйлгээний утга: {orderNumber}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl bg-white border-2 border-blue-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    Захиалгын төлөв шалгах
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Урьдчилгаа төлсний дараа таны захиалга баталгаажиж, Хятадаас захиалагдана.
                    Захиалгын явцыг доорх товчоор шалгана уу.
                  </p>
                  <Link to="/orders">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                      Захиалгын төлөв шалгах
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 rounded-2xl p-6 mb-6"
            >
              <h3 className="font-bold mb-4 text-center">Холбоо барих</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Утас</p>
                    <p className="font-semibold">+976 9999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Байршил</p>
                    <p className="font-semibold">УБ, Сүхбаатар дүүрэг</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full rounded-xl h-12 border-2">
                  Нүүр хуудас
                </Button>
              </Link>
              <Link to="/products" className="flex-1">
                <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-purple-600 to-blue-600">
                  Үргэлжлүүлэн худалдан авах
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
