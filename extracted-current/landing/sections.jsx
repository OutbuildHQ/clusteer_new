// Clusteer landing — sections
const { ClusteerMark, ClusteerWordmark, CoinUSDT, CoinUSDC, CoinNGN, Ic } = window;

// ─────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(250,250,247,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(33,36,29,0.06)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '18px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <ClusteerWordmark size={26}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 14, fontWeight: 500 }}>
          <a href="#how">How it works</a>
          <a href="#rates">Rates</a>
          <a href="#trust">Trust</a>
          <a href="#app">App</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{
            fontSize: 14, fontWeight: 600, color: '#21241D',
            padding: '10px 18px', borderRadius: 999,
          }}>Sign in</button>
          <button className="btn-shine" style={{
            fontSize: 14, fontWeight: 600, color: '#21241D',
            padding: '11px 20px', borderRadius: 999,
            background: '#9FE870',
            border: '1.5px solid #21241D',
            boxShadow: '3px 3px 0 0 #21241D',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            Get started <Ic name="arrow" size={14}/>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — oversized type, lime block, live rate card floating
// ─────────────────────────────────────────────────────────────
function Hero() {
  const [rate, setRate] = React.useState(1612.4);
  React.useEffect(() => {
    const id = setInterval(() => {
      setRate(r => Math.max(1605, Math.min(1620, r + (Math.random() - 0.5) * 0.6)));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{
      position: 'relative',
      padding: '64px 32px 120px',
      maxWidth: 1280, margin: '0 auto',
    }}>
      {/* announce pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '8px 14px 8px 8px', borderRadius: 999,
        background: '#fff',
        border: '1.5px solid #21241D',
        fontSize: 13, fontWeight: 500,
        marginBottom: 36,
        boxShadow: '2px 2px 0 0 #21241D',
      }}>
        <span style={{
          padding: '3px 10px', borderRadius: 999,
          background: '#9FE870', color: '#21241D',
          fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: 0.4,
        }}>NEW</span>
        Same-day USDC payouts to any Nigerian bank →
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 72, alignItems: 'center',
      }}>
        {/* left — type stack */}
        <div>
          <h1 className="f-display" style={{
            fontSize: 'clamp(56px, 7.2vw, 104px)',
            lineHeight: 0.92,
            letterSpacing: '-0.045em',
            fontWeight: 700,
            margin: 0, color: '#21241D',
          }}>
            Stables to{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ position: 'relative', zIndex: 2 }}>naira.</span>
              <span style={{
                position: 'absolute', left: -8, right: -8, bottom: 6, height: '38%',
                background: '#9FE870', zIndex: 1, borderRadius: 4,
                transform: 'rotate(-1deg)',
              }}/>
            </span>
            <br/>
            No drama.
          </h1>

          <p className="f-body" style={{
            marginTop: 28, fontSize: 19, lineHeight: 1.5, color: '#475467',
            maxWidth: 520, fontWeight: 400,
          }}>
            Off-ramp <strong style={{ color: '#21241D' }}>USDT and USDC</strong> straight to your Nigerian bank account at the best rate on the street. Settled in minutes, not days.
          </p>

          <div style={{ display: 'flex', gap: 14, marginTop: 36, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-shine" style={{
              fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700,
              color: '#21241D',
              padding: '18px 28px', borderRadius: 999,
              background: '#9FE870',
              border: '2px solid #21241D',
              boxShadow: '5px 5px 0 0 #21241D',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              Cash out now <Ic name="arrow" size={18} sw={2.4}/>
            </button>
            <button style={{
              fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 700,
              color: '#21241D',
              padding: '18px 24px', borderRadius: 999,
              background: 'transparent',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 999, background: '#21241D', color: '#9FE870',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Ic name="play" size={12} stroke="none"/>
              </span>
              See how it works
            </button>
          </div>

          {/* trust microcopy */}
          <div style={{
            display: 'flex', gap: 28, marginTop: 44, fontSize: 13, color: '#475467',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Ic name="check" size={14} stroke="#0F4F26" sw={2.6}/>
              <span><strong style={{ color: '#21241D' }}>NDPR</strong> compliant</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Ic name="check" size={14} stroke="#0F4F26" sw={2.6}/>
              <span><strong style={{ color: '#21241D' }}>92,000+</strong> Nigerians</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Ic name="check" size={14} stroke="#0F4F26" sw={2.6}/>
              <span><strong style={{ color: '#21241D' }}>5-min</strong> payouts</span>
            </div>
          </div>
        </div>

        {/* right — composed visual */}
        <HeroVisual rate={rate}/>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// HeroVisual — onyx slab + live rate card + floating coins
// ─────────────────────────────────────────────────────────────
function HeroVisual({ rate }) {
  const ngn = (rate * 1000).toLocaleString('en-NG', { maximumFractionDigits: 0 });

  return (
    <div style={{ position: 'relative', height: 540 }}>
      {/* onyx slab background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#21241D', borderRadius: 36,
        border: '2px solid #21241D',
        overflow: 'hidden',
      }}>
        {/* grid pattern */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.06 }} width="100%" height="100%">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#9FE870" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        {/* glow */}
        <div style={{
          position: 'absolute', top: -100, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(159,232,112,0.25) 0%, transparent 70%)',
        }}/>

        {/* eyebrow inside slab */}
        <div style={{
          position: 'absolute', top: 28, left: 32,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 500,
          color: '#9FE870', letterSpacing: 0.5,
        }}>
          <span className="live-dot" style={{
            width: 8, height: 8, borderRadius: '50%', background: '#9FE870',
            boxShadow: '0 0 12px #9FE870',
          }}/>
          LIVE — USDT / NGN
        </div>

        {/* big rate */}
        <div style={{
          position: 'absolute', top: 78, left: 32, right: 32,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div className="f-mono" style={{
            color: '#FAFAF7', fontSize: 88, fontWeight: 600,
            lineHeight: 1, letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            ₦{rate.toFixed(2)}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(250,250,247,0.6)', display: 'flex', alignItems: 'center', gap: 10 }}>
            per <span className="f-mono">1 USDT</span>
            <span style={{ color: '#9FE870', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
              ↑ 0.18%
            </span>
            <span>vs 1h ago</span>
          </div>
        </div>

        {/* mini chart */}
        <div style={{ position: 'absolute', bottom: 220, left: 32, right: 32, height: 80 }}>
          <MiniChart/>
        </div>

        {/* swap card embedded */}
        <div style={{
          position: 'absolute', bottom: 28, left: 28, right: 28,
          background: '#FAFAF7', borderRadius: 22, padding: 20,
          border: '1.5px solid #21241D',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: '#F0EBE6', borderRadius: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CoinUSDT size={32}/>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 600, color: '#21241D' }}>1,000.00</div>
                <div style={{ fontSize: 11, color: '#475467', fontWeight: 500 }}>You send · USDT</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: '#21241D', color: '#9FE870',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #FAFAF7',
            }}>
              <Ic name="arrow" size={16} sw={2.4}/>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: '#EFFCD0', borderRadius: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CoinNGN size={32}/>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 600, color: '#21241D' }}>{ngn}</div>
                <div style={{ fontSize: 11, color: '#0F4F26', fontWeight: 600 }}>You receive · NGN · GTBank ••3421</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating coin badges */}
      <div className="float-1" style={{
        position: 'absolute', top: -14, right: 40,
        background: '#fff', padding: '10px 14px', borderRadius: 999,
        border: '1.5px solid #21241D',
        boxShadow: '3px 3px 0 0 #21241D',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13,
      }}>
        <CoinUSDC size={22}/> USDC
      </div>
      <div className="float-2" style={{
        position: 'absolute', bottom: 80, left: -28,
        background: '#9FE870', padding: '10px 14px', borderRadius: 999,
        border: '1.5px solid #21241D',
        boxShadow: '3px 3px 0 0 #21241D',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13,
      }}>
        <Ic name="bolt" size={14}/> 4 min avg
      </div>
      <div className="float-3" style={{
        position: 'absolute', top: 220, right: -32,
        background: '#F0EBE6', padding: '10px 14px', borderRadius: 999,
        border: '1.5px solid #21241D',
        boxShadow: '3px 3px 0 0 #21241D',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 13,
      }}>
        <Ic name="shield" size={14}/> Bank-grade
      </div>
    </div>
  );
}

function MiniChart() {
  // pre-baked sparkline points
  const pts = [22, 28, 24, 30, 35, 32, 38, 42, 38, 45, 50, 48, 54, 58, 56, 62, 65, 60, 68, 72, 70, 75, 78];
  const w = 100, h = 100;
  const max = Math.max(...pts), min = Math.min(...pts);
  const path = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height="100%">
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#9FE870" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#9FE870" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)"/>
      <path d={path} stroke="#9FE870" strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
}

window.Nav = Nav;
window.Hero = Hero;
