// Auto-injected: pull cross-script globals into local scope
const { Icon } = window;
const { CT, FONTS, RADIUS, ThemeProvider, useTheme, ClusteerLogo, AssetLogo, BankLogo } = window;
const { Phone, PHONE_W, PHONE_H, Screen, AppBar, IconBtn, BtnPrimary, BtnSecondary, BtnGhost, Pill, Card, Row, BottomNav, TextField, Sheet, Toast, Num, Tabs, Badge, Sparkline, Switch } = window;
const { ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT, RATE_USDT_NGN, FEE_PCT, RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD } = window;
const { ClusteerChart, CandleChart, RangeTabs, Donut } = window;

// Clusteer Mobile — KYC / NIN verification flow
// Screens: Intro → Personal info → ID type → NIN entry → Selfie capture → Submitting → Success / Pending / Rejected

function KycIntro({ onStart, onClose }) {
  const { c } = useTheme();
  const benefits = [
    { icon: Icon.TrendingUp, t: 'Trade up to ₦10M / day', s: 'Daily limit unlocked instantly' },
    { icon: Icon.Send, t: 'Send to anyone, anywhere', s: 'External wallets and bank accounts' },
    { icon: Icon.Shield, t: 'Account protection', s: 'Recover access if you lose your phone' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Verify identity" leading={<IconBtn onClick={onClose}><Icon.X size={20} /></IconBtn>} />
      <Screen padding={20}>
        <div style={{ background: c.surfaceWarm, borderRadius: 24, padding: 24, marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: c.lightGreen, opacity: 0.6 }} />
          <div style={{ position: 'relative' }}>
            <Badge kind="dark">~ 2 MIN</Badge>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: c.text, margin: 0, marginTop: 12, letterSpacing: -0.5, lineHeight: 1.15 }}>
              Verify your identity to unlock the full Clusteer.
            </h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 10, lineHeight: 1.5 }}>
              We use NIN + a quick selfie. Encrypted, never resold, gone if you ever delete your account.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {benefits.map((b, i) => (
            <Row key={i} leading={
              <div style={{ width: 40, height: 40, borderRadius: 12, background: c.paleGreen, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <b.icon size={18} color={c.darkGreen} strokeWidth={2} />
              </div>
            } title={b.t} subtitle={b.s} />
          ))}
        </div>
      </Screen>
      <div style={{ padding: 20, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BtnPrimary bold onClick={onStart}>Start verification</BtnPrimary>
        <BtnGhost full color={c.textMuted} onClick={onClose}>Maybe later</BtnGhost>
      </div>
    </div>
  );
}

// Step header used across KYC steps
function KycStep({ step, total = 4 }) {
  const { c } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 0 20px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < step ? c.customBlack : c.border }} />
      ))}
    </div>
  );
}

function KycPersonalInfo({ onNext, onBack }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Step 1 of 4" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <KycStep step={1} />
        <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Tell us about yourself</h1>
        <p style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, marginTop: 4 }}>This must match your government ID exactly.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
          <TextField label="First name" placeholder="Adaeze" />
          <TextField label="Surname" placeholder="Nwosu" />
          <TextField label="Middle name (optional)" placeholder="Chioma" />
          <TextField label="Date of birth" placeholder="DD / MM / YYYY" leading={<Icon.Calendar size={18} />} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: c.text }}>Gender</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Female', 'Male', 'Other'].map((g, i) => (
                <Pill key={g} active={i === 0} style={{ flex: 1 }}>{g}</Pill>
              ))}
            </div>
          </div>
          <TextField label="Residential address" placeholder="12 Awolowo Road, Ikoyi, Lagos" />
        </div>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onNext} trailing={<Icon.ArrowRight size={18} />}>Continue</BtnPrimary>
      </div>
    </div>
  );
}

