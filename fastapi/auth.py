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


# Authorization
from typing import Annotated
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from user.schemas import UserResponse
from database import get_db
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def is_valid_user(
    db: Annotated[Session, Depends(get_db)],
    token: Annotated[str, Depends(oauth2_scheme)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_info = payload
        if user_info.get('email') is None or user_info.get('role') is None:
            raise credentials_exception
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = get_user_by_email(db, user_info.get('email'))
    if user is None:
        raise credentials_exception
    return UserResponse(**user.__dict__)


async def is_admin_user(current_user: Annotated[UserResponse, Depends(is_valid_user)]):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

