// Clusteer — Extended screens: flows, details, empty states, mobile parity, admin deep cuts

/* ========== LOGIN ========== */
const AuthLogin = () => (
  <AuthFrame title="Welcome back" subtitle="Sign in to your Clusteer wallet.">
    <Field label="Email or username"><Input icon="mail" value="adaeze@mail.com" onChange={()=>{}}/></Field>
    <Field label="Password"><Input icon="lock" type="password" value="••••••••••" onChange={()=>{}}/></Field>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13}}>
      <label style={{display:'flex',alignItems:'center',gap:8,color:'var(--cl-text-2)'}}>
        <input type="checkbox" defaultChecked/> Keep me signed in
      </label>
      <span style={{color:'var(--cl-brand-500)',cursor:'pointer'}}>Forgot password?</span>
    </div>
    <Button full size="lg">Sign in</Button>
    <div style={{position:'relative',textAlign:'center',margin:'8px 0'}}>
      <div style={{position:'absolute',top:'50%',left:0,right:0,height:1,background:'var(--cl-line)'}}/>
      <span style={{position:'relative',background:'var(--cl-surface)',padding:'0 12px',fontSize:12,color:'var(--cl-text-3)'}}>OR</span>
    </div>
    <Button full size="lg" variant="secondary" icon="key">Sign in with passkey</Button>
    <div style={{textAlign:'center',fontSize:13,color:'var(--cl-text-3)'}}>New to Clusteer? <span style={{color:'var(--cl-brand-500)',fontWeight:500}}>Create account</span></div>
  </AuthFrame>
);

const AuthForgot = () => (
  <AuthFrame title="Reset your password" subtitle="Enter your email and we'll send a secure reset link.">
    <Field label="Email"><Input icon="mail" value="adaeze@mail.com" onChange={()=>{}}/></Field>
    <Card pad={14} style={{background:'var(--cl-info-soft)',border:'none'}}>
      <div style={{display:'flex',gap:10,fontSize:13,color:'var(--cl-info)'}}>
        <Icon name="info" size={16} style={{flexShrink:0,marginTop:1}}/>
        <div>For security, withdrawals are disabled for 24h after a password reset.</div>
      </div>
    </Card>
    <Button full size="lg">Send reset link</Button>
    <div style={{textAlign:'center',fontSize:13,color:'var(--cl-brand-500)'}}>Back to sign in</div>
  </AuthFrame>
);

