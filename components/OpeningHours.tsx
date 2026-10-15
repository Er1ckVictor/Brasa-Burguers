'use client';

import { WEEK, fmtShifts } from '@/lib/hours';
import { useStoreStatus } from '@/hooks/useStoreStatus';

/** "Fechado agora" → "Fechado" + " agora" (the suffix hides on small screens to fit the header). */
function CompactLabel({ text }: { text: string }) {
  const i = text.indexOf(' ');
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<span className="status__extra">{text.slice(i)}</span></>;
}

export function StatusPill({ compact = false }: { compact?: boolean }) {
  const status = useStoreStatus();
  if (!status) return <span className="status status--pending" aria-hidden="true" />;
  return (
    <span className={`status ${status.isOpen ? 'status--open' : 'status--closed'}`} role="status">
      <span className="status__dot" aria-hidden="true" />
      {compact ? <CompactLabel text={status.short} /> : status.label}
    </span>
  );
}

export default function OpeningHours() {
  const status = useStoreStatus();
  return (
    <div className="hours">
      <div className="hours__head">
        <div className="info__label">Horário de funcionamento</div>
        <StatusPill />
      </div>
      <ul className="hours__list">
        {WEEK.map((d) => {
          const isToday = status?.today === d.day;
          const closed = d.shifts.length === 0;
          return (
            <li key={d.day} className={`hours__row${isToday ? ' hours__row--today' : ''}${closed ? ' hours__row--closed' : ''}`}
              aria-current={isToday ? 'date' : undefined}>
              <span className="hours__day">
                {d.label}
                {isToday && <span className="hours__today">hoje</span>}
              </span>
              <span className="hours__time">{fmtShifts(d.shifts)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
