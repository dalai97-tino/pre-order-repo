import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { CheckoutFormData } from "../../lib/types";

export function CheckoutForm({
  formData,
  setFormData,
}: {
  formData: CheckoutFormData;
  setFormData: (value: CheckoutFormData) => void;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Хүргэлтийн мэдээлэл</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Нэр *</Label>
          <Input id="name" placeholder="Таны нэр" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 rounded-lg" />
        </div>
        <div>
          <Label htmlFor="phone">Утасны дугаар *</Label>
          <Input id="phone" placeholder="99999999" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 rounded-lg" />
        </div>
        <div>
          <Label htmlFor="address">Хаяг *</Label>
          <Textarea id="address" placeholder="Хүргэх хаяг" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1 rounded-lg" rows={3} />
        </div>
        <div>
          <Label htmlFor="note">Нэмэлт тэмдэглэл</Label>
          <Textarea id="note" placeholder="Хүсэлт, тэмдэглэл..." value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="mt-1 rounded-lg" rows={2} />
        </div>
      </CardContent>
    </Card>
  );
}
