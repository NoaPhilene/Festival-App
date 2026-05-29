export function Icon({ n, style, ...props }) {
  return (
    <span className="ms material-symbols-rounded" style={style} {...props}>
      {n}
    </span>
  );
}

export function Heart({ size = 16, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size * 0.875}
      viewBox="0 0 32 28"
      style={{ display: 'inline-block', verticalAlign: '-2px' }}
    >
      <path
        d="M16 27.5C2.7 18.6 0 13.3 0 8.4 0 3.7 3.7 0 8.4 0c2.9 0 5.6 1.5 7.6 4 2-2.5 4.7-4 7.6-4C28.3 0 32 3.7 32 8.4c0 4.9-2.7 10.2-16 19.1z"
        fill={color}
      />
    </svg>
  );
}

export function Brand({ size = 18 }) {
  return (
    <span className="brand" style={{ fontSize: size }}>
      <Heart size={size} color="var(--vermilion)" />
      <span className="u">U</span>
      <span className="word">&nbsp;Festival</span>
    </span>
  );
}
