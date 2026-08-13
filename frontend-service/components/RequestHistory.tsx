import { AdvanceRequest } from "../lib/types";

interface Props {
  items: AdvanceRequest[];
}

export function RequestHistory({ items }: Readonly<Props>) {
  const badgeClass = (status: AdvanceRequest["status"]) => {
    if (status === "APPROVED") {
      return "badge approved";
    }
    if (status === "REJECTED") {
      return "badge rejected";
    }
    if (status === "PROCESSED") {
      return "badge processed";
    }
    return "badge pending";
  };

  return (
    <section className="panel stack">
      <h2 style={{ margin: 0 }}>My Requests</h2>
      {items.length === 0 ? (
        <p className="hint">No requests submitted yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Comment</th>
                <th>Repayment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span className={badgeClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.approverComment || "-"}</td>
                  <td>
                    {item.status === "PROCESSED" ? (
                      <span>{item.repaymentInstallments} x {item.monthlyDeductionAmount} / remaining {item.remainingBalance}</span>
                    ) : (
                      <span className="hint">{item.repaymentStatus}</span>
                    )}
                  </td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
