export type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN";

export interface LoginResponse {
  token: string;
  role: UserRole;
  fullName: string;
  email: string;
}

export interface EmployeeProfile {
  id: number;
  employeeNumber: string;
  fullName: string;
  email: string;
  department: string;
  monthlySalary: number;
  role: UserRole;
}

export interface AdvanceRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  amount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approverComment?: string;
  createdAt: string;
  updatedAt: string;
}
