from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from user.crud import get_user_by_email
# This is the configuration for generating token hash
SECRET_KEY = "18f414a668ad1e0d5b3d9d3f9d46e0ec4bc5ee38453989d434b51d529cf9e7d0"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
# DTO for token
class Token(BaseModel):
    access_token: str
    token_type: str
# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Token creation
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
# Authentication
def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user and pwd_context.verify(password, user.password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
        data={"email": user.email, "role": user.role, "id": user.user_id},
        expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
    raise HTTPException(status_code=401, detail="Incorrect username or password")