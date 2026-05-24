// Auto-injected: pull cross-script globals into local scope
const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;
const { Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn, BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav, TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch } = window;
const { ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT, RATE_USDT_NGN, FEE_PCT, RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD } = window;
const { ClusteerChart, CandleChart, RangeTabs, Donut } = window;

// Clusteer Mobile — Buy & Sell USDT flows + Swap
// Buy: amount entry → review → processing → success
// Sell: amount entry (asset → NGN) → bank pick → review → success
// Swap: USDT ↔ USDC ↔ BTC etc — minimal UX

// ─── BUY: Amount entry — Variation A (bold lime) ─────────
function BuyAmountA({ onNext, onBack }) {
  const { c } = useTheme();
  const [ngn, setNgn] = React.useState(50000);
  const [usdt, setUsdt] = React.useState(50000 / RATE_USDT_NGN);
  const [activeField, setActive] = React.useState('ngn');
  const fee = ngn * FEE_PCT;
  const onNgn = (v) => { setNgn(v); setUsdt(v / RATE_USDT_NGN); };
  const onUsdt = (v) => { setUsdt(v); setNgn(v * RATE_USDT_NGN); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Buy USDT" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn><Icon.Clock size={18} /></IconBtn>} />
      <Screen padding={20}>
        {/* Live rate ribbon */}
        <Card variant="warm" padding={14} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: c.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: '#26A17B' }}>₮</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, fontWeight: 600 }}>1 USDT =</div>
            <Num size={16} weight={700} color={c.text}>₦1,614.50</Num>
          </div>
          <span style={{ fontFamily: FONTS.body, fontSize: 11, color: c.darkGreen, fontWeight: 700, background: c.paleGreen, padding: '4px 8px', borderRadius: 99 }}>● Live</span>
        </Card>

        {/* You pay */}
        <FieldBlock
          label="You pay"
          value={ngn}
          onChange={onNgn}
          unit="NGN"
          symbol="₦"
          active={activeField === 'ngn'}
          onFocus={() => setActive('ngn')}
          subtitle={`Available: ₦4,210,500`}
        />
        {/* Switch */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: c.customBlack, color: c.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <Icon.ArrowDown size={18} color={c.lightGreen} strokeWidth={2.5} />
          </div>
        </div>
        {/* You receive */}
        <FieldBlock
          label="You receive"
          value={Number(usdt.toFixed(2))}
          onChange={onUsdt}
          unit="USDT"
          symbol="₮"
          active={activeField === 'usdt'}
          onFocus={() => setActive('usdt')}
          tint={c.paleGreen}
        />

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {[10000, 50000, 100000, 'MAX'].map((v) => (
            <button key={v} onClick={() => onNgn(v === 'MAX' ? 4210500 : v)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: c.surface, border: `1.5px solid ${c.border}`, fontFamily: FONTS.body, fontSize: 12.5, fontWeight: 700, color: c.text, cursor: 'pointer' }}>
              {v === 'MAX' ? 'Max' : '₦' + (v / 1000) + 'k'}
            </button>
          ))}
        </div>

        {/* Summary */}
        <Card variant="muted" padding={14} style={{ marginTop: 22 }}>
          <SumRow label="Rate" value="₦1,614.50 / USDT" />
          <SumRow label="Service fee (0.5%)" value={FMT_NGN(fee)} />
          <SumRow label="Network fee" value="Free" valColor={c.darkGreen} />
          <div style={{ height: 1, background: c.border, margin: '8px 0' }} />
          <SumRow label="You'll pay" value={FMT_NGN(ngn + fee)} bold />
        </Card>

        {/* Funding source */}
        <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginTop: 22, marginBottom: 8 }}>PAY WITH</div>
        <Card variant="surface" bordered padding={14} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FONTS.body, fontWeight: 700, fontSize: 11 }}>GTB</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>GTBank ·· 4421</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted }}>Linked · auto-debit enabled</div>
          </div>
          <Icon.ChevronRight size={18} color={c.textMuted} />
        </Card>
      </Screen>
      <div style={{ padding: 20, paddingTop: 8 }}>
        <BtnPrimary bold onClick={onNext} disabled={!ngn}>Review purchase</BtnPrimary>
      </div>
    </div>
  );
}

