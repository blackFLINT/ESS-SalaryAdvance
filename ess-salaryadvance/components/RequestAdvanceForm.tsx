"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAdvance } from "../lib/api";
import { AdvanceInput, advanceSchema } from "../lib/validation";

interface Props {
  token: string;
  onSuccess: () => void;
}

export function RequestAdvanceForm({ token, onSuccess }: Readonly<Props>) {
  const [serverError, setServerError] = useState("");
  const [ok, setOk] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AdvanceInput>({ resolver: zodResolver(advanceSchema) });

  const onSubmit = async (values: AdvanceInput) => {
    setServerError("");
    setOk("");
    try {
      await createAdvance(token, Number(values.amount), values.reason);
      setOk("Request submitted successfully.");
      reset();
      onSuccess();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to submit request");
    }
  };

  return (
    <section className="panel stack">
      <h2 style={{ margin: 0 }}>Submit Salary Advance Request</h2>
      <form className="stack" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="amount">Amount</label>
          <input id="amount" placeholder="1500.00" {...register("amount")} />
          {errors.amount && <p className="error">{errors.amount.message}</p>}
        </div>

        <div>
          <label htmlFor="reason">Reason</label>
          <textarea id="reason" rows={4} placeholder="Explain why you need the advance" {...register("reason")} />
          {errors.reason && <p className="error">{errors.reason.message}</p>}
        </div>

        {serverError && <p className="error">{serverError}</p>}
        {ok && <p style={{ color: "#166534", margin: 0 }}>{ok}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </section>
  );
}
