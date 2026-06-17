import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Truck, Package, Shield, Minus, Plus, ChevronLeft } from "lucide-react";
import { CustomerHeader } from "./CustomerHeader";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ApiError, api } from "../../lib/api";
import type { Product } from "../../lib/types";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      if (!id) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setNotFound(false);
        const product = await api.getProductById(id);
        if (isMounted) {
          setProductData(product);
          setSelectedImage(0);
        }
      } catch (error) {
        if (isMounted) {
          if (error instanceof ApiError && error.status === 404) {
            setNotFound(true);
          } else {
            setError(error instanceof Error ? error.message : "Бүтээгдэхүүн ачаалж чадсангүй");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/products" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Буцах
          </Link>
          <Card className="p-8 rounded-2xl">
            <p className="text-gray-600">Бүтээгдэхүүн ачаалж байна...</p>
          </Card>
        </div>
      </div>
    );
  }

  if (error || notFound || !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/products" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Буцах
          </Link>
          <Card className="p-8 rounded-2xl">
            <h1 className="text-2xl font-bold mb-2">{notFound ? "Бүтээгдэхүүн олдсонгүй" : "Бүтээгдэхүүн ачаалж чадсангүй"}</h1>
            <p className="text-gray-600">{notFound ? "Сонгосон бүтээгдэхүүн байхгүй байна." : error}</p>
          </Card>
        </div>
      </div>
    );
  }

  const images = productData.images ?? [productData.image];

  const totalPrice = productData.price * quantity;
  const totalDeposit = productData.deposit * quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/products" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Буцах
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden rounded-2xl">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[selectedImage]}
                alt={productData.name}
                className="w-full h-96 object-cover"
              />
            </Card>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className="cursor-pointer"
                >
                  <Card className={`overflow-hidden rounded-xl border-2 ${
                    selectedImage === index ? "border-purple-600" : "border-gray-200"
                  }`}>
                    <img
                      src={image}
                      alt={`${productData.name} ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="mb-3 bg-purple-100 text-purple-700 hover:bg-purple-200">
                  {productData.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{productData.name}</h1>
              </div>
              <Badge className={productData.status === "available" ? "bg-green-500" : "bg-orange-500"}>
                {productData.status === "available" ? "Бэлэн байгаа" : "Урьдчилан захиалах"}
              </Badge>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Нийт үнэ</p>
                  <p className="text-3xl font-bold text-purple-600">{productData.price.toLocaleString()}₮</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Урьдчилгаа</p>
                  <p className="text-2xl font-bold text-blue-600">{productData.deposit.toLocaleString()}₮</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Хятадын үнэ: {(productData.chinaPrice ?? 0).toLocaleString()}₮</span>
              </div>
            </div>

            <Card className="p-6 mb-6 rounded-2xl bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Хүргэлтийн мэдээлэл</p>
                  <p className="text-sm text-blue-700">
                    Хүлээгдэж буй хугацаа: <span className="font-semibold">{productData.estimatedArrival}</span>
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Урьдчилгаа төлсний дараа таны бараа Хятадаас захиалагдаж, Монголд хүргэгдэнэ.
                  </p>
                </div>
              </div>
            </Card>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Тоо ширхэг</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="px-8 font-semibold text-lg">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-600">Нийт урьдчилгаа</p>
                  <p className="text-2xl font-bold text-purple-600">{totalDeposit.toLocaleString()}₮</p>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/cart">
                <Button className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:shadow-xl transition-shadow">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Урьдчилан захиалах
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-4 text-center rounded-xl">
                <Shield className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <p className="text-xs text-gray-600">Баталгаатай</p>
              </Card>
              <Card className="p-4 text-center rounded-xl">
                <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs text-gray-600">Үнэгүй хүргэлт</p>
              </Card>
              <Card className="p-4 text-center rounded-xl">
                <Package className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-xs text-gray-600">Жинхэнэ бараа</p>
              </Card>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="description" className="rounded-none border-b-2 data-[state=active]:border-purple-600">
                Тайлбар
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-none border-b-2 data-[state=active]:border-purple-600">
                Онцлог
              </TabsTrigger>
              <TabsTrigger value="specifications" className="rounded-none border-b-2 data-[state=active]:border-purple-600">
                Техник үзүүлэлт
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card className="p-6 rounded-2xl">
                  <p className="text-gray-700 leading-relaxed">{productData.description}</p>
              </Card>
            </TabsContent>
            <TabsContent value="features" className="mt-6">
              <Card className="p-6 rounded-2xl">
                <ul className="space-y-3">
                  {(productData.features ?? []).map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mt-2" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <Card className="p-6 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(productData.specifications ?? {}).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between py-3 border-b border-gray-200"
                    >
                      <span className="font-semibold text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
