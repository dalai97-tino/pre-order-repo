import { motion } from "motion/react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ProductCard } from "./ProductCard";
import { CustomerHeader } from "./CustomerHeader";
import { Link } from "react-router-dom";
import { categories, featuredProducts, steps } from "../../lib/mock-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <CustomerHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Хятадаас хүссэн бараагаа
            <br />
            урьдчилан захиалаарай
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto mb-8"
          >
            Хямд үнэтэй, чанартай бараа. Урьдчилгаа төлж захиалаад, Монголд ирэхэд нь хүлээн авна уу.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Ямар бараа хайж байна вэ?"
              className="pl-12 h-14 text-lg rounded-full shadow-lg border-2 border-gray-200 focus:border-purple-400"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8">
              Хайх
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={`/products?category=${category}`}>
                <Button
                  variant="outline"
                  className="rounded-full px-6 h-10 border-2 hover:border-purple-400 hover:bg-purple-50"
                >
                  {category}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Онцлох бүтээгдэхүүн</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <ProductCard product={product} rounded="" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Хэрхэн ажилладаг вэ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="relative"
                >
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white mb-4 shadow-lg"
                    >
                      <Icon className="w-8 h-8" />
                    </motion.div>
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-purple-600 border-2 border-purple-600">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                MongolShop
              </h3>
              <p className="text-gray-400">
                Хятадаас чанартай бараа урьдчилан захиалах үйлчилгээ
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Холбоо барих</h4>
              <p className="text-gray-400">Утас: +976 9999-9999</p>
              <p className="text-gray-400">И-мэйл: info@mongolshop.mn</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Цагийн хуваарь</h4>
              <p className="text-gray-400">Даваа - Баасан: 9:00 - 18:00</p>
              <p className="text-gray-400">Бямба: 10:00 - 16:00</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2026 MongolShop. Бүх эрх хуулиар хамгаалагдсан.
          </div>
        </div>
      </footer>
    </div>
  );
}
