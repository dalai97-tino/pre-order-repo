import { motion } from "motion/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "../../lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
