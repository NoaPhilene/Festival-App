import { useState, useEffect } from 'react';
import { Icon, Heart } from './Icon';
import { useAppData } from '../DataContext';

function Countdown({ t }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const target = new Date('2026-09-05T12:00:00+02:00').getTime();
  let diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const m = Math.floor(diff / 60000); diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  const cells = [d, h, m, s];
  return (
    <div className="countdown">
      {cells.map((v, i) => (
        <div className="cell" key={i}>
          <div className="num">{String(v).padStart(2, '0')}</div>
          <div className="lbl">{t.home.countdown[i]}</div>
        </div>
      ))}
    </div>
  );
}

export function Home({ t, onOpenAct, onGoto }) {
  const { D } = useAppData();
  return (
    <>
      <div className="hero">
        <div style={{ position: 'absolute', left: -20, top: -20, zIndex: 1, pointerEvents: 'none' }}>
          <Heart size={280} color="rgba(255,255,255,0.10)" />
        </div>
        <div className="ghost-heart">
          <svg width="100%" height="100%" viewBox="0 0 32 28">
            <path d="M16 27.5C2.7 18.6 0 13.3 0 8.4 0 3.7 3.7 0 8.4 0c2.9 0 5.6 1.5 7.6 4 2-2.5 4.7-4 7.6-4C28.3 0 32 3.7 32 8.4c0 4.9-2.7 10.2-16 19.1z" fill="currentColor" />
          </svg>
        </div>
        <div className="inner">
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)' }}>{t.home.countdownEyebrow}</div>
            <div style={{ height: 10 }} />
            <Countdown t={t} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <Heart size={32} color="#fff" />
              <h2 className="h1" style={{ fontSize: 56, color: '#fff' }}>U</h2>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', opacity: 0.9 }}>
              FESTIVAL · STRIJKVIERTEL · 2026
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 px-18" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="h2" style={{ fontSize: 20 }}>{t.home.stages}</h3>
        <button className="btn ghost" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => onGoto('map')}>
          <Icon n="map" style={{ fontSize: 14 }} /> {t.home.seeAll}
        </button>
      </div>
      <div className="mt-12 px-16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {D.stages.map((s, i) => (
          <div
            key={s.id}
            className="stage-photo"
            style={{ backgroundImage: `url(${s.img})` }}
            onClick={() => onGoto('schedule')}
          >
            <div className="grad" />
            {i === 0 && <div className="badge">🔴 {t.home.live}</div>}
            <div className="label">{s.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-24 px-18" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 className="h2" style={{ fontSize: 20 }}>{t.home.feed}</h3>
        <span className="eyebrow" style={{ color: 'var(--fg-soft)' }}>{t.home.nowEyebrow}</span>
      </div>
      <div className="mt-12" style={{ margin: '0 14px' }}>
        <div className="card">
          {t.home.items.map((it, i) => (
            <div key={i} className="feed-item">
              <div className={`feed-icon ${it.type}`}>
                <Icon
                  n={it.type === 'red' ? 'notifications_active' : it.type === 'blue' ? 'graphic_eq' : 'info'}
                  style={{ fontSize: 20 }}
                />
              </div>
              <div className="feed-body">
                <div className="t">{it.t}</div>
                <div className="d">{it.d}</div>
                <div className="ts">{it.ts}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
