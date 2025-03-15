from fastapi import APIRouter, Depends, Body, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from sqlalchemy.orm import Session
from jwt import PyJWTError
from database import db as database
from models.models import User
from schemas.user_schema import User as UserSchema, UserCreate, Token, Message
from utils.auth_utils import get_current_user
from utils import auth_utils as utils

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

@router.post("/register", response_model=UserSchema)
def register_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = utils.get_password_hash(user.password)
    
    default_role_id = 2 
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        phone_number=user.phone_number,
        is_active=True,
        role_id=default_role_id,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(database.get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utils.create_access_token(
        data={"sub": user.email, "token_type": "access"}, 
        expires_delta=access_token_expires
    )
    refresh_token = utils.create_refresh_token(
        data={"sub": user.email, "token_type": "refresh"}
    )

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/token/refresh", response_model=Token)
def refresh_access_token(
    refresh_token: str = Body(...),
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        payload = utils.decode_token(refresh_token)
    except PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    if payload.get("token_type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    access_token_expires = timedelta(minutes=utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utils.create_access_token(
        data={"sub": user.email, "token_type": "access"}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/change-password", response_model=Message)
def change_password(
    current_password: str = Body(...), 
    new_password: str = Body(...), 
    db: Session = Depends(database.get_db), 
    current_user: User = Depends(get_current_user)
):
    if not utils.verify_password(current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect current password")
    
    current_user.hashed_password = utils.get_password_hash(new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.post("/logout", response_model=Message)
def logout(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(database.get_db)
):
    return {"message": "Logout successful"}
