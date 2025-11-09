import { describe, it, expect, beforeEach, vi } from "vitest";
import { setItem, getItem } from "./localStorage";

vi.mock("./logger", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("localStorage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should save and retrieve a string", () => {
    const key = "username";
    const value = "Ivan";
    setItem(key, value);
    const result = getItem(key);

    expect(result).toBe("Ivan");
  });

  it("should save and retrieve an object", () => {
    const key = "user";
    const value = { name: "Ivan", age: 25, role: "developer" };
    setItem(key, value);
    const result = getItem(key);

    expect(result).toEqual(value);
  });

  it("should save and retrieve an array", () => {
    const key = "lessons";
    const value = [1, 2, 3, 4, 5];
    setItem(key, value);
    const result = getItem(key);

    expect(result).toEqual(value);
  });

  it("should return undefined for non-existent key", () => {
    const result = getItem("nonexistent");
    expect(result).toBeUndefined();
  });

  it("should handle null value", () => {
    const key = "nullable";
    const value = null;

    setItem(key, value);
    const result = getItem(key);
    expect(result).toBeNull();
  });

  it("should overwrite existing value", () => {
    const key = "counter";
    setItem(key, 1);
    setItem(key, 2);
    setItem(key, 3);
    const result = getItem(key);
    expect(result).toBe(3);
  });
});
