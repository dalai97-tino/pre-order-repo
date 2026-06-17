import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

export function CustomerHeader({
  showCart = true,
  productLinkLabel,
}: {
  showCart?: boolean;
  productLinkLabel?: string;
}) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            MongolShop
          </Link>
          <div className="flex items-center gap-4">
            {productLinkLabel ? (
              <Link to="/products">
                <Button variant="ghost" size="sm">{productLinkLabel}</Button>
              </Link>
            ) : (
              <Link to="/orders">
                <Button variant="ghost" size="sm">Миний захиалга</Button>
              </Link>
            )}
            {showCart && (
              <Link to="/cart">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Сагс
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
