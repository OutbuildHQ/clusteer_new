// Clusteer — Admin screens: users, KYC, wallets, transactions, orders, reports, CMS, audit

/* ========== ADMIN SHELL ========== */
const AdminSidebar = ({ active = 'users' }) => {
  const groups = [
    {label:'Operations',items:[
      {k:'dashboard',l:'Overview',i:'dashboard'},
      {k:'users',l:'Users',i:'users'},
      {k:'kyc',l:'KYC queue',i:'shieldCheck',badge:24},
      {k:'wallets',l:'Wallets',i:'wallet'},
      {k:'tx',l:'Transactions',i:'layers'},
      {k:'orders',l:'Orders',i:'list',badge:3},
      {k:'support',l:'Support',i:'message',badge:7},
    ]},
    {label:'Insight',items:[
      {k:'reports',l:'Reports',i:'chart'},
      {k:'audit',l:'Audit logs',i:'file'},
    ]},
    {label:'Platform',items:[
      {k:'cms',l:'CMS',i:'edit'},
      {k:'settings',l:'Settings',i:'settings'},
    ]},
  ];
  return (
    <div style={{width:240,background:'var(--cl-surface)',borderRight:'1px solid var(--cl-line)',display:'flex',flexDirection:'column',padding:'18px 14px'}}>
      <div style={{padding:'6px 8px 4px',display:'flex',alignItems:'center',gap:8}}><Logo/></div>
      <div style={{padding:'0 8px 18px',fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:500}}>Admin Console</div>
      {groups.map((g,gi)=>(
        <div key={gi} style={{marginBottom:8}}>
          <div style={{padding:'10px 10px 6px',fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.06em'}}>{g.label}</div>
          {g.items.map(it=>(
            <div key={it.k} style={{
              display:'flex',alignItems:'center',gap:12,padding:'8px 10px',borderRadius:'var(--cl-r-md)',
              background:active===it.k?'var(--cl-surface-2)':'transparent',
              color:active===it.k?'var(--cl-text)':'var(--cl-text-2)',
              fontSize:14,fontWeight:active===it.k?500:400,marginBottom:1,cursor:'pointer'
            }}>
              <Icon name={it.i} size={16}/>{it.l}
              {it.badge && <Badge tone={active===it.k?'brand':'neutral'} style={{marginLeft:'auto',padding:'1px 6px',fontSize:11}}>{it.badge}</Badge>}
            </div>
          ))}
        </div>
      ))}
      <div style={{flex:1}}/>
      <Card pad={10} style={{background:'var(--cl-surface-2)',border:'none'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Avatar name="Emeka O" size={28} color="#7C3AED"/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:500}}>Emeka Okafor</div>
            <div style={{fontSize:11,color:'var(--cl-text-3)'}}>Compliance · Admin</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const AdminTopbar = ({ title, actions }) => (
  <div style={{height:64,borderBottom:'1px solid var(--cl-line)',padding:'0 28px',display:'flex',alignItems:'center',gap:16,background:'var(--cl-surface)'}}>
    <div style={{flex:1}}>
      <div style={{fontSize:12,color:'var(--cl-text-3)'}}>Clusteer Admin</div>
      <div style={{fontSize:18,fontWeight:600}}>{title}</div>
    </div>
    <Badge tone="info" dot>Production</Badge>
    <div style={{width:280}}><Input icon="search" placeholder="Search user, tx, address…" onChange={()=>{}}/></div>
    {actions}
  </div>
);

/* ========== ADMIN · USERS ========== */
const AdminUsers = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
      {[
        {l:'Total users',v:'186,420',d:'+1.8% wk',tone:'up'},
        {l:'Verified (Tier 1+)',v:'142,310',d:'76.3%',tone:'neutral'},
        {l:'Active · 30d',v:'92,048',d:'+4.2% wk',tone:'up'},
        {l:'Flagged',v:'314',d:'Needs review',tone:'warn'},
      ].map((s,i)=>(
        <Card key={i}>
          <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{s.l}</div>
          <Num size={26} weight={650} style={{marginTop:4,display:'block'}}>{s.v}</Num>
          <div style={{marginTop:6}}><Badge tone={s.tone}>{s.d}</Badge></div>
        </Card>
      ))}
    </div>
    <Card pad={0}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:10}}>
        <h3>Users</h3>
        <div style={{flex:1}}/>
        <Tabs tabs={[{key:'all',label:'All 186k'},{key:'new',label:'New · 7d'},{key:'flag',label:'Flagged 314'},{key:'frozen',label:'Frozen 12'}]} active="all" onChange={()=>{}} variant="pill"/>
        <Button size="sm" variant="secondary" icon="filter">Filters</Button>
        <Button size="sm" variant="secondary" icon="download">Export</Button>
      </div>
      <Table
        columns={[
          {label:'User',render:r=>(<div style={{display:'flex',alignItems:'center',gap:10}}><Avatar name={r.name} size={32}/><div><div style={{fontWeight:500}}>{r.name}</div><div style={{fontSize:12,color:'var(--cl-text-3)'}}>@{r.handle} · {r.email}</div></div></div>)},
          {label:'Tier',render:r=>(<Badge tone={r.tier==='T3'?'brand':r.tier==='T2'?'up':r.tier==='T1'?'info':'neutral'}>{r.tier}</Badge>)},
          {label:'KYC',render:r=>(<Badge tone={r.kyc==='Verified'?'up':r.kyc==='Pending'?'warn':r.kyc==='Rejected'?'down':'neutral'} dot>{r.kyc}</Badge>)},
          {label:'Balance',align:'right',render:r=>(<Num>{r.bal}</Num>)},
          {label:'Country',render:r=>(<div style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}><span>🇳🇬</span>{r.loc}</div>)},
          {label:'Joined',render:r=>(<span style={{fontSize:13,color:'var(--cl-text-3)'}}>{r.joined}</span>)},
          {label:'Status',render:r=>(<Badge tone={r.status==='active'?'up':r.status==='frozen'?'down':'warn'} dot>{r.status}</Badge>)},
          {label:'',align:'right',render:()=>(<Icon name="chevronRight" size={16} style={{color:'var(--cl-text-3)'}}/>)},
        ]}
        rows={[
          {name:'Adaeze Okoye',handle:'adaeze',email:'adaeze@mail.com',tier:'T1',kyc:'Verified',bal:'₦4.18M',loc:'Lagos',joined:'2 Mar 2026',status:'active'},
          {name:'Chidi Eze',handle:'chidi',email:'chidi@proton.me',tier:'T2',kyc:'Verified',bal:'₦18.2M',loc:'Abuja',joined:'14 Feb 2026',status:'active'},
          {name:'Tobi Adebayo',handle:'tobi.a',email:'tobi@ikeja.ng',tier:'T0',kyc:'Pending',bal:'₦0',loc:'Ikeja',joined:'18 Apr 2026',status:'review'},
          {name:'Kemi Alabi',handle:'kemi',email:'kemi@gmail.com',tier:'T1',kyc:'Rejected',bal:'₦24k',loc:'PH',joined:'21 Apr 2026',status:'frozen'},
          {name:'Segun Bello',handle:'sb',email:'segun@outlook.com',tier:'T3',kyc:'Verified',bal:'₦212.4M',loc:'Lagos',joined:'8 Nov 2025',status:'active'},
          {name:'Ngozi Umeh',handle:'ngozi',email:'ngozi@mail.com',tier:'T1',kyc:'Verified',bal:'₦1.02M',loc:'Enugu',joined:'1 Apr 2026',status:'active'},
          {name:'Bola Raji',handle:'bola',email:'b.raji@domain.com',tier:'T2',kyc:'Verified',bal:'₦7.89M',loc:'Lagos',joined:'19 Jan 2026',status:'active'},
        ]}
      />
      <div style={{padding:'12px 20px',borderTop:'1px solid var(--cl-line)',display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--cl-text-3)'}}>
        <span>1–7 of 186,420</span>
        <div style={{display:'flex',gap:6}}>
          <Button size="sm" variant="secondary" icon="chevronLeft"></Button>
          <Button size="sm" variant="secondary" iconRight="chevronRight"></Button>
        </div>
      </div>
    </Card>
  </div>
);

/* ========== ADMIN · KYC QUEUE ========== */
const AdminKYC = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:20}}>
      <Card pad={0}>
        <div style={{padding:'14px 16px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:8}}>
          <h3>Pending · 24</h3>
          <div style={{flex:1}}/>
          <Icon name="filter" size={16} style={{color:'var(--cl-text-3)'}}/>
          <Icon name="sort" size={16} style={{color:'var(--cl-text-3)'}}/>
        </div>
        {[
          {n:'Tobi Adebayo',docs:'BVN + Selfie',age:'12m',tone:'warn',active:true,score:'83%'},
          {n:'Kemi Alabi',docs:'NIN + Utility',age:'44m',tone:'warn',score:'52%'},
          {n:'Ibrahim Musa',docs:'Passport',age:'2h',tone:'neutral',score:'91%'},
          {n:'Adanna Eze',docs:'BVN + Selfie',age:'3h',tone:'neutral',score:'78%'},
          {n:'Funke Oni',docs:'NIN + Selfie',age:'5h',tone:'neutral',score:'95%'},
        ].map((u,i)=>(
          <div key={i} style={{padding:'14px 16px',borderBottom:i<4?'1px solid var(--cl-line)':'none',background:u.active?'var(--cl-brand-50)':'transparent',cursor:'pointer',borderLeft:u.active?'3px solid var(--cl-brand-500)':'3px solid transparent'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <Avatar name={u.n} size={34}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:500}}>{u.n}</div>
                <div style={{fontSize:12,color:'var(--cl-text-3)'}}>{u.docs}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <Badge tone={u.tone}>{u.age}</Badge>
                <div style={{fontSize:11,marginTop:3,color:'var(--cl-text-3)'}}>Smile ID <Num>{u.score}</Num></div>
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Card pad={0}>
        <div style={{padding:'16px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:14}}>
          <Avatar name="Tobi Adebayo" size={44}/>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:600}}>Tobi Adebayo</div>
            <div style={{fontSize:13,color:'var(--cl-text-3)'}}>@tobi.a · tobi@ikeja.ng · submitted 12m ago</div>
          </div>
          <Badge tone="warn" dot>Awaiting review</Badge>
          <Button size="sm" variant="secondary">Assign</Button>
        </div>
        <div style={{padding:20,display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8}}>BVN details</div>
            <Card pad={14} style={{background:'var(--cl-surface-2)',border:'none'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,fontSize:13}}>
                <div><div style={{color:'var(--cl-text-3)',fontSize:11}}>BVN</div><Num>2234••••427</Num></div>
                <div><div style={{color:'var(--cl-text-3)',fontSize:11}}>Date of birth</div><span>14 May 1996</span></div>
                <div><div style={{color:'var(--cl-text-3)',fontSize:11}}>Name match</div><Badge tone="up" dot>Exact</Badge></div>
                <div><div style={{color:'var(--cl-text-3)',fontSize:11}}>Phone match</div><Badge tone="up" dot>Match</Badge></div>
                <div><div style={{color:'var(--cl-text-3)',fontSize:11}}>Smile ID score</div><Num color="var(--cl-up)">83% · pass</Num></div>
                <div><div style={{color:'var(--cl-text-3)',fontSize:11}}>Device risk</div><Badge tone="neutral">Low</Badge></div>
              </div>
            </Card>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em',margin:'18px 0 8px'}}>Audit trail</div>
            {[
              {t:'Submitted BVN',a:'User',time:'12m ago'},
              {t:'Smile ID returned 83%',a:'System',time:'12m ago'},
              {t:'Assigned to Emeka',a:'System',time:'11m ago'},
            ].map((l,i)=>(
              <div key={i} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:i<2?'1px solid var(--cl-line)':'none',fontSize:13}}>
                <div style={{width:6,height:6,borderRadius:999,background:'var(--cl-brand-500)',marginTop:7}}/>
                <div style={{flex:1}}><div>{l.t}</div><div style={{fontSize:11,color:'var(--cl-text-3)'}}>{l.a} · {l.time}</div></div>
              </div>
            ))}
          </div>
          <div>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em',marginBottom:8}}>Documents</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {['Selfie','ID front'].map((t,i)=>(
                <div key={i} style={{aspectRatio:'3/4',borderRadius:'var(--cl-r-md)',background:`linear-gradient(135deg, var(--cl-surface-2), var(--cl-surface-3))`,border:'1px solid var(--cl-line)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',color:'var(--cl-text-3)',position:'relative'}}>
                  <Icon name={i===0?'user':'card'} size={36}/>
                  <div style={{fontSize:12,marginTop:8}}>{t}</div>
                  <div style={{position:'absolute',top:8,right:8}}><Icon name="external" size={14}/></div>
                </div>
              ))}
            </div>
            <div style={{marginTop:14}}>
              <div style={{fontSize:12,color:'var(--cl-text-3)',marginBottom:6}}>Review note</div>
              <Input placeholder="Optional note for audit log…" onChange={()=>{}}/>
            </div>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <Button variant="success" icon="check" full>Approve</Button>
              <Button variant="danger" icon="x" full>Reject</Button>
              <Button variant="secondary" icon="refresh">Re-request</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

