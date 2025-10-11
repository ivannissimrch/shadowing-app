const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args) => {
    console.error(...args);
  },

  info: (...args) => {
    console.info(...args);
  },
};

export default logger;
