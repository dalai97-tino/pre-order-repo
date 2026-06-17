import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function OrderTrackingForm({
  searchType,
  setSearchType,
  searchValue,
  setSearchValue,
  handleSearch,
}: {
  searchType: "phone" | "order";
  setSearchType: (value: "phone" | "order") => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleSearch: () => void;
}) {
  return (
    <Card className="rounded-2xl shadow-lg mb-8">
      <CardContent className="p-6">
        <Tabs value={searchType} onValueChange={(v) => setSearchType(v as "phone" | "order")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phone">Утасны дугаар</TabsTrigger>
            <TabsTrigger value="order">Захиалгын дугаар</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={searchType === "phone" ? "Утасны дугаараа оруулна уу" : "Захиалгын дугаараа оруулна уу"}
              className="pl-12 h-14 text-lg rounded-xl"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} className="h-14 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">Хайх</Button>
        </div>
      </CardContent>
    </Card>
  );
}
