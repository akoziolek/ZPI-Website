import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json()); // parse HTTP body
app.use(cors()); 
app.use(helmet()); // middleware that sets various HTTP headers to protect your app from common web vulnerabilities
app.use(morgan("dev")); // log the requests

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(PORT, () =>{
    console.log("Server is running on " + PORT);
});

// npm run dev - start server
// npm start - backend and frontend running on the same port (localhost:PORT)