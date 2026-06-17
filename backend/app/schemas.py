from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from .models import OrderStatus, PaymentStatus, ProductStatus


class ProductBase(BaseModel):
    name: str
    sku: str
    category: str
    price: float
    deposit: float
    china_price: float | None = None
    image: str
    status: ProductStatus = ProductStatus.available
    estimated_arrival: str
    stock: int = 0
    description: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    sku: str | None = None
    category: str | None = None
    price: float | None = None
    deposit: float | None = None
    china_price: float | None = None
    image: str | None = None
    status: ProductStatus | None = None
    estimated_arrival: str | None = None
    stock: int | None = None
    description: str | None = None


class ProductRead(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CustomerBase(BaseModel):
    name: str
    phone: str
    address: str
    note: str | None = None


class CustomerRead(CustomerBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminRead(BaseModel):
    id: int
    email: str
    full_name: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class AdminLogin(BaseModel):
    email: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminRead


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer: CustomerBase
    items: list[OrderItemCreate] = Field(min_length=1)


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    deposit: float
    product: ProductRead

    model_config = ConfigDict(from_attributes=True)


class PaymentRead(BaseModel):
    id: int
    status: PaymentStatus
    paid_amount: float
    method: str | None = None
    payment_note: str | None = None
    transaction_ref: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderRead(BaseModel):
    id: int
    order_number: str
    status: OrderStatus
    total_price: float
    deposit_amount: float
    remaining_amount: float
    estimated_arrival: str | None = None
    admin_note: str | None = None
    created_at: datetime
    updated_at: datetime
    customer: CustomerRead
    items: list[OrderItemRead]
    payment: PaymentRead | None = None

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    admin_note: str | None = None


class OrderPaymentUpdate(BaseModel):
    paid_amount: float = Field(ge=0)
    payment_status: PaymentStatus
    payment_note: str | None = None


class DashboardSummary(BaseModel):
    total_orders: int
    new_orders: int
    in_transit_orders: int
    total_revenue: float
    total_deposits: float
    total_remaining: float
    total_customers: int


class FinanceSummary(BaseModel):
    total_revenue: float
    total_deposits: float
    total_remaining: float
    paid_orders: int
    pending_orders: int


class ShopSettingsBase(BaseModel):
    shop_name: str
    phone: str
    email: str
    address: str
    delivery_fee: float
    deposit_percent: int
    bank_name: str
    bank_account: str
    bank_holder: str


class ShopSettingsRead(ShopSettingsBase):
    id: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ShopSettingsUpdate(BaseModel):
    shop_name: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    delivery_fee: float | None = None
    deposit_percent: int | None = None
    bank_name: str | None = None
    bank_account: str | None = None
    bank_holder: str | None = None


class AiChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    customer_phone: str | None = None
    order_number: str | None = None


class AiChatResponse(BaseModel):
    reply: str