/* ========== ADMIN · TRANSACTIONS ========== */
const AdminTransactions = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <Card pad={0}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:10}}>
        <h3>Transactions</h3>
        <Badge tone="brand">Live</Badge>
        <div style={{flex:1}}/>
        <div style={{width:220}}><Input icon="search" placeholder="Hash, user, address…" size="sm" onChange={()=>{}}/></div>
        <Tabs tabs={[{key:'all',label:'All'},{key:'dep',label:'Deposits'},{key:'wd',label:'Withdrawals'},{key:'swap',label:'Swaps'},{key:'fail',label:'Failed'}]} active="all" onChange={()=>{}} variant="pill"/>
        <Button size="sm" variant="secondary" icon="calendar">Last 24h</Button>
        <Button size="sm" variant="secondary" icon="download">Export CSV</Button>
      </div>
      <Table
        columns={[
          {label:'Time',render:r=>(<div style={{fontSize:12}}><div>{r.time}</div><div style={{color:'var(--cl-text-3)'}}>{r.ago}</div></div>)},
          {label:'Type',render:r=>(<Badge tone={r.type==='Deposit'?'up':r.type==='Withdraw'?'down':'brand'} dot>{r.type}</Badge>)},
          {label:'Asset',render:r=>(<div style={{display:'flex',alignItems:'center',gap:8}}><AssetLogo symbol={r.sym} size={22}/><div><div style={{fontSize:13,fontWeight:500}}>{r.sym}</div></div><ChainBadge chain={r.chain}/></div>)},
          {label:'Amount',align:'right',render:r=>(<div><Num weight={500}>{r.amt}</Num><div style={{fontSize:11,color:'var(--cl-text-3)'}}><Num>{r.ngn}</Num></div></div>)},
          {label:'User',render:r=>(<div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.user} size={24}/><span style={{fontSize:13}}>{r.user}</span></div>)},
          {label:'Hash',render:r=>(<Num size={12} color="var(--cl-brand-600)">{r.hash}</Num>)},
          {label:'Status',render:r=>(<Badge tone={r.status==='Confirmed'?'up':r.status==='Pending'?'warn':r.status==='Failed'?'down':'neutral'} dot>{r.status}</Badge>)},
          {label:'',align:'right',render:()=>(<Icon name="external" size={14} style={{color:'var(--cl-text-3)'}}/>)},
        ]}
        rows={[
          {time:'14:22:08',ago:'2m',type:'Deposit',sym:'USDT',chain:'TRC-20',amt:'+ 1,200.00',ngn:'₦1,958,000',user:'Adaeze Okoye',hash:'0xa84f…3cd2',status:'Confirmed'},
          {time:'14:19:41',ago:'5m',type:'Withdraw',sym:'USDT',chain:'BEP-20',amt:'- 500.00',ngn:'₦816,250',user:'Chidi Eze',hash:'0xfe2c…9117',status:'Pending'},
          {time:'14:16:02',ago:'8m',type:'Swap',sym:'USDT',chain:'SOL',amt:'200.00',ngn:'₦326,500',user:'Segun Bello',hash:'5J8Tx…kL9',status:'Confirmed'},
          {time:'14:02:57',ago:'22m',type:'Deposit',sym:'USDT',chain:'TRC-20',amt:'+ 48.00',ngn:'₦78,360',user:'Ngozi Umeh',hash:'0x17ac…ee01',status:'Confirmed'},
          {time:'13:58:12',ago:'27m',type:'Withdraw',sym:'USDT',chain:'BEP-20',amt:'- 2,000.00',ngn:'₦3,265,000',user:'Bola Raji',hash:'0xbb21…04fa',status:'Failed'},
          {time:'13:41:44',ago:'43m',type:'Deposit',sym:'USDT',chain:'SOL',amt:'+ 76.40',ngn:'₦124,722',user:'Kemi Alabi',hash:'3Q9xa…mPt',status:'Confirmed'},
          {time:'13:22:10',ago:'1h',type:'Withdraw',sym:'NGN',chain:'Bank',amt:'- ₦500,000',ngn:'GTB · 0123456789',user:'Adaeze Okoye',hash:'PS-TX-88121',status:'Confirmed'},
        ]}
      />
    </Card>
  </div>
);

