// Client dashboard — full app with routing, all screens, two variants of major screens
const { useState: cS, useMemo: cM, useEffect: cE } = React;

const CLIENT_NAV = [
  { id:'home',     label:'Overview',     icon: I.home },
  { id:'wallet',   label:'Wallet',       icon: I.wallet },
  { id:'trade',    label:'Buy / Sell',   icon: I.swap },
  { id:'send',     label:'Send',         icon: I.send },
  { id:'receive',  label:'Receive',      icon: I.recv },
  { id:'withdraw', label:'Withdraw NGN', icon: I.bank },
  { id:'orders',   label:'Orders',       icon: I.book },
  { id:'txns',     label:'Transactions', icon: I.list },
  { id:'kyc',      label:'Identity',     icon: I.shield },
  { id:'notifs',   label:'Notifications',icon: I.bell },
  { id:'referrals',label:'Referrals',    icon: I.gift },
  { id:'settings', label:'Settings',     icon: I.cog },
  { id:'support',  label:'Support',      icon: I.help },
];

const ClientShell = ({ route, setRoute, theme, setTheme, variant, children }) => {
  const totalNgn = ASSETS.reduce((a,b)=>a+b.balNgn,0);
  return (
    <div className="app" data-theme={theme} style={{display:'grid', gridTemplateColumns:'248px 1fr', height:'100vh', overflow:'hidden'}}>
      <aside style={{borderRight:'1px solid var(--c-line)', background:'var(--c-surface)', padding:'18px 14px', display:'flex', flexDirection:'column', gap:6, overflowY:'auto', height:'100vh'}}>
        <div className="row" style={{padding:'4px 8px 14px', gap:10, borderBottom:'1px solid var(--c-line)', marginBottom:8}}>
          <Logo size={24} />
          <div style={{fontWeight:600, fontSize:15, letterSpacing:'-0.02em'}}>Clusteer</div>
          <span className="badge" style={{marginLeft:'auto', fontSize:10}}>Tier 2</span>
        </div>
        {CLIENT_NAV.map(n=>(
          <div key={n.id} className={`nav-item ${route===n.id?'active':''}`} onClick={()=>setRoute(n.id)}>
            {n.icon}<span>{n.label}</span>
            {n.id==='notifs' && <span style={{marginLeft:'auto', background:'var(--c-down)', color:'#fff', fontSize:10, padding:'1px 6px', borderRadius:999}}>3</span>}
          </div>
        ))}
        <div style={{marginTop:'auto', padding:14, background:'var(--c-onyx-900)', color:'var(--c-cream)', borderRadius:14}}>
          <div style={{fontSize:11, opacity:.7, textTransform:'uppercase', letterSpacing:'0.06em'}}>Portfolio</div>
          <div className="num display" style={{fontSize:22, fontWeight:600, marginTop:2}}>{fmt.ngn(totalNgn)}</div>
          <div className="row" style={{gap:6, marginTop:6, fontSize:11, color:'var(--c-lime-500)'}}>{I.arrowUp}<span>+2.84% today</span></div>
        </div>
      </aside>

      <main style={{display:'flex', flexDirection:'column', minWidth:0, height:'100vh', overflow:'hidden'}}>
        <header style={{display:'flex', alignItems:'center', gap:12, padding:'14px 24px', borderBottom:'1px solid var(--c-line)', background:'var(--c-surface)', flexShrink:0, position:'sticky', top:0, zIndex:5}}>
          <div className="row" style={{flex:1, maxWidth:380, padding:'0 12px', height:36, border:'1px solid var(--c-line)', borderRadius:10, background:'var(--c-bg)'}}>
            <span style={{color:'var(--c-text-3)', width:16, height:16}}>{I.search}</span>
            <input className="input" style={{border:'none', background:'transparent', height:34, padding:'0 8px'}} placeholder="Search assets, txns, addresses…"/>
            <span className="kbd">⌘K</span>
          </div>
          <div style={{flex:1}}/>
          <button className="btn btn-ghost btn-icon" onClick={()=>setTheme(theme==='dark'?'light':'dark')} title="Toggle theme">{theme==='dark'?I.eye:I.eyeOff}</button>
          <button className="btn btn-ghost btn-icon" onClick={()=>setRoute('notifs')}>{I.bell}</button>
          <div className="row" style={{gap:10, padding:'0 8px 0 12px', borderLeft:'1px solid var(--c-line)', marginLeft:4}}>
            <div className="avatar">AO</div>
            <div className="col" style={{gap:0}}>
              <div style={{fontSize:13, fontWeight:600}}>Adaeze O.</div>
              <div className="dim" style={{fontSize:11}}>adaeze@…ng</div>
            </div>
          </div>
        </header>
        <div style={{flex:1, overflow:'auto', padding:'24px 24px 48px'}}>{children}</div>
      </main>
    </div>
  );
};

