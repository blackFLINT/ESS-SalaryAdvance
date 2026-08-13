import { LoginForm } from "../components/LoginForm";

export default function HomePage() {
  return (
    <main className="page">
      <section className="card stack" style={{ maxWidth: 520 }}>
        <h1 className="title">Employee Self Service</h1>
        <p className="subtitle">Salary Advance Portal</p>
        <LoginForm />
      </section>
    </main>
  );
}
