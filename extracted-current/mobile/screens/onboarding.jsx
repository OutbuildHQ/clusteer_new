// Auto-injected: pull cross-script globals into local scope
const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;
const { Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn, BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav, TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch } = window;
const { ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT, RATE_USDT_NGN, FEE_PCT, RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD } = window;
const { ClusteerChart, CandleChart, RangeTabs, Donut } = window;

// Clusteer Mobile — Onboarding screens (3 variations) + Auth flow
// Variations: A) Bold playful (lime hero), B) Soft premium beige, C) Storybook scrolling

// ─── Variation A: BOLD playful ─────────────────────────────
function OnboardingA({ onDone }) {
  const { c } = useTheme();
  const [step, setStep] = React.useState(0);
  const slides = [
    { title: 'Trade USDT to Naira instantly.', sub: 'No delays. No drama. Just clean rates and 5-minute payouts to your bank.', accent: c.lightGreen, illust: 'trade' },
    { title: 'Built for Nigerian traders.', sub: '1,000+ traders move millions every week through Clusteer. You\'re next 😘', accent: c.paleGreen, illust: 'shield' },
    { title: 'Stay in control, always.', sub: 'Bank-grade 2FA, biometric lock, full transaction history at your fingertips.', accent: '#F0EBE6', illust: 'lock' },
  ];
  const s = slides[step];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: c.bg }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
        <ClusteerLogo size={26} showWordmark />
        <BtnGhost onClick={onDone} color={c.textMuted}>Skip</BtnGhost>
      </div>
      <div style={{ flex: 1, padding: '20px 20px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: s.accent, borderRadius: 28, border: `2.5px solid ${c.customBlack}`,
          flex: 1, padding: 24, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 0 0 rgba(33,36,29,0.95)',
        }}>
          <OnboardIllust kind={s.illust} />
        </div>
        <div style={{ marginTop: 26 }}>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 30, fontWeight: 700, color: c.text, letterSpacing: -0.8, lineHeight: 1.1, margin: 0 }}>{s.title}</h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 15, color: c.textMuted, marginTop: 12, lineHeight: 1.4 }}>{s.sub}</p>
        </div>
      </div>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {slides.map((_, i) => <div key={i} style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 99, background: i === step ? c.customBlack : c.border, transition: 'all 0.2s' }} />)}
        </div>
        <BtnPrimary bold onClick={() => step < slides.length - 1 ? setStep(step + 1) : onDone?.()} trailing={<Icon.ArrowRight size={18} strokeWidth={2.4} />}>
          {step < slides.length - 1 ? 'Continue' : 'Get started'}
        </BtnPrimary>
      </div>
    </div>
  );
}

// ─── Variation B: SOFT premium ─────────────────────────────
function OnboardingB({ onDone }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
        <ClusteerLogo size={48} />
        <div>
          <div style={{ fontFamily: FONTS.body, fontSize: 13, color: c.darkGreen, fontWeight: 700, letterSpacing: 1.2 }}>NIGERIA · STABLECOINS</div>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 700, color: c.text, letterSpacing: -1.2, lineHeight: 1.05, marginTop: 14, margin: 0 }}>
            Bridge your<br/>Naira into the<br/><span style={{ color: c.darkGreen, fontStyle: 'italic' }}>global economy.</span>
          </h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 15, color: c.textMuted, marginTop: 16, lineHeight: 1.5 }}>
            Buy & sell USDT instantly. 0.5% flat fee. Instant NGN payouts.
          </p>
        </div>
        <Card variant="warm" padding={16} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: -2 }}>
            <span style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textMuted, fontWeight: 600 }}>USDT / NGN · LIVE</span>
            <Num size={22} weight={700} color={c.text}>₦1,614.50</Num>
            <span style={{ fontFamily: FONTS.body, fontSize: 11, color: c.darkGreen, fontWeight: 700, marginTop: 2 }}>↑ 0.4% today</span>
          </div>
          <div style={{ flex: 1 }} />
          <Sparkline data={RATE_SERIES.slice(-30).map(p => p.c)} width={100} height={40} color={c.darkGreen} />
        </Card>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BtnPrimary bold onClick={onDone}>Create account</BtnPrimary>
        <BtnSecondary onClick={onDone}>I already have an account</BtnSecondary>
      </div>
    </div>
  );
}