function KycIdType({ onNext, onBack }) {
  const { c } = useTheme();
  const [pick, setPick] = React.useState('nin');
  const ids = [
    { id: 'nin', name: 'NIN slip', desc: 'National Identification Number · Fastest', recommended: true },
    { id: 'bvn', name: 'BVN', desc: 'Bank Verification Number · 5 min approval' },
    { id: 'driver', name: "Driver's License", desc: '~24 hour approval' },
    { id: 'voter', name: 'Voter\'s card (PVC)', desc: '~24 hour approval' },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Step 2 of 4" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <KycStep step={2} />
        <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Pick an ID</h1>
        <p style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, marginTop: 4 }}>We'll guide you through verifying it.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
          {ids.map((it) => (
            <button key={it.id} onClick={() => setPick(it.id)} style={{
              padding: 16, borderRadius: 16, background: c.surface,
              border: `2px solid ${pick === it.id ? c.customBlack : c.border}`,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${pick === it.id ? c.customBlack : c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pick === it.id && <div style={{ width: 12, height: 12, borderRadius: '50%', background: c.lightGreen }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, color: c.text }}>{it.name}</span>
                  {it.recommended && <Badge kind="lime">Recommended</Badge>}
                </div>
                <div style={{ fontFamily: FONTS.body, fontSize: 12, color: c.textMuted, marginTop: 2 }}>{it.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onNext} trailing={<Icon.ArrowRight size={18} />}>Continue with {ids.find(i => i.id === pick)?.name}</BtnPrimary>
      </div>
    </div>
  );
}

function KycNinEntry({ onNext, onBack }) {
  const { c } = useTheme();
  const [nin, setNin] = React.useState('123•••••890');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar title="Step 3 of 4" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
      <Screen padding={20}>
        <KycStep step={3} />
        <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Enter your NIN</h1>
        <p style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, marginTop: 4, lineHeight: 1.4 }}>
          Find it on your NIN slip or text *346# on the phone you registered with.
        </p>

        <div style={{ marginTop: 24 }}>
          <TextField label="NIN" value={nin} onChange={setNin} placeholder="11-digit number" leading={<Icon.User size={18} />} large />
        </div>

        <Card variant="warm" padding={14} style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Icon.Shield size={18} color={c.darkGreen} />
          <div>
            <div style={{ fontFamily: FONTS.body, fontSize: 12.5, fontWeight: 700, color: c.text }}>Your NIN is encrypted end-to-end</div>
            <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted, marginTop: 3, lineHeight: 1.4 }}>
              We pass it through NIMC's official API and never share it with third parties.
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 8 }}>WE'LL VERIFY</div>
          <Card variant="muted" padding={12}>
            <Row leading={<Icon.User size={18} color={c.darkGreen} />} title="Adaeze Chioma Nwosu" subtitle="Full name on file" trailing={<Badge kind="success" dot>MATCH</Badge>} />
            <Row leading={<Icon.Calendar size={18} color={c.darkGreen} />} title="14 March 1996" subtitle="Date of birth" trailing={<Badge kind="success" dot>MATCH</Badge>} />
          </Card>
        </div>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onNext} trailing={<Icon.ArrowRight size={18} />}>Verify NIN</BtnPrimary>
      </div>
    </div>
  );
}

