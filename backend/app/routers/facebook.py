from __future__ import annotations

import hashlib
import hmac
import re

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from ..ai import generate_ai_reply
from ..database import get_db, settings

router = APIRouter(prefix="/facebook", tags=["facebook"])


ORDER_NUMBER_PATTERN = re.compile(r"\bMN[-A-Z0-9]{6,}\b", re.IGNORECASE)
PHONE_PATTERN = re.compile(r"\b(?:\+?976)?\s?(\d{8})\b")


@router.get("/webhook", response_class=PlainTextResponse)
def verify_webhook(
    mode: str | None = Query(default=None, alias="hub.mode"),
    challenge: str | None = Query(default=None, alias="hub.challenge"),
    verify_token: str | None = Query(default=None, alias="hub.verify_token"),
) -> str:
    if not settings.facebook_verify_token:
        raise HTTPException(status_code=503, detail="FACEBOOK_VERIFY_TOKEN is not configured")

    if mode == "subscribe" and verify_token == settings.facebook_verify_token and challenge:
        return challenge

    raise HTTPException(status_code=403, detail="Invalid Facebook webhook verification token")


@router.post("/webhook")
async def receive_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_hub_signature_256: str | None = Header(default=None),
) -> dict[str, str]:
    body = await request.body()
    _verify_signature(body, x_hub_signature_256)

    payload = await request.json()
    if payload.get("object") != "page":
        return {"status": "ignored"}

    for entry in payload.get("entry", []):
        for messaging_event in entry.get("messaging", []):
            sender_id = messaging_event.get("sender", {}).get("id")
            message = messaging_event.get("message", {})
            text = message.get("text")

            if not sender_id or not text or message.get("is_echo"):
                continue

            reply = _build_reply(db, text)
            await send_facebook_message(sender_id, reply)

    return {"status": "ok"}


def _verify_signature(body: bytes, signature_header: str | None) -> None:
    if not settings.facebook_app_secret:
        return

    if not signature_header or not signature_header.startswith("sha256="):
        raise HTTPException(status_code=403, detail="Missing Facebook webhook signature")

    expected = hmac.new(
        settings.facebook_app_secret.encode("utf-8"),
        msg=body,
        digestmod=hashlib.sha256,
    ).hexdigest()
    received = signature_header.removeprefix("sha256=")

    if not hmac.compare_digest(expected, received):
        raise HTTPException(status_code=403, detail="Invalid Facebook webhook signature")


def _build_reply(db: Session, text: str) -> str:
    order_number_match = ORDER_NUMBER_PATTERN.search(text)
    phone_match = PHONE_PATTERN.search(text)
    order_number = order_number_match.group(0).upper() if order_number_match else None
    customer_phone = phone_match.group(1) if phone_match else None

    try:
        return generate_ai_reply(
            db,
            message=text,
            customer_phone=customer_phone,
            order_number=order_number,
        )
    except Exception:
        return (
            "Сайн байна уу. Манай pre-order туслах ажиллаж байна. "
            "Захиалгаа шалгах бол order number эсвэл утасны дугаараа бичээрэй."
        )


async def send_facebook_message(recipient_id: str, text: str) -> None:
    if not settings.facebook_page_access_token:
        raise HTTPException(status_code=503, detail="FACEBOOK_PAGE_ACCESS_TOKEN is not configured")

    url = f"https://graph.facebook.com/{settings.facebook_api_version}/me/messages"
    payload = {
        "recipient": {"id": recipient_id},
        "message": {"text": text[:2000]},
        "messaging_type": "RESPONSE",
    }
    params = {"access_token": settings.facebook_page_access_token}

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(url, params=params, json=payload)

    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail=f"Facebook Send API failed: {response.text}")
