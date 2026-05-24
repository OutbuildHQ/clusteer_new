// Detail drawers — Txn, Order, KYC case, User profile (customer + admin variants)
const { useState: dS, useEffect: dE } = React;

/* ===== Shared drawer shell ===== */
const Drawer = ({ open, onClose, width=520, title, children, footer }) => {
  dE(()=>{
    if(!open) return;
    const k = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if(!open) return null;
  return (
    <div className="modal-back" onClick={onClose} style={{justifyContent:'flex-end', padding:0}}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:width, width:'100%', height:'100%', maxHeight:'100vh', borderRadius:'20px 0 0 20px', display:'flex', flexDirection:'column', animation:'drawerIn .22s cubic-bezier(.2,.7,.2,1)'}}>
        <div className="card-hd"><div style={{fontWeight:600, fontSize:15}}>{title}</div><button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button></div>
        <div className="card-pad col gap-4" style={{flex:1, overflow:'auto'}}>{children}</div>
        {footer && <div className="card-pad" style={{borderTop:'1px solid var(--c-line)', display:'flex', gap:8, justifyContent:'flex-end'}}>{footer}</div>}
      </div>
    </div>
  );
};

/* ===== Status timeline ===== */
const Timeline = ({ steps }) => (
  <div className="col" style={{gap:0}}>
    {steps.map((s,i)=>(
      <div key={i} className="row gap-3" style={{alignItems:'flex-start', paddingBottom: i<steps.length-1 ? 14 : 0}}>
        <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
          <div style={{width:18, height:18, borderRadius:'50%', background: s.done ? 'var(--c-up)' : s.active ? 'var(--c-accent)' : 'var(--c-surface-2)', border: '2px solid var(--c-surface)', boxShadow: s.active ? '0 0 0 3px color-mix(in oklab, var(--c-accent) 25%, transparent)' : 'none', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-on-accent)', fontSize:10}}>{s.done && '✓'}</div>
          {i<steps.length-1 && <div style={{width:2, flex:1, minHeight:24, background: s.done ? 'var(--c-up)' : 'var(--c-line)', marginTop:2}}/>}
        </div>
        <div style={{flex:1, paddingTop:1}}>
          <div style={{fontWeight:500, fontSize:13.5, color: s.done||s.active ? 'var(--c-text)' : 'var(--c-text-dim)'}}>{s.label}</div>
          {s.time && <div className="muted mono" style={{fontSize:11, marginTop:2}}>{s.time}</div>}
          {s.note && <div className="dim" style={{fontSize:12, marginTop:2}}>{s.note}</div>}
        </div>
      </div>
    ))}
  </div>
);

/* ===== KV row ===== */
const KV = ({ k, v, mono=false, copy=false }) => (
  <div className="spread" style={{padding:'10px 0', borderBottom:'1px solid var(--c-line)', fontSize:13}}>
    <div className="dim">{k}</div>
    <div className={`row gap-2 ${mono?'mono num':''}`} style={{alignItems:'center'}}>
      <span>{v}</span>
      {copy && <button className="btn btn-ghost btn-icon" style={{width:24, height:24}} title="Copy">{I.copy}</button>}
    </div>
  </div>
);

/* ===== TXN DETAIL (used by customer + admin) ===== */
const TxnDetail = ({ txn, open, onClose, admin=false, toast }) => {
  if(!txn) return null;
  const isOut = ['Send','Sell','Withdraw'].includes(txn.type);
  const colorCls = isOut ? 'down' : 'up';
  const hashSample = '0x'+(txn.id.replace(/[^0-9a-f]/gi,'')+'a3f7c91d4e8b2057f1c3').slice(0,40);
  const steps = [
    { label:'Initiated', time: `${txn.date} · ${txn.when}`, done:true },
    { label:'Submitted to network', time: `${txn.when}`, done: txn.status!=='Pending' && txn.status!=='Failed', note: txn.asset!=='NGN' && txn.status==='Pending' ? 'Broadcast to mempool' : null },
    { label:'Confirmations', time: txn.status==='Completed' ? `12 / 12` : `${Math.floor(Math.random()*8)} / 12`, done: txn.status==='Completed', active: txn.status==='Pending' },
    { label: txn.status==='Failed' ? 'Failed' : 'Completed', time: txn.status==='Completed' ? `${txn.when}` : null, done: txn.status==='Completed' },
  ];
  const fee = txn.asset==='NGN' ? '₦50.00' : txn.asset==='USDT' ? '1.00 TRX' : txn.asset==='USDC' ? '0.30 BNB' : '0.000042 BTC';
  return (
    <Drawer open={open} onClose={onClose} width={admin?640:520} title={`Transaction ${txn.id}`}
      footer={admin ? <>
        <button className="btn btn-ghost" onClick={()=>toast?.('Note saved')}>Add note</button>
        <button className="btn btn-ghost" style={{color:'var(--c-down)'}} onClick={()=>toast?.('Transaction flagged for review','warn')}>Flag</button>
        {txn.status==='Pending' && <button className="btn btn-primary" onClick={()=>{toast?.('Transaction approved','success'); onClose();}}>Approve</button>}
      </> : <>
        <button className="btn btn-ghost" onClick={()=>toast?.('Receipt link copied')}>Share receipt</button>
        <button className="btn btn-ghost" onClick={()=>toast?.('Issue reported','warn')}>Report issue</button>
      </>}>
      <div style={{textAlign:'center', padding:'8px 0 4px'}}>
        <div className={`display num ${colorCls}`} style={{fontSize:34, fontWeight:600}}>{isOut?'-':'+'}{txn.amount.toFixed(txn.asset==='NGN'?0:txn.asset==='BTC'?6:2)} {txn.asset}</div>
        <div className="muted num" style={{marginTop:4}}>≈ {fmt.ngn(txn.ngn)}</div>
        <div style={{marginTop:10}}><Status s={txn.status}/></div>
      </div>

      <div className="card" style={{padding:'4px 14px'}}>
        <KV k="Type" v={txn.type} />
        <KV k="Asset" v={`${txn.asset}${txn.asset==='USDT'?' (TRC20)':txn.asset==='USDC'?' (BSC)':''}`} />
        <KV k="Date" v={`${txn.date} · ${txn.when}`} />
        <KV k="Network fee" v={fee} mono />
        {txn.asset!=='NGN' && <KV k="Tx hash" v={`${hashSample.slice(0,10)}...${hashSample.slice(-8)}`} mono copy />}
        {txn.asset==='NGN' && <KV k="Reference" v={`CLR${txn.id.replace(/[^0-9]/g,'')}789`} mono copy />}
        {txn.type==='Send' && <KV k="To" v={txn.asset==='NGN'?'Adaobi Nwosu · GTBank':`${hashSample.slice(0,8)}...${hashSample.slice(-6)}`} mono copy />}
        {txn.type==='Receive' && <KV k="From" v={txn.asset==='NGN'?'Funmi Bello · UBA':`${hashSample.slice(0,8)}...${hashSample.slice(-6)}`} mono copy />}
        {admin && <KV k="User" v={`${USERS[parseInt(txn.id.replace(/\D/g,''))%USERS.length].name}`} />}
        {admin && <KV k="IP" v="105.112.43.18 (Lagos, NG)" mono />}
        {admin && <KV k="Device" v="iPhone 15 · Clusteer iOS 1.4.2" />}
      </div>

      <div className="card card-pad">
        <h4 style={{marginBottom:12}}>Status</h4>
        <Timeline steps={steps}/>
      </div>

      {txn.asset!=='NGN' && <button className="btn btn-ghost" style={{justifyContent:'center'}} onClick={()=>toast?.('Opening explorer...')}>{I.external}View on {txn.asset==='USDT'?'TronScan':txn.asset==='USDC'?'BscScan':'Mempool'}</button>}
    </Drawer>
  );
};

/* ===== ORDER DETAIL ===== */
const OrderDetail = ({ order, open, onClose, toast }) => {
  if(!order) return null;
  const filled = order.status==='Filled' ? order.amount : order.status==='Partial' ? order.amount * 0.62 : 0;
  const pct = (filled/order.amount)*100;
  return (
    <Drawer open={open} onClose={onClose} title={`Order ${order.id}`}
      footer={<>
        {(order.status==='Open' || order.status==='Partial') && <button className="btn btn-ghost" style={{color:'var(--c-down)'}} onClick={()=>{toast?.('Order cancelled','warn'); onClose();}}>Cancel order</button>}
        <button className="btn btn-primary" onClick={onClose}>Done</button>
      </>}>
      <div className="card" style={{padding:'14px'}}>
        <div className="spread">
          <div>
            <div className="row gap-2"><span className={`badge ${order.side==='Buy'?'badge-up':'badge-down'}`}>{order.side}</span><span className="badge">{order.pair}</span><Status s={order.status}/></div>
            <div className="display num" style={{fontSize:24, fontWeight:600, marginTop:8}}>{order.amount.toFixed(4)} {order.pair.split('/')[0]}</div>
            <div className="muted num" style={{marginTop:2}}>@ {fmt.ngn(order.price)}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>Total</div>
            <div className="num" style={{fontSize:18, fontWeight:600, marginTop:4}}>{fmt.ngn(order.price*order.amount)}</div>
          </div>
        </div>
        <div className="sep" style={{margin:'14px 0'}}/>
        <div>
          <div className="spread" style={{fontSize:12, marginBottom:6}}><span className="dim">Filled</span><span className="num">{filled.toFixed(4)} / {order.amount.toFixed(4)} ({pct.toFixed(0)}%)</span></div>
          <div style={{height:6, borderRadius:3, background:'var(--c-surface-2)', overflow:'hidden'}}><div style={{height:'100%', width:`${pct}%`, background:'var(--c-accent)'}}/></div>
        </div>
      </div>

      <div className="card" style={{padding:'4px 14px'}}>
        <KV k="Order type" v="Limit" />
        <KV k="Time in force" v="Good till cancel" />
        <KV k="Placed" v={order.placed} />
        <KV k="Order ID" v={order.id} mono copy />
        <KV k="Estimated fee" v={`${(order.price*order.amount*0.001).toFixed(2)} NGN`} mono />
      </div>

      <div className="card card-pad">
        <h4 style={{marginBottom:12}}>Fills</h4>
        {order.status==='Open' ? <div className="empty" style={{padding:'24px 0'}}><div className="dim">No fills yet</div><div className="muted" style={{fontSize:12, marginTop:4}}>Order is waiting in the book</div></div> :
          <div className="col">{[
            order.status==='Filled' ? {amt:order.amount*0.45, time:'09:42:18', px:order.price} : null,
            {amt: order.status==='Filled' ? order.amount*0.55 : order.amount*0.62, time:'09:43:51', px:order.price-50},
          ].filter(Boolean).map((f,i)=>(
            <div key={i} className="spread" style={{padding:'10px 0', borderBottom:'1px solid var(--c-line)', fontSize:13}}>
              <div><div className="num">{f.amt.toFixed(4)} {order.pair.split('/')[0]}</div><div className="muted mono" style={{fontSize:11, marginTop:2}}>{f.time}</div></div>
              <div className="num" style={{textAlign:'right'}}>{fmt.ngn(f.px)}</div>
            </div>
          ))}</div>
        }
      </div>
    </Drawer>
  );
};

/* ===== KYC CASE (admin) ===== */
const KycCase = ({ kase, open, onClose, toast, onApprove, onReject }) => {
  if(!kase) return null;
  const [activeDoc, setActiveDoc] = dS('selfie');
  const [note, setNote] = dS('');
  const docs = [
    { k:'selfie', label:'Selfie + ID liveness', present:kase.docs?.selfie },
    { k:'idFront', label:'NIN — front', present:kase.docs?.idFront },
    { k:'idBack', label:'NIN — back', present:kase.docs?.idBack },
    { k:'addressProof', label:'Proof of address', present:kase.docs?.addressProof },
  ];
  return (
    <Drawer open={open} onClose={onClose} width={760} title={`KYC case · ${kase.name}`}
      footer={<>
        <button className="btn btn-ghost" style={{color:'var(--c-down)'}} onClick={()=>{onReject?.(kase, 'Document mismatch'); toast?.('KYC rejected','warn'); onClose();}}>Reject</button>
        <button className="btn btn-ghost" onClick={()=>toast?.('Requested resubmission')}>Request resubmit</button>
        <button className="btn btn-primary" onClick={()=>{onApprove?.(kase); toast?.('KYC approved · upgraded to Tier 2','success'); onClose();}}>Approve</button>
      </>}>
      <div className="row gap-3" style={{alignItems:'center'}}>
        <div className="avatar" style={{width:48, height:48, fontSize:18}}>{kase.name.split(' ').map(n=>n[0]).join('')}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600}}>{kase.name}</div>
          <div className="dim" style={{fontSize:12}}>{kase.email} · submitted {kase.submitted}</div>
        </div>
        <Status s="Pending"/>
      </div>

      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:14}}>
        <div className="card card-pad">
          <h4 style={{marginBottom:8, fontSize:13}}>Personal</h4>
          <div className="col" style={{gap:6, fontSize:13}}>
            <div className="spread"><span className="dim">DOB</span><span className="num">14 Mar 1992</span></div>
            <div className="spread"><span className="dim">BVN</span><span className="num mono">{kase.bvn}</span></div>
            <div className="spread"><span className="dim">NIN</span><span className="num mono">{kase.nin}</span></div>
            <div className="spread"><span className="dim">Phone</span><span className="num mono">{kase.phone}</span></div>
          </div>
        </div>
        <div className="card card-pad">
          <h4 style={{marginBottom:8, fontSize:13}}>Address</h4>
          <div style={{fontSize:13, lineHeight:1.5}}>{kase.address}</div>
          <div className="sep" style={{margin:'10px 0'}}/>
          <h4 style={{marginBottom:8, fontSize:13}}>Bank on file</h4>
          <div style={{fontSize:13}}>{kase.bank?.name} · <span className="num mono">{kase.acctNo}</span></div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd"><h4 style={{margin:0, fontSize:13}}>Documents</h4></div>
        <div style={{display:'grid', gridTemplateColumns:'180px 1fr', minHeight:280}}>
          <div style={{borderRight:'1px solid var(--c-line)', padding:'8px'}}>
            {docs.map(d=>(
              <button key={d.k} onClick={()=>setActiveDoc(d.k)} className="row gap-2" style={{padding:'8px 10px', borderRadius:8, width:'100%', textAlign:'left', background: activeDoc===d.k?'var(--c-surface-2)':'transparent', border:'none', cursor:'pointer', fontSize:12.5, color:'var(--c-text)', marginBottom:2}}>
                <span style={{width:8, height:8, borderRadius:'50%', background: d.present?'var(--c-up)':'var(--c-down)'}}/>
                <span style={{flex:1}}>{d.label}</span>
              </button>
            ))}
          </div>
          <div style={{padding:14, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--c-surface-2)', borderRadius:'0 0 var(--r-xl) 0'}}>
            <div style={{width:'100%', maxWidth:320, aspectRatio:'3/4', borderRadius:12, background:'linear-gradient(135deg, var(--c-onyx-700), var(--c-onyx-900))', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--c-cream)', textAlign:'center', padding:20}}>
              <div>
                <div style={{fontSize:12, opacity:0.6, textTransform:'uppercase', letterSpacing:1}}>Document preview</div>
                <div style={{marginTop:8, fontWeight:500}}>{docs.find(d=>d.k===activeDoc)?.label}</div>
                <div style={{fontSize:11, opacity:0.5, marginTop:8}}>Tap to open full image</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <h4 style={{marginBottom:8, fontSize:13}}>Risk signals</h4>
        <div className="col" style={{gap:6, fontSize:13}}>
          <div className="row gap-2"><span className="badge badge-up">PASS</span><span>Face match score 96%</span></div>
          <div className="row gap-2"><span className="badge badge-up">PASS</span><span>NIN matches BVN registry</span></div>
          <div className="row gap-2"><span className="badge badge-up">PASS</span><span>Not on PEP / sanctions list</span></div>
          <div className="row gap-2"><span className="badge badge-warn">WATCH</span><span>Device fingerprint seen on 1 other account</span></div>
        </div>
      </div>

      <div className="card card-pad">
        <h4 style={{marginBottom:8, fontSize:13}}>Reviewer note</h4>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Internal note (visible to compliance team only)" style={{width:'100%', minHeight:70, padding:10, borderRadius:8, border:'1px solid var(--c-line)', background:'var(--c-bg)', color:'var(--c-text)', fontFamily:'inherit', fontSize:13, resize:'vertical'}}/>
      </div>
    </Drawer>
  );
};

