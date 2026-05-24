// Admin app — shell + ops overview + users + KYC queue + wallet pool + tx monitor + orders
const { useState: aS } = React;

const ADMIN_NAV = [
  { id:'ops',      label:'Operations',  icon: I.home },
  { id:'users',    label:'Users',       icon: I.users },
  { id:'kyc',      label:'KYC queue',   icon: I.shield },
  { id:'pool',     label:'Wallet pool', icon: I.wallet },
  { id:'monitor',  label:'Tx monitor',  icon: I.list },
  { id:'orders',   label:'Order book',  icon: I.book },
  { id:'fees',     label:'Fees',        icon: I.percent },
  { id:'compliance', label:'Compliance', icon: I.flag },
  { id:'audit',    label:'Audit log',   icon: I.clock },
  { id:'cms',      label:'CMS',         icon: I.doc },
  { id:'reports',  label:'Reports',     icon: I.chart },
  { id:'staff',    label:'Staff',       icon: I.users },
  { id:'settings', label:'Settings',    icon: I.cog },
];

const AdminShell = ({ route, setRoute, theme, setTheme, children }) => (
  <div className="app" data-theme={theme} style={{display:'grid', gridTemplateColumns:'248px 1fr', height:'100vh', overflow:'hidden'}}>
    <aside style={{borderRight:'1px solid var(--c-line)', background:'var(--c-onyx-900)', color:'var(--c-cream)', padding:'18px 14px', display:'flex', flexDirection:'column', gap:6, overflowY:'auto', height:'100vh'}}>
      <div className="row" style={{padding:'4px 8px 14px', gap:10, borderBottom:'1px solid rgba(244,241,234,0.1)', marginBottom:8}}>
        <Logo size={24}/>
        <div style={{fontWeight:600, fontSize:15, letterSpacing:'-0.02em'}}>Clusteer</div>
        <span style={{marginLeft:'auto', fontSize:10, padding:'2px 8px', background:'var(--c-lime-500)', color:'var(--c-onyx-900)', borderRadius:6, fontWeight:700, letterSpacing:'0.04em'}}>ADMIN</span>
      </div>
      {ADMIN_NAV.map(n=>(
        <div key={n.id} className={`nav-item ${route===n.id?'active':''}`}
          style={{color: route===n.id?'var(--c-onyx-900)':'rgba(244,241,234,0.7)', background: route===n.id?'var(--c-lime-500)':'transparent'}}
          onClick={()=>setRoute(n.id)}>{n.icon}<span>{n.label}</span>
          {n.id==='kyc' && <span style={{marginLeft:'auto', background:'var(--c-warn)', color:'#fff', fontSize:10, padding:'1px 6px', borderRadius:999}}>{KYC_QUEUE.length}</span>}
          {n.id==='compliance' && <span style={{marginLeft:'auto', background:'var(--c-down)', color:'#fff', fontSize:10, padding:'1px 6px', borderRadius:999}}>4</span>}
        </div>
      ))}
      <div style={{marginTop:'auto', padding:14, background:'rgba(255,255,255,0.04)', borderRadius:14, border:'1px solid rgba(255,255,255,0.06)'}}>
        <div className="row gap-2" style={{fontSize:11, opacity:.6, textTransform:'uppercase', letterSpacing:'0.06em'}}><span className="dot" style={{background:'var(--c-up)'}}/>System healthy</div>
        <div className="num" style={{fontSize:13, marginTop:4, color:'var(--c-cream)'}}>99.98% uptime · 42ms p50</div>
      </div>
    </aside>

    <main style={{display:'flex', flexDirection:'column', minWidth:0, height:'100vh', overflow:'hidden'}}>
      <header style={{display:'flex', alignItems:'center', gap:12, padding:'14px 24px', borderBottom:'1px solid var(--c-line)', background:'var(--c-surface)', flexShrink:0, position:'sticky', top:0, zIndex:5}}>
        <div className="row" style={{flex:1, maxWidth:380, padding:'0 12px', height:36, border:'1px solid var(--c-line)', borderRadius:10, background:'var(--c-bg)'}}>
          <span style={{color:'var(--c-text-3)', width:16, height:16}}>{I.search}</span>
          <input className="input" style={{border:'none', background:'transparent', height:34, padding:'0 8px'}} placeholder="Search users, txns, orders…"/>
          <span className="kbd">⌘K</span>
        </div>
        <span className="badge badge-warn" style={{marginLeft:'auto'}}>{I.flag}{KYC_QUEUE.length} KYC pending</span>
        <span className="badge badge-down">{I.flag}4 flagged txns</span>
        <button className="btn btn-ghost btn-icon" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?I.eye:I.eyeOff}</button>
        <button className="btn btn-ghost btn-icon">{I.bell}</button>
        <div className="row" style={{gap:10, padding:'0 8px 0 12px', borderLeft:'1px solid var(--c-line)', marginLeft:4}}>
          <div className="avatar" style={{background:'var(--c-onyx-900)', color:'var(--c-cream)'}}>EN</div>
          <div className="col" style={{gap:0}}>
            <div style={{fontSize:13, fontWeight:600}}>Emeka N.</div>
            <div className="dim" style={{fontSize:11}}>Compliance Lead</div>
          </div>
        </div>
      </header>
      <div style={{flex:1, overflow:'auto', padding:'24px 24px 48px'}}>{children}</div>
    </main>
  </div>
);

