import { describe, it, expect } from "vitest";
import { hashPassword, comparePasswords, createJWT } from "./auth.js";
import jwt from "jsonwebtoken";

describe("auth utilities", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "testpassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should create different hashes for same password", async () => {
      const password = "testpassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePasswords", () => {
    it("should return true for matching password", async () => {
      const password = "testpassword123";
      const hash = await hashPassword(password);

      const result = await comparePasswords(password, hash);

      expect(result).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const password = "testpassword123";
      const wrongPassword = "wrongpassword";
      const hash = await hashPassword(password);

      const result = await comparePasswords(wrongPassword, hash);

      expect(result).toBe(false);
    });
  });

  describe("createJWT", () => {
    it("should create a valid JWT token", () => {
      const user = {
        id: "123",
        username: "testuser",
        role: "student" as const,
      };

      const token = createJWT(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = jwt.verify(token, "test-secret-key") as any;
      expect(decoded.id).toBe(user.id);
      expect(decoded.username).toBe(user.username);
      expect(decoded.role).toBe(user.role);
    });
  });
});
