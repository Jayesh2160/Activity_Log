import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { api } from "../api";
import { formatDuration, minutesBetween, prettyDate, today } from "../utils";
import Timeline from "./Timeline";
import ActivityForm from "./ActivityForm";

export default function Dashboard() {
  const [date, setDate] = useState(today());
  const [activities, setActivities] = useState([]);
  const [editing, setEditing] = useState(undefined);
  const [showForm, setShowForm] = useState(false);
  const [reflection, setReflection] = useState({ win: "", distraction: "", tomorrow: "" });
  const [saved, setSaved] = useState(false);

  async function load() {
    const [activityData, reflectionData] = await Promise.all([
      api(`/activities?date=${date}`),
      api(`/reflections/${date}`),
    ]);
    setActivities(activityData.activities);
    setReflection(reflectionData.reflection || { win: "", distraction: "", tomorrow: "" });
  }
  useEffect(() => { load(); }, [date]);

  const totals = useMemo(() => activities.reduce((acc, item) => {
    acc[item.category] += minutesBetween(item.startTime, item.endTime);
    return acc;
  }, { productive: 0, necessary: 0, rest: 0, unwanted: 0 }), [activities]);

  async function saveActivity(form) {
    await api(`/activities${editing ? `/${editing._id}` : ""}`, {
      method: editing ? "PUT" : "POST",
      body: JSON.stringify(form),
    });
    setShowForm(false); setEditing(undefined); load();
  }
  async function remove(id) {
    if (!window.confirm("Delete this activity?")) return;
    await api(`/activities/${id}`, { method: "DELETE" }); load();
  }
  function moveDate(direction) {
    const next = new Date(`${date}T12:00:00`);
    next.setDate(next.getDate() + direction);
    setDate(next.toISOString().slice(0, 10));
  }
  async function saveReflection() {
    await api(`/reflections/${date}`, { method: "PUT", body: JSON.stringify(reflection) });
    setSaved(true); setTimeout(() => setSaved(false), 1600);
  }

  return (
    <>
      <header className="page-header">
        <div><span className="eyebrow">{date === today() ? "TODAY" : "DAILY RECORD"}</span><h1>{prettyDate(date)}</h1></div>
        <button className="primary" onClick={() => { setEditing(undefined); setShowForm(true); }}><Plus /> Add activity</button>
      </header>
      <div className="date-nav">
        <button onClick={() => moveDate(-1)}><ChevronLeft /></button>
        <label><CalendarDays /><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <button onClick={() => moveDate(1)} disabled={date >= today()}><ChevronRight /></button>
        {date !== today() && <button className="text-button" onClick={() => setDate(today())}>Return to today</button>}
      </div>
      <section className="summary-strip">
        {Object.entries(totals).map(([type, minutes]) => <div key={type}><i className={type} /><span>{type}</span><b>{formatDuration(minutes)}</b></div>)}
      </section>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-heading"><div><span className="eyebrow">TIMELINE</span><h2>Your day, as it happened</h2></div><span>{activities.length} entries</span></div>
          <Timeline activities={activities} onEdit={(item) => { setEditing(item); setShowForm(true); }} onDelete={remove} />
        </section>
        <aside className="reflection-card">
          <span className="eyebrow">EVENING CHECK-IN</span><h2>Close the loop</h2><p>Two quiet minutes can turn experience into a better tomorrow.</p>
          <label>What went well?<textarea value={reflection.win} onChange={(e) => setReflection({ ...reflection, win: e.target.value })} /></label>
          <label>What pulled you off course?<textarea value={reflection.distraction} onChange={(e) => setReflection({ ...reflection, distraction: e.target.value })} /></label>
          <label>What will you try tomorrow?<textarea value={reflection.tomorrow} onChange={(e) => setReflection({ ...reflection, tomorrow: e.target.value })} /></label>
          <button className="secondary full" onClick={saveReflection}>{saved ? "Reflection saved ✓" : "Save reflection"}</button>
        </aside>
      </div>
      {showForm && <ActivityForm activity={editing} selectedDate={date} onSave={saveActivity} onClose={() => { setShowForm(false); setEditing(undefined); }} />}
    </>
  );
}
