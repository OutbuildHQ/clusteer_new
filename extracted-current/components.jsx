// Clusteer primitives — buttons, inputs, cards, badges, chips, tabs, tables, chart, modal
// All components are styled via tokens.css. Use `Num` for numeric values.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------- Icon (Lucide subset via SVG path strings) ---------- */
// Using inline SVGs keeps us off CDN for offline previews.
const Icon = ({ name, size = 16, className = "", style = {}, stroke = 1.75 }) => {
  const paths = ICONS[name];
  if (!paths) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      {paths.map((d, i) => (d.type === 'circle'
        ? <circle key={i} cx={d.cx} cy={d.cy} r={d.r} />
        : d.type === 'rect'
        ? <rect key={i} x={d.x} y={d.y} width={d.w} height={d.h} rx={d.r || 0} />
        : d.type === 'line'
        ? <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} />
        : <path key={i} d={d} />
      ))}
    </svg>
  );
};

const ICONS = {
  arrowUp:      ["M12 19V5","M5 12l7-7 7 7"],
  arrowDown:    ["M12 5v14","M19 12l-7 7-7-7"],
  arrowRight:   ["M5 12h14","M12 5l7 7-7 7"],
  arrowLeft:    ["M19 12H5","M12 19l-7-7 7-7"],
  arrowUpRight: ["M7 17L17 7","M7 7h10v10"],
  arrowDownLeft:["M17 7L7 17","M17 17H7V7"],
  chevronDown:  ["M6 9l6 6 6-6"],
  chevronRight: ["M9 6l6 6-6 6"],
  chevronLeft:  ["M15 18l-6-6 6-6"],
  plus:         ["M12 5v14","M5 12h14"],
  minus:        ["M5 12h14"],
  search:       [{type:'circle',cx:11,cy:11,r:7},"M21 21l-4.35-4.35"],
  bell:         ["M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9","M10.3 21a1.94 1.94 0 0 0 3.4 0"],
  user:         [{type:'circle',cx:12,cy:8,r:4},"M4 21a8 8 0 0 1 16 0"],
  wallet:       ["M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7z","M3 7V6a2 2 0 0 1 2-2h12",{type:'circle',cx:17,cy:14,r:1.2}],
  card:         [{type:'rect',x:2,y:5,w:20,h:14,r:2},"M2 10h20","M6 15h4"],
  shield:       ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"],
  shieldCheck:  ["M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z","M9 12l2 2 4-4"],
  lock:         [{type:'rect',x:4,y:11,w:16,h:10,r:2},"M8 11V7a4 4 0 0 1 8 0v4"],
  key:          [{type:'circle',cx:8,cy:15,r:4},"M10.8 12.2L20 3","M16 7l3 3"],
  eye:          ["M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z",{type:'circle',cx:12,cy:12,r:3}],
  copy:         [{type:'rect',x:9,y:9,w:12,h:12,r:2},"M5 15V5a2 2 0 0 1 2-2h10"],
  qr:           [{type:'rect',x:3,y:3,w:7,h:7,r:1},{type:'rect',x:14,y:3,w:7,h:7,r:1},{type:'rect',x:3,y:14,w:7,h:7,r:1},"M14 14h3v3h-3z","M21 14v3","M14 21h3","M21 18v3"],
  swap:         ["M7 10l-3 3 3 3","M4 13h12","M17 8l3-3-3-3","M20 5H8"],
  send:         ["M22 2L11 13","M22 2l-7 20-4-9-9-4 20-7z"],
  receive:      ["M12 3v14","M5 10l7 7 7-7","M4 21h16"],
  trade:        ["M3 17l6-6 4 4 8-8","M14 7h7v7"],
  chart:        ["M3 3v18h18","M7 14l4-4 3 3 6-7"],
  list:         [{type:'line',x1:8,y1:6,x2:21,y2:6},{type:'line',x1:8,y1:12,x2:21,y2:12},{type:'line',x1:8,y1:18,x2:21,y2:18},{type:'circle',cx:4,cy:6,r:1},{type:'circle',cx:4,cy:12,r:1},{type:'circle',cx:4,cy:18,r:1}],
  grid:         [{type:'rect',x:3,y:3,w:7,h:7,r:1},{type:'rect',x:14,y:3,w:7,h:7,r:1},{type:'rect',x:3,y:14,w:7,h:7,r:1},{type:'rect',x:14,y:14,w:7,h:7,r:1}],
  settings:     [{type:'circle',cx:12,cy:12,r:3},"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  logout:       ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"],
  menu:         ["M3 6h18","M3 12h18","M3 18h18"],
  close:        ["M18 6L6 18","M6 6l18 12"],
  check:        ["M20 6L9 17l-5-5"],
  x:            ["M18 6L6 18","M6 6l12 12"],
  info:         [{type:'circle',cx:12,cy:12,r:10},"M12 16v-4","M12 8h.01"],
  alert:        ["M10.3 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z","M12 9v4","M12 17h.01"],
  help:         [{type:'circle',cx:12,cy:12,r:10},"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3","M12 17h.01"],
  clock:        [{type:'circle',cx:12,cy:12,r:10},"M12 6v6l4 2"],
  calendar:     [{type:'rect',x:3,y:4,w:18,h:18,r:2},"M16 2v4","M8 2v4","M3 10h18"],
  download:     ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  upload:       ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  file:         ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"],
  image:        [{type:'rect',x:3,y:3,w:18,h:18,r:2},{type:'circle',cx:8.5,cy:8.5,r:1.5},"M21 15l-5-5L5 21"],
  trash:        ["M3 6h18","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2","M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"],
  edit:         ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7","M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  filter:       ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  sort:         ["M3 6h13","M3 12h9","M3 18h5","M17 14l4 4-4 4","M21 18H13"],
  dot:          [{type:'circle',cx:12,cy:12,r:3}],
  users:        [{type:'circle',cx:9,cy:7,r:4},"M1 21a8 8 0 0 1 16 0","M17 3a4 4 0 0 1 0 8","M23 21a8 8 0 0 0-4-7"],
  flag:         ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z","M4 22v-7"],
  globe:        [{type:'circle',cx:12,cy:12,r:10},{type:'line',x1:2,y1:12,x2:22,y2:12},"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  link:         ["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71","M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"],
  phone:        ["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0 1 22 16.92z"],
  message:      ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  star:         ["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"],
  zap:          ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  trend:        ["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"],
  ticket:       ["M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z","M13 5v2","M13 17v2","M13 11v2"],
  building:     [{type:'rect',x:4,y:2,w:16,h:20,r:2},"M9 22V12h6v10","M9 6h.01","M15 6h.01","M9 10h.01","M15 10h.01"],
  mail:         [{type:'rect',x:2,y:4,w:20,h:16,r:2},"M22 7l-10 7L2 7"],
  refresh:      ["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0 1 14.85-3.36L23 10","M20.49 15A9 9 0 0 1 5.64 18.36L1 14"],
  external:     ["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6","M15 3h6v6","M10 14L21 3"],
  dashboard:    [{type:'rect',x:3,y:3,w:7,h:9,r:1},{type:'rect',x:14,y:3,w:7,h:5,r:1},{type:'rect',x:14,y:12,w:7,h:9,r:1},{type:'rect',x:3,y:16,w:7,h:5,r:1}],
  layers:       ["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"],
  moon:         ["M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"],
  sun:          [{type:'circle',cx:12,cy:12,r:5},"M12 1v2","M12 21v2","M4.22 4.22l1.42 1.42","M18.36 18.36l1.42 1.42","M1 12h2","M21 12h2","M4.22 19.78l1.42-1.42","M18.36 5.64l1.42-1.42"],
  sliders:      ["M4 21v-7","M4 10V3","M12 21v-9","M12 8V3","M20 21v-5","M20 12V3","M1 14h6","M9 8h6","M17 16h6"],
  logo:         [], // drawn manually
};

/* ---------- Brand mark ---------- */
// Clusteer icon — official SVG from brand asset (viewBox 110x110).
const ClusteerMark = ({ size = 28, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 110 110" fill="none" style={{flexShrink:0}}>
    <path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z" fill={color}/>
    <circle cx="76.9814" cy="31.0309" r="7.27554" fill={color}/>
    <circle cx="76.9814" cy="54.5603" r="7.27554" fill={color}/>
    <circle cx="76.9814" cy="78.0898" r="7.27554" fill={color}/>
    <circle cx="97.7243" cy="54.5603" r="7.27554" fill={color}/>
  </svg>
);

const Logo = ({ size = 28, showText = true, color }) => {
  // When showText is true we use the official combined wordmark PNG (preserves
  // exact brand spacing & letterforms). When false (or a custom color is
  // requested for inversion on dark backgrounds) we fall back to the SVG mark.
  if (showText && !color) {
    // PNG aspect ratio is 451×108 ≈ 4.18:1
    const h = size * 1.05;
    return (
      <img src="clusteer-logo.png" alt="Clusteer" height={h} style={{height:h,width:'auto',display:'block'}}/>
    );
  }
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:size*0.32,color: color || 'var(--cl-text)'}}>
      <ClusteerMark size={size} color={color || 'var(--cl-text)'}/>
      {showText && <span style={{fontWeight:650,fontSize:size*0.82,letterSpacing:'-0.02em',lineHeight:1}}>Clusteer</span>}
    </div>
  );
};

