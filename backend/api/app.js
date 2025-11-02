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


//Co2 Produced by Transportation (Car)
app.get("/carbon-per-car", async (req, res) => {
  const { distance, distance_unit } = req.query;

  const url = "https://api.climatiq.io/data/v1/estimate";

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

//Co2 Produced by Home Energy Consumption  
app.get("/home-enery-consumption", async(req, res) => {
    const {energy, energy_unit} = req.query; 
    console.log(energy);
    console.log(energy_unit);
    const url = "https://api.climatiq.io/data/v1/estimate";
    const body = {
        emission_factor: {
            activity_id: "electricity-supply_grid-source_residual_mix-supplier_cms_energy_consumers_energy",
            data_version: "^21"
        },
        parameters: {
            energy: parseFloat(energy),
            energy_unit: energy_unit
        }
    }; 
    try {
        const response = await fetch(url, { 
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.climatiq_api_key}`, 
                "content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errText = response.text;
            throw new Error(`API error ${response.status}: ${errText}`);
        }
        const data = await response.json(); 
        console.log(data);
        res.json(data);
    } catch (error) {  
        console.log("Error: ", error.message);
        return res.status(500).json({error: "Failed to fetch emission data" });

    }
}) 

//Co2 produced by purchase of goods 
app.get("/diet", async(req, res) => {
    const {meat, veg, fruit, water} = req.query; 
    const mpw = meat * 7;
    const vpw = veg * 7;
    const fpw = fruit * 7;
    const wpw = water * 7; 

    mCo2 = mpw * 27;
    vCo2 = vpw * 2;
    fCo2 = fpw * 1.1;
    wCo2 = wpw * 0.0003;

    total = mCo2 + vCo2 + fCo2 +wCo2;
    res.json(total);
    
});


//Search for valid activity_id
app.get("/retrieve-ids", async (req, res) => {
    try {
        const response = await fetch(
        "https://api.climatiq.io/data/v1/search?query=waste&data_version=^27",
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