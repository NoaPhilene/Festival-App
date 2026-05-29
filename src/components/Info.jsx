import { Icon } from './Icon';

export function Info({ t }) {
  return (
    <>
      <div className="px-18">
        <h1 className="h1" style={{ fontSize: 32 }}>{t.info.title}</h1>
        <p className="italic-light" style={{ color: 'var(--fg-muted)', fontSize: 14, marginTop: 6 }}>{t.info.sub}</p>
      </div>

      <div className="info-section">
        <h3 className="h3 eyebrow" style={{ color: 'var(--vermilion)', marginBottom: 12 }}>{t.info.sections.general}</h3>
        <div className="info-tile">
          <div className="ico"><Icon n="location_on" /></div>
          <div>
            <h4>{t.info.adres}</h4>
            <p>{t.info.navAdres}<br />{t.info.date}</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="h3 eyebrow" style={{ color: 'var(--vermilion)', marginBottom: 12 }}>{t.info.sections.access}</h3>
        {t.info.access.map((a, i) => (
          <div key={i} className="info-tile">
            <div className="ico"><Icon n={a.icon} /></div>
            <div>
              <h4>{a.title}</h4>
              <p>{a.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="info-section">
        <h3 className="h3 eyebrow" style={{ color: 'var(--vermilion)', marginBottom: 12 }}>{t.info.sections.lockers}</h3>
        <div className="info-tile">
          <div className="ico"><Icon n="lock" /></div>
          <div>
            <h4>{t.info.sections.lockers}</h4>
            <p>{t.info.lockerBody}</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3 className="h3 eyebrow" style={{ color: 'var(--vermilion)', marginBottom: 4 }}>{t.info.sections.faq}</h3>
        {t.info.faq.map((f, i) => (
          <details className="acc" key={i}>
            <summary>
              <span>{f.q}</span>
              <Icon n="add" />
            </summary>
            <div className="body">{f.a}</div>
          </details>
        ))}
      </div>

      <div className="info-section" style={{ marginBottom: 18 }}>
        <h3 className="h3 eyebrow" style={{ color: 'var(--saffron)', marginBottom: 12 }}>{t.info.sections.gold}</h3>
        <div className="info-tile" style={{ background: 'linear-gradient(135deg, #fff8d6, #ffe9a3)', borderColor: '#e3b505' }}>
          <div className="ico" style={{ background: '#e3b505', color: '#000' }}><Icon n="workspace_premium" /></div>
          <div>
            <h4 style={{ color: '#000' }}>Golden-GLU</h4>
            <p style={{ color: '#3a3000' }}>{t.info.gold}</p>
          </div>
        </div>
      </div>
    </>
  );
}
