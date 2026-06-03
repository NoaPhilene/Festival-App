import { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { requestPermission } from '../notifications';

function NotifToggle({ t, notifEnabled, setNotifEnabled }) {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  // Sync permission state when component mounts or focus returns
  useEffect(() => {
    const sync = () => {
      if ('Notification' in window) setPermission(Notification.permission);
    };
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  const handleToggle = async () => {
    if (notifEnabled) {
      // Uitzetten
      setNotifEnabled(false);
      return;
    }
    // Aanzetten: vraag toestemming indien nog niet verleend
    if (permission === 'unsupported') return;
    if (permission === 'denied') return;

    const result = await requestPermission();
    setPermission(result);
    if (result === 'granted') setNotifEnabled(true);
  };

  return (
    <div className="info-tile notif-tile">
      <div className="ico" style={{ background: notifEnabled ? 'var(--vermilion)' : undefined }}>
        <Icon n={notifEnabled ? 'notifications_active' : 'notifications'} />
      </div>
      <div style={{ flex: 1 }}>
        <h4>{t.notif.toggle}</h4>
        <p>{t.notif.desc}</p>
        {permission === 'denied' && (
          <p style={{ color: 'var(--vermilion)', marginTop: 4, fontSize: 12 }}>
            {t.notif.denied}
          </p>
        )}
        {permission === 'unsupported' && (
          <p style={{ color: 'var(--fg-muted)', marginTop: 4, fontSize: 12 }}>
            {t.notif.unsupported}
          </p>
        )}
      </div>
      {permission !== 'unsupported' && permission !== 'denied' && (
        <button
          className={`notif-switch${notifEnabled ? ' on' : ''}`}
          onClick={handleToggle}
          aria-pressed={notifEnabled}
          aria-label={t.notif.toggle}
        >
          <span className="knob" />
        </button>
      )}
      {permission === 'default' && !notifEnabled && (
        <button className="btn primary" style={{ fontSize: 12, padding: '6px 10px' }} onClick={handleToggle}>
          {t.notif.permBtn}
        </button>
      )}
    </div>
  );
}

export function Info({ t, notifEnabled, setNotifEnabled }) {
  return (
    <>
      <div className="px-18">
        <h1 className="h1" style={{ fontSize: 32 }}>{t.info.title}</h1>
        <p className="italic-light" style={{ color: 'var(--fg-muted)', fontSize: 14, marginTop: 6 }}>{t.info.sub}</p>
      </div>

      <div className="info-section">
        <h3 className="h3 eyebrow" style={{ color: 'var(--vermilion)', marginBottom: 12 }}>{t.notif.section}</h3>
        <NotifToggle t={t} notifEnabled={notifEnabled} setNotifEnabled={setNotifEnabled} />
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
