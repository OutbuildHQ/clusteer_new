// Auto-injected: pull cross-script globals into local scope
const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;
const { Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn, BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav, TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch } = window;
const { ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT, RATE_USDT_NGN, FEE_PCT, RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD } = window;
const { ClusteerChart, CandleChart, RangeTabs, Donut } = window;

// Clusteer Mobile — Brand identity & system surfaces
// AppIcon, LockScreen, PushNotification, HomeWidget, AppLockedState

// ─────────────────────────────────────────────────────────────
// AppIcon — variations
// ─────────────────────────────────────────────────────────────
function AppIcon({ size = 80, variant = 'lime', radius }) {
  const r = radius ?? size * 0.225;  // iOS continuous radius proportion
  const variants = {
    lime: { bg: '#9FE870', fg: '#21241D' },
    black: { bg: '#21241D', fg: '#FAFAFA' },
    deep: { bg: '#0F4F26', fg: '#9FE870' },
    pale: { bg: '#EFFCD0', fg: '#21241D' },
  };
  const v = variants[variant];
  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: v.bg, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)',
    }}>
      {/* highlight at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)',
      }} />
      {/* Official Clusteer brand mark — solid C + 3 stacked dots + 1 outer dot */}
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 110 110" fill="none">
        <path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z" fill={v.fg}/>
        <circle cx="76.9814" cy="31.0309" r="7.27554" fill={v.fg}/>
        <circle cx="76.9814" cy="54.5603" r="7.27554" fill={v.fg}/>
        <circle cx="76.9814" cy="78.0898" r="7.27554" fill={v.fg}/>
        <circle cx="97.7243" cy="54.5603" r="7.27554" fill={v.fg}/>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AppIconShowcase — grid of variants for design canvas
