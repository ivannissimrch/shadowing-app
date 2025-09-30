import { it, expect } from "vitest";
import base64ToBlob from "./base64ToBlob";

it("should convert base64 string to Blob", () => {
  const base64String =
    "data:audio/webm;base64,GkXfo0AgQoaBAULygICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";
  const blob = base64ToBlob(base64String, "audio/webm");
  expect(blob).toBeInstanceOf(Blob);
  expect(blob.type).toBe("audio/webm");
  expect(blob.size).toBeGreaterThan(0);
});

it("should handle invalid base64 string", () => {
  const base64String = "invalid_base64_string";
  expect(() => base64ToBlob(base64String, "audio/webm")).toThrow();
});
