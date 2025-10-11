import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import logger from "./helpers/logger.js";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  logger.info("Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  logger.error("PostgreSQL connection error:", err);
});

export default pool;