// ─────────────────────────────────────────────────────────────
function AppIconShowcase() {
  const variants = [
    { v: 'lime', label: 'Default · Lime' },
    { v: 'black', label: 'Dark · Onyx' },
    { v: 'deep', label: 'Deep green' },
    { v: 'pale', label: 'Pale · iOS Tinted' },
  ];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32, background: '#FAFAFA', minHeight: '100%' }}>
      <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: '#21241D' }}>App Icon</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {variants.map((x) => (
          <div key={x.v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <AppIcon variant={x.v} size={120} />
            <span style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, color: '#21241D' }}>{x.label}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 24, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <AppIcon variant="lime" size={180} />
          <span style={{ fontSize: 11, color: '#475467' }}>1024 export</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <AppIcon variant="lime" size={60} />
          <span style={{ fontSize: 10, color: '#475467' }}>60</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <AppIcon variant="lime" size={40} />
          <span style={{ fontSize: 10, color: '#475467' }}>40</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <AppIcon variant="lime" size={29} />
          <span style={{ fontSize: 10, color: '#475467' }}>29 (Settings)</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LockScreen — iOS lockscreen with Clusteer push + widget
// ─────────────────────────────────────────────────────────────
function LockScreen({ mode = 'dark', showPush = true, showWidget = true }) {
  const isDark = mode === 'dark';
  const wallBg = isDark
    ? 'linear-gradient(160deg, #0F1F12 0%, #1F4029 35%, #0F1F12 100%)'
    : 'linear-gradient(160deg, #C8F49B 0%, #9FE870 50%, #6EBC42 100%)';
  const fg = isDark ? '#fff' : '#21241D';
  return (
    <div style={{ position: 'absolute', inset: 0, background: wallBg, color: fg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 28, paddingTop: 70 }}>
      {/* Lock icon */}
      <Icon.Lock size={20} color={fg} style={{ opacity: 0.7 }} />
      {/* Time */}
      <div style={{ fontFamily: '-apple-system, "SF Pro Display"', fontWeight: 200, fontSize: 88, lineHeight: 1, color: fg, marginTop: 6 }}>9:41</div>
      <div style={{ fontFamily: '-apple-system, "SF Pro Display"', fontWeight: 600, fontSize: 17, color: fg, opacity: 0.85, marginTop: -4 }}>Friday, April 30</div>

      {showWidget && (
        <div style={{ width: '100%', marginTop: 22 }}>
          <HomeWidget compact dark={isDark} />
        </div>
      )}

      <div style={{ flex: 1 }} />

      {showPush && (
        <div style={{ width: '100%', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PushNotification
            title="Clusteer"
            body="✅ ₦807,250 received from Buy USDT (TX-2401)"
            time="now"
          />
          <PushNotification
            title="Clusteer"
            body="📈 USDT/NGN rate is up — ₦1,614.50 (+0.4%). Tap to trade."
            time="2m"
            stacked
          />
        </div>
      )}

      {/* Bottom dock icons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 50px', marginBottom: 6 }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M11 5L6 9H2v6h4l5 4V5z"/></svg>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Icon.Camera size={18} color="#fff" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PushNotification — iOS-style banner
// ─────────────────────────────────────────────────────────────
function PushNotification({ title, body, time = 'now', stacked = false }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '0.5px solid rgba(255,255,255,0.2)',
      borderRadius: 16, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
      boxShadow: stacked ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
      transform: stacked ? 'scale(0.96) translateY(-4px)' : 'none',
      opacity: stacked ? 0.7 : 1,
    }}>
      <AppIcon size={36} variant="lime" radius={9} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: '-apple-system, "SF Pro Text"', fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: -0.1 }}>{title}</span>
          <span style={{ fontFamily: '-apple-system, "SF Pro Text"', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{time}</span>
        </div>
        <div style={{ fontFamily: '-apple-system, "SF Pro Text"', fontSize: 13, color: 'rgba(255,255,255,0.92)', marginTop: 2, lineHeight: 1.35 }}>{body}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HomeWidget — small/medium home-screen widget
// ─────────────────────────────────────────────────────────────
function HomeWidget({ size = 'medium', dark = false, compact = false }) {
  const bg = dark ? 'rgba(33,36,29,0.5)' : '#FFFFFF';
  const fg = dark ? '#F5F4EE' : '#21241D';
  const muted = dark ? 'rgba(245,244,238,0.6)' : '#667085';
  const accent = '#9FE870';

  if (size === 'small' || compact) {
    return (
      <div style={{
        width: '100%', maxWidth: compact ? '100%' : 165,
        height: compact ? 'auto' : 165, padding: 14,
        background: bg, borderRadius: 22,
        backdropFilter: dark ? 'blur(30px)' : 'none',
        border: dark ? '0.5px solid rgba(255,255,255,0.15)' : 'none',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ClusteerLogo size={18} color={fg} />
          <div style={{ width: 24, height: 24, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.TrendingUp size={14} color="#21241D" strokeWidth={2.4} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: muted, fontWeight: 600 }}>USDT / NGN</div>
          <div style={{ fontFamily: FONTS.numeric, fontSize: 22, fontWeight: 700, color: fg, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 2 }}>₦1,614.50</div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: '#1F7A3A', fontWeight: 700, marginTop: 2 }}>↑ 0.4% today</div>
        </div>
        {!compact && <Sparkline data={RATE_SERIES.slice(-20).map(p => p.c)} width={130} height={28} color={accent} filled />}
      </div>
    );
  }

  // Medium widget
  return (
    <div style={{
      width: '100%', padding: 16,
      background: bg, borderRadius: 22,
      backdropFilter: dark ? 'blur(30px)' : 'none',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : 'none',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ClusteerLogo size={20} color={fg} showWordmark />
        <span style={{ fontFamily: FONTS.body, fontSize: 11, color: muted, fontWeight: 600 }}>Live · 9:41 AM</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: muted, fontWeight: 600 }}>Portfolio</div>
          <div style={{ fontFamily: FONTS.numeric, fontSize: 26, fontWeight: 700, color: fg, letterSpacing: -0.5, lineHeight: 1.05, marginTop: 2 }}>₦5.55M</div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: '#1F7A3A', fontWeight: 700, marginTop: 2 }}>↑ ₦62,400 (1.13%)</div>
        </div>
        <Sparkline data={RATE_SERIES.slice(-30).map(p => p.c)} width={120} height={40} color={accent} filled />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Buy', 'Sell', 'Send'].map((x) => (
          <div key={x} style={{
            flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 12,
            background: x === 'Buy' ? accent : (dark ? 'rgba(255,255,255,0.08)' : '#F2F2F0'),
            color: x === 'Buy' ? '#21241D' : fg,
            fontFamily: FONTS.body, fontSize: 12, fontWeight: 700,
          }}>{x}</div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AppLockedState — when app is opened but not authenticated
// ─────────────────────────────────────────────────────────────
function AppLockedState({ method = 'face', mode = 'light', onUnlock }) {
  const c = mode === 'dark' ? CT.dark : CT.light;
  const [stage, setStage] = React.useState('waiting'); // waiting, scanning, success, fail
  return (
    <div style={{ position: 'absolute', inset: 0, background: c.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32, paddingTop: 100 }}>
      <ClusteerLogo size={52} dark={mode === 'dark'} />
      <div style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, marginTop: 22, letterSpacing: -0.3 }}>Clusteer is locked</div>
      <div style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 6, textAlign: 'center', maxWidth: 260, lineHeight: 1.4 }}>
        {method === 'face' ? 'Look at your phone to unlock' : 'Place your finger on the sensor'}
      </div>

      <div style={{ flex: 1 }} />

      {/* Biometric prompt */}
      <div style={{
        width: 124, height: 124, borderRadius: '50%',
        background: c.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', marginBottom: 28,
      }}>
        <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${c.lightGreen}`, animation: stage === 'scanning' ? 'pulse 1.4s ease-in-out infinite' : 'none', opacity: stage === 'scanning' ? 1 : 0 }} />
        {method === 'face' ? <Icon.FaceId size={56} color={c.text} strokeWidth={1.5} /> : <Icon.Fingerprint size={60} color={c.text} strokeWidth={1.5} />}
      </div>

      <BtnPrimary bold full={false} size="md" onClick={() => { setStage('scanning'); setTimeout(() => { setStage('success'); onUnlock?.(); }, 1100); }}>
        {method === 'face' ? 'Use Face ID' : 'Use Fingerprint'}
      </BtnPrimary>
      <BtnGhost onClick={() => onUnlock?.()} style={{ marginTop: 10 }}>Use passcode instead</BtnGhost>
    </div>
  );
}

Object.assign(window, { AppIcon, AppIconShowcase, LockScreen, PushNotification, HomeWidget, AppLockedState });
