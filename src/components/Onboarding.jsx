import { useState, useMemo } from 'react';
import { Icon, Heart, Brand } from './Icon';

function QRPattern() {
  const seed = useMemo(() => {
    const arr = [];
    let x = 0x2f6e1c;
    for (let i = 0; i < 441; i++) {
      x = (x * 1103515245 + 12345) & 0x7fffffff;
      arr.push(x % 100 < 48);
    }
    const set = (r, c, v) => { arr[r * 21 + c] = v; };
    const fp = (r0, c0) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const edge = r === 0 || r === 6 || c === 0 || c === 6;
          const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          set(r0 + r, c0 + c, edge || inner);
        }
      }
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          if ((r === -1 || r === 7 || c === -1 || c === 7) && r0 + r >= 0 && r0 + r < 21 && c0 + c >= 0 && c0 + c < 21) {
            set(r0 + r, c0 + c, false);
          }
        }
      }
    };
    fp(0, 0); fp(0, 14); fp(14, 0);
    return arr;
  }, []);
  return <>{seed.map((v, i) => <i key={i} style={{ background: v ? '#000' : 'transparent' }} />)}</>;
}

export function Onboarding({ t, onDone }) {
  const [step, setStep] = useState(0);
  const slide = t.onb.slides[step];
  const last = step === t.onb.slides.length - 1;

  return (
    <div className="onb">
      <div className="onb-bg" aria-hidden="true">
        <div className="h" style={{ top: -60, right: -40, fontSize: 320, transform: 'rotate(-12deg)' }}>U</div>
        <div className="h" style={{ bottom: -100, left: -30, fontSize: 380 }}>❤</div>
      </div>
      <div className="onb-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Brand size={18} />
          <button className="icon-btn" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }} onClick={onDone}>
            <span style={{ fontSize: 13, padding: '0 6px' }}>{t.onb.skip}</span>
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, paddingTop: 20 }}>
          {step === 2 && (
            <div className="qr" style={{ marginBottom: 8 }}>
              <QRPattern />
            </div>
          )}
          <div className="eyebrow" style={{ color: '#ffd9d6' }}>{slide.eyebrow}</div>
          <h1 className="h1" style={{ color: '#fff', fontSize: 48 }}>
            {slide.title.replace('❤U', '')}
            {slide.title.includes('❤U') && (<><Heart size={36} color="#fff" /><span>U</span></>)}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 1.45, margin: 0, maxWidth: 320 }}>
            {slide.body}
          </p>
          {step === 2 && (
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: 0 }} className="italic-light">
              {t.onb.scan}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="pager">
            {t.onb.slides.map((_, i) => <span key={i} className={i === step ? 'active' : ''} />)}
          </div>
          <div style={{ flex: 1 }} />
          {!last ? (
            <button className="btn" style={{ background: '#fff', color: 'var(--vermilion)' }} onClick={() => setStep(step + 1)}>
              {t.onb.next}<Icon n="arrow_forward" style={{ fontSize: 18 }} />
            </button>
          ) : (
            <button className="btn" style={{ background: '#fff', color: 'var(--vermilion)' }} onClick={onDone}>
              {t.onb.start}<Icon n="arrow_forward" style={{ fontSize: 18 }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
