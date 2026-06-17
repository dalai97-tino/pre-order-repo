from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class ProductStatus(str, Enum):
    available = "available"
    pre_order = "pre-order"
    inactive = "inactive"


class OrderStatus(str, Enum):
    new = "new"
    deposit_paid = "deposit_paid"
    ordered_from_china = "ordered_from_china"
    in_transit = "in_transit"
    arrived_mongolia = "arrived_mongolia"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    cancelled = "cancelled"


class PaymentStatus(str, Enum):
    pending = "pending"
    deposit_paid = "deposit_paid"
    paid = "paid"
    partial = "partial"
    refunded = "refunded"


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(120), index=True)
    price: Mapped[float] = mapped_column(Numeric(12, 2))
    deposit: Mapped[float] = mapped_column(Numeric(12, 2))
    china_price: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    image: Mapped[str] = mapped_column(Text)
    status: Mapped[ProductStatus] = mapped_column(SAEnum(ProductStatus), default=ProductStatus.available)
    estimated_arrival: Mapped[str] = mapped_column(String(80))
    stock: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    order_items: Mapped[list["OrderItem"]] = relationship(back_populates="product")


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(32), index=True)
    address: Mapped[str] = mapped_column(Text)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    orders: Mapped[list["Order"]] = relationship(back_populates="customer")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_number: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    status: Mapped[OrderStatus] = mapped_column(SAEnum(OrderStatus), default=OrderStatus.new, index=True)
    total_price: Mapped[float] = mapped_column(Numeric(12, 2))
    deposit_amount: Mapped[float] = mapped_column(Numeric(12, 2))
    remaining_amount: Mapped[float] = mapped_column(Numeric(12, 2))
    estimated_arrival: Mapped[str | None] = mapped_column(String(120), nullable=True)
    admin_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    customer: Mapped[Customer] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    payment: Mapped["Payment | None"] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[float] = mapped_column(Numeric(12, 2))
    deposit: Mapped[float] = mapped_column(Numeric(12, 2))

    order: Mapped[Order] = relationship(back_populates="items")
    product: Mapped[Product] = relationship(back_populates="order_items")


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), unique=True)
    status: Mapped[PaymentStatus] = mapped_column(SAEnum(PaymentStatus), default=PaymentStatus.pending)
    paid_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    method: Mapped[str | None] = mapped_column(String(80), nullable=True)
    payment_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    transaction_ref: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    order: Mapped[Order] = relationship(back_populates="payment")


class ShopSettings(Base):
    __tablename__ = "shop_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    shop_name: Mapped[str] = mapped_column(String(255), default="Zaya Shop Mongolia")
    phone: Mapped[str] = mapped_column(String(32), default="+976 9911 0022")
    email: Mapped[str] = mapped_column(String(255), default="orders@zayashop.mn")
    address: Mapped[str] = mapped_column(Text, default="Улаанбаатар хот")
    delivery_fee: Mapped[float] = mapped_column(Numeric(12, 2), default=5000)
    deposit_percent: Mapped[int] = mapped_column(Integer, default=30)
    bank_name: Mapped[str] = mapped_column(String(120), default="Хаан банк")
    bank_account: Mapped[str] = mapped_column(String(80), default="5000 1234 56")
    bank_holder: Mapped[str] = mapped_column(String(255), default="Zaya Shop")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
