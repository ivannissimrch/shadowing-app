import express from "express";
import cors from "cors";
import router from "./router.js";
import { protect } from "./auth.js";
import { JSONFilePreset } from "lowdb/node";
import { signin } from "./handlers/user.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

// Initialize database
const dbPath =
  process.env.NODE_ENV === "production" ? "/data/db.json" : "db.json";
const db = await JSONFilePreset(dbPath, { users: [] });
if (!db.data.users) {
  db.data.users = [];
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "ESL Shadowing API server is running",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api", router);
app.post("/signin", signin);

export default app;
export { db };
