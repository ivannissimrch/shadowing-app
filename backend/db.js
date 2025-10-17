import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import logger from "./helpers/logger.js";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000, // 10 seconds
  idleTimeoutMillis: 30000,
  max: 20, // maximum pool size
});

pool.on("connect", () => {
  logger.info("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  logger.error("PostgreSQL connection error:", err);
});

export default pool;
