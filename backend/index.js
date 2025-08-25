import * as dotenv from "dotenv";
dotenv.config();
import app from "./server.js";
const PORT = process.env.PORT || 3001;

console.log("=== RENDER ENVIRONMENT DEBUG ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("JWT_SECRET length:", process.env.JWT_SECRET?.length);
console.log("PORT:", process.env.PORT);
console.log(
  "All env vars:",
  Object.keys(process.env).filter((key) => !key.startsWith("npm_"))
);
console.log("=================================");

// Start
app.listen(PORT, () => {
  console.log(`ESL Shadowing API server running on port ${PORT}`);
});
