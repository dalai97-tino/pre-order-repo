from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.database import Base, SessionLocal, engine, settings
from app.main import ensure_schema
from app.models import (
    AdminUser,
    Customer,
    Order,
    OrderItem,
    OrderStatus,
    Payment,
    PaymentStatus,
    Product,
    ProductStatus,
    ShopSettings,
)


PRODUCTS = [
    {
        "name": "Xiaomi Redmi Buds 5 Pro",
        "sku": "EL-REDMI-BUDS-5-PRO",
        "category": "Электроникс",
        "price": 185000,
        "deposit": 55000,
        "china_price": 120000,
        "image": "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde9?w=800",
        "status": ProductStatus.available,
        "estimated_arrival": "7-10 хоног",
        "stock": 42,
        "description": "Дуу чимээг бууруулах, удаан цэнэг барих утасгүй чихэвч.",
    },
    {
        "name": "LED гэрэлт нүүр будалтын толь",
        "sku": "BT-LED-MIRROR-01",
        "category": "Гоо сайхан",
        "price": 95000,
        "deposit": 30000,
        "china_price": 62000,
        "image": "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800",
        "status": ProductStatus.available,
        "estimated_arrival": "5-7 хоног",
        "stock": 18,
        "description": "Гурван өнгийн гэрэлтэй, ширээний нүүр будалтын толь.",
    },
    {
        "name": "Anker Soundcore Mini speaker",
        "sku": "AU-SOUNDCORE-MINI",
        "category": "Аудио",
        "price": 75000,
        "deposit": 25000,
        "china_price": 48000,
        "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
        "status": ProductStatus.pre_order,
        "estimated_arrival": "10-15 хоног",
        "stock": 9,
        "description": "Bluetooth холболттой жижиг, зөөврийн чанга яригч.",
    },
    {
        "name": "Baseus 20,000mAh power bank",
        "sku": "EL-BASEUS-PB-20000",
        "category": "Электроникс",
        "price": 125000,
        "deposit": 40000,
        "china_price": 82000,
        "image": "https://images.unsplash.com/photo-1609592424823-26f7b4ea8519?w=800",
        "status": ProductStatus.available,
        "estimated_arrival": "7-12 хоног",
        "stock": 25,
        "description": "Type-C fast charge дэмждэг өндөр багтаамжтай power bank.",
    },
    {
        "name": "Мини проектор 1080P",
        "sku": "EL-MINI-PROJECTOR-1080",
        "category": "Гэр ахуй",
        "price": 320000,
        "deposit": 100000,
        "china_price": 235000,
        "image": "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800",
        "status": ProductStatus.pre_order,
        "estimated_arrival": "14-21 хоног",
        "stock": 6,
        "description": "Гэрийн кино үзэхэд тохиромжтой HDMI/USB оролттой проектор.",
    },
    {
        "name": "Эвхэгддэг laptop stand",
        "sku": "OF-LAPTOP-STAND-AL",
        "category": "Оффис",
        "price": 68000,
        "deposit": 20000,
        "china_price": 39000,
        "image": "https://images.unsplash.com/photo-1616627988792-51e2f4c9fc9f?w=800",
        "status": ProductStatus.available,
        "estimated_arrival": "5-9 хоног",
        "stock": 31,
        "description": "Хөнгөн цагаан, өндрийн тохируулгатай laptop тавиур.",
    },
]

ORDERS = [
    {
        "order_number": "MN-DEMO-1001",
        "customer": {
            "name": "Б. Энхбат",
            "phone": "99119911",
            "address": "СБД, 1-р хороо, Их тэнгэр комплекс 201 тоот",
            "note": "Орой 18:00 цагаас хойш хүргүүлэх",
        },
        "items": [("EL-REDMI-BUDS-5-PRO", 1), ("BT-LED-MIRROR-01", 1)],
        "status": OrderStatus.in_transit,
        "payment_status": PaymentStatus.partial,
        "paid_amount": 85000,
        "method": "bank_transfer",
        "payment_note": "Урьдчилгаа шилжүүлсэн",
        "estimated_arrival": "2026-06-20 - 2026-06-25",
        "admin_note": "China warehouse-оос гарсан.",
    },
    {
        "order_number": "MN-DEMO-1002",
        "customer": {
            "name": "О. Номин",
            "phone": "88002211",
            "address": "ХУД, 15-р хороо, Рапид харш C байр",
            "note": None,
        },
        "items": [("EL-MINI-PROJECTOR-1080", 1)],
        "status": OrderStatus.deposit_paid,
        "payment_status": PaymentStatus.deposit_paid,
        "paid_amount": 100000,
        "method": "qpay",
        "payment_note": "QPay урьдчилгаа",
        "estimated_arrival": "14-21 хоног",
        "admin_note": "Захиалга баталгаажсан.",
    },
    {
        "order_number": "MN-DEMO-1003",
        "customer": {
            "name": "Д. Тэмүүлэн",
            "phone": "99003344",
            "address": "БЗД, 26-р хороо, Олимп хотхон",
            "note": "Агуулах дээрээс авна",
        },
        "items": [("OF-LAPTOP-STAND-AL", 2), ("EL-BASEUS-PB-20000", 1)],
        "status": OrderStatus.new,
        "payment_status": PaymentStatus.pending,
        "paid_amount": 0,
        "method": None,
        "payment_note": "Төлбөр хүлээгдэж байна",
        "estimated_arrival": "7-12 хоног",
        "admin_note": None,
    },
]


