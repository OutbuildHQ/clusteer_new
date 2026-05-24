// Admin extras — Fees, Compliance, Audit, CMS, Reports, Staff, Settings
const { useState: aS2 } = React;

/* ===== FEES ===== */
const Fees = () => (
  <div className="col gap-6">
    <div className="spread"><div><h1>Fee schedule</h1><p style={{marginTop:6}}>Live fees applied to user transactions</p></div>
      <div className="row gap-3"><button className="btn btn-ghost">{I.dl}Export</button><button className="btn btn-primary">{I.plus}New rule</button></div>
    </div>
    <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
      {[['Effective fee (24h)','0.51%','+0.02% vs 7d avg'],['Fee revenue (24h)','₦4.82M','+12% WoW'],['Active rules','7','Last edit 3d ago']].map(([k,v,s])=>(
        <div key={k} className="card card-pad"><div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>{k}</div><div className="display num" style={{fontSize:28, fontWeight:600, marginTop:6}}>{v}</div><div className="dim" style={{fontSize:12, marginTop:2}}>{s}</div></div>
      ))}
    </div>
    <Card pad={false} title="Fee schedule">
      <table className="tbl">
        <thead><tr><th>Type</th><th>Asset</th><th>Method</th><th>Fee</th><th>Min</th><th>Status</th><th></th></tr></thead>
        <tbody>{FEE_SCHEDULE.map((f,i)=>(
          <tr key={i}><td style={{fontWeight:600}}>{f.type}</td><td>{f.asset}</td><td>{f.method}</td><td className="num" style={{fontWeight:600}}>{f.fee}</td><td className="num muted">{f.min}</td><td><Status s="Active"/></td><td><div className="row gap-1"><button className="btn btn-ghost btn-sm">Edit</button><button className="btn btn-ghost btn-icon">{I.dots}</button></div></td></tr>
        ))}</tbody>
      </table>
    </Card>
    <Card pad title="Spread & price oracles">
      <div className="grid" style={{gridTemplateColumns:'repeat(2,1fr)', gap:12}}>
        {[['Buy spread','+0.40%'],['Sell spread','-0.35%'],['NGN reference','Binance P2P median'],['Refresh interval','15s'],['Slippage tolerance','0.50%'],['Failover oracle','Bybit P2P']].map(([k,v])=>(<div key={k} className="spread" style={{padding:'10px 12px', background:'var(--c-surface-2)', borderRadius:8}}><span style={{fontSize:13}}>{k}</span><span className="num" style={{fontWeight:600}}>{v}</span></div>))}
      </div>
    </Card>
  </div>
);

