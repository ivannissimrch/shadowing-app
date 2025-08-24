import * as dotenv from "dotenv";
dotenv.config();
import app from "./server.js";

const PORT = process.env.PORT || 3001;

// Start
app.listen(PORT, () => {
  console.log(`ESL Shadowing API server running on port ${PORT}`);
});
