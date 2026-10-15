export const TIMEZONE = 'America/Sao_Paulo';

export interface Shift { open: string; close: string }

// 0 = domingo ... 6 = sábado
export const WEEK: { day: number; label: string; short: string; shifts: Shift[] }[] = [
  { day: 1, label: 'Segunda', short: 'Seg', shifts: [{ open: '18:00', close: '22:00' }] },
  { day: 2, label: 'Terça', short: 'Ter', shifts: [{ open: '18:00', close: '23:00' }] },
  { day: 3, label: 'Quarta', short: 'Qua', shifts: [{ open: '18:00', close: '23:00' }] },
  { day: 4, label: 'Quinta', short: 'Qui', shifts: [{ open: '18:00', close: '23:00' }] },
  { day: 5, label: 'Sexta', short: 'Sex', shifts: [{ open: '18:00', close: '00:30' }] },
  { day: 6, label: 'Sábado', short: 'Sáb', shifts: [] },
  { day: 0, label: 'Domingo', short: 'Dom', shifts: [{ open: '18:00', close: '00:30' }] },
];

const byDay = (d: number) => WEEK.find((w) => w.day === ((d % 7) + 7) % 7)!;
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

/** "18:00" -> "18h", "00:30" -> "00h30" */
export const fmtTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':');
  return `${h.padStart(2, '0')}h${m && m !== '00' ? m : ''}`;
};

export const fmtShifts = (shifts: Shift[]) =>
  shifts.length ? shifts.map((s) => `${fmtTime(s.open)} às ${fmtTime(s.close)}`).join(' · ') : 'Fechado';

/** Weekday (0–6) and minutes since midnight in the restaurant's time zone. */
export function nowInStore(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export interface StoreStatus {
  isOpen: boolean;
  today: number;
  /** ex.: "Aberto agora · fecha às 23h" / "Fechado · abre hoje às 18h" */
  label: string;
  short: string;
}

export function getStatus(date = new Date()): StoreStatus {
  const { day, minutes } = nowInStore(date);

  // open from a shift that started today?
  for (const s of byDay(day).shifts) {
    const o = toMin(s.open), c = toMin(s.close);
    const crosses = c <= o;
    if (minutes >= o && (crosses || minutes < c)) {
      return { isOpen: true, today: day, short: 'Aberto agora', label: `Aberto agora · fecha às ${fmtTime(s.close)}` };
    }
  }
  // still open from yesterday's late shift?
  for (const s of byDay(day - 1).shifts) {
    const o = toMin(s.open), c = toMin(s.close);
    if (c <= o && minutes < c) {
      return { isOpen: true, today: day, short: 'Aberto agora', label: `Aberto agora · fecha às ${fmtTime(s.close)}` };
    }
  }
  // next opening
  for (let add = 0; add < 8; add++) {
    const d = byDay(day + add);
    const next = d.shifts.map((s) => toMin(s.open)).sort((a, b) => a - b).find((o) => add > 0 || o > minutes);
    if (next !== undefined) {
      const hhmm = `${String(Math.floor(next / 60)).padStart(2, '0')}:${String(next % 60).padStart(2, '0')}`;
      const when = add === 0 ? 'hoje' : add === 1 ? 'amanhã' : d.label.toLowerCase();
      return { isOpen: false, today: day, short: 'Fechado agora', label: `Fechado · abre ${when} às ${fmtTime(hhmm)}` };
    }
  }
  return { isOpen: false, today: day, short: 'Fechado', label: 'Fechado' };
}
