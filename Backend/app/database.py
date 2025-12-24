import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Read from environment variable first, fallback for local development
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:12345@localhost:5433/product_db"  # Only used when running locally outside Docker
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()