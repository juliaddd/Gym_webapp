from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class TrainingDB(Base):
    __tablename__ = "Training"

    training_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("User.user_id", ondelete="CASCADE"), nullable=True)
    category_id = Column(Integer, ForeignKey("Category.category_id"), nullable=True)
    date = Column(Date, nullable=False)
    training_duration = Column(Integer, nullable=False)

    user = relationship("UserDB", back_populates="trainings")
    category = relationship("CategoryDB", back_populates="trainings")