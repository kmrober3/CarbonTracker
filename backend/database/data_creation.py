from flask import Flask, request, jsonify
from db_setup import SessionLocal, engine
from models import Base, VehicleMakes, VehicleModels

app = Flask(__name__) 

@app.route("/", methods=["GET"])
def app_running():
    return "Flask application is running"

@app.route("/vehicle-makes", methods=["POST"])
def vehicle_makes():  
    data = request.jsonify()
    db = SessionLocal 

if __name__ == "__main__": 
    app.run(port=5050, debug=True)



    