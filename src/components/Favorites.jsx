import { useMemo } from 'react';
import { Icon, Heart } from './Icon';
import { useAppData } from '../DataContext';

function fmtTime(mins) {
  const h = Math.floor(mins / 60) + 10;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const stageColor = {
  ponton: 'var(--vermilion)',
  lake: 'var(--cerulean)',
  club: '#1f1f1f',
  hangar: 'var(--saffron)',
};

export function Favorites({ t, lang, favs, toggleFav, onOpenAct, onGoto }) {
  const { D } = useAppData();
  const items = useMemo(() => {
    const out = [];
    for (const key of favs) {
      const m = key.match(/^(sat|sun)-([a-z]+)-(\d+)-(.+)$/);
      if (!m) continue;
      const [, day, stageId, startStr, actName] = m;
      const start = parseInt(startStr, 10);
      const dayItems = day === 'sat' ? D.sat : D.sun;
      const item = dayItems.find(it => it.stage === stageId && it.start === start && it.act === actName);
      if (!item) continue;
      const stage = D.stages.find(s => s.id === stageId);
      out.push({ ...item, day, key, stage });
    }
    out.sort((a, b) => {
      if (a.day !== b.day) return a.day === 'sat' ? -1 : 1;
      return a.start - b.start;
    });
    return out;
  }, [favs]);

  const groups = items.reduce((acc, it) => {
    (acc[it.day] = acc[it.day] || []).push(it);
    return acc;
  }, {});

  return (
    <>
      <div className="px-18">
        <h1 className="h1" style={{ fontSize: 36 }}>
          <Heart size={28} color="var(--vermilion)" /> {t.favs.title}
        </h1>
        <p className="italic-light" style={{ color: 'var(--fg-muted)', fontSize: 14, marginTop: 6 }}>
          {items.length === 0 ? t.favs.sub : t.favs.count(items.length)}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="fav-empty">
          <Icon n="favorite" style={{ fontSize: 36, color: 'var(--vermilion)', fontVariationSettings: "'FILL' 1" }} />
          <p>{t.favs.empty}</p>
          <button className="btn primary mt-12" onClick={() => onGoto('schedule')}>
            <Icon n="event_note" /> {t.favs.cta}
          </button>
        </div>
      ) : (
        <div className="mt-12" style={{ paddingBottom: 8 }}>
          {['sat', 'sun'].map(d => groups[d] && (
            <div key={d}>
              <div className={`fav-day-header ${d === 'sat' || (!groups.sat && d === 'sun') ? 'first' : ''}`}>
                {t.favs.day[d]}
              </div>
              {groups[d].map(it => (
                <div
                  key={it.key}
                  className="fav-card"
                  style={{ backgroundImage: `url(${it.stage.img})` }}
                  onClick={() => onOpenAct(it)}
                >
                  <div className="top-row">
                    <span className="stage-chip">
                      <span className="sd" style={{ background: stageColor[it.stage.id] }} />
                      {it.stage.name}
                    </span>
                    <button
                      className="heart-btn"
                      onClick={(e) => { e.stopPropagation(); toggleFav(it.key); }}
                      aria-label="Remove favorite"
                    >
                      <Icon n="favorite" />
                    </button>
                  </div>
                  <div>
                    <div className="name">{it.act}</div>
                    <div className="meta mt-8">
                      <span className="item"><Icon n="schedule" />{fmtTime(it.start)} – {fmtTime(it.end)}</span>
                      <span className="item"><Icon n="hourglass_top" />{it.end - it.start} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
