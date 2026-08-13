import { describe, expect, it } from "vitest";
import { advanceSchema, loginSchema } from "./validation";

describe("loginSchema", () => {
  it("accepts valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "employee@ess.local",
      password: "Password@123"
    });
    expect(result.success).toBe(true);
  });

  it("rejects weak password", () => {
    const result = loginSchema.safeParse({
      email: "employee@ess.local",
      password: "password"
    });
    expect(result.success).toBe(false);
  });
});

describe("advanceSchema", () => {
  it("accepts valid request payload", () => {
    const result = advanceSchema.safeParse({
      amount: "2500.00",
      reason: "Emergency medical requirement for family support"
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid currency format", () => {
    const result = advanceSchema.safeParse({
      amount: "12.123",
      reason: "Emergency medical requirement for family support"
    });
    expect(result.success).toBe(false);
  });
});
