import express from "express";
import cors from "cors";
import router from "./router.js";
import { protect } from "./auth.js";
import { JSONFilePreset } from "lowdb/node";

const app = express();

// Initialize database
const dbPath =
  process.env.NODE_ENV === "production" ? "/data/db.json" : "db.json";
const db = await JSONFilePreset("db.json", { users: [] });
if (!db.data.users) {
  db.data.users = [];
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", protect, router);

export default app;
export { db };
