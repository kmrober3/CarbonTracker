import express from "express";
import { JSDOM } from "jsdom";
import cors from "cors"; 
import fetch from "node-fetch"; 

const app = express();
app.use(express.json());  
app.use(cors());
const PORT = 8080; 

app.get("/", (req, res) => {
    return res.send("Backend is running");
});  

app.get("/transportation", async(req, res) => {
    
})

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`);
});