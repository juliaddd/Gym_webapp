from .models import CategoryDB
from .schemas import CategoryBase, CategoryCreate, CategoryResponse
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

def get_category(db: Session, category_id: int ):
    category = db.query(CategoryDB).filter(CategoryDB.category_id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

def get_categories(db: Session):
    categories = db.query(CategoryDB).all()
    return categories