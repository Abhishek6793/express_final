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
  origin: ["http://localhost:5137","https://express-final.onrender.com"],
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
  .then(() => {
    logger.info("✅ Connected to MongoDB");
    // Only start server after successful DB connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ MongoDB connection error:", err);
    // Optional: Exit process if DB connection fails
    // process.exit(1);
  });

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
//this is test commit