/* ---------- Button ---------- */
const Button = ({ children, variant = "primary", size = "md", icon, iconRight, full, onClick, disabled, style }) => {
  const sizes = { sm:{h:32,px:12,fs:13,gap:6}, md:{h:38,px:14,fs:14,gap:8}, lg:{h:46,px:18,fs:15,gap:10} };
  const s = sizes[size];
  const variants = {
    primary: { background:'var(--cl-brand-500)', color:'#fff', border:'1px solid var(--cl-brand-500)' },
    secondary:{ background:'var(--cl-surface)', color:'var(--cl-text)', border:'1px solid var(--cl-line)' },
    ghost:   { background:'transparent', color:'var(--cl-text)', border:'1px solid transparent' },
    danger:  { background:'var(--cl-down)', color:'#fff', border:'1px solid var(--cl-down)' },
    success: { background:'var(--cl-up)', color:'#fff', border:'1px solid var(--cl-up)' },
    dark:    { background:'var(--cl-text)', color:'var(--cl-bg)', border:'1px solid var(--cl-text)' },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:'inline-flex',alignItems:'center',justifyContent:'center',gap:s.gap,
      height:s.h,padding:`0 ${s.px}px`,fontSize:s.fs,fontWeight:550,
      borderRadius:'var(--cl-r-md)',cursor:disabled?'not-allowed':'pointer',
      opacity:disabled?0.55:1,
      fontFamily:'var(--cl-font-sans)',letterSpacing:'-0.005em',
      width: full?'100%':'auto',whiteSpace:'nowrap',
      transition:'transform .08s, box-shadow .12s, background .12s',
      ...v, ...style
    }}>
      {icon && <Icon name={icon} size={s.fs + 2} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.fs + 2} />}
    </button>
  );
};

