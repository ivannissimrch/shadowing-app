const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  error: (...args: unknown[]) => {
    console.error(...args);
  },

  info: (...args: unknown[]) => {
    console.info(...args);
  },
};

export default logger;