/* ===== USER PROFILE (full admin drawer, richer than UserDrawer) ===== */
const UserProfile = ({ user, open, onClose, toast }) => {
  const [tab, setTab] = dS('Overview');
  if(!user) return null;
  const userTxns = TXNS.slice(0, 12);
  return (
    <Drawer open={open} onClose={onClose} width={780} title={user.name}
      footer={<>
        <button className="btn btn-ghost" onClick={()=>toast?.('Password reset link sent')}>Reset password</button>
        <button className="btn btn-ghost" onClick={()=>toast?.('2FA reset')}>Reset 2FA</button>
        <button className="btn btn-ghost" style={{color:'var(--c-down)'}} onClick={()=>toast?.('User suspended','warn')}>Suspend</button>
      </>}>
      <div className="row gap-3" style={{alignItems:'center'}}>
        <div className="avatar" style={{width:56, height:56, fontSize:20}}>{user.name.split(' ').map(n=>n[0]).join('')}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:18, fontWeight:600}}>{user.name}</div>
          <div className="dim" style={{fontSize:13}}>{user.email} · {user.phone}</div>
          <div className="row gap-2 wrap" style={{marginTop:6}}><Status s={user.status}/><span className="badge">{user.tier}</span><Status s={user.kyc}/>{user.flags?.map(f=><span key={f} className="badge badge-warn">{f}</span>)}</div>
        </div>
      </div>

      <Tabs tabs={['Overview','Wallets','Transactions','Activity','Notes']} value={tab} onChange={setTab}/>

      {tab==='Overview' && <>
        <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
          <div className="kpi"><div className="muted" style={{fontSize:11, textTransform:'uppercase'}}>Total balance</div><div className="num" style={{fontSize:22, fontWeight:600, marginTop:6}}>{fmt.ngn(user.bal)}</div></div>
          <div className="kpi"><div className="muted" style={{fontSize:11, textTransform:'uppercase'}}>Lifetime volume</div><div className="num" style={{fontSize:22, fontWeight:600, marginTop:6}}>{fmt.ngn(user.bal*4.2)}</div></div>
          <div className="kpi"><div className="muted" style={{fontSize:11, textTransform:'uppercase'}}>Joined</div><div style={{fontSize:14, fontWeight:500, marginTop:8}}>{user.joined}</div></div>
        </div>
        <div className="card" style={{padding:'4px 14px'}}>
          <KV k="BVN" v={user.bvn} mono />
          <KV k="NIN" v={user.nin} mono />
          <KV k="Bank" v={`${user.bank.name} · ${user.acctNo}`} mono />
          <KV k="Address" v={user.address} />
          <KV k="Daily limit" v={user.tier==='Tier 3'?'₦50,000,000':user.tier==='Tier 2'?'₦5,000,000':'₦300,000'} mono />
        </div>
      </>}

      {tab==='Wallets' && <div className="card card-pad">
        <table className="t"><thead><tr><th>Asset</th><th>Balance</th><th>NGN value</th><th>Address</th></tr></thead>
          <tbody>{ASSETS.slice(0,4).map(a=>(
            <tr key={a.sym}><td><div className="row gap-2"><span style={{width:24,height:24,borderRadius:'50%',background:`var(--ch-${a.sym.toLowerCase()})`,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600}}>{a.sym[0]}</span><span>{a.sym}</span></div></td>
              <td className="num mono">{(user.bal/a.priceNgn*0.4).toFixed(a.sym==='BTC'?6:2)}</td>
              <td className="num">{fmt.ngn(user.bal*0.4*Math.random())}</td>
              <td className="mono dim" style={{fontSize:11}}>{a.sym==='NGN'?'—':'0x4f...8a2c'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {tab==='Transactions' && <div className="card card-pad">
        <table className="t"><thead><tr><th>Date</th><th>Type</th><th>Asset</th><th style={{textAlign:'right'}}>Amount</th><th style={{textAlign:'right'}}>NGN</th><th>Status</th></tr></thead>
          <tbody>{userTxns.map(t=>(
            <tr key={t.id}><td className="mono dim" style={{fontSize:11}}>{t.date}<br/>{t.when}</td><td>{t.type}</td><td>{t.asset}</td><td className="num mono" style={{textAlign:'right'}}>{t.amount.toFixed(2)}</td><td className="num" style={{textAlign:'right'}}>{fmt.ngn(t.ngn)}</td><td><Status s={t.status}/></td></tr>
          ))}</tbody>
        </table>
      </div>}

      {tab==='Activity' && <div className="card card-pad">
        <Timeline steps={[
          { label:'Logged in', time:'Today 10:42 · Lagos, NG · iPhone 15', done:true },
          { label:'Completed Buy 250 USDT', time:'Today 10:38', done:true },
          { label:'Updated bank account', time:'Yesterday 16:12', done:true, note:'Changed default to GTBank ••• 2847' },
          { label:'2FA enabled', time:'14 Apr 2026', done:true },
          { label:'KYC approved → Tier 2', time:'8 Apr 2026', done:true },
          { label:'Account created', time:user.joined, done:true },
        ]}/>
      </div>}

      {tab==='Notes' && <div className="card card-pad">
        <div className="col gap-3">
          <div className="card card-pad" style={{background:'var(--c-surface-2)'}}>
            <div className="spread"><div style={{fontSize:12, fontWeight:600}}>Bisi · Compliance</div><div className="muted" style={{fontSize:11}}>2 days ago</div></div>
            <div style={{fontSize:13, marginTop:6}}>Reviewed monthly volume — within expected range for Tier 2 trader. No action needed.</div>
          </div>
          <textarea placeholder="Add internal note..." style={{width:'100%', minHeight:70, padding:10, borderRadius:8, border:'1px solid var(--c-line)', background:'var(--c-bg)', color:'var(--c-text)', fontFamily:'inherit', fontSize:13, resize:'vertical'}}/>
          <button className="btn btn-primary" style={{alignSelf:'flex-start'}} onClick={()=>toast?.('Note added')}>Add note</button>
        </div>
      </div>}
    </Drawer>
  );
};

Object.assign(window, { Drawer, Timeline, KV, TxnDetail, OrderDetail, KycCase, UserProfile });
