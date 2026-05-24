// Mobile customer screens — Home, Wallet, Trade, Send rendered inside an iOS-style frame
const { useState: mS } = React;

const PhoneFrame = ({ children, label }) => (
  <div className="col" style={{gap:10, alignItems:'center'}}>
    <div style={{
      width:380, height:780, background:'var(--c-onyx-900)', borderRadius:48, padding:12,
      boxShadow:'0 30px 80px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.04) inset'
    }}>
      <div style={{
        width:'100%', height:'100%', background:'var(--c-bg)', borderRadius:38,
        overflow:'hidden', position:'relative', display:'flex', flexDirection:'column'
      }}>
        {/* status bar */}
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'14px 28px 4px', fontSize:13, fontWeight:600, fontFamily:'var(--f-sans)',
          color:'var(--c-text)', flexShrink:0
        }}>
          <span>9:41</span>
          <div style={{position:'absolute', left:'50%', top:8, transform:'translateX(-50%)', width:110, height:28, background:'#000', borderRadius:18}}/>
          <div className="row" style={{gap:5, fontSize:12}}>
            <span>●●●●</span>
            <span>📶</span>
            <span style={{padding:'1px 5px', border:'1.5px solid currentColor', borderRadius:3, fontSize:9, fontWeight:700}}>87</span>
          </div>
        </div>
        {children}
      </div>
    </div>
    <div style={{fontSize:13, fontWeight:500, color:'var(--c-text-2)'}}>{label}</div>
  </div>
);

