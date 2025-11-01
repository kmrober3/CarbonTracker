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
    try:
        reqData = request.get_json()  
        ls = []
        for i in range(i, len(reqData)): 
            instance = VehicleMakes()
            instance.make_id = reqData.data.id
            instance.name = reqData.data.attributes.name 
            instance.number_of_models = reqData.data.attributes.number_of_models 
            ls.append(instance)  
        db = SessionLocal()
        for x in reqData:
            db.add(x)
        return jsonify({"status": "Database populated succesfully"}), 200 
    except Exception as e:
        print("Error in population database:", e) 
        db.rollback()
        return jsonify({"error": str(e)}), 500 
    finally:
        db.close()
        
if __name__ == "__main__":
    app.run(port=5050, debug=True)