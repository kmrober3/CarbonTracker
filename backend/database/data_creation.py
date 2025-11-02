from flask import Flask, request, jsonify
from db_setup import SessionLocal, engine
from models import Base, VehicleMakes, VehicleModels

app = Flask(__name__)  
Base.metadata.create_all(bind=engine)

@app.route("/", methods=["GET"])
def app_running():
    return "Flask application is running"

@app.route("/vehicle-makes", methods=["POST"])
def vehicle_makes():   
    db = SessionLocal() 
    try:
        reqData = request.get_json()   
        if not isinstance(reqData, list):
            return jsonify({"error": "Expected a list of vehicle make objects"}), 400
        for item in reqData: 

            data = item.get("data", {})   
            attribute = item.get("attributes", {}) 

            if not data or not attribute:
                continue

            make_id = data.get("id")
            name = attribute.get("name") 
            number_of_models = attribute.get("number_of_models")  

            existing = db.query(VehicleMakes).filter_by(make_id=make_id).first()
            if existing:
                existing.name = name
                existing.number_of_models = number_of_models
            else:
                instance = VehicleMakes (
                    make_id = make_id,
                    name=name,
                    number_of_models=number_of_models
                ) 
                db.add(instance) 
        db.commit()
        return jsonify({"status": "Database populated succesfully"}), 200
    except Exception as e:
        print("Error in population database:", e) 
        db.rollback()
        return jsonify({"error": str(e)}), 500 
    finally:
        db.close()

if __name__ == "__main__":
    app.run(port=5050, debug=True)