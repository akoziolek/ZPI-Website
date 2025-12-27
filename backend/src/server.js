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
import authRoutes from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


// is this visible in requests? X-Powered-By ?? make it not

app.use(express.json()); // parse HTTP body
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Pozwala na przesyłanie ciasteczek/tokenów jeśli ich używasz
};
app.use(cors(corsOptions)); 
app.use(helmet()); // middleware that sets various HTTP headers to protect your app from common web vulnerabilities
app.use(morgan("dev")); // log the requests

app.use('/students', studentRoutes);
app.use('/topics', topicRoutes);
app.use('/topics', opinionsRoutes);
app.use('/academicEmployees', academicEmployeesRoutes);
//app.use('/declarations', declarationsRoutes);
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ info: '' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () =>{
    console.log("Server is running on " + PORT);
});
