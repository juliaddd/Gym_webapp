from .models import TrainingDB
from category.models import CategoryDB
from user.models import UserDB
from .schemas import TrainingBase, TrainingCreate, TrainingCategoryStatsRequest, CategoryStatsResponse, TotalTimeResponse, SubscriptionStatsResponse, DayOfWeekStatsResponse, TrainingResponse
from typing import Optional, List
from fastapi import  HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date


def create_training(db: Session, training: TrainingCreate):

    user = db.query(UserDB).filter(UserDB.user_id == training.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    category = db.query(CategoryDB).filter(CategoryDB.category_id == training.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_training = TrainingDB(
        user_id = training.user_id,
        category_id = training.category_id,
        date = training.date,
        training_duration = training.training_duration
    )

    try:
        db.add(db_training)
        db.commit()
        db.refresh(db_training)
        return db_training
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


def get_stats_by_category(db: Session, user_id: Optional[int], date_from: date, date_to: date):
    query = (
        db.query(
            CategoryDB.name.label("category_name"),
            func.sum(TrainingDB.training_duration).label("total_training_time"),
        )
        .join(TrainingDB, TrainingDB.category_id == CategoryDB.category_id)
        .filter(TrainingDB.date.between(date_from, date_to))
        .group_by(CategoryDB.name)
    )

    if user_id:
        query = query.filter(TrainingDB.user_id == user_id)

    results = query.all()
    return [
        CategoryStatsResponse(category_name=row.category_name, total_training_time=row.total_training_time or 0)
        for row in results
    ]

def get_stats_all_time(db: Session, user_id: int):
    results = (
        db.query(
            CategoryDB.name.label("category_name"),
            func.sum(TrainingDB.training_duration).label("total_training_time")
        )
        .join(TrainingDB, TrainingDB.category_id == CategoryDB.category_id)
        .filter(TrainingDB.user_id == user_id)
        .group_by(CategoryDB.name)
        .all()
    )

    return [CategoryStatsResponse(category_name=row.category_name, total_training_time=row.total_training_time or 0) for row in results]


def get_total_training_time( db: Session, user_id: Optional[int], date_from: date, date_to: date):
    query = db.query(func.sum(TrainingDB.training_duration))

    if user_id:
        query = query.filter(TrainingDB.user_id == user_id)

    query = query.filter(TrainingDB.date.between(date_from, date_to))

    total_time = query.scalar() or 0

    return TotalTimeResponse(total_training_time=total_time)


def get_stats_by_cat_sub( db: Session, user_id: Optional[int], date_from: date, date_to: date):
    query = (
        db.query(
            CategoryDB.name.label("category_name"),
            UserDB.subscription_type,
            func.sum(TrainingDB.training_duration).label("total_training_time")
        )
        .join(TrainingDB, TrainingDB.category_id == CategoryDB.category_id)
        .join(UserDB, UserDB.user_id == TrainingDB.user_id)
        .filter(TrainingDB.date.between(date_from, date_to))
    )

    if user_id:
        query = query.filter(TrainingDB.user_id == user_id)

    results = query.group_by(CategoryDB.name, UserDB.subscription_type).all()

    return [
        SubscriptionStatsResponse(
            category_name=row.category_name,
            subscription_type=row.subscription_type,
            total_training_time=row.total_training_time or 0
        ) for row in results
    ]



from sqlalchemy.sql import extract

def get_time_by_day_of_week(db: Session, user_id: Optional[int], date_from: date, date_to: date):

    query = (
        db.query(
            func.dayname(TrainingDB.date).label("day_of_week"),
            func.sum(TrainingDB.training_duration).label("total_training_time")
        )
        .filter(TrainingDB.date.between(date_from, date_to))
    )

    if user_id:
        query = query.filter(TrainingDB.user_id == user_id)

    results = (
        query
        .group_by(func.dayname(TrainingDB.date))
        .all()
    )
    return [
        DayOfWeekStatsResponse(
            day_of_week=row.day_of_week,
            total_training_time=row.total_training_time or 0
        ) for row in results
    ]