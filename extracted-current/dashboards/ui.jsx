// Shared icons + small UI primitives
const I = {
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1V11z"/></svg>,
  wallet: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 14h2"/></svg>,
  swap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 4l-3 3 3 3M4 7h13M17 14l3 3-3 3M20 17H7"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  recv: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  cog: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51h.01a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  help: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  card: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  arrowR: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  arrowUp: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>,
  arrowDn: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>,
  copy: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  qr: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 20h1v1h-1zM14 19h3M19 14v3"/></svg>,
  filter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>,
  external: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  flag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  dl: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  bolt: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>,
  x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  more: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M14.12 14.12A3 3 0 119.88 9.88M1 1l22 22"/></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  bank: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 10l9-7 9 7v2H3v-2zM5 12v8M9 12v8M15 12v8M19 12v8M3 21h18"/></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18M7 14l4-4 4 4 5-5"/></svg>,
  book: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  flag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22V15"/></svg>,
  gift: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
  bldg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  percent: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  dots: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
};

// Logo — official Clusteer mark (matches landing brand.jsx)
const Logo = ({size=28}) => (
  <svg width={size} height={size} viewBox="0 0 110 110" fill="currentColor">
    <path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z"/>
    <circle cx="76.9814" cy="31.0309" r="7.27554"/>
    <circle cx="76.9814" cy="54.5603" r="7.27554"/>
    <circle cx="76.9814" cy="78.0898" r="7.27554"/>
    <circle cx="97.7243" cy="54.5603" r="7.27554"/>
  </svg>
);

// Coin badge
const Coin = ({sym}) => {
  const cls = { USDT:'coin-usdt', BTC:'coin-btc', ETH:'coin-eth', SOL:'coin-sol', BNB:'coin-bnb', TRX:'coin-trx', USDC:'coin-usdc', NGN:'coin-ngn' }[sym] || 'coin-usdt';
  return <div className={`coin ${cls}`}>{sym==="USDT"?"₮":sym==="USDC"?"$":sym==="NGN"?"₦":sym[0]}</div>;
};

// Format
const fmt = {
  ngn: (n) => "₦" + Math.round(n).toLocaleString('en-NG'),
  num: (n, d=2) => Number(n).toLocaleString('en-US', { minimumFractionDigits:d, maximumFractionDigits:d }),
  short: (n) => n>=1e9 ? (n/1e9).toFixed(2)+'B' : n>=1e6 ? (n/1e6).toFixed(2)+'M' : n>=1e3 ? (n/1e3).toFixed(1)+'K' : n.toFixed(0),
  pct: (n) => (n>0?'+':'') + n.toFixed(2)+'%',
};

// Status pill
const Status = ({ s }) => {
  const m = {
    Completed: ['badge-up','✓'], Verified: ['badge-up','✓'], Active: ['badge-up','●'], Open:['badge-info','●'], Filled:['badge-up','✓'], Published:['badge-up','✓'],
    Pending: ['badge-warn','◐'], 'In progress':['badge-warn','◐'], Partial:['badge-warn','◐'], Draft:['badge','◐'], Scheduled:['badge-info','◷'],
    Failed: ['badge-down','✕'], Rejected:['badge-down','✕'], Suspended:['badge-down','✕'], Cancelled:['badge','—'], Closed:['badge','✓'], Resolved:['badge-up','✓'],
  };
  const [c,ic] = m[s] || ['badge','●'];
  return <span className={`badge ${c}`}><span style={{fontSize:9}}>{ic}</span>{s}</span>;
};

const Card = ({title, action, children, pad=true, className=''}) => (
  <div className={`card ${className}`}>
    {title && <div className="card-hd"><h3>{title}</h3>{action}</div>}
    <div className={pad?'card-pad':''}>{children}</div>
  </div>
);

const Tabs = ({tabs, value, onChange}) => (
  <div className="tabs">{tabs.map(t=>(
    <button key={t} className="tab" aria-selected={value===t} onClick={()=>onChange(t)}>{t}</button>
  ))}</div>
);

const Seg = ({opts, value, onChange}) => (
  <div className="seg">{opts.map(o=>(
    <button key={o} className={value===o?'active':''} onClick={()=>onChange(o)}>{o}</button>
  ))}</div>
);

// QRPattern — deterministic, decorative QR-style block (not a real scannable code).
// Stable across renders for the same `seed`; clears finder zones so they read as a QR.
const QRPattern = ({ seed='clusteer', size=200, fg='#0F1112', bg='#F4F1EA', accent='#9FE870' }) => {
  const N = 29; // module count
  // hash seed → uint32
  let h = 2166136261;
  for (let i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h = (h*16777619) >>> 0; }
  const mods = [];
  let s = h || 1;
  for (let y=0; y<N; y++){
    for (let x=0; x<N; x++){
      s = (s * 1664525 + 1013904223) >>> 0;
      const inFinder =
        (x<8 && y<8) || (x>N-9 && y<8) || (x<8 && y>N-9);
      const inCenter = (x>=N/2-2 && x<=N/2+1 && y>=N/2-2 && y<=N/2+1);
      if (inFinder || inCenter) continue;
      if ((s % 1000) < 480) mods.push([x,y]);
    }
  }
  const px = size / N;
  const finder = (cx, cy) => (
    <g key={`f${cx}-${cy}`}>
      <rect x={cx*px} y={cy*px} width={7*px} height={7*px} fill={fg}/>
      <rect x={(cx+1)*px} y={(cy+1)*px} width={5*px} height={5*px} fill={bg}/>
      <rect x={(cx+2)*px} y={(cy+2)*px} width={3*px} height={3*px} fill={fg}/>
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" style={{display:'block'}}>
      <rect width={size} height={size} fill={bg}/>
      {mods.map(([x,y]) => <rect key={`${x}-${y}`} x={x*px} y={y*px} width={px} height={px} fill={fg}/>)}
      {finder(0,0)}
      {finder(N-7,0)}
      {finder(0,N-7)}
      {/* logo dot at center */}
      <rect x={(N/2-2)*px} y={(N/2-2)*px} width={4*px} height={4*px} fill={bg}/>
      <rect x={(N/2-1.5)*px} y={(N/2-1.5)*px} width={3*px} height={3*px} fill={accent}/>
    </svg>
  );
};

Object.assign(window, { I, Logo, Coin, fmt, Status, Card, Tabs, Seg, QRPattern });