/* ---------- Input & Field ---------- */
const Input = ({ value, onChange, placeholder, type="text", icon, suffix, size="md", style, ...rest }) => {
  const h = size === "lg" ? 46 : size === "sm" ? 32 : 40;
  return (
    <div style={{
      display:'flex',alignItems:'center',gap:8,
      height:h,padding:`0 12px`,
      background:'var(--cl-surface)',border:'1px solid var(--cl-line)',
      borderRadius:'var(--cl-r-md)',...style
    }}>
      {icon && <Icon name={icon} size={16} style={{color:'var(--cl-text-3)'}}/>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{flex:1,border:'none',outline:'none',background:'transparent',fontSize:14,fontFamily:'inherit',color:'var(--cl-text)'}}
        {...rest}
      />
      {suffix && <span style={{fontSize:13,color:'var(--cl-text-3)',fontFamily:'var(--cl-font-mono)'}}>{suffix}</span>}
    </div>
  );
};

const Field = ({ label, hint, children, error }) => (
  <div style={{display:'flex',flexDirection:'column',gap:6}}>
    {label && <label style={{fontSize:13,fontWeight:500,color:'var(--cl-text-2)'}}>{label}</label>}
    {children}
    {error && <span style={{fontSize:12,color:'var(--cl-down)'}}>{error}</span>}
    {hint && !error && <span style={{fontSize:12,color:'var(--cl-text-3)'}}>{hint}</span>}
  </div>
);

/* ---------- Card ---------- */
const Card = ({ children, pad = 20, style, flush }) => (
  <div style={{
    background:'var(--cl-surface)',
    border:'1px solid var(--cl-line)',
    borderRadius:'var(--cl-r-lg)',
    padding:flush?0:pad,
    boxShadow:'var(--cl-shadow-1)',
    ...style
  }}>{children}</div>
);

