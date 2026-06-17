from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import Base, SessionLocal, engine, settings
from .auth import hash_password
from .models import AdminUser, Customer, Order, OrderItem, OrderStatus, Payment, PaymentStatus, Product, ProductStatus, ShopSettings
from .routers import admin, admin_auth, ai, orders, products

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173",
]

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin_auth.router)
app.include_router(admin.router)
app.include_router(ai.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_schema()
    with SessionLocal() as db:
        seed_data(db)
        seed_admin(db)


def ensure_schema() -> None:
    if engine.dialect.name == "postgresql":
        with engine.begin() as connection:
            connection.execute(text("ALTER TYPE paymentstatus ADD VALUE IF NOT EXISTS 'deposit_paid'"))

    inspector = inspect(engine)
    payment_columns = {column["name"] for column in inspector.get_columns("payments")}
    if "payment_note" not in payment_columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE payments ADD COLUMN payment_note TEXT"))


def seed_data(db: Session) -> None:
    if db.scalar(select(Product.id).limit(1)):
        return

    product_rows = [
        Product(
            name="Xiaomi Redmi Buds 5 Pro",
            sku="SW-2048",
            category="Электроникс",
            price=185000,
            deposit=55000,
            china_price=120000,
            image="https://images.unsplash.com/photo-1606400082777-ef05f3c5cde9?w=400",
            status=ProductStatus.available,
            estimated_arrival="7-10 хоног",
            stock=42,
            description="Дуу чимээг бууруулах утасгүй чихэвч.",
        ),
        Product(
            name="LED гэрэлт толь",
            sku="BT-3101",
            category="Гоо сайхан",
            price=95000,
            deposit=30000,
            china_price=62000,
            image="https://images.unsplash.com/photo-1618220179428-22790b461013?w=400",
            status=ProductStatus.available,
            estimated_arrival="5-7 хоног",
            stock=18,
            description="Гэрэлтүүлэгтэй гоо сайхны толь.",
        ),
        Product(
            name="Утасгүй зөөврийн чанга яригч",
            sku="AU-3810",
            category="Электроникс",
            price=75000,
            deposit=25000,
            china_price=48000,
            image="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
            status=ProductStatus.pre_order,
            estimated_arrival="10-15 хоног",
            stock=9,
            description="Зөөврийн Bluetooth чанга яригч.",
        ),
    ]
    db.add_all(product_rows)
    db.flush()

    customer = Customer(
        name="Б. Энхбат",
        phone="99119911",
        address="СБД, 1-р хороо, Их тэнгэр комплекс 201 тоот",
    )
    db.add(customer)
    db.flush()

    order = Order(
        order_number="MN9X4K2L7P",
        customer_id=customer.id,
        status=OrderStatus.in_transit,
        total_price=280000,
        deposit_amount=85000,
        remaining_amount=195000,
        estimated_arrival="2026-06-10 - 2026-06-15",
    )
    db.add(order)
    db.flush()

    db.add_all(
        [
            OrderItem(order_id=order.id, product_id=product_rows[0].id, quantity=1, unit_price=185000, deposit=55000),
            OrderItem(order_id=order.id, product_id=product_rows[1].id, quantity=1, unit_price=95000, deposit=30000),
        ]
    )
    db.add(Payment(order_id=order.id, status=PaymentStatus.partial, paid_amount=85000, method="bank_transfer", payment_note="Хаан банк шилжүүлэг"))
    db.add(
        ShopSettings(
            shop_name="Zaya Shop Mongolia",
            phone="+976 9911 0022",
            email="orders@zayashop.mn",
            address="Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо",
            delivery_fee=5000,
            deposit_percent=30,
            bank_name="Хаан банк",
            bank_account="5000 1234 56",
            bank_holder="Zaya Shop",
        )
    )
    db.commit()


def seed_admin(db: Session) -> None:
    admin = db.scalar(select(AdminUser).where(AdminUser.email == settings.admin_email))
    if admin:
        return

    db.add(
        AdminUser(
            email=settings.admin_email,
            password_hash=hash_password(settings.admin_password),
            full_name="Admin User",
            is_active=True,
        )
    )
    db.commit()
