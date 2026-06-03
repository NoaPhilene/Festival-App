import { Icon } from './Icon';
import { useAppData } from '../DataContext';

function fmtTime(mins) {
  const h = Math.floor(mins / 60) + 10;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function ActSheet({ open, act, t, lang, favs, toggleFav, onClose }) {
  const { D } = useAppData();
  const data = act && D.acts[act.act];
  const stage = act && D.stages.find(s => s.id === act.stage);
  const isFav = act && favs.has(act.key);

  return (
    <>
      <div className={`sheet-scrim ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`sheet ${open ? 'open' : ''}`}>
        <div className="grabber" />
        {act && (
          <>
            <div
              className="hero-img"
              style={data?.foto
                ? { backgroundImage: `url(${data.foto})`, backgroundPosition: 'center top' }
                : stage?.img
                  ? { backgroundImage: `url(${stage.img})` }
                  : { background: data?.hue || 'var(--vermilion)' }
              }
            >
              <div className="grad" />
              <div className="text">
                <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.95)' }}>
                  {stage?.name} · {fmtTime(act.start)} – {fmtTime(act.end)}
                </div>
                <h2 className="h1" style={{ fontSize: 36, marginTop: 8, color: '#fff' }}>{act.act}</h2>
                {data && (
                  <div className="italic-light" style={{ color: 'rgba(255,255,255,0.95)', marginTop: 6 }}>
                    {data.role[lang]}
                  </div>
                )}
              </div>
            </div>
            <div className="body">
              <div className="meta">
                <span className="chip"><Icon n="schedule" />{fmtTime(act.start)} – {fmtTime(act.end)}</span>
                <span className="chip"><Icon n="location_on" />{stage?.name}</span>
                <span className="chip"><Icon n="event" />{act.day === 'sat' ? t.schedule.sat : t.schedule.sun}</span>
              </div>
              <p className="desc">
                {data?.desc[lang] || (lang === 'nl' ? 'Programma-onderdeel op het festival.' : 'Festival programme item.')}
              </p>
              <div className="mt-16" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button className="btn ghost" style={{ padding: '12px' }}>
                  <Icon n="notifications" />15 min
                </button>
                <button className="btn ghost" style={{ padding: '12px' }}>
                  <Icon n="directions" />{lang === 'nl' ? 'Route' : 'Directions'}
                </button>
              </div>
            </div>
            <div className="actions">
              <button className="btn ghost" style={{ flex: 1 }} onClick={onClose}>
                {lang === 'nl' ? 'Sluit' : 'Close'}
              </button>
              <button className="btn primary" style={{ flex: 2 }} onClick={() => toggleFav(act.key)}>
                <Icon
                  n={isFav ? 'favorite' : 'favorite_border'}
                  style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                />
                {isFav ? t.sheet.removeFav : t.sheet.addFav}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
