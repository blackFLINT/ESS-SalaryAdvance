import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid work email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password is too long")
    .regex(passwordRegex, "Password must include upper, lower, number, and symbol")
});

export const advanceSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid currency format")
    .refine((value) => Number(value) >= 1, "Amount must be at least 1.00")
    .refine((value) => Number(value) <= 99999999.99, "Amount is too large"),
  reason: z
    .string()
    .trim()
    .min(10, "Reason must be at least 10 characters")
    .max(600, "Reason must not exceed 600 characters")
});

export const decisionSchema = z.object({
  comment: z.string().trim().max(400, "Comment must be 400 characters or less")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type AdvanceInput = z.infer<typeof advanceSchema>;
export type DecisionInput = z.infer<typeof decisionSchema>;
