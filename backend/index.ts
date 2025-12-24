import * as dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
import app from "./server.js";
import logger from "./helpers/logger.js";
const PORT = process.env.PORT || 3001;

// Start
app.listen(PORT, () => {
  logger.info(`ESL Shadowing API server running on port ${PORT}`);
});
