from enum import Enum
from datetime import date, datetime, timedelta
from typing import Optional, List
from pydantic import BaseModel, EmailStr, constr, field_validator, model_validator
import re
from passlib.context import CryptContext
from fastapi import FastAPI, HTTPException, Depends, Query, status
from sqlalchemy.orm import Session
from database import *
import secrets


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
    
# output fields
class UserSearchResult(BaseModel):
    user_full_name: str  # name + surname
    subscription_type: SubscriptionType
    role: UserRole


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



# ====================== #
#     API Endpoints      #
# ====================== #

app = FastAPI()


@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):

    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    
    db_user = UserDB(
        name = user.name,
        surname = user.surname,
        phone_number = user.phone_number,
        email = user.email,
        address = user.address,
        password =  hashed_password,
        subscription_type = user.subscription_type,
        role = user.role
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if db_user is None:
         raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/users/login/", response_model=UserResponse)
def login_user(user: UserLoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials") # I don't specify what is wrong not to give hackers additional information
    
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400,detail="Invalid credentials")
    
    return db_user

@app.get("/users/list/", response_model=List[UserSearchResult])
def list_users(
    search: Optional[str] = Query(None),
    subscription_type: Optional[SubscriptionType] = Query(None),
    role: Optional[UserRole] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(UserDB)
    

    if search:
        query = query.filter(
            (UserDB.name.ilike(f"%{search}%")) | 
            (UserDB.surname.ilike(f"%{search}%"))
        )
    

    if subscription_type:
        query = query.filter(UserDB.subscription_type == subscription_type)
    
    if role:
        query = query.filter(UserDB.role == role)
    
    users = query.all()

    results = [
    UserSearchResult(
        user_full_name=f"{u.name} {u.surname}",
        subscription_type=u.subscription_type,
        role=u.role
    )
    for u in users
    ]
    return results



@app.put("/users/{user_id}",response_model= UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.user_id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )

    if user.name is not None:
        db_user.name = user.name
    if user.surname is not None:
        db_user.surname = user.surname
    if user.phone_number is not None:
        db_user.phone_number = user.phone_number
    if user.email is not None:
        db_user.email = user.email
    if user.address is not None:
        db_user.address = user.address
    if user.subscription_type is not None:
        db_user.subscription_type = user.subscription_type
    if user.role is not None:
        db_user.role = user.role
    if user.password is not None:
        validate_password_complexity(user.password)
        db_user.password = hash_password(user.password)
    
 
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT  )
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )

    db.delete(db_user)
    db.commit()
    return None
