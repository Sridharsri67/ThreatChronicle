import React from 'react';
import EventCard from './EventCard';
import { Clock } from 'lucide-react';

export default function EventTimeline({ events }) {
  return (
    <div className="timeline-section">
      <div className="card-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={15} />
          <span>Chronological Telemetry Stream ({events ? events.length : 0})</span>
        </div>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          ORDER: TIMESTAMP ASC
        </span>
      </div>

      <div className="timeline-list">
        {events && events.length > 0 ? (
          events.map((evt, idx) => (
            <EventCard key={evt.eventId || idx} event={evt} />
          ))
        ) : (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            No raw telemetry events recorded for this threat.
          </div>
        )}
      </div>
    </div>
  );
}