function KycSelfie({ onNext, onBack }) {
  const { c } = useTheme();
  const [stage, setStage] = React.useState('intro'); // intro, capture, processing
  if (stage === 'intro') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <AppBar title="Step 4 of 4" leading={<IconBtn onClick={onBack}><Icon.ArrowLeft size={20} /></IconBtn>} />
        <Screen padding={20}>
          <KycStep step={4} />
          <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Take a quick selfie</h1>
          <p style={{ fontFamily: FONTS.body, fontSize: 13, color: c.textMuted, marginTop: 4 }}>This proves you're a real person, not a bot.</p>
          <div style={{ marginTop: 22, padding: 28, background: c.surfaceWarm, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 140, height: 180, borderRadius: 80, background: c.surface, border: `3px solid ${c.customBlack}`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <svg width="100" height="120" viewBox="0 0 100 120">
                <ellipse cx="50" cy="46" rx="22" ry="26" fill="#A0826D" />
                <path d="M28 50 Q 28 22 50 22 Q 72 22 72 50 Q 72 36 50 38 Q 28 36 28 50 Z" fill="#21241D"/>
                <path d="M22 110 Q 22 78 50 78 Q 78 78 78 110 Z" fill="#9FE870"/>
              </svg>
              <Icon.Camera size={20} color={c.lightGreen} style={{ position: 'absolute', bottom: 8, right: 8, background: c.customBlack, borderRadius: 99, padding: 4, width: 28, height: 28 }} />
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, color: c.text, textAlign: 'center' }}>Tips</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Find good lighting', 'Remove glasses & hats', 'Look straight at the camera', 'Hold still for 3 seconds'].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: FONTS.body, fontSize: 12.5, color: c.textMuted }}>
                  <Icon.Check size={14} color={c.darkGreen} strokeWidth={2.5} /> {t}
                </div>
              ))}
            </div>
          </div>
        </Screen>
        <div style={{ padding: 20 }}>
          <BtnPrimary bold leading={<Icon.Camera size={18} />} onClick={() => { setStage('capture'); setTimeout(() => { setStage('processing'); setTimeout(onNext, 1500); }, 1800); }}>Open camera</BtnPrimary>
        </div>
      </div>
    );
  }
  // Capture / processing — fullscreen camera UI
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
        <IconBtn bg="rgba(255,255,255,0.15)" onClick={() => setStage('intro')}><Icon.X size={18} color="#fff" /></IconBtn>
        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: 99, fontFamily: FONTS.body, fontSize: 12, fontWeight: 600 }}>
          {stage === 'capture' ? 'Look forward' : 'Verifying…'}
        </div>
        <div style={{ width: 38 }} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 240, height: 320, borderRadius: 140, border: `4px solid ${stage === 'processing' ? c.lightGreen : '#fff'}`, position: 'relative', overflow: 'hidden', background: 'rgba(159,232,112,0.08)' }}>
          <svg width="240" height="320" viewBox="0 0 240 320">
            <ellipse cx="120" cy="120" rx="58" ry="74" fill="#A0826D" />
            <path d="M62 130 Q 62 50 120 50 Q 178 50 178 130 Q 178 90 120 95 Q 62 90 62 130 Z" fill="#21241D"/>
            <path d="M50 320 Q 50 230 120 230 Q 190 230 190 320 Z" fill="#9FE870"/>
          </svg>
          {stage === 'capture' && (
            <div style={{ position: 'absolute', inset: 0, border: `4px solid ${c.lightGreen}`, borderRadius: 140, animation: 'pulse 1.4s ease-in-out infinite' }} />
          )}
          {stage === 'processing' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', border: `4px solid rgba(255,255,255,0.2)`, borderTopColor: c.lightGreen, animation: 'spin 1s linear infinite' }} />
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: 30, textAlign: 'center', fontFamily: FONTS.body, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
        {stage === 'capture' ? 'Hold still while we capture you…' : 'Comparing with NIN photo…'}
      </div>
    </div>
  );
}

