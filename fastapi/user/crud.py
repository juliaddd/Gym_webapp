from .models import UserDB
from .schemas import UserBase, UserCreate, UserResponse, UserUpdate, UserSearchResult, SubscriptionType, UserRole, UserCountBySubscriptionResponse
from typing import Optional
from fastapi import HTTPException, Query, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import re
import logging
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
#   PASSWORD SECURITY 
PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 64

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def validate_password_complexity(v: str) -> str:
    if len(v) < PASSWORD_MIN_LENGTH or len(v) > PASSWORD_MAX_LENGTH:
        raise ValueError(f"Password must be between {PASSWORD_MIN_LENGTH} and {PASSWORD_MAX_LENGTH} characters")
    if not re.search(r"[A-Z]", v):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", v):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", v):
        raise ValueError("Password must contain at least one digit")
    return v

def validate_phone_number_format(phone: str) -> str:
    if not re.fullmatch(r"\+(\d{1,4})\s?(\d{1,12})(\s?\d{1,2})?$", phone):
        raise ValueError("Phone number must start with '+' followed by up to 14 digits (max 15 characters total)")
    return phone

def create_user(db: Session, user: UserCreate):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        validate_password_complexity(user.password)
        validate_phone_number_format(user.phone_number)
        hashed_password = hash_password(user.password)
        db_user = UserDB(
            name=user.name,
            surname=user.surname,
            phone_number=user.phone_number,
            email=user.email,
            address=user.address,
            password=hashed_password,
            subscription_type=user.subscription_type,
            role=user.role,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(UserDB).offset(skip).limit(limit).all()

def get_user(db: Session, user_id: int):
    db_user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if db_user is None:
         raise HTTPException(status_code=404, detail="User not found")
    return db_user

def get_user_by_email(db: Session, email: str):
    db_user = db.query(UserDB).filter(UserDB.email == email).first()
    return db_user

def search_users(
    db: Session,
    search: Optional[str] = Query(None),
    subscription_type: Optional[SubscriptionType] = Query(None),
    role: Optional[UserRole] = Query(None)
):
    query = db.query(UserDB)
    
    if search:
        search = search.strip()
        query = query.filter(
            (UserDB.name.ilike(f"%{search}%")) | 
            (UserDB.surname.ilike(f"%{search}%"))
        )
    
    if subscription_type:
        query = query.filter(UserDB.subscription_type == subscription_type)
    
    if role:
        query = query.filter(UserDB.role == role)
    
    users = query.all()

    return [
        UserSearchResult(
            user_full_name=f"{u.name} {u.surname}",
            subscription_type=u.subscription_type,
            role=u.role,
        )
        for u in query.all()
    ]

def update_user( db: Session, user_id: int, user: UserUpdate):
    db_user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user.dict(exclude_unset=True)
    if "password" in update_data:
        validate_password_complexity(update_data["password"])
        update_data["password"] = hash_password(update_data["password"])

    if "phone_number" in update_data:
        validate_phone_number_format(update_data["phone_number"])

    for key, value in update_data.items():
        setattr(db_user, key, value)

    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
 
    db.commit()
    db.refresh(db_user)
    
    return db_user

def get_user_counts_by_sub(db: Session, year=None):
    logger.debug(f"Fetching user counts by subscription type for year: {year}")
    try:
        # Базовый запрос
        query = (
            db.query(
                UserDB.subscription_type,
                func.count(UserDB.user_id).label("user_count"),
            )
            .group_by(UserDB.subscription_type)
        )
        
        # Если год указан, добавляем фильтр по году
        if year:
            # Используем дату создания пользователя
            from sqlalchemy import extract
            query = query.filter(extract('year', UserDB.created_at) <= year)
        
        results = query.all()
        
        return [
            UserCountBySubscriptionResponse(
                subscription_type=row.subscription_type,
                user_count=row.user_count
            )
            for row in results
        ]
    except SQLAlchemyError as sae:
        logger.error(f"Database error: {str(sae)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(sae)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


def delete_user( db: Session, user_id: int):
    db_user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()