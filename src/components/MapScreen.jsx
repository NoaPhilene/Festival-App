import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export function MapScreen({ t }) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragRef = useRef(null);
  const wrapRef = useRef(null);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const onPointerDown = (e) => {
    if (e.target.closest('.map-pin') || e.target.closest('.map-controls') || e.target.closest('.map-legend')) return;
    e.target.setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setTx(dragRef.current.tx + dx);
    setTy(dragRef.current.ty + dy);
  };
  const onPointerUp = () => { dragRef.current = null; };

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      setScale(s => clamp(s * factor, 0.7, 3));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const zoom = (factor) => setScale(s => clamp(s * factor, 0.7, 3));
  const reset = () => { setScale(1); setTx(0); setTy(0); };

  const floor = (
    <svg viewBox="0 0 800 600" className="map-svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grass" patternUnits="userSpaceOnUse" width="14" height="14">
          <rect width="14" height="14" fill="#8ec99c" />
          <circle cx="3" cy="3" r="1.2" fill="#76b384" opacity="0.7" />
          <circle cx="10" cy="10" r="1.2" fill="#76b384" opacity="0.7" />
        </pattern>
        <pattern id="water" patternUnits="userSpaceOnUse" width="40" height="40">
          <rect width="40" height="40" fill="#5fa9c7" />
          <path d="M0 20 Q10 16 20 20 T40 20" stroke="#86c4dc" strokeWidth="2" fill="none" />
        </pattern>
        <pattern id="sand" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#e6d8a8" />
          <circle cx="3" cy="6" r="0.6" fill="#c8b87c" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#grass)" />
      <path d="M-20 360 C 80 320, 220 380, 360 360 S 600 380, 820 340 L 820 620 L -20 620 Z" fill="url(#water)" />
      <path d="M-20 340 C 80 300, 220 360, 360 340 S 600 360, 820 320 L 820 360 C 600 380, 360 360, -20 380 Z" fill="url(#sand)" opacity="0.85" />
      <path d="M40 480 Q 200 440 380 460 T 760 420" stroke="#d9c89b" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M200 200 Q 320 220 460 200 T 740 180" stroke="#d9c89b" strokeWidth="14" fill="none" strokeLinecap="round" />
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (i * 137 + 40) % 760 + 20;
        const y = ((i * 257 + 30) % 280) + 30;
        return <circle key={i} cx={x} cy={y} r="14" fill="#5a8a5a" opacity="0.85" />;
      })}
      <rect x="170" y="320" width="80" height="50" fill="#f03228" rx="6" />
      <rect x="160" y="370" width="100" height="14" fill="#8c1a14" />
      <text x="210" y="350" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">PONTON</text>
      <rect x="370" y="200" width="80" height="40" fill="#247ba0" rx="6" />
      <text x="410" y="225" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">THE LAKE</text>
      <rect x="540" y="300" width="80" height="50" fill="#1f1f1f" rx="6" />
      <text x="580" y="330" fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle">THE CLUB</text>
      <polygon points="660,140 740,140 760,180 720,200 640,180" fill="#e3b505" />
      <text x="700" y="175" fontSize="13" fontWeight="700" fill="#000" textAnchor="middle">HANGAR</text>
      <rect x="40" y="430" width="80" height="20" fill="#c81e15" />
      <text x="80" y="445" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">ENTRANCE</text>
    </svg>
  );

  return (
    <div
      ref={wrapRef}
      className="map-wrap"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="map-canvas"
        style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: '0 0', width: '100%', height: '100%' }}
      >
        {floor}
      </div>
      {t.map.locations.map(loc => {
        const px = tx + (loc.x / 100) * 388 * scale;
        const py = ty + (loc.y / 100) * (892 - 200) * scale;
        return (
          <div key={loc.n} className="map-pin" style={{ left: px, top: py }}>
            {loc.n}
          </div>
        );
      })}
      {t.map.services.map((sv, i) => {
        const px = tx + (sv.x / 100) * 388 * scale;
        const py = ty + (sv.y / 100) * (892 - 200) * scale;
        return (
          <div key={i} className="map-pin small" style={{ left: px, top: py }} title={sv.label}>
            <Icon n={sv.icon} />
          </div>
        );
      })}
      <div className="map-controls">
        <button className="icon-btn" onClick={() => zoom(1.25)} aria-label="Zoom in"><Icon n="add" /></button>
        <button className="icon-btn" onClick={() => zoom(0.8)} aria-label="Zoom out"><Icon n="remove" /></button>
        <button className="icon-btn" onClick={reset} aria-label="Reset"><Icon n="my_location" /></button>
      </div>
      <div className="map-legend">
        <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12 }}>{t.map.legend}</div>
        {t.map.locations.map(l => (
          <div className="row" key={l.n} style={{ marginBottom: 2 }}>
            <span className="num" style={{ marginRight: 6 }}>{l.n}</span>{l.name}
          </div>
        ))}
      </div>
    </div>
  );
}
