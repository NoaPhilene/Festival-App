import { useState } from 'react';
import { Icon } from './Icon';
import { useAppData } from '../DataContext';

const TIME_START = 0;
const PXMIN = 1.6;

function fmtTime(mins) {
  const h = Math.floor(mins / 60) + 10;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const HOURS = Array.from({ length: 15 }, (_, i) => 10 + i);

export function Schedule({ t, lang, favs, toggleFav, onOpenAct, onGoto }) {
  const { D } = useAppData();
  const [day, setDay] = useState('sat');
  const items = day === 'sat' ? D.sat : D.sun;
  const tx = (mins) => (mins - TIME_START) * PXMIN;

  return (
    <>
      <div className="px-18" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 className="h1" style={{ fontSize: 32 }}>{t.tabs.schedule}</h1>
        <span
          className="chip outline"
          onClick={() => onGoto && onGoto('favs')}
          style={{ cursor: 'pointer' }}
        >
          <Icon n="favorite" style={{ color: 'var(--vermilion)', fontVariationSettings: "'FILL' 1" }} /> {favs.size}
        </span>
      </div>
      <div className="mt-12 sched-tabs">
        <button className={`sched-tab ${day === 'sat' ? 'active' : ''}`} onClick={() => setDay('sat')}>
          {t.schedule.sat}
        </button>
        <button className={`sched-tab ${day === 'sun' ? 'active' : ''}`} onClick={() => setDay('sun')}>
          {t.schedule.sun}
        </button>
      </div>
      <div className="sched-wrap">
        <div className="sched-scroll">
          <div className="sched sched-inner">
            <div className="sched-toprow">
              <div className="sched-corner">
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Stage
                </div>
              </div>
              <div className="hours">
                {Array.from({ length: 28 }, (_, i) => {
                  const mins = i * 30;
                  const h = 10 + Math.floor(mins / 60);
                  const half = mins % 60 === 30;
                  return (
                    <div key={i} className="sched-hour" style={{ left: mins * PXMIN, width: 30 * PXMIN, opacity: half ? 0.5 : 1 }}>
                      {half ? ':30' : `${String(h % 24).padStart(2, '0')}:00`}
                    </div>
                  );
                })}
              </div>
            </div>
            {D.stages.map(s => (
              <div key={s.id} className="sched-row">
                <div className={`stage-cell s-${s.id}`}>
                  <div className="dot" />
                  <div className="nm">{s.name}</div>
                  <div className="dt">{s.desc[lang]}</div>
                </div>
                <div className="stage-track">
                  {items.filter(it => it.stage === s.id).map((it, i) => {
                    const left = tx(it.start);
                    const w = (it.end - it.start) * PXMIN;
                    const key = `${day}-${it.stage}-${it.start}-${it.act}`;
                    const isFav = favs.has(key);
                    return (
                      <div
                        key={i}
                        className={`act-block ${s.tone} ${isFav ? 'fav' : ''}`}
                        style={{ left: left + 2, width: Math.max(50, w - 4) }}
                        onClick={() => onOpenAct({ ...it, day, key })}
                      >
                        <div className="a-name">{it.act}</div>
                        <div className="a-time">{fmtTime(it.start)}–{fmtTime(it.end)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="px-18 mt-12 italic-light" style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
        {lang === 'nl'
          ? 'Veeg horizontaal om uren te zien. Tik op een act voor details.'
          : 'Swipe horizontally to see hours. Tap an act for details.'}
      </p>
    </>
  );
}
