import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://17f38e802245fea7ad697ee24ba11f04@o4510629644140544.ingest.us.sentry.io/4510629804048384",
  sendDefaultPii: true,
});

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
