from models import Base, VehicleMakes, VehicleModels
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv  
import os

engine = create_engine("postgresql+psycopg2://postgres:place_holder@localhost:5432/cars") 

Base.metadata.create_all(engine)

SessionLocal = sessionmaker(bind=engine)