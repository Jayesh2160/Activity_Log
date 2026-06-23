import { useEffect, useState } from "react";
import { BarChart3, CalendarRange, LogOut, Menu, ShieldAlert, X } from "lucide-react";
import { api } from "./api";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Insights from "./components/Insights";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [page, setPage] = useState("today");
  const [menu, setMenu] = useState(false);
  useEffect(() => { api("/auth/me").then((data) => setUser(data.user)).catch(() => {}).finally(() => setChecking(false)); }, []);
  if (checking) return <div className="splash"><span className="brand-mark">D</span></div>;
  if (!user) return <Auth onAuthenticated={setUser} />;

  const nav = [
    ["today", CalendarRange, "Today"],
    ["insights", BarChart3, "Insights"],
    ["unwanted", ShieldAlert, "Unwanted"],
  ];
  async function logout() { await api("/auth/logout", { method: "POST" }); setUser(null); }
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <div className="sidebar-top"><span className="brand"><span className="brand-mark">D</span> Daymark</span><button className="mobile-close" onClick={() => setMenu(false)}><X /></button></div>
        <nav>{nav.map(([id, Icon, label]) => <button key={id} className={page === id ? "active" : ""} onClick={() => { setPage(id); setMenu(false); }}><Icon />{label}</button>)}</nav>
        <div className="sidebar-user"><span>{user.name[0].toUpperCase()}</span><div><b>{user.name}</b><small>{user.email}</small></div><button onClick={logout} title="Sign out"><LogOut /></button></div>
      </aside>
      <div className="mobile-bar"><button onClick={() => setMenu(true)}><Menu /></button><span className="brand">Daymark</span></div>
      <main className="main-content">{page === "today" && <Dashboard />}{page === "insights" && <Insights />}{page === "unwanted" && <Insights unwantedOnly />}</main>
    </div>
  );
}
