from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class CategoryDB(Base):
    __tablename__ = "Category"

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(15), nullable=False)

    trainings = relationship("TrainingDB", back_populates="category")