/* ---------- Badge / Chip ---------- */
const Badge = ({ children, tone = "neutral", dot, style }) => {
  const tones = {
    neutral: {bg:'var(--cl-surface-2)',fg:'var(--cl-text-2)',dot:'var(--cl-text-3)'},
    brand:   {bg:'var(--cl-brand-50)',fg:'var(--cl-brand-700)',dot:'var(--cl-brand-500)'},
    up:      {bg:'var(--cl-up-soft)',fg:'var(--cl-up)',dot:'var(--cl-up)'},
    down:    {bg:'var(--cl-down-soft)',fg:'var(--cl-down)',dot:'var(--cl-down)'},
    warn:    {bg:'var(--cl-warn-soft)',fg:'var(--cl-warn)',dot:'var(--cl-warn)'},
    info:    {bg:'var(--cl-info-soft)',fg:'var(--cl-info)',dot:'var(--cl-info)'},
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:6,
      padding:'3px 8px',borderRadius:'var(--cl-r-pill)',
      background:t.bg,color:t.fg,fontSize:12,fontWeight:500,
      letterSpacing:'-0.005em',whiteSpace:'nowrap',...style
    }}>
      {dot && <span style={{width:6,height:6,borderRadius:999,background:t.dot}}/>}
      {children}
    </span>
  );
};

/* ---------- Numeric ---------- */
const Num = ({ children, size, weight, color, style }) => (
  <span className="num" style={{
    fontFamily:'var(--cl-font-mono)',
    fontFeatureSettings:'"tnum","zero"',
    fontSize:size,fontWeight:weight||500,color,letterSpacing:0,
    ...style
  }}>{children}</span>
);

/* ---------- Chain / Asset logos ---------- */
const AssetLogo = ({ symbol, size = 28 }) => {
  const map = {
    USDT: { bg:'var(--cl-chain-usdt)', t:'₮' },
    USDC: { bg:'#2775CA', t:'$' },
    BTC:  { bg:'#F7931A', t:'₿' },
    ETH:  { bg:'#627EEA', t:'Ξ' },
    SOL:  { bg:'#9945FF', t:'◎' },
    TRX:  { bg:'#EF0027', t:'T' },
    BNB:  { bg:'#F0B90B', t:'B' },
    NGN:  { bg:'var(--cl-text)', t:'₦' },
  };
  const m = map[symbol] || { bg:'var(--cl-text-3)', t:'?' };
  return (
    <div style={{
      width:size,height:size,borderRadius:'999px',
      background:m.bg,color:'#fff',display:'inline-flex',
      alignItems:'center',justifyContent:'center',
      fontSize:size*0.5,fontWeight:600,flexShrink:0,
      fontFamily:'var(--cl-font-mono)'
    }}>{m.t}</div>
  );
};

const ChainBadge = ({ chain }) => {
  const map = {
    'TRC-20':{c:'var(--cl-chain-tron)',t:'TRC-20'},
    'BEP-20':{c:'var(--cl-chain-bsc)',t:'BEP-20'},
    'ERC-20':{c:'var(--cl-chain-eth)',t:'ERC-20'},
    'SOL':{c:'var(--cl-chain-sol)',t:'Solana'},
  };
  const m = map[chain] || {c:'var(--cl-text-3)',t:chain};
  return (
    <span style={{
      display:'inline-flex',alignItems:'center',gap:5,
      padding:'2px 7px',borderRadius:'var(--cl-r-sm)',
      border:'1px solid var(--cl-line)',
      fontSize:11,fontWeight:500,color:'var(--cl-text-2)',
      fontFamily:'var(--cl-font-mono)',letterSpacing:0
    }}>
      <span style={{width:5,height:5,borderRadius:999,background:m.c}}/>
      {m.t}
    </span>
  );
};