/* ========== ADMIN · WALLETS ========== */
const AdminWallets = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:20}}>
      {[
        {sym:'USDT',chain:'TRC-20',hot:'120,480',cold:'2,400,000',color:'var(--cl-chain-tron)',util:68},
        {sym:'USDT',chain:'BEP-20',hot:'48,920',cold:'1,200,000',color:'var(--cl-chain-bsc)',util:42},
        {sym:'USDT',chain:'SOL',hot:'18,200',cold:'540,000',color:'var(--cl-chain-sol)',util:28},
      ].map((w,i)=>(
        <Card key={i}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <AssetLogo symbol="USDT" size={32}/>
              <div>
                <div style={{fontWeight:600,fontSize:15}}>{w.sym}</div>
                <ChainBadge chain={w.chain}/>
              </div>
            </div>
            <Badge tone={w.util>60?'warn':'up'} dot>Hot {w.util}%</Badge>
          </div>
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>Hot wallet</div>
            <Num size={22} weight={600} style={{marginTop:2,display:'block'}}>{w.hot}</Num>
          </div>
          <Progress value={w.util} style={{marginTop:8}} color={w.util>60?'var(--cl-warn)':'var(--cl-up)'}/>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:14,fontSize:12,color:'var(--cl-text-3)'}}>
            <span>Cold reserve</span><Num color="var(--cl-text)">{w.cold}</Num>
          </div>
          <div style={{display:'flex',gap:8,marginTop:16}}>
            <Button size="sm" variant="secondary" icon="upload" full>Sweep</Button>
            <Button size="sm" variant="secondary" icon="download" full>Top up</Button>
          </div>
        </Card>
      ))}
    </div>
    <Card pad={0}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center'}}>
        <h3>Wallet operations</h3>
        <div style={{flex:1}}/>
        <Badge tone="info" dot>2-of-3 multi-sig enforced</Badge>
      </div>
      <Table
        columns={[
          {label:'Time',render:r=><span style={{fontSize:13,color:'var(--cl-text-3)'}}>{r.time}</span>},
          {label:'Op',render:r=><Badge tone={r.tone}>{r.op}</Badge>},
          {label:'From → To',render:r=><span style={{fontSize:12,fontFamily:'var(--cl-font-mono)'}}>{r.from} → {r.to}</span>},
          {label:'Amount',align:'right',render:r=><Num weight={500}>{r.amt}</Num>},
          {label:'Approvers',render:r=>(<div style={{display:'flex',gap:-6}}>{r.approvers.map((a,i)=><div key={i} style={{marginLeft:i?-8:0}}><Avatar name={a} size={22}/></div>)}</div>)},
          {label:'Status',render:r=><Badge tone={r.status==='Executed'?'up':r.status==='Pending'?'warn':'neutral'} dot>{r.status}</Badge>},
        ]}
        rows={[
          {time:'14:12',op:'Hot → Cold',tone:'info',from:'Hot TRC',to:'Cold TRC',amt:'200,000 USDT',approvers:['Emeka O','Ada N'],status:'Executed'},
          {time:'13:47',op:'Cold → Hot',tone:'brand',from:'Cold BEP',to:'Hot BEP',amt:'50,000 USDT',approvers:['Segun A','Emeka O','Ada N'],status:'Executed'},
          {time:'13:10',op:'Sweep',tone:'warn',from:'User deposits',to:'Hot SOL',amt:'12,480 USDT',approvers:['Segun A'],status:'Pending'},
        ]}
      />
    </Card>
  </div>
);

