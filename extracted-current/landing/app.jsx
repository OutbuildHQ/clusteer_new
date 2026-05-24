// Clusteer landing — main app
const { Nav, Hero } = window;
const { ClusteerMark, ClusteerWordmark, CoinUSDT, CoinUSDC, CoinNGN, Ic } = window;

// ─────────────────────────────────────────────────────────────
// Bank marquee
// ─────────────────────────────────────────────────────────────
const BANKS = [
  { name: 'GTBank', color: '#E5631A' },
  { name: 'Access', color: '#003366' },
  { name: 'Zenith', color: '#E10A0A' },
  { name: 'UBA', color: '#D10000' },
  { name: 'First Bank', color: '#003B7A' },
  { name: 'Kuda', color: '#40196D' },
  { name: 'Opay', color: '#0E9E4F' },
  { name: 'PalmPay', color: '#7C3AED' },
  { name: 'Stanbic', color: '#0033A0' },
  { name: 'Wema', color: '#7B1FA2' },
  { name: 'Fidelity', color: '#003D7A' },
  { name: 'Sterling', color: '#C8102E' },
];

function BankMarquee() {
  const items = [...BANKS, ...BANKS];
  return (
    <section style={{
      padding: '36px 0', background: '#21241D',
      borderTop: '2px solid #21241D', borderBottom: '2px solid #21241D',
      overflow: 'hidden',
    }}>
      <div style={{
        textAlign: 'center', marginBottom: 24,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 500,
        color: 'rgba(250,250,247,0.55)', letterSpacing: 1.5,
      }}>
        — PAYS OUT TO EVERY BANK IN NIGERIA —
      </div>
      <div style={{ display: 'flex', width: 'fit-content' }} className="marquee-track">
        {items.map((b, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '14px 28px', margin: '0 12px',
            background: 'rgba(250,250,247,0.04)',
            border: '1px solid rgba(250,250,247,0.10)',
            borderRadius: 999,
            fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 17,
            color: '#FAFAF7', whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%', background: b.color,
              boxShadow: `0 0 10px ${b.color}66`,
            }}/>
            {b.name}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// How it works — 3 steps, big numerics
// ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: '01',
      kicker: 'Lock your rate',
      title: 'Pick the amount, see exactly what hits your bank.',
      copy: 'No hidden spread, no "we\'ll figure it out". The number you see is the number you get.',
      bg: '#F0EBE6',
      visual: <StepVisualRate/>,
    },
    {
      n: '02',
      kicker: 'Send your stables',
      title: 'USDT or USDC, on TRON, BSC, Solana, or Ethereum.',
      copy: 'Scan the QR or copy the address. We watch the chain so you don\'t have to.',
      bg: '#EFFCD0',
      visual: <StepVisualSend/>,
    },
    {
      n: '03',
      kicker: 'Get paid',
      title: 'Naira lands in your bank in under 5 minutes.',
      copy: 'Average payout time is 4 min 12 sec. Slowest day this year was 11 min. We promise nothing — we just keep ours.',
      bg: '#21241D',
      visual: <StepVisualPaid/>,
      dark: true,
    },
  ];
  return (
    <section id="how" style={{ padding: '120px 32px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 72, maxWidth: 720 }}>
        <div className="f-mono" style={{ fontSize: 12, fontWeight: 600, color: '#0F4F26', letterSpacing: 1.5, marginBottom: 16 }}>
          ◆ HOW IT WORKS
        </div>
        <h2 className="f-display" style={{
          fontSize: 'clamp(40px, 5vw, 68px)', lineHeight: 1, letterSpacing: '-0.04em',
          fontWeight: 700, margin: 0, color: '#21241D',
        }}>
          Three steps. <em style={{ fontStyle: 'italic', fontWeight: 700 }}>That's it.</em>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: s.bg, borderRadius: 32,
            border: '2px solid #21241D',
            overflow: 'hidden',
            minHeight: 400,
          }}>
            <div style={{ padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="f-display" style={{
                fontSize: 120, lineHeight: 0.85, fontWeight: 800,
                color: s.dark ? '#9FE870' : '#21241D',
                letterSpacing: '-0.05em',
              }}>{s.n}</div>
              <div>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                  color: s.dark ? '#9FE870' : '#0F4F26', marginBottom: 14, textTransform: 'uppercase',
                }}>
                  {s.kicker}
                </div>
                <h3 className="f-display" style={{
                  fontSize: 32, lineHeight: 1.1, fontWeight: 700, margin: 0,
                  letterSpacing: '-0.025em',
                  color: s.dark ? '#FAFAF7' : '#21241D',
                  marginBottom: 14,
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontSize: 16, lineHeight: 1.55, margin: 0, maxWidth: 420,
                  color: s.dark ? 'rgba(250,250,247,0.7)' : '#475467',
                }}>
                  {s.copy}
                </p>
              </div>
            </div>
            <div style={{
              borderLeft: '2px solid #21241D',
              background: s.dark ? 'rgba(159,232,112,0.04)' : 'rgba(33,36,29,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 32,
            }}>
              {s.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepVisualRate() {
  return (
    <div style={{
      width: '100%', maxWidth: 380,
      background: '#FAFAF7', border: '1.5px solid #21241D', borderRadius: 20, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#475467', textTransform: 'uppercase', letterSpacing: 1 }}>You send</span>
        <span style={{ fontSize: 11, color: '#0F4F26', fontWeight: 600 }}>USDT • TRC-20</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CoinUSDT size={40}/>
        <div className="f-mono" style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em' }}>500.00</div>
      </div>
      <div style={{ borderTop: '1px dashed rgba(33,36,29,0.2)', margin: '6px 0' }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#475467', textTransform: 'uppercase', letterSpacing: 1 }}>You get</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#0F4F26', fontWeight: 600 }}>@ ₦1,612.40</span>
      </div>
      <div style={{
        background: '#9FE870', padding: '14px 16px', borderRadius: 14,
        border: '1.5px solid #21241D',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <CoinNGN size={36}/>
        <div className="f-mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#21241D' }}>
          ₦806,200
        </div>
      </div>
      <div style={{ fontSize: 11, color: '#475467', fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>
        Fee: ₦0 • Spread: 0.0%
      </div>
    </div>
  );
}

function StepVisualSend() {
  return (
    <div style={{
      width: '100%', maxWidth: 320,
      background: '#FAFAF7', border: '1.5px solid #21241D', borderRadius: 20, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#475467', textTransform: 'uppercase', letterSpacing: 1 }}>
        Scan to send
      </div>
      {/* fake QR */}
      <div style={{
        width: 200, height: 200, padding: 12, background: '#fff',
        border: '1.5px solid #21241D', borderRadius: 16,
        display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 0,
      }}>
        {Array.from({ length: 225 }).map((_, i) => {
          const corners = [0, 1, 2, 12, 13, 14, 15, 16, 17, 27, 28, 29,
            180, 181, 182, 195, 196, 197, 210, 211, 212].includes(i) ||
            (i < 45 && i % 15 < 3) ||
            (i < 45 && i % 15 > 11) ||
            (i > 180 && i % 15 < 3);
          const random = (i * 37) % 7 < 3;
          const fill = corners || random;
          return <div key={i} style={{ aspectRatio: '1', background: fill ? '#21241D' : 'transparent' }}/>;
        })}
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 500,
        color: '#475467', textAlign: 'center', wordBreak: 'break-all', maxWidth: 280,
      }}>
        TR7NHqjeKQxGTCi8q8ZY4pL8…HX9w
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', borderRadius: 999,
        background: '#EFFCD0', border: '1.5px solid #21241D',
        fontSize: 12, fontWeight: 600,
      }}>
        <span className="live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#0F4F26' }}/>
        Watching mempool
      </div>
    </div>
  );
}

function StepVisualPaid() {
  return (
    <div style={{
      width: '100%', maxWidth: 380,
      background: '#FAFAF7', border: '1.5px solid #FAFAF7', borderRadius: 20, padding: 24,
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', background: '#9FE870',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #21241D',
        }}>
          <Ic name="check" size={22} stroke="#21241D" sw={3}/>
        </div>
        <div>
          <div className="f-display" style={{ fontSize: 18, fontWeight: 700, color: '#21241D' }}>Payout settled</div>
          <div style={{ fontSize: 12, color: '#475467', fontFamily: 'JetBrains Mono, monospace' }}>
            04:12 elapsed • Block #61,832,409
          </div>
        </div>
      </div>
      <div style={{ background: '#F0EBE6', borderRadius: 14, padding: 18, border: '1px solid rgba(33,36,29,0.08)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#475467', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          Credited to
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E5631A' }}/>
          <span className="f-display" style={{ fontWeight: 700, fontSize: 16 }}>GTBank</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#475467' }}>•• 3421</span>
        </div>
        <div className="f-mono" style={{ fontSize: 28, fontWeight: 600, color: '#21241D', marginTop: 8 }}>
          +₦806,200<span style={{ fontSize: 18, color: '#475467' }}>.00</span>
        </div>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, color: '#475467',
      }}>
        <span>Ref: <span className="f-mono">CL-9F2A3D81</span></span>
        <span style={{ color: '#0F4F26', fontWeight: 600 }}>✓ NIBSS confirmed</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats — bold numeric grid
// ─────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { v: '₦42B+', l: 'paid out to Nigerians', mono: true },
    { v: '4:12', l: 'avg payout time, minutes', mono: true },
    { v: '92,000', l: 'verified KYC users', mono: true },
    { v: '0.0%', l: 'spread on the rate', mono: true },
  ];
  return (
    <section style={{ padding: '80px 32px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        border: '2px solid #21241D', borderRadius: 28, overflow: 'hidden',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: 36,
            borderRight: i < 3 ? '2px solid #21241D' : 'none',
            background: i === 1 ? '#9FE870' : i === 2 ? '#F0EBE6' : '#FAFAF7',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div className="f-mono" style={{
              fontSize: 56, fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.03em',
              color: '#21241D',
            }}>{s.v}</div>
            <div style={{ fontSize: 13, color: '#475467', fontWeight: 500, lineHeight: 1.4 }}>
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// App showcase — phone mockup
// ─────────────────────────────────────────────────────────────
function AppShowcase() {
  return (
    <section id="app" style={{
      padding: '120px 32px',
      background: '#21241D',
      color: '#FAFAF7',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center',
      }}>
        <div>
          <div className="f-mono" style={{ fontSize: 12, fontWeight: 600, color: '#9FE870', letterSpacing: 1.5, marginBottom: 16 }}>
            ◆ MOBILE APP
          </div>
          <h2 className="f-display" style={{
            fontSize: 'clamp(40px, 5vw, 68px)', lineHeight: 1, letterSpacing: '-0.04em',
            fontWeight: 700, margin: 0, color: '#FAFAF7',
          }}>
            Built for thumbs.<br/>
            <span style={{ color: '#9FE870' }}>Not for desks.</span>
          </h2>
          <p style={{
            marginTop: 28, fontSize: 18, lineHeight: 1.55, color: 'rgba(250,250,247,0.7)', maxWidth: 480,
          }}>
            Custom numpad. FaceID payouts. Live rate on your home screen widget.
            Designed in Lagos, for the way Nigerians actually move money.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
            {[
              { i: 'bolt', t: 'One-tap rate lock', s: 'Hit the rate the moment you see it.' },
              { i: 'shield', t: 'Biometric on every payout', s: 'FaceID, TouchID, fingerprint, your call.' },
              { i: 'sparkle', t: 'Home-screen widget', s: 'USDT/NGN rate without unlocking the phone.' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'rgba(159,232,112,0.12)', color: '#9FE870',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Ic name={f.i} size={18}/>
                </div>
                <div>
                  <div className="f-display" style={{ fontWeight: 700, fontSize: 17, color: '#FAFAF7' }}>{f.t}</div>
                  <div style={{ fontSize: 14, color: 'rgba(250,250,247,0.6)', marginTop: 2 }}>{f.s}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            <button style={{
              padding: '14px 24px', borderRadius: 999,
              background: '#9FE870', color: '#21241D',
              fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15,
              border: '2px solid #9FE870',
              boxShadow: '4px 4px 0 0 #9FE870',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <Ic name="check" size={14}/> iOS
            </button>
            <button style={{
              padding: '14px 24px', borderRadius: 999,
              background: 'transparent', color: '#FAFAF7',
              fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 15,
              border: '2px solid #FAFAF7',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <Ic name="check" size={14}/> Android
            </button>
          </div>
        </div>

        <PhoneMock/>
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
      {/* glow */}
      <div style={{
        position: 'absolute', inset: '10% -10% 10% -10%',
        background: 'radial-gradient(circle, rgba(159,232,112,0.18) 0%, transparent 65%)',
        filter: 'blur(40px)',
      }}/>

      {/* phone */}
      <div style={{
        width: 340, height: 700, position: 'relative', zIndex: 1,
        background: '#0A0B08', borderRadius: 56,
        padding: 10,
        border: '2px solid #FAFAF7',
        boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          width: '100%', height: '100%',
          background: '#FAFAF7', borderRadius: 46,
          overflow: 'hidden', position: 'relative',
        }}>
          {/* notch */}
          <div style={{
            position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 28, background: '#0A0B08', borderRadius: 999,
            zIndex: 2,
          }}/>
          {/* status bar */}
          <div style={{
            position: 'absolute', top: 18, left: 28, right: 28,
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 13, color: '#21241D',
            zIndex: 3,
          }}>
            <span>9:41</span>
            <span>•••</span>
          </div>

          {/* content */}
          <div style={{ padding: '60px 22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: '#475467' }}>Welcome back</div>
                <div className="f-display" style={{ fontSize: 18, fontWeight: 700 }}>Adaeze ✦</div>
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: 999, background: '#21241D',
                color: '#9FE870',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Sora, sans-serif', fontWeight: 700,
              }}>A</div>
            </div>

            {/* balance card */}
            <div style={{
              background: '#21241D', color: '#FAFAF7', borderRadius: 24, padding: 22,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 160, height: 160, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(159,232,112,0.3) 0%, transparent 70%)',
              }}/>
              <div style={{ fontSize: 11, color: '#9FE870', fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1.5 }}>
                TOTAL BALANCE
              </div>
              <div className="f-mono" style={{ fontSize: 36, fontWeight: 600, marginTop: 8, letterSpacing: '-0.02em' }}>
                ₦2,481,302
                <span style={{ fontSize: 22, opacity: 0.5 }}>.40</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(250,250,247,0.6)', marginTop: 6 }}>
                ≈ <span className="f-mono">1,538.21 USDT</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <div style={{
                  flex: 1, padding: '10px', borderRadius: 12,
                  background: '#9FE870', color: '#21241D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13,
                }}><Ic name="plus" size={14} sw={2.6}/> Buy</div>
                <div style={{
                  flex: 1, padding: '10px', borderRadius: 12,
                  background: 'rgba(250,250,247,0.08)', color: '#FAFAF7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13,
                }}><Ic name="minus" size={14} sw={2.6}/> Sell</div>
                <div style={{
                  flex: 1, padding: '10px', borderRadius: 12,
                  background: 'rgba(250,250,247,0.08)', color: '#FAFAF7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13,
                }}><Ic name="swap" size={14} sw={2.6}/> Swap</div>
              </div>
            </div>

            {/* rate card */}
            <div style={{
              background: '#9FE870', borderRadius: 18, padding: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#0F4F26', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                  USDT / NGN
                </div>
                <div className="f-mono" style={{ fontSize: 22, fontWeight: 600, color: '#21241D' }}>
                  ₦1,612.40
                </div>
              </div>
              <div style={{ width: 80, height: 36 }}>
                <svg viewBox="0 0 80 36" width="100%" height="100%">
                  <path d="M0 22 L 16 18 L 28 24 L 40 14 L 52 16 L 66 8 L 80 4" stroke="#21241D" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>

            {/* recent */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#475467', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Recent
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { t: 'Sold USDT', d: 'Just now', a: '+₦322,480', g: true },
                  { t: 'Bought USDC', d: '2 hours ago', a: '-₦161,240', g: false },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 10, background: '#fff', borderRadius: 14,
                    border: '1px solid rgba(33,36,29,0.06)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 999,
                        background: r.g ? '#EFFCD0' : '#F0EBE6',
                        color: r.g ? '#0F4F26' : '#21241D',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Ic name={r.g ? 'minus' : 'plus'} size={14} sw={2.4}/>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{r.t}</div>
                        <div style={{ fontSize: 11, color: '#94989B' }}>{r.d}</div>
                      </div>
                    </div>
                    <div className="f-mono" style={{ fontSize: 13, fontWeight: 600, color: r.g ? '#0F4F26' : '#21241D' }}>
                      {r.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Trust strip
// ─────────────────────────────────────────────────────────────
function Trust() {
  const items = [
    {
      icon: 'shield',
      title: 'Funds in segregated wallets',
      copy: 'Customer assets never touch operational treasury. Cold-storage majority, multi-sig on every withdrawal.',
    },
    {
      icon: 'check',
      title: 'NDPR aligned, NITDA registered',
      copy: 'Your data is encrypted at rest and in transit. We disclose nothing without legal compulsion.',
    },
    {
      icon: 'star',
      title: 'Smile ID + Youverify backup',
      copy: 'Two independent KYC providers. If one is down, the other catches your verification.',
    },
  ];
  return (
    <section id="trust" style={{ padding: '120px 32px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ marginBottom: 56, maxWidth: 720 }}>
        <div className="f-mono" style={{ fontSize: 12, fontWeight: 600, color: '#0F4F26', letterSpacing: 1.5, marginBottom: 16 }}>
          ◆ TRUST
        </div>
        <h2 className="f-display" style={{
          fontSize: 'clamp(40px, 5vw, 68px)', lineHeight: 1, letterSpacing: '-0.04em',
          fontWeight: 700, margin: 0,
        }}>
          We hold the boring stuff <em style={{ fontStyle: 'italic' }}>seriously</em> so you don't have to.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: '#FAFAF7', border: '2px solid #21241D', borderRadius: 24,
            padding: 32,
            display: 'flex', flexDirection: 'column', gap: 16,
            minHeight: 260,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: '#9FE870',
              border: '1.5px solid #21241D',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Ic name={it.icon} size={22} sw={2.4}/>
            </div>
            <div className="f-display" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {it.title}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: '#475467', margin: 0 }}>
              {it.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ padding: '40px 32px 120px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{
        background: '#9FE870',
        border: '2px solid #21241D',
        borderRadius: 36,
        padding: '80px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* big mark watermark */}
        <div style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.15 }}>
          <ClusteerMark size={400} color="#21241D"/>
        </div>

        <div style={{ position: 'relative', maxWidth: 720 }}>
          <h2 className="f-display" style={{
            fontSize: 'clamp(48px, 6vw, 88px)', lineHeight: 0.95, letterSpacing: '-0.045em',
            fontWeight: 700, margin: 0, color: '#21241D',
          }}>
            Your stables<br/>
            deserve naira<br/>
            in <em style={{ fontStyle: 'italic' }}>minutes.</em>
          </h2>
          <p style={{
            marginTop: 28, fontSize: 18, lineHeight: 1.5, color: '#21241D', opacity: 0.75,
            maxWidth: 480,
          }}>
            Verify in 3 minutes. Cash out in 5. No phone calls, no "send me proof", no drama.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
            <button className="btn-shine" style={{
              fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700,
              color: '#9FE870', background: '#21241D',
              padding: '20px 32px', borderRadius: 999,
              border: '2px solid #21241D',
              boxShadow: '5px 5px 0 0 #21241D',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              Create account <Ic name="arrow" size={18} sw={2.4}/>
            </button>
            <button style={{
              fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700,
              color: '#21241D',
              padding: '20px 28px', borderRadius: 999,
              background: 'transparent',
              border: '2px solid #21241D',
            }}>
              Talk to us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { t: 'Product', l: ['Buy stables', 'Sell stables', 'Swap', 'Mobile app', 'Pricing'] },
    { t: 'Company', l: ['About', 'Careers', 'Press', 'Contact', 'Status'] },
    { t: 'Resources', l: ['Help center', 'Rate alerts', 'Developer API', 'System status', 'Security'] },
    { t: 'Legal', l: ['Terms', 'Privacy', 'AML/CFT', 'NDPR', 'Cookie policy'] },
  ];
  return (
    <footer style={{ background: '#21241D', color: '#FAFAF7', padding: '80px 32px 40px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 48, marginBottom: 64,
        }}>
          <div>
            <ClusteerWordmark size={28} color="#FAFAF7"/>
            <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.6, color: 'rgba(250,250,247,0.6)', maxWidth: 280 }}>
              Stablecoins to naira, fast. Built for traders, freelancers, and anyone moving money in and out of Nigeria.
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(159,232,112,0.12)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 500,
              color: '#9FE870',
            }}>
              <span className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#9FE870' }}/>
              All systems operational
            </div>
          </div>
          {cols.map((c, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600,
                color: 'rgba(250,250,247,0.4)', letterSpacing: 1.5, marginBottom: 16,
              }}>
                {c.t.toUpperCase()}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.l.map((it, j) => (
                  <li key={j}>
                    <a style={{ fontSize: 14, color: 'rgba(250,250,247,0.75)' }}>{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 28, borderTop: '1px solid rgba(250,250,247,0.10)',
          fontSize: 12, color: 'rgba(250,250,247,0.5)', flexWrap: 'wrap', gap: 16,
        }}>
          <span>© 2025 Clusteer Technologies Ltd. RC: 2049871. Lagos, Nigeria.</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>v3.2.1 · build 4f8a92</span>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <div>
      <Nav/>
      <Hero/>
      <BankMarquee/>
      <HowItWorks/>
      <Stats/>
      <AppShowcase/>
      <Trust/>
      <FinalCTA/>
      <Footer/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
