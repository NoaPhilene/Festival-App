import { useState, useEffect, useCallback } from 'react';
import { DataProvider, useAppData } from './DataContext';
import { StatusBar } from './components/StatusBar';
import { TopBar } from './components/TopBar';
import { Onboarding } from './components/Onboarding';
import { Home } from './components/Home';
import { Schedule } from './components/Schedule';
import { Favorites } from './components/Favorites';
import { MapScreen } from './components/MapScreen';
import { Info } from './components/Info';
import { ActSheet } from './components/ActSheet';
import { Icon } from './components/Icon';

function LoadingScreen() {
  return (
    <div className="stage">
      <div className="phone">
        <div className="phone-left" />
        <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
          <Icon n="favorite" style={{ fontSize: 48, color: 'var(--vermilion)', fontVariationSettings: "'FILL' 1" }} />
          <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 14 }}>Laden…</p>
        </div>
      </div>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className="stage">
      <div className="phone">
        <div className="phone-left" />
        <div className="screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 24 }}>
          <Icon n="error" style={{ fontSize: 48, color: 'var(--vermilion)' }} />
          <p style={{ margin: 0, fontWeight: 700 }}>Kan geen verbinding maken</p>
          <p style={{ margin: 0, color: 'var(--fg-muted)', fontSize: 13, textAlign: 'center' }}>
            Zorg dat XAMPP draait en de <code>api/</code> map bereikbaar is via Apache.
          </p>
          <p style={{ margin: 0, color: 'var(--fg-soft)', fontSize: 11 }}>{message}</p>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const { D, loading, error } = useAppData();
  const [lang, setLang] = useState('nl');
  const [dark, setDark] = useState(false);
  const [screen, setScreen] = useState('onb');
  const [favs, setFavs] = useState(new Set([
    'sat-ponton-120-Armin van Buuren',
    'sat-ponton-240-Kensington',
    'sun-ponton-120-Martin Garrix',
  ]));
  const [openAct, setOpenAct] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  const toggleFav = useCallback((key) => {
    setFavs(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
  }, []);

  if (loading) return <LoadingScreen />;
  if (error || !D) return <ErrorScreen message={error} />;

  const t = D.i18n[lang];
  const sharedProps = { t, lang, favs, toggleFav, onOpenAct: setOpenAct, onGoto: setScreen };

  const screens = {
    home:     <Home     {...sharedProps} />,
    schedule: <Schedule {...sharedProps} />,
    favs:     <Favorites {...sharedProps} />,
    map:      <MapScreen t={t} />,
    info:     <Info t={t} />,
  };

  const tabs = [
    { id: 'home',     icon: 'home',       label: t.tabs.home },
    { id: 'schedule', icon: 'event_note', label: t.tabs.schedule },
    { id: 'favs',     icon: 'favorite',   label: t.tabs.favs },
    { id: 'map',      icon: 'map',        label: t.tabs.map },
    { id: 'info',     icon: 'info',       label: t.tabs.info },
  ];

  return (
    <div className="stage">
      <div className="phone">
        <div className="phone-left" />
        <div className="screen">
          <StatusBar />

          {screen !== 'onb' && screen !== 'map' && (
            <TopBar
              lang={lang} dark={dark}
              onLang={() => setLang(l => l === 'nl' ? 'en' : 'nl')}
              onDark={() => setDark(d => !d)}
            />
          )}
          {screen === 'map' && (
            <TopBar
              lang={lang} dark={dark}
              title={t.map.title}
              onLang={() => setLang(l => l === 'nl' ? 'en' : 'nl')}
              onDark={() => setDark(d => !d)}
            />
          )}

          <div className="content" style={screen === 'map' ? { padding: 0, position: 'relative' } : {}}>
            {screens[screen] || null}
          </div>

          {screen !== 'onb' && (
            <div className="tabbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab ${screen === tab.id ? 'active' : ''}`}
                  onClick={() => setScreen(tab.id)}
                >
                  <Icon n={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}

          <ActSheet
            open={!!openAct}
            act={openAct}
            t={t}
            lang={lang}
            favs={favs}
            toggleFav={toggleFav}
            onClose={() => setOpenAct(null)}
          />

          {screen === 'onb' && (
            <Onboarding t={t} onDone={() => setScreen('home')} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppInner />
    </DataProvider>
  );
}
