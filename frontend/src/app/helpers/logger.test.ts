import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

describe("logger", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.resetModules();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  describe("in development mode", () => {
    it("should log messages when logger.log is called", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { default: logger } = await import("./logger");

      logger.log("Test message");
      expect(consoleLogSpy).toHaveBeenCalledWith("Test message");
    });

    it("should log multiple arguments", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { default: logger } = await import("./logger");

      logger.log("User:", { name: "Ivan" }, "logged in");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "User:",
        { name: "Ivan" },
        "logged in"
      );
    });

    it("should log error messages when logger.error is called", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { default: logger } = await import("./logger");

      logger.error("Error occurred");
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error occurred");
    });

    it("should log error with multiple arguments", async () => {
      vi.stubEnv("NODE_ENV", "development");
      const { default: logger } = await import("./logger");

      const error = new Error("Network failure");
      logger.error("Failed to fetch:", error);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to fetch:", error);
    });
  });

  describe("in production mode", () => {
    it("should not log messages when logger.log is called", async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { default: logger } = await import("./logger");

      logger.log("Test message");
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should not log errors when logger.error is called", async () => {
      vi.stubEnv("NODE_ENV", "production");
      const { default: logger } = await import("./logger");

      logger.error("Error occurred");
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("in test mode", () => {
    it("should not log messages", async () => {
      vi.stubEnv("NODE_ENV", "test");
      const { default: logger } = await import("./logger");

      logger.log("Test message");
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should not log errors", async () => {
      vi.stubEnv("NODE_ENV", "test");
      const { default: logger } = await import("./logger");

      logger.error("Error occurred");
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
