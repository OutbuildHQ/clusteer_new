// Auto-injected: pull cross-script globals into local scope
const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;
const { Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn, BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav, TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch } = window;
const { ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT, RATE_USDT_NGN, FEE_PCT, RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD } = window;
const { ClusteerChart, CandleChart, RangeTabs, Donut } = window;

// Clusteer Mobile — Notifications, Settings, Security, Support, Edge states

// ─── NOTIFICATIONS ─────────────────────────────────────
function NotificationsScreen({ onBack, onTx }) {
  const { c } = useTheme();
  const [tab, setTab] = React.useState('All');
  const items = NOTIFICATIONS;
  const iconFor = (k) => ({ success: Icon.CheckCircle, price: Icon.TrendingUp, security: Icon.Shield, info: Icon.Bell, warning: Icon.AlertTriangle }[k] || Icon.Bell);
  const tintFor = (k) => ({ success: c.paleGreen, price: c.surfaceWarm, security: c.surfaceMuted, info: c.surface, warning: c.warningSoft }[k] || c.surface);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Notifications" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn><Icon.Settings size={18} /></IconBtn>} />
      <div style={{ padding: '0 20px' }}>
        <Tabs items={['All', 'Transactions', 'Security', 'Promotions']} active={tab} onChange={setTab} variant="pill" />
      </div>
      <Screen padding={0}>
        <div style={{ padding: '16px 20px 8px' }}>
          {items.map((n) => {
            const I = iconFor(n.kind);
            return (
              <button key={n.id} onClick={onTx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, marginBottom: 4, borderRadius: 14, background: n.unread ? c.surfaceWarm : c.surface, border: `1px solid ${c.border}`, cursor: 'pointer', width: '100%', textAlign: 'left', position: 'relative' }}>
                {n.unread && <div style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%', background: c.darkGreen }} />}
                <div style={{ width: 38, height: 38, borderRadius: 12, background: tintFor(n.kind), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I size={18} color={c.darkGreen} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{n.title}</div>
                  <div style={{ fontFamily: FONTS.body, fontSize: 12.5, color: c.textMuted, marginTop: 2, lineHeight: 1.4 }}>{n.body}</div>
                  <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textSubtle, marginTop: 4 }}>{n.time}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Screen>
    </div>
  );
}

// ─── PROFILE / SETTINGS ────────────────────────────────
function SettingsScreen({ onBack, onNav }) {
  const { c, mode, setMode } = useTheme();
  const sections = [
    { title: 'Account', items: [
      { icon: Icon.User, label: 'Personal info', sub: 'Name, email, phone', action: 'profile' },
      { icon: Icon.Shield, label: 'Verification', sub: 'Tier 1 · Verified', badge: <Badge kind="success" dot>Verified</Badge>, action: 'kyc' },
      { icon: Icon.CreditCard, label: 'Linked banks', sub: '2 banks', action: 'banks' },
      { icon: Icon.Wallet, label: 'External wallets', sub: 'Saved addresses', action: 'wallets' },
    ]},
    { title: 'Security', items: [
      { icon: Icon.Lock, label: 'Change password', action: 'password' },
      { icon: Icon.FaceId, label: 'Face ID / biometric', toggle: true, value: true },
      { icon: Icon.Shield, label: 'Two-factor authentication', sub: 'Authenticator app', action: '2fa' },
      { icon: Icon.Phone, label: 'Trusted devices', sub: '3 devices', action: 'devices' },
    ]},
    { title: 'Preferences', items: [
      { icon: Icon.Moon, label: 'Dark mode', toggle: true, value: mode === 'dark', onToggle: () => setMode(mode === 'dark' ? 'light' : 'dark') },
      { icon: Icon.Bell, label: 'Notifications', sub: 'Push, email, SMS', action: 'notifs' },
      { icon: Icon.Globe, label: 'Language', sub: 'English (UK)', action: 'lang' },
      { icon: Icon.Wallet, label: 'Default currency', sub: 'NGN', action: 'currency' },
    ]},
    { title: 'Support', items: [
      { icon: Icon.MessageCircle, label: 'Live chat', sub: 'Agents online · 24/7', action: 'support' },
      { icon: Icon.Book, label: 'Help center', action: 'help' },
      { icon: Icon.FileText, label: 'Terms & policies', action: 'legal' },
    ]},
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Settings" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={0}>
        {/* Profile card */}
        <div style={{ padding: '8px 20px 0' }}>
          <Card variant="warm" padding={16} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar size={56} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: c.text }}>Adaeze Nwosu</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12.5, color: c.textMuted, marginTop: 2 }}>adaeze@example.com</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                <Badge kind="success" dot>Tier 1</Badge>
                <Badge kind="lime">Pro trader</Badge>
              </div>
            </div>
            <IconBtn onClick={() => onNav?.('profile')}><Icon.ChevronRight size={18} /></IconBtn>
          </Card>
        </div>

        {sections.map((sec) => (
          <div key={sec.title} style={{ padding: '20px 20px 0' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 11, fontWeight: 700, color: c.textMuted, letterSpacing: 0.6, marginBottom: 8 }}>{sec.title.toUpperCase()}</div>
            <Card variant="surface" bordered padding={4}>
              {sec.items.map((it, i) => (
                <Row key={it.label}
                  leading={<div style={{ width: 36, height: 36, borderRadius: 10, background: c.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><it.icon size={16} color={c.text} /></div>}
                  title={it.label}
                  subtitle={it.sub}
                  trailing={it.toggle ? <Switch value={it.value} onChange={it.onToggle} /> : it.badge || <Icon.ChevronRight size={16} color={c.textMuted} />}
                  divider={i < sec.items.length - 1}
                  onClick={() => it.action && onNav?.(it.action)}
                />
              ))}
            </Card>
          </div>
        ))}

        <div style={{ padding: '24px 20px 100px' }}>
          <BtnSecondary leading={<Icon.LogOut size={16} />}>Sign out</BtnSecondary>
          <div style={{ textAlign: 'center', fontFamily: FONTS.body, fontSize: 11, color: c.textSubtle, marginTop: 18 }}>Clusteer · v3.2.0 · Build 2401</div>
        </div>
      </Screen>
    </div>
  );
}

// ─── 2FA setup ─────────────────────────────────────────
function TwoFactorSetup({ onDone, onBack }) {
  const { c } = useTheme();
  const [step, setStep] = React.useState(0);
  if (step === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AppBar title="Two-factor auth" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
        <Screen padding={20}>
          <div style={{ width: 60, height: 60, borderRadius: 16, background: c.lightGreen, border: `2px solid ${c.customBlack}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Shield size={28} color={c.customBlack} />
          </div>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, marginTop: 18, letterSpacing: -0.5 }}>Add an extra layer</h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 6, lineHeight: 1.4 }}>
            Pick how you'd like to verify when signing in or sending money.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
            {[
              { id: 'auth', name: 'Authenticator app', sub: 'Google Authenticator, Authy, 1Password', recommended: true },
              { id: 'sms', name: 'SMS code', sub: 'Text to +234 801 ··· 5678' },
              { id: 'email', name: 'Email code', sub: 'adaeze@example.com' },
            ].map((m, i) => (
              <Card key={m.id} variant="surface" bordered padding={14} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderColor: i === 0 ? c.customBlack : c.border, borderWidth: i === 0 ? 2 : 1 }} onClick={() => setStep(1)}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${i === 0 ? c.customBlack : c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i === 0 && <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.lightGreen }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{m.name}</span>
                    {m.recommended && <Badge kind="lime">Recommended</Badge>}
                  </div>
                  <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 2 }}>{m.sub}</div>
                </div>
              </Card>
            ))}
          </div>
        </Screen>
        <div style={{ padding: 20 }}>
          <BtnPrimary bold onClick={() => setStep(1)}>Continue</BtnPrimary>
        </div>
      </div>
    );
  }
  // Step 1 — show QR + setup key
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Scan with your app" leading={<IconBtn onClick={() => setStep(0)}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, lineHeight: 1.4 }}>Open your authenticator app and scan this QR code, or paste the key manually.</p>
        <Card variant="warm" padding={20} style={{ alignItems: 'center', marginTop: 18 }}>
          <div style={{ background: '#fff', padding: 14, borderRadius: 18, border: `2px solid ${c.customBlack}` }}>
            <FakeQR size={170} />
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, fontWeight: 600, marginTop: 14 }}>SETUP KEY</div>
          <div style={{ fontFamily: FONTS.numeric, fontSize: 14, color: c.text, marginTop: 4, letterSpacing: 0.5 }}>JBSWY3DPEHPK3PXP</div>
          <BtnSecondary size="md" leading={<Icon.Copy size={14} />} style={{ marginTop: 10 }}>Copy key</BtnSecondary>
        </Card>
        <div style={{ marginTop: 22 }}>
          <TextField label="Verify code" placeholder="6-digit code from app" leading={<Icon.Shield size={18} />} large />
        </div>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onDone}>Verify &amp; enable</BtnPrimary>
      </div>
    </div>
  );
}

// ─── PROFILE EDIT ─────────────────────────────────────
function ProfileEdit({ onBack, onSave }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Personal info" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<BtnGhost color={c.darkGreen} onClick={onSave}>Save</BtnGhost>} />
      <Screen padding={20}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '12px 0 22px' }}>
          <div style={{ position: 'relative' }}>
            <Avatar size={84} />
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: c.customBlack, border: `2px solid ${c.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon.Camera size={14} color={c.lightGreen} />
            </button>
          </div>
          <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.darkGreen, fontWeight: 700, cursor: 'pointer' }}>Change photo</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <TextField label="Full name" value="Adaeze Chioma Nwosu" />
          <TextField label="Username" value="@adaeze" />
          <TextField label="Email" value="adaeze@example.com" trailing={<Badge kind="success" dot>Verified</Badge>} />
          <TextField label="Phone" value="+234 801 234 5678" trailing={<Badge kind="success" dot>Verified</Badge>} />
          <TextField label="Country" value="Nigeria" />
        </div>
      </Screen>
    </div>
  );
}

// ─── SUPPORT — Help center + chat ─────────────────────
function HelpCenter({ onBack, onChat }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Help" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <Card variant="warm" padding={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: c.lightGreen, border: `2px solid ${c.customBlack}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.MessageCircle size={22} color={c.customBlack} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: c.text }}>Live chat support</div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 2 }}>Agents online now · avg 2 min reply</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <BtnPrimary bold onClick={onChat}>Start a chat</BtnPrimary>
          </div>
        </Card>

        <div style={{ marginTop: 22 }}>
          <TextField placeholder="Search help…" leading={<Icon.Search size={18} />} />
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.textMuted, letterSpacing: 0.6, marginBottom: 10 }}>FAQs</div>
          <Card variant="surface" bordered padding={4}>
            {FAQ_TOPICS.map((f, i) => (
              <Row key={f.id}
                leading={<div style={{ width: 36, height: 36, borderRadius: 10, background: c.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.HelpCircle size={16} /></div>}
                title={f.title}
                subtitle={f.body}
                trailing={<Icon.ChevronRight size={16} color={c.textMuted} />}
                divider={i < FAQ_TOPICS.length - 1}
              />
            ))}
          </Card>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.textMuted, letterSpacing: 0.6, marginBottom: 10 }}>OTHER WAYS TO REACH US</div>
          <Card variant="surface" bordered padding={4}>
            <Row leading={<Icon.Mail size={16} />} title="hello@clusteer.io" subtitle="Email us · within 1 hr" trailing={<Icon.ExternalLink size={14} color={c.textMuted} />} divider />
            <Row leading={<Icon.Phone size={16} />} title="+234 1 700 1234" subtitle="Mon–Fri · 9–6 WAT" trailing={<Icon.ExternalLink size={14} color={c.textMuted} />} divider />
            <Row leading={<Icon.MessageCircle size={16} />} title="@clusteerhq" subtitle="X / Telegram" trailing={<Icon.ExternalLink size={14} color={c.textMuted} />} />
          </Card>
        </div>
      </Screen>
    </div>
  );
}

