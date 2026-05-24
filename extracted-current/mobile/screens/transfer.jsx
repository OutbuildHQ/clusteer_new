// Auto-injected: pull cross-script globals into local scope
const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;
const { Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn, BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav, TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch } = window;
const { ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT, RATE_USDT_NGN, FEE_PCT, RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD } = window;
const { ClusteerChart, CandleChart, RangeTabs, Donut } = window;

// Clusteer Mobile — Transfer flows (Send / Receive / Withdraw / QR / TxDetail)

// ─── RECEIVE — QR + Address ───────────────────────────────
function ReceiveScreen({ onBack }) {
  const { c } = useTheme();
  const [asset, setAsset] = React.useState('USDT');
  const [network, setNetwork] = React.useState('TRC20');
  const networks = { USDT: ['TRC20', 'ERC20', 'BEP20'], USDC: ['ERC20', 'SOL'] };
  const addr = 'TYz8Mh3pqgDdQc5QqVzHmgK4kQ4LQX8kQ4';
  const [copied, setCopied] = React.useState(false);
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Receive" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn><Icon.Send size={18} /></IconBtn>} />
      <Screen padding={20}>
        {/* Asset selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {['USDT', 'USDC'].map((a) => (
            <button key={a} onClick={() => { setAsset(a); setNetwork(networks[a][0]); }}
              style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: asset === a ? c.customBlack : c.surface, border: `1.5px solid ${asset === a ? c.customBlack : c.border}`, fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: asset === a ? c.lightGreen : c.text, cursor: 'pointer' }}>
              {a}
            </button>
          ))}
        </div>

        {/* QR card */}
        <Card variant="warm" padding={20} style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: '#fff', padding: 16, borderRadius: 18, border: `2px solid ${c.customBlack}`, display: 'inline-block' }}>
            <FakeQR size={180} />
          </div>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <AssetGlyph symbol={asset} size={26} />
            <Num size={18} weight={700} color={c.text}>{asset} address</Num>
            <Pill style={{ marginLeft: 4 }}>{network}</Pill>
          </div>
        </Card>

        {/* Address */}
        <Card variant="surface" bordered padding={14} style={{ marginTop: 12 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, fontWeight: 600 }}>YOUR {asset} ADDRESS</div>
          <div style={{ fontFamily: FONTS.numeric, fontSize: 13, color: c.text, marginTop: 6, lineHeight: 1.5, wordBreak: 'break-all' }}>{addr}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <BtnSecondary leading={<Icon.Copy size={14} />} onClick={copy} full size="md">{copied ? 'Copied!' : 'Copy'}</BtnSecondary>
            <BtnSecondary leading={<Icon.Send size={14} />} full size="md">Share</BtnSecondary>
          </div>
        </Card>

        {/* Network warning */}
        <Card variant="muted" padding={14} style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <Icon.AlertTriangle size={18} color={c.warning} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.text }}>Send only {asset} on {network}</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 2, lineHeight: 1.4 }}>Sending other tokens or using a different network will result in permanent loss.</div>
          </div>
        </Card>

        {/* Network options */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 8 }}>NETWORK</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {networks[asset].map((n) => (
              <Pill key={n} active={network === n} onClick={() => setNetwork(n)}>{n}</Pill>
            ))}
          </div>
        </div>
      </Screen>
    </div>
  );
}

function FakeQR({ size = 180 }) {
  // Generate a deterministic QR-like pattern using hashing
  const grid = 25;
  const cells = [];
  let s = 7;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let r = 0; r < grid; r++) {
    for (let col = 0; col < grid; col++) {
      // skip corner finder positions
      const inFinder = (r < 7 && col < 7) || (r < 7 && col > grid - 8) || (r > grid - 8 && col < 7);
      if (inFinder) continue;
      if (rnd() > 0.55) cells.push({ r, c: col });
    }
  }
  const cs = size / grid;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* finder squares */}
      {[[0, 0], [grid - 7, 0], [0, grid - 7]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x * cs} y={y * cs} width={cs * 7} height={cs * 7} fill="#21241D" />
          <rect x={(x + 1) * cs} y={(y + 1) * cs} width={cs * 5} height={cs * 5} fill="#fff" />
          <rect x={(x + 2) * cs} y={(y + 2) * cs} width={cs * 3} height={cs * 3} fill="#21241D" />
        </g>
      ))}
      {cells.map((cell, i) => <rect key={i} x={cell.c * cs} y={cell.r * cs} width={cs} height={cs} fill="#21241D" />)}
      {/* Logo center */}
      <rect x={size / 2 - 22} y={size / 2 - 22} width="44" height="44" rx="10" fill="#9FE870" stroke="#21241D" strokeWidth="2" />
      <text x={size / 2} y={size / 2 + 6} textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="20" fontWeight="700" fill="#21241D">C</text>
    </svg>
  );
}