/* ========== DASHBOARD · EMPTY STATE ========== */
const DashboardEmpty = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <Card pad={32} style={{textAlign:'center'}}>
      <div style={{width:60,height:60,borderRadius:'var(--cl-r-lg)',background:'var(--cl-brand-50)',color:'var(--cl-brand-500)',display:'inline-flex',alignItems:'center',justifyContent:'center',margin:'0 auto'}}>
        <Icon name="wallet" size={28}/>
      </div>
      <h2 style={{marginTop:20,fontSize:24}}>Welcome to Clusteer</h2>
      <p style={{marginTop:8,maxWidth:480,margin:'8px auto 0'}}>Finish these 3 steps to start trading USDT at Naira speed.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginTop:28,maxWidth:860,margin:'28px auto 0'}}>
        {[
          {i:'shieldCheck',t:'Verify BVN',d:'≈ 60 seconds',done:true},
          {i:'card',t:'Add a payment method',d:'Paystack · VFD · bank',done:false,active:true},
          {i:'arrowDown',t:'Make your first deposit',d:'From ₦1,000',done:false},
        ].map((s,i)=>(
          <div key={i} style={{padding:20,textAlign:'left',borderRadius:'var(--cl-r-lg)',border:`2px solid ${s.active?'var(--cl-brand-500)':'var(--cl-line)'}`,background:s.active?'var(--cl-brand-50)':'var(--cl-surface)'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:28,height:28,borderRadius:999,background:s.done?'var(--cl-up)':'var(--cl-surface-3)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {s.done ? <Icon name="check" size={14} stroke={3}/> : <span style={{fontSize:12,fontWeight:600}}>{i+1}</span>}
              </div>
              <div style={{fontWeight:600,fontSize:15}}>{s.t}</div>
            </div>
            <div style={{fontSize:13,color:'var(--cl-text-3)',marginTop:8}}>{s.d}</div>
            {s.active && <Button size="sm" style={{marginTop:12}}>Continue →</Button>}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

/* ========== ASSET DETAIL ========== */
const AssetDetailScreen = () => {
  const data = Array.from({length: 30}, (_,i) => 1620 + Math.sin(i/3)*20 + i);
  return (
    <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <AssetLogo symbol="USDT" size={40}/>
        <div style={{flex:1}}>
          <div style={{fontSize:22,fontWeight:650}}>Tether (USDT)</div>
          <div style={{display:'flex',gap:8,marginTop:4}}>
            <ChainBadge chain="TRC-20"/>
            <ChainBadge chain="BEP-20"/>
            <ChainBadge chain="SOL"/>
          </div>
        </div>
        <Button icon="arrowDown">Buy</Button>
        <Button variant="secondary" icon="arrowUp">Sell</Button>
        <Button variant="secondary" icon="send">Send</Button>
        <Button variant="secondary" icon="swap">Swap</Button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
        <Card>
          <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between'}}>
            <div>
              <Num size={36} weight={650}>₦1,632.50</Num>
              <Badge tone="up" dot style={{marginLeft:10}}>+0.12% · 24h</Badge>
            </div>
            <Tabs tabs={[{key:'1d',label:'1D'},{key:'1w',label:'1W'},{key:'1m',label:'1M'},{key:'1y',label:'1Y'}]} active="1m" onChange={()=>{}} variant="pill"/>
          </div>
          <div style={{marginTop:16}}>
            <LineChart data={data} width={720} height={220}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginTop:20,paddingTop:20,borderTop:'1px solid var(--cl-line)'}}>
            {[{l:'Market cap',v:'$120.5B'},{l:'Circulating',v:'120.5B USDT'},{l:'24h volume',v:'$42.1B'},{l:'All-time high',v:'$1.01'}].map((k,i)=>(
              <div key={i}><div style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{k.l}</div><Num size={15} weight={500} style={{marginTop:4,display:'block'}}>{k.v}</Num></div>
            ))}
          </div>
        </Card>
        <Card>
          <h3>Your holdings</h3>
          <Num size={28} weight={650} style={{marginTop:8,display:'block'}}>2,563.20 USDT</Num>
          <div style={{fontSize:13,color:'var(--cl-text-3)'}}>≈ <Num>₦4,182,550</Num></div>
          <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:10}}>
            {[
              {c:'TRC-20',b:'1,840.50',pct:72,col:'var(--cl-chain-tron)'},
              {c:'BEP-20',b:'520.00',pct:20,col:'var(--cl-chain-bsc)'},
              {c:'SOL',b:'202.70',pct:8,col:'var(--cl-chain-sol)'},
            ].map((r,i)=>(
              <div key={i}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4,fontSize:13}}>
                  <ChainBadge chain={r.c}/>
                  <Num weight={500}>{r.b}</Num>
                </div>
                <Progress value={r.pct} color={r.col}/>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ========== TRANSACTION DETAIL DRAWER ========== */
const TxDetail = () => (
  <div style={{width:480,height:720,background:'var(--cl-surface)',borderLeft:'1px solid var(--cl-line)',boxShadow:'var(--cl-shadow-3)',padding:24,display:'flex',flexDirection:'column'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{fontSize:13,color:'var(--cl-text-3)'}}>Transaction</div>
      <Icon name="close" size={18} style={{color:'var(--cl-text-3)',cursor:'pointer'}}/>
    </div>
    <div style={{marginTop:16,display:'flex',alignItems:'center',gap:12}}>
      <div style={{width:48,height:48,borderRadius:'var(--cl-r-lg)',background:'var(--cl-up-soft)',color:'var(--cl-up)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Icon name="arrowDownLeft" size={24}/>
      </div>
      <div>
        <div style={{fontSize:13,color:'var(--cl-text-3)'}}>Received USDT</div>
        <Num size={24} weight={650}>+ 1,200.00 USDT</Num>
        <div style={{fontSize:13,color:'var(--cl-text-3)'}}>≈ <Num>₦1,958,000</Num></div>
      </div>
    </div>
    <div style={{marginTop:20,padding:16,background:'var(--cl-surface-2)',borderRadius:'var(--cl-r-md)'}}>
      <Steps steps={['Broadcast','Confirming','Credited']} current={2}/>
      <div style={{fontSize:12,color:'var(--cl-text-3)',marginTop:10}}>Confirmed at 14:22:08 · 6 / 6 blocks</div>
    </div>
    <div style={{marginTop:20,fontSize:13,display:'flex',flexDirection:'column',gap:12}}>
      {[
        ['Status','Confirmed'],
        ['Network','TRC-20'],
        ['From','TXNh…K9pL'],
        ['To (your address)','TXYZ…aRv'],
        ['Tx hash','0xa84f3c…d2e1'],
        ['Network fee','0.5 USDT'],
        ['Platform fee','0.00 USDT'],
        ['Clusteer ref','CL-DEP-88121'],
        ['Submitted','14:18:02'],
        ['Confirmed','14:22:08'],
      ].map(([k,v],i)=>(
        <div key={i} style={{display:'flex',justifyContent:'space-between'}}>
          <span style={{color:'var(--cl-text-3)'}}>{k}</span>
          <span style={{fontFamily: /^0x|^T|^5|^3|^CL/.test(v)?'var(--cl-font-mono)':'inherit'}}>{v}</span>
        </div>
      ))}
    </div>
    <div style={{flex:1}}/>
    <div style={{display:'flex',gap:8,marginTop:16}}>
      <Button variant="secondary" icon="external" full>View on TRONSCAN</Button>
      <Button variant="secondary" icon="download">Receipt</Button>
    </div>
  </div>
);

/* ========== ORDERS ========== */
const OrdersScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <Card pad={0}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:10}}>
        <h3>Orders</h3>
        <Badge tone="brand">3 open</Badge>
        <div style={{flex:1}}/>
        <Tabs tabs={[{key:'all',label:'All'},{key:'open',label:'Open'},{key:'filled',label:'Filled'},{key:'cancelled',label:'Cancelled'}]} active="all" onChange={()=>{}} variant="pill"/>
      </div>
      <Table
        columns={[
          {label:'Order',render:r=>(<div><Num size={12} color="var(--cl-brand-600)">{r.id}</Num><div style={{fontSize:13,fontWeight:500,marginTop:2}}>{r.type}</div></div>)},
          {label:'Pair',render:r=>(<div style={{display:'flex',alignItems:'center',gap:8}}><AssetLogo symbol="USDT" size={22}/><span style={{fontSize:13}}>USDT / NGN</span></div>)},
          {label:'Side',render:r=><Badge tone={r.side==='Buy'?'up':'down'} dot>{r.side}</Badge>},
          {label:'Amount',align:'right',render:r=>(<div><Num weight={500}>{r.amt}</Num><div style={{fontSize:11,color:'var(--cl-text-3)'}}><Num>{r.fiat}</Num></div></div>)},
          {label:'Rate',align:'right',render:r=><Num>{r.rate}</Num>},
          {label:'Filled',render:r=>(<div style={{width:100}}><Progress value={r.fill}/><div style={{fontSize:11,color:'var(--cl-text-3)',marginTop:3}}>{r.fill}%</div></div>)},
          {label:'Status',render:r=><Badge tone={r.tone} dot>{r.status}</Badge>},
          {label:'',align:'right',render:()=><Button size="sm" variant="ghost">···</Button>},
        ]}
        rows={[
          {id:'ORD-102844',type:'Limit · Buy',side:'Buy',amt:'500.00 USDT',fiat:'₦816,250',rate:'₦1,632.50',fill:62,status:'Partially filled',tone:'warn'},
          {id:'ORD-102801',type:'Market · Sell',side:'Sell',amt:'200.00 USDT',fiat:'₦326,500',rate:'₦1,632.50',fill:100,status:'Filled',tone:'up'},
          {id:'ORD-102777',type:'Limit · Buy',side:'Buy',amt:'1,000.00 USDT',fiat:'₦1,624,000',rate:'₦1,624.00',fill:0,status:'Open',tone:'info'},
          {id:'ORD-102412',type:'Swap',side:'Buy',amt:'150.00 USDT',fiat:'₦244,875',rate:'—',fill:100,status:'Filled',tone:'up'},
          {id:'ORD-102010',type:'Market · Buy',side:'Buy',amt:'50.00 USDT',fiat:'₦81,625',rate:'₦1,632.50',fill:0,status:'Cancelled',tone:'neutral'},
        ]}
      />
    </Card>
  </div>
);

/* ========== TRANSACTIONS (customer) ========== */
const TxHistoryScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <Card pad={0}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:10}}>
        <h3>Transactions</h3>
        <div style={{flex:1}}/>
        <div style={{width:240}}><Input icon="search" placeholder="Search hash, asset…" size="sm" onChange={()=>{}}/></div>
        <Button size="sm" variant="secondary" icon="filter">Type · All</Button>
        <Button size="sm" variant="secondary" icon="calendar">Last 30 days</Button>
        <Button size="sm" variant="secondary" icon="download">Export CSV</Button>
      </div>
      <Table
        columns={[
          {label:'Date',render:r=><div style={{fontSize:13}}><div>{r.date}</div><div style={{fontSize:11,color:'var(--cl-text-3)'}}>{r.time}</div></div>},
          {label:'Activity',render:r=>(<div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:30,height:30,borderRadius:'var(--cl-r-md)',background:'var(--cl-surface-2)',color:r.color,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={r.i} size={15}/></div><div><div style={{fontSize:13,fontWeight:500}}>{r.t}</div><div style={{fontSize:11,color:'var(--cl-text-3)'}}>{r.s}</div></div></div>)},
          {label:'Amount',align:'right',render:r=>(<div><Num color={r.color} weight={500}>{r.amt}</Num><div style={{fontSize:11,color:'var(--cl-text-3)'}}><Num>{r.ngn}</Num></div></div>)},
          {label:'Ref',render:r=><Num size={11} color="var(--cl-brand-600)">{r.ref}</Num>},
          {label:'Status',render:r=><Badge tone={r.status==='Confirmed'?'up':r.status==='Pending'?'warn':'down'} dot>{r.status}</Badge>},
          {label:'',align:'right',render:()=><Icon name="chevronRight" size={14} style={{color:'var(--cl-text-3)'}}/>},
        ]}
        rows={[
          {date:'22 Apr',time:'14:22',i:'arrowDownLeft',color:'var(--cl-up)',t:'Received USDT',s:'TRC-20 · from 0xa84f',amt:'+ 1,200.00',ngn:'₦1,958,000',ref:'CL-DEP-88121',status:'Confirmed'},
          {date:'22 Apr',time:'14:19',i:'arrowUpRight',color:'var(--cl-down)',t:'Sold USDT',s:'Payout → GTB ****6789',amt:'- 500.00',ngn:'₦816,250',ref:'CL-SELL-19842',status:'Pending'},
          {date:'22 Apr',time:'14:16',i:'swap',color:'var(--cl-text-2)',t:'Cross-chain swap',s:'TRC → SOL',amt:'200.00',ngn:'₦326,500',ref:'CL-SWP-10291',status:'Confirmed'},
          {date:'21 Apr',time:'09:41',i:'arrowDown',color:'var(--cl-up)',t:'Bought USDT',s:'Paystack · card 4432',amt:'+ 306.24',ngn:'₦500,000',ref:'CL-BUY-77120',status:'Confirmed'},
          {date:'20 Apr',time:'18:22',i:'send',color:'var(--cl-down)',t:'Sent to @chidi',s:'BEP-20 · P2P',amt:'- 50.00',ngn:'₦81,625',ref:'CL-P2P-40112',status:'Confirmed'},
          {date:'18 Apr',time:'11:04',i:'arrowDown',color:'var(--cl-up)',t:'Bought USDT',s:'VFD virtual account',amt:'+ 612.50',ngn:'₦1,000,000',ref:'CL-BUY-77001',status:'Confirmed'},
        ]}
      />
      <div style={{padding:'12px 20px',borderTop:'1px solid var(--cl-line)',display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--cl-text-3)'}}>
        <span>Showing 6 of 248 · Apr 2026</span>
        <span>Total moved: <Num color="var(--cl-text)">₦12,682,375</Num></span>
      </div>
    </Card>
  </div>
);

/* ========== PAYMENT METHODS ========== */
const PaymentMethodsScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <Card>
      <SectionHead title="Payment methods" subtitle="Cards and bank accounts for buying and withdrawing"
        actions={<Button size="sm" icon="plus">Add method</Button>}/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        {[
          {b:'#0B5FFF',t:'Visa',n:'•••• 4432',s:'Exp 08/28 · Adaeze Okoye',p:'Paystack',d:true,i:'card'},
          {b:'#D1383F',t:'Mastercard',n:'•••• 0187',s:'Exp 11/27 · Adaeze Okoye',p:'Flutterwave',d:false,i:'card'},
          {b:'#00A86B',t:'GTB',n:'•••• 6789',s:'Savings · Adaeze Okoye',p:'Bank payout',d:false,i:'building'},
          {b:'#7C3AED',t:'VFD virtual',n:'9023 7711 04',s:'Auto-credit · settles instantly',p:'Deposit only',d:false,i:'building'},
        ].map((m,i)=>(
          <div key={i} style={{padding:18,borderRadius:'var(--cl-r-lg)',border:'1px solid var(--cl-line)',background:'var(--cl-surface)',position:'relative'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:40,height:40,borderRadius:'var(--cl-r-md)',background:m.b,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={m.i} size={18}/></div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{fontSize:14,fontWeight:600}}>{m.t}</div>
                  {m.d && <Badge tone="brand">Default</Badge>}
                </div>
                <Num size={13} color="var(--cl-text-2)">{m.n}</Num>
              </div>
              <Icon name="edit" size={15} style={{color:'var(--cl-text-3)',cursor:'pointer'}}/>
            </div>
            <div style={{marginTop:12,fontSize:12,color:'var(--cl-text-3)',display:'flex',justifyContent:'space-between'}}>
              <span>{m.s}</span>
              <Badge tone="neutral">{m.p}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

/* ========== SESSIONS / DEVICES ========== */
const SessionsScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <Card>
      <SectionHead title="Active sessions" subtitle="Devices currently signed in to your Clusteer account"
        actions={<Button size="sm" variant="danger" icon="logout">Sign out everywhere</Button>}/>
      {[
        {d:'MacBook Pro · Chrome 124',loc:'Lagos, Nigeria · 102.89.32.18',now:true,last:'Active now',i:'dashboard'},
        {d:'iPhone 15 · Clusteer iOS',loc:'Lagos, Nigeria · 105.112.44.2',now:false,last:'14 min ago',i:'phone'},
        {d:'Windows 11 · Edge 122',loc:'Abuja, Nigeria · 197.210.1.12',now:false,last:'3 days ago',i:'dashboard'},
      ].map((s,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'16px 0',borderBottom:i<2?'1px solid var(--cl-line)':'none'}}>
          <div style={{width:40,height:40,borderRadius:'var(--cl-r-md)',background:'var(--cl-surface-2)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={s.i} size={18}/></div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{fontSize:14,fontWeight:500}}>{s.d}</div>
              {s.now && <Badge tone="up" dot>This device</Badge>}
            </div>
            <div style={{fontSize:12,color:'var(--cl-text-3)',marginTop:3}}>{s.loc} · {s.last}</div>
          </div>
          {!s.now && <Button size="sm" variant="ghost">Sign out</Button>}
        </div>
      ))}
    </Card>
  </div>
);

/* ========== HELP CENTER ========== */
const HelpScreen = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{maxWidth:880,margin:'0 auto'}}>
      <div style={{textAlign:'center',padding:'24px 0 32px'}}>
        <h2 style={{fontSize:30}}>How can we help?</h2>
        <div style={{maxWidth:480,margin:'16px auto 0'}}>
          <Input icon="search" placeholder="Search articles, e.g. 'delayed withdrawal'" size="lg" onChange={()=>{}}/>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
        {[
          {i:'arrowDown',t:'Deposits',c:18},
          {i:'arrowUp',t:'Withdrawals',c:14},
          {i:'shieldCheck',t:'Identity & KYC',c:9},
          {i:'swap',t:'Cross-chain swaps',c:7},
          {i:'card',t:'Payment methods',c:12},
          {i:'lock',t:'Account & security',c:21},
        ].map((c,i)=>(
          <Card key={i} style={{cursor:'pointer'}}>
            <div style={{width:36,height:36,borderRadius:'var(--cl-r-md)',background:'var(--cl-brand-50)',color:'var(--cl-brand-500)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={c.i} size={18}/></div>
            <div style={{marginTop:14,fontSize:15,fontWeight:600}}>{c.t}</div>
            <div style={{fontSize:12,color:'var(--cl-text-3)',marginTop:4}}>{c.c} articles</div>
          </Card>
        ))}
      </div>
      <Card style={{marginTop:20}}>
        <SectionHead title="Popular articles"/>
        {[
          'My USDT deposit is taking longer than expected',
          'How do I find my BEP-20 deposit address?',
          'Why was my BVN rejected by Smile ID?',
          'How long do Naira payouts take?',
          'Why is my withdrawal PIN not working?',
        ].map((a,i,arr)=>(
          <div key={i} style={{padding:'14px 0',borderBottom:i<arr.length-1?'1px solid var(--cl-line)':'none',display:'flex',alignItems:'center',gap:10,cursor:'pointer'}}>
            <Icon name="file" size={16} style={{color:'var(--cl-text-3)'}}/>
            <span style={{flex:1,fontSize:14}}>{a}</span>
            <Icon name="chevronRight" size={14} style={{color:'var(--cl-text-3)'}}/>
          </div>
        ))}
      </Card>
    </div>
  </div>
);

/* ========== ADMIN · OPS DASHBOARD ========== */
const AdminOps = () => {
  const vol = Array.from({length:24},(_,i)=>40 + Math.sin(i/3)*12 + i*1.2);
  return (
    <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
        {[
          {l:'Volume · today',v:'₦842.1M',d:'+12.4% vs yesterday',tone:'up',i:'trend'},
          {l:'Active users · now',v:'2,184',d:'Peak 3,421 · 13:22',tone:'brand',i:'users'},
          {l:'KYC queue',v:'24',d:'Oldest · 5h',tone:'warn',i:'shieldCheck'},
          {l:'Failed TX · 24h',v:'18',d:'0.32% of total',tone:'down',i:'alert'},
        ].map((k,i)=>(
          <Card key={i}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{width:34,height:34,borderRadius:'var(--cl-r-md)',background:'var(--cl-surface-2)',color:'var(--cl-text-2)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={k.i} size={16}/></div>
              <Badge tone={k.tone} dot>{k.d.split('·')[0].trim()}</Badge>
            </div>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em',marginTop:14}}>{k.l}</div>
            <Num size={28} weight={650} style={{marginTop:2,display:'block'}}>{k.v}</Num>
            <div style={{fontSize:11,color:'var(--cl-text-3)',marginTop:4}}>{k.d}</div>
          </Card>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
        <Card>
          <SectionHead title="Live volume · last 24 hours" subtitle="Buy, sell, swap · NGN equivalent"
            actions={<Badge tone="up" dot>Webhooks healthy</Badge>}/>
          <LineChart data={vol} width={720} height={200}/>
        </Card>
        <Card>
          <SectionHead title="System health"/>
          {[
            {s:'Paystack webhooks',v:'99.98%',t:'up'},
            {s:'Flutterwave webhooks',v:'99.92%',t:'up'},
            {s:'TRON RPC',v:'100%',t:'up'},
            {s:'BSC RPC',v:'99.78%',t:'up'},
            {s:'Solana RPC',v:'97.21%',t:'warn'},
            {s:'Smile ID',v:'99.4%',t:'up'},
          ].map((r,i,arr)=>(
            <div key={i} style={{padding:'10px 0',borderBottom:i<arr.length-1?'1px solid var(--cl-line)':'none',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:13}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:7,height:7,borderRadius:999,background:r.t==='up'?'var(--cl-up)':'var(--cl-warn)'}}/>{r.s}</div>
              <Num color={r.t==='up'?'var(--cl-up)':'var(--cl-warn)'}>{r.v}</Num>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ========== ADMIN · USER DETAIL ========== */
const AdminUserDetail = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:20}}>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <Card>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <Avatar name="Adaeze Okoye" size={52}/>
            <div style={{flex:1}}>
              <div style={{fontSize:20,fontWeight:650}}>Adaeze Okoye</div>
              <div style={{fontSize:13,color:'var(--cl-text-3)',marginTop:2}}>@adaeze · adaeze@mail.com · +234 803 000 0000</div>
              <div style={{display:'flex',gap:6,marginTop:8}}>
                <Badge tone="up" dot>Verified · T1</Badge>
                <Badge tone="neutral">🇳🇬 Lagos</Badge>
                <Badge tone="neutral">Joined 2 Mar 2026</Badge>
              </div>
            </div>
            <Button size="sm" variant="secondary" icon="message">Message</Button>
            <Button size="sm" variant="secondary" icon="sliders">Limits</Button>
            <Button size="sm" variant="danger" icon="lock">Freeze</Button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:20,paddingTop:20,borderTop:'1px solid var(--cl-line)'}}>
            {[
              {l:'Balance',v:'₦4.18M'},
              {l:'Lifetime volume',v:'₦48.2M'},
              {l:'Transactions',v:'248'},
              {l:'Risk score',v:'12 · Low',c:'var(--cl-up)'},
            ].map((k,i)=>(
              <div key={i}><div style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{k.l}</div><Num size={18} weight={600} color={k.c} style={{marginTop:4,display:'block'}}>{k.v}</Num></div>
            ))}
          </div>
        </Card>
        <Card pad={0}>
          <div style={{padding:'14px 20px',borderBottom:'1px solid var(--cl-line)'}}>
            <Tabs tabs={[{key:'a',label:'Activity'},{key:'b',label:'Balances'},{key:'c',label:'KYC'},{key:'d',label:'Sessions'},{key:'e',label:'Notes'}]} active="a" onChange={()=>{}}/>
          </div>
          <div style={{padding:'12px 4px'}}>
            <Table
              columns={[
                {label:'Time',render:r=><Num size={12} color="var(--cl-text-3)">{r.t}</Num>},
                {label:'Event',render:r=><span style={{fontSize:13}}>{r.e}</span>},
                {label:'Amount',align:'right',render:r=>r.a?<Num>{r.a}</Num>:<span style={{color:'var(--cl-text-3)'}}>—</span>},
                {label:'Status',render:r=><Badge tone={r.tone} dot>{r.s}</Badge>},
              ]}
              rows={[
                {t:'14:22',e:'Deposit USDT · TRC-20',a:'+ 1,200.00',s:'Confirmed',tone:'up'},
                {t:'14:19',e:'Withdraw NGN · GTB',a:'- ₦500,000',s:'Pending',tone:'warn'},
                {t:'09:41',e:'Signed in · MacBook',a:'',s:'Safe',tone:'info'},
                {t:'Yesterday',e:'Limit increase · ₦20M',a:'',s:'Approved',tone:'brand'},
              ]}
            />
          </div>
        </Card>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:20}}>
        <Card>
          <SectionHead title="Risk & compliance"/>
          <div style={{display:'flex',flexDirection:'column',gap:10,fontSize:13}}>
            {[
              ['Sanctions screening','Clear',true],
              ['PEP match','Clear',true],
              ['Duplicate BVN','None',true],
              ['Device fingerprint','Consistent',true],
              ['Velocity last 24h','Normal',true],
            ].map(([k,v,ok],i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'var(--cl-text-3)'}}>{k}</span><Badge tone={ok?'up':'warn'} dot>{v}</Badge></div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHead title="Notes & flags" actions={<Button size="sm" variant="ghost" icon="plus">Add</Button>}/>
          {[
            {t:'Increased daily limit to ₦20M',a:'Emeka O',time:'Yesterday'},
            {t:'Confirmed phone on call',a:'Ada N',time:'3d ago'},
          ].map((n,i)=>(
            <div key={i} style={{padding:'10px 0',borderTop:i?'1px solid var(--cl-line)':'none',fontSize:13}}>
              <div>{n.t}</div>
              <div style={{fontSize:11,color:'var(--cl-text-3)',marginTop:2}}>{n.a} · {n.time}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </div>
);

/* ========== ERROR / 404 ========== */
const ErrorPage = () => (
  <div style={{padding:60,background:'var(--cl-bg)',minHeight:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <div style={{textAlign:'center',maxWidth:480}}>
      <div style={{fontSize:140,fontWeight:700,letterSpacing:'-0.04em',background:'linear-gradient(135deg, var(--cl-brand-500), var(--cl-brand-800))',WebkitBackgroundClip:'text',color:'transparent',lineHeight:1}}>404</div>
      <h2 style={{fontSize:28,marginTop:8}}>We can't find that page.</h2>
      <p style={{marginTop:8}}>The link may be outdated, or you may not have access. Your balances and transactions are unaffected.</p>
      <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:24}}>
        <Button icon="dashboard">Back to dashboard</Button>
        <Button variant="secondary" icon="help">Contact support</Button>
      </div>
    </div>
  </div>
);

/* ========== TOAST STACK ========== */
const ToastStack = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%',display:'flex',flexDirection:'column',gap:10,maxWidth:420}}>
    <div style={{fontSize:13,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Toast states</div>
    {[
      {tone:'up',i:'check',t:'Deposit confirmed',d:'+ 1,200.00 USDT credited to your wallet.'},
      {tone:'warn',i:'clock',t:'Withdrawal pending',d:'GTB payout will settle in ≤ 15 minutes.'},
      {tone:'down',i:'alert',t:'Payment failed',d:'Card declined by bank. Try a different method.'},
      {tone:'info',i:'shieldCheck',t:'New sign-in',d:'Chrome · Lagos · just now. Not you?'},
      {tone:'brand',i:'zap',t:'Rate locked',d:'1 USDT = ₦1,632.50 · locked for 30 s.'},
    ].map((r,i)=>{
      const toneCol = {up:'--cl-up',warn:'--cl-warn',down:'--cl-down',info:'--cl-info',brand:'--cl-brand-500'}[r.tone];
      return (
        <div key={i} style={{display:'flex',gap:12,padding:14,background:'var(--cl-surface)',border:'1px solid var(--cl-line)',borderRadius:'var(--cl-r-md)',boxShadow:'var(--cl-shadow-2)',alignItems:'flex-start'}}>
          <div style={{width:28,height:28,borderRadius:'var(--cl-r-sm)',background:`var(${toneCol.replace('--cl-brand-500','--cl-brand-50')})`,color:`var(${toneCol})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <Icon name={r.i} size={14}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600}}>{r.t}</div>
            <div style={{fontSize:13,color:'var(--cl-text-2)',marginTop:2}}>{r.d}</div>
          </div>
          <Icon name="close" size={14} style={{color:'var(--cl-text-3)',cursor:'pointer'}}/>
        </div>
      );
    })}
  </div>
);

Object.assign(window, {
  AuthLogin, AuthForgot,
  DashboardEmpty, AssetDetailScreen, TxDetail, OrdersScreen, TxHistoryScreen,
  PaymentMethodsScreen, SessionsScreen, HelpScreen,
  AdminOps, AdminUserDetail,
  ErrorPage, ToastStack
});