const MobileTabBar = ({ active, onChange }) => {
  const tabs = [
    { id:'home', label:'Home', icon:I.home },
    { id:'wallet', label:'Wallet', icon:I.wallet },
    { id:'trade', label:'Trade', icon:I.swap },
    { id:'send', label:'Send', icon:I.send },
    { id:'me', label:'Me', icon:I.user },
  ];
  return (
    <div style={{
      display:'flex', borderTop:'1px solid var(--c-line)', background:'var(--c-surface)',
      padding:'8px 8px 24px', gap:4, flexShrink:0
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)} style={{
          flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
          padding:'6px 4px', background:'transparent', border:'none', cursor:'pointer',
          color: active===t.id ? 'var(--c-text)' : 'var(--c-text-3)',
          fontFamily:'var(--f-sans)', fontSize:10, fontWeight:600
        }}>
          <span style={{width:22, height:22}}>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

const MobileHome = ({ onTab }) => {
  const total = ASSETS.reduce((a,b)=>a+b.balNgn,0);
  const top = [...ASSETS].sort((a,b)=>b.balNgn-a.balNgn).slice(0,4);
  return (<>
    <div style={{flex:1, overflowY:'auto', padding:'8px 18px 18px'}}>
      <div className="spread" style={{padding:'8px 0 16px'}}>
        <div className="row" style={{gap:10}}>
          <div className="avatar">AO</div>
          <div className="col" style={{gap:0}}>
            <div className="dim" style={{fontSize:11}}>Welcome back</div>
            <div style={{fontSize:14, fontWeight:600}}>Adaeze</div>
          </div>
        </div>
        <div className="row" style={{gap:6}}>
          <button className="btn btn-ghost btn-icon" style={{height:36, width:36}}>{I.bell}</button>
        </div>
      </div>
      <div style={{
        background:'var(--c-onyx-900)', color:'var(--c-cream)', borderRadius:20, padding:22,
        position:'relative', overflow:'hidden'
      }}>
        <div style={{position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:'50%', background:'var(--c-lime-500)', opacity:0.15}}/>
        <div className="dim" style={{fontSize:11, color:'rgba(244,241,234,0.6)', textTransform:'uppercase', letterSpacing:'0.08em'}}>Total balance</div>
        <div className="display num" style={{fontSize:34, fontWeight:600, marginTop:6, letterSpacing:'-0.02em'}}>{fmt.ngn(total)}</div>
        <div className="row" style={{gap:5, fontSize:12, marginTop:4, color:'var(--c-lime-500)'}}>{I.arrowUp}<span>+₦487,210 (2.84%) today</span></div>
        <div className="row" style={{gap:6, marginTop:18}}>
          {[['Buy','trade'],['Send','send'],['Receive','receive'],['Swap','trade']].map(([l,r])=>(
            <button key={l} onClick={()=>onTab(r==='trade'?'trade':r==='send'?'send':'home')} style={{
              flex:1, padding:'10px 0', background:'rgba(255,255,255,0.1)', color:'var(--c-cream)',
              border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, fontSize:12, fontWeight:600,
              fontFamily:'var(--f-sans)', cursor:'pointer'
            }}>{l}</button>
          ))}
        </div>
      </div>
      <div className="spread" style={{marginTop:22, marginBottom:10}}>
        <h3 style={{fontSize:14}}>Top holdings</h3>
        <button className="tab" style={{fontSize:11}} onClick={()=>onTab('wallet')}>See all →</button>
      </div>
      <div className="card" style={{padding:0}}>
        {top.map((a,i)=>(
          <div key={a.sym} className="spread" style={{padding:'12px 14px', borderBottom: i<top.length-1?'1px solid var(--c-line)':'none'}}>
            <div className="row"><Coin sym={a.sym}/>
              <div><div style={{fontSize:13, fontWeight:600}}>{a.name}</div><div className="dim" style={{fontSize:11}}>{fmt.num(a.bal,4)} {a.sym}</div></div>
            </div>
            <div className="col" style={{textAlign:'right', gap:1}}>
              <div className="num" style={{fontSize:13, fontWeight:600}}>{fmt.ngn(a.balNgn)}</div>
              <div className={`num ${a.change>=0?'up':'down'}`} style={{fontSize:11}}>{fmt.pct(a.change)}</div>
            </div>
          </div>
        ))}
      </div>
      <h3 style={{fontSize:14, marginTop:22, marginBottom:10}}>Live rate · USDT/NGN</h3>
      <div className="card card-pad spread">
        <div>
          <div className="display num" style={{fontSize:22, fontWeight:600}}>₦1,610.50</div>
          <div className="up row" style={{fontSize:11, gap:3}}>{I.arrowUp}+0.32%</div>
        </div>
        <Sparkline color="var(--c-up)" w={100} h={36}/>
      </div>
    </div>
  </>);
};

const MobileWallet = () => {
  const total = ASSETS.reduce((a,b)=>a+b.balNgn,0);
  return (
    <div style={{flex:1, overflowY:'auto', padding:'8px 18px 18px'}}>
      <h2 style={{padding:'8px 0 16px', fontSize:22}}>Wallet</h2>
      <div className="card card-pad" style={{textAlign:'center'}}>
        <div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>Total value</div>
        <div className="display num" style={{fontSize:32, fontWeight:600, marginTop:4}}>{fmt.ngn(total)}</div>
      </div>
      <div className="row" style={{gap:8, margin:'14px 0'}}>
        {['All','Crypto','Fiat'].map((t,i)=>(
          <button key={t} className={`tab ${i===0?'':''}`} aria-selected={i===0} style={{flex:1, height:34, fontSize:12}}>{t}</button>
        ))}
      </div>
      <div className="card" style={{padding:0}}>
        {ASSETS.map((a,i)=>(
          <div key={a.sym} className="spread" style={{padding:'14px', borderBottom: i<ASSETS.length-1?'1px solid var(--c-line)':'none'}}>
            <div className="row"><Coin sym={a.sym}/>
              <div><div style={{fontSize:13.5, fontWeight:600}}>{a.name}</div><div className="dim" style={{fontSize:11}}>{a.chain}</div></div>
            </div>
            <div className="col" style={{textAlign:'right', gap:1}}>
              <div className="num" style={{fontSize:13.5, fontWeight:600}}>{fmt.ngn(a.balNgn)}</div>
              <div className="num dim" style={{fontSize:11}}>{fmt.num(a.bal,4)} {a.sym}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MobileTrade = () => {
  const [side, setSide] = mS('Buy');
  const [amount, setAmount] = mS('25000');
  return (
    <div style={{flex:1, overflowY:'auto', padding:'8px 18px 18px'}}>
      <h2 style={{padding:'8px 0 16px', fontSize:22}}>{side} crypto</h2>
      <div className="row" style={{gap:6, padding:4, background:'var(--c-surface-2)', borderRadius:12, marginBottom:18}}>
        {['Buy','Sell','Swap'].map(s=>(
          <button key={s} onClick={()=>setSide(s)} style={{
            flex:1, padding:'10px 0', background: side===s?'var(--c-onyx-900)':'transparent',
            color: side===s?'var(--c-cream)':'var(--c-text-2)', border:'none', borderRadius:8,
            fontSize:13, fontWeight:600, fontFamily:'var(--f-sans)', cursor:'pointer'
          }}>{s}</button>
        ))}
      </div>
      <div className="card card-pad">
        <div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>You pay</div>
        <div className="row" style={{gap:8, marginTop:8}}>
          <input className="input num" style={{flex:1, height:54, fontSize:28, fontWeight:600, padding:'0 4px', border:'none', background:'transparent'}} value={amount} onChange={e=>setAmount(e.target.value)}/>
          <button className="btn btn-ghost" style={{height:42}}>NGN ▾</button>
        </div>
      </div>
      <div style={{textAlign:'center', margin:'-10px 0', position:'relative', zIndex:2}}>
        <div style={{display:'inline-flex', width:36, height:36, borderRadius:'50%', background:'var(--c-surface)', border:'1px solid var(--c-line)', alignItems:'center', justifyContent:'center', color:'var(--c-text)'}}>{I.arrowDn}</div>
      </div>
      <div className="card card-pad">
        <div className="dim" style={{fontSize:11, textTransform:'uppercase'}}>You get (estimated)</div>
        <div className="row" style={{gap:8, marginTop:8}}>
          <div className="num" style={{flex:1, height:54, fontSize:28, fontWeight:600, lineHeight:'54px'}}>{(parseFloat(amount||0)/1610.5).toFixed(4)}</div>
          <button className="btn btn-ghost" style={{height:42}}><Coin sym="USDT"/>USDT ▾</button>
        </div>
      </div>
      <div className="col" style={{gap:8, padding:'14px 4px', fontSize:12}}>
        <div className="spread"><span className="dim">Rate</span><span className="num">1 USDT = ₦1,610.50</span></div>
        <div className="spread"><span className="dim">Network</span><span>Tron (TRC-20)</span></div>
        <div className="spread"><span className="dim">Fee (0.5%)</span><span className="num">₦{Math.round((parseFloat(amount||0))*0.005).toLocaleString()}</span></div>
      </div>
      <button className="btn btn-primary" style={{width:'100%', height:50, justifyContent:'center', fontSize:15, marginTop:8}}>Review {side}</button>
    </div>
  );
};

const MobileSend = () => {
  const [step, setStep] = mS(1);
  return (
    <div style={{flex:1, overflowY:'auto', padding:'8px 18px 18px'}}>
      <div className="row" style={{gap:8, padding:'8px 0 16px'}}>
        {step>1 && <button className="btn btn-ghost btn-icon" onClick={()=>setStep(step-1)} style={{height:32, width:32}}>{I.arrowR&&'←'}</button>}
        <h2 style={{fontSize:22}}>Send crypto</h2>
      </div>
      <div className="row" style={{gap:6, marginBottom:18}}>
        {[1,2,3].map(s=>(
          <div key={s} style={{flex:1, height:4, borderRadius:2, background: s<=step?'var(--c-lime-500)':'var(--c-surface-3)'}}/>
        ))}
      </div>
      {step===1 && <>
        <div className="dim" style={{fontSize:12, textTransform:'uppercase', marginBottom:8}}>Asset</div>
        <div className="card" style={{padding:0, marginBottom:14}}>
          {ASSETS.slice(0,4).map((a,i)=>(
            <div key={a.sym} className="spread" style={{padding:14, borderBottom: i<3?'1px solid var(--c-line)':'none'}}>
              <div className="row"><Coin sym={a.sym}/><div><div style={{fontSize:13, fontWeight:600}}>{a.sym}</div><div className="dim" style={{fontSize:11}}>{a.chain}</div></div></div>
              <div className="num" style={{fontSize:12}}>{fmt.num(a.bal,4)}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{width:'100%', height:50, justifyContent:'center', fontSize:15}} onClick={()=>setStep(2)}>Continue with USDT</button>
      </>}
      {step===2 && <>
        <div className="dim" style={{fontSize:12, textTransform:'uppercase', marginBottom:8}}>Recipient</div>
        <input className="input mono" placeholder="TR7…or ENS / username" style={{height:48, fontSize:13, marginBottom:10}}/>
        <div className="row" style={{gap:8, marginBottom:18}}>
          <button className="btn btn-ghost" style={{flex:1, justifyContent:'center'}}>{I.qr}Scan QR</button>
          <button className="btn btn-ghost" style={{flex:1, justifyContent:'center'}}>Saved</button>
        </div>
        <div className="dim" style={{fontSize:12, textTransform:'uppercase', marginBottom:8}}>Amount</div>
        <div className="card card-pad" style={{textAlign:'center'}}>
          <div className="display num" style={{fontSize:42, fontWeight:600}}>0.00</div>
          <div className="dim num" style={{fontSize:13, marginTop:4}}>≈ ₦0.00</div>
          <div className="row" style={{gap:6, marginTop:14, justifyContent:'center'}}>
            {['25%','50%','75%','Max'].map(p=><button key={p} className="btn btn-ghost btn-sm">{p}</button>)}
          </div>
        </div>
        <button className="btn btn-primary" style={{width:'100%', height:50, justifyContent:'center', fontSize:15, marginTop:14}} onClick={()=>setStep(3)}>Review send</button>
      </>}
      {step===3 && <>
        <div className="card card-pad col" style={{gap:14}}>
          <div className="spread"><span className="dim">You're sending</span><span className="num" style={{fontWeight:600}}>500 USDT</span></div>
          <div className="spread"><span className="dim">≈ Value</span><span className="num">{fmt.ngn(805250)}</span></div>
          <div className="sep"/>
          <div className="spread"><span className="dim">To</span><span className="mono" style={{fontSize:11}}>TR7…f8K2</span></div>
          <div className="spread"><span className="dim">Network</span><span>Tron</span></div>
          <div className="spread"><span className="dim">Network fee</span><span className="num">1 TRX (~₦220)</span></div>
          <div className="sep"/>
          <div className="spread"><span style={{fontWeight:600}}>Total deducted</span><span className="num display" style={{fontSize:18, fontWeight:600}}>500 USDT</span></div>
        </div>
        <button className="btn btn-primary" style={{width:'100%', height:50, justifyContent:'center', fontSize:15, marginTop:14}}>Confirm & send</button>
      </>}
    </div>
  );
};

const MobileMe = () => (
  <div style={{flex:1, overflowY:'auto', padding:'8px 18px 18px'}}>
    <div className="card card-pad" style={{textAlign:'center', marginTop:8}}>
      <div className="avatar" style={{width:64, height:64, fontSize:24, margin:'0 auto'}}>AO</div>
      <div style={{fontSize:18, fontWeight:600, marginTop:10}}>Adaeze Okafor</div>
      <div className="dim" style={{fontSize:12}}>adaeze@…ng</div>
      <div className="row" style={{gap:6, marginTop:10, justifyContent:'center'}}>
        <span className="badge">Tier 2</span>
        <Status s="Verified"/>
      </div>
    </div>
    <div className="card" style={{padding:0, marginTop:14}}>
      {[['Identity verification', I.shield],['Bank accounts', I.bank],['Notifications', I.bell],['Security', I.lock],['Referrals', I.gift],['Support', I.help],['Settings', I.cog]].map(([l,ic],i,a)=>(
        <div key={l} className="spread" style={{padding:'14px 16px', borderBottom: i<a.length-1?'1px solid var(--c-line)':'none', cursor:'pointer'}}>
          <div className="row"><span style={{width:18, height:18, color:'var(--c-text-2)'}}>{ic}</span>{l}</div>
          <span className="dim">›</span>
        </div>
      ))}
    </div>
  </div>
);

const MobileShowcase = () => {
  const [tab1, setTab1] = mS('home');
  const [tab2, setTab2] = mS('wallet');
  const [tab3, setTab3] = mS('trade');
  const [tab4, setTab4] = mS('send');
  const [tab5, setTab5] = mS('me');
  const screens = { home:MobileHome, wallet:MobileWallet, trade:MobileTrade, send:MobileSend, me:MobileMe };
  const Render = (active) => {
    const Comp = screens[active] || MobileHome;
    return <Comp onTab={()=>{}}/>;
  };
  return (
    <div style={{padding:'40px 24px', overflowX:'auto', width:'100%', height:'100%', background:'var(--c-bg)'}}>
      <div className="col" style={{gap:6, marginBottom:30, maxWidth:980, margin:'0 auto 30px'}}>
        <h1>Mobile · iOS preview</h1>
        <p>Customer key flows in a 380×780 phone frame. Tap the tabs to switch screens within each frame.</p>
      </div>
      <div className="row" style={{gap:30, alignItems:'flex-start', minWidth:'max-content', justifyContent:'center', padding:'0 30px 60px'}}>
        {[
          { key:'home', label:'Home', active:tab1, set:setTab1 },
          { key:'wallet', label:'Wallet', active:tab2, set:setTab2 },
          { key:'trade', label:'Trade', active:tab3, set:setTab3 },
          { key:'send', label:'Send', active:tab4, set:setTab4 },
          { key:'me', label:'Account', active:tab5, set:setTab5 },
        ].map(p=>(
          <PhoneFrame key={p.key} label={p.label}>
            {Render(p.active)}
            <MobileTabBar active={p.active} onChange={p.set}/>
          </PhoneFrame>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { MobileShowcase, PhoneFrame, MobileHome, MobileWallet, MobileTrade, MobileSend, MobileMe, MobileTabBar });