/* ---------- Tabs ---------- */
const Tabs = ({ tabs, active, onChange, variant = "line" }) => {
  if (variant === "pill") {
    return (
      <div style={{
        display:'inline-flex',background:'var(--cl-surface-2)',
        padding:3,borderRadius:'var(--cl-r-md)',gap:2
      }}>
        {tabs.map(t => (
          <button key={t.key} onClick={()=>onChange(t.key)} style={{
            padding:'7px 14px',fontSize:13,fontWeight:500,
            border:'none',cursor:'pointer',borderRadius:'var(--cl-r-sm)',
            background:active===t.key?'var(--cl-surface)':'transparent',
            color:active===t.key?'var(--cl-text)':'var(--cl-text-2)',
            boxShadow:active===t.key?'var(--cl-shadow-1)':'none',
            fontFamily:'inherit'
          }}>{t.label}</button>
        ))}
      </div>
    );
  }
  return (
    <div style={{display:'flex',gap:24,borderBottom:'1px solid var(--cl-line)'}}>
      {tabs.map(t => (
        <button key={t.key} onClick={()=>onChange(t.key)} style={{
          padding:'10px 0',fontSize:14,fontWeight:500,
          background:'none',border:'none',cursor:'pointer',
          color:active===t.key?'var(--cl-text)':'var(--cl-text-3)',
          borderBottom:`2px solid ${active===t.key?'var(--cl-brand-500)':'transparent'}`,
          marginBottom:-1,fontFamily:'inherit'
        }}>{t.label}</button>
      ))}
    </div>
  );
};

/* ---------- Table (compact) ---------- */
const Table = ({ columns, rows, hoverable = true }) => (
  <div style={{width:'100%',overflow:'auto'}}>
    <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
      <thead>
        <tr>
          {columns.map((c,i) => (
            <th key={i} style={{
              textAlign:c.align||'left',padding:'10px 14px',
              fontSize:12,fontWeight:500,color:'var(--cl-text-3)',
              borderBottom:'1px solid var(--cl-line)',
              whiteSpace:'nowrap',textTransform:'uppercase',letterSpacing:'0.04em'
            }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} style={{transition:'background .1s'}}
            onMouseEnter={e=>hoverable && (e.currentTarget.style.background='var(--cl-surface-2)')}
            onMouseLeave={e=>hoverable && (e.currentTarget.style.background='transparent')}>
            {columns.map((c, ci) => (
              <td key={ci} style={{
                padding:'12px 14px',textAlign:c.align||'left',
                borderBottom:'1px solid var(--cl-line)',
                color:'var(--cl-text)',whiteSpace:c.nowrap?'nowrap':'normal'
              }}>{typeof c.render==='function' ? c.render(r) : r[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ---------- Sparkline / MiniChart ---------- */
const Sparkline = ({ data, width = 120, height = 36, color = "var(--cl-brand-500)", fill = true }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return [x,y];
  });
  const path = pts.map((p,i) => (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
  const area = path + ` L${width},${height} L0,${height} Z`;
  const gid = `g${Math.random().toString(36).slice(2,8)}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`}/>}
      <path d={path} stroke={color} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

/* ---------- Candle chart (mini) ---------- */
const CandleChart = ({ width = 600, height = 220, candles }) => {
  const min = Math.min(...candles.map(c=>c.l));
  const max = Math.max(...candles.map(c=>c.h));
  const range = max-min || 1;
  const cw = width / candles.length;
  const pad = 10;
  const Y = v => pad + (1 - (v-min)/range) * (height - pad*2);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:'block'}}>
      {[0.25,0.5,0.75].map((p,i)=>(
        <line key={i} x1="0" x2={width} y1={pad+p*(height-pad*2)} y2={pad+p*(height-pad*2)}
          stroke="var(--cl-line)" strokeDasharray="2 3"/>
      ))}
      {candles.map((c,i)=>{
        const x = i*cw + cw/2;
        const up = c.c >= c.o;
        const col = up ? 'var(--cl-up)' : 'var(--cl-down)';
        const yO = Y(c.o), yC = Y(c.c), yH = Y(c.h), yL = Y(c.l);
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={yH} y2={yL} stroke={col} strokeWidth="1"/>
            <rect x={x-cw*0.3} y={Math.min(yO,yC)} width={cw*0.6} height={Math.max(Math.abs(yC-yO),1)}
              fill={col} opacity={up?0.9:1}/>
          </g>
        );
      })}
    </svg>
  );
};

/* ---------- Line chart (portfolio) ---------- */
const LineChart = ({ width=720, height=240, data, color="var(--cl-brand-500)" }) => {
  const min = Math.min(...data), max = Math.max(...data);
  const pad = 20;
  const pts = data.map((v,i) => {
    const x = pad + (i/(data.length-1)) * (width - pad*2);
    const y = pad + (1 - (v-min)/(max-min || 1)) * (height - pad*2);
    return [x,y];
  });
  const path = pts.map((p,i) => (i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`)).join(' ');
  const area = path + ` L${width-pad},${height-pad} L${pad},${height-pad} Z`;
  const gid = `gl${Math.random().toString(36).slice(2,8)}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:'block'}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map((p,i)=>(
        <line key={i} x1={pad} x2={width-pad} y1={pad+p*(height-pad*2)} y2={pad+p*(height-pad*2)}
          stroke="var(--cl-line)" strokeDasharray={i===0||i===4?"0":"2 3"}/>
      ))}
      <path d={area} fill={`url(#${gid})`}/>
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round"/>
    </svg>
  );
};

/* ---------- QR placeholder (deterministic grid) ---------- */
const QR = ({ data = "address", size = 160 }) => {
  // Deterministic pseudo-random pattern
  const n = 21;
  const cells = [];
  let seed = 0;
  for (const c of data) seed = (seed*31 + c.charCodeAt(0)) >>> 0;
  const rng = () => { seed = (seed*1664525 + 1013904223) >>> 0; return seed/0xFFFFFFFF; };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const corner = (x<7 && y<7) || (x>=n-7 && y<7) || (x<7 && y>=n-7);
      const center = x>1 && x<5 && y>1 && y<5;
      const c2 = x>n-6 && x<n-2 && y>1 && y<5;
      const c3 = x>1 && x<5 && y>n-6 && y<n-2;
      const filled = center || c2 || c3
        || (corner && ((x===0||y===0||x===6||y===6||x===n-1||x===n-7||y===n-1||y===n-7)))
        || (!corner && rng() > 0.55);
      cells.push({x,y,filled});
    }
  }
  const s = size/n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{background:'#fff',borderRadius:'var(--cl-r-md)'}}>
      {cells.map((c,i) => c.filled && <rect key={i} x={c.x*s} y={c.y*s} width={s} height={s} fill="#0B1220"/>)}
    </svg>
  );
};

