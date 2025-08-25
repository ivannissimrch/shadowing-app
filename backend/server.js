import express from "express";
import cors from "cors";
import router from "./router.js";
import { protect } from "./auth.js";
import { JSONFilePreset } from "lowdb/node";
import { signin } from "./handlers/user.js";

const app = express();

// Initialize database
// const dbPath =
//   process.env.NODE_ENV === "production" ? "/data/db.json" : "db.json";
const dbPath = "db.json";
console.log("Attempting to initialize database at:", dbPath);
const db = await JSONFilePreset(dbPath, { users: [] });
if (!db.data.users) {
  db.data.users = [];
}

// Middleware
app.use(
  cors({
    origin: [
      "https://shadowing-app-spec.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
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
