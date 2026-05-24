const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;

// Clusteer Mobile — UI primitives
// Phone shell, screen scaffold, buttons, inputs, sheets, list rows, tabs, toasts.

// ─────────────────────────────────────────────────────────────
// Phone — outer device frame (renders iOS or Android chrome
// based on `platform`). Width fixed at 390 for design grid.
// ─────────────────────────────────────────────────────────────
const PHONE_W = 390;
const PHONE_H = 844;

function Phone({ platform = 'ios', mode = 'light', label, badge, children, statusDark, hideStatus = false, hideHome = false, fullBleed = false }) {
  const c = mode === 'dark' ? CT.dark : CT.light;
  const bg = c.bg;
  const isIOS = platform === 'ios';
  const sb = statusDark != null ? statusDark : (mode === 'dark');
  return (
    <div style={{ width: PHONE_W, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {(label || badge) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 6px 10px', gap: 8 }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: '#21241D', letterSpacing: -0.1 }}>{label}</span>
          {badge && <span style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 600, color: '#fff', background: '#21241D', padding: '3px 8px', borderRadius: 999 }}>{badge}</span>}
        </div>
      )}
      <div style={{
        width: PHONE_W, height: PHONE_H, borderRadius: 48,
        border: `${isIOS ? 10 : 6}px solid #1a1a1a`,
        background: bg, position: 'relative', overflow: 'hidden',
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.25), 0 10px 30px -10px rgba(0,0,0,0.15)',
      }}>
        {/* Status bar */}
        {!hideStatus && (
          isIOS ? <PhoneStatusIOS dark={sb} /> : <PhoneStatusAndroid dark={sb} />
        )}
        {/* Screen content */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          top: hideStatus ? 0 : (isIOS ? 47 : 36),
          bottom: hideHome ? 0 : (isIOS ? 34 : 24),
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          background: fullBleed ? 'transparent' : bg,
        }}>{children}</div>
        {/* Home indicator */}
        {!hideHome && (isIOS ? <PhoneHomeIOS dark={sb} /> : <PhoneHomeAndroid dark={sb} />)}
        {/* iOS dynamic island */}
        {isIOS && !hideStatus && (
          <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 124, height: 36, borderRadius: 999, background: '#000', zIndex: 10 }} />
        )}
      </div>
    </div>
  );
}

function PhoneStatusIOS({ dark }) {
  const c = dark ? '#fff' : '#21241D';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 47,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 30px', zIndex: 5, paddingTop: 14,
    }}>
      <span style={{ fontFamily: '-apple-system, "SF Pro Display"', fontWeight: 600, fontSize: 16, color: c }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><path d="M2 8h2v2H2zM6 5h2v5H6zM10 2h2v8h-2zM14 0h2v10h-2z" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke={c} strokeWidth="1.2"><path d="M7.5 3a7 7 0 0 1 5 2M7.5 6a4 4 0 0 1 3 1.2"/><circle cx="7.5" cy="9" r="0.8" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" fill="none" stroke={c} strokeOpacity="0.4"/><rect x="2" y="2" width="17" height="7" rx="1" fill={c}/><path d="M21.5 4v3c0.6-0.2 1-0.7 1-1.5s-0.4-1.3-1-1.5z" fill={c} fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

function PhoneStatusAndroid({ dark }) {
  const c = dark ? '#fff' : '#21241D';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 36,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 18px', zIndex: 5,
    }}>
      <span style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 13, color: c }}>9:41</span>
      <div style={{ position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)', width: 18, height: 18, borderRadius: 99, background: '#0a0a0a' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="14" height="10" viewBox="0 0 14 10" fill={c}><path d="M7 9.5L0.5 3a9 9 0 0 1 13 0L7 9.5z"/></svg>
        <svg width="13" height="10" viewBox="0 0 13 10" fill={c}><path d="M11.5 1v8h-9z"/></svg>
        <svg width="18" height="10" viewBox="0 0 18 10"><rect x="0.5" y="1" width="14" height="8" rx="1.5" fill="none" stroke={c}/><rect x="2" y="2.5" width="11" height="5" rx="0.5" fill={c}/><rect x="14.5" y="3" width="2" height="4" rx="0.5" fill={c}/></svg>
      </div>
    </div>
  );
}

function PhoneHomeIOS({ dark }) {
  return <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 99, background: dark ? '#fff' : '#21241D', zIndex: 5 }} />;
}
function PhoneHomeAndroid({ dark }) {
  return <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 110, height: 4, borderRadius: 99, background: dark ? '#fff' : '#21241D', opacity: 0.7, zIndex: 5 }} />;
}

