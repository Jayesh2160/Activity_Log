import { useEffect, useState } from "react";
import { Lightbulb, TrendingUp } from "lucide-react";
import { api } from "../api";
import { formatDuration } from "../utils";

export default function Insights({ unwantedOnly = false }) {
  const [data, setData] = useState(null);
  const [unwanted, setUnwanted] = useState([]);
  useEffect(() => {
    api("/insights").then(setData);
    if (unwantedOnly) api("/activities?category=unwanted").then((res) => setUnwanted(res.activities));
  }, [unwantedOnly]);
  if (!data) return <div className="loading">Reading your patterns…</div>;

  if (unwantedOnly) return (
    <>
      <header className="page-header"><div><span className="eyebrow">PATTERN, NOT VERDICT</span><h1>Unwanted activities</h1><p>See what repeatedly takes time away from your intentions.</p></div></header>
      <div className="insight-grid">
        <section className="panel"><div className="section-heading"><h2>Recurring patterns</h2><b>{formatDuration(data.totals.unwanted)} this week</b></div>
          {data.topDistractions.length ? data.topDistractions.map((item, index) => <div className="rank-row" key={item.title}><span>{index + 1}</span><b>{item.title}</b><em>{formatDuration(item.minutes)}</em></div>) : <div className="empty-small">No unwanted time logged this week.</div>}
        </section>
        <section className="coach-card"><Lightbulb /><span className="eyebrow">TRY THIS</span><h2>{data.suggestions[0].title}</h2><p>{data.suggestions[0].text}</p></section>
      </div>
      <section className="panel"><div className="section-heading"><h2>Complete history</h2><span>{unwanted.length} entries</span></div>
        {unwanted.length ? unwanted.map((item) => <article className="history-row" key={item._id}><i className="unwanted" /><div><b>{item.title}</b><span>{item.date} · {item.startTime}–{item.endTime}</span>{item.trigger && <small>Trigger: {item.trigger}</small>}</div></article>) : <div className="empty-small">Nothing here yet—and that’s perfectly fine.</div>}
      </section>
    </>
  );

  const max = Math.max(...data.days.map((d) => Object.values(d).slice(1).reduce((a, b) => a + b, 0)), 1);
  return (
    <>
      <header className="page-header"><div><span className="eyebrow">LAST 7 DAYS</span><h1>Your patterns</h1><p>Useful evidence about how your time is actually working.</p></div></header>
      <section className="metric-grid">
        {Object.entries(data.totals).map(([type, minutes]) => <div className="metric-card" key={type}><i className={type} /><span>{type} time</span><b>{formatDuration(minutes)}</b></div>)}
      </section>
      <div className="insight-grid">
        <section className="panel"><div className="section-heading"><h2>Weekly rhythm</h2><TrendingUp /></div>
          <div className="week-chart">{data.days.map((day) => {
            const total = Object.values(day).slice(1).reduce((a, b) => a + b, 0);
            return <div className="bar-column" key={day.date}><div className="bar" style={{ height: `${Math.max(8, total / max * 170)}px` }}>{["unwanted", "rest", "necessary", "productive"].map((type) => <i key={type} className={type} style={{ flex: day[type] || 0 }} />)}</div><span>{new Date(`${day.date}T12:00`).toLocaleDateString([], { weekday: "short" })}</span></div>;
          })}</div>
        </section>
        <section className="suggestion-list"><span className="eyebrow">DAYMARK COACH</span><h2>Ideas from your record</h2>{data.suggestions.map((item) => <article key={item.title}><Lightbulb /><div><b>{item.title}</b><p>{item.text}</p></div></article>)}</section>
      </div>
    </>
  );
}
