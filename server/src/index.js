import "dotenv/config";
import dns from "node:dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import activityRoutes from "./routes/activities.js";
import reflectionRoutes from "./routes/reflections.js";
import insightRoutes from "./routes/insights.js";

const required = ["MONGODB_URI", "JWT_SECRET"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

// Some Windows/Node installations cannot perform Atlas SRV lookups through
// the system DNS server even though Windows itself can. Atlas URIs use SRV
// records, so use reliable public resolvers for this lookup.
if (process.env.MONGODB_URI.startsWith("mongodb+srv://")) {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reflections", reflectionRoutes);
app.use("/api/insights", insightRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => app.listen(port, () => console.log(`Daymark API running on ${port}`)))
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  });