// ─── SEND — pick recipient + amount + confirm ────────────
function SendRecipient({ onNext, onBack, onScan }) {
  const { c } = useTheme();
  const [tab, setTab] = React.useState('Wallet');
  const recents = [
    { name: 'Tola K.', addr: 'TYz8Mh3p…8kQ4', avatar: 'TK' },
    { name: 'Chioma U.', addr: '0xa8B1…9c2D', avatar: 'CU' },
    { name: 'David O.', addr: 'bnb1q…lkj3', avatar: 'DO' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Send" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn onClick={onScan}><Icon.Scan size={18} /></IconBtn>} />
      <Screen padding={20}>
        <Tabs items={['Wallet', 'Bank', 'Clusteer user']} active={tab} onChange={setTab} variant="underline" />

        <div style={{ marginTop: 18 }}>
          <TextField label="Address or @username" placeholder="0x… or paste address" leading={<Icon.Search size={18} />} trailing={<button onClick={onScan} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icon.Scan size={18} color={c.darkGreen} /></button>} />
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 8 }}>RECENT</div>
          <Card variant="surface" bordered padding={4}>
            {recents.map((r, i) => (
              <Row key={i}
                leading={<div style={{ width: 38, height: 38, borderRadius: '50%', background: c.surfaceWarm, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.text }}>{r.avatar}</div>}
                title={r.name}
                subtitle={r.addr}
                trailing={<Icon.ChevronRight size={16} color={c.textMuted} />}
                onClick={onNext}
                divider={i < recents.length - 1}
              />
            ))}
          </Card>
        </div>

        <div style={{ marginTop: 22 }}>
          <Card variant="warm" padding={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: c.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon.Users size={18} color={c.darkGreen} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, color: c.text }}>Send to a Clusteer user</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 2 }}>Free, instant, no network fees</div>
              </div>
              <Icon.ChevronRight size={16} color={c.textMuted} />
            </div>
          </Card>
        </div>
      </Screen>
    </div>
  );
}

function SendAmount({ onNext, onBack }) {
  const { c } = useTheme();
  const [usdt, setUsdt] = React.useState(50);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Send USDT" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} subtitle="To Tola K. · TYz8Mh3p…8kQ4" />
      <Screen padding={20}>
        <FieldBlock label="Amount" value={usdt} onChange={setUsdt} unit="USDT" symbol="₮" active subtitle={`≈ ${FMT_NGN(usdt * RATE_USDT_NGN)}`} />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {['25%', '50%', '75%', 'Max'].map((v) => (
            <button key={v} onClick={() => setUsdt(v === 'Max' ? 1284.42 : 1284.42 * (parseInt(v) / 100))} style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: c.surface, border: `1.5px solid ${c.border}`, fontFamily: FONTS.body, fontSize: 12.5, fontWeight: 700, color: c.text, cursor: 'pointer' }}>{v}</button>
          ))}
        </div>

        <Card variant="muted" padding={14} style={{ marginTop: 22 }}>
          <SumRow label="Network" value="TRON (TRC20)" />
          <SumRow label="Network fee" value="1.0 USDT" />
          <SumRow label="Speed" value="< 1 minute" valColor={c.darkGreen} />
        </Card>

        <TextField label="Note (optional)" placeholder="e.g. Rent for August" style={{ marginTop: 14 }} />
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onNext}>Review</BtnPrimary>
      </div>
    </div>
  );
}

