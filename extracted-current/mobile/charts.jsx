const { CT, FONTS, RADIUS, useTheme } = window;
const { RATE_SERIES, BTC_SERIES, ETH_SERIES } = window;

// Clusteer Mobile — Custom price chart
// On-brand: line + filled gradient + lime accent for Buy, dark-green for Sell.
// Adaptive resolution + range tabs + crosshair on tap.

function ClusteerChart({
  series = RATE_SERIES, height = 180, range = '1D',
  variant = 'line', onPointHover,
  positive, padding = 0,
}) {
  const { c, mode } = useTheme();
  const ref = React.useRef(null);
  const [w, setW] = React.useState(320);
  const [hover, setHover] = React.useState(null);
  React.useEffect(() => {
    if (ref.current) setW(ref.current.clientWidth);
    const ro = new ResizeObserver(() => ref.current && setW(ref.current.clientWidth));
    ref.current && ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const pts = series.map((p, i) => p.c ?? p);
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const last = pts[pts.length - 1], first = pts[0];
  const isUp = positive != null ? positive : last >= first;
  const stroke = isUp ? c.darkGreen : c.danger;
  const fill = isUp ? c.lightGreen : c.danger;

  const padTop = 16, padBot = 24, padLR = padding;
  const innerW = w - padLR * 2;
  const innerH = height - padTop - padBot;

  const xy = pts.map((v, i) => [
    padLR + (i / (pts.length - 1)) * innerW,
    padTop + (1 - (v - min) / span) * innerH,
  ]);
  const path = xy.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${path} L${xy[xy.length-1][0]} ${padTop+innerH} L${xy[0][0]} ${padTop+innerH} Z`;

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches?.[0]?.clientX ?? e.clientX;
    const px = x - rect.left;
    const idx = Math.max(0, Math.min(pts.length - 1,
      Math.round((px - padLR) / innerW * (pts.length - 1))));
    setHover({ x: xy[idx][0], y: xy[idx][1], v: pts[idx], i: idx });
    onPointHover?.(pts[idx], idx);
  };
  const onLeave = () => { setHover(null); onPointHover?.(null); };

  // Y-axis grid (3 lines)
  const grid = [0, 0.5, 1].map((p) => padTop + p * innerH);

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} style={{ display: 'block', cursor: 'crosshair' }}
           onMouseMove={onMove} onMouseLeave={onLeave} onTouchStart={onMove} onTouchMove={onMove} onTouchEnd={onLeave}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity="0.45" />
            <stop offset="100%" stopColor={fill} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {grid.map((y, i) => (
          <line key={i} x1={padLR} x2={w - padLR} y1={y} y2={y} stroke={c.border} strokeWidth="1" strokeDasharray={i === 1 ? '0' : '2 4'} opacity={mode === 'dark' ? 0.4 : 1} />
        ))}
        <path d={area} fill="url(#cg)" />
        <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Last-point dot */}
        <circle cx={xy[xy.length-1][0]} cy={xy[xy.length-1][1]} r="5" fill={c.surface} stroke={stroke} strokeWidth="2.4" />
        {/* Crosshair */}
        {hover && (
          <>
            <line x1={hover.x} x2={hover.x} y1={padTop} y2={padTop+innerH} stroke={c.text} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <circle cx={hover.x} cy={hover.y} r="6" fill={stroke} />
            <circle cx={hover.x} cy={hover.y} r="3" fill={c.surface} />
          </>
        )}
      </svg>
      {hover && (
        <div style={{
          position: 'absolute', top: 0, left: Math.max(8, Math.min(w - 110, hover.x - 50)),
          background: c.customBlack, color: '#fff', padding: '6px 10px',
          borderRadius: 8, fontFamily: FONTS.numeric, fontSize: 12, fontWeight: 600,
          pointerEvents: 'none',
        }}>
          ₦{hover.v.toLocaleString('en-NG', { maximumFractionDigits: 2 })}
        </div>
      )}
    </div>
  );
}

// Candlestick variant — for full-screen chart view
function CandleChart({ series = RATE_SERIES, height = 220, padding = 0 }) {
  const { c, mode } = useTheme();
  const ref = React.useRef(null);
  const [w, setW] = React.useState(320);
  React.useEffect(() => {
    if (ref.current) setW(ref.current.clientWidth);
    const ro = new ResizeObserver(() => ref.current && setW(ref.current.clientWidth));
    ref.current && ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const allVals = series.flatMap((p) => [p.o, p.h, p.l, p.c]);
  const min = Math.min(...allVals), max = Math.max(...allVals), span = max - min || 1;
  const padTop = 12, padBot = 20;
  const innerH = height - padTop - padBot;
  const innerW = w - padding * 2;
  const cw = innerW / series.length;
  const cwBody = Math.max(2, cw * 0.65);

  const yOf = (v) => padTop + (1 - (v - min) / span) * innerH;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`}>
        {[0, 0.5, 1].map((p, i) => (
          <line key={i} x1={padding} x2={w - padding} y1={padTop + p * innerH} y2={padTop + p * innerH} stroke={c.border} strokeWidth="1" strokeDasharray="2 4" opacity={mode === 'dark' ? 0.35 : 1} />
        ))}
        {series.map((p, i) => {
          const x = padding + i * cw + cw / 2;
          const up = p.c >= p.o;
          const col = up ? c.darkGreen : c.danger;
          return (
            <g key={i}>
              <line x1={x} x2={x} y1={yOf(p.h)} y2={yOf(p.l)} stroke={col} strokeWidth="1.2" />
              <rect x={x - cwBody/2} y={Math.min(yOf(p.o), yOf(p.c))} width={cwBody} height={Math.max(1, Math.abs(yOf(p.o) - yOf(p.c)))} fill={col} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// Range selector for charts
function RangeTabs({ value = '1D', onChange, options = ['1H', '1D', '1W', '1M', '3M', '1Y'] }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 4, padding: 3, background: c.surfaceMuted, borderRadius: 999, alignSelf: 'flex-start' }}>
      {options.map((o) => {
        const a = o === value;
        return (
          <button key={o} onClick={() => onChange?.(o)} style={{
            padding: '6px 11px', borderRadius: 999, border: 'none',
            background: a ? c.surface : 'transparent', cursor: 'pointer',
            fontFamily: FONTS.body, fontSize: 11.5, fontWeight: a ? 700 : 600,
            color: a ? c.text : c.textMuted,
            boxShadow: a ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

// Donut for portfolio breakdown
function Donut({ data, size = 140, thickness = 22 }) {
  const { c } = useTheme();
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = size / 2 - thickness / 2;
  const cx = size / 2, cy = size / 2;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.surfaceMuted} strokeWidth={thickness} />
      {data.map((d, i) => {
        const start = acc / total;
        const end = (acc + d.value) / total;
        acc += d.value;
        const sa = start * Math.PI * 2 - Math.PI / 2;
        const ea = end * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + r * Math.cos(sa), y1 = cy + r * Math.sin(sa);
        const x2 = cx + r * Math.cos(ea), y2 = cy + r * Math.sin(ea);
        const large = end - start > 0.5 ? 1 : 0;
        return <path key={i} d={`M${x1} ${y1} A${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke={d.color} strokeWidth={thickness} strokeLinecap="butt" />;
      })}
    </svg>
  );
}

Object.assign(window, { ClusteerChart, CandleChart, RangeTabs, Donut });
