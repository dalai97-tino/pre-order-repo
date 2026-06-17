import { motion } from "motion/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

export function ProductFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  showFilters,
  setShowFilters,
  priceRange,
  setPriceRange,
  statusFilter,
  setStatusFilter,
}: {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  statusFilter: { available: boolean; preOrder: boolean };
  setStatusFilter: (value: { available: boolean; preOrder: boolean }) => void;
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="Бараа хайх..." className="pl-12 h-12 rounded-xl" />
        </div>
        <Button variant="outline" className="sm:w-auto rounded-xl" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Шүүлтүүр
        </Button>
        <Select defaultValue="popular">
          <SelectTrigger className="sm:w-48 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Алдартай</SelectItem>
            <SelectItem value="price-low">Үнэ: Багаас их</SelectItem>
            <SelectItem value="price-high">Үнэ: Ихээс бага</SelectItem>
            <SelectItem value="newest">Шинэ бараа</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full ${selectedCategory === category ? "bg-gradient-to-r from-purple-600 to-blue-600" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={false}
        animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Card className="p-6 mb-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Үнэ ({priceRange[0].toLocaleString()}₮ - {priceRange[1].toLocaleString()}₮)</Label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={300000} step={10000} className="mb-4" />
            </div>
            <div>
              <Label className="text-base font-semibold mb-4 block">Төлөв</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="available" checked={statusFilter.available} onCheckedChange={(checked) => setStatusFilter({ ...statusFilter, available: checked as boolean })} />
                  <Label htmlFor="available" className="cursor-pointer">Бэлэн байгаа</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="preOrder" checked={statusFilter.preOrder} onCheckedChange={(checked) => setStatusFilter({ ...statusFilter, preOrder: checked as boolean })} />
                  <Label htmlFor="preOrder" className="cursor-pointer">Урьдчилан захиалах</Label>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
