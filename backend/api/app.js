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

app.get("/vehicle-makes", async (req, res) => { 
    try { 
        const request =  await fetch("https://www.carboninterface.com/api/v1/vehicle_makes", {
        method: "GET",
        headers: {
            "Authorization": process.env.api_key,
            "Content-Type": "application/json"
        }
        }); 
        const response = await request.json(); 
        await fetch("http://localhost:5050/vehicle-makes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
        });

    } catch (error) { 
        return res.status(500).json({"Error": "Data not found"})
    }
});

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});