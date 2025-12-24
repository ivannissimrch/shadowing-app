import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import logger from "./helpers/logger.js";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 60000,
  query_timeout: 25000,
  max: 20,
  min: 2,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on("connect", () => {
  logger.info("Connected to PostgreSQL database");
});

pool.on("error", (err: Error) => {
  logger.error("PostgreSQL connection error:", err);
});

export default pool;
