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
    .refine((value: string) => Number(value) >= 1, "Amount must be at least 1.00")
    .refine((value: string) => Number(value) <= 99999999.99, "Amount is too large"),
  reason: z
    .string()
    .trim()
    .min(10, "Reason must be at least 10 characters")
    .max(600, "Reason must not exceed 600 characters")
});

export const decisionSchema = z.object({
  comment: z.string().trim().max(400, "Comment must be 400 characters or less")
});

export const createUserSchema = z.object({
  employeeNumber: z.string().trim().min(3, "Employee number is required").max(50, "Employee number is too long"),
  fullName: z.string().trim().min(3, "Full name is required").max(120, "Full name is too long"),
  email: z.string().trim().email("Enter a valid work email").max(120, "Email is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password is too long")
    .regex(passwordRegex, "Password must include upper, lower, number, and symbol"),
  department: z.string().trim().min(2, "Department is required").max(80, "Department is too long"),
  jobTitle: z.string().trim().max(100, "Job title is too long").optional(),
  branchLocation: z.string().trim().max(100, "Branch/location is too long").optional(),
  managerName: z.string().trim().max(120, "Manager name is too long").optional(),
  salaryBand: z.string().trim().max(80, "Salary band is too long").optional(),
  maxAdvanceEligibility: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Max advance eligibility must be a valid currency format")
    .optional()
    .or(z.literal("")),
  monthlySalary: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Salary must be a valid currency format")
    .refine((value: string) => Number(value) >= 1, "Salary must be at least 1.00"),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN", "HR_PAYROLL"]),
  features: z.array(z.string()).min(1, "Select at least one feature")
});

export const updateAccessSchema = z.object({
  userId: z.string().trim().min(1, "Select a user"),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN", "HR_PAYROLL"]),
  features: z.array(z.string()).min(1, "Select at least one feature")
});

export type LoginInput = z.infer<typeof loginSchema>;
export type AdvanceInput = z.infer<typeof advanceSchema>;
export type DecisionInput = z.infer<typeof decisionSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateAccessInput = z.infer<typeof updateAccessSchema>;

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password is too long")
    .regex(passwordRegex, "Password must include upper, lower, number, and symbol")
});

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