function KycSubmitting({ onDone }) {
  const { c } = useTheme();
  const [stage, setStage] = React.useState(0);
  const stages = ['Encrypting your data', 'Submitting to NIMC', 'Cross-checking with NIN database', 'Finalising'];
  React.useEffect(() => {
    const t = setInterval(() => setStage((s) => s < stages.length - 1 ? s + 1 : (clearInterval(t), onDone?.(), s)), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 24 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', border: `4px solid ${c.surfaceMuted}`, borderTopColor: c.darkGreen, animation: 'spin 1s linear infinite' }} />
      <div style={{ fontFamily: FONTS.display, fontSize: 22, fontWeight: 700, color: c.text, textAlign: 'center', letterSpacing: -0.4 }}>Verifying your identity</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i <= stage ? 1 : 0.4 }}>
            {i < stage ? <Icon.CheckCircle size={18} color={c.darkGreen} /> : <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${i === stage ? c.darkGreen : c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i === stage && <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.darkGreen, animation: 'pulse 1s ease-in-out infinite' }} />}</div>}
            <span style={{ fontFamily: FONTS.body, fontSize: 13.5, color: c.text, fontWeight: 500 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KycSuccess({ onDone }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Screen padding={20}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 22, textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: c.lightGreen, border: `3px solid ${c.customBlack}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 0 0 rgba(33,36,29,0.95)' }}>
            <Icon.Check size={48} color={c.customBlack} strokeWidth={3.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>You're verified! 🎉</h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 10, lineHeight: 1.4 }}>
              Welcome to Tier 1. Your daily limit is now <strong style={{ color: c.text }}>₦10,000,000</strong>.
            </p>
          </div>
          <Card variant="warm" padding={16} style={{ width: '100%', textAlign: 'left' }}>
            <div style={{ fontFamily: FONTS.body, fontSize: 12, fontWeight: 700, color: c.text, marginBottom: 8 }}>UNLOCKED FEATURES</div>
            {['External wallet sends', 'Bank withdrawals', 'P2P trading', 'Airtime & data top-ups'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontFamily: FONTS.body, fontSize: 13, color: c.text }}>
                <Icon.CheckCircle size={16} color={c.darkGreen} /> {f}
              </div>
            ))}
          </Card>
        </div>
      </Screen>
      <div style={{ padding: 20 }}>
        <BtnPrimary bold onClick={onDone}>Start trading</BtnPrimary>
      </div>
    </div>
  );
}

function KycPending({ onDone }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Screen padding={20}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 22, textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: c.warningSoft, border: `3px solid ${c.warning}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.Clock size={44} color={c.warning} strokeWidth={2} />
          </div>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>Manual review needed</h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 10, lineHeight: 1.4 }}>
              Your selfie didn't quite match the NIN photo. A real person from our team is reviewing now — usually within an hour during banking hours.
            </p>
          </div>
          <Card variant="muted" padding={14} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon.Mail size={18} color={c.darkGreen} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: FONTS.body, fontSize: 12.5, fontWeight: 700, color: c.text }}>We'll email you</div>
                <div style={{ fontFamily: FONTS.body, fontSize: 11.5, color: c.textMuted }}>adaeze@example.com</div>
              </div>
            </div>
          </Card>
        </div>
      </Screen>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BtnPrimary bold onClick={onDone}>Got it</BtnPrimary>
        <BtnGhost full color={c.textMuted}>Submit a new selfie</BtnGhost>
      </div>
    </div>
  );
}

function KycRejected({ onRetry }) {
  const { c } = useTheme();
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Screen padding={20}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 22, textAlign: 'center' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: c.dangerSoft, border: `3px solid ${c.danger}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon.X size={44} color={c.danger} strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 24, fontWeight: 700, color: c.text, margin: 0, letterSpacing: -0.5 }}>We couldn't verify you</h1>
            <p style={{ fontFamily: FONTS.body, fontSize: 14, color: c.textMuted, marginTop: 10, lineHeight: 1.4 }}>
              The NIN you provided doesn't match the personal info on file. Please double-check and try again.
            </p>
          </div>
          <Card variant="surface" bordered padding={14} style={{ width: '100%' }}>
            <Row leading={<Icon.AlertTriangle size={18} color={c.danger} />} title="Name mismatch" subtitle="Please verify the spelling matches your NIN slip exactly" />
          </Card>
        </div>
      </Screen>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <BtnPrimary bold onClick={onRetry}>Try again</BtnPrimary>
        <BtnGhost full color={c.textMuted}>Contact support</BtnGhost>
      </div>
    </div>
  );
}

Object.assign(window, { KycIntro, KycPersonalInfo, KycIdType, KycNinEntry, KycSelfie, KycSubmitting, KycSuccess, KycPending, KycRejected });