// ─── QR Scanner ─────────────────────────────────────────
function QrScanner({ onClose, onResult }) {
  const { c } = useTheme();
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <IconBtn bg="rgba(255,255,255,0.15)" onClick={onClose}><Icon.X size={18} color="#fff" /></IconBtn>
        <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 600 }}>Scan QR code</span>
        <IconBtn bg="rgba(255,255,255,0.15)"><Icon.Image size={18} color="#fff" /></IconBtn>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* dim overlay with cutout */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 130px, rgba(0,0,0,0.7) 200px)' }} />
        <div style={{ width: 240, height: 240, position: 'relative' }}>
          {/* corners */}
          {[
            { top: 0, left: 0, borderTop: `4px solid ${c.lightGreen}`, borderLeft: `4px solid ${c.lightGreen}` },
            { top: 0, right: 0, borderTop: `4px solid ${c.lightGreen}`, borderRight: `4px solid ${c.lightGreen}` },
            { bottom: 0, left: 0, borderBottom: `4px solid ${c.lightGreen}`, borderLeft: `4px solid ${c.lightGreen}` },
            { bottom: 0, right: 0, borderBottom: `4px solid ${c.lightGreen}`, borderRight: `4px solid ${c.lightGreen}` },
          ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 30, height: 30, borderTopLeftRadius: i === 0 ? 12 : 0, borderTopRightRadius: i === 1 ? 12 : 0, borderBottomLeftRadius: i === 2 ? 12 : 0, borderBottomRightRadius: i === 3 ? 12 : 0, ...s }} />)}
          {/* scan line */}
          <div style={{ position: 'absolute', left: 8, right: 8, top: '50%', height: 2, background: c.lightGreen, boxShadow: `0 0 14px ${c.lightGreen}`, animation: 'scanline 2.4s ease-in-out infinite' }} />
        </div>
      </div>
      <div style={{ padding: '20px 20px 30px', textAlign: 'center', fontFamily: FONTS.body, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
        Align QR code within the frame to scan automatically
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 10 }}>
          <button onClick={onResult} style={{ padding: '10px 18px', borderRadius: 99, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Paste address instead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── BANK WITHDRAW ──────────────────────────────────────
function WithdrawScreen({ onNext, onBack }) {
  const { c } = useTheme();
  const [ngn, setNgn] = React.useState(100000);
  const fee = 50;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Withdraw to bank" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <Card variant="muted" padding={14} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Icon.Wallet size={16} color={c.darkGreen} />
          <span style={{ fontFamily: FONTS.body, fontSize: 13, color: c.text }}>Available NGN balance</span>
          <Num size={14} weight={700} color={c.text} style={{ marginLeft: 'auto' }}>₦4,210,500</Num>
        </Card>

        <FieldBlock label="Amount" value={ngn} onChange={setNgn} unit="NGN" symbol="₦" active subtitle="Min ₦1,000 · Max ₦5,000,000 / day" />

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {[50000, 100000, 250000, 'Max'].map((v) => (
            <button key={v} onClick={() => setNgn(v === 'Max' ? 4210500 : v)} style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: c.surface, border: `1.5px solid ${c.border}`, fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, cursor: 'pointer' }}>{v === 'Max' ? 'Max' : '₦' + (v / 1000) + 'k'}</button>
          ))}
        </div>

        <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginTop: 22, marginBottom: 8 }}>SEND TO BANK</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BANKS.map((b, i) => (
            <Card key={b.id} variant="surface" bordered padding={14} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderColor: i === 0 ? c.customBlack : c.border, borderWidth: i === 0 ? 2 : 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: i === 0 ? '#FF6B35' : i === 1 ? '#40196D' : '#0066AA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: FONTS.body, fontWeight: 700, fontSize: 11 }}>{b.logo.slice(0, 3)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{b.name} ·· {b.acct.slice(-4)}</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 1 }}>{b.acctName}</div>
              </div>
              {i === 0 && <Badge kind="lime">Default</Badge>}
            </Card>
          ))}
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 14, background: 'transparent', border: `1.5px dashed ${c.border}`, fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: c.darkGreen, cursor: 'pointer' }}>
            <Icon.Plus size={16} /> Add another bank
          </button>
        </div>

        <Card variant="warm" padding={14} style={{ marginTop: 18 }}>
          <SumRow label="Amount" value={FMT_NGN(ngn)} />
          <SumRow label="Transfer fee" value={FMT_NGN(fee)} />
          <SumRow label="Speed" value="< 5 min" valColor={c.darkGreen} />
          <div style={{ height: 1, background: c.border, margin: '8px 0' }} />
          <SumRow label="You'll receive" value={FMT_NGN(ngn - fee)} bold />
        </Card>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onNext}>Withdraw {FMT_NGN(ngn - fee)}</BtnPrimary>
      </div>
    </div>
  );
}