/* ============== OPS OVERVIEW ============== */
const OpsOverview = () => {
  const totalAum = WALLETS.reduce((a,b)=>a+b.hotNgn+b.coldNgn, 0);
  const last24hVol = TXNS.reduce((a,b)=>a+b.ngn, 0);
  return (
    <div className="col gap-6">
      <div className="spread">
        <div><h1>Operations</h1><p style={{marginTop:6}}>Live snapshot · last refresh just now</p></div>
        <div className="row gap-3"><Seg opts={['Today','7D','30D','90D']} value="Today" onChange={()=>{}}/><button className="btn btn-ghost">{I.dl}Export</button></div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
        {[
          { label:'Total AUM', val: '₦' + fmt.short(totalAum), sub:'+₦284M (24h)', up:true },
          { label:'24h volume', val: '₦' + fmt.short(last24hVol), sub:`${TXNS.length} transactions`, up:null },
          { label:'Active users (24h)', val: '8,421', sub:'+12.4% WoW', up:true },
          { label:'Revenue (24h)', val: '₦' + fmt.short(last24hVol * 0.005), sub:'0.5% effective fee', up:null },
        ].map((k,i)=>(
          <div key={i} className="card card-pad">
            <div className="dim" style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>{k.label}</div>
            <div className="num display" style={{fontSize:30, fontWeight:600, marginTop:6}}>{k.val}</div>
            <div className={`row gap-1 ${k.up===true?'up':k.up===false?'down':'dim'}`} style={{fontSize:12, marginTop:4}}>{k.up===true&&I.arrowUp}{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="row gap-4" style={{flexWrap:'wrap'}}>
        <Card title="Volume by hour" action={<Seg opts={['NGN','USD']} value="NGN" onChange={()=>{}}/>} pad>
          <Bars data={Array.from({length:24}).map((_,i)=>40+Math.random()*180+Math.sin(i/3)*40)} h={220} color="var(--c-onyx-900)"/>
        </Card>
        <div style={{flex:'1 1 320px'}} className="col gap-4">
          <Card title="System health" pad>
            <div className="col gap-3">
              {[['API gateway','99.99%','operational'],['BVN/NIN service','99.94%','operational'],['Paystack','99.81%','operational'],['Tron RPC','98.40%','degraded'],['BTC node','99.99%','operational']].map(([s,u,st])=>(
                <div key={s} className="spread" style={{fontSize:13}}>
                  <div className="row gap-2"><span className="dot" style={{background: st==='operational'?'var(--c-up)':'var(--c-warn)'}}/>{s}</div>
                  <span className="num muted">{u}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Action queue" pad>
            <div className="col gap-3">
              {[['KYC reviews', KYC_QUEUE.length, 'kyc'],['Flagged transactions', 4, 'monitor'],['Withdrawals > ₦5M', 7, 'monitor'],['Manual approvals', 2, 'monitor']].map(([k,n,r])=>(
                <div key={k} className="spread" style={{padding:'10px 12px', background:'var(--c-surface-2)', borderRadius:8}}>
                  <span style={{fontSize:13}}>{k}</span>
                  <div className="row gap-2"><span className="badge badge-warn">{n}</span><button className="btn btn-ghost btn-sm">Review</button></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="row gap-4" style={{flexWrap:'wrap'}}>
        <Card title="Wallet pool · NGN value" pad>
          <table className="tbl">
            <thead><tr><th>Asset</th><th>Hot</th><th>Cold</th><th>Total</th><th>Hot ratio</th></tr></thead>
            <tbody>{WALLETS.map(w=>{
              const ratio = w.hotNgn/(w.hotNgn+w.coldNgn);
              return <tr key={w.sym+w.chain}>
                <td><div className="row"><Coin sym={w.sym}/><div><div style={{fontWeight:600, fontSize:13}}>{w.sym}</div><div className="dim" style={{fontSize:11}}>{w.chain}</div></div></div></td>
                <td className="num">{fmt.ngn(w.hotNgn)}</td>
                <td className="num">{fmt.ngn(w.coldNgn)}</td>
                <td className="num" style={{fontWeight:600}}>{fmt.ngn(w.hotNgn+w.coldNgn)}</td>
                <td><div className="row gap-2"><div className="bar" style={{flex:1, maxWidth:80}}><span style={{width: (ratio*100)+'%', background: ratio>0.2?'var(--c-warn)':'var(--c-up)'}}/></div><span className="num dim" style={{fontSize:11}}>{(ratio*100).toFixed(1)}%</span></div></td>
              </tr>;
            })}</tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

/* ============== USERS ============== */
const Users = () => {
  const [tier, setTier] = aS('All');
  const [q, setQ] = aS('');
  const [open, setOpen] = aS(null);
  const list = USERS.filter(u=>(tier==='All'||u.tier===tier)&&(!q||u.name.toLowerCase().includes(q.toLowerCase())||u.email.includes(q.toLowerCase())));
  return (
    <div className="col gap-6">
      <div className="spread"><h1>Users</h1>
        <div className="row gap-3"><button className="btn btn-ghost">{I.filter}Filters</button><button className="btn btn-ghost">{I.dl}Export CSV</button><button className="btn btn-primary">{I.plus}New user</button></div>
      </div>
      <div className="row gap-3">
        <div className="row" style={{flex:1, maxWidth:340, padding:'0 12px', height:36, border:'1px solid var(--c-line)', borderRadius:10, background:'var(--c-surface)'}}>
          <span style={{color:'var(--c-text-3)', width:16, height:16}}>{I.search}</span>
          <input className="input" style={{border:'none', background:'transparent', height:34}} placeholder="Search users…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <Tabs tabs={['All','Tier 1','Tier 2','Tier 3']} value={tier} onChange={setTier}/>
      </div>
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
        {[['Total users','12,481','+248 this week'],['Active 24h','8,421','67% of base'],['Verified','11,294','90.5% verified'],['Suspended','37','3 new today']].map(([k,v,s])=>(
          <div key={k} className="card card-pad"><div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>{k}</div><div className="display num" style={{fontSize:24, fontWeight:600, marginTop:6}}>{v}</div><div className="dim" style={{fontSize:12, marginTop:2}}>{s}</div></div>
        ))}
      </div>
      <Card pad={false}>
        <table className="tbl">
          <thead><tr><th>User</th><th>Tier</th><th>Status</th><th>KYC</th><th>Balance</th><th>30d txns</th><th>Risk</th><th>Joined</th><th></th></tr></thead>
          <tbody>{list.slice(0,15).map(u=>(
            <tr key={u.id} style={{cursor:'pointer'}} onClick={()=>setOpen(u)}>
              <td><div className="row"><div className="avatar">{u.name.split(' ').map(n=>n[0]).join('')}</div><div><div style={{fontWeight:600, fontSize:13}}>{u.name}</div><div className="dim" style={{fontSize:11}}>{u.email}</div></div></div></td>
              <td><span className="badge">{u.tier}</span></td>
              <td><Status s={u.status}/></td>
              <td><Status s={u.kyc}/></td>
              <td className="num">{fmt.ngn(u.bal)}</td>
              <td className="num">{u.txns30d}</td>
              <td><div className="row gap-2"><div className="bar" style={{flex:1, maxWidth:60}}><span style={{width:u.risk+'%', background: u.risk>70?'var(--c-down)':u.risk>40?'var(--c-warn)':'var(--c-up)'}}/></div><span className="num dim" style={{fontSize:11}}>{u.risk}</span></div></td>
              <td className="muted">{u.joined}</td>
              <td><button className="btn btn-ghost btn-icon">{I.dots}</button></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      {open && <UserDrawer user={open} onClose={()=>setOpen(null)}/>}
    </div>
  );
};

const UserDrawer = ({ user, onClose }) => (
  <div className="modal-back" onClick={onClose} style={{justifyContent:'flex-end'}}>
    <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:560, height:'100%', borderRadius:'20px 0 0 20px', display:'flex', flexDirection:'column'}}>
      <div className="card-hd"><div className="row gap-3"><div className="avatar" style={{width:44, height:44, fontSize:16}}>{user.name.split(' ').map(n=>n[0]).join('')}</div><div><div style={{fontWeight:600}}>{user.name}</div><div className="dim mono" style={{fontSize:12}}>{user.id}</div></div></div><button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button></div>
      <div className="card-pad col gap-4" style={{flex:1, overflow:'auto'}}>
        <div className="row gap-2 wrap"><Status s={user.status}/><span className="badge">{user.tier}</span><Status s={user.kyc}/>{user.flags.map(f=><span key={f} className="badge badge-warn">{f}</span>)}</div>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8, fontSize:13}}>
          {[['Email',user.email],['Phone',user.phone],['BVN',user.bvn],['NIN',user.nin],['Bank',user.bank.name],['Account',user.acctNo],['Address',user.address],['Joined',user.joined]].map(([k,v])=>(<div key={k}><div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>{k}</div><div className={`mono ${k==='Address'?'':'num'}`} style={{marginTop:2}}>{v}</div></div>))}
        </div>
        <div className="sep"/>
        <div><h4 style={{marginBottom:8}}>Balance</h4><div className="display num" style={{fontSize:32, fontWeight:600}}>{fmt.ngn(user.bal)}</div></div>
        <div className="row gap-2 wrap">
          <button className="btn btn-ghost btn-sm">Reset password</button>
          <button className="btn btn-ghost btn-sm">Reset 2FA</button>
          <button className="btn btn-ghost btn-sm">Adjust limits</button>
          <button className="btn btn-ghost btn-sm">Force logout</button>
          <button className="btn btn-ghost btn-sm" style={{color:'var(--c-down)'}}>Suspend</button>
        </div>
        <div className="sep"/>
        <div><h4 style={{marginBottom:8}}>Recent activity</h4>
          <div className="col">{TXNS.slice(0,5).map(t=>(
            <div key={t.id} className="spread" style={{padding:'10px 0', borderBottom:'1px solid var(--c-line)', fontSize:13}}>
              <div className="row gap-2">{t.type==='Buy'||t.type==='Receive'?<span className="up">{I.arrowDn}</span>:<span className="down">{I.arrowUp}</span>}<span>{t.type} {t.amount.toFixed(2)} {t.asset}</span></div>
              <div className="num muted">{t.date} {t.when}</div>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  </div>
);

/* ============== KYC QUEUE ============== */
const KycQueue = () => {
  const [open, setOpen] = aS(KYC_QUEUE[0]);
  return (
    <div className="col gap-6">
      <div className="spread"><div><h1>KYC queue</h1><p style={{marginTop:6}}>{KYC_QUEUE.length} submissions awaiting review · SLA: 24h</p></div>
        <div className="row gap-3"><Seg opts={['All','Tier 2','Tier 3','Re-review']} value="All" onChange={()=>{}}/></div>
      </div>
      <div className="grid" style={{gridTemplateColumns:'320px 1fr', gap:16, alignItems:'start'}}>
        <Card pad={false} title="Queue">
          {KYC_QUEUE.map(k=>(
            <div key={k.id} className="col" style={{padding:'14px 16px', borderBottom:'1px solid var(--c-line)', cursor:'pointer', background: open?.id===k.id?'var(--c-surface-2)':'transparent', gap:6}} onClick={()=>setOpen(k)}>
              <div className="row gap-3"><div className="avatar">{k.name.split(' ').map(n=>n[0]).join('')}</div><div style={{flex:1}}><div style={{fontWeight:600, fontSize:13.5}}>{k.name}</div><div className="dim" style={{fontSize:11}}>{k.tier} · {k.submitted}</div></div></div>
              <div className="row gap-2"><span className="badge">Liveness {k.liveness}%</span><span className="badge">Match {k.faceMatch}%</span></div>
            </div>
          ))}
        </Card>
        {open && <Card pad title={open.name} action={<div className="row gap-2"><Status s="Pending"/></div>}>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8, fontSize:12.5, marginBottom:14}}>
            {[['BVN',open.bvn],['NIN',open.nin],['Phone',open.phone],['Address',open.address],['DOB','12 Mar 1994']].map(([k,v])=>(<div key={k}><div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>{k}</div><div className="mono" style={{marginTop:2}}>{v}</div></div>))}
          </div>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
            {[['Selfie','😎','#'],['ID front','🪪',''],['ID back','📄',''],['Address proof','🏠','#']].map(([k,v])=>(
              <div key={k} className="col" style={{aspectRatio:'4/5', background:'var(--c-surface-2)', border:'1px solid var(--c-line)', borderRadius:12, alignItems:'center', justifyContent:'center', gap:8}}>
                <div style={{fontSize:48}}>{v}</div>
                <div style={{fontSize:12, fontWeight:600}}>{k}</div>
                <button className="btn btn-ghost btn-sm">View</button>
              </div>
            ))}
          </div>
          <div className="card card-pad" style={{marginTop:16, background:'var(--c-surface-2)'}}>
            <h4 style={{marginBottom:8}}>Risk signals</h4>
            <div className="col gap-2" style={{fontSize:13}}>
              <div className="spread"><span>Liveness check</span><span className="up num">{open.liveness}% · Pass</span></div>
              <div className="spread"><span>Face match (Selfie ↔ ID)</span><span className="up num">{open.faceMatch}% · Pass</span></div>
              <div className="spread"><span>BVN ↔ NIN name match</span><Status s="Verified"/></div>
              <div className="spread"><span>Sanctions / PEP screening</span><Status s="Verified"/></div>
              <div className="spread"><span>Device & IP check</span><span className="num muted">Lagos · 102.89.x.x</span></div>
            </div>
          </div>
          <div><label style={{fontSize:12, fontWeight:600}}>Review notes</label><textarea className="input" style={{minHeight:80, marginTop:6}} placeholder="Optional reviewer notes…"/></div>
          <div className="row gap-2" style={{marginTop:14, justifyContent:'flex-end'}}>
            <button className="btn btn-ghost" style={{color:'var(--c-down)'}}>Reject</button>
            <button className="btn btn-ghost">Request more info</button>
            <button className="btn btn-primary">{I.check}Approve</button>
          </div>
        </Card>}
      </div>
    </div>
  );
};

/* ============== WALLET POOL ============== */
const WalletPool = () => (
  <div className="col gap-6">
    <div className="spread"><div><h1>Wallet pool</h1><p style={{marginTop:6}}>Custodial reserves across hot, warm, and cold wallets</p></div>
      <div className="row gap-3"><button className="btn btn-ghost">{I.dl}Reserve attestation</button><button className="btn btn-primary">{I.swap}Rebalance</button></div>
    </div>
    <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
      {[['Total reserves', '₦' + fmt.short(WALLETS.reduce((a,b)=>a+b.hotNgn+b.coldNgn, 0))],
        ['User liabilities', '₦' + fmt.short(WALLETS.reduce((a,b)=>a+b.hotNgn+b.coldNgn, 0)*0.94)],
        ['Reserve ratio', '106.4%']].map(([k,v])=>(
        <div key={k} className="card card-pad"><div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>{k}</div><div className="display num" style={{fontSize:30, fontWeight:600, marginTop:6}}>{v}</div><div className="up row gap-1" style={{fontSize:12, marginTop:4}}>{I.check}Fully reserved</div></div>
      ))}
    </div>
    <Card pad={false} title="Wallet inventory" action={<Tabs tabs={['All','Hot','Cold','Low']} value="All" onChange={()=>{}}/>}>
      <table className="tbl">
        <thead><tr><th>Asset</th><th>Hot</th><th>Cold</th><th>Threshold</th><th>Hot address</th><th>Status</th><th></th></tr></thead>
        <tbody>{WALLETS.map(w=>{
          const low = w.hot < w.threshold;
          return <tr key={w.sym+w.chain}>
            <td><div className="row"><Coin sym={w.sym}/><div><div style={{fontWeight:600, fontSize:13}}>{w.sym}</div><div className="dim" style={{fontSize:11}}>{w.chain}</div></div></div></td>
            <td className="num">{fmt.num(w.hot,2)} <span className="dim">({fmt.ngn(w.hotNgn)})</span></td>
            <td className="num">{fmt.num(w.cold,2)} <span className="dim">({fmt.ngn(w.coldNgn)})</span></td>
            <td className="num muted">{fmt.num(w.threshold,2)}</td>
            <td className="mono dim" style={{fontSize:11}}>{w.addr}</td>
            <td>{low?<span className="badge badge-warn">Low</span>:<Status s="Active"/>}</td>
            <td><button className="btn btn-ghost btn-sm">Top up</button></td>
          </tr>;
        })}</tbody>
      </table>
    </Card>
  </div>
);

/* ============== TX MONITOR ============== */
const TxMonitor = () => {
  const [tab, setTab] = aS('All');
  const list = TXNS.filter(t=> tab==='All' || (tab==='Flagged' && t.ngn>3000000) || t.status===tab);
  return (
    <div className="col gap-6">
      <div className="spread"><div><h1>Transaction monitor</h1><p style={{marginTop:6}}>Live feed of customer transactions</p></div>
        <div className="row gap-3"><Tabs tabs={['All','Pending','Failed','Flagged','Completed']} value={tab} onChange={setTab}/><button className="btn btn-ghost">{I.dl}Export</button></div>
      </div>
      <Card pad={false}>
        <table className="tbl">
          <thead><tr><th>ID</th><th>User</th><th>Type</th><th>Asset</th><th>Amount</th><th>Value</th><th>Status</th><th>Time</th><th></th></tr></thead>
          <tbody>{list.slice(0,18).map(t=>{
            const flagged = t.ngn>3000000;
            return <tr key={t.id} style={{background: flagged?'var(--c-warn-soft)44':'transparent'}}>
              <td className="mono dim" style={{fontSize:11}}>{t.id}</td>
              <td><div className="row"><div className="avatar">{t.user.name.split(' ').map(n=>n[0]).join('')}</div><div style={{fontSize:13}}>{t.user.name}</div></div></td>
              <td>{t.type}</td>
              <td><div className="row gap-2"><Coin sym={t.asset}/>{t.asset}</div></td>
              <td className="num">{fmt.num(t.amount,4)}</td>
              <td className="num" style={{fontWeight:600}}>{fmt.ngn(t.ngn)} {flagged && <span className="badge badge-warn" style={{marginLeft:6}}>{I.flag}High</span>}</td>
              <td><Status s={t.status}/></td>
              <td className="muted">{t.date} {t.when}</td>
              <td><button className="btn btn-ghost btn-icon">{I.dots}</button></td>
            </tr>;
          })}</tbody>
        </table>
      </Card>
    </div>
  );
};

/* ============== ORDER BOOK ============== */
const OrderBook = () => (
  <div className="col gap-6">
    <div className="spread"><h1>Order book — internal matching</h1><Seg opts={['USDT/NGN','BTC/NGN','ETH/NGN']} value="USDT/NGN" onChange={()=>{}}/></div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
      <Card title="Bids" pad={false}>
        <table className="tbl">
          <thead><tr><th>Price</th><th>Amount</th><th>Total</th><th>User</th></tr></thead>
          <tbody>{ORDERS.filter(o=>o.side==='Buy').slice(0,8).map(o=>(
            <tr key={o.id}><td className="num up">{fmt.ngn(o.price*1610)}</td><td className="num">{fmt.num(o.amount,2)}</td><td className="num">{fmt.ngn(o.price*o.amount*1610)}</td><td className="mono dim" style={{fontSize:11}}>{o.user.id}</td></tr>
          ))}</tbody>
        </table>
      </Card>
      <Card title="Asks" pad={false}>
        <table className="tbl">
          <thead><tr><th>Price</th><th>Amount</th><th>Total</th><th>User</th></tr></thead>
          <tbody>{ORDERS.filter(o=>o.side==='Sell').slice(0,8).map(o=>(
            <tr key={o.id}><td className="num down">{fmt.ngn(o.price*1610)}</td><td className="num">{fmt.num(o.amount,2)}</td><td className="num">{fmt.ngn(o.price*o.amount*1610)}</td><td className="mono dim" style={{fontSize:11}}>{o.user.id}</td></tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
    <Card title="Recent matches" pad={false}>
      <table className="tbl">
        <thead><tr><th>Time</th><th>Pair</th><th>Side</th><th>Price</th><th>Amount</th><th>Buyer</th><th>Seller</th></tr></thead>
        <tbody>{ORDERS.filter(o=>o.status==='Filled').slice(0,10).map(o=>(
          <tr key={o.id}><td className="muted">{o.time}</td><td>{o.pair}</td><td><span className={o.side==='Buy'?'badge badge-up':'badge badge-down'}>{o.side}</span></td><td className="num">{fmt.ngn(o.price*1610)}</td><td className="num">{fmt.num(o.amount,2)}</td><td className="mono dim" style={{fontSize:11}}>{o.user.id}</td><td className="mono dim" style={{fontSize:11}}>USR-{10042+(parseInt(o.id.slice(-2))%20)}</td></tr>
        ))}</tbody>
      </table>
    </Card>
  </div>
);

Object.assign(window, { AdminShell, ADMIN_NAV, OpsOverview, Users, KycQueue, WalletPool, TxMonitor, OrderBook });
