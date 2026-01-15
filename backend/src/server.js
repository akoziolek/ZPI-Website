import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import studentRoutes from "./routes/students.js"  // import routera
import topicRoutes from "./routes/topics.js";
import academicEmployeesRoutes from "./routes/academicEmployees.js";
import opinionsRoutes from "./routes/opinions.js";
import usersRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import signaturesRoutes from "./routes/signatures.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Pozwala na przesyłanie ciasteczek/tokenów 
};

app.use(express.json()); // parse HTTP body
app.use(cors(corsOptions)); 
app.use(helmet()); // middleware that sets various HTTP headers to protect your app from common web vulnerabilities
app.use(morgan("dev")); // log the requests
app.use(cookieParser());

app.use('/students', studentRoutes);
app.use('/topics', topicRoutes);
app.use('/topics', opinionsRoutes);
app.use('/topics', signaturesRoutes);
app.use('/academicEmployees', academicEmployeesRoutes);
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
