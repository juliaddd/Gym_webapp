from typing import Optional, List
from fastapi import FastAPI, HTTPException, Depends, Query, status
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

from database import get_db

from user import crud as user_crud, schemas as user_schemas
from category import crud as category_crud, schemas as category_schemas
from training import crud as training_crud, schemas as training_schemas
from user.crud import get_user_by_email

from auth import login_user, Token, is_admin_user, is_valid_user
from fastapi.security import OAuth2PasswordRequestForm 

app = FastAPI()

# Allow CORS
origins = [
    "http://localhost:3000",
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


# LOGIN

@app.post("/login", response_model=dict)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    token = login_user(db, form_data.username, form_data.password)
    user = get_user_by_email(db, form_data.username)
    return {
        "access_token": token.access_token,
        "token_type": token.token_type,
        "user_id": user.user_id,
    }


# User CRUD Operations
@app.post(
    "/users/",
    response_model=user_schemas.UserResponse,
    summary="Create a new user",
    description="Register a new user with email, password, and other details.",
)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    return  user_crud.create_user(db, user)

@app.get(
    "/users/",
    response_model=List[user_schemas.UserResponse],
    summary="Get list of users",
    description="Retrieve a paginated list of users. Admin access required.",
)
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: user_schemas.UserResponse = Depends(is_admin_user)):
    return user_crud.get_users(db, skip, limit)

@app.get(
    "/users/{user_id}",
    response_model=user_schemas.UserResponse,
    summary="Get user by ID",
    description="Retrieve details of a specific user. Accessible by the user themselves or admins.",
    )
def read_user(user_id: int, db: Session = Depends(get_db), current_user: user_schemas.UserResponse = Depends(is_valid_user)):
    if current_user.user_id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user_crud.get_user(db, user_id)

@app.get(
    "/users/stats/subscriptions",
    response_model=List[user_schemas.UserCountBySubscriptionResponse],
    summary="Get user counts by subscription",
    description="Retrieve the number of users by subscription type. Admin access required.",
)
def get_user_counts_by_sub(db: Session = Depends(get_db),  current_user: user_schemas.UserResponse = Depends(is_admin_user)):
    return user_crud.get_user_counts_by_sub(db)

@app.get(
    "/users/search/",
    response_model=List[user_schemas.UserSearchResult],
    summary="Search users",
    description="Search users by name, surname, subscription type, or role. Admin access required.",
)
def search_users(
    search: Optional[str] = None,
    subscription_type: Optional[user_schemas.SubscriptionType] = None,
    role: Optional[user_schemas.UserRole] = None,
    db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(is_admin_user)
):
    return user_crud.search_users(db, search, subscription_type, role)

@app.patch(
    "/users/{user_id}",
    response_model=user_schemas.UserResponse,
    summary="Update user",
    description="Partially update user details. Accessible by the user themselves or admins.",
)
def update_user(user_id: int, user: user_schemas.UserUpdate, db: Session = Depends(get_db),  current_user: user_schemas.UserResponse = Depends(is_valid_user)):
    if current_user.user_id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user_crud.update_user(db, user_id, user)

@app.delete(
    "/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Delete a user. Accessible by the  admins.",
)
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: user_schemas.UserResponse = Depends(is_admin_user)):
    return user_crud.delete_user(db, user_id)

# Categories CRUD Operations
# NOTE: categories are predefined in database and can't be modyfied so I don't write all crud operations

@app.get("/categories/", response_model=list[category_schemas.CategoryResponse])
def read_categories(
    db: Session = Depends(get_db)
):
    return category_crud.get_categories(db)

@app.get("/categories/{category_id}", response_model=category_schemas.CategoryResponse)
def read_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    return category_crud.get_category(db, category_id)

# Training CRUD Operations
@app.post(
    "/trainings/",
    response_model=training_schemas.TrainingResponse,
    summary="Create a new training",
    description="Create a new training record for a user.",
)
def create_training(training: training_schemas.TrainingCreate, db: Session = Depends(get_db), current_user: user_schemas.UserResponse = Depends(is_valid_user)):
    if training.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Cannot create training for another user")
    return training_crud.create_training(db, training)

@app.get(
    "/trainings/stats/by-category/",
    response_model=List[training_schemas.CategoryStatsResponse],
    summary="Get training stats by category",
    description="Retrieve training statistics by category for a date range. Accessible by the user or admins.",
)
def get_stats_by_category( user_id: Optional[int] = Query(None),date_from: date = Query(...), date_to: date = Query(...),db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(is_valid_user)):
    if user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return training_crud.get_stats_by_category(db, user_id, date_from, date_to)

@app.get(
    "/trainings/stats/by-category/{user_id}",
    response_model=List[training_schemas.CategoryStatsResponse],
    summary="Get all-time training stats by category",
    description="Retrieve all-time training statistics by category for a specific user. Accessible by the user or admins.",
)
def get_stats_all_time(user_id: int, db: Session = Depends(get_db), current_user: user_schemas.UserResponse = Depends(is_valid_user)):
    if user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return training_crud.get_stats_all_time(db, user_id)

@app.get(
    "/trainings/stats/total-time/",
    response_model=training_schemas.TotalTimeResponse,
    summary="Get total training time",
    description="Retrieve total training time for a date range. Accessible by the user or admins.",
)
def get_total_training_time(
    user_id: Optional[int] = Query(None),
    date_from: date = Query(...),
    date_to: date = Query(...),
    db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(is_valid_user)
):
    if user_id and user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return training_crud.get_total_training_time(db, user_id, date_from, date_to)

@app.get(
    "/trainings/stats/by-subscription/",
    response_model=List[training_schemas.SubscriptionStatsResponse],
    summary="Get training stats by subscription",
    description="Retrieve training statistics by category and subscription type for a date range. Accessible by the user or admins.",
)
def get_stats_by_cat_sub(user_id: Optional[int] = Query(None),date_from: date = Query(...), date_to: date = Query(...),db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(is_admin_user)):
    return training_crud.get_stats_by_cat_sub(db,user_id, date_from, date_to)

@app.get(
    "/trainings/stats/by-day-of-week/",
    response_model=List[training_schemas.DayOfWeekStatsResponse],
    summary="Get training stats by day of week",
    description="Retrieve training statistics by day of week for a date range. Accessible by the user or admins.",
)
def get_time_by_day_of_week(user_id: Optional[int] = Query(None),date_from: date = Query(...), date_to: date = Query(...),db: Session = Depends(get_db),
    current_user: user_schemas.UserResponse = Depends(is_valid_user)):
    if user_id and user_id != current_user.user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return training_crud.get_time_by_day_of_week(db, user_id, date_from, date_to)