import { describe, expect, it } from "vitest";
import getFormattedTime from "./getFormattedTime";

describe("getFormattedTime", () => {
  it("handles zero (lower boundary)", () => {
    expect(getFormattedTime(0)).toBe("0:00");
  });

  it("handles 59 seconds (just before minute boundary)", () => {
    expect(getFormattedTime(59)).toBe("0:59");
  });

  it("handles 60 seconds (minute boundary)", () => {
    expect(getFormattedTime(60)).toBe("1:00");
  });

  it("handles 61 seconds (just after minute boundary)", () => {
    expect(getFormattedTime(61)).toBe("1:01");
  });

  it("handles typical video length", () => {
    expect(getFormattedTime(180)).toBe("3:00");
  });
});