// ─── Variation C: SCROLLING storybook ──────────────────────
function OnboardingC({ onDone }) {
  const { c } = useTheme();
  const features = [
    { icon: Icon.Zap, title: '5-minute payouts', body: 'NGN lands in your bank in under 5 minutes, every time.', tint: c.lightGreen },
    { icon: Icon.Shield, title: '2FA + biometric', body: 'Face ID, fingerprint, and authenticator apps from day one.', tint: c.paleGreen },
    { icon: Icon.TrendingUp, title: 'Best market rates', body: 'We aggregate 5+ books every 15 seconds so you always win.', tint: '#F0EBE6' },
    { icon: Icon.ChatBubble, title: '24/7 human support', body: 'Real Lagos-based agents. No bots. No queues.', tint: c.surfaceMuted },
  ];
  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <ClusteerLogo size={28} showWordmark />
        <BtnGhost onClick={onDone} color={c.textMuted}>Sign in</BtnGhost>
      </div>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 700, color: c.text, letterSpacing: -0.8, lineHeight: 1.1, margin: 0 }}>
        The fastest way<br/>to move money<br/>between <span style={{ color: c.darkGreen }}>Naira</span> &amp;<br/><span style={{ color: c.darkGreen }}>USDT.</span>
      </h1>
      <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
        {features.slice(0, 2).map((f, i) => (
          <Card key={i} variant="surface" bordered padding={16} style={{ flex: '1 1 45%', minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: f.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <f.icon size={18} color={c.customBlack} strokeWidth={2} />
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{f.title}</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 4, lineHeight: 1.4 }}>{f.body}</div>
          </Card>
        ))}
      </div>
      <Card variant="dark" padding={20} style={{ marginTop: 12, color: '#fff' }}>
        <div style={{ fontFamily: FONTS.body, fontSize: 11, color: c.lightGreen, fontWeight: 700, letterSpacing: 1 }}>WHY 1,000+ TRADERS PICK CLUSTEER</div>
        <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, marginTop: 10, lineHeight: 1.15, color: '#fff' }}>
          ₦12.4B in volume cleared this month — never a missed payout.
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
        {features.slice(2).map((f, i) => (
          <Card key={i} variant="surface" bordered padding={16} style={{ flex: '1 1 45%', minWidth: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: f.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <f.icon size={18} color={c.customBlack} strokeWidth={2} />
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{f.title}</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 4, lineHeight: 1.4 }}>{f.body}</div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <BtnPrimary bold onClick={onDone}>Get started — it's free</BtnPrimary>
      </div>
    </div>
  );
}

// Hand-drawn-ish illustration helper
function OnboardIllust({ kind }) {
  if (kind === 'trade') {
    return (
      <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
        {/* coins stack */}
        <circle cx="80" cy="160" r="48" fill="#21241D" />
        <circle cx="80" cy="148" r="48" fill="#fff" stroke="#21241D" strokeWidth="3" />
        <text x="80" y="160" textAnchor="middle" fontFamily="Sora, sans-serif" fontSize="40" fontWeight="700" fill="#21241D">₦</text>
        {/* arrow */}
        <path d="M120 110 L160 110 M150 100 L160 110 L150 120" stroke="#21241D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* USDT */}
        <circle cx="190" cy="100" r="42" fill="#26A17B" stroke="#21241D" strokeWidth="3" />
        <text x="190" y="112" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="36" fontWeight="700" fill="#fff">₮</text>
        {/* sparkles */}
        <path d="M40 60 L46 66 M46 60 L40 66" stroke="#21241D" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M210 200 L218 208 M218 200 L210 208" stroke="#21241D" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'shield') {
    return (
      <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
        <path d="M125 30 L60 55 V125 C60 165 90 200 125 215 C160 200 190 165 190 125 V55 L125 30 Z" fill="#fff" stroke="#21241D" strokeWidth="3.5" />
        <path d="M95 125 L115 145 L155 105" stroke="#21241D" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (kind === 'lock') {
    return (
      <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
        <rect x="65" y="115" width="120" height="100" rx="14" fill="#21241D" />
        <rect x="65" y="115" width="120" height="100" rx="14" fill="#fff" stroke="#21241D" strokeWidth="3.5" />
        <path d="M90 115 V85 a35 35 0 0 1 70 0 V115" stroke="#21241D" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="125" cy="160" r="12" fill="#21241D" />
        <rect x="121" y="158" width="8" height="22" fill="#21241D" />
      </svg>
    );
  }
  return null;
}

// ─── Sign-up screen ─────────────────────────────────────────
function SignUpScreen({ onSubmit, onBack, onLogin }) {
  const { c } = useTheme();
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [show, setShow] = React.useState(false);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <div>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Create your account</h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 6 }}>Trade in 60 seconds. We never share your info.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24 }}>
          <TextField label="Email address" value={email} onChange={setEmail} placeholder="adaeze@example.com" leading={<Icon.Mail size={18} />} />
          <TextField label="Phone number" value={phone} onChange={setPhone} placeholder="+234 801 234 5678" leading={<Icon.Phone size={18} />} />
          <TextField label="Create password" type={show ? 'text' : 'password'} value={pw} onChange={setPw} placeholder="At least 8 characters"
            leading={<Icon.Lock size={18} />}
            trailing={<button onClick={() => setShow(!show)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, display: 'flex' }}>
              {show ? <Icon.EyeOff size={18} /> : <Icon.Eye size={18} />}
            </button>}
            helper="Use letters, numbers and a symbol or two."
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 4 }}>
            <input type="checkbox" defaultChecked style={{ marginTop: 3, accentColor: c.darkGreen }} />
            <span style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, lineHeight: 1.4 }}>
              I agree to Clusteer's <a style={{ color: c.darkGreen, fontWeight: 600 }}>Terms</a> and <a style={{ color: c.darkGreen, fontWeight: 600 }}>Privacy Policy</a>.
            </span>
          </div>
        </div>
      </Screen>
      <div style={{ padding: 20, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <BtnPrimary bold onClick={onSubmit}>Create account</BtnPrimary>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: c.border }} />
          <span style={{ fontFamily: FONTS.body, fontSize: 11, color: c.textSubtle }}>OR</span>
          <div style={{ flex: 1, height: 1, background: c.border }} />
        </div>
        <BtnSecondary leading={<svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.91c1.69-1.56 2.68-3.86 2.68-6.61z" fill="#4285F4"/><path d="M9 18c2.43 0 4.46-.81 5.95-2.18l-2.91-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.04-3.7H.95v2.32A9 9 0 0 0 9 18z" fill="#34A853"/><path d="M3.96 10.71a5.4 5.4 0 0 1 0-3.42V5H.96a9 9 0 0 0 0 8l3-2.32z" fill="#FBBC05"/><path d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A8.99 8.99 0 0 0 9 0a9 9 0 0 0-8.05 4.96l3 2.33C4.66 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/></svg>}>
          Continue with Google
        </BtnSecondary>
        <div style={{ textAlign: 'center', fontFamily: FONTS.body, fontSize: 13, color: c.textMuted }}>
          Have an account? <a onClick={onLogin} style={{ color: c.darkGreen, fontWeight: 700, cursor: 'pointer' }}>Sign in</a>
        </div>
      </div>
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────
function LoginScreen({ onSubmit, onBack, onSignup, biometric = true }) {
  const { c } = useTheme();
  const [email, setEmail] = React.useState('adaeze@clusteer.io');
  const [pw, setPw] = React.useState('••••••••');
  const [show, setShow] = React.useState(false);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <ClusteerLogo size={36} />
        <div style={{ marginTop: 18 }}>
          <h1 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Welcome back</h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 6 }}>Pick up where you left off.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26 }}>
          <TextField label="Email" value={email} onChange={setEmail} leading={<Icon.Mail size={18} />} />
          <TextField label="Password" type={show ? 'text' : 'password'} value={pw} onChange={setPw} leading={<Icon.Lock size={18} />}
            trailing={<button onClick={() => setShow(!show)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, display: 'flex' }}>
              {show ? <Icon.EyeOff size={18} /> : <Icon.Eye size={18} />}
            </button>} />
          <div style={{ textAlign: 'right' }}>
            <a style={{ fontFamily: FONTS.body, fontSize: 13, color: c.darkGreen, fontWeight: 600, cursor: 'pointer' }}>Forgot password?</a>
          </div>
        </div>
      </Screen>
      <div style={{ padding: 20, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <BtnPrimary bold onClick={onSubmit} style={{ flex: 1 }}>Sign in</BtnPrimary>
          {biometric && (
            <button onClick={onSubmit} style={{ width: 56, height: 56, borderRadius: 999, background: c.customBlack, color: c.lightGreen, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.FaceId size={26} color={c.lightGreen} strokeWidth={1.6} />
            </button>
          )}
        </div>
        <div style={{ textAlign: 'center', fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, paddingTop: 4 }}>
          New to Clusteer? <a onClick={onSignup} style={{ color: c.darkGreen, fontWeight: 700, cursor: 'pointer' }}>Create account</a>
        </div>
      </div>
    </div>
  );
}

// ─── OTP / 2FA screen ─────────────────────────────────────
function OtpScreen({ onSubmit, onBack, kind = 'email' }) {
  const { c } = useTheme();
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const set = (i, v) => { const n = [...code]; n[i] = v.slice(-1); setCode(n); };
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: c.lightGreen, border: `2px solid ${c.customBlack}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {kind === 'email' ? <Icon.Mail size={26} color={c.customBlack} /> : <Icon.Shield size={26} color={c.customBlack} />}
        </div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, marginTop: 18, letterSpacing: -0.5 }}>
          {kind === 'email' ? 'Verify your email' : 'Two-factor code'}
        </h1>
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 6, lineHeight: 1.4 }}>
          {kind === 'email' ? <>We sent a 6-digit code to <strong style={{ color: c.text }}>adaeze@example.com</strong>. It expires in 10 minutes.</>
            : <>Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, 1Password).</>}
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'space-between' }}>
          {code.map((v, i) => (
            <input key={i} value={v} onChange={(e) => set(i, e.target.value)} maxLength={1}
              style={{ width: 48, height: 56, borderRadius: 14, border: `2px solid ${v ? c.customBlack : c.border}`, background: c.surface, fontFamily: FONTS.numeric, fontSize: 22, fontWeight: 700, textAlign: 'center', color: c.text, outline: 'none' }} />
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONTS.body, fontSize: 13, color: c.textMuted }}>
          <Icon.Clock size={14} /> Resend code in 0:42
        </div>
      </Screen>
      <div style={{ padding: 20, paddingTop: 12 }}>
        <BtnPrimary bold onClick={onSubmit}>Verify &amp; continue</BtnPrimary>
      </div>
    </div>
  );
}

// ─── Forgot password ──────────────────────────────────────
function ForgotPasswordScreen({ onSubmit, onBack }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} title="Forgot password" />
      <Screen padding={20}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: c.surfaceWarm, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Lock size={26} color={c.customBlack} />
        </div>
        <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, marginTop: 18, letterSpacing: -0.5 }}>Reset your password</h1>
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 6, lineHeight: 1.4 }}>
          Enter your email and we'll send you a recovery link.
        </p>
        <div style={{ marginTop: 24 }}>
          <TextField label="Email address" placeholder="you@example.com" leading={<Icon.Mail size={18} />} />
        </div>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onSubmit}>Send reset link</BtnPrimary>
      </div>
    </div>
  );
}

Object.assign(window, { OnboardingA, OnboardingB, OnboardingC, SignUpScreen, LoginScreen, OtpScreen, ForgotPasswordScreen });
