from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..auth import get_current_admin
from ..database import get_db
from ..models import Customer, Order, OrderItem, OrderStatus, Payment, PaymentStatus, Product, ProductStatus, ShopSettings
from ..schemas import DashboardSummary, FinanceSummary, OrderPaymentUpdate, OrderRead, OrderStatusUpdate, ProductCreate, ProductRead, ProductUpdate, ShopSettingsRead, ShopSettingsUpdate

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


def _order_query():
    return (
        select(Order)
        .options(
            selectinload(Order.customer),
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.payment),
        )
    )


def _settings(db: Session) -> ShopSettings:
    settings = db.scalar(select(ShopSettings).order_by(ShopSettings.id).limit(1))
    if not settings:
        settings = ShopSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


@router.post("/products", response_model=ProductRead, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> Product:
    existing = db.scalar(select(Product).where(Product.sku == payload.sku))
    if existing:
        raise HTTPException(status_code=409, detail="Product SKU already exists")

    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/products/{product_id}", response_model=ProductRead)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    updates = payload.model_dump(exclude_unset=True)
    if "sku" in updates:
        existing = db.scalar(select(Product).where(Product.sku == updates["sku"], Product.id != product_id))
        if existing:
            raise HTTPException(status_code=409, detail="Product SKU already exists")

    for field, value in updates.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}", response_model=ProductRead)
def delete_product(product_id: int, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.status = ProductStatus.inactive
    db.commit()
    db.refresh(product)
    return product


@router.get("/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db)) -> DashboardSummary:
    total_orders = db.scalar(select(func.count(Order.id))) or 0
    new_orders = db.scalar(select(func.count(Order.id)).where(Order.status == OrderStatus.new)) or 0
    in_transit_orders = db.scalar(select(func.count(Order.id)).where(Order.status == OrderStatus.in_transit)) or 0
    total_revenue = db.scalar(select(func.coalesce(func.sum(Order.total_price), 0))) or 0
    total_deposits = db.scalar(select(func.coalesce(func.sum(Order.deposit_amount), 0))) or 0
    total_remaining = db.scalar(select(func.coalesce(func.sum(Order.remaining_amount), 0))) or 0
    total_customers = db.scalar(select(func.count(Customer.id))) or 0
    return DashboardSummary(
        total_orders=total_orders,
        new_orders=new_orders,
        in_transit_orders=in_transit_orders,
        total_revenue=float(total_revenue),
        total_deposits=float(total_deposits),
        total_remaining=float(total_remaining),
        total_customers=total_customers,
    )


@router.get("/orders", response_model=list[OrderRead])
def admin_orders(db: Session = Depends(get_db)) -> list[Order]:
    return list(db.scalars(_order_query().order_by(Order.created_at.desc())))


@router.get("/orders/{order_id}", response_model=OrderRead)
def admin_order(order_id: int, db: Session = Depends(get_db)) -> Order:
    order = db.scalar(_order_query().where(Order.id == order_id))
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/orders/{order_id}/status", response_model=OrderRead)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)) -> Order:
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    if payload.admin_note is not None:
        order.admin_note = payload.admin_note
    db.commit()

    updated = db.scalar(_order_query().where(Order.id == order_id))
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated


@router.patch("/orders/{order_id}/payment", response_model=OrderRead)
def update_order_payment(order_id: int, payload: OrderPaymentUpdate, db: Session = Depends(get_db)) -> Order:
    order = db.scalar(_order_query().where(Order.id == order_id))
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    payment = order.payment
    if not payment:
        payment = Payment(order_id=order.id)
        db.add(payment)

    payment.paid_amount = payload.paid_amount
    payment.status = payload.payment_status
    payment.payment_note = payload.payment_note

    if payload.paid_amount > 0 and order.status == OrderStatus.new:
        order.status = OrderStatus.deposit_paid

    db.commit()

    updated = db.scalar(_order_query().where(Order.id == order_id))
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated


@router.get("/finance", response_model=FinanceSummary)
def finance_summary(db: Session = Depends(get_db)) -> FinanceSummary:
    total_revenue = db.scalar(select(func.coalesce(func.sum(Order.total_price), 0))) or 0
    total_deposits = db.scalar(select(func.coalesce(func.sum(Order.deposit_amount), 0))) or 0
    total_remaining = db.scalar(select(func.coalesce(func.sum(Order.remaining_amount), 0))) or 0
    paid_orders = db.scalar(select(func.count(Payment.id)).where(Payment.status == PaymentStatus.paid)) or 0
    pending_orders = db.scalar(select(func.count(Payment.id)).where(Payment.status == PaymentStatus.pending)) or 0
    return FinanceSummary(
        total_revenue=float(total_revenue),
        total_deposits=float(total_deposits),
        total_remaining=float(total_remaining),
        paid_orders=paid_orders,
        pending_orders=pending_orders,
    )


@router.get("/settings", response_model=ShopSettingsRead)
def get_settings(db: Session = Depends(get_db)) -> ShopSettings:
    return _settings(db)


@router.patch("/settings", response_model=ShopSettingsRead)
def update_settings(payload: ShopSettingsUpdate, db: Session = Depends(get_db)) -> ShopSettings:
    settings = _settings(db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings
