// Client misc screens — Transactions, Orders, KYC, Notifications, Settings, Support, Referrals
const { useState: cS3 } = React;

/* ===== TRANSACTIONS ===== */
const Transactions = () => {
  const [type, setType] = cS3('All');
  const [q, setQ] = cS3('');
  const [open, setOpen] = cS3(null);
  const list = TXNS.filter(t => (type==='All' || t.type===type) && (!q || t.id.includes(q.toUpperCase()) || t.asset.includes(q.toUpperCase())));
  return (
    <div className="col gap-6">
      <div className="spread"><h1>Transactions</h1>
        <div className="row gap-3">
          <button className="btn btn-ghost">{I.dl}Export CSV</button>
          <button className="btn btn-ghost">{I.filter}Filters</button>
        </div>
      </div>
      <div className="row gap-3">
        <div className="row" style={{flex:1, maxWidth:320, padding:'0 12px', height:36, border:'1px solid var(--c-line)', borderRadius:10, background:'var(--c-surface)'}}>
          <span style={{width:16, height:16, color:'var(--c-text-3)'}}>{I.search}</span>
          <input className="input" style={{border:'none', background:'transparent', height:34}} placeholder="Search by ID, asset…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <Tabs tabs={['All','Buy','Sell','Send','Receive','Swap','Withdraw','Deposit']} value={type} onChange={setType}/>
      </div>
      <Card pad={false}>
        <table className="tbl">
          <thead><tr><th>Type</th><th>Asset</th><th>Amount</th><th>Value (NGN)</th><th>Status</th><th>Counterparty</th><th>Fee</th><th style={{textAlign:'right'}}>Date</th></tr></thead>
          <tbody>{list.slice(0,20).map(t=>(
            <tr key={t.id} style={{cursor:'pointer'}} onClick={()=>setOpen(t)}>
              <td><div className="row gap-2">{t.type==='Buy'||t.type==='Receive'||t.type==='Deposit'?<span className="up">{I.arrowDn}</span>:<span className="down">{I.arrowUp}</span>}{t.type}</div></td>
              <td><div className="row gap-2"><Coin sym={t.asset}/>{t.asset}</div></td>
              <td className="num">{fmt.num(t.amount,4)}</td>
              <td className="num">{fmt.ngn(t.ngn)}</td>
              <td><Status s={t.status}/></td>
              <td className="mono dim" style={{fontSize:11}}>{t.counterparty}</td>
              <td className="num muted">₦{fmt.num(t.fee,2)}</td>
              <td className="num" style={{textAlign:'right'}}>{t.date} {t.when}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      {open && <div className="modal-back" onClick={()=>setOpen(null)}>
        <div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="card-hd"><h3>Transaction {open.id}</h3><button className="btn btn-ghost btn-icon" onClick={()=>setOpen(null)}>{I.x}</button></div>
          <div className="card-pad col gap-3">
            <div className="row spread"><Coin sym={open.asset}/><Status s={open.status}/></div>
            <div className="display num" style={{fontSize:32, fontWeight:600}}>{fmt.num(open.amount,4)} {open.asset}</div>
            <div className="dim">{fmt.ngn(open.ngn)}</div>
            <div className="sep"/>
            {[['Type',open.type],['Network',open.chain],['Counterparty',open.counterparty],['Fee',`₦${fmt.num(open.fee,2)}`],['Date',`${open.date} ${open.when}`],['Hash',open.hash||'—']].map(([k,v])=>(
              <div key={k} className="spread" style={{fontSize:13}}><span className="muted">{k}</span><span className="num mono trunc" style={{maxWidth:240}}>{v}</span></div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
};

/* ===== ORDERS ===== */
const Orders = () => {
  const [tab, setTab] = cS3('Open');
  const list = ORDERS.filter(o=> tab==='All' || o.status===tab || (tab==='Open'&&['Open','Partial'].includes(o.status)));
  return (
    <div className="col gap-6">
      <div className="spread"><h1>Orders</h1><Tabs tabs={['Open','Filled','Cancelled','All']} value={tab} onChange={setTab}/></div>
      <Card pad={false}>
        <table className="tbl">
          <thead><tr><th>Pair</th><th>Side</th><th>Type</th><th>Price</th><th>Amount</th><th>Filled</th><th>Status</th><th style={{textAlign:'right'}}>Time</th></tr></thead>
          <tbody>{list.slice(0,15).map(o=>(
            <tr key={o.id}>
              <td style={{fontWeight:600}}>{o.pair}</td>
              <td><span className={o.side==='Buy'?'badge badge-up':'badge badge-down'}>{o.side}</span></td>
              <td>{o.type}</td>
              <td className="num">{fmt.ngn(o.price*1610)}</td>
              <td className="num">{fmt.num(o.amount,2)}</td>
              <td><div className="row gap-2"><div className="bar" style={{flex:1, maxWidth:80}}><span style={{width:o.filled+'%'}}/></div><span className="num dim" style={{fontSize:11}}>{o.filled}%</span></div></td>
              <td><Status s={o.status}/></td>
              <td className="num" style={{textAlign:'right'}}>{o.time}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
};

/* ===== KYC ===== */
const KYC = () => (
  <div className="col gap-6" style={{maxWidth:780, margin:'0 auto', width:'100%'}}>
    <div><h1>Identity verification</h1><p style={{marginTop:6}}>Upgrade your tier to lift transaction limits and unlock features.</p></div>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
      {[
        { tier:'Tier 1', limit:'₦300K/day', status:'Verified', items:['Email','Phone'], current:false },
        { tier:'Tier 2', limit:'₦5M/day',   status:'Verified', items:['BVN','NIN','Selfie'], current:true },
        { tier:'Tier 3', limit:'₦20M/day',  status:'Available', items:['Address proof','Source of funds'], current:false },
      ].map(t=>(
        <div key={t.tier} className="card card-pad" style={{borderColor: t.current?'var(--c-lime-500)':'var(--c-line)', borderWidth:t.current?2:1, position:'relative'}}>
          {t.current && <div className="badge badge-lime" style={{position:'absolute', top:-10, right:14}}>Current</div>}
          <h3>{t.tier}</h3>
          <div className="display num" style={{fontSize:22, fontWeight:600, marginTop:6}}>{t.limit}</div>
          <div className="dim" style={{fontSize:12, marginTop:2}}>Daily withdrawal limit</div>
          <div className="col gap-2" style={{marginTop:14}}>{t.items.map(i=><div key={i} className="row gap-2" style={{fontSize:13}}><span className="up">{I.check}</span>{i}</div>)}</div>
          {!t.current && <button className="btn btn-dark" style={{width:'100%', justifyContent:'center', marginTop:14}}>{t.status==='Verified'?'Completed':'Upgrade'}</button>}
        </div>
      ))}
    </div>
    <Card title="Verification documents" pad>
      <div className="col gap-3">
        {[['BVN','22101234567','Verified'],['NIN','12120000001','Verified'],['Selfie','Captured Mar 12','Verified'],['Proof of address','Not uploaded','Required for Tier 3']].map(([k,v,s])=>(
          <div key={k} className="spread" style={{padding:'12px 14px', border:'1px solid var(--c-line)', borderRadius:10}}>
            <div><div style={{fontWeight:600, fontSize:13}}>{k}</div><div className="dim mono" style={{fontSize:12}}>{v}</div></div>
            {s==='Verified'?<Status s="Verified"/>:<button className="btn btn-ghost btn-sm">Upload</button>}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

/* ===== NOTIFICATIONS ===== */
const Notifications = () => {
  const [tab, setTab] = cS3('All');
  const list = NOTIFS.filter(n => tab==='All' || (tab==='Unread' && !n.read) || n.type===tab.toLowerCase());
  return (
    <div className="col gap-6">
      <div className="spread"><h1>Notifications</h1><div className="row gap-3"><button className="btn btn-ghost btn-sm">Mark all read</button><Tabs tabs={['All','Unread','tx','price','security']} value={tab} onChange={setTab}/></div></div>
      <Card pad={false}>{list.map((n,i)=>(
        <div key={n.id} className="spread" style={{padding:'14px 20px', borderBottom: i<list.length-1?'1px solid var(--c-line)':'none', background: !n.read?'var(--c-lime-500)11':'transparent'}}>
          <div className="row gap-3">
            <div style={{width:40, height:40, borderRadius:'50%', background: n.type==='security'?'var(--c-warn-soft)':'var(--c-surface-2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, color: n.type==='security'?'var(--c-warn)':'var(--c-text)'}}>{n.icon}</div>
            <div><div style={{fontWeight:600, fontSize:13.5}}>{n.title}{!n.read && <span className="dot" style={{background:'var(--c-lime-500)', marginLeft:6}}/>}</div><div className="dim" style={{fontSize:12.5}}>{n.body}</div></div>
          </div>
          <div className="dim" style={{fontSize:12}}>{n.when}</div>
        </div>
      ))}</Card>
    </div>
  );
};

/* ===== SETTINGS ===== */
const Settings = () => {
  const [tab, setTab] = cS3('Profile');
  return (
    <div className="col gap-6">
      <h1>Settings</h1>
      <div className="row gap-6" style={{alignItems:'flex-start'}}>
        <div className="col" style={{gap:2, width:200, flexShrink:0}}>{['Profile','Security','Limits','Payment methods','Notifications','Privacy','API keys'].map(t=>(
          <div key={t} className={`nav-item ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</div>
        ))}</div>
        <div style={{flex:1}}>
          {tab==='Profile' && <Card title="Profile" pad><div className="col gap-4">
            <div className="row gap-4"><div className="avatar" style={{width:64, height:64, fontSize:22}}>AO</div><button className="btn btn-ghost">Change photo</button></div>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
              {[['Full name','Adaeze Okonkwo'],['Email','adaeze@gmail.com'],['Phone','+234 803 421 8867'],['Country','Nigeria 🇳🇬'],['Date of birth','12 Mar 1994'],['Address','12 Adeola Hopewell, V/I']].map(([k,v])=>(
                <div key={k}><label className="dim" style={{fontSize:12}}>{k}</label><input className="input" defaultValue={v}/></div>
              ))}
            </div>
            <button className="btn btn-primary" style={{alignSelf:'flex-start'}}>Save changes</button>
          </div></Card>}
          {tab==='Security' && <div className="col gap-4">
            <Card title="Two-factor authentication" pad><div className="spread"><div><div style={{fontWeight:600}}>Authenticator app</div><div className="dim" style={{fontSize:12}}>Google Authenticator · added Mar 8</div></div><Status s="Active"/></div></Card>
            <Card title="Sessions" pad><div className="col gap-3">{[['iPhone 15 · Lagos','Current','iOS 17'],['MacBook Pro · Lagos','2 hours ago','Chrome'],['Pixel 7 · Abuja','Yesterday','Android']].map(([d,t,b])=>(
              <div key={d} className="spread"><div><div style={{fontWeight:600, fontSize:13}}>{d}</div><div className="dim" style={{fontSize:11}}>{b} · {t}</div></div>{t==='Current'?<Status s="Active"/>:<button className="btn btn-ghost btn-sm">Revoke</button>}</div>
            ))}</div></Card>
            <Card title="Password & passkeys" pad><div className="col gap-3"><button className="btn btn-ghost" style={{justifyContent:'space-between', width:'100%'}}>Change password{I.arrowR}</button><button className="btn btn-ghost" style={{justifyContent:'space-between', width:'100%'}}>Add passkey{I.arrowR}</button></div></Card>
          </div>}
          {tab==='Limits' && <Card title="Transaction limits" pad><div className="col gap-4">
            {[['Daily withdrawal','₦5,000,000','₦2,134,500'],['Monthly withdrawal','₦150,000,000','₦42,300,000'],['Single transaction','₦5,000,000','—']].map(([k,m,u])=>(
              <div key={k}><div className="spread"><span style={{fontWeight:600}}>{k}</span><span className="num muted">{u} of {m}</span></div><div className="bar" style={{marginTop:6}}><span style={{width: u==='—'?'0%':'40%'}}/></div></div>
            ))}
          </div></Card>}
          {tab==='Payment methods' && <Card title="Linked banks & cards" pad><div className="col gap-3">
            {[['GTBank','0234567890','Primary'],['Access Bank','0123987654','—'],['Visa ••• 4521','Expires 09/27','—']].map(([n,d,t])=>(
              <div key={n} className="spread" style={{padding:'12px 14px', border:'1px solid var(--c-line)', borderRadius:10}}>
                <div className="row gap-3"><div style={{width:40, height:40, background:'var(--c-surface-2)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}>{I.bank}</div><div><div style={{fontWeight:600, fontSize:13}}>{n}</div><div className="dim mono" style={{fontSize:12}}>{d}</div></div></div>
                <div className="row gap-2">{t==='Primary'&&<span className="badge badge-lime">Primary</span>}<button className="btn btn-ghost btn-sm">Remove</button></div>
              </div>
            ))}
            <button className="btn btn-ghost" style={{alignSelf:'flex-start'}}>{I.plus}Add new</button>
          </div></Card>}
          {tab==='Notifications' && <Card title="Channels" pad><div className="col gap-3">{[['Email','Transactions, security, news'],['Push','Real-time alerts on this device'],['SMS','Critical security only']].map(([k,d])=>(<div key={k} className="spread"><div><div style={{fontWeight:600}}>{k}</div><div className="dim" style={{fontSize:12}}>{d}</div></div><div style={{width:42, height:24, background:'var(--c-lime-500)', borderRadius:999, position:'relative'}}><div style={{position:'absolute', right:2, top:2, width:20, height:20, background:'#fff', borderRadius:'50%'}}/></div></div>))}</div></Card>}
          {tab==='Privacy' && <Card title="Privacy" pad><div className="col gap-3">{['Hide balances by default','Allow analytics','Receive product updates','Allow marketing'].map(k=>(<div key={k} className="spread"><span>{k}</span><div style={{width:42, height:24, background: k.startsWith('Allow marketing')?'var(--c-surface-3)':'var(--c-lime-500)', borderRadius:999, position:'relative'}}><div style={{position:'absolute', right: k.startsWith('Allow marketing')?'auto':2, left: k.startsWith('Allow marketing')?2:'auto', top:2, width:20, height:20, background:'#fff', borderRadius:'50%'}}/></div></div>))}</div></Card>}
          {tab==='API keys' && <Card title="API keys" pad><div className="empty">No API keys yet.<br/><button className="btn btn-primary" style={{marginTop:14, justifyContent:'center'}}>{I.plus}Create new key</button></div></Card>}
        </div>
      </div>
    </div>
  );
};

/* ===== SUPPORT ===== */
const Support = () => {
  const [open, setOpen] = cS3(TICKETS[0]);
  return (
    <div className="col gap-6">
      <div className="spread"><h1>Support</h1><button className="btn btn-primary">{I.plus}New ticket</button></div>
      <div className="grid" style={{gridTemplateColumns:'320px 1fr', gap:16}}>
        <Card title="Tickets" pad={false}>
          {TICKETS.map(t=>(
            <div key={t.id} className="col" style={{padding:'14px 16px', borderBottom:'1px solid var(--c-line)', cursor:'pointer', background: open?.id===t.id?'var(--c-surface-2)':'transparent', gap:4}} onClick={()=>setOpen(t)}>
              <div className="spread"><span className="mono dim" style={{fontSize:11}}>{t.id}</span><Status s={t.status}/></div>
              <div style={{fontWeight:600, fontSize:13.5}}>{t.subject}</div>
              <div className="spread"><span className="dim" style={{fontSize:11}}>{t.updated}</span>{t.unread>0&&<span className="badge badge-lime">{t.unread}</span>}</div>
            </div>
          ))}
        </Card>
        <Card title={open?.subject} action={<Status s={open?.status}/>} pad={false}>
          <div className="col" style={{padding:20, gap:14, height:520, overflow:'auto'}}>
            <div className="row gap-3"><div className="avatar">AO</div><div className="card card-pad" style={{padding:12, flex:1, fontSize:13}}>I initiated a withdrawal of ₦450,000 to my GTBank account 2 hours ago and it's still showing pending. Reference: WX-83820.<div className="dim" style={{marginTop:6, fontSize:11}}>You · 2 hours ago</div></div></div>
            <div className="row gap-3"><div className="avatar" style={{background:'linear-gradient(135deg, #C9F542, #DBFF6B)'}}>EN</div><div className="card card-pad" style={{padding:12, flex:1, fontSize:13, background:'var(--c-surface-2)'}}>Hi Adaeze — I can see the withdrawal in our system. NIBSS is reporting a delay on GTBank's end. Funds will arrive within 30 mins. I'll keep you updated.<div className="dim" style={{marginTop:6, fontSize:11}}>Emeka · Support · 12 min ago</div></div></div>
          </div>
          <div style={{padding:14, borderTop:'1px solid var(--c-line)'}}>
            <div className="row gap-2"><input className="input" placeholder="Type a reply…" style={{flex:1}}/><button className="btn btn-primary">{I.send}Send</button></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ===== REFERRALS ===== */
const Referrals = () => (
  <div className="col gap-6">
    <h1>Referrals & rewards</h1>
    <div className="grid" style={{gridTemplateColumns:'2fr 1fr', gap:16}}>
      <div className="card card-pad" style={{background:'var(--c-onyx-900)', color:'var(--c-cream)', border:'none', padding:32}}>
        <div className="display" style={{fontSize:13, opacity:.7, textTransform:'uppercase', letterSpacing:'0.08em'}}>Earn ₦2,000 per referral</div>
        <div className="display" style={{fontSize:42, fontWeight:600, marginTop:8, lineHeight:1}}>Invite friends.<br/>Both get rewarded.</div>
        <div className="card card-pad" style={{background:'var(--c-onyx-700)', padding:14, marginTop:24, border:'1px dashed rgba(244,241,234,0.2)'}}>
          <div className="dim" style={{color:'rgba(244,241,234,0.5)', fontSize:11, textTransform:'uppercase'}}>Your referral link</div>
          <div className="row gap-2" style={{marginTop:6}}><div className="mono" style={{flex:1}}>clusteer.ng/r/ADAEZE2K</div><button className="btn btn-primary btn-sm">{I.copy}Copy</button></div>
        </div>
      </div>
      <div className="col gap-3">
        {[['Total referred','24'],['Reward earned','₦48,000'],['Pending payout','₦4,000']].map(([k,v])=>(
          <div key={k} className="card card-pad"><div className="dim" style={{fontSize:12}}>{k}</div><div className="display num" style={{fontSize:28, fontWeight:600}}>{v}</div></div>
        ))}
      </div>
    </div>
    <Card title="Referrals" pad={false}>
      <table className="tbl">
        <thead><tr><th>Friend</th><th>Joined</th><th>KYC</th><th>First trade</th><th style={{textAlign:'right'}}>Reward</th></tr></thead>
        <tbody>{USERS.slice(0,8).map((u,i)=>(
          <tr key={u.id}><td><div className="row"><div className="avatar">{u.name.split(' ').map(n=>n[0]).join('')}</div>{u.name}</div></td>
          <td>{u.joined}</td><td><Status s={u.kyc}/></td><td>{i%3===0?'—':<Status s="Completed"/>}</td>
          <td className="num" style={{textAlign:'right', fontWeight:600}}>{i%3===0?'—':'₦2,000'}</td></tr>
        ))}</tbody>
      </table>
    </Card>
  </div>
);

Object.assign(window, { Transactions, Orders, KYC, Notifications, Settings, Support, Referrals });
