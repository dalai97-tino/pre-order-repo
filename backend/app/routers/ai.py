from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..ai import generate_ai_reply
from ..auth import get_current_admin
from ..database import get_db
from ..schemas import AiChatRequest, AiChatResponse

router = APIRouter(prefix="/admin/ai", tags=["admin-ai"], dependencies=[Depends(get_current_admin)])


@router.post("/chat", response_model=AiChatResponse)
def chat_with_ai(payload: AiChatRequest, db: Session = Depends(get_db)) -> AiChatResponse:
    try:
        reply = generate_ai_reply(
            db,
            message=payload.message,
            customer_phone=payload.customer_phone,
            order_number=payload.order_number,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return AiChatResponse(reply=reply)
