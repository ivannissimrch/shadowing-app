import logger from "../helpers/logger.js";

export default function handleError(err, req, res, next) {
  logger.error(err.stack);
  if (err.status) {
    res.status(err.status).json({
      success: false,
      message: err.message
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}
