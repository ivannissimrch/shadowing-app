import { describe, it, expect } from "vitest";
import redirectBasedOnRole from "./redirectBasedOnRole";

describe("redirectBasedOnRole", () => {
  it("should redirect teacher to /teacher", () => {
    const payload = { role: "teacher", id: "123", username: "teacher1" };
    const encodedPayload = btoa(JSON.stringify(payload));
    const fakeToken = `header.${encodedPayload}.signature`;

    const result = redirectBasedOnRole(fakeToken);
    expect(result).toBe("/teacher");
  });

  it("should redirect student to /lessons", () => {
    const payload = { role: "student", id: "456", username: "student1" };
    const encodedPayload = btoa(JSON.stringify(payload));
    const fakeToken = `header.${encodedPayload}.signature`;

    const result = redirectBasedOnRole(fakeToken);
    expect(result).toBe("/lessons");
  });

  it("should redirect any non-teacher role to /lessons", () => {
    const payload = { role: "admin", id: "789", username: "admin1" };
    const encodedPayload = btoa(JSON.stringify(payload));
    const fakeToken = `header.${encodedPayload}.signature`;

    const result = redirectBasedOnRole(fakeToken);
    expect(result).toBe("/lessons");
  });
});
