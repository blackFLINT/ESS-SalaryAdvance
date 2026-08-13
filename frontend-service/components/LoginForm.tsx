"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../lib/api";
import { saveSession } from "../lib/auth";
import { LoginInput, loginSchema } from "../lib/validation";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setServerError("");
    try {
      const response = await login(values.email, values.password);
      saveSession(response);
      router.push("/dashboard");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <form className="stack" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Work Email</label>
        <input id="email" type="email" placeholder="employee@ess.local" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Password@123" {...register("password")} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <p className="hint">
        Password policy: at least 8 characters with uppercase, lowercase, number, and symbol.
      </p>

      {serverError && <p className="error">{serverError}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