def upsert_products(db: Session) -> dict[str, Product]:
    products_by_sku: dict[str, Product] = {}
    created = 0
    updated = 0

    for product_data in PRODUCTS:
        product = db.scalar(select(Product).where(Product.sku == product_data["sku"]))
        if product:
            for key, value in product_data.items():
                setattr(product, key, value)
            updated += 1
        else:
            product = Product(**product_data)
            db.add(product)
            created += 1
        products_by_sku[product_data["sku"]] = product

    db.flush()
    print(f"Products: {created} created, {updated} updated")
    return products_by_sku


def ensure_admin(db: Session) -> None:
    admin = db.scalar(select(AdminUser).where(AdminUser.email == settings.admin_email))
    if admin:
        admin.password_hash = hash_password(settings.admin_password)
        admin.full_name = admin.full_name or "Admin User"
        admin.is_active = True
        print(f"Admin: updated ({settings.admin_email})")
        return

    db.add(
        AdminUser(
            email=settings.admin_email,
            password_hash=hash_password(settings.admin_password),
            full_name="Admin User",
            is_active=True,
        )
    )
    print(f"Admin: created ({settings.admin_email})")


def ensure_shop_settings(db: Session) -> None:
    settings_row = db.scalar(select(ShopSettings).limit(1))
    payload = {
        "shop_name": "Zaya Shop Mongolia",
        "phone": "+976 9911 0022",
        "email": "orders@zayashop.mn",
        "address": "Улаанбаатар хот, Баянзүрх дүүрэг, 26-р хороо",
        "delivery_fee": 5000,
        "deposit_percent": 30,
        "bank_name": "Хаан банк",
        "bank_account": "5000 1234 56",
        "bank_holder": "Zaya Shop",
    }

    if settings_row:
        for key, value in payload.items():
            setattr(settings_row, key, value)
        print("Shop settings: updated")
    else:
        db.add(ShopSettings(**payload))
        print("Shop settings: created")


def ensure_orders(db: Session, products_by_sku: dict[str, Product]) -> None:
    created = 0
    skipped = 0

    for order_data in ORDERS:
        existing = db.scalar(select(Order).where(Order.order_number == order_data["order_number"]))
        if existing:
            skipped += 1
            continue

        customer = Customer(**order_data["customer"])
        db.add(customer)
        db.flush()

        total_price = 0.0
        deposit_amount = 0.0
        order = Order(
            order_number=order_data["order_number"],
            customer_id=customer.id,
            status=order_data["status"],
            total_price=0,
            deposit_amount=0,
            remaining_amount=0,
            estimated_arrival=order_data["estimated_arrival"],
            admin_note=order_data["admin_note"],
        )
        db.add(order)
        db.flush()

        for sku, quantity in order_data["items"]:
            product = products_by_sku[sku]
            total_price += float(product.price) * quantity
            deposit_amount += float(product.deposit) * quantity
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=quantity,
                    unit_price=product.price,
                    deposit=product.deposit,
                )
            )

        order.total_price = total_price
        order.deposit_amount = deposit_amount
        order.remaining_amount = total_price - deposit_amount
        db.add(
            Payment(
                order_id=order.id,
                status=order_data["payment_status"],
                paid_amount=order_data["paid_amount"],
                method=order_data["method"],
                payment_note=order_data["payment_note"],
            )
        )
        created += 1

    print(f"Orders: {created} created, {skipped} skipped")


def main() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_schema()

    with SessionLocal() as db:
        products_by_sku = upsert_products(db)
        ensure_admin(db)
        ensure_shop_settings(db)
        ensure_orders(db, products_by_sku)
        db.commit()

    print("Seed complete.")


if __name__ == "__main__":
    main()
