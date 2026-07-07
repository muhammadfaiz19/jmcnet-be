import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { UPLOADS_PATH } from "./config/path.config";
import { errorHandler } from "./middlewares/error.middleware";

// Import Routes
import apiRouter from "./routes";

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body Parsers & Loggers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Static Folder for Uploads
app.use("/uploads", express.static(UPLOADS_PATH));

// API Root Route
app.get("/", (req, res) => {
  res.json({
    name: "JMCNET API",
    version: "1.0.0",
    status: "Healthy",
  });
});

// App Endpoints
app.use("/api", apiRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
