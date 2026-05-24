// Clusteer landing — brand primitives (logo, mark, asset glyphs)

function ClusteerMark({ size = 28, color = '#21241D' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" fill="none">
      <path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z" fill={color}/>
      <circle cx="76.9814" cy="31.0309" r="7.27554" fill={color}/>
      <circle cx="76.9814" cy="54.5603" r="7.27554" fill={color}/>
      <circle cx="76.9814" cy="78.0898" r="7.27554" fill={color}/>
      <circle cx="97.7243" cy="54.5603" r="7.27554" fill={color}/>
    </svg>
  );
}

function ClusteerWordmark({ size = 28, color = '#21241D' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.35 }}>
      <ClusteerMark size={size} color={color}/>
      <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: size * 0.95, color, letterSpacing: -0.6, lineHeight: 1 }}>
        Clusteer
      </span>
    </div>
  );
}

// USDT / USDC / NGN glyphs
function CoinUSDT({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#26A17B', color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: size * 0.45,
      boxShadow: '0 4px 12px rgba(38,161,123,0.35)',
    }}>₮</div>
  );
}
function CoinUSDC({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#2775CA', color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: size * 0.42,
      boxShadow: '0 4px 12px rgba(39,117,202,0.35)',
    }}>$</div>
  );
}
function CoinNGN({ size = 36 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#21241D', color: '#9FE870',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: size * 0.5,
      boxShadow: '0 4px 12px rgba(33,36,29,0.4)',
    }}>₦</div>
  );
}

// Generic icon
function Ic({ name, size = 18, stroke = 'currentColor', sw = 2 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    check: <path d="M20 6L9 17l-5-5"/>,
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
    wallet: <><path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M16 14h2"/><path d="M3 7l3-4h12l3 4"/></>,
    bank: <><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-4 7 4"/><path d="M5 21V10M9 21V10M15 21V10M19 21V10"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-6"/></>,
    star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    swap: <><path d="M7 4 3 8l4 4"/><path d="M3 8h14a4 4 0 0 1 0 8h-2"/><path d="M17 20l4-4-4-4"/><path d="M21 16H7a4 4 0 0 1 0-8h2"/></>,
    play: <path d="M7 4v16l13-8L7 4z" fill="currentColor"/>,
    sparkle: <path d="M12 2l2.5 7L22 11l-7.5 2L12 20l-2.5-7L2 11l7.5-2L12 2z"/>,
    dot: <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

window.ClusteerMark = ClusteerMark;
window.ClusteerWordmark = ClusteerWordmark;
window.CoinUSDT = CoinUSDT;
window.CoinUSDC = CoinUSDC;
window.CoinNGN = CoinNGN;
window.Ic = Ic;