function SupportChat({ onBack }) {
  const { c } = useTheme();
  const [text, setText] = React.useState('');
  const msgs = SUPPORT_CHAT;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Bisi · Support" subtitle="● Online" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} trailing={<IconBtn><Icon.Phone size={18} /></IconBtn>} />
      <Screen padding={16} style={{ paddingBottom: 80 }}>
        <Card variant="warm" padding={12} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Icon.Shield size={16} color={c.darkGreen} />
          <span style={{ fontFamily: FONTS.body, fontSize: 12, color: c.text, lineHeight: 1.4 }}>Clusteer agents will <strong>never</strong> ask for your password, recovery phrase or Face ID.</span>
        </Card>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
            <div style={{
              maxWidth: '76%', padding: '10px 14px', borderRadius: 16,
              background: m.from === 'me' ? c.customBlack : c.surface,
              color: m.from === 'me' ? c.lightGreen : c.text,
              border: m.from === 'me' ? 'none' : `1px solid ${c.border}`,
              borderBottomRightRadius: m.from === 'me' ? 4 : 16,
              borderBottomLeftRadius: m.from === 'me' ? 16 : 4,
              fontFamily: FONTS.body, fontSize: 13.5, lineHeight: 1.4,
            }}>
              {m.from === 'agent' && <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.darkGreen, fontWeight: 700, marginBottom: 2 }}>{m.name}</div>}
              {m.text}
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, fontFamily: FONTS.body }}>{m.time}</div>
            </div>
          </div>
        ))}
      </Screen>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14, background: c.bg, borderTop: `1px solid ${c.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
        <IconBtn><Icon.Plus size={18} /></IconBtn>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          style={{ flex: 1, height: 40, padding: '0 14px', borderRadius: 99, background: c.surfaceMuted, border: `1px solid ${c.border}`, fontFamily: FONTS.body, fontSize: 14, color: c.text, outline: 'none' }}
        />
        <IconBtn bg={c.customBlack}><Icon.Send size={16} color={c.lightGreen} /></IconBtn>
      </div>
    </div>
  );
}

// ─── EDGE STATES ───────────────────────────────────────
function EmptyState({ icon: I = Icon.Inbox, title = 'Nothing here yet', body = 'When something happens, you\'ll see it here.', cta = 'Get started', onCta }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 36, gap: 14, textAlign: 'center' }}>
      <div style={{ width: 84, height: 84, borderRadius: '50%', background: c.surfaceWarm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I size={36} color={c.darkGreen} strokeWidth={1.6} />
      </div>
      <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>{title}</div>
      <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, lineHeight: 1.4, maxWidth: 280 }}>{body}</div>
      {cta && <div style={{ marginTop: 8 }}><BtnPrimary bold onClick={onCta} full={false}>{cta}</BtnPrimary></div>}
    </div>
  );
}

function ErrorState({ onRetry, title = 'Something went wrong', body = 'We couldn\'t load this just now. Please try again.' }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 36, gap: 14, textAlign: 'center' }}>
      <div style={{ width: 84, height: 84, borderRadius: '50%', background: c.dangerSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon.AlertTriangle size={36} color={c.danger} strokeWidth={1.8} />
      </div>
      <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: c.text, letterSpacing: -0.3 }}>{title}</div>
      <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, lineHeight: 1.4, maxWidth: 280 }}>{body}</div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <BtnSecondary size="md" full={false} onClick={onRetry}>Try again</BtnSecondary>
        <BtnSecondary size="md" full={false}>Contact support</BtnSecondary>
      </div>
    </div>
  );
}

function LoadingState() {
  const { c } = useTheme();
  return (
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ height: 24, width: '60%', background: c.surfaceMuted, borderRadius: 8, animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 90, background: c.surfaceMuted, borderRadius: 18, animation: 'shimmer 1.4s infinite' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{ flex: 1, height: 70, background: c.surfaceMuted, borderRadius: 14, animation: 'shimmer 1.4s infinite' }} />)}
      </div>
      <div style={{ height: 60, background: c.surfaceMuted, borderRadius: 14, animation: 'shimmer 1.4s infinite' }} />
      <div style={{ height: 60, background: c.surfaceMuted, borderRadius: 14, animation: 'shimmer 1.4s infinite' }} />
    </div>
  );
}

// ─── LOCK SCREEN (app start) ─────────────────────────
function LockScreen({ onUnlock }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 28, background: c.bg }}>
      <ClusteerLogo size={56} />
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Welcome back, Adaeze</h1>
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 8 }}>Use Face ID to unlock Clusteer</p>
      </div>
      <button onClick={onUnlock} style={{
        width: 96, height: 96, borderRadius: '50%', background: c.customBlack,
        color: c.lightGreen, border: `3px solid ${c.lightGreen}`, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 0 0 rgba(33,36,29,0.95)',
      }}>
        <Icon.FaceId size={50} color={c.lightGreen} strokeWidth={1.6} />
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginTop: 6 }}>
        <button onClick={onUnlock} style={{ background: 'none', border: 'none', color: c.darkGreen, fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Use passcode instead</button>
        <button style={{ background: 'none', border: 'none', color: c.textMuted, fontFamily: FONTS.body, fontSize: 12, cursor: 'pointer' }}>Sign in as another user</button>
      </div>
    </div>
  );
}

// ─── PUSH NOTIFICATION + WIDGET ──────────────────────
function PushNotificationDemo() {
  const { c } = useTheme();
  return (
    <div style={{ position: 'absolute', top: 60, left: 12, right: 12, padding: 14, borderRadius: 18, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 12px 28px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 100 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: c.lightGreen, border: '1.5px solid #21241D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <ClusteerLogo size={22} compact />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FONTS.body, fontSize: 11.5, fontWeight: 700, color: '#21241D' }}>Clusteer</span>
          <span style={{ fontFamily: FONTS.body, fontSize: 11, color: '#666' }}>now</span>
        </div>
        <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: '#21241D', marginTop: 1 }}>USDT/NGN up 0.4% today</div>
        <div style={{ fontFamily: FONTS.body, fontSize: 12, color: '#666', marginTop: 1 }}>Best rate of the week — sell now to lock in.</div>
      </div>
    </div>
  );
}

function HomeWidget({ size = 'medium' }) {
  // 'small' = single tile, 'medium' = 2:1 strip, 'large' = full square
  if (size === 'small') {
    return (
      <div style={{ width: 158, height: 158, borderRadius: 28, background: '#9FE870', border: '2.5px solid #21241D', padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ClusteerLogo size={24} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#21241D', background: 'rgba(33,36,29,0.12)', padding: '2px 8px', borderRadius: 99 }}>+0.4%</span>
        </div>
        <div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, color: '#21241D', letterSpacing: -0.6 }}>₦1,614</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#21241D', opacity: 0.7, fontWeight: 600 }}>USDT/NGN · live</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: 338, height: 158, borderRadius: 28, background: '#21241D', padding: 18, color: '#fff', display: 'flex', gap: 16 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#9FE870', letterSpacing: 0.6 }}>PORTFOLIO · NGN</div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 26, fontWeight: 700, color: '#fff', marginTop: 4, letterSpacing: -0.5 }}>₦2,074,500</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#9FE870', fontWeight: 700, marginTop: 2 }}>+₦4,250 today</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ background: '#9FE870', color: '#21241D', padding: '4px 10px', borderRadius: 99, fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700 }}>Buy</span>
          <span style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '4px 10px', borderRadius: 99, fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700 }}>Sell</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Sparkline data={RATE_SERIES.slice(-30).map(p => p.c)} width={140} height={70} color="#9FE870" />
      </div>
    </div>
  );
}

Object.assign(window, {
  NotificationsScreen, SettingsScreen, TwoFactorSetup, ProfileEdit,
  HelpCenter, SupportChat, EmptyState, ErrorState, LoadingState,
  LockScreen, PushNotificationDemo, HomeWidget,
});
