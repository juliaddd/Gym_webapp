from enum import Enum
from datetime import date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, constr, field_validator, model_validator
import re
from passlib.context import CryptContext

# ====================== #
#      ENUM CLASSES      #
# ====================== #
class SubscriptionType(str, Enum):
    STANDARD = "standard"
    PREMIUM = "premium"
    VIP = "vip"

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

# ====================== #
#   PASSWORD SECURITY    #
# ====================== #
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

# ====================== #
#      USER MODELS       #
# ====================== #
def validate_password_complexity(v: str) -> str:
    if not re.search(r"[A-Z]", v):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[a-z]", v):
        raise ValueError("Password must contain at least one lowercase letter")
    if not re.search(r"\d", v):
        raise ValueError("Password must contain at least one digit")
    return v

class UserBase(BaseModel):
    name: constr(max_length=255, strip_whitespace=True)
    surname: constr(max_length=255, strip_whitespace=True)
    email: EmailStr
    phone_number: constr(max_length=15, pattern=r"^\+?[\d\s\-]+$") 
    address: Optional[constr(max_length=255)] = None
    subscription_type: SubscriptionType = SubscriptionType.STANDARD
    role: UserRole = UserRole.USER

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

# input data
class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str
# input
class UserFilterRequest(BaseModel):
    subscription_type: Optional[SubscriptionType] = None
    role: Optional[UserRole] = None
    
# output fields
class UserSearchResult(BaseModel):
    user_full_name: str  # name + surname
    subscription_type: SubscriptionType
    role: UserRole

    @model_validator(mode="before")
    def combine_name(cls, values):
        if "name" in values and "surname" in values:
            values["user_full_name"] = f"{values['name']} {values['surname']}"
        return values


# ====================== #
#    CATEGORY MODELS     #
# ====================== #
class CategoryBase(BaseModel):
    name: constr(max_length=15, strip_whitespace=True)

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    category_id: int

    class Config:
        from_attributes = True

# ====================== #
#    TRAINING MODELS     #
# ====================== #
class TrainingBase(BaseModel):
    date: date
    training_duration: int  # in minutes

class TrainingCreate(TrainingBase):
    user_id: int
    category_id: int

class TrainingCreateResponse(BaseModel):
    training_id: int

class TrainingCategoryStatsRequest(BaseModel):
    date_from: date
    date_to: date
    user_id: Optional[int] = None 

class CategoryStatsResponse(BaseModel):
    category_name: str
    total_training_time: int

class TotalTimeResponse(BaseModel):
    total_training_time: int

class SubscriptionStatsResponse(BaseModel):
    category_name: str
    total_training_time: int
    subscription_type: SubscriptionType

class UserCountBySubscriptionResponse(BaseModel):
    subscription_type: str
    user_count: int

class DayOfWeekStatsResponse(BaseModel):
    day_of_week: str
    total_training_time: int

class TrainingResponse(TrainingBase):
    training_id: int
    user_id: int
    category_id: int

    class Config:
        from_attributes = True

class UserSearchResultList(BaseModel):
    users: List[UserSearchResult]

class SubscriptionStatsList(BaseModel):
    stats: List[SubscriptionStatsResponse]

class DayOfWeekStatsList(BaseModel):
    stats: List[DayOfWeekStatsResponse]