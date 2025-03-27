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


# Test the database connection
try:
    # Create a session
    db = SessionLocal()
    # Execute a simple query
    db.execute(text("SELECT 1")).fetchone()
    print("Database connection successful!")
except Exception as e:
    print(f"Database connection failed: {e}")
finally:
    # Ensure the session is closed
    db.close()
