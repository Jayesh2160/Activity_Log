import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { api } from "../api";

const prompts = [
  "What would make today feel well spent?",
  "Small records reveal large patterns.",
  "Notice your time. Shape it gently.",
];

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const prompt = prompts[new Date().getDate() % prompts.length];

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story">
        <a className="brand brand-light" href="/">
          <span className="brand-mark">D</span> Daymark
        </a>
        <div className="story-copy">
          <span className="eyebrow"><Sparkles size={15} /> A quieter way to improve</span>
          <h1>{prompt}</h1>
          <p>
            Daymark helps you remember what happened, recognize what matters,
            and make tomorrow a little more intentional.
          </p>
        </div>
        <div className="mini-day">
          <div><span>09:00</span><i className="productive" /><b>Deep work</b></div>
          <div><span>11:00</span><i className="necessary" /><b>Email & admin</b></div>
          <div><span>13:00</span><i className="rest" /><b>Lunch outside</b></div>
          <div><span>15:00</span><i className="unwanted" /><b>Unplanned scrolling</b></div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mode-switch">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Create account</button>
          </div>
          <h2>{mode === "login" ? "Welcome back" : "Begin your record"}</h2>
          <p className="muted">
            {mode === "login" ? "Continue noticing where your days go." : "No leaderboard. No guilt. Just useful awareness."}
          </p>
          <form onSubmit={submit}>
            {mode === "signup" && (
              <label>Your name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="What should we call you?" /></label>
            )}
            <label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
            <label>
              Password
              <span className="password-field">
                <input required minLength="8" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={mode === "signup" ? "At least 8 characters" : "Your password"} />
                <button type="button" aria-label="Show password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button>
              </span>
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary full" disabled={loading}>
              {loading ? "One moment…" : mode === "login" ? "Enter Daymark" : "Create my Daymark"} <ArrowRight size={18} />
            </button>
          </form>
          <p className="privacy-note">Your activity record is private to your account.</p>
        </div>
      </section>
    </main>
  );
}