// Buy variation B — slick keypad / numeric-first
function BuyAmountB({ onNext, onBack }) {
  const { c } = useTheme();
  const [val, setVal] = React.useState('50000');
  const ngn = Number(val);
  const usdt = (ngn / RATE_USDT_NGN).toFixed(2);
  const press = (k) => {
    if (k === 'del') return setVal((v) => v.length > 1 ? v.slice(0, -1) : '0');
    if (k === '.') return setVal((v) => v.includes('.') ? v : v + '.');
    setVal((v) => v === '0' ? k : v + k);
  };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Buy USDT" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <div style={{ flex: 1, padding: '20px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.textMuted, letterSpacing: 0.6 }}>YOU PAY</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: c.textMuted }}>₦</span>
            <Num size={56} weight={700} color={c.text} style={{ fontFamily: FONTS.display, letterSpacing: -2 }}>
              {ngn.toLocaleString('en-NG')}
            </Num>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '8px 14px', borderRadius: 99, background: c.surfaceMuted }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: c.textMuted }}>You get</span>
            <Num size={15} weight={700} color={c.text}>{usdt} USDT</Num>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            {[10000, 50000, 250000].map((v) => (
              <button key={v} onClick={() => setVal(String(v))} style={{ padding: '6px 12px', borderRadius: 99, background: c.surface, border: `1px solid ${c.border}`, fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, color: c.textMuted, cursor: 'pointer' }}>₦{v / 1000}k</button>
            ))}
          </div>
        </div>

        {/* Keypad */}
        <Keypad onPress={press} />
      </div>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onNext} disabled={!ngn}>Continue</BtnPrimary>
      </div>
    </div>
  );
}

function Keypad({ onPress }) {
  const { c } = useTheme();
  const keys = ['1','2','3','4','5','6','7','8','9','.','0','del'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: '16px 0' }}>
      {keys.map((k) => (
        <button key={k} onClick={() => onPress(k)} style={{ height: 52, borderRadius: 14, background: 'transparent', border: 'none', fontFamily: FONTS.display, fontSize: 22, fontWeight: 600, color: c.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {k === 'del' ? <Icon.X size={20} /> : k}
        </button>
      ))}
    </div>
  );
}

function FieldBlock({ label, value, onChange, unit, symbol, active, onFocus, subtitle, tint }) {
  const { c } = useTheme();
  const [focused, setFocused] = React.useState(active);
  return (
    <div onClick={onFocus} style={{
      padding: '14px 16px', borderRadius: 18, background: tint || c.surface,
      border: `2px solid ${active ? c.customBlack : c.border}`, cursor: 'text',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, fontWeight: 600 }}>{label}</span>
        <Pill style={{ padding: '4px 10px' }}>{unit}</Pill>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
        <span style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: c.textMuted }}>{symbol}</span>
        <input
          value={Number(value).toLocaleString('en-NG', { maximumFractionDigits: 2 })}
          onChange={(e) => onChange(Number(e.target.value.replace(/,/g, '')) || 0)}
          style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 700, color: c.text, background: 'transparent', border: 'none', outline: 'none', width: '100%', letterSpacing: -0.6 }}
        />
      </div>
      {subtitle && <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

function SumRow({ label, value, bold, valColor }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
      <span style={{ fontFamily: FONTS.body, fontSize: 13, color: bold ? c.text : c.textMuted, fontWeight: bold ? 700 : 500 }}>{label}</span>
      <span style={{ fontFamily: FONTS.numeric, fontSize: 13, color: valColor || c.text, fontWeight: bold ? 700 : 600 }}>{value}</span>
    </div>
  );
}

// ─── BUY: Review screen ────────────────────────────────────
function BuyReview({ onConfirm, onBack, ngn = 50000, usdt = 30.97 }) {
  const { c } = useTheme();
  const fee = ngn * FEE_PCT;
  const total = ngn + fee;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Review" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <div style={{ textAlign: 'center', padding: '12px 0 22px' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, fontWeight: 600 }}>You'll receive</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
            <AssetGlyph symbol="USDT" size={36} />
            <Num size={36} weight={700} color={c.text} style={{ fontFamily: FONTS.display, letterSpacing: -1 }}>{usdt.toFixed(2)}</Num>
            <span style={{ fontFamily: FONTS.body, fontSize: 18, fontWeight: 700, color: c.textMuted, marginLeft: 4 }}>USDT</span>
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, marginTop: 6 }}>≈ {FMT_NGN(ngn)} at ₦1,614.50/USDT</div>
        </div>

        <Card variant="surface" bordered padding={14}>
          <SumRow label="Pay with" value="GTBank ·· 4421" />
          <SumRow label="Receiving wallet" value="Clusteer Main" />
          <div style={{ height: 1, background: c.border, margin: '10px 0' }} />
          <SumRow label="Amount" value={FMT_NGN(ngn)} />
          <SumRow label="Service fee" value={FMT_NGN(fee)} />
          <SumRow label="Network fee" value="Free" valColor={c.darkGreen} />
          <div style={{ height: 1, background: c.border, margin: '10px 0' }} />
          <SumRow label="Total" value={FMT_NGN(total)} bold />
        </Card>

        <Card variant="warm" padding={14} style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <Icon.Clock size={18} color={c.darkGreen} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.text }}>Rate locked for 30 sec</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 2 }}>If you don't confirm soon, we'll refresh the rate.</div>
          </div>
          <Num size={14} weight={700} color={c.darkGreen}>0:24</Num>
        </Card>
      </Screen>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BtnPrimary bold onClick={onConfirm} leading={<Icon.FaceId size={18} />}>Confirm with Face ID</BtnPrimary>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, textAlign: 'center' }}>
          By confirming you agree to Clusteer's <a style={{ color: c.darkGreen, fontWeight: 600 }}>Terms</a>
        </div>
      </div>
    </div>
  );
}

