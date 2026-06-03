import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

export function MapScreen({ t }) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [showLegend, setShowLegend] = useState(false);
  const dragRef = useRef(null);
  const wrapRef = useRef(null);

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const onPointerDown = (e) => {
    if (
      e.target.closest('.map-controls') ||
      e.target.closest('.map-legend-panel') ||
      e.target.closest('.map-legend-btn')
    ) return;
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
      setScale(s => clamp(s * factor, 0.5, 4));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const zoom = (factor) => setScale(s => clamp(s * factor, 0.5, 4));
  const reset = () => { setScale(1); setTx(0); setTy(0); };

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
        style={{
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <img
          src="/img/kaart_festival_markers.svg"
          alt="Festivalkaart"
          className="map-img"
          draggable={false}
        />
      </div>

      <div className="map-controls">
        <button className="icon-btn" onClick={() => zoom(1.25)} aria-label="Zoom in">
          <Icon n="add" />
        </button>
        <button className="icon-btn" onClick={() => zoom(0.8)} aria-label="Zoom uit">
          <Icon n="remove" />
        </button>
        <button className="icon-btn" onClick={reset} aria-label="Reset">
          <Icon n="my_location" />
        </button>
        <button
          className={`icon-btn map-legend-btn${showLegend ? ' active' : ''}`}
          onClick={() => setShowLegend(v => !v)}
          aria-label="Legenda"
        >
          <Icon n="format_list_bulleted" />
        </button>
      </div>

      {showLegend && (
        <div className="map-legend-panel">
          <button
            className="map-legend-close"
            onClick={() => setShowLegend(false)}
            aria-label="Legenda sluiten"
          >
            <Icon n="close" />
          </button>
          <img
            src="/img/legenda.svg"
            alt="Legenda"
            className="legend-img"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
