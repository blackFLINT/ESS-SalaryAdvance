import { AdvanceRequest } from "../lib/types";

interface Props {
  items: AdvanceRequest[];
}

function percentage(value: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

export function DashboardCharts({ items }: Readonly<Props>) {
  const total = items.length;
  const pending = items.filter((x) => x.status === "PENDING").length;
  const approved = items.filter((x) => x.status === "APPROVED").length;
  const rejected = items.filter((x) => x.status === "REJECTED").length;

  const latest = [...items]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-6);
  const maxAmount = latest.reduce((m, x) => Math.max(m, Number(x.amount)), 1);

  return (
    <section className="panel stack">
      <h2 style={{ margin: 0 }}>Request Insights</h2>

      <div className="stack" style={{ gap: 8 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>Status Distribution</p>

        <div className="bar-row">
          <span className="bar-label">Pending</span>
          <div className="bar-track"><div className="bar-fill pending" style={{ width: `${percentage(pending, total)}%` }} /></div>
          <span className="bar-value">{pending}</span>
        </div>

        <div className="bar-row">
          <span className="bar-label">Approved</span>
          <div className="bar-track"><div className="bar-fill approved" style={{ width: `${percentage(approved, total)}%` }} /></div>
          <span className="bar-value">{approved}</span>
        </div>

        <div className="bar-row">
          <span className="bar-label">Rejected</span>
          <div className="bar-track"><div className="bar-fill rejected" style={{ width: `${percentage(rejected, total)}%` }} /></div>
          <span className="bar-value">{rejected}</span>
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>Latest Request Amounts</p>
        {latest.length === 0 ? (
          <p className="hint">No request data to plot yet.</p>
        ) : (
          <div className="spark-grid">
            {latest.map((item) => {
              const height = Math.max(12, Math.round((Number(item.amount) / maxAmount) * 100));
              return (
                <div className="spark-col" key={item.id} title={`#${item.id} - ${item.amount}`}>
                  <div className="spark-bar" style={{ height: `${height}%` }} />
                  <span className="spark-label">#{item.id}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
