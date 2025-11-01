from models import Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv  
import os

load_dotenv() 
os.getEnv(DB)

engine = create_engine()