// ─────────────────────────────────────────────────────────────
// Screen — scrollable content area inside Phone
// ─────────────────────────────────────────────────────────────
function Screen({ children, padding = 16, scroll = true, style = {} }) {
  return (
    <div style={{
      flex: 1, overflowY: scroll ? 'auto' : 'hidden', overflowX: 'hidden',
      padding: typeof padding === 'number' ? padding : padding,
      WebkitOverflowScrolling: 'touch',
      ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// AppBar — top header in the screen
// ─────────────────────────────────────────────────────────────
function AppBar({ title, leading, trailing, large = false, transparent = false, subtitle }) {
  const { c } = useTheme();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: large ? '8px 16px 4px' : '12px 16px',
      background: transparent ? 'transparent' : c.bg,
      gap: 8,
    }}>
      <div style={{ minWidth: 40, display: 'flex', alignItems: 'center' }}>{leading}</div>
      {!large && (
        <div style={{ flex: 1, textAlign: 'center' }}>
          {title && <div style={{ fontFamily: FONTS.body, fontSize: 16, fontWeight: 600, color: c.text }}>{title}</div>}
          {subtitle && <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, marginTop: 2 }}>{subtitle}</div>}
        </div>
      )}
      {large && <div style={{ flex: 1 }} />}
      <div style={{ minWidth: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}

function IconBtn({ children, onClick, bg, size = 38, style = {} }) {
  const { c } = useTheme();
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: 999, border: 'none',
      background: bg ?? c.surfaceMuted, color: c.text,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0, ...style,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// BtnPrimary / BtnSecondary / BtnGhost / Pill
// ─────────────────────────────────────────────────────────────
function BtnPrimary({ children, onClick, full = true, size = 'lg', disabled, style = {}, leading, trailing, bold = true }) {
  const { c } = useTheme();
  // 'bold' = the playful black-bordered lime; otherwise dark-green filled
  const sizes = { sm: { h: 38, fs: 13, px: 16 }, md: { h: 46, fs: 14, px: 18 }, lg: { h: 56, fs: 15, px: 22 } };
  const s = sizes[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: s.h, padding: `0 ${s.px}px`, borderRadius: 999,
      background: bold ? c.lightGreen : c.customBlack,
      color: bold ? c.customBlack : '#fff',
      border: bold ? `2px solid ${c.customBlack}` : 'none',
      fontFamily: FONTS.body, fontWeight: 700, fontSize: s.fs,
      width: full ? '100%' : 'auto', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, display: 'inline-flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, letterSpacing: -0.1,
      boxShadow: bold ? '0 2px 0 0 rgba(33,36,29,0.95)' : 'none',
      transition: 'transform 0.1s', flexShrink: 0,
      ...style,
    }}>
      {leading}{children}{trailing}
    </button>
  );
}

function BtnSecondary({ children, onClick, full = true, size = 'lg', leading, trailing, style = {} }) {
  const { c } = useTheme();
  const sizes = { sm: { h: 38, fs: 13 }, md: { h: 46, fs: 14 }, lg: { h: 56, fs: 15 } };
  const s = sizes[size];
  return (
    <button onClick={onClick} style={{
      height: s.h, padding: '0 22px', borderRadius: 999,
      background: c.surfaceMuted, color: c.text, border: 'none',
      fontFamily: FONTS.body, fontWeight: 600, fontSize: s.fs,
      width: full ? '100%' : 'auto', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      letterSpacing: -0.1, flexShrink: 0, ...style,
    }}>{leading}{children}{trailing}</button>
  );
}

function BtnGhost({ children, onClick, full = false, color, style = {} }) {
  const { c } = useTheme();
  return (
    <button onClick={onClick} style={{
      padding: '10px 14px', borderRadius: 999, background: 'transparent',
      color: color ?? c.darkGreen, border: 'none',
      fontFamily: FONTS.body, fontWeight: 600, fontSize: 14,
      width: full ? '100%' : 'auto', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      ...style,
    }}>{children}</button>
  );
}

function Pill({ children, active, onClick, color, bg, style = {} }) {
  const { c } = useTheme();
  return (
    <button onClick={onClick} style={{
      height: 34, padding: '0 14px', borderRadius: 999,
      border: `1.5px solid ${active ? c.customBlack : c.border}`,
      background: bg ?? (active ? c.lightGreen : c.surface),
      color: color ?? c.text,
      fontFamily: FONTS.body, fontWeight: 600, fontSize: 13,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      flexShrink: 0, ...style,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// Card — surface container with optional warm/lime/muted variant
// ─────────────────────────────────────────────────────────────
function Card({ variant = 'surface', children, style = {}, padding = 16, onClick, bordered, bold }) {
  const { c } = useTheme();
  const map = {
    surface: { bg: c.surface, border: bordered ? `1px solid ${c.border}` : 'none' },
    muted: { bg: c.surfaceMuted, border: 'none' },
    warm: { bg: c.surfaceWarm, border: 'none' },
    lime: { bg: c.lightGreen, border: bold ? `2px solid ${c.customBlack}` : 'none' },
    pale: { bg: c.paleGreen, border: 'none' },
    dark: { bg: c.customBlack, border: 'none' },
    outline: { bg: 'transparent', border: `1.5px solid ${c.border}` },
  };
  const v = map[variant] || map.surface;
  return (
    <div onClick={onClick} style={{
      borderRadius: 20, padding, background: v.bg, border: v.border,
      cursor: onClick ? 'pointer' : 'default', ...style,
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Row — leading icon + text + trailing
// ─────────────────────────────────────────────────────────────
function Row({ leading, title, subtitle, trailing, onClick, divider = false, style = {} }) {
  const { c } = useTheme();
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 4px', cursor: onClick ? 'pointer' : 'default',
      borderBottom: divider ? `1px solid ${c.border}` : 'none', ...style,
    }}>
      {leading && <div style={{ flexShrink: 0 }}>{leading}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {typeof title === 'string'
          ? <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 600, color: c.text, letterSpacing: -0.1 }}>{title}</div>
          : title}
        {subtitle && (typeof subtitle === 'string'
          ? <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 2 }}>{subtitle}</div>
          : subtitle)}
      </div>
      {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom navigation — 5 items
// ─────────────────────────────────────────────────────────────
function BottomNav({ active = 'home', onChange, hidePill }) {
  const { c, mode } = useTheme();
  const items = [
    { id: 'home', label: 'Home', icon: Icon.Home },
    { id: 'markets', label: 'Markets', icon: Icon.TrendingUp },
    { id: 'trade', label: 'Trade', icon: Icon.ArrowUpDown, primary: true },
    { id: 'history', label: 'Activity', icon: Icon.Activity },
    { id: 'profile', label: 'Profile', icon: Icon.User },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px 6px', background: c.surface,
      borderTop: `1px solid ${c.border}`,
    }}>
      {items.map((it) => {
        const isActive = it.id === active;
        if (it.primary && !hidePill) {
          return (
            <button key={it.id} onClick={() => onChange?.(it.id)} style={{
              width: 56, height: 56, borderRadius: '50%',
              background: c.lightGreen, color: c.customBlack,
              border: `2px solid ${c.customBlack}`, marginTop: -28,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 6px 14px -4px rgba(33,36,29,0.35)',
            }}>
              <it.icon size={22} strokeWidth={2.2} />
            </button>
          );
        }
        return (
          <button key={it.id} onClick={() => onChange?.(it.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: isActive ? c.text : c.textSubtle, padding: '8px 0',
          }}>
            <it.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            <span style={{ fontFamily: FONTS.body, fontSize: 10.5, fontWeight: isActive ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TextField — labeled input
// ─────────────────────────────────────────────────────────────
function TextField({ label, value = '', onChange, placeholder, leading, trailing, type = 'text', helper, error, style = {}, large = false }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: c.text }}>{label}</label>}
      <div style={{
        height: large ? 60 : 52, borderRadius: 14, background: c.surface,
        border: `1.5px solid ${error ? c.danger : c.border}`,
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
        transition: 'border-color 0.15s',
      }}>
        {leading && <span style={{ color: c.textMuted, display: 'flex' }}>{leading}</span>}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: FONTS.body, fontSize: large ? 16 : 14, fontWeight: 500,
            color: c.text, minWidth: 0,
          }}
        />
        {trailing}
      </div>
      {helper && !error && <div style={{ fontSize: 12, color: c.textMuted, fontFamily: FONTS.body }}>{helper}</div>}
      {error && <div style={{ fontSize: 12, color: c.danger, fontFamily: FONTS.body, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sheet — bottom sheet overlay (modal)
// ─────────────────────────────────────────────────────────────
function Sheet({ open, onClose, children, title, height = 'auto' }) {
  const { c } = useTheme();
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'relative', background: c.surface,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 20px 24px', maxHeight: '88%',
        height: height === 'auto' ? 'auto' : height,
        display: 'flex', flexDirection: 'column', gap: 12,
        animation: 'sheetIn 0.25s ease-out',
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: c.border, alignSelf: 'center' }} />
        {title && <div style={{ fontFamily: FONTS.body, fontSize: 17, fontWeight: 700, color: c.text, textAlign: 'center' }}>{title}</div>}
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Toast — banner at top of screen
// ─────────────────────────────────────────────────────────────
function Toast({ kind = 'success', title, message, onClose }) {
  const { c } = useTheme();
  const map = {
    success: { bg: c.successSoft, border: c.success, fg: c.success, icon: Icon.CheckCircle },
    error: { bg: c.dangerSoft, border: c.danger, fg: c.danger, icon: Icon.Alert },
    info: { bg: c.infoSoft, border: c.info, fg: c.info, icon: Icon.Info },
    warn: { bg: c.warningSoft, border: c.warning, fg: c.warning, icon: Icon.AlertTriangle },
  };
  const v = map[kind];
  return (
    <div style={{
      position: 'absolute', top: 12, left: 16, right: 16, zIndex: 60,
      background: v.bg, border: `1.5px solid ${v.border}`,
      borderRadius: 14, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start',
      boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
      animation: 'toastIn 0.3s ease-out',
    }}>
      <v.icon size={20} color={v.fg} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{title}</div>
        {message && <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 2 }}>{message}</div>}
      </div>
      {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, padding: 0, display: 'flex' }}><Icon.X size={18} /></button>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Numeric — Lexend tabular num formatter
// ─────────────────────────────────────────────────────────────
function Num({ children, size = 14, weight = 600, color, style = {} }) {
  return (
    <span style={{
      fontFamily: FONTS.numeric, fontSize: size, fontWeight: weight,
      fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3, color, ...style,
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab bar — segmented in pills
// ─────────────────────────────────────────────────────────────
function Tabs({ items, active, onChange, variant = 'pill' }) {
  const { c } = useTheme();
  if (variant === 'underline') {
    return (
      <div style={{ display: 'flex', borderBottom: `1px solid ${c.border}`, gap: 0 }}>
        {items.map((t) => {
          const isA = (t.id || t) === active;
          return (
            <button key={t.id || t} onClick={() => onChange?.(t.id || t)} style={{
              flex: 1, padding: '12px 0', background: 'transparent',
              border: 'none', borderBottom: `2px solid ${isA ? c.text : 'transparent'}`,
              fontFamily: FONTS.body, fontSize: 13.5, fontWeight: isA ? 700 : 500,
              color: isA ? c.text : c.textMuted, cursor: 'pointer',
            }}>{t.label || t}</button>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ display: 'inline-flex', background: c.surfaceMuted, padding: 4, borderRadius: 999, gap: 2 }}>
      {items.map((t) => {
        const isA = (t.id || t) === active;
        return (
          <button key={t.id || t} onClick={() => onChange?.(t.id || t)} style={{
            padding: '8px 16px', borderRadius: 999, border: 'none',
            background: isA ? c.surface : 'transparent', cursor: 'pointer',
            fontFamily: FONTS.body, fontSize: 13, fontWeight: 600,
            color: isA ? c.text : c.textMuted,
            boxShadow: isA ? '0 1px 3px rgba(0,0,0,0.07)' : 'none',
          }}>{t.label || t}</button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Badge / status chip
// ─────────────────────────────────────────────────────────────
function Badge({ children, kind = 'neutral', dot, style = {} }) {
  const { c } = useTheme();
  const map = {
    success: { bg: c.successSoft, fg: c.success },
    danger: { bg: c.dangerSoft, fg: c.danger },
    warn: { bg: c.warningSoft, fg: c.warning },
    info: { bg: c.infoSoft, fg: c.info },
    neutral: { bg: c.surfaceMuted, fg: c.textMuted },
    lime: { bg: c.lightGreen, fg: c.customBlack },
    dark: { bg: c.customBlack, fg: c.lightGreen },
  };
  const v = map[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999, background: v.bg, color: v.fg,
      fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, letterSpacing: 0.1,
      ...style,
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 99, background: v.fg }} />}
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Sparkline / mini chart (Clusteer-styled)
// ─────────────────────────────────────────────────────────────
function Sparkline({ data, width = 80, height = 28, color = '#1F7A3A', filled = true }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * width, height - ((v - min) / span) * height]);
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const fill = filled ? `${path} L${width} ${height} L0 ${height} Z` : null;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {filled && <path d={fill} fill={color} fillOpacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Switch
// ─────────────────────────────────────────────────────────────
function Switch({ value, onChange }) {
  const { c } = useTheme();
  return (
    <button onClick={() => onChange?.(!value)} style={{
      width: 44, height: 26, borderRadius: 99, padding: 2,
      background: value ? c.customBlack : c.border, border: 'none',
      cursor: 'pointer', display: 'flex', alignItems: 'center',
      justifyContent: value ? 'flex-end' : 'flex-start', transition: 'all 0.2s',
    }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: value ? c.lightGreen : '#fff' }} />
    </button>
  );
}

// CSS keyframes
function MobileStyles() {
  return (
    <style>{`
      @keyframes sheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
      @keyframes toastIn { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      .skel { background: linear-gradient(90deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.10) 37%, rgba(0,0,0,0.05) 63%); background-size: 400% 100%; animation: shimmer 1.4s ease-in-out infinite; border-radius: 8px; }
      .dark-mode .skel { background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.10) 37%, rgba(255,255,255,0.05) 63%); background-size: 400% 100%; }
    `}</style>
  );
}

Object.assign(window, {
  Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn,
  BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav,
  TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch, MobileStyles,
});