// ─── BUY: Processing screen ──────────────────────────────
function BuyProcessing({ onDone }) {
  const { c } = useTheme();
  const [stage, setStage] = React.useState(0);
  const stages = [
    'Locking exchange rate',
    'Debiting GTBank ·· 4421',
    'Confirming USDT transfer',
    'Crediting your wallet',
  ];
  React.useEffect(() => {
    const t = setInterval(() => setStage((s) => s < stages.length ? s + 1 : (clearInterval(t), onDone?.(), s)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 28 }}>
      <div style={{ width: 100, height: 100, borderRadius: '50%', border: `4px solid ${c.surfaceMuted}`, borderTopColor: c.darkGreen, animation: 'spin 1s linear infinite' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: c.text, letterSpacing: -0.4 }}>Processing your purchase</div>
        <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, marginTop: 6 }}>Usually takes under 60 seconds</div>
      </div>
      <Card variant="muted" padding={14} style={{ width: '100%' }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            {i < stage ? <Icon.CheckCircle size={18} color={c.darkGreen} /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${i === stage ? c.darkGreen : c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i === stage && <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.darkGreen, animation: 'pulse 1s ease-in-out infinite' }} />}</div>}
            <span style={{ fontFamily: FONTS.body, fontSize: 13, color: i <= stage ? c.text : c.textMuted, fontWeight: i === stage ? 700 : 500 }}>{s}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── BUY: Success screen ─────────────────────────────────
function BuySuccess({ onDone, onShare, onAgain, ngn = 50000, usdt = 30.97 }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Screen padding={20}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 22, textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: c.lightGreen, border: `3px solid ${c.customBlack}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 0 0 rgba(33,36,29,0.95)' }}>
            <Icon.Check size={48} color={c.customBlack} strokeWidth={3.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>{usdt.toFixed(2)} USDT received 🎉</h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 8, lineHeight: 1.4 }}>
              Your wallet has been credited. Send, swap, or withdraw any time.
            </p>
          </div>
          <Card variant="muted" padding={14} style={{ width: '100%' }}>
            <SumRow label="Order ID" value="TX-2401" />
            <SumRow label="Paid" value={FMT_NGN(ngn)} />
            <SumRow label="Rate" value="₦1,614.50" />
            <SumRow label="Settled in" value="42 sec" valColor={c.darkGreen} />
          </Card>
        </div>
      </Screen>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BtnPrimary bold onClick={onDone}>Done</BtnPrimary>
        <div style={{ display: 'flex', gap: 8 }}>
          <BtnSecondary onClick={onShare} leading={<Icon.Send size={16} />}>Share receipt</BtnSecondary>
          <BtnSecondary onClick={onAgain} leading={<Icon.Repeat size={16} />}>Buy again</BtnSecondary>
        </div>
      </div>
    </div>
  );
}

// ─── SELL: Amount entry ──────────────────────────────────
function SellAmount({ onNext, onBack }) {
  const { c } = useTheme();
  const [usdt, setUsdt] = React.useState(100);
  const ngn = usdt * RATE_USDT_NGN;
  const fee = ngn * FEE_PCT;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Sell USDT" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <Card variant="warm" padding={14} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Icon.TrendingUp size={16} color={c.darkGreen} />
          <span style={{ fontFamily: FONTS.body, fontSize: 13, color: c.text, fontWeight: 600 }}>Selling now? Best rate today: <strong>₦1,614.50</strong></span>
        </Card>

        <FieldBlock
          label="You sell"
          value={usdt}
          onChange={setUsdt}
          unit="USDT"
          symbol="₮"
          active
          subtitle={`Available: 1,284.42 USDT`}
        />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: c.customBlack, color: c.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.ArrowDown size={18} color={c.lightGreen} strokeWidth={2.5} />
          </div>
        </div>
        <div style={{ padding: '14px 16px', borderRadius: 18, background: c.paleGreen, border: `2px solid ${c.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, fontWeight: 600 }}>You receive (NGN)</span>
            <Pill>NGN</Pill>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: c.textMuted }}>₦</span>
            <Num size={30} weight={700} color={c.text} style={{ fontFamily: FONTS.display, letterSpacing: -0.6 }}>
              {Math.round(ngn - fee).toLocaleString('en-NG')}
            </Num>
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 2 }}>After 0.5% fee · Lands in ~5 min</div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          {['25%', '50%', '75%', 'Max'].map((v) => (
            <button key={v} onClick={() => setUsdt(v === 'Max' ? 1284.42 : 1284.42 * (parseInt(v) / 100))} style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: c.surface, border: `1.5px solid ${c.border}`, fontFamily: FONTS.body, fontSize: 12.5, fontWeight: 700, color: c.text, cursor: 'pointer' }}>{v}</button>
          ))}
        </div>

        <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginTop: 22, marginBottom: 8 }}>SEND NGN TO</div>
        <Card variant="surface" bordered padding={14} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FONTS.body, fontWeight: 700, fontSize: 11 }}>GTB</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>GTBank ·· 4421</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted }}>Adaeze Nwosu · default</div>
          </div>
          <Icon.ChevronRight size={18} color={c.textMuted} />
        </Card>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onNext}>Review sale</BtnPrimary>
      </div>
    </div>
  );
}

