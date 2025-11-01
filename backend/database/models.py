from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func  
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base 
from sqlalchemy.dialects.postgresql import UUID 
import uuid 

Base = declarative_base()

class VehicleMakes(Base):
    __tablename__ = "vehicle_makes"
    make_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    number_of_models = Column(Integer)
    created_at_time = Column(DateTime, server_default=func.now())  

    models = relationship("VehicleModels", back_populates="make", cascade="all, delete-orphan")

class VehicleModels(Base):
    __tablename__ = 'VehicleModels'
    model_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4) 
    make_id = Column(UUID(as_uuid=True), ForeignKey("VehicleMakes.make_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())  

    __table_args__ = (UniqueConstraint('make_id', 'name', 'year', name='_make_model_year_uc'),) 

    make = relationship("VehicleMakes", back_populates="models")