// Auto-injected: pull cross-script globals into local scope
const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;
const { Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn, BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav, TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch } = window;
const { ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT, RATE_USDT_NGN, FEE_PCT, RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD } = window;
const { ClusteerChart, CandleChart, RangeTabs, Donut } = window;

// Clusteer Mobile — Dashboard / Home (3 variations)
// A) Bold playful (lime balance card, oversize numerics, hand-pull rate ribbon)
// B) Soft premium (clean beige, restrained type, financial-pro feel)
// C) Hybrid command-center (dark hero card, dense data, market ticker)

// ─── Shared bits ───────────────────────────────────────────
function GreetingBlock({ size = 22, weight = 700 }) {
  const { c } = useTheme();
  const hour = 9; // mock
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <div>
      <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted }}>{greet}, Adaeze 👋</div>
      <div style={{ fontFamily: FONTS.display, fontSize: size, fontWeight: weight, color: c.text, letterSpacing: -0.4, marginTop: 2 }}>Welcome back to Clusteer</div>
    </div>
  );
}

function Avatar({ size = 38 }) {
  const { c } = useTheme();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c.lightGreen, border: `2px solid ${c.customBlack}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.customBlack, flexShrink: 0 }}>AN</div>
  );
}

function QuickAction({ icon: I, label, tint, onClick, dark }) {
  const { c } = useTheme();
  return (
    <button onClick={onClick} style={{ flex: 1, padding: '14px 6px', borderRadius: 18, background: dark ? 'rgba(255,255,255,0.08)' : c.surface, border: `1.5px solid ${dark ? 'rgba(255,255,255,0.12)' : c.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: tint || c.paleGreen, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I size={18} color={c.customBlack} strokeWidth={2.2} />
      </div>
      <span style={{ fontFamily: FONTS.body, fontSize: 11.5, fontWeight: 600, color: dark ? '#fff' : c.text }}>{label}</span>
    </button>
  );
}

function TxRow({ tx, onClick }) {
  const { c } = useTheme();
  const positive = tx.kind === 'buy' || tx.kind === 'receive' || tx.kind === 'deposit';
  const iconMap = {
    buy: Icon.ArrowDown, sell: Icon.ArrowUp, send: Icon.ArrowUpRight,
    receive: Icon.ArrowDownLeft, withdraw: Icon.Wallet, deposit: Icon.CreditCard,
  };
  const I = iconMap[tx.kind] || Icon.ArrowUpDown;
  return (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: positive ? c.paleGreen : c.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <I size={18} color={positive ? c.darkGreen : c.text} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 600, color: c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tx.counterparty || tx.kind}
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 1 }}>{tx.date} · {tx.method}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <Num size={14} weight={700} color={positive ? c.darkGreen : c.text}>
          {positive ? '+' : '-'}{FMT_NGN(tx.ngn)}
        </Num>
        <div style={{ fontFamily: FONTS.numeric, fontSize: 11, color: c.textMuted, marginTop: 1 }}>{tx.amount} {tx.asset}</div>
      </div>
    </button>
  );
}

