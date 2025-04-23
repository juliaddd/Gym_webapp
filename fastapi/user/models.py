# Description: User models for SQLAlchemy ORM.
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Date
from database import Base
import enum
from sqlalchemy import Enum as SQLEnum

class SubscriptionType(str, enum.Enum):
    vip = "vip"
    premium = "premium"
    standard = "standard"

class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"

class UserDB(Base):
    __tablename__ = "User"
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    surname = Column(String(255), nullable=False)
    phone_number = Column(String(15), nullable=True)
    email = Column(String(255), nullable=False, unique=True)
    address = Column(String(255), nullable=True)
    password = Column(String(255), nullable=False)
    
    subscription_type = Column(SQLEnum(SubscriptionType), nullable=False, default=SubscriptionType.standard)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.user)
    
    trainings = relationship("TrainingDB", back_populates="user")