from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import create_access_token, verify_password
from ..database import get_db
from ..models import AdminUser
from ..schemas import AdminLogin, AdminToken

router = APIRouter(prefix="/admin/auth", tags=["admin-auth"])


@router.post("/login", response_model=AdminToken)
def login(payload: AdminLogin, db: Session = Depends(get_db)) -> AdminToken:
    admin = db.scalar(select(AdminUser).where(AdminUser.email == payload.email))
    if not admin or not admin.is_active or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return AdminToken(access_token=create_access_token(admin.email), admin=admin)