// ─── Variation A — BOLD PLAYFUL ───────────────────────────
function DashboardA({ onNav }) {
  const { c } = useTheme();
  const [hide, setHide] = React.useState(false);
  const total = ASSETS.reduce((s, a) => s + a.ngn, 0);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Screen padding={0}>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar />
            <GreetingBlock size={16} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <IconBtn onClick={() => onNav?.('scan')}><Icon.Scan size={18} /></IconBtn>
            <IconBtn onClick={() => onNav?.('notifications')}>
              <div style={{ position: 'relative' }}>
                <Icon.Bell size={18} />
                <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: c.danger, border: `1.5px solid ${c.surface}` }} />
              </div>
            </IconBtn>
          </div>
        </div>

        {/* HERO balance card */}
        <div style={{ padding: '4px 20px 16px' }}>
          <div style={{ background: c.lightGreen, border: `2.5px solid ${c.customBlack}`, borderRadius: 28, padding: 22, position: 'relative', overflow: 'hidden', boxShadow: '0 6px 0 0 rgba(33,36,29,0.95)' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: c.paleGreen, opacity: 0.5 }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.customBlack, letterSpacing: 1 }}>TOTAL BALANCE · NGN</div>
                <button onClick={() => setHide(!hide)} style={{ background: 'rgba(33,36,29,0.08)', border: 'none', borderRadius: 99, padding: 6, cursor: 'pointer', display: 'flex' }}>
                  {hide ? <Icon.EyeOff size={14} /> : <Icon.Eye size={14} />}
                </button>
              </div>
              <Num size={42} weight={700} color={c.customBlack} style={{ marginTop: 10, letterSpacing: -1.4, display: 'block', fontFamily: FONTS.display }}>
                {hide ? '₦••••••••' : FMT_NGN(total)}
              </Num>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontFamily: FONTS.body, fontSize: 13, color: c.customBlack }}>
                <Icon.TrendingUp size={14} strokeWidth={2.5} />
                <span style={{ fontWeight: 700 }}>+₦4,250</span> <span style={{ opacity: 0.7 }}>(+0.2%) today</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                <button onClick={() => onNav?.('buy')} style={{ flex: 1, height: 44, borderRadius: 14, background: c.customBlack, color: c.lightGreen, border: 'none', fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}>
                  <Icon.Plus size={16} strokeWidth={2.5} /> Buy
                </button>
                <button onClick={() => onNav?.('sell')} style={{ flex: 1, height: 44, borderRadius: 14, background: 'rgba(33,36,29,0.1)', color: c.customBlack, border: `1.5px solid ${c.customBlack}`, fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Sell</button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ padding: '0 20px', display: 'flex', gap: 8 }}>
          <QuickAction icon={Icon.Send} label="Send" onClick={() => onNav?.('send')} />
          <QuickAction icon={Icon.Download} label="Receive" tint={c.surfaceWarm} onClick={() => onNav?.('receive')} />
          <QuickAction icon={Icon.ArrowUpDown} label="Swap" tint={c.surfaceMuted} onClick={() => onNav?.('swap')} />
          <QuickAction icon={Icon.Wallet} label="Withdraw" tint={c.paleGreen} onClick={() => onNav?.('withdraw')} />
        </div>

        {/* Live rate ribbon */}
        <div style={{ margin: '20px 20px 12px', padding: 16, borderRadius: 18, background: c.surface, border: `1.5px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: c.surfaceWarm, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.customBlack }}>₮</span>
            <div style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, borderRadius: '50%', background: c.darkGreen, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, color: c.darkGreen, letterSpacing: 0.6 }}>LIVE · USDT/NGN</div>
            <Num size={17} weight={700} color={c.text}>₦1,614.50</Num>
          </div>
          <Sparkline data={RATE_SERIES.slice(-30).map((p) => p.c)} width={80} height={32} color={c.darkGreen} />
        </div>

        {/* Assets */}
        <div style={{ padding: '4px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>Your assets</div>
          <a onClick={() => onNav?.('assets')} style={{ fontFamily: FONTS.body, fontSize: 12, color: c.darkGreen, fontWeight: 600, cursor: 'pointer' }}>See all →</a>
        </div>
        <div style={{ padding: '0 20px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ASSETS.slice(0, 3).map((a) => (
            <button key={a.symbol} onClick={() => onNav?.('asset', a)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, background: c.surface, border: `1px solid ${c.border}`, cursor: 'pointer', width: '100%', textAlign: 'left' }}>
              <AssetGlyph symbol={a.symbol} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{a.name}</div>
                <div style={{ fontFamily: FONTS.numeric, fontSize: 12, color: c.textMuted, marginTop: 1 }}>{Number(a.balance).toLocaleString('en-NG', { maximumFractionDigits: 4 })} {a.symbol}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Num size={14} weight={700} color={c.text}>{FMT_NGN(a.ngn)}</Num>
                <div style={{ fontFamily: FONTS.numeric, fontSize: 11, color: a.change >= 0 ? c.darkGreen : c.danger, marginTop: 1, fontWeight: 600 }}>
                  {a.change >= 0 ? '↑' : '↓'} {Math.abs(a.change * 100).toFixed(2)}%
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <div style={{ padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>Recent activity</div>
          <a onClick={() => onNav?.('history')} style={{ fontFamily: FONTS.body, fontSize: 12, color: c.darkGreen, fontWeight: 600, cursor: 'pointer' }}>See all →</a>
        </div>
        <div style={{ padding: '0 20px 100px' }}>
          {TX_HISTORY.slice(0, 4).map((t) => <TxRow key={t.id} tx={t} onClick={() => onNav?.('tx', t)} />)}
        </div>
      </Screen>
      <BottomNav active="home" onChange={onNav} />
    </div>
  );
}

// ─── Variation B — SOFT PREMIUM ───────────────────────────
function DashboardB({ onNav }) {
  const { c } = useTheme();
  const [hide, setHide] = React.useState(false);
  const total = ASSETS.reduce((s, a) => s + a.ngn, 0);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Screen padding={0}>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ClusteerLogo size={26} showWordmark />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconBtn><Icon.Search size={18} /></IconBtn>
            <IconBtn onClick={() => onNav?.('notifications')}>
              <div style={{ position: 'relative' }}>
                <Icon.Bell size={18} />
                <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: c.danger, border: `1.5px solid ${c.surface}` }} />
              </div>
            </IconBtn>
            <Avatar size={32} />
          </div>
        </div>

        {/* Soft hero — beige background, large typography */}
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, fontWeight: 600, letterSpacing: 0.6 }}>PORTFOLIO VALUE · NGN</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <Num size={40} weight={700} color={c.text} style={{ fontFamily: FONTS.display, letterSpacing: -1.2 }}>
              {hide ? '••••••••' : FMT_NGN(total)}
            </Num>
            <button onClick={() => setHide(!hide)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, display: 'flex' }}>
              {hide ? <Icon.EyeOff size={18} /> : <Icon.Eye size={18} />}
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Badge kind="success" dot>+₦4,250 · 24h</Badge>
            <span style={{ fontFamily: FONTS.numeric, fontSize: 12, color: c.textMuted }}>· {FMT_USDT(total / 1614.5)}</span>
          </div>
        </div>

        {/* Action grid */}
        <div style={{ padding: '20px 20px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <QuickAction icon={Icon.Plus} label="Buy" tint={c.lightGreen} onClick={() => onNav?.('buy')} />
          <QuickAction icon={Icon.Minus} label="Sell" tint={c.surfaceWarm} onClick={() => onNav?.('sell')} />
          <QuickAction icon={Icon.Send} label="Send" tint={c.paleGreen} onClick={() => onNav?.('send')} />
          <QuickAction icon={Icon.Download} label="Receive" tint={c.surfaceMuted} onClick={() => onNav?.('receive')} />
        </div>

        {/* Rate card */}
        <Card variant="warm" padding={16} style={{ margin: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, color: c.darkGreen, letterSpacing: 0.6 }}>LIVE RATE · USDT/NGN</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <Num size={22} weight={700} color={c.text}>₦1,614.50</Num>
                <span style={{ fontFamily: FONTS.numeric, fontSize: 11, color: c.darkGreen, fontWeight: 700 }}>↑ 0.4%</span>
              </div>
              <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, marginTop: 2 }}>Updated 12 sec ago</div>
            </div>
            <div style={{ flex: 1 }} />
            <Sparkline data={RATE_SERIES.slice(-30).map(p => p.c)} width={90} height={36} color={c.darkGreen} />
          </div>
        </Card>

        {/* Assets table */}
        <div style={{ padding: '24px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: c.text }}>Holdings</div>
          <Tabs items={['All', 'Stable', 'Crypto']} active="All" variant="pill" onChange={() => {}} />
        </div>
        <div style={{ padding: '0 20px' }}>
          {ASSETS.map((a, i) => (
            <button key={a.symbol} onClick={() => onNav?.('asset', a)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', borderTop: i === 0 ? 'none' : `1px solid ${c.border}` }}>
              <AssetGlyph symbol={a.symbol} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 600, color: c.text }}>{a.symbol}</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 1 }}>{a.name}</div>
              </div>
              <Sparkline data={RATE_SERIES.slice(-20).map(p => p.c)} width={50} height={22} color={a.change >= 0 ? c.darkGreen : c.danger} />
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <Num size={13.5} weight={700} color={c.text}>{FMT_NGN(a.ngn)}</Num>
                <div style={{ fontFamily: FONTS.numeric, fontSize: 11, color: a.change >= 0 ? c.darkGreen : c.danger, fontWeight: 600, marginTop: 1 }}>
                  {a.change >= 0 ? '+' : ''}{(a.change * 100).toFixed(2)}%
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding: '20px 20px 100px' }}>
          <Card variant="surface" bordered padding={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Icon.Shield size={16} color={c.darkGreen} />
              <span style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text }}>Tier 1 — verified</span>
              <div style={{ marginLeft: 'auto', fontFamily: FONTS.numeric, fontSize: 11, color: c.textMuted }}>₦2.07M / ₦10M today</div>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: c.surfaceMuted, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '21%', background: c.darkGreen, borderRadius: 99 }} />
            </div>
            <div style={{ marginTop: 10, fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, lineHeight: 1.4 }}>
              Need a higher limit? <a style={{ color: c.darkGreen, fontWeight: 700, cursor: 'pointer' }}>Upgrade to Tier 2 →</a>
            </div>
          </Card>
        </div>
      </Screen>
      <BottomNav active="home" onChange={onNav} />
    </div>
  );
}

// ─── Variation C — DARK COMMAND CENTER ────────────────────
function DashboardC({ onNav }) {
  const { c, mode } = useTheme();
  const [hide, setHide] = React.useState(false);
  const total = ASSETS.reduce((s, a) => s + a.ngn, 0);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: c.bg }}>
      <Screen padding={0}>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar size={36} />
            <GreetingBlock size={15} />
          </div>
          <IconBtn onClick={() => onNav?.('notifications')}>
            <div style={{ position: 'relative' }}>
              <Icon.Bell size={18} />
              <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, borderRadius: '50%', background: c.danger, border: `1.5px solid ${c.surface}` }} />
            </div>
          </IconBtn>
        </div>

        {/* Dark hero card with chart */}
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ background: c.customBlack, borderRadius: 24, padding: '20px 20px 4px', position: 'relative', overflow: 'hidden', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: FONTS.body, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 0.6 }}>TOTAL BALANCE</div>
                <Num size={32} weight={700} color="#fff" style={{ marginTop: 4, fontFamily: FONTS.display, letterSpacing: -1, display: 'block' }}>
                  {hide ? '₦••••••' : FMT_NGN(total)}
                </Num>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <span style={{ fontFamily: FONTS.numeric, fontSize: 12, color: c.lightGreen, fontWeight: 700, background: 'rgba(159,232,112,0.18)', padding: '2px 7px', borderRadius: 99 }}>+0.21%</span>
                  <span style={{ fontFamily: FONTS.body, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>+₦4,250 · today</span>
                </div>
              </div>
              <button onClick={() => setHide(!hide)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 99, width: 36, height: 36, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {hide ? <Icon.EyeOff size={16} color="#fff" /> : <Icon.Eye size={16} color="#fff" />}
              </button>
            </div>
            {/* mini area chart at bottom */}
            <div style={{ marginTop: 14, marginLeft: -20, marginRight: -20 }}>
              <Sparkline data={RATE_SERIES.map(p => p.c)} width={350} height={70} color={c.lightGreen} />
            </div>
          </div>
        </div>

        {/* 4-up actions, dark style */}
        <div style={{ padding: '14px 20px 0', display: 'flex', gap: 8 }}>
          <QuickAction icon={Icon.Plus} label="Buy" tint={c.lightGreen} onClick={() => onNav?.('buy')} />
          <QuickAction icon={Icon.Minus} label="Sell" tint={c.surfaceWarm} onClick={() => onNav?.('sell')} />
          <QuickAction icon={Icon.Send} label="Send" tint={c.paleGreen} onClick={() => onNav?.('send')} />
          <QuickAction icon={Icon.QrCode} label="Receive" tint={c.surfaceMuted} onClick={() => onNav?.('receive')} />
        </div>

        {/* Live ticker — auto-scrolling */}
        <div style={{ marginTop: 22, padding: '8px 0', borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`, overflow: 'hidden', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 28, animation: 'tickerScroll 24s linear infinite', fontFamily: FONTS.numeric, fontSize: 12, color: c.textMuted, whiteSpace: 'nowrap', paddingLeft: 20 }}>
            {[...Array(2)].flatMap((_, k) => [
              { l: 'USDT/NGN', v: '₦1,614.50', d: '+0.4%', up: true },
              { l: 'BTC/NGN', v: '₦132.1M', d: '+1.8%', up: true },
              { l: 'ETH/NGN', v: '₦4.54M', d: '-0.6%', up: false },
              { l: 'USDC/NGN', v: '₦1,613.40', d: '+0.3%', up: true },
              { l: 'BNB/NGN', v: '₦1.12M', d: '+0.9%', up: true },
            ].map((t, i) => (
              <span key={`${k}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <strong style={{ color: c.text, fontFamily: FONTS.body }}>{t.l}</strong>
                <span style={{ color: c.text }}>{t.v}</span>
                <span style={{ color: t.up ? c.darkGreen : c.danger, fontWeight: 700 }}>{t.d}</span>
              </span>
            )))}
          </div>
        </div>

        {/* Compact assets */}
        <div style={{ padding: '16px 20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.text, textTransform: 'uppercase', letterSpacing: 0.6 }}>Holdings <span style={{ color: c.textSubtle }}>· {ASSETS.length}</span></div>
          <a onClick={() => onNav?.('assets')} style={{ fontFamily: FONTS.body, fontSize: 12, color: c.darkGreen, fontWeight: 600, cursor: 'pointer' }}>Manage →</a>
        </div>
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {ASSETS.slice(0, 4).map((a) => (
            <button key={a.symbol} onClick={() => onNav?.('asset', a)} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 12, borderRadius: 14, background: c.surface, border: `1px solid ${c.border}`, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AssetGlyph symbol={a.symbol} size={26} />
                <span style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.text }}>{a.symbol}</span>
                <span style={{ marginLeft: 'auto', fontFamily: FONTS.numeric, fontSize: 11, color: a.change >= 0 ? c.darkGreen : c.danger, fontWeight: 700 }}>{a.change >= 0 ? '+' : ''}{(a.change * 100).toFixed(2)}%</span>
              </div>
              <Num size={15} weight={700} color={c.text}>{FMT_NGN(a.ngn)}</Num>
              <div style={{ fontFamily: FONTS.numeric, fontSize: 11, color: c.textMuted }}>{Number(a.balance).toLocaleString('en-NG', { maximumFractionDigits: 4 })} {a.symbol}</div>
            </button>
          ))}
        </div>

        {/* Activity preview */}
        <div style={{ padding: '20px 20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.text, textTransform: 'uppercase', letterSpacing: 0.6 }}>Activity</div>
          <a onClick={() => onNav?.('history')} style={{ fontFamily: FONTS.body, fontSize: 12, color: c.darkGreen, fontWeight: 600, cursor: 'pointer' }}>All →</a>
        </div>
        <div style={{ padding: '0 20px 100px' }}>
          {TX_HISTORY.slice(0, 3).map((t) => <TxRow key={t.id} tx={t} onClick={() => onNav?.('tx', t)} />)}
        </div>
      </Screen>
      <BottomNav active="home" onChange={onNav} />
    </div>
  );
}

// Asset glyph — reuses brand colors
function AssetGlyph({ symbol, size = 36 }) {
  const map = {
    USDT: { bg: '#26A17B', label: '₮', color: '#fff' },
    USDC: { bg: '#2775CA', label: '$', color: '#fff' },
    BTC: { bg: '#F7931A', label: '₿', color: '#fff' },
    ETH: { bg: '#627EEA', label: 'Ξ', color: '#fff' },
    BNB: { bg: '#F0B90B', label: 'B', color: '#fff' },
    NGN: { bg: '#1F7A3A', label: '₦', color: '#fff' },
  };
  const cfg = map[symbol] || map.USDT;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: size * 0.5, color: cfg.color }}>
      {cfg.label}
    </div>
  );
}

Object.assign(window, { DashboardA, DashboardB, DashboardC, AssetGlyph, GreetingBlock, Avatar, QuickAction, TxRow });