// ─── TX DETAIL ───────────────────────────────────────────
function TxDetail({ tx = TX_HISTORY[0], onBack }) {
  const { c } = useTheme();
  const positive = tx.kind === 'buy' || tx.kind === 'receive' || tx.kind === 'deposit';
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Transaction" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn><Icon.Send size={18} /></IconBtn>} />
      <Screen padding={20}>
        <div style={{ textAlign: 'center', padding: '12px 0 22px' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto', borderRadius: '50%', background: positive ? c.paleGreen : c.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {positive ? <Icon.ArrowDown size={28} color={c.darkGreen} strokeWidth={2.5} /> : <Icon.ArrowUp size={28} color={c.text} strokeWidth={2.5} />}
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, marginTop: 14, fontWeight: 600 }}>
            {tx.kind === 'buy' ? 'Bought USDT' : tx.kind === 'sell' ? 'Sold USDT' : tx.kind === 'send' ? 'Sent USDT' : tx.kind === 'receive' ? 'Received USDT' : 'Withdrew NGN'}
          </div>
          <Num size={32} weight={700} color={c.text} style={{ marginTop: 6, fontFamily: FONTS.display, letterSpacing: -0.6 }}>
            {positive ? '+' : '-'}{FMT_NGN(tx.ngn)}
          </Num>
          <div style={{ fontFamily: FONTS.numeric, fontSize: 13, color: c.textMuted, marginTop: 4 }}>{tx.amount} {tx.asset}</div>
          <div style={{ marginTop: 12 }}>
            <Badge kind="success" dot>Completed</Badge>
          </div>
        </div>

        <Card variant="surface" bordered padding={14}>
          <SumRow label="Order ID" value={tx.id} />
          <SumRow label="Date" value={tx.date} />
          <SumRow label="Method" value={tx.method} />
          <SumRow label="Counterparty" value={tx.counterparty} />
          <SumRow label="Rate" value="₦1,614.50 / USDT" />
          <SumRow label="Service fee" value={FMT_NGN(tx.ngn * FEE_PCT)} />
          <div style={{ height: 1, background: c.border, margin: '8px 0' }} />
          <SumRow label="Total" value={FMT_NGN(tx.ngn)} bold />
        </Card>

        {/* Tx hash for on-chain */}
        <Card variant="muted" padding={14} style={{ marginTop: 12 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, fontWeight: 600 }}>BLOCKCHAIN HASH</div>
          <div style={{ fontFamily: FONTS.numeric, fontSize: 12, color: c.text, marginTop: 4, wordBreak: 'break-all' }}>0x8a2f3c1b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <BtnSecondary size="md" leading={<Icon.Copy size={14} />}>Copy</BtnSecondary>
            <BtnSecondary size="md" leading={<Icon.ExternalLink size={14} />}>View on Tronscan</BtnSecondary>
          </div>
        </Card>

        <Card variant="surface" bordered padding={14} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <Icon.MessageCircle size={18} color={c.darkGreen} />
          <span style={{ flex: 1, fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: c.text }}>Need help with this transaction?</span>
          <Icon.ChevronRight size={16} color={c.textMuted} />
        </Card>
      </Screen>
      <div style={{ padding: 20, display: 'flex', gap: 8 }}>
        <BtnSecondary leading={<Icon.Repeat size={16} />}>Repeat</BtnSecondary>
        <BtnSecondary leading={<Icon.Send size={16} />}>Share receipt</BtnSecondary>
      </div>
    </div>
  );
}

// ─── HISTORY (full list) ─────────────────────────────────
function HistoryScreen({ onBack, onTx }) {
  const { c } = useTheme();
  const [tab, setTab] = React.useState('All');
  const filtered = TX_HISTORY.filter((t) => tab === 'All' ? true : tab === 'Buy' ? t.kind === 'buy' : tab === 'Sell' ? t.kind === 'sell' : tab === 'Sent' ? t.kind === 'send' : t.kind === 'receive');
  // group by day
  const groups = filtered.reduce((acc, t) => {
    const day = t.date.split(',')[0];
    (acc[day] = acc[day] || []).push(t);
    return acc;
  }, {});
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="History" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={
        <div style={{ display: 'flex', gap: 6 }}><IconBtn><Icon.Search size={18} /></IconBtn><IconBtn><Icon.Filter size={18} /></IconBtn></div>
      } />
      <div style={{ padding: '0 20px' }}>
        <Tabs items={['All', 'Buy', 'Sell', 'Sent', 'Received']} active={tab} onChange={setTab} variant="pill" />
      </div>
      <Screen padding={0}>
        {Object.entries(groups).map(([day, items]) => (
          <div key={day} style={{ padding: '16px 20px 8px' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, color: c.textMuted, letterSpacing: 0.6, marginBottom: 4 }}>{day.toUpperCase()}</div>
            {items.map((t) => <TxRow key={t.id} tx={t} onClick={() => onTx?.(t)} />)}
          </div>
        ))}
        {!Object.keys(groups).length && (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted }}>No transactions yet</div>
          </div>
        )}
      </Screen>
    </div>
  );
}

