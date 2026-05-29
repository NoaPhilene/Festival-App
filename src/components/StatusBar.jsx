import { Icon } from './Icon';

export function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:24</span>
      <div className="punch" />
      <div className="right">
        <Icon n="signal_cellular_alt" style={{ fontSize: 14 }} />
        <Icon n="wifi" style={{ fontSize: 14 }} />
        <Icon n="battery_full" style={{ fontSize: 14 }} />
      </div>
    </div>
  );
}
