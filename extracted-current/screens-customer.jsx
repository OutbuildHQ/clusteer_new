// Clusteer — Screens (marketing, auth, dashboard, trade, assets, KYC, settings, support)
const { useState: uS1 } = React;

/* ========== MARKETING LANDING ========== */
const MarketingLanding = () => (
  <div style={{width:1280,minHeight:800,background:'var(--cl-bg)',color:'var(--cl-text)',fontFamily:'var(--cl-font-sans)'}}>
    {/* Nav */}
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 48px',borderBottom:'1px solid var(--cl-line)'}}>
      <Logo/>
      <div style={{display:'flex',gap:28,fontSize:14,color:'var(--cl-text-2)'}}>
        <span>Markets</span><span>Trade</span><span>Company</span><span>Developers</span><span>Help</span>
      </div>
      <div style={{display:'flex',gap:10}}>
        <Button variant="ghost" size="sm">Log in</Button>
        <Button size="sm">Create account</Button>
      </div>
    </div>
    {/* Hero */}
    <div style={{padding:'72px 48px 48px',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:64,alignItems:'center'}}>
      <div>
        <Badge tone="brand" dot>Live on TRON · BSC · Solana</Badge>
        <h1 style={{marginTop:16,fontSize:68,lineHeight:1.02,letterSpacing:'-0.04em',fontWeight:650}}>
          Stablecoins,<br/>at Naira speed.
        </h1>
        <p style={{marginTop:20,fontSize:17,maxWidth:460,color:'var(--cl-text-2)'}}>
          Buy, sell, hold and move USDT across chains with bank-grade custody, BVN-verified KYC, and instant settlement via Paystack, Flutterwave and VFD.
        </p>
        <div style={{display:'flex',gap:12,marginTop:28}}>
          <Button size="lg" iconRight="arrowRight">Get started — 2 min</Button>
          <Button size="lg" variant="secondary" icon="play">View live rates</Button>
        </div>
        <div style={{display:'flex',gap:24,marginTop:32,alignItems:'center',color:'var(--cl-text-3)',fontSize:12}}>
          <span>TRUSTED BY</span>
          <span style={{fontWeight:600,color:'var(--cl-text-2)'}}>Paystack</span>
          <span style={{fontWeight:600,color:'var(--cl-text-2)'}}>Flutterwave</span>
          <span style={{fontWeight:600,color:'var(--cl-text-2)'}}>VFD Bank</span>
          <span style={{fontWeight:600,color:'var(--cl-text-2)'}}>Smile ID</span>
        </div>
      </div>
      {/* Hero card */}
      <Card pad={0} style={{overflow:'hidden'}}>
        <div style={{padding:'20px 24px',borderBottom:'1px solid var(--cl-line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <Tabs tabs={[{key:'buy',label:'Buy'},{key:'sell',label:'Sell'},{key:'swap',label:'Swap'}]} active="buy" onChange={()=>{}} variant="pill"/>
          </div>
          <Badge tone="up" dot>Live rate</Badge>
        </div>
        <div style={{padding:24}}>
          <Field label="You pay">
            <div style={{display:'flex',alignItems:'center',gap:10,height:64,padding:'0 16px',background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)'}}>
              <AssetLogo symbol="NGN" size={32}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:'var(--cl-text-3)'}}>NGN · Naira</div>
                <Num size={24} weight={600}>₦ 500,000</Num>
              </div>
              <Badge tone="neutral">MAX</Badge>
            </div>
          </Field>
          <div style={{display:'flex',justifyContent:'center',margin:'-6px 0'}}>
            <div style={{width:36,height:36,background:'var(--cl-surface)',border:'1px solid var(--cl-line)',borderRadius:'var(--cl-r-md)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2,position:'relative'}}>
              <Icon name="arrowDown" size={16}/>
            </div>
          </div>
          <Field label="You receive">
            <div style={{display:'flex',alignItems:'center',gap:10,height:64,padding:'0 16px',background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)'}}>
              <AssetLogo symbol="USDT" size={32}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:'var(--cl-text-3)'}}>USDT · Tether</div>
                <Num size={24} weight={600}>306.24</Num>
              </div>
              <ChainBadge chain="TRC-20"/>
            </div>
          </Field>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:14,fontSize:13}}>
            <span style={{color:'var(--cl-text-3)'}}>Rate</span>
            <Num color="var(--cl-text-2)">1 USDT = ₦1,632.50</Num>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontSize:13}}>
            <span style={{color:'var(--cl-text-3)'}}>Fee · Settlement</span>
            <span style={{color:'var(--cl-text-2)'}}><Num>₦750</Num> · ≤ 5 min</span>
          </div>
          <Button full size="lg" style={{marginTop:18}}>Continue</Button>
        </div>
      </Card>
    </div>
    {/* Stats strip */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid var(--cl-line)',borderBottom:'1px solid var(--cl-line)'}}>
      {[
        {k:'₦42.8B',v:'Volume settled (30d)'},
        {k:'186k',v:'Verified accounts'},
        {k:'< 5 min',v:'Average settlement'},
        {k:'99.98%',v:'Uptime · last 90d'},
      ].map((s,i)=>(
        <div key={i} style={{padding:'28px 32px',borderLeft:i?'1px solid var(--cl-line)':'none'}}>
          <Num size={28} weight={600}>{s.k}</Num>
          <div style={{fontSize:13,color:'var(--cl-text-3)',marginTop:4}}>{s.v}</div>
        </div>
      ))}
    </div>
    {/* Feature grid */}
    <div style={{padding:'72px 48px'}}>
      <h2 style={{fontSize:40,letterSpacing:'-0.03em'}}>Everything stablecoin, nothing in the way.</h2>
      <p style={{marginTop:10,maxWidth:520}}>Built to be regulated-grade and still feel like sending money to a friend.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginTop:40}}>
        {[
          {i:'wallet',t:'Multi-chain custody',d:'Hold USDT on TRON, BSC and Solana. One balance, one-click between chains.'},
          {i:'shieldCheck',t:'BVN / NIN verified',d:'Smile ID primary, Youverify backup. KYC decisions in seconds.'},
          {i:'zap',t:'Instant Naira',d:'Paystack, Flutterwave and VFD virtual accounts. Card ≤ 5 min, bank ≤ 15.'},
          {i:'swap',t:'Cross-chain USDT',d:'Move stables between chains without gas mathematics. Fee shown upfront.'},
          {i:'users',t:'P2P to a username',d:'Send USDT to anyone on Clusteer — no address, no network friction.'},
          {i:'chart',t:'Fair, transparent rates',d:'Spread and fees published in system preferences. Always visible at checkout.'},
        ].map((f,i)=>(
          <Card key={i}>
            <div style={{width:40,height:40,borderRadius:'var(--cl-r-md)',background:'var(--cl-brand-50)',color:'var(--cl-brand-500)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icon name={f.i} size={20}/>
            </div>
            <h3 style={{marginTop:16,fontSize:17}}>{f.t}</h3>
            <p style={{marginTop:6,fontSize:14}}>{f.d}</p>
          </Card>
        ))}
      </div>
    </div>
    {/* CTA strip */}
    <div style={{margin:'0 48px 48px',padding:'56px',background:'var(--cl-text)',color:'var(--cl-bg)',borderRadius:'var(--cl-r-xl)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div>
        <h2 style={{fontSize:36,color:'inherit'}}>Ready in 2 minutes.</h2>
        <p style={{color:'rgba(255,255,255,0.65)',marginTop:8}}>Create your account, complete BVN verification, receive your first USDT.</p>
      </div>
      <Button size="lg" variant="primary" iconRight="arrowRight">Open free account</Button>
    </div>
    <div style={{padding:'32px 48px',borderTop:'1px solid var(--cl-line)',display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--cl-text-3)'}}>
      <span>© 2026 Clusteer Technologies · NDPR compliant</span>
      <span>Status · Privacy · Terms · Security</span>
    </div>
  </div>
);

/* ========== AUTH ========== */
const AuthFrame = ({ children, title, subtitle, step }) => (
  <div style={{width:520,minHeight:680,background:'var(--cl-surface)',padding:48,display:'flex',flexDirection:'column',fontFamily:'var(--cl-font-sans)',color:'var(--cl-text)'}}>
    <Logo/>
    {step && <div style={{marginTop:32}}><Steps steps={['Account','Verify email','KYC','Ready']} current={step}/></div>}
    <div style={{marginTop:step?32:64}}>
      <h2 style={{fontSize:26,letterSpacing:'-0.02em'}}>{title}</h2>
      {subtitle && <p style={{marginTop:8,fontSize:14}}>{subtitle}</p>}
    </div>
    <div style={{marginTop:28,display:'flex',flexDirection:'column',gap:14,flex:1}}>{children}</div>
  </div>
);

const AuthSignup = () => (
  <AuthFrame title="Create your Clusteer account" subtitle="Stablecoins and Naira, in one secure wallet." step={0}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
      <Field label="First name"><Input value="Adaeze" onChange={()=>{}}/></Field>
      <Field label="Last name"><Input value="Okoye" onChange={()=>{}}/></Field>
    </div>
    <Field label="Email"><Input icon="mail" value="adaeze@mail.com" onChange={()=>{}}/></Field>
    <Field label="Phone (Nigerian)"><Input icon="phone" value="+234 803 000 0000" onChange={()=>{}}/></Field>
    <Field label="Password" hint="At least 12 chars, 1 number, 1 symbol."><Input icon="lock" type="password" value="••••••••••••" onChange={()=>{}}/></Field>
    <label style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:13,color:'var(--cl-text-2)',marginTop:4}}>
      <input type="checkbox" defaultChecked/> I agree to the Terms, Privacy and NDPR data handling policy.
    </label>
    <Button size="lg" full style={{marginTop:8}}>Create account</Button>
    <div style={{textAlign:'center',fontSize:13,color:'var(--cl-text-3)'}}>Already have an account? <span style={{color:'var(--cl-brand-500)',fontWeight:500}}>Log in</span></div>
  </AuthFrame>
);

const AuthOTP = () => (
  <AuthFrame title="Verify your email" subtitle="We sent a 6-digit code to adaeze@mail.com." step={1}>
    <div style={{display:'flex',gap:10,marginTop:12}}>
      {['3','9','7','2','4','·'].map((n,i)=>(
        <div key={i} style={{
          width:56,height:64,borderRadius:'var(--cl-r-md)',
          border:`2px solid ${i===5?'var(--cl-brand-500)':'var(--cl-line)'}`,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:28,fontFamily:'var(--cl-font-mono)',fontWeight:500
        }}>{n==='·'?<span style={{color:'var(--cl-brand-500)'}}>|</span>:n}</div>
      ))}
    </div>
    <div style={{fontSize:13,color:'var(--cl-text-3)',marginTop:10}}>Code expires in <span className="mono" style={{color:'var(--cl-text)'}}>14:37</span></div>
    <Button full size="lg" style={{marginTop:20}}>Verify & continue</Button>
    <div style={{fontSize:13,color:'var(--cl-text-3)',textAlign:'center'}}>Didn't receive it? <span style={{color:'var(--cl-brand-500)'}}>Resend</span> or <span style={{color:'var(--cl-brand-500)'}}>try SMS</span></div>
  </AuthFrame>
);

const Auth2FA = () => (
  <AuthFrame title="Two-factor authentication" subtitle="Enter the 6-digit code from your authenticator app.">
    <div style={{background:'var(--cl-info-soft)',padding:14,borderRadius:'var(--cl-r-md)',display:'flex',gap:10,fontSize:13,color:'var(--cl-info)'}}>
      <Icon name="shieldCheck" size={16}/> Extra layer active on this account.
    </div>
    <div style={{display:'flex',gap:10,marginTop:18}}>
      {['1','4','8','0','2','6'].map((n,i)=>(
        <div key={i} style={{
          width:56,height:64,borderRadius:'var(--cl-r-md)',
          border:'1px solid var(--cl-line)',background:'var(--cl-surface-2)',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:28,fontFamily:'var(--cl-font-mono)',fontWeight:500
        }}>{n}</div>
      ))}
    </div>
    <label style={{display:'flex',alignItems:'center',gap:10,fontSize:13,color:'var(--cl-text-2)'}}>
      <input type="checkbox"/> Trust this device for 30 days
    </label>
    <Button full size="lg">Sign in</Button>
    <div style={{fontSize:13,color:'var(--cl-brand-500)',textAlign:'center'}}>Use recovery code instead</div>
  </AuthFrame>
);

/* ========== DASHBOARD SHELL ========== */
const Sidebar = ({ active = 'dashboard' }) => {
  const items = [
    {k:'dashboard',l:'Overview',i:'dashboard'},
    {k:'assets',l:'Assets',i:'wallet'},
    {k:'trade',l:'Trade',i:'trade'},
    {k:'markets',l:'Markets',i:'chart'},
    {k:'orders',l:'Orders',i:'list'},
    {k:'tx',l:'Transactions',i:'layers'},
    {k:'support',l:'Support',i:'help'},
  ];
  const bottom = [
    {k:'settings',l:'Settings',i:'settings'},
  ];
  return (
    <div style={{width:240,background:'var(--cl-surface)',borderRight:'1px solid var(--cl-line)',display:'flex',flexDirection:'column',padding:'18px 14px'}}>
      <div style={{padding:'6px 8px 22px'}}><Logo/></div>
      {items.map(it => (
        <div key={it.k} style={{
          display:'flex',alignItems:'center',gap:12,padding:'9px 10px',borderRadius:'var(--cl-r-md)',
          background:active===it.k?'var(--cl-surface-2)':'transparent',
          color:active===it.k?'var(--cl-text)':'var(--cl-text-2)',
          fontSize:14,fontWeight:active===it.k?500:400,marginBottom:2,cursor:'pointer'
        }}>
          <Icon name={it.i} size={17} stroke={active===it.k?2:1.75}/>{it.l}
          {it.k==='orders' && <Badge tone="brand" style={{marginLeft:'auto',padding:'1px 6px',fontSize:11}}>3</Badge>}
        </div>
      ))}
      <div style={{flex:1}}/>
      {bottom.map(it => (
        <div key={it.k} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 10px',borderRadius:'var(--cl-r-md)',color:'var(--cl-text-2)',fontSize:14,cursor:'pointer'}}>
          <Icon name={it.i} size={17}/>{it.l}
        </div>
      ))}
      <Card pad={12} style={{marginTop:12,background:'var(--cl-surface-2)',border:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Avatar name="Adaeze Okoye" size={32}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:500,overflow:'hidden',textOverflow:'ellipsis'}}>Adaeze Okoye</div>
            <div style={{fontSize:11,color:'var(--cl-text-3)',display:'flex',alignItems:'center',gap:4}}>
              <span style={{width:5,height:5,borderRadius:999,background:'var(--cl-up)'}}/> Verified
            </div>
          </div>
          <Icon name="chevronRight" size={14} style={{color:'var(--cl-text-3)'}}/>
        </div>
      </Card>
    </div>
  );
};

const Topbar = ({ title, crumbs }) => (
  <div style={{height:64,borderBottom:'1px solid var(--cl-line)',padding:'0 28px',display:'flex',alignItems:'center',gap:16,background:'var(--cl-surface)'}}>
    <div style={{flex:1}}>
      <div style={{fontSize:12,color:'var(--cl-text-3)'}}>{crumbs}</div>
      <div style={{fontSize:18,fontWeight:600,letterSpacing:'-0.01em'}}>{title}</div>
    </div>
    <div style={{width:320}}><Input icon="search" placeholder="Search transactions, assets, users…" onChange={()=>{}}/></div>
    <Button variant="secondary" size="sm" icon="plus">Deposit</Button>
    <div style={{width:36,height:36,borderRadius:'var(--cl-r-md)',border:'1px solid var(--cl-line)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
      <Icon name="bell" size={17}/>
      <div style={{position:'absolute',top:8,right:8,width:7,height:7,borderRadius:999,background:'var(--cl-down)'}}/>
    </div>
  </div>
);

const DashboardOverview = () => {
  const data = [45,48,52,49,55,61,64,60,66,72,70,76,82,79,85,88,92,95,93,99,102,108,110,112];
  return (
    <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
      {/* Balance hero */}
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:20,marginBottom:20}}>
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:13,color:'var(--cl-text-3)'}}>Total balance</div>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginTop:4}}>
                <Num size={36} weight={650}>₦ 4,182,550.40</Num>
                <Badge tone="up" dot>+ 3.42% · 24h</Badge>
              </div>
              <div style={{fontSize:13,color:'var(--cl-text-3)',marginTop:4}}>≈ <Num>2,563.20 USDT</Num> · across 4 chains</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Button icon="plus" size="sm">Deposit</Button>
              <Button icon="send" size="sm" variant="secondary">Send</Button>
              <Button icon="swap" size="sm" variant="secondary">Swap</Button>
            </div>
          </div>
          <div style={{marginTop:16}}>
            <LineChart data={data} width={720} height={180}/>
          </div>
          <div style={{display:'flex',gap:8,marginTop:8}}>
            {['1D','1W','1M','3M','1Y','ALL'].map((p,i)=>(
              <div key={i} style={{padding:'4px 10px',fontSize:12,borderRadius:'var(--cl-r-sm)',
                background:i===2?'var(--cl-surface-2)':'transparent',
                color:i===2?'var(--cl-text)':'var(--cl-text-3)',cursor:'pointer'}}>{p}</div>
            ))}
          </div>
        </Card>
        <Card pad={0}>
          <div style={{padding:20,borderBottom:'1px solid var(--cl-line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3>Quick actions</h3><span style={{fontSize:12,color:'var(--cl-text-3)'}}>Most used</span>
          </div>
          <div style={{padding:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
            {[
              {i:'arrowDown',l:'Buy USDT',s:'Paystack · VFD'},
              {i:'arrowUp',l:'Sell USDT',s:'To bank account'},
              {i:'send',l:'Send P2P',s:'Username or ID'},
              {i:'swap',l:'Cross-chain',s:'TRC ↔ BEP ↔ SOL'},
            ].map((a,i)=>(
              <div key={i} style={{padding:14,borderRadius:'var(--cl-r-md)',border:'1px solid var(--cl-line)',cursor:'pointer'}}>
                <div style={{width:30,height:30,borderRadius:'var(--cl-r-sm)',background:'var(--cl-brand-50)',color:'var(--cl-brand-500)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon name={a.i} size={16}/>
                </div>
                <div style={{fontSize:13,fontWeight:500,marginTop:10}}>{a.l}</div>
                <div style={{fontSize:11,color:'var(--cl-text-3)',marginTop:2}}>{a.s}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* Assets row */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
        <Card pad={0}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3>Your assets</h3>
            <Tabs tabs={[{key:'all',label:'All'},{key:'crypto',label:'Crypto'},{key:'fiat',label:'Fiat'}]} active="all" onChange={()=>{}} variant="pill"/>
          </div>
          <Table
            columns={[
              {label:'Asset',render:r=>(<div style={{display:'flex',alignItems:'center',gap:10}}><AssetLogo symbol={r.sym} size={28}/><div><div style={{fontWeight:500}}>{r.name}</div><div style={{fontSize:12,color:'var(--cl-text-3)'}}>{r.sym}</div></div></div>)},
              {label:'Network',render:r=>r.chain?<ChainBadge chain={r.chain}/>:<span style={{fontSize:12,color:'var(--cl-text-3)'}}>—</span>},
              {label:'Price',align:'right',render:r=>r.price?<Num>{r.price}</Num>:<span style={{fontSize:12,color:'var(--cl-text-3)'}}>—</span>},
              {label:'24h',align:'right',render:r=>r.chg?<span className={r.chg>0?'cl-up':'cl-down'}><Num>{r.chg>0?'+':''}{r.chg}%</Num></span>:<span style={{fontSize:12,color:'var(--cl-text-3)'}}>—</span>},
              {label:'Balance',align:'right',render:r=>(<div><Num weight={500}>{r.bal}</Num><div style={{fontSize:12,color:'var(--cl-text-3)'}}><Num>{r.fiat}</Num></div></div>)},
              {label:'',align:'right',render:r=>(<Button size="sm" variant="ghost" iconRight="chevronRight" style={{padding:'0 6px'}}></Button>)},
            ]}
            rows={[
              {sym:'USDT',name:'Tether USD',chain:'TRC-20',price:'₦1,632.50',chg:0.12,bal:'1,840.50',fiat:'₦3,003,799.25'},
              {sym:'USDT',name:'Tether USD',chain:'BEP-20',price:'₦1,632.50',chg:0.12,bal:'520.00',fiat:'₦848,900.00'},
              {sym:'USDT',name:'Tether USD',chain:'SOL',price:'₦1,632.50',chg:0.12,bal:'202.70',fiat:'₦330,906.25'},
              {sym:'NGN',name:'Naira balance',bal:'₦ 0.00',fiat:'Available'},
            ]}
          />
        </Card>
        <Card>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h3>Recent activity</h3><span style={{fontSize:12,color:'var(--cl-brand-500)',cursor:'pointer'}}>View all</span>
          </div>
          <div style={{marginTop:12,display:'flex',flexDirection:'column'}}>
            {[
              {i:'arrowDownLeft',t:'Received USDT',s:'TRC-20 · from Tobi',a:'+120.00 USDT',c:'var(--cl-up)',time:'2m ago'},
              {i:'arrowUpRight',t:'Sold USDT',s:'Payout to GTB',a:'- 500.00 USDT',c:'var(--cl-down)',time:'14m ago'},
              {i:'swap',t:'Cross-chain',s:'TRC → BEP',a:'200.00 USDT',c:'var(--cl-text-2)',time:'1h ago'},
              {i:'arrowDown',t:'Bought USDT',s:'Paystack · card',a:'+ 306.24 USDT',c:'var(--cl-up)',time:'Yesterday'},
              {i:'send',t:'P2P to @chidi',s:'BEP-20',a:'- 50.00 USDT',c:'var(--cl-down)',time:'Yesterday'},
            ].map((a,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:i<4?'1px solid var(--cl-line)':'none'}}>
                <div style={{width:32,height:32,borderRadius:'var(--cl-r-md)',background:'var(--cl-surface-2)',color:a.c,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Icon name={a.i} size={15}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500}}>{a.t}</div>
                  <div style={{fontSize:12,color:'var(--cl-text-3)'}}>{a.s}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:13,color:a.c}}><Num>{a.a}</Num></div>
                  <div style={{fontSize:11,color:'var(--cl-text-3)'}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ========== TRADE ========== */
const TradeScreen = () => {
  const candles = Array.from({length:40},(_,i) => {
    const base = 1620 + Math.sin(i/3)*12 + i*0.5;
    const o = base + (Math.random()-.5)*4;
    const c = o + (Math.random()-.5)*8;
    return { o, c, h:Math.max(o,c)+Math.random()*4, l:Math.min(o,c)-Math.random()*4 };
  });
  return (
    <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:20}}>
        {/* Chart side */}
        <Card pad={0}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:16}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <AssetLogo symbol="USDT" size={32}/>
              <div>
                <div style={{fontWeight:600,fontSize:16}}>USDT / NGN</div>
                <div style={{fontSize:12,color:'var(--cl-text-3)'}}>Tether · Nigerian Naira</div>
              </div>
            </div>
            <div style={{marginLeft:'auto',display:'flex',alignItems:'baseline',gap:10}}>
              <Num size={22} weight={600}>₦1,632.50</Num>
              <Badge tone="up" dot>+0.12%</Badge>
            </div>
          </div>
          <div style={{padding:'10px 20px',display:'flex',gap:6,borderBottom:'1px solid var(--cl-line)',alignItems:'center'}}>
            {['1H','4H','1D','1W','1M'].map((t,i)=>(
              <div key={i} style={{padding:'4px 10px',fontSize:12,borderRadius:'var(--cl-r-sm)',
                background:i===2?'var(--cl-surface-2)':'transparent',color:i===2?'var(--cl-text)':'var(--cl-text-3)'}}>{t}</div>
            ))}
            <div style={{flex:1}}/>
            <Icon name="sliders" size={14} style={{color:'var(--cl-text-3)'}}/>
          </div>
          <div style={{padding:'16px 10px'}}>
            <CandleChart width={720} height={260} candles={candles}/>
          </div>
          <div style={{padding:'12px 20px 20px',borderTop:'1px solid var(--cl-line)',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
            {[
              {l:'24h volume',v:'₦428.3M'},
              {l:'24h high',v:'₦1,644.10'},
              {l:'24h low',v:'₦1,610.20'},
              {l:'Market cap',v:'$120.5B'},
            ].map((k,i)=>(
              <div key={i}><div style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{k.l}</div><Num size={15} weight={500} style={{marginTop:4,display:'block'}}>{k.v}</Num></div>
            ))}
          </div>
        </Card>
        {/* Trade form */}
        <Card pad={0}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--cl-line)'}}>
            <Tabs tabs={[{key:'buy',label:'Buy'},{key:'sell',label:'Sell'},{key:'swap',label:'Swap'}]} active="buy" onChange={()=>{}}/>
          </div>
          <div style={{padding:20,display:'flex',flexDirection:'column',gap:14}}>
            <Field label="You pay">
              <div style={{display:'flex',alignItems:'center',gap:10,height:64,padding:'0 14px',background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)'}}>
                <AssetLogo symbol="NGN" size={28}/>
                <div style={{flex:1}}>
                  <Num size={22} weight={600}>500,000</Num>
                </div>
                <span style={{fontSize:13,color:'var(--cl-text-2)'}}>NGN</span>
              </div>
            </Field>
            <Field label="You receive">
              <div style={{display:'flex',alignItems:'center',gap:10,height:64,padding:'0 14px',background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)'}}>
                <AssetLogo symbol="USDT" size={28}/>
                <div style={{flex:1}}>
                  <Num size={22} weight={600}>306.24</Num>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2}}>
                  <span style={{fontSize:13,color:'var(--cl-text-2)'}}>USDT</span>
                  <ChainBadge chain="TRC-20"/>
                </div>
              </div>
            </Field>
            <Field label="Payment method">
              <div style={{display:'flex',alignItems:'center',gap:10,height:52,padding:'0 14px',border:'1px solid var(--cl-line)',borderRadius:'var(--cl-r-md)'}}>
                <div style={{width:28,height:28,borderRadius:'var(--cl-r-sm)',background:'#0AA8E6',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>PS</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>Paystack · card</div>
                  <div style={{fontSize:11,color:'var(--cl-text-3)'}}>Visa •••• 4432 · settles ≤ 5 min</div>
                </div>
                <Icon name="chevronDown" size={16} style={{color:'var(--cl-text-3)'}}/>
              </div>
            </Field>
            <div style={{background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)',padding:14,fontSize:13}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:'var(--cl-text-3)'}}>Rate</span><Num>1 USDT = ₦1,632.50</Num></div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:'var(--cl-text-3)'}}>Platform fee (0.35%)</span><Num>₦1,750.00</Num></div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{color:'var(--cl-text-3)'}}>Network confirmations</span><span>6</span></div>
              <div style={{height:1,background:'var(--cl-line)',margin:'10px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:600}}><span>Total</span><Num>₦500,000</Num></div>
            </div>
            <Button size="lg" full>Review & pay</Button>
            <div style={{fontSize:11,color:'var(--cl-text-3)',textAlign:'center',marginTop:-4}}>Daily limit: <Num>₦5,000,000</Num> · <span style={{color:'var(--cl-brand-500)'}}>Increase</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ========== ASSET · RECEIVE ========== */
const ReceiveScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
      <Card>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <AssetLogo symbol="USDT" size={40}/>
          <div>
            <div style={{fontSize:18,fontWeight:600}}>Receive USDT</div>
            <div style={{fontSize:13,color:'var(--cl-text-3)'}}>Select a network, then share your address</div>
          </div>
        </div>
        <div style={{marginTop:20,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          {[
            {c:'TRC-20',fee:'0.5 USDT',label:'TRON',recommended:true},
            {c:'BEP-20',fee:'0.2 USDT',label:'BNB Smart Chain'},
            {c:'SOL',fee:'0.05 USDT',label:'Solana'},
          ].map((n,i)=>(
            <div key={i} style={{padding:14,borderRadius:'var(--cl-r-md)',border:`2px solid ${n.recommended?'var(--cl-brand-500)':'var(--cl-line)'}`,background:n.recommended?'var(--cl-brand-50)':'transparent',cursor:'pointer'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <ChainBadge chain={n.c}/>
                {n.recommended && <Badge tone="brand" style={{fontSize:10}}>Recommended</Badge>}
              </div>
              <div style={{fontSize:13,fontWeight:500,marginTop:8}}>{n.label}</div>
              <div style={{fontSize:11,color:'var(--cl-text-3)',marginTop:2}}>Network fee · <Num>{n.fee}</Num></div>
            </div>
          ))}
        </div>
        <div style={{marginTop:20,background:'var(--cl-warn-soft)',padding:14,borderRadius:'var(--cl-r-md)',display:'flex',gap:10,fontSize:13,color:'var(--cl-warn)'}}>
          <Icon name="alert" size={16} style={{flexShrink:0,marginTop:1}}/>
          <div><b>Only send USDT on TRC-20.</b> Funds sent on another network to this address will be lost.</div>
        </div>
      </Card>
      <Card>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'16px 0'}}>
          <QR data="TRC20UsdtAddress123" size={200}/>
          <div style={{marginTop:18,fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>Your TRC-20 address</div>
          <div style={{marginTop:6,padding:'10px 14px',background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)',display:'flex',gap:10,alignItems:'center'}}>
            <Num size={13}>TXYZ8k...yQpL3aRv</Num>
            <Icon name="copy" size={15} style={{color:'var(--cl-text-3)',cursor:'pointer'}}/>
          </div>
          <div style={{display:'flex',gap:8,marginTop:16}}>
            <Button size="sm" variant="secondary" icon="copy">Copy address</Button>
            <Button size="sm" variant="secondary" icon="download">Save QR</Button>
            <Button size="sm" variant="secondary" icon="send">Share</Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

/* ========== KYC ========== */
const KYCScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:20}}>
      <Card>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <h2 style={{fontSize:22}}>Identity verification</h2>
            <p style={{marginTop:6,fontSize:14}}>Verify to unlock trading, withdrawals, and higher limits. Powered by Smile ID.</p>
          </div>
          <Badge tone="warn" dot>Tier 1 · Unverified</Badge>
        </div>
        <div style={{marginTop:24}}>
          <Steps steps={['Identity','Selfie','Address proof','Review']} current={1}/>
        </div>
        <div style={{marginTop:28,padding:20,border:'1px solid var(--cl-line)',borderRadius:'var(--cl-r-md)'}}>
          <Field label="Government ID type">
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {['BVN (11 digits)','NIN (11 digits)','International passport'].map((t,i)=>(
                <div key={i} style={{padding:14,borderRadius:'var(--cl-r-md)',border:`2px solid ${i===0?'var(--cl-brand-500)':'var(--cl-line)'}`,cursor:'pointer',background:i===0?'var(--cl-brand-50)':'transparent'}}>
                  <Icon name={i===2?'file':'card'} size={18}/>
                  <div style={{fontSize:13,fontWeight:500,marginTop:10}}>{t}</div>
                </div>
              ))}
            </div>
          </Field>
          <div style={{marginTop:16}}>
            <Field label="BVN number" hint="We never store your BVN in plain text. Encrypted with Fernet at rest.">
              <Input icon="lock" value="•• • • • • • • 427" onChange={()=>{}} suffix="11/11"/>
            </Field>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:14}}>
            <Field label="Date of birth"><Input icon="calendar" value="14 / 05 / 1996" onChange={()=>{}}/></Field>
            <Field label="Phone on BVN"><Input icon="phone" value="+234 803 000 0000" onChange={()=>{}}/></Field>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:22}}>
          <Button variant="ghost">Back</Button>
          <Button iconRight="arrowRight">Verify identity</Button>
        </div>
      </Card>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <Card>
          <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
            <div style={{width:36,height:36,borderRadius:'var(--cl-r-md)',background:'var(--cl-up-soft)',color:'var(--cl-up)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="shieldCheck" size={18}/></div>
            <div>
              <div style={{fontSize:14,fontWeight:600}}>NDPR-aligned handling</div>
              <p style={{fontSize:13,marginTop:4}}>BVN/NIN encrypted with Fernet. Documents stored in Firebase Storage with signed URLs. Full audit trail via KYCAuditLog.</p>
            </div>
          </div>
        </Card>
        <Card>
          <h3 style={{fontSize:15}}>Tiers & limits</h3>
          <div style={{marginTop:14,display:'flex',flexDirection:'column',gap:10}}>
            {[
              {t:'Tier 0 · Email',d:'₦0 trade · view only',done:true},
              {t:'Tier 1 · BVN/NIN',d:'Up to ₦5M / day · active',done:false,current:true},
              {t:'Tier 2 · Address',d:'Up to ₦50M / day'},
              {t:'Tier 3 · Pro',d:'Unlimited · institutional'},
            ].map((row,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:10,borderRadius:'var(--cl-r-sm)',background:row.current?'var(--cl-brand-50)':'transparent'}}>
                <div style={{width:22,height:22,borderRadius:999,background:row.done?'var(--cl-up)':row.current?'var(--cl-brand-500)':'var(--cl-surface-3)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {row.done && <Icon name="check" size={12} stroke={3}/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{row.t}</div>
                  <div style={{fontSize:11,color:'var(--cl-text-3)'}}>{row.d}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

/* ========== SETTINGS ========== */
const SettingsScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%',display:'grid',gridTemplateColumns:'220px 1fr',gap:20}}>
    <Card pad={8}>
      {[
        {i:'user',l:'Profile',active:false},
        {i:'shield',l:'Security',active:true},
        {i:'bell',l:'Notifications'},
        {i:'card',l:'Payment methods'},
        {i:'lock',l:'Privacy & data'},
        {i:'sliders',l:'Limits'},
      ].map((s,i)=>(
        <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'10px 12px',borderRadius:'var(--cl-r-md)',background:s.active?'var(--cl-surface-2)':'transparent',fontSize:14,fontWeight:s.active?500:400,color:s.active?'var(--cl-text)':'var(--cl-text-2)',cursor:'pointer'}}>
          <Icon name={s.i} size={16}/>{s.l}
        </div>
      ))}
    </Card>
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <Card>
        <SectionHead title="Password & sign-in" subtitle="Keep your sign-in credentials fresh and unique."/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <Field label="Current password"><Input type="password" value="••••••••" onChange={()=>{}}/></Field>
          <Field label="New password"><Input type="password" value="••••••••••" onChange={()=>{}}/></Field>
        </div>
        <div style={{marginTop:14,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 16px',background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)'}}>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <Icon name="clock" size={16} style={{color:'var(--cl-text-3)'}}/>
            <div style={{fontSize:13}}>Last changed 47 days ago</div>
          </div>
          <Button size="sm">Update password</Button>
        </div>
      </Card>
      <Card>
        <SectionHead title="Two-factor authentication" subtitle="Protect your account against password breaches."
          actions={<Badge tone="up" dot>Enabled</Badge>}/>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            {t:'Authenticator app',d:'Google Authenticator · added 12 Mar',on:true,i:'shieldCheck'},
            {t:'Email OTP',d:'adaeze@mail.com',on:true,i:'mail'},
            {t:'SMS (backup)',d:'+234 803 •••• 000',on:false,i:'phone'},
          ].map((r,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',border:'1px solid var(--cl-line)',borderRadius:'var(--cl-r-md)'}}>
              <div style={{width:32,height:32,borderRadius:'var(--cl-r-md)',background:'var(--cl-surface-2)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={r.i} size={16}/></div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500}}>{r.t}</div>
                <div style={{fontSize:12,color:'var(--cl-text-3)'}}>{r.d}</div>
              </div>
              <div style={{width:40,height:22,borderRadius:999,background:r.on?'var(--cl-brand-500)':'var(--cl-surface-3)',position:'relative'}}>
                <div style={{position:'absolute',top:2,left:r.on?20:2,width:18,height:18,borderRadius:999,background:'#fff',boxShadow:'var(--cl-shadow-1)',transition:'left .15s'}}/>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <SectionHead title="Wallet PIN" subtitle="Required for withdrawals, external sends, and cross-chain swaps."
          actions={<Badge tone="up" dot>Set</Badge>}/>
        <div style={{display:'flex',gap:8,marginTop:4}}>
          {[1,1,1,1].map((_,i)=>(
            <div key={i} style={{width:48,height:56,borderRadius:'var(--cl-r-md)',background:'var(--cl-surface-2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{width:10,height:10,borderRadius:999,background:'var(--cl-text)'}}/>
            </div>
          ))}
          <div style={{flex:1}}/>
          <Button variant="secondary" size="sm">Change PIN</Button>
          <Button variant="ghost" size="sm">Forgot?</Button>
        </div>
      </Card>
    </div>
  </div>
);

/* ========== SUPPORT TICKETS ========== */
const SupportScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:20}}>
      <Card pad={0}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:10}}>
          <Input icon="search" placeholder="Search tickets…" onChange={()=>{}} size="sm" style={{flex:1}}/>
          <Button size="sm" icon="plus"></Button>
        </div>
        {[
          {n:'TICK-20260421-08412',t:'Withdrawal stuck · BEP-20',s:'in-progress',time:'2h',tone:'warn'},
          {n:'TICK-20260420-07319',t:'BVN not matching',s:'open',time:'1d',tone:'info'},
          {n:'TICK-20260415-05044',t:'Bank payout delay · VFD',s:'resolved',time:'6d',tone:'up'},
          {n:'TICK-20260410-03102',t:'Enable cross-chain swap',s:'closed',time:'11d',tone:'neutral'},
        ].map((t,i)=>(
          <div key={i} style={{padding:'14px 16px',borderBottom:i<3?'1px solid var(--cl-line)':'none',background:i===0?'var(--cl-surface-2)':'transparent',cursor:'pointer'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Num size={11} color="var(--cl-text-3)">{t.n}</Num>
              <Badge tone={t.tone} dot>{t.s}</Badge>
            </div>
            <div style={{fontSize:14,fontWeight:500,marginTop:6}}>{t.t}</div>
            <div style={{fontSize:12,color:'var(--cl-text-3)',marginTop:2}}>Last update · {t.time} ago</div>
          </div>
        ))}
      </Card>
      <Card pad={0}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:14}}>
          <div style={{flex:1}}>
            <Num size={11} color="var(--cl-text-3)">TICK-20260421-08412</Num>
            <div style={{fontSize:16,fontWeight:600,marginTop:4}}>Withdrawal stuck · BEP-20</div>
          </div>
          <Badge tone="warn" dot>in-progress</Badge>
          <Button size="sm" variant="secondary">Mark resolved</Button>
        </div>
        <div style={{padding:20,display:'flex',flexDirection:'column',gap:16,maxHeight:360,overflow:'auto'}}>
          {[
            {me:false,name:'Adaeze',text:'Hi — I sent 200 USDT from Binance to my Clusteer BEP-20 address 2 hours ago. It shows confirmed on-chain but my Clusteer balance hasn\'t updated.',time:'2h ago',hash:'0x8a…d3c2'},
            {me:true,name:'Emeka · Support',text:'Thanks Adaeze, I can see the deposit. Our webhook did fire but the balance update task retried. Re-running now — should appear in under 2 minutes.',time:'1h ago'},
            {me:false,name:'Adaeze',text:'Thank you — balance is in. Closing out 🙏',time:'20m ago'},
          ].map((m,i)=>(
            <div key={i} style={{display:'flex',gap:10,flexDirection:m.me?'row-reverse':'row'}}>
              <Avatar name={m.name} size={32}/>
              <div style={{maxWidth:'75%'}}>
                <div style={{fontSize:12,color:'var(--cl-text-3)',textAlign:m.me?'right':'left'}}>{m.name} · {m.time}</div>
                <div style={{marginTop:4,padding:'10px 14px',background:m.me?'var(--cl-brand-500)':'var(--cl-surface-2)',color:m.me?'#fff':'var(--cl-text)',borderRadius:'var(--cl-r-md)',fontSize:14}}>
                  {m.text}
                  {m.hash && <div style={{fontSize:11,marginTop:6,padding:'6px 8px',background:'rgba(11,18,32,0.06)',borderRadius:'var(--cl-r-sm)',fontFamily:'var(--cl-font-mono)'}}>Hash · {m.hash}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:'14px 20px',borderTop:'1px solid var(--cl-line)',display:'flex',gap:10,alignItems:'center'}}>
          <Input placeholder="Write a reply…" onChange={()=>{}} style={{flex:1}}/>
          <Icon name="file" size={18} style={{color:'var(--cl-text-3)'}}/>
          <Button size="md" icon="send">Send</Button>
        </div>
      </Card>
    </div>
  </div>
);

Object.assign(window, {
  MarketingLanding, AuthSignup, AuthOTP, Auth2FA,
  Sidebar, Topbar, DashboardOverview, TradeScreen,
  ReceiveScreen, KYCScreen, SettingsScreen, SupportScreen
});
