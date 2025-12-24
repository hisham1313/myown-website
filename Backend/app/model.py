from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class ProductDB(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    image = Column(String, nullable=False)

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,unique=True,index=True,nullable=False)
    email = Column(String,unique=True,index=True,nullable=False)
    hashed_password = Column(String,nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class MessageDB(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)