// ─── SELL: Success ───────────────────────────────────────
function SellSuccess({ onDone, ngn = 160643, usdt = 100 }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Screen padding={20}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 22, textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: c.lightGreen, border: `3px solid ${c.customBlack}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 0 0 rgba(33,36,29,0.95)' }}>
            <Icon.Check size={48} color={c.customBlack} strokeWidth={3.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>{FMT_NGN(ngn)} on the way</h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 8, lineHeight: 1.4 }}>
              Funds will reflect in your GTBank account within 5 minutes.
            </p>
          </div>
          <Card variant="muted" padding={14} style={{ width: '100%' }}>
            <SumRow label="Sold" value={`${usdt} USDT`} />
            <SumRow label="To" value="GTBank ·· 4421" />
            <SumRow label="Order ID" value="TX-2402" />
          </Card>
        </div>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onDone}>Back to home</BtnPrimary>
      </div>
    </div>
  );
}

// ─── SWAP: USDT ↔ USDC ────────────────────────
function SwapScreen({ onBack, onConfirm }) {
  const { c } = useTheme();
  const [from, setFrom] = React.useState('USDT');
  const [to, setTo] = React.useState('USDC');
  const [amount, setAmount] = React.useState('100');
  const fromRate = { USDT: 1614.5, USDC: 1613.4 }[from] || 1;
  const toRate = { USDT: 1614.5, USDC: 1613.4 }[to] || 1;
  const out = (Number(amount) * fromRate / toRate).toFixed(4);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Swap" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn><Icon.Settings size={18} /></IconBtn>} />
      <Screen padding={20}>
        <SwapField label="From" symbol={from} value={amount} onChange={setAmount} balance={1284.42} onSelect={() => {}} />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-12px 0', position: 'relative', zIndex: 1 }}>
          <button onClick={() => { const f = from; setFrom(to); setTo(f); }} style={{ width: 44, height: 44, borderRadius: 14, background: c.customBlack, border: `4px solid ${c.bg}`, color: c.lightGreen, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon.ArrowUpDown size={18} color={c.lightGreen} />
          </button>
        </div>
        <SwapField label="To" symbol={to} value={out} readOnly tint={c.paleGreen} onSelect={() => {}} />

        <Card variant="warm" padding={14} style={{ marginTop: 22 }}>
          <SumRow label="Rate" value={`1 ${from} = ${(fromRate / toRate).toFixed(4)} ${to}`} />
          <SumRow label="Slippage" value="0.5%" />
          <SumRow label="Network fee" value="≈ ₦240" />
          <SumRow label="Min received" value={`${(Number(out) * 0.995).toFixed(4)} ${to}`} />
        </Card>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onConfirm}>Review swap</BtnPrimary>
      </div>
    </div>
  );
}

function SwapField({ label, symbol, value, onChange, readOnly, balance, tint, onSelect }) {
  const { c } = useTheme();
  return (
    <div style={{ padding: 16, borderRadius: 18, background: tint || c.surface, border: `2px solid ${c.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, fontWeight: 600 }}>{label}</span>
        {balance && <span style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted }}>Balance: <strong style={{ color: c.text }}>{balance}</strong></span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onSelect} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 6px', borderRadius: 99, background: c.surface, border: `1.5px solid ${c.border}`, cursor: 'pointer' }}>
          <AssetGlyph symbol={symbol} size={26} />
          <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{symbol}</span>
          <Icon.ChevronDown size={14} color={c.textMuted} />
        </button>
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          style={{ flex: 1, fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: c.text, background: 'transparent', border: 'none', outline: 'none', textAlign: 'right', letterSpacing: -0.5 }}
        />
      </div>
    </div>
  );
}

Object.assign(window, {
  BuyAmountA, BuyAmountB, BuyReview, BuyProcessing, BuySuccess,
  SellAmount, SellSuccess, SwapScreen, FieldBlock, SumRow, Keypad,
});