/* ===== COMPLIANCE ===== */
const Compliance = () => {
  const [tab, setTab] = aS2('Cases');
  return (
    <div className="col gap-6">
      <div className="spread"><div><h1>Compliance</h1><p style={{marginTop:6}}>AML cases, sanctions screening, regulatory reporting</p></div>
        <Tabs tabs={['Cases','Sanctions','SAR/STR','Travel rule']} value={tab} onChange={setTab}/>
      </div>
      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
        {[['Open cases','12','3 high priority'],['SARs filed (30d)','4','SLA 100%'],['Sanctions hits (24h)','2','1 cleared, 1 pending'],['STR threshold','₦5M','Per CBN guideline']].map(([k,v,s])=>(
          <div key={k} className="card card-pad"><div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>{k}</div><div className="display num" style={{fontSize:24, fontWeight:600, marginTop:6}}>{v}</div><div className="dim" style={{fontSize:12, marginTop:2}}>{s}</div></div>
        ))}
      </div>
      {tab==='Cases' && <Card pad={false} title="Open cases">
        <table className="tbl">
          <thead><tr><th>Case</th><th>User</th><th>Trigger</th><th>Severity</th><th>Assignee</th><th>Opened</th><th>Status</th><th></th></tr></thead>
          <tbody>{[
            { id:'CASE-2391', trigger:'High velocity (24 txns/24h)', sev:'High' },
            { id:'CASE-2387', trigger:'Sanctions name match', sev:'Critical' },
            { id:'CASE-2385', trigger:'Structured deposits ₦4.99M ×3', sev:'High' },
            { id:'CASE-2382', trigger:'New device + large withdrawal', sev:'Medium' },
            { id:'CASE-2378', trigger:'Mixer-tainted UTXO', sev:'Critical' },
            { id:'CASE-2372', trigger:'Incomplete source-of-funds', sev:'Low' },
          ].map((c,i)=>(<tr key={c.id} style={{cursor:'pointer'}}>
            <td className="mono dim" style={{fontSize:11}}>{c.id}</td>
            <td><div className="row"><div className="avatar">{USERS[i].name.split(' ').map(n=>n[0]).join('')}</div><div style={{fontSize:13}}>{USERS[i].name}</div></div></td>
            <td>{c.trigger}</td>
            <td><span className={`badge ${c.sev==='Critical'?'badge-down':c.sev==='High'?'badge-warn':''}`}>{c.sev}</span></td>
            <td className="muted">Tunde B.</td>
            <td className="muted">{i+1}d ago</td>
            <td><Status s="Pending"/></td>
            <td><button className="btn btn-ghost btn-sm">Review</button></td>
          </tr>))}</tbody>
        </table>
      </Card>}
      {tab==='Sanctions' && <Card pad title="Sanctions screening">
        <div className="row gap-3 wrap">{['OFAC SDN','UN Consolidated','EU Sanctions','UK HMT','Nigerian SCUML','PEP — Worldcheck'].map(l=>(<span key={l} className="badge badge-up">{I.check}{l}</span>))}</div>
        <div className="dim" style={{fontSize:12, marginTop:14}}>Lists refreshed every 24h · last sync: 2 hours ago</div>
      </Card>}
      {tab==='SAR/STR' && <Card pad={false} title="Filed reports">
        <table className="tbl"><thead><tr><th>Report</th><th>Type</th><th>Subject</th><th>Filed by</th><th>Filed on</th><th>NFIU ref</th></tr></thead><tbody>
          {[['SAR-1042','SAR','USR-10047','Tunde B.','Mar 12','NFIU-298471'],['STR-2031','STR','USR-10052','Adaeze O.','Mar 10','NFIU-298440'],['SAR-1041','SAR','USR-10044','Tunde B.','Mar 8','NFIU-298401']].map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i} className={i===5?'mono':''}>{c}</td>)}</tr>)}
        </tbody></table>
      </Card>}
      {tab==='Travel rule' && <Card pad title="Travel rule (FATF)"><div className="dim">All transfers ≥ ₦1,000,000 enrich originator + beneficiary metadata via Sumsub Travel Rule. Coverage: 99.4% (last 30d).</div></Card>}
    </div>
  );
};

/* ===== AUDIT ===== */
const Audit = () => (
  <div className="col gap-6">
    <div className="spread"><div><h1>Audit log</h1><p style={{marginTop:6}}>Immutable record of admin & system actions</p></div>
      <div className="row gap-3"><Seg opts={['All','Admin','System']} value="All" onChange={()=>{}}/><button className="btn btn-ghost">{I.dl}Export</button></div>
    </div>
    <Card pad={false}>
      <table className="tbl">
        <thead><tr><th>ID</th><th>Actor</th><th>Action</th><th>Target</th><th>IP</th><th style={{textAlign:'right'}}>When</th></tr></thead>
        <tbody>{AUDIT.slice(0,20).map(a=>(<tr key={a.id}><td className="mono dim" style={{fontSize:11}}>{a.id}</td><td className="mono" style={{fontSize:12}}>{a.actor}</td><td>{a.action}</td><td className="mono dim" style={{fontSize:11}}>{a.target}</td><td className="mono dim" style={{fontSize:11}}>{a.ip}</td><td className="muted" style={{textAlign:'right'}}>{a.when}</td></tr>))}</tbody>
      </table>
    </Card>
  </div>
);

/* ===== CMS ===== */
const CMS = () => (
  <div className="col gap-6">
    <div className="spread"><div><h1>Content</h1><p style={{marginTop:6}}>Banners, announcements, FAQ — visible to customers</p></div>
      <button className="btn btn-primary">{I.plus}New content</button>
    </div>
    <div className="grid" style={{gridTemplateColumns:'2fr 1fr', gap:16}}>
      <Card pad={false} title="All content">
        <table className="tbl">
          <thead><tr><th>Title</th><th>Type</th><th>Audience</th><th>Status</th><th>Views</th><th>Updated</th><th></th></tr></thead>
          <tbody>{CMS_CONTENT.map(c=>(<tr key={c.id}><td style={{fontWeight:600, fontSize:13}}>{c.title}</td><td><span className="badge">{c.type}</span></td><td className="muted">{c.audience}</td><td><Status s={c.status}/></td><td className="num">{c.views}</td><td className="muted">{c.updated}</td><td><button className="btn btn-ghost btn-icon">{I.dots}</button></td></tr>))}</tbody>
        </table>
      </Card>
      <Card pad title="Live banner preview">
        <div className="card card-pad" style={{background:'var(--c-onyx-900)', color:'var(--c-cream)', border:'none'}}>
          <div className="row gap-2" style={{fontSize:11, opacity:.7, textTransform:'uppercase', letterSpacing:'0.06em'}}><span style={{background:'var(--c-lime-500)', color:'var(--c-onyx-900)', padding:'2px 6px', borderRadius:4, fontWeight:700}}>NEW</span>Promo</div>
          <div style={{fontSize:18, fontWeight:600, marginTop:8, lineHeight:1.2}}>Earn 2% cashback on USDT deposits</div>
          <div className="dim" style={{color:'rgba(244,241,234,0.6)', fontSize:12, marginTop:6}}>Valid until Mar 31, 2026 · No min</div>
          <button className="btn btn-primary btn-sm" style={{marginTop:14}}>Learn more</button>
        </div>
        <div className="dim" style={{fontSize:12, marginTop:14}}>Targeting: All users<br/>Placement: Dashboard top, Wallet header</div>
      </Card>
    </div>
  </div>
);

/* ===== REPORTS ===== */
const Reports = () => (
  <div className="col gap-6">
    <div className="spread"><div><h1>Reports</h1><p style={{marginTop:6}}>Daily, weekly, monthly business & regulatory reports</p></div>
      <div className="row gap-3"><Seg opts={['Today','7D','30D','90D','YTD']} value="30D" onChange={()=>{}}/><button className="btn btn-primary">{I.dl}Generate report</button></div>
    </div>
    <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
      {[['Volume (30d)','₦4.82B','+18% MoM',true],['Revenue (30d)','₦24.1M','+22% MoM',true],['New users','3,481','+412 vs prev',true],['Churn (30d)','2.1%','-0.4%',true]].map(([k,v,s,u])=>(<div key={k} className="card card-pad"><div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>{k}</div><div className="display num" style={{fontSize:26, fontWeight:600, marginTop:6}}>{v}</div><div className={`row gap-1 ${u?'up':'down'}`} style={{fontSize:12, marginTop:4}}>{u&&I.arrowUp}{s}</div></div>))}
    </div>
    <Card pad title="Volume by asset (30d)"><Bars data={ASSETS.map(a=>a.balNgn/1e6)} h={220} color="var(--c-lime-500)" labels={ASSETS.map(a=>a.sym)}/></Card>
    <div className="row gap-4" style={{flexWrap:'wrap'}}>
      <Card pad={false} title="Saved reports">
        <table className="tbl">
          <thead><tr><th>Report</th><th>Period</th><th>Generated</th><th>Size</th><th></th></tr></thead>
          <tbody>{[['CBN monthly digital asset report','Feb 2026','Mar 5','2.4 MB'],['NFIU compliance summary','Q1 2026','Mar 3','1.1 MB'],['Reserve attestation','Mar 1, 2026','Mar 1','842 KB'],['Revenue breakdown','Feb 2026','Mar 2','620 KB'],['User KYC status','Mar 14, 2026','Today','1.8 MB']].map(r=><tr key={r[0]}><td style={{fontWeight:600, fontSize:13}}>{r[0]}</td><td>{r[1]}</td><td className="muted">{r[2]}</td><td className="num muted">{r[3]}</td><td><button className="btn btn-ghost btn-sm">{I.dl}Download</button></td></tr>)}</tbody>
        </table>
      </Card>
    </div>
  </div>
);

/* ===== STAFF ===== */
const StaffPage = () => (
  <div className="col gap-6">
    <div className="spread"><h1>Staff & roles</h1><button className="btn btn-primary">{I.plus}Invite staff</button></div>
    <Card pad={false}>
      <table className="tbl">
        <thead><tr><th>Name</th><th>Role</th><th>Email</th><th>2FA</th><th>Last active</th><th></th></tr></thead>
        <tbody>{STAFF.map(s=>(<tr key={s.email}><td><div className="row"><div className="avatar">{s.name.split(' ').map(n=>n[0]).join('')}</div><span style={{fontSize:13, fontWeight:600}}>{s.name}</span></div></td><td><span className="badge">{s.role}</span></td><td className="mono dim" style={{fontSize:12}}>{s.email}</td><td>{s.twoFa?<Status s="Active"/>:<span className="badge badge-warn">Off</span>}</td><td className="muted">{s.lastActive}</td><td><button className="btn btn-ghost btn-icon">{I.dots}</button></td></tr>))}</tbody>
      </table>
    </Card>
    <Card pad title="Roles & permissions">
      <table className="tbl"><thead><tr><th>Permission</th><th style={{textAlign:'center'}}>Admin</th><th style={{textAlign:'center'}}>Compliance</th><th style={{textAlign:'center'}}>Support</th><th style={{textAlign:'center'}}>Finance</th><th style={{textAlign:'center'}}>Read-only</th></tr></thead>
        <tbody>{[
          ['Approve KYC',1,1,0,0,0],['Suspend users',1,1,1,0,0],['Manual transactions',1,0,0,1,0],['Edit fees',1,0,0,1,0],['Rotate keys',1,0,0,0,0],['View audit log',1,1,0,1,1],['Publish content',1,0,0,0,0],['Generate reports',1,1,0,1,1],
        ].map(r=><tr key={r[0]}><td>{r[0]}</td>{r.slice(1).map((v,i)=><td key={i} style={{textAlign:'center', color: v?'var(--c-up)':'var(--c-text-3)'}}>{v?'✓':'—'}</td>)}</tr>)}</tbody>
      </table>
    </Card>
  </div>
);

/* ===== ADMIN SETTINGS ===== */
const AdminSettings = () => (
  <div className="col gap-6">
    <h1>System settings</h1>
    <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:16}}>
      <Card pad title="Withdrawal limits"><div className="col gap-3">{[['Tier 1 daily','₦300,000'],['Tier 2 daily','₦5,000,000'],['Tier 3 daily','₦20,000,000'],['Single tx max','₦5,000,000']].map(([k,v])=>(<div key={k} className="spread"><label style={{fontSize:13}}>{k}</label><input className="input num" defaultValue={v} style={{maxWidth:160, textAlign:'right'}}/></div>))}</div></Card>
      <Card pad title="Approval thresholds"><div className="col gap-3">{[['Auto-approve <','₦500,000'],['Manual review ≥','₦5,000,000'],['Dual approval ≥','₦10,000,000'],['Cooling period (new device)','24 hours']].map(([k,v])=>(<div key={k} className="spread"><label style={{fontSize:13}}>{k}</label><input className="input num" defaultValue={v} style={{maxWidth:160, textAlign:'right'}}/></div>))}</div></Card>
      <Card pad title="Provider integrations"><div className="col gap-3">{[['Paystack (NGN)','Connected'],['NIBSS','Connected'],['Sumsub KYC','Connected'],['Chainalysis','Connected'],['Fireblocks (custody)','Connected'],['Twilio SMS','Connected']].map(([k,v])=>(<div key={k} className="spread"><span style={{fontSize:13}}>{k}</span><Status s={v}/></div>))}</div></Card>
      <Card pad title="Maintenance"><div className="col gap-3">{[['Pause deposits','off'],['Pause withdrawals','off'],['Pause trading','off'],['Read-only mode','off']].map(([k])=>(<div key={k} className="spread"><span style={{fontSize:13}}>{k}</span><div style={{width:42, height:24, background:'var(--c-surface-3)', borderRadius:999, position:'relative'}}><div style={{position:'absolute', left:2, top:2, width:20, height:20, background:'#fff', borderRadius:'50%'}}/></div></div>))}</div></Card>
    </div>
  </div>
);

Object.assign(window, { Fees, Compliance, Audit, CMS, Reports, StaffPage, AdminSettings });
