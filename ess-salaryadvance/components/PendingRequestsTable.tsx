"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { decideAdvance } from "../lib/api";
import { AdvanceRequest } from "../lib/types";
import { DecisionInput, decisionSchema } from "../lib/validation";

interface Props {
  token: string;
  items: AdvanceRequest[];
  onDecision: () => void;
}

export function PendingRequestsTable({ token, items, onDecision }: Readonly<Props>) {
  const [error, setError] = useState("");
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<DecisionInput>({
    resolver: zodResolver(decisionSchema),
    defaultValues: { comment: "" }
  });

  const decide = async (requestId: number, status: "APPROVED" | "REJECTED") => {
    setError("");
    const comment = getValues("comment");
    const confirmed = window.confirm(`Confirm ${status.toLowerCase()} for request #${requestId}?`);
    if (!confirmed) {
      return;
    }
    try {
      await decideAdvance(token, requestId, status, comment ?? "");
      onDecision();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decision failed");
    }
  };

  return (
    <section className="panel stack">
      <h2 style={{ margin: 0 }}>Pending Requests</h2>
      {items.length === 0 ? (
        <p className="hint">No pending requests right now.</p>
      ) : (
        <>
          <form className="stack" onSubmit={handleSubmit(() => undefined)}>
            <div>
              <label htmlFor="comment">Decision Comment (optional)</label>
              <textarea id="comment" rows={3} placeholder="Optional comment for this decision" {...register("comment")} />
              {errors.comment && <p className="error">{errors.comment.message}</p>}
            </div>
          </form>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.employeeName}</td>
                    <td>{item.amount}</td>
                    <td><span className="badge pending">{item.status}</span></td>
                    <td>{item.reason}</td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <button type="button" onClick={() => decide(item.id, "APPROVED")} disabled={isSubmitting}>
                        Approve
                      </button>
                      <button type="button" className="reject" onClick={() => decide(item.id, "REJECTED")} disabled={isSubmitting}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