/* ========== ADMIN · REPORTS ========== */
const AdminReports = () => {
  const vol = [42,48,55,52,60,68,72,68,78,82,90,88,94,102,108,112,118,124,128,132,138,142,150,156,162,168];
  return (
    <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
        <Tabs tabs={[{key:'fin',label:'Financial'},{key:'comp',label:'Compliance'},{key:'act',label:'Activity'},{key:'growth',label:'Growth'}]} active="fin" onChange={()=>{}}/>
        <div style={{flex:1}}/>
        <Button variant="secondary" size="sm" icon="calendar">Apr 2026</Button>
        <Button variant="secondary" size="sm" icon="download">Export PDF</Button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:20}}>
        {[
          {l:'Gross volume',v:'₦12.4B',d:'+18.2%',tone:'up'},
          {l:'Net revenue',v:'₦48.9M',d:'+11.4%',tone:'up'},
          {l:'Spread avg',v:'0.41%',d:'-0.04%',tone:'up'},
          {l:'Failed TX',v:'0.32%',d:'+0.02%',tone:'warn'},
        ].map((k,i)=>(
          <Card key={i}>
            <div style={{fontSize:12,color:'var(--cl-text-3)',textTransform:'uppercase',letterSpacing:'0.04em'}}>{k.l}</div>
            <Num size={26} weight={650} style={{marginTop:4,display:'block'}}>{k.v}</Num>
            <div style={{display:'flex',gap:8,alignItems:'center',marginTop:8}}>
              <Badge tone={k.tone}>{k.d}</Badge>
              <Sparkline data={vol.slice(i*3,i*3+18)} width={80} height={28} color={k.tone==='up'?'var(--cl-up)':'var(--cl-warn)'}/>
            </div>
          </Card>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:20}}>
        <Card>
          <SectionHead title="Daily volume · April" subtitle="USDT bought, sold, swapped (₦ equivalent)"
            actions={<Tabs tabs={[{key:'b',label:'Buy'},{key:'s',label:'Sell'},{key:'x',label:'Swap'}]} active="b" onChange={()=>{}} variant="pill"/>}/>
          <LineChart data={vol} width={720} height={220}/>
        </Card>
        <Card>
          <SectionHead title="Top payment rails"/>
          {[
            {n:'Paystack',p:48,v:'₦5.96B'},
            {n:'VFD virtual accounts',p:32,v:'₦3.97B'},
            {n:'Flutterwave',p:14,v:'₦1.73B'},
            {n:'Bank transfer (direct)',p:6,v:'₦0.74B'},
          ].map((r,i)=>(
            <div key={i} style={{padding:'12px 0',borderBottom:i<3?'1px solid var(--cl-line)':'none'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:500}}>{r.n}</span>
                <Num size={13}>{r.v}</Num>
              </div>
              <Progress value={r.p}/>
              <div style={{fontSize:11,color:'var(--cl-text-3)',marginTop:3}}>{r.p}% of volume</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ========== ADMIN · AUDIT ========== */
const AdminAudit = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%'}}>
    <Card pad={0}>
      <div style={{padding:'14px 20px',borderBottom:'1px solid var(--cl-line)',display:'flex',alignItems:'center',gap:10}}>
        <h3>Audit log</h3>
        <Badge tone="info" dot>Immutable · append-only</Badge>
        <div style={{flex:1}}/>
        <div style={{width:240}}><Input icon="search" placeholder="Actor, action, entity…" size="sm" onChange={()=>{}}/></div>
        <Button size="sm" variant="secondary" icon="download">Export</Button>
      </div>
      <Table
        columns={[
          {label:'Timestamp',render:r=><Num size={12}>{r.t}</Num>},
          {label:'Actor',render:r=>(<div style={{display:'flex',alignItems:'center',gap:8}}><Avatar name={r.actor} size={22}/><div><div style={{fontSize:13}}>{r.actor}</div><div style={{fontSize:11,color:'var(--cl-text-3)'}}>{r.role}</div></div></div>)},
          {label:'Action',render:r=><Badge tone={r.tone}>{r.action}</Badge>},
          {label:'Entity',render:r=><span style={{fontSize:12,fontFamily:'var(--cl-font-mono)',color:'var(--cl-text-2)'}}>{r.entity}</span>},
          {label:'Details',render:r=><span style={{fontSize:13}}>{r.detail}</span>},
          {label:'IP',render:r=><Num size={11} color="var(--cl-text-3)">{r.ip}</Num>},
        ]}
        rows={[
          {t:'14:22:08.412',actor:'Emeka Okafor',role:'compliance',action:'kyc.approve',tone:'up',entity:'user:usr_8a2f',detail:'Approved Tier 1 · Smile ID 83%',ip:'102.89.32.18'},
          {t:'14:19:41.077',actor:'System',role:'webhook',action:'wallet.sweep',tone:'info',entity:'wallet:hot_trc',detail:'Swept 200,000 USDT to cold',ip:'—'},
          {t:'14:16:02.900',actor:'Segun A',role:'ops',action:'limit.increase',tone:'brand',entity:'user:usr_11c0',detail:'Daily limit ₦5M → ₦20M',ip:'102.89.14.2'},
          {t:'14:02:57.301',actor:'Ada N',role:'compliance',action:'user.freeze',tone:'down',entity:'user:usr_94d1',detail:'Flagged · duplicate BVN',ip:'102.89.14.90'},
          {t:'13:58:12.042',actor:'System',role:'cron',action:'rate.refresh',tone:'neutral',entity:'rate:USDT_NGN',detail:'Synced spot rate 1,632.50',ip:'—'},
          {t:'13:41:44.118',actor:'Emeka Okafor',role:'compliance',action:'kyc.reject',tone:'down',entity:'user:usr_02a4',detail:'Rejected · selfie liveness failed',ip:'102.89.32.18'},
        ]}
      />
    </Card>
  </div>
);

/* ========== ADMIN · CMS ========== */
const AdminCMS = () => (
  <div style={{padding:28,background:'var(--cl-bg)',minHeight:'100%',display:'grid',gridTemplateColumns:'220px 1fr',gap:20}}>
    <Card pad={8}>
      {[
        {i:'globe',l:'Marketing site',active:true},
        {i:'ticket',l:'Announcements'},
        {i:'help',l:'Help articles'},
        {i:'flag',l:'Banners'},
        {i:'mail',l:'Email templates'},
        {i:'trade',l:'Fee schedule'},
      ].map((s,i)=>(
        <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'10px 12px',borderRadius:'var(--cl-r-md)',background:s.active?'var(--cl-surface-2)':'transparent',fontSize:14,fontWeight:s.active?500:400,color:s.active?'var(--cl-text)':'var(--cl-text-2)',cursor:'pointer'}}>
          <Icon name={s.i} size={16}/>{s.l}
        </div>
      ))}
    </Card>
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <Card>
        <SectionHead title="Hero section" subtitle="Controls the landing page headline + primary CTA"
          actions={<><Badge tone="warn" dot>Draft</Badge><Button size="sm" variant="secondary">Preview</Button><Button size="sm">Publish</Button></>}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <Field label="Headline"><Input value="Stablecoins, at Naira speed." onChange={()=>{}}/></Field>
          <Field label="CTA text"><Input value="Get started — 2 min" onChange={()=>{}}/></Field>
          <Field label="Eyebrow badge"><Input value="Live on TRON · BSC · Solana" onChange={()=>{}}/></Field>
          <Field label="Secondary CTA"><Input value="View live rates" onChange={()=>{}}/></Field>
        </div>
        <Field label="Subheadline" hint="Max 220 chars">
          <textarea onChange={()=>{}} style={{width:'100%',minHeight:80,padding:12,fontSize:14,fontFamily:'inherit',border:'1px solid var(--cl-line)',borderRadius:'var(--cl-r-md)',background:'var(--cl-surface)',color:'var(--cl-text)',resize:'vertical',outline:'none'}}
            defaultValue="Buy, sell, hold and move USDT across chains with bank-grade custody, BVN-verified KYC, and instant settlement via Paystack, Flutterwave and VFD."/>
        </Field>
      </Card>
      <Card>
        <SectionHead title="Fee schedule" subtitle="Changes sync to checkout within 60 seconds"
          actions={<Button size="sm" icon="plus">Add rule</Button>}/>
        <Table
          columns={[
            {label:'Rail',render:r=>r.rail},
            {label:'Direction',render:r=><Badge tone={r.dir==='Buy'?'up':'down'}>{r.dir}</Badge>},
            {label:'Fee',align:'right',render:r=><Num>{r.fee}</Num>},
            {label:'Min',align:'right',render:r=><Num>{r.min}</Num>},
            {label:'Status',render:r=><Badge tone={r.on?'up':'neutral'} dot>{r.on?'Live':'Disabled'}</Badge>},
            {label:'',align:'right',render:()=><Icon name="edit" size={14} style={{color:'var(--cl-text-3)'}}/>},
          ]}
          rows={[
            {rail:'Paystack · card',dir:'Buy',fee:'0.35%',min:'₦50',on:true},
            {rail:'Flutterwave · card',dir:'Buy',fee:'0.40%',min:'₦50',on:true},
            {rail:'VFD virtual account',dir:'Buy',fee:'0.10%',min:'₦25',on:true},
            {rail:'Bank payout',dir:'Sell',fee:'₦100 flat',min:'₦1,000',on:true},
            {rail:'TRC-20 withdraw',dir:'Sell',fee:'1.0 USDT',min:'5.0 USDT',on:true},
          ]}
        />
      </Card>
    </div>
  </div>
);

Object.assign(window, {
  AdminSidebar, AdminTopbar,
  AdminUsers, AdminKYC, AdminTransactions, AdminWallets,
  AdminReports, AdminAudit, AdminCMS
});
