import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "./logger.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import cors from 'cors';

dotenv.config();
const app = express();

//cors
app.use(cors({
  origin: ["http://localhost:5137","https://pw-react-app-2025.onrender.com"],
  methods:["GET","POST","PUT","DELETE"],
  credentials:true,
}))

// Middleware
app.use(helmet());
app.use(express.json());

// Routes
app.use(healthRoutes);
app.use(userRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch((err) => logger.error("❌ MongoDB connection error:", err));

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
//this is test commit