import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import type { Product } from "../../lib/types";

export function ProductCard({ product, rounded = "rounded-xl" }: { product: Product; rounded?: string }) {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className={`overflow-hidden border-2 hover:border-purple-400 hover:shadow-xl transition-all duration-300 ${rounded}`}>
        <div className="relative">
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
          <Badge className={`absolute top-3 right-3 ${product.status === "available" ? "bg-green-500" : "bg-orange-500"}`}>
            {product.status === "available" ? "Бэлэн" : "Урьдчилан"}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Үнэ:</span>
              <span className="text-lg font-bold text-purple-600">{product.price.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Урьдчилгаа:</span>
              <span className="text-md font-semibold text-blue-600">{product.deposit.toLocaleString()}₮</span>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Truck className="w-4 h-4" />
              {product.estimatedArrival}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">Дэлгэрэнгүй</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
