import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CustomerHeader } from "./CustomerHeader";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";
import { categories } from "../../lib/mock-data";
import { api } from "../../lib/api";
import type { Product } from "../../lib/types";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Бүгд");
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [statusFilter, setStatusFilter] = useState({
    available: true,
    preOrder: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const products = await api.getProducts();
        if (isMounted) {
          setProducts(products);
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Бүтээгдэхүүн ачаалж чадсангүй");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "Бүгд" || product.category === selectedCategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const statusMatch =
      (statusFilter.available && product.status === "available") ||
      (statusFilter.preOrder && product.status === "pre-order");
    return categoryMatch && priceMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Бүтээгдэхүүн</h1>
          <ProductFilters
            categories={categories}
            priceRange={priceRange}
            selectedCategory={selectedCategory}
            setPriceRange={setPriceRange}
            setSelectedCategory={setSelectedCategory}
            setShowFilters={setShowFilters}
            setStatusFilter={setStatusFilter}
            showFilters={showFilters}
            statusFilter={statusFilter}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {isLoading && (
            <p className="text-gray-600 mb-6">Бүтээгдэхүүн ачаалж байна...</p>
          )}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              Бүтээгдэхүүн ачаалж чадсангүй. {error}
            </div>
          )}
          {!isLoading && !error && (
            <>
              <p className="text-gray-600 mb-6">{filteredProducts.length} бүтээгдэхүүн олдлоо</p>
              <ProductGrid products={filteredProducts} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
