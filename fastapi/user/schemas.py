from pydantic import BaseModel, EmailStr, constr, field_validator
from typing import Optional
from enum import Enum


PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 64

class SubscriptionType(str, Enum):
    vip = "vip"
    premium = "premium"
    standard = "standard"

class UserRole(str, Enum):
    user = "user"
    admin = "admin"

def validate_password_complexity(v: str) -> str:
    import re
    if not re.search(r"[A-Z]", v):
        raise ValueError("Must contain uppercase letter")
    if not re.search(r"[a-z]", v):
        raise ValueError("Must contain lowercase letter")
    if not re.search(r"\d", v):
        raise ValueError("Must contain digit")
    return v


class UserBase(BaseModel):
    name: constr(max_length=255, strip_whitespace=True)
    surname: constr(max_length=255, strip_whitespace=True)
    email: EmailStr
    phone_number: constr(max_length=15, pattern=r"^\+?[\d\s\-]+$") 
    address: Optional[constr(max_length=255)] = None
    subscription_type: SubscriptionType = SubscriptionType.standard
    role: UserRole = UserRole.user

class UserCreate(UserBase):
    password: constr(min_length=PASSWORD_MIN_LENGTH, max_length=PASSWORD_MAX_LENGTH)

    @field_validator("password")
    def validate_password(cls, v):
        return validate_password_complexity(v)

class UserResponse(UserBase):
    user_id: int

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[constr(max_length=255)] = None
    surname: Optional[constr(max_length=255)] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[constr(max_length=15, pattern=r"^\+?[\d\s\-]+$")] = None
    address: Optional[constr(max_length=255)] = None
    subscription_type: Optional[SubscriptionType] = None
    password: Optional[constr(min_length=8, max_length=64)] = None

    @field_validator("password")
    def validate_password(cls, v):
        return validate_password_complexity(v)
    
# output fields
class UserSearchResult(BaseModel):
    user_full_name: str  # name + surname
    subscription_type: SubscriptionType
    role: UserRole

class UserCountBySubscriptionResponse(BaseModel):
    subscription_type: SubscriptionType
    user_count: int