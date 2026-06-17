import random
import string

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Customer, Order, OrderItem, Payment, PaymentStatus, Product
from ..schemas import OrderCreate, OrderRead

router = APIRouter(prefix="/orders", tags=["orders"])


def _generate_order_number() -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=9))
    return f"MN{suffix}"


def _order_query():
    return (
        select(Order)
        .options(
            selectinload(Order.customer),
            selectinload(Order.items).selectinload(OrderItem.product),
            selectinload(Order.payment),
        )
    )


@router.post("", response_model=OrderRead, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> Order:
    products = {
        product.id: product
        for product in db.scalars(select(Product).where(Product.id.in_([item.product_id for item in payload.items])))
    }

    if len(products) != len({item.product_id for item in payload.items}):
        raise HTTPException(status_code=400, detail="One or more products were not found")

    customer = Customer(**payload.customer.model_dump())
    db.add(customer)
    db.flush()

    total_price = 0.0
    deposit_amount = 0.0
    order = Order(
        order_number=_generate_order_number(),
        customer_id=customer.id,
        total_price=0,
        deposit_amount=0,
        remaining_amount=0,
        estimated_arrival="7-15 хоног",
    )
    db.add(order)
    db.flush()

    for item in payload.items:
        product = products[item.product_id]
        line_total = float(product.price) * item.quantity
        line_deposit = float(product.deposit) * item.quantity
        total_price += line_total
        deposit_amount += line_deposit
        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
                deposit=product.deposit,
            )
        )

    order.total_price = total_price
    order.deposit_amount = deposit_amount
    order.remaining_amount = total_price - deposit_amount
    db.add(Payment(order_id=order.id, status=PaymentStatus.pending, paid_amount=0))
    db.commit()

    created = db.scalar(_order_query().where(Order.id == order.id))
    if not created:
        raise HTTPException(status_code=500, detail="Order creation failed")
    return created


@router.get("/track", response_model=list[OrderRead])
def track_order(
    phone: str | None = Query(default=None),
    order_number: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Order]:
    if not phone and not order_number:
        raise HTTPException(status_code=400, detail="phone or order_number is required")

    statement = _order_query().join(Order.customer)
    filters = []
    if phone:
        filters.append(Customer.phone == phone)
    if order_number:
        filters.append(Order.order_number == order_number)

    return list(db.scalars(statement.where(or_(*filters)).order_by(Order.created_at.desc())))
