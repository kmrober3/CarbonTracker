import express from "express";
import cors from "cors"; 
import fetch from "node-fetch";  
import dotenv from "dotenv"

const app = express();
app.use(express.json());  
app.use(cors()); 
dotenv.config()
const PORT = 8080; 

app.get("/", (req, res) => {
    return res.send("Backend is running");
});   

app.get("/carbon-per-car", async (req, res) => {
  const { distance, distance_unit } = req.query;

  const url = "https://api.climatiq.io/data/v1/estimate"; 

  console.log("HI");

  const body = {
    emission_factor: {
      activity_id: "passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na",
      data_version: "^21"
    },
    parameters: {
      distance: parseFloat(distance),
      distance_unit: distance_unit || "mi"
    }
  }; 

  console.log("body");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.CLIMATIQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    console.log("Emissions result:", data);
    return res.json(data);

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch emission data" });
  }
});


app.get("/vehicle-makes", async (req, res) => { 
    try {  
        console.log("HI")
        const request =  await fetch("https://www.carboninterface.com/api/v1/vehicle_makes", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.api_key}`,
            "Content-Type": "application/json"
        }
        }); 
        console.log(request.status)   

        if (!request.ok) {
            const text = await request.text();
            console.error("Carbon API error:", request.status, text);
            return res.status(request.status).json({ error: "Carbon API request failed", details: text });
        } 

        const response = await request.json();   

        await fetch("http://localhost:5050/vehicle-makes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
        }); 

        if (!flaskResponse.ok) {
            const text = await flaskResponse.text();
            console.error("Flask API error:", flaskResponse.status, text);
            return res.status(flaskResponse.status).json({ error: "Flask API request failed", details: text });
        } 

        return res.status(200).json({ message: "Vehicle makes fetched and sent successfully!" });

    } catch (error) { 
        return res.status(500).json({"Error": "Data not found"});
    }
}); 


app.get("/retrieve-ids", async (req, res) => {
    try {
        const response = await fetch(
        "https://api.climatiq.io/data/v1/search?query=car&data_version=^27",
        {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${process.env.CLIMATIQ_API_KEY}`,
            "Content-Type": "application/json"
            }
        }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API error ${response.status}: ${errText}`);
        }

        const data = await response.json();
        console.log(data);
        res.json(data); // send response back to frontend
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: error.message });
    }
    });


app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 