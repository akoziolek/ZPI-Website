import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve();

app.use(express.json()); // parse HTTP body
app.use(cors());
app.use(helmet()); // middleware that sets various HTTP headers to protect your app from common web vulnerabilities
app.use(morgan("dev")); // log the requests

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
    console.log("on prod")
}

app.listen(PORT, () =>{
    console.log("Server is running on " + PORT);
});

// npm run dev - start server
// npm start - backend and frontend running on the same port (localhost:PORT)