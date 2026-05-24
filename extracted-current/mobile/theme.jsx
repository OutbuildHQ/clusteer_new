// Clusteer Mobile — Theme tokens & primitives
// All colors lifted from /clusteer-unified/src/app/globals.css plus the playful
// landing-page palette (#F0EBE6 beige, custom-black, lime light-green).

const CT = {
  // Light mode
  light: {
    bg: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceMuted: '#F2F2F0',     // dashboard widget plate
    surfaceWarm: '#F0EBE6',      // beige info / landing card
    surfaceSubtle: '#F5F5F5',
    paleGreen: '#EFFCD0',        // pale-green tint
    lightGreen: '#9FE870',       // hero lime — "buy" buttons
    mediumGreen: '#9FE870',
    darkGreen: '#1F7A3A',        // dark-green text
    deepGreen: '#0F4F26',
    customBlack: '#21241D',      // brand near-black
    realBlack: '#000000',
    text: '#21241D',
    textMuted: '#475467',
    textSubtle: '#667085',
    textDim: '#94989B',
    border: '#E9EAEB',
    borderStrong: '#21241D',     // bold black border (landing)
    borderSoft: 'rgba(33,36,29,0.10)',
    danger: '#D92D20',
    dangerSoft: '#FEF3F2',
    warning: '#DC6803',
    warningSoft: '#FFFAEB',
    success: '#1F7A3A',
    successSoft: '#EFFCD0',
    info: '#175CD3',
    infoSoft: '#EFF8FF',
    overlay: 'rgba(33,36,29,0.55)',
  },
  // Dark mode — anchored on customBlack tones
  dark: {
    bg: '#121310',
    surface: '#1B1D17',
    surfaceMuted: '#212319',
    surfaceWarm: '#2A2A24',
    surfaceSubtle: '#26281F',
    paleGreen: '#243218',
    lightGreen: '#9FE870',
    mediumGreen: '#9FE870',
    darkGreen: '#9FE870',
    deepGreen: '#C8F49B',
    customBlack: '#0A0B08',
    realBlack: '#000000',
    text: '#F5F4EE',
    textMuted: '#A8ACA1',
    textSubtle: '#7E8278',
    textDim: '#5C5F58',
    border: '#2D2F26',
    borderStrong: '#F5F4EE',
    borderSoft: 'rgba(245,244,238,0.10)',
    danger: '#F97066',
    dangerSoft: '#3A1A18',
    warning: '#F79009',
    warningSoft: '#3A2A12',
    success: '#9FE870',
    successSoft: '#243218',
    info: '#84CAFF',
    infoSoft: '#16263A',
    overlay: 'rgba(0,0,0,0.7)',
  },
};

// Type stack — aligned with the web app (Sora / Inter / JetBrains Mono)
const FONTS = {
  body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  display: '"Sora", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  numeric: '"JetBrains Mono", "Inter", ui-monospace, "SF Mono", Menlo, monospace',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

const RADIUS = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

const ThemeCtx = React.createContext({ mode: 'light', c: CT.light });

function ThemeProvider({ mode = 'light', children }) {
  const c = mode === 'dark' ? CT.dark : CT.light;
  return <ThemeCtx.Provider value={{ mode, c, FONTS, RADIUS }}>{children}</ThemeCtx.Provider>;
}

const useTheme = () => React.useContext(ThemeCtx);

// ─────────────────────────────────────────────────────────────
// Clusteer brand mark — solid filled "C" with 3 stacked dots + 1 outer dot
// (vector lifted directly from the official brand asset, viewBox 110×110)
// ─────────────────────────────────────────────────────────────
function ClusteerLogo({ size = 24, color, showWordmark = false, dark = false, compact = false }) {
  const fg = color || (dark ? '#F5F4EE' : '#21241D');
  // Compact = mark only at very small sizes (notification bubble etc.)
  if (compact) {
    return (
      <svg width={size} height={size} viewBox="0 0 110 110" fill="none" style={{ flexShrink: 0 }}>
        <path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z" fill={fg}/>
        <circle cx="76.9814" cy="31.0309" r="7.27554" fill={fg}/>
        <circle cx="76.9814" cy="54.5603" r="7.27554" fill={fg}/>
        <circle cx="76.9814" cy="78.0898" r="7.27554" fill={fg}/>
        <circle cx="97.7243" cy="54.5603" r="7.27554" fill={fg}/>
      </svg>
    );
  }
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3 }}>
      <svg width={size} height={size} viewBox="0 0 110 110" fill="none" style={{ flexShrink: 0 }}>
        <path d="M4.99993 54.5605C4.99993 27.0705 25.7099 4.41769 52.3788 1.35297C55.7761 0.962547 58.5603 3.77234 58.5603 7.19206L58.5603 54.5605L58.5603 101.929C58.5603 105.349 55.7761 108.158 52.3788 107.768C25.7099 104.703 4.99993 82.0504 4.99993 54.5605Z" fill={fg}/>
        <circle cx="76.9814" cy="31.0309" r="7.27554" fill={fg}/>
        <circle cx="76.9814" cy="54.5603" r="7.27554" fill={fg}/>
        <circle cx="76.9814" cy="78.0898" r="7.27554" fill={fg}/>
        <circle cx="97.7243" cy="54.5603" r="7.27554" fill={fg}/>
      </svg>
      {showWordmark && (
        <span style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: size * 0.95, color: fg, letterSpacing: -0.6 }}>
          Clusteer
        </span>
      )}
    </div>
  );
}

// Asset glyphs (USDT, NGN, BTC, ETH, BNB, SOL)
function AssetLogo({ symbol, size = 32 }) {
  const map = {
    USDT: { bg: '#26A17B', fg: '#fff', glyph: '₮' },
    USDC: { bg: '#2775CA', fg: '#fff', glyph: '$' },
    BTC: { bg: '#F7931A', fg: '#fff', glyph: '₿' },
    ETH: { bg: '#627EEA', fg: '#fff', glyph: 'Ξ' },
    BNB: { bg: '#F0B90B', fg: '#fff', glyph: 'B' },
    SOL: { bg: '#000', fg: '#9945FF', glyph: 'S' },
    NGN: { bg: '#008751', fg: '#fff', glyph: '₦' },
    NAIRA: { bg: '#008751', fg: '#fff', glyph: '₦' },
    BANK: { bg: '#21241D', fg: '#9FE870', glyph: '◫' },
  };
  const x = map[symbol] || { bg: '#9FE870', fg: '#21241D', glyph: symbol?.[0] || '?' };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: x.bg, color: x.fg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.numeric, fontWeight: 700, fontSize: size * 0.5, flexShrink: 0,
    }}>{x.glyph}</div>
  );
}

// Bank logos as simple monogram tiles
function BankLogo({ name = 'GTB', size = 32 }) {
  const map = {
    GTB: '#E5631B', GTBank: '#E5631B',
    Access: '#003D71', AccessBank: '#003D71',
    Zenith: '#E60012', ZenithBank: '#E60012',
    UBA: '#E50012',
    First: '#003F7F', FirstBank: '#003F7F',
    Kuda: '#40196D',
    Opay: '#11D269', OPay: '#11D269',
    Palmpay: '#7F3FBF', PalmPay: '#7F3FBF',
  };
  const bg = map[name] || '#21241D';
  return (
    <div style={{
      width: size, height: size, borderRadius: 8, background: bg, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONTS.body, fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
    }}>{name.slice(0, 3).toUpperCase()}</div>
  );
}

Object.assign(window, { CT, FONTS, RADIUS, ThemeProvider, ThemeCtx, useTheme, ClusteerLogo, AssetLogo, BankLogo });