// ─── ASSET DETAIL ─────────────────────────────────────
function AssetDetail({ asset = ASSETS[0], onBack }) {
  const { c } = useTheme();
  const [range, setRange] = React.useState('1D');
  const series = RATE_SERIES;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title={asset.name} subtitle={asset.symbol + ' / NGN'} leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn><Icon.Star size={18} /></IconBtn>} />
      <Screen padding={0}>
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AssetGlyph symbol={asset.symbol} size={44} />
            <div>
              <Num size={26} weight={700} color={c.text} style={{ fontFamily: FONTS.display, letterSpacing: -0.5 }}>{FMT_NGN(asset.ngn / asset.balance)}</Num>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ fontFamily: FONTS.numeric, fontSize: 12, fontWeight: 700, color: asset.change >= 0 ? c.darkGreen : c.danger }}>{asset.change >= 0 ? '↑' : '↓'} {Math.abs(asset.change * 100).toFixed(2)}%</span>
                <span style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted }}>· today</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, marginLeft: -10, marginRight: -10 }}>
          <Sparkline data={series.map((p) => p.c)} width={420} height={130} color={asset.change >= 0 ? c.darkGreen : c.danger} />
        </div>
        <div style={{ padding: '8px 20px', display: 'flex', gap: 4, justifyContent: 'space-between' }}>
          {['1H', '1D', '1W', '1M', '3M', '1Y', 'ALL'].map((r) => (
            <button key={r} onClick={() => setRange(r)} style={{ flex: 1, padding: '8px 0', background: range === r ? c.customBlack : 'transparent', color: range === r ? c.lightGreen : c.text, border: 'none', borderRadius: 10, fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{r}</button>
          ))}
        </div>

        <div style={{ padding: '16px 20px 0' }}>
          <Card variant="warm" padding={16}>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.darkGreen, fontWeight: 700, letterSpacing: 0.6 }}>YOUR HOLDING</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
              <Num size={26} weight={700} color={c.text} style={{ fontFamily: FONTS.display, letterSpacing: -0.6 }}>{FMT_NGN(asset.ngn)}</Num>
              <Num size={14} weight={600} color={c.textMuted}>{Number(asset.balance).toLocaleString('en-NG', { maximumFractionDigits: 4 })} {asset.symbol}</Num>
            </div>
          </Card>
        </div>

        <div style={{ padding: '14px 20px 0', display: 'flex', gap: 8 }}>
          <BtnPrimary bold size="md">Buy</BtnPrimary>
          <BtnSecondary size="md">Sell</BtnSecondary>
          <BtnSecondary size="md" leading={<Icon.Send size={14} />}>Send</BtnSecondary>
        </div>

        <div style={{ padding: '24px 20px 8px' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 8 }}>STATS</div>
          <Card variant="muted" padding={14}>
            <SumRow label="24h volume" value={FMT_NGN(asset.symbol === 'USDT' ? 12_400_000_000 : 4_200_000_000)} />
            <SumRow label="Market cap" value={asset.symbol === 'USDT' ? '₦128 trillion' : '₦52 trillion'} />
            <SumRow label="Circulating" value={asset.symbol === 'USDT' ? '110.2B USDT' : '32.4B USDC'} />
            <SumRow label="Peg" value="1.00 USD ± 0.05%" />
          </Card>
        </div>

        <div style={{ padding: '20px 20px 100px' }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 8 }}>RECENT</div>
          {TX_HISTORY.filter((t) => t.asset === asset.symbol).slice(0, 4).map((t) => <TxRow key={t.id} tx={t} />)}
        </div>
      </Screen>
    </div>
  );
}

Object.assign(window, {
  ReceiveScreen, FakeQR, SendRecipient, SendAmount, QrScanner,
  WithdrawScreen, TxDetail, HistoryScreen, AssetDetail,
});
