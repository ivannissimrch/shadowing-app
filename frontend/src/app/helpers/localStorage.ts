import logger from "./logger";

export function setItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logger.error(error);
  }
}

export function getItem(key: string) {
  if (typeof window === "undefined") return undefined;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    logger.error(error);
  }
}
