from fastapi import FastAPI,Depends,HTTPException
from pydantic import BaseModel ,Field
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from database import engine,SessionLocal,Base
from model import ProductDB
from security import hash_password,verify_password
from model import UserDB
from security import create_access_token
from security import get_current_user
# from database import get_db
Base.metadata.create_all(bind=engine)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
#DB dependency
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Product(BaseModel):
    name:str
    price:float
    category:str
    image:str

class UserCreate(BaseModel):
    username:str
    email:str
    password:str

class UserLogin(BaseModel):
    email:str
    password:str

@app.post("/api/products")
def create_product(product:Product,db:Session=Depends(get_db),user_id:int=Depends(get_current_user)):
    db_product = ProductDB(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
@app.get("/api/products")
def get_products(db:Session=Depends(get_db)):
    return db.query(ProductDB).all()

#updating values
@app.put("/api/products/{product_id}")
def update_product(product_id:int,updated:Product,db:Session=Depends(get_db),user_id:int=Depends(get_current_user)):
    product = db.query(ProductDB).filter(ProductDB.id==product_id).first()
    if not product:
        raise HTTPException(status_code=404,detail="Product not found")
    product.name = updated.name
    product.price = updated.price
    product.category = updated.category
    product.image = updated.image
    db.commit()
    db.refresh(product)
    return product

@app.delete("/api/products/{product_id}")
def delete_product(product_id:int,db:Session=Depends(get_db),user_id:int=Depends(get_current_user)):
    product = db.query(ProductDB).filter(ProductDB.id==product_id).first()
    if not product:
        raise HTTPException(status_code=404,detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message":"Product deleted"}

@app.post("/api/register")
def register_user(user:UserCreate,db:Session=Depends(get_db)):
    existing_user = db.query(UserDB).filter((UserDB.username==user.username) | (UserDB.email==user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400,detail="User already exists")
    new_user = UserDB(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)

    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"success":True,"message":"User register successfully"}
@app.post("/api/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(UserDB).filter(
        UserDB.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": str(db_user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }