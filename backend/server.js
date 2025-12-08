import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // parse HTTP body
app.use(cors());
app.use(helmet()); // middleware that sets various HTTP headers to protect your app from common web vulnerabilities
app.use(morgan("dev")); // log the requests

app.listen(PORT, () =>{
    console.log("Server is running on " + PORT);
});

// npm run dev - start server