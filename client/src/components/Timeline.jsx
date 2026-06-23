import { Edit3, Trash2 } from "lucide-react";
import { formatDuration, minutesBetween, shortTime } from "../utils";

export default function Timeline({ activities, onEdit, onDelete }) {
  if (!activities.length) {
    return <div className="empty-state"><div className="empty-sun">☼</div><h3>A clear page</h3><p>Add your first activity when you’re ready. Honest beats perfect.</p></div>;
  }
  return (
    <div className="timeline">
      {activities.map((item) => (
        <article className="timeline-item" key={item._id}>
          <div className="time"><b>{shortTime(item.startTime)}</b><span>{shortTime(item.endTime)}</span></div>
          <i className={`timeline-dot ${item.category}`} />
          <div className="activity-card">
            <div>
              <span className={`category-tag ${item.category}`}>{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.area} · {formatDuration(minutesBetween(item.startTime, item.endTime))}{item.interrupted ? " · interrupted" : ""}</p>
              {item.notes && <small>{item.notes}</small>}
            </div>
            <div className="card-actions">
              <button onClick={() => onEdit(item)} aria-label="Edit"><Edit3 /></button>
              <button onClick={() => onDelete(item._id)} aria-label="Delete"><Trash2 /></button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
