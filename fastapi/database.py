from sqlalchemy import create_engine, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, Integer, String, SmallInteger
from enum import Enum
from sqlalchemy import text

# Database configuration
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://webapp:n-V]W9dye)d]HAXH@localhost/webapp"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class CategoryDB(Base):
    __tablename__ = "Category"
    category_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(15), nullable=False)

    trainings = relationship("TrainingDB", back_populates="category")  # Relationship to Training

class TrainingDB(Base):
    __tablename__ = "Training"
    training_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("User.user_id"))
    category_id = Column(Integer, ForeignKey("Category.category_id"))
    date = Column(Date, nullable=False)
    training_duration = Column(Integer, nullable=False)

    user = relationship("UserDB", back_populates="trainings")  # Relationship to User
    category = relationship("CategoryDB", back_populates="trainings")  # Relationship to Category

class UserDB(Base):
    __tablename__ = "User"
    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    surname = Column(String(255), nullable=False)
    phone_number = Column(String(15))
    email = Column(String(255), unique=True, nullable=False)
    address = Column(String(255))
    password = Column(String(255), nullable=False)
    subscription_type = Column(Enum("VIP", "premium", "standard"), nullable=False, default="standard")
    role = Column(Enum("USER", "ADMIN"), nullable=False, default="ADMIN")

    trainings = relationship("TrainingDB", back_populates="user")  # Relationship to Training
