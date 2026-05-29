import { Icon, Brand } from './Icon';

export function TopBar({ lang, dark, onLang, onDark, title }) {
  return (
    <div className="topbar">
      <Brand size={18} />
      {title && (
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>
          {title}
        </div>
      )}
      <div className="actions">
        <button className="icon-btn" onClick={onLang} aria-label="Language" title={lang === 'nl' ? 'Nederlands' : 'English'}>
          <span className="flag">{lang === 'nl' ? '🇳🇱' : '🇬🇧'}</span>
        </button>
        <button className="icon-btn" onClick={onDark} aria-label="Theme">
          <Icon n={dark ? 'dark_mode' : 'light_mode'} />
        </button>
      </div>
    </div>
  );
}
