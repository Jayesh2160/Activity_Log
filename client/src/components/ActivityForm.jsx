import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { today } from "../utils";

const blank = {
  title: "",
  date: today(),
  startTime: "09:00",
  endTime: "10:00",
  category: "productive",
  area: "work",
  notes: "",
  trigger: "",
  interrupted: false,
};

export default function ActivityForm({ activity, selectedDate, onSave, onClose }) {
  const [form, setForm] = useState({ ...blank, date: selectedDate });
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(activity ? { ...blank, ...activity } : { ...blank, date: selectedDate });
  }, [activity, selectedDate]);

  function submit(event) {
    event.preventDefault();
    if (form.endTime <= form.startTime) return setError("End time must be after start time.");
    onSave(form);
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="activity-form" onSubmit={submit}>
        <header>
          <div><span className="eyebrow">TIME ENTRY</span><h2>{activity ? "Edit activity" : "What were you doing?"}</h2></div>
          <button className="icon-button" type="button" onClick={onClose}><X /></button>
        </header>
        <label>Activity<input autoFocus required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Worked on project proposal" /></label>
        <div className="form-grid three">
          <label>Date<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></label>
          <label>Started<input required type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></label>
          <label>Finished<input required type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></label>
        </div>
        <fieldset>
          <legend>How did this time serve you?</legend>
          <div className="category-picker">
            {[
              ["productive", "Productive", "Moved something important"],
              ["necessary", "Necessary", "Needed, but not progress"],
              ["rest", "Rest", "Intentional recovery"],
              ["unwanted", "Unwanted", "Not how I meant to spend it"],
            ].map(([value, label, help]) => (
              <label className={`category-option ${form.category === value ? "selected" : ""}`} key={value}>
                <input type="radio" name="category" value={value} checked={form.category === value} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <i className={value} /><span><b>{label}</b><small>{help}</small></span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="form-grid">
          <label>Area<select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
            <option value="work">Work</option><option value="study">Study</option>
            <option value="health">Health</option><option value="personal">Personal</option>
            <option value="social">Social</option><option value="other">Other</option>
          </select></label>
          <label className="check-label"><input type="checkbox" checked={form.interrupted} onChange={(e) => setForm({ ...form, interrupted: e.target.checked })} /> This activity was interrupted</label>
        </div>
        {form.category === "unwanted" && <label>What triggered it?<input value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })} placeholder="Boredom, notification, avoiding a task…" /></label>}
        <label>Notes <span className="optional">optional</span><textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Anything worth remembering?" /></label>
        {error && <p className="form-error">{error}</p>}
        <footer><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary">Save activity</button></footer>
      </form>
    </div>
  );
}
