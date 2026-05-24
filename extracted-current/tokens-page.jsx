// Clusteer — Design system tokens page (presentation artboard)

const TokensPage = () => {
  const brandScale = [50,100,200,300,400,500,600,700,800,900];
  const semantic = [
    {n:'Up / success',v:'#00A86B',var:'--cl-up'},
    {n:'Down / error',v:'#E5484D',var:'--cl-down'},
    {n:'Warn',v:'#E8A53A',var:'--cl-warn'},
    {n:'Info',v:'#1B7EC2',var:'--cl-info'},
  ];
  const chains = [
    {n:'TRON',v:'#EF0027',var:'--cl-chain-tron'},
    {n:'BSC',v:'#F0B90B',var:'--cl-chain-bsc'},
    {n:'Solana',v:'#9945FF',var:'--cl-chain-sol'},
    {n:'Ethereum',v:'#627EEA',var:'--cl-chain-eth'},
    {n:'Tether',v:'#26A17B',var:'--cl-chain-usdt'},
  ];
  const radii = [
    {n:'xs',v:'4px'},{n:'sm',v:'6px'},{n:'md',v:'10px'},{n:'lg',v:'14px'},{n:'xl',v:'20px'},{n:'pill',v:'999px'}
  ];
  return (
    <div style={{width:1280,minHeight:800,padding:48,background:'var(--cl-bg)',fontFamily:'var(--cl-font-sans)',color:'var(--cl-text)'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',borderBottom:'1px solid var(--cl-line)',paddingBottom:28}}>
        <div>
          <Badge tone="brand" dot>Design System v1.0</Badge>
          <h1 style={{marginTop:14,fontSize:56,letterSpacing:'-0.035em'}}>Clusteer Foundations</h1>
          <p style={{marginTop:10,maxWidth:640,fontSize:16}}>A calm, bank-grade system for a Nigeria-first crypto-fiat exchange. Equal-weight light and dark. Deep institutional blue primary. Monospace for every numeral.</p>
        </div>
        <Logo size={40}/>
      </div>

      {/* Colors */}
      <section style={{marginTop:48}}>
        <SectionHead title="Brand scale" subtitle="Primary — #0B5FFF. Used sparingly for primary actions, active states, and focus."/>
        <div style={{display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:8}}>
          {brandScale.map(s=>(
            <div key={s}>
              <div style={{height:72,borderRadius:'var(--cl-r-md)',background:`var(--cl-brand-${s})`,boxShadow:'var(--cl-shadow-1)'}}/>
              <div style={{fontSize:11,marginTop:8,color:'var(--cl-text-3)'}}>brand-{s}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{marginTop:40,display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:20}}>
        <div>
          <SectionHead title="Semantic signals"/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {semantic.map(c=>(
              <Card key={c.n} pad={14}>
                <div style={{height:54,borderRadius:'var(--cl-r-sm)',background:c.v}}/>
                <div style={{fontSize:13,fontWeight:500,marginTop:10}}>{c.n}</div>
                <Num size={11} color="var(--cl-text-3)">{c.v}</Num>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <SectionHead title="Chain accents"/>
          <Card pad={14}>
            {chains.map((c,i)=>(
              <div key={c.n} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:i<chains.length-1?'1px solid var(--cl-line)':'none'}}>
                <div style={{width:22,height:22,borderRadius:999,background:c.v}}/>
                <span style={{flex:1,fontSize:13,fontWeight:500}}>{c.n}</span>
                <Num size={12} color="var(--cl-text-3)">{c.v}</Num>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section style={{marginTop:48}}>
        <SectionHead title="Type system" subtitle="Geist (Inter fallback) for everything; Geist Mono for every numeral, hash, address, and code."/>
        <Card>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr 220px',gap:24,alignItems:'baseline',padding:'10px 0',borderBottom:'1px solid var(--cl-line)'}}>
            <span style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Display · 68/72</span>
            <h1 style={{fontSize:68,letterSpacing:'-0.04em',lineHeight:1.02}}>Naira speed.</h1>
            <span style={{fontSize:12,color:'var(--cl-text-3)',fontFamily:'var(--cl-font-mono)'}}>weight 650 · tracking -0.04em</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr 220px',gap:24,alignItems:'baseline',padding:'14px 0',borderBottom:'1px solid var(--cl-line)'}}>
            <span style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>H1 · 44/48</span>
            <h1>Transfer stablecoins in seconds</h1>
            <span style={{fontSize:12,color:'var(--cl-text-3)',fontFamily:'var(--cl-font-mono)'}}>weight 650 · -0.035em</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr 220px',gap:24,alignItems:'baseline',padding:'14px 0',borderBottom:'1px solid var(--cl-line)'}}>
            <span style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>H2 · 28/34</span>
            <h2>Everything stablecoin, nothing in the way.</h2>
            <span style={{fontSize:12,color:'var(--cl-text-3)',fontFamily:'var(--cl-font-mono)'}}>weight 600 · -0.02em</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr 220px',gap:24,alignItems:'baseline',padding:'14px 0',borderBottom:'1px solid var(--cl-line)'}}>
            <span style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Body · 14/22</span>
            <p style={{fontSize:14}}>Buy, sell, hold and move USDT across chains with bank-grade custody and BVN-verified KYC.</p>
            <span style={{fontSize:12,color:'var(--cl-text-3)',fontFamily:'var(--cl-font-mono)'}}>weight 400 · -0.005em</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr 220px',gap:24,alignItems:'baseline',padding:'14px 0'}}>
            <span style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Mono · numerals</span>
            <Num size={24} weight={500}>₦1,632.50 · 306.240000 USDT · 0xa84f…3cd2</Num>
            <span style={{fontSize:12,color:'var(--cl-text-3)',fontFamily:'var(--cl-font-mono)'}}>tnum · zero</span>
          </div>
        </Card>
      </section>

      {/* Spacing, radius, shadow */}
      <section style={{marginTop:48,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
        <div>
          <SectionHead title="Radius"/>
          <Card>
            <div style={{display:'flex',alignItems:'flex-end',gap:14}}>
              {radii.map(r=>(
                <div key={r.n} style={{textAlign:'center'}}>
                  <div style={{width:54,height:54,background:'var(--cl-brand-500)',borderRadius:r.v}}/>
                  <div style={{fontSize:11,marginTop:8,color:'var(--cl-text-3)'}}>r-{r.n}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <SectionHead title="Spacing · 4pt"/>
          <Card>
            <div style={{display:'flex',alignItems:'flex-end',gap:8}}>
              {[4,8,12,16,20,24,32,40,48,64].map(s=>(
                <div key={s} style={{textAlign:'center'}}>
                  <div style={{width:s,height:64,background:'var(--cl-brand-300)',borderRadius:2}}/>
                  <div style={{fontSize:10,marginTop:6,color:'var(--cl-text-3)'}}>{s}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <SectionHead title="Elevation"/>
          <Card>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
              {['1','2','3'].map(n=>(
                <div key={n} style={{padding:14,borderRadius:'var(--cl-r-md)',background:'var(--cl-surface)',boxShadow:`var(--cl-shadow-${n})`,border:'1px solid var(--cl-line)'}}>
                  <div style={{fontSize:12,fontWeight:500}}>Shadow {n}</div>
                  <div style={{fontSize:10,color:'var(--cl-text-3)',marginTop:4}}>shadow-{n}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Components preview */}
      <section style={{marginTop:48}}>
        <SectionHead title="Components" subtitle="A working floor — everything below composes into every screen."/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <Card>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:12}}>Buttons</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="dark">Dark</Button>
              <Button variant="success" icon="check">Approve</Button>
              <Button variant="danger" icon="x">Reject</Button>
            </div>
            <div style={{display:'flex',gap:10,marginTop:14}}>
              <Button size="sm" icon="plus">Small</Button>
              <Button icon="send">Medium</Button>
              <Button size="lg" iconRight="arrowRight">Large</Button>
            </div>
          </Card>
          <Card>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:12}}>Badges</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
              <Badge dot>Neutral</Badge>
              <Badge tone="brand" dot>Live</Badge>
              <Badge tone="up" dot>Confirmed</Badge>
              <Badge tone="warn" dot>Pending</Badge>
              <Badge tone="down" dot>Failed</Badge>
              <Badge tone="info" dot>Info</Badge>
              <ChainBadge chain="TRC-20"/>
              <ChainBadge chain="BEP-20"/>
              <ChainBadge chain="SOL"/>
            </div>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em',margin:'18px 0 12px'}}>Inputs</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <Input icon="search" placeholder="Search" onChange={()=>{}}/>
              <Input icon="wallet" value="0xa84f…3cd2" suffix="TRC-20" onChange={()=>{}}/>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { TokensPage });