/* ============== CLIENT SCREENS ============== */

// Overview v1 — Hero balance + quick actions + portfolio donut + recent
const OverviewV1 = ({ go }) => {
  const total = ASSETS.reduce((a,b)=>a+b.balNgn,0);
  const slices = ASSETS.map(a=>({ value: a.balNgn, color: a.color, label: a.sym }));
  const top = [...ASSETS].sort((a,b)=>b.balNgn-a.balNgn).slice(0,4);
  const recent = TXNS.slice(0,5);
  return (
    <div className="col" style={{gap:24}}>
      <div className="row" style={{gap:16, flexWrap:'wrap'}}>
        <div style={{flex:'2 1 480px', background:'var(--c-onyx-900)', color:'var(--c-cream)', borderRadius:20, padding:28, position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', right:-40, top:-40, width:240, height:240, borderRadius:'50%', background:'var(--c-lime-500)', opacity:0.15}}/>
          <div className="row" style={{gap:8, fontSize:12, opacity:.7, textTransform:'uppercase', letterSpacing:'0.08em'}}>
            <span className="dot" style={{background:'var(--c-lime-500)'}}/>Total balance
          </div>
          <div className="display num" style={{fontSize:56, fontWeight:600, lineHeight:1, marginTop:10}}>{fmt.ngn(total)}</div>
          <div className="row" style={{gap:14, marginTop:10, fontSize:13}}>
            <span style={{color:'var(--c-lime-500)'}} className="row gap-1">{I.arrowUp}+₦487,210 (2.84%) today</span>
            <span className="dim">Across 7 assets</span>
          </div>
          <div className="row" style={{gap:10, marginTop:24, flexWrap:'wrap'}}>
            <button className="btn btn-primary" onClick={()=>go('trade')}>{I.plus}Buy crypto</button>
            <button className="btn btn-ghost" style={{borderColor:'rgba(255,255,255,0.2)', color:'var(--c-cream)'}} onClick={()=>go('trade')}>Sell</button>
            <button className="btn btn-ghost" style={{borderColor:'rgba(255,255,255,0.2)', color:'var(--c-cream)'}} onClick={()=>go('send')}>Send</button>
            <button className="btn btn-ghost" style={{borderColor:'rgba(255,255,255,0.2)', color:'var(--c-cream)'}} onClick={()=>go('receive')}>Receive</button>
            <button className="btn btn-ghost" style={{borderColor:'rgba(255,255,255,0.2)', color:'var(--c-cream)'}} onClick={()=>go('withdraw')}>Withdraw</button>
          </div>
        </div>
        <Card className="" title="Allocation" pad>
          <div className="row" style={{gap:18, alignItems:'center'}}>
            <Donut slices={slices} size={150} thickness={18} label={{title:'Assets', value:7}}/>
            <div className="col" style={{gap:8, flex:1}}>
              {ASSETS.slice(0,5).map(a=>(
                <div key={a.sym} className="spread" style={{fontSize:12.5}}>
                  <div className="row gap-2"><span className="dot" style={{background:a.color}}/>{a.sym}</div>
                  <div className="num muted">{((a.balNgn/total)*100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="row" style={{gap:16, flexWrap:'wrap'}}>
        <Card title="Top holdings" pad={false} className="" >
          <table className="tbl">
            <thead><tr><th>Asset</th><th>Price</th><th>24h</th><th>Holdings</th><th style={{textAlign:'right'}}>Value</th></tr></thead>
            <tbody>{top.map(a=>(
              <tr key={a.sym} onClick={()=>go('wallet')} style={{cursor:'pointer'}}>
                <td><div className="row"><Coin sym={a.sym}/><div><div style={{fontWeight:600, fontSize:13}}>{a.name}</div><div className="dim" style={{fontSize:11}}>{a.chain}</div></div></div></td>
                <td className="num">{fmt.ngn(a.price*1610)}</td>
                <td><span className={a.change>=0?'up':'down'}>{fmt.pct(a.change)}</span></td>
                <td className="num">{fmt.num(a.bal,4)} {a.sym}</td>
                <td className="num"><span className="num" style={{fontWeight:600}}>{fmt.ngn(a.balNgn)}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
        <Card title="Recent activity" action={<button className="tab" onClick={()=>go('txns')}>View all →</button>} pad={false} className="" >
          <div className="col" style={{gap:0}}>
            {recent.map(t=>(
              <div key={t.id} className="spread" style={{padding:'12px 20px', borderBottom:'1px solid var(--c-line)'}}>
                <div className="row">
                  <div style={{width:32, height:32, borderRadius:10, background:'var(--c-surface-2)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {t.type==='Buy'||t.type==='Receive'||t.type==='Deposit' ? <span className="up">{I.arrowDn}</span> : <span className="down">{I.arrowUp}</span>}
                  </div>
                  <div><div style={{fontWeight:600, fontSize:13}}>{t.type} {t.asset}</div><div className="dim" style={{fontSize:11}}>{t.date} · {t.when}</div></div>
                </div>
                <div className="col" style={{textAlign:'right', gap:2}}>
                  <div className="num" style={{fontWeight:600}}>{fmt.num(t.amount,4)} {t.asset}</div>
                  <div className="dim num" style={{fontSize:11}}>{fmt.ngn(t.ngn)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Markets" action={<Tabs tabs={['All','Watchlist','Gainers','Losers']} value="All" onChange={()=>{}}/>} pad={false}>
        <table className="tbl">
          <thead><tr><th>Asset</th><th>Price</th><th>24h</th><th>7d</th><th>Market cap</th><th></th></tr></thead>
          <tbody>{ASSETS.map(a=>(
            <tr key={a.sym}>
              <td><div className="row"><Coin sym={a.sym}/><div><div style={{fontWeight:600, fontSize:13}}>{a.name}</div><div className="dim" style={{fontSize:11}}>{a.sym}</div></div></div></td>
              <td className="num">{fmt.ngn(a.price*1610)}</td>
              <td><span className={a.change>=0?'up':'down'}>{fmt.pct(a.change)}</span></td>
              <td><Sparkline color={a.change>=0?'var(--c-up)':'var(--c-down)'}/></td>
              <td className="num muted">${fmt.short(a.price * (a.sym==='BTC'?19.5e6:120e6))}</td>
              <td><button className="btn btn-ghost btn-sm" onClick={()=>go('trade')}>Trade</button></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
};

// Overview v2 — denser, KPI strip + chart + activity rail
const OverviewV2 = ({ go }) => {
  const total = ASSETS.reduce((a,b)=>a+b.balNgn,0);
  return (
    <div className="col" style={{gap:20}}>
      <div className="row" style={{gap:12}}>
        <h1>Welcome back, Adaeze</h1>
        <div style={{flex:1}}/>
        <Seg opts={['1D','1W','1M','3M','1Y','All']} value="1M" onChange={()=>{}}/>
      </div>

      <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:12}}>
        {[
          { label:'Total balance', val: fmt.ngn(total), sub:'+2.84% today', up:true },
          { label:'Crypto value', val: fmt.ngn(total*0.92), sub:'7 assets', up:null },
          { label:'NGN balance', val: fmt.ngn(total*0.08), sub:'GTBank ••• 2847', up:null },
          { label:'30d P&L', val: fmt.ngn(214500), sub:'+8.4% vs prev', up:true },
        ].map((k,i)=>(
          <div key={i} className="card card-pad">
            <div className="dim" style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>{k.label}</div>
            <div className="num display" style={{fontSize:28, fontWeight:600, marginTop:6}}>{k.val}</div>
            <div className={`row gap-1 ${k.up===true?'up':k.up===false?'down':'dim'}`} style={{fontSize:12, marginTop:4}}>{k.up===true&&I.arrowUp}{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="row" style={{gap:16}}>
        <Card title="Portfolio value" action={<Seg opts={['NGN','USD']} value="NGN" onChange={()=>{}}/>} pad>
          <AreaChart data={gen(5,80,total/1e6, total/8e6)} color="var(--c-lime-500)" h={260}/>
        </Card>
      </div>

      <div className="row" style={{gap:16, flexWrap:'wrap'}}>
        <div style={{flex:'2 1 540px'}}>
          <Card title="Holdings" pad={false}>
            <table className="tbl">
              <thead><tr><th>Asset</th><th>Price</th><th>24h</th><th>Trend</th><th>Holdings</th><th style={{textAlign:'right'}}>Value</th></tr></thead>
              <tbody>{ASSETS.map(a=>(
                <tr key={a.sym} onClick={()=>go('wallet')} style={{cursor:'pointer'}}>
                  <td><div className="row"><Coin sym={a.sym}/><div><div style={{fontWeight:600, fontSize:13}}>{a.name}</div><div className="dim" style={{fontSize:11}}>{a.chain}</div></div></div></td>
                  <td className="num">{fmt.ngn(a.price*1610)}</td>
                  <td><span className={a.change>=0?'up':'down'}>{fmt.pct(a.change)}</span></td>
                  <td><Sparkline color={a.change>=0?'var(--c-up)':'var(--c-down)'}/></td>
                  <td className="num">{fmt.num(a.bal,4)}</td>
                  <td className="num" style={{fontWeight:600, textAlign:'right'}}>{fmt.ngn(a.balNgn)}</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
        </div>
        <div style={{flex:'1 1 320px'}} className="col gap-4">
          <Card title="Quick actions" pad>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
              {[['Buy','trade'],['Sell','trade'],['Send','send'],['Receive','receive'],['Withdraw','withdraw'],['Swap','trade']].map(([l,r])=>(
                <button key={l} className="btn btn-ghost" style={{height:48, justifyContent:'center'}} onClick={()=>go(r)}>{l}</button>
              ))}
            </div>
          </Card>
          <Card title="Live rate · USDT/NGN" pad>
            <div className="row spread">
              <div>
                <div className="display num" style={{fontSize:32, fontWeight:600}}>₦1,610.50</div>
                <div className="up row gap-1" style={{fontSize:12}}>{I.arrowUp}+0.32% (24h)</div>
              </div>
              <Sparkline color="var(--c-up)" w={120} h={40}/>
            </div>
          </Card>
          <Card title="KYC status" pad>
            <div className="spread"><span>Tier 2 Verified</span><Status s="Verified"/></div>
            <div className="bar" style={{marginTop:10}}><span style={{width:'66%'}}/></div>
            <div className="dim" style={{fontSize:12, marginTop:8}}>Upgrade to Tier 3 to lift daily limit to ₦20M</div>
            <button className="btn btn-dark" style={{marginTop:12, width:'100%', justifyContent:'center'}} onClick={()=>go('kyc')}>Upgrade tier</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ClientShell, CLIENT_NAV, OverviewV1, OverviewV2 });
