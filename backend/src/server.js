import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
//import path from "path";
import studentRoutes from "./routes/students.js"  // import routera
import topicRoutes from "./routes/topics.js";
import academicEmployeesRoutes from "./routes/academicEmployees.js";
import opinionsRoutes from "./routes/opinions.js";
import usersRoutes from "./routes/user.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// konfiguracja corsa, aby akcpetowal jedynie zapytania z frontendu !!!
// is this visible in requests? X-Powered-By ?? make it not

app.use(express.json()); // parse HTTP body
app.use(cors()); 
app.use(helmet()); // middleware that sets various HTTP headers to protect your app from common web vulnerabilities
app.use(morgan("dev")); // log the requests

app.use('/students', studentRoutes);
app.use('/topics', topicRoutes);
app.use('/topics', opinionsRoutes);
app.use('/academicEmployees', academicEmployeesRoutes);
//app.use('/declarations', declarationsRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.json({ info: 'Node .js, Express, and Postgres API' });
  // TO DO ADD DEFAULT RESPONSE
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () =>{
    console.log("Server is running on " + PORT);
});