/* ---------- Avatar ---------- */
const Avatar = ({ name = "?", size = 32, color }) => {
  const initials = name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
  const colors = ['#0B5FFF','#7C3AED','#00A86B','#E8A53A','#E5484D','#1B7EC2','#9945FF'];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width:size,height:size,borderRadius:999,background:color||colors[idx],
      color:'#fff',display:'inline-flex',alignItems:'center',justifyContent:'center',
      fontSize:size*0.38,fontWeight:600,flexShrink:0
    }}>{initials}</div>
  );
};

/* ---------- Progress ---------- */
const Progress = ({ value, max=100, color="var(--cl-brand-500)" }) => (
  <div style={{height:6,background:'var(--cl-surface-2)',borderRadius:999,overflow:'hidden'}}>
    <div style={{width:`${(value/max)*100}%`,height:'100%',background:color,borderRadius:999}}/>
  </div>
);

/* ---------- Section header ---------- */
const SectionHead = ({ title, subtitle, actions }) => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
    <div>
      <h3 style={{fontSize:18,fontWeight:600}}>{title}</h3>
      {subtitle && <p style={{marginTop:4,fontSize:13,color:'var(--cl-text-3)'}}>{subtitle}</p>}
    </div>
    {actions && <div style={{display:'flex',gap:8}}>{actions}</div>}
  </div>
);

/* ---------- Step tracker ---------- */
const Steps = ({ steps, current }) => (
  <div style={{display:'flex',alignItems:'center',gap:0,width:'100%'}}>
    {steps.map((s,i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            <div style={{
              width:24,height:24,borderRadius:999,
              background: done ? 'var(--cl-up)' : active ? 'var(--cl-brand-500)' : 'var(--cl-surface-2)',
              color: (done||active) ? '#fff' : 'var(--cl-text-3)',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:12,fontWeight:600, border: active ? '3px solid var(--cl-brand-100)':'none'
            }}>{done ? <Icon name="check" size={12} stroke={3}/> : i+1}</div>
            <span style={{fontSize:13,color:active?'var(--cl-text)':'var(--cl-text-3)',fontWeight:active?500:400}}>{s}</span>
          </div>
          {i < steps.length-1 && <div style={{flex:1,height:1,background:done?'var(--cl-up)':'var(--cl-line)',margin:'0 12px'}}/>}
        </React.Fragment>
      );
    })}
  </div>
);

/* Export globals */
Object.assign(window, {
  ClusteerMark, Icon, ICONS, Logo, Button, Input, Field, Card, Badge, Num,
  AssetLogo, ChainBadge, Tabs, Table, Sparkline, CandleChart,
  LineChart, QR, Avatar, Progress, SectionHead, Steps
});
