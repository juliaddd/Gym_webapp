from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
from user.schemas import SubscriptionType

class TrainingBase(BaseModel):
    date: date
    training_duration: int = Field(..., gt=0)  # minimum 1 minute

class TrainingCreate(TrainingBase):
    user_id: int
    category_id: int

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

class DayOfWeekStatsResponse(BaseModel):
    day_of_week: str
    total_training_time: int

class TrainingResponse(TrainingBase):
    training_id: int
    user_id: int
    category_id: int

    class Config:
        from_attributes = True