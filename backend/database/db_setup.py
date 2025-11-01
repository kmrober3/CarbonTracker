from models import Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv  
import os

load_dotenv() 
db_url = os.getenv("DB") 
engine = create_engine(db_url) 

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine)