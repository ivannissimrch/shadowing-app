import logger from "../helpers/logger.js";

export default function handleError(err, req, res, next) {
  logger.error(err.stack);
  if (err.status) {
    res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
  next();
}
