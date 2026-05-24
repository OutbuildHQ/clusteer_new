// Client screens — Wallet, Asset detail, Buy/Sell/Swap, Send/Receive, Withdraw
const { useState: cS2 } = React;

/* ===== WALLET ===== */
const Wallet = ({ go, setActiveAsset }) => {
  const [tab, setTab] = cS2('All');
  const total = ASSETS.reduce((a,b)=>a+b.balNgn,0);
  const list = ASSETS.filter(a => tab==='All' || (tab==='Holdings' && a.bal>0));
  return (
    <div className="col gap-6">
      <div className="spread"><h1>Wallet</h1>
        <div className="row gap-3">
          <button className="btn btn-ghost">{I.dl}Export CSV</button>
          <button className="btn btn-primary" onClick={()=>go('trade')}>{I.plus}Buy</button>
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns:'2fr 1fr', gap:16}}>
        <div className="card card-pad" style={{background:'var(--c-onyx-900)', color:'var(--c-cream)', border:'none'}}>
          <div className="dim" style={{color:'rgba(244,241,234,0.6)', fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>Total wallet value</div>
          <div className="display num" style={{fontSize:42, fontWeight:600, marginTop:6}}>{fmt.ngn(total)}</div>
          <div className="row gap-3" style={{marginTop:6, fontSize:12}}>
            <span style={{color:'var(--c-lime-500)'}}>+₦487,210 today</span>
            <span style={{color:'rgba(244,241,234,0.5)'}}>≈ ${fmt.short(total/1610)}</span>
          </div>
        </div>
        <div className="card card-pad">
          <div className="dim" style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>NGN balance</div>
          <div className="display num" style={{fontSize:32, fontWeight:600, marginTop:6}}>₦1,284,500</div>
          <div className="row gap-2" style={{marginTop:8}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>go('withdraw')}>Withdraw</button>
            <button className="btn btn-ghost btn-sm">Add funds</button>
          </div>
        </div>
      </div>

      <Card title="Assets" action={<Tabs tabs={['All','Holdings','Watchlist']} value={tab} onChange={setTab}/>} pad={false}>
        <table className="tbl">
          <thead><tr><th>Asset</th><th>Balance</th><th>Price</th><th>24h</th><th>Trend</th><th style={{textAlign:'right'}}>Value</th><th></th></tr></thead>
          <tbody>{list.map(a=>(
            <tr key={a.sym} style={{cursor:'pointer'}} onClick={()=>{ setActiveAsset(a.sym); go('asset'); }}>
              <td><div className="row"><Coin sym={a.sym}/><div><div style={{fontWeight:600, fontSize:13}}>{a.name}</div><div className="dim" style={{fontSize:11}}>{a.chain}</div></div></div></td>
              <td className="num">{fmt.num(a.bal,4)} {a.sym}</td>
              <td className="num">{fmt.ngn(a.price*1610)}</td>
              <td><span className={a.change>=0?'up':'down'}>{fmt.pct(a.change)}</span></td>
              <td><Sparkline color={a.change>=0?'var(--c-up)':'var(--c-down)'}/></td>
              <td className="num" style={{fontWeight:600, textAlign:'right'}}>{fmt.ngn(a.balNgn)}</td>
              <td>{I.arrowR}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
};

/* ===== ASSET DETAIL ===== */
const AssetDetail = ({ sym, go }) => {
  const a = ASSETS.find(x=>x.sym===sym) || ASSETS[0];
  const [chartType, setChartType] = cS2('Candle');
  return (
    <div className="col gap-6">
      <div className="row gap-3">
        <button className="btn btn-ghost btn-icon" onClick={()=>go('wallet')}>←</button>
        <Coin sym={a.sym}/>
        <div><h2>{a.name} <span className="dim" style={{fontWeight:400, fontSize:14}}>{a.sym}</span></h2></div>
        <div style={{flex:1}}/>
        <button className="btn btn-ghost" onClick={()=>go('send')}>{I.send}Send</button>
        <button className="btn btn-ghost" onClick={()=>go('receive')}>{I.recv}Receive</button>
        <button className="btn btn-primary" onClick={()=>go('trade')}>Trade</button>
      </div>

      <div className="grid" style={{gridTemplateColumns:'2fr 1fr', gap:16}}>
        <Card pad>
          <div className="spread" style={{marginBottom:14}}>
            <div>
              <div className="dim" style={{fontSize:12}}>Price</div>
              <div className="display num" style={{fontSize:36, fontWeight:600}}>{fmt.ngn(a.price*1610)}</div>
              <div className={a.change>=0?'up':'down'} style={{fontSize:13}}>{fmt.pct(a.change)} (24h)</div>
            </div>
            <div className="row gap-3">
              <Tabs tabs={['Candle','Line','Area']} value={chartType} onChange={setChartType}/>
              <Seg opts={['1D','1W','1M','3M','1Y']} value="1M" onChange={()=>{}}/>
            </div>
          </div>
          {chartType==='Candle' ? <CandleChart h={320}/> :
           chartType==='Line' ? <LineChart series={[{ data: gen(7,80,a.price,a.price*0.05), color:'var(--c-lime-500)' }]} h={320}/> :
           <AreaChart h={320} color="var(--c-lime-500)"/>}
        </Card>

        <Card title="Your position" pad>
          <div className="col gap-4">
            <div>
              <div className="dim" style={{fontSize:12}}>Balance</div>
              <div className="display num" style={{fontSize:28, fontWeight:600}}>{fmt.num(a.bal,4)} {a.sym}</div>
              <div className="dim num" style={{fontSize:13}}>{fmt.ngn(a.balNgn)}</div>
            </div>
            <div className="sep"/>
            <div className="spread"><span className="muted">Avg buy</span><span className="num">{fmt.ngn(a.price*0.94*1610)}</span></div>
            <div className="spread"><span className="muted">Total invested</span><span className="num">{fmt.ngn(a.balNgn*0.94)}</span></div>
            <div className="spread"><span className="muted">P&L</span><span className="num up">+{fmt.ngn(a.balNgn*0.06)}</span></div>
            <div className="sep"/>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
              <button className="btn btn-primary" style={{justifyContent:'center'}} onClick={()=>go('trade')}>Buy</button>
              <button className="btn btn-ghost" style={{justifyContent:'center'}} onClick={()=>go('trade')}>Sell</button>
            </div>
          </div>
        </Card>
      </div>

      <Card title={`${a.sym} transactions`} pad={false}>
        <table className="tbl">
          <thead><tr><th>Type</th><th>Amount</th><th>Status</th><th>Hash</th><th style={{textAlign:'right'}}>Date</th></tr></thead>
          <tbody>{TXNS.filter(t=>t.asset===a.sym).slice(0,8).map(t=>(
            <tr key={t.id}>
              <td>{t.type}</td>
              <td className="num">{fmt.num(t.amount,4)} {t.asset}</td>
              <td><Status s={t.status}/></td>
              <td className="mono dim" style={{fontSize:11}}>{t.hash || '—'}</td>
              <td className="num" style={{textAlign:'right'}}>{t.date} {t.when}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
};

/* ===== TRADE (Buy/Sell/Swap) ===== */
const Trade = ({ variant }) => {
  const [side, setSide] = cS2('Buy');
  const [asset, setAsset] = cS2('USDT');
  const [amount, setAmount] = cS2('');
  const a = ASSETS.find(x=>x.sym===asset);
  const ngn = parseFloat(amount||0) * a.price * 1610;

  if (variant === 'v2') {
    // V2: Pro trade with order book
    return (
      <div className="col gap-4">
        <div className="row gap-3">
          <h1>{a.sym}/NGN</h1>
          <div className="display num" style={{fontSize:24, fontWeight:600}}>{fmt.ngn(a.price*1610)}</div>
          <span className={a.change>=0?'up':'down'}>{fmt.pct(a.change)}</span>
          <div style={{flex:1}}/>
          <Tabs tabs={ASSETS.map(x=>x.sym)} value={asset} onChange={setAsset}/>
        </div>
        <div className="grid" style={{gridTemplateColumns:'2fr 1fr 1fr', gap:12}}>
          <Card pad><CandleChart h={380}/></Card>
          <Card title="Order book" pad={false}>
            <div className="col" style={{padding:'8px 14px', fontSize:11, color:'var(--c-text-3)'}}><div className="spread"><span>Price (NGN)</span><span>Amount</span></div></div>
            {Array.from({length:8}).map((_,i)=>{
              const p = a.price*1610*(1+(0.001*(8-i))); const q = (Math.random()*120).toFixed(2);
              return <div key={`s${i}`} className="spread" style={{padding:'4px 14px', fontSize:12, position:'relative'}}>
                <div style={{position:'absolute', right:0, top:0, bottom:0, width: `${(8-i)*8}%`, background:'var(--c-down-soft)'}}/>
                <span className="num down" style={{position:'relative'}}>{fmt.ngn(p)}</span><span className="num" style={{position:'relative'}}>{q}</span>
              </div>;
            })}
            <div className="spread" style={{padding:'8px 14px', borderTop:'1px solid var(--c-line)', borderBottom:'1px solid var(--c-line)', background:'var(--c-surface-2)'}}>
              <div className="display num" style={{fontSize:18, fontWeight:600}}>{fmt.ngn(a.price*1610)}</div>
              <span className="badge badge-up">↑ 0.32%</span>
            </div>
            {Array.from({length:8}).map((_,i)=>{
              const p = a.price*1610*(1-(0.001*(i+1))); const q = (Math.random()*120).toFixed(2);
              return <div key={`b${i}`} className="spread" style={{padding:'4px 14px', fontSize:12, position:'relative'}}>
                <div style={{position:'absolute', right:0, top:0, bottom:0, width: `${(i+1)*8}%`, background:'var(--c-up-soft)'}}/>
                <span className="num up" style={{position:'relative'}}>{fmt.ngn(p)}</span><span className="num" style={{position:'relative'}}>{q}</span>
              </div>;
            })}
          </Card>
          <Card title="Place order" pad>
            <Seg opts={['Buy','Sell']} value={side} onChange={setSide}/>
            <Tabs tabs={['Market','Limit','Stop']} value="Market" onChange={()=>{}}/>
            <div className="col gap-3" style={{marginTop:14}}>
              <div><label className="dim" style={{fontSize:12}}>Amount</label><input className="input" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)}/></div>
              <div><label className="dim" style={{fontSize:12}}>Total (NGN)</label><div className="input num" style={{justifyContent:'flex-end'}}>{fmt.ngn(ngn)}</div></div>
              <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:6}}>{['25%','50%','75%','100%'].map(p=><button key={p} className="btn btn-ghost btn-sm" style={{justifyContent:'center'}}>{p}</button>)}</div>
              <button className="btn btn-primary" style={{justifyContent:'center', height:42, marginTop:6}}>{side} {asset}</button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // V1: Simple buy/sell flow
  return (
    <div className="col gap-6" style={{maxWidth:520, margin:'0 auto', width:'100%'}}>
      <h1>Buy & Sell</h1>
      <Card pad>
        <Seg opts={['Buy','Sell','Swap']} value={side} onChange={setSide}/>
        <div className="col gap-4" style={{marginTop:18}}>
          <div>
            <label className="dim" style={{fontSize:12}}>You {side==='Buy'?'pay':'sell'}</label>
            <div className="row" style={{height:64, padding:'0 14px', border:'1px solid var(--c-line)', borderRadius:14, background:'var(--c-surface-2)'}}>
              <input className="input display num" style={{border:'none', background:'transparent', height:'100%', fontSize:28, fontWeight:600, padding:0}} placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)}/>
              {side==='Buy' ? <span className="num display dim" style={{fontSize:18}}>NGN</span> : <select className="btn btn-ghost"><option>{asset}</option></select>}
            </div>
          </div>
          <div className="row" style={{justifyContent:'center'}}><div style={{width:36, height:36, borderRadius:'50%', background:'var(--c-onyx-900)', color:'var(--c-cream)', display:'flex', alignItems:'center', justifyContent:'center'}}>{I.swap}</div></div>
          <div>
            <label className="dim" style={{fontSize:12}}>You receive</label>
            <div className="row" style={{height:64, padding:'0 14px', border:'1px solid var(--c-line)', borderRadius:14, background:'var(--c-surface-2)'}}>
              <div className="display num" style={{flex:1, fontSize:28, fontWeight:600}}>{side==='Buy' ? fmt.num(parseFloat(amount||0)/(a.price*1610),6) : fmt.ngn(ngn)}</div>
              {side==='Buy' ? (
                <select className="btn btn-ghost" value={asset} onChange={e=>setAsset(e.target.value)}>{ASSETS.map(x=><option key={x.sym}>{x.sym}</option>)}</select>
              ) : <span className="num display dim" style={{fontSize:18}}>NGN</span>}
            </div>
          </div>
          <div className="card card-pad" style={{background:'var(--c-surface-2)', padding:14}}>
            <div className="spread" style={{fontSize:12.5}}><span className="muted">Rate</span><span className="num">1 {asset} = {fmt.ngn(a.price*1610)}</span></div>
            <div className="spread" style={{fontSize:12.5, marginTop:6}}><span className="muted">Fee (1.5%)</span><span className="num">{fmt.ngn(ngn*0.015)}</span></div>
            <div className="spread" style={{fontSize:12.5, marginTop:6}}><span className="muted">Network</span><span>{a.chain}</span></div>
          </div>
          <button className="btn btn-primary" style={{justifyContent:'center', height:48, fontSize:15, marginTop:6}}>Continue → Review</button>
        </div>
      </Card>
    </div>
  );
};

/* ===== SEND ===== */
const Send = () => {
  const [step, setStep] = cS2(1);
  const [asset, setAsset] = cS2('USDT');
  const [network, setNetwork] = cS2('Tron');
  const [addr, setAddr] = cS2('');
  const [bankCode, setBankCode] = cS2('058');
  const [acctNo, setAcctNo] = cS2('');
  const [acctName, setAcctName] = cS2('');
  const [amount, setAmount] = cS2('');
  const a = ASSETS.find(x=>x.sym===asset);
  const isNgn = asset === 'NGN';
  const networks = a.networks || [a.chain];
  // keep network valid when switching asset
  React.useEffect(()=>{ if (!networks.includes(network)) setNetwork(networks[0]); }, [asset]);
  const placeholder = network==='Tron'?'TQrZ8xY9k2PpVm5Lq6Wc3FjN1Hm4Bg7Aa'
    : network==='BSC'?'0x742d35Cc6634C0532925a3b8D8c4f5e88aB12345'
    : network==='Ethereum'?'0xab47cd9e8c12fE3aB6F84d2E91d0f3aB84c12fE3'
    : network==='Solana'?'7xKXy2pPq8mLnVcRfTbKjW3sN1Hm4Bg7Aa9KdEsXrYz'
    : 'bc1qxy7j8k2vh9m6qz3ld4p5wn8r2bf9k';
  const fee = isNgn ? 50 : (network==='Tron'?1:network==='BSC'?0.30:network==='Solana'?0.01:5);
  const feeLbl = isNgn ? `₦${fee}` : `${fee} ${network==='Tron'?'TRX':network==='BSC'?'BNB':network==='Solana'?'SOL':'USDT'}`;
  const ngnValue = parseFloat(amount||0) * (a.price>1?a.price*1610.5:a.price>0.5?1610.5:a.price);
  const recipientValid = isNgn ? (acctNo.length>=10) : (addr.length>=20);
  const stepLabels = ['Asset','Recipient','Amount','Review'];

  return (
    <div className="col gap-6" style={{maxWidth:600, margin:'0 auto', width:'100%'}}>
      <h1>Send {isNgn?'naira':'crypto'}</h1>
      <div className="row gap-3">{stepLabels.map((s,i)=>(
        <div key={s} className="row gap-2" style={{flex:1}}>
          <div style={{width:24, height:24, borderRadius:'50%', background: step>i?'var(--c-lime-500)':step===i+1?'var(--c-onyx-900)':'var(--c-surface-3)', color: step>i?'var(--c-onyx-900)':step===i+1?'var(--c-cream)':'var(--c-text-3)', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600}}>{step>i?'✓':i+1}</div>
          <span style={{fontSize:12, fontWeight: step===i+1?600:400}}>{s}</span>
        </div>
      ))}</div>
      <Card pad>
        {step===1 && <div className="col gap-3">
          <label className="dim" style={{fontSize:12}}>Choose what to send</label>
          {ASSETS.slice(0,4).map(x=>(
            <div key={x.sym} className="spread" style={{padding:'14px 16px', border:`1px solid ${asset===x.sym?'var(--c-onyx-900)':'var(--c-line)'}`, borderRadius:12, cursor:'pointer', background: asset===x.sym?'var(--c-surface-2)':'var(--c-surface)'}} onClick={()=>setAsset(x.sym)}>
              <div className="row"><Coin sym={x.sym}/>
                <div>
                  <div className="row gap-2" style={{alignItems:'center'}}>
                    <span style={{fontWeight:600, fontSize:14}}>{x.name}</span>
                    {(x.sym==='USDT'||x.sym==='USDC'||x.sym==='NGN') && <span className="badge" style={{background:'var(--c-lime-500)', color:'var(--c-onyx-900)', fontSize:10, padding:'2px 8px'}}>Recommended</span>}
                  </div>
                  <div className="dim" style={{fontSize:11}}>{x.sym==='NGN'?'Bank transfer · Nigeria':`${x.networks?.join(' · ')||x.chain}`}</div>
                </div>
              </div>
              <div className="col" style={{textAlign:'right', gap:1}}>
                <div className="num" style={{fontWeight:600}}>{x.sym==='NGN'?fmt.ngn(x.bal):`${fmt.num(x.bal,4)} ${x.sym}`}</div>
                <div className="num dim" style={{fontSize:11}}>{x.sym==='NGN'?'Available':fmt.ngn(x.balNgn)}</div>
              </div>
            </div>
          ))}
        </div>}
        {step===2 && !isNgn && <div className="col gap-4">
          {networks.length>1 && <div>
            <label className="dim" style={{fontSize:12}}>Network</label>
            <div className="row gap-2" style={{flexWrap:'wrap', marginTop:6}}>
              {networks.map(n=>(
                <button key={n} className="btn btn-ghost" style={{background: network===n?'var(--c-onyx-900)':'transparent', color: network===n?'var(--c-cream)':'var(--c-text)'}} onClick={()=>setNetwork(n)}>{n}</button>
              ))}
            </div>
            <div className="dim" style={{fontSize:11, marginTop:8}}>Tron has the lowest fees for {asset}. Use the same network as the recipient's wallet.</div>
          </div>}
          {networks.length===1 && <div>
            <label className="dim" style={{fontSize:12}}>Network</label>
            <div className="input"><Coin sym={asset}/><span style={{marginLeft:8}}>{network}</span></div>
          </div>}
          <div>
            <label className="dim" style={{fontSize:12}}>Recipient address</label>
            <input className="input mono" style={{fontSize:13}} placeholder={placeholder} value={addr} onChange={e=>setAddr(e.target.value)}/>
          </div>
          <div className="row gap-2">
            <button className="btn btn-ghost" style={{flex:1, justifyContent:'center'}}>{I.qr} Scan QR</button>
            <button className="btn btn-ghost" style={{flex:1, justifyContent:'center'}}>Saved addresses</button>
          </div>
          <div className="card card-pad" style={{background:'var(--c-warn-soft)', border:'1px solid var(--c-warn)', padding:14, fontSize:12.5}}>
            <div className="row gap-2"><span style={{color:'var(--c-warn)'}}>{I.alert}</span><b>Triple-check the network.</b></div>
            <div className="muted" style={{marginTop:4}}>Sending {asset} on {network} to a wrong-network address means lost funds — Clusteer cannot recover them.</div>
          </div>
        </div>}
        {step===2 && isNgn && <div className="col gap-4">
          <div>
            <label className="dim" style={{fontSize:12}}>Bank</label>
            <select className="input" value={bankCode} onChange={e=>setBankCode(e.target.value)} style={{cursor:'pointer'}}>
              {NG_BANKS.map(b=><option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="dim" style={{fontSize:12}}>Account number</label>
            <input className="input num" maxLength="10" inputMode="numeric" placeholder="0123456789" value={acctNo} onChange={e=>{setAcctNo(e.target.value.replace(/\D/g,'').slice(0,10)); if (e.target.value.length===10) setAcctName('ADAEZE OLUWASEUN OKAFOR');}}/>
          </div>
          {acctName && <div className="card card-pad" style={{background:'var(--c-up-soft)', border:'1px solid var(--c-up)', padding:12, fontSize:13}}>
            <div className="dim" style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>Account name</div>
            <div style={{fontWeight:600, marginTop:2}}>{acctName}</div>
          </div>}
          <div>
            <label className="dim" style={{fontSize:12}}>Narration (optional)</label>
            <input className="input" placeholder="What's it for?"/>
          </div>
        </div>}
        {step===3 && <div className="col gap-4">
          <div className="display num" style={{fontSize:48, fontWeight:600, textAlign:'center'}}>
            {isNgn?`₦${(parseFloat(amount||0)).toLocaleString()}`:`${amount||'0'} `}
            {!isNgn && <span className="dim">{asset}</span>}
          </div>
          <div className="dim" style={{textAlign:'center', fontSize:13}}>{isNgn?`≈ ${(parseFloat(amount||0)/1610.5).toFixed(2)} USDT`:`≈ ${fmt.ngn(ngnValue)}`}</div>
          <input className="input num" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value.replace(/[^\d.]/g,''))} style={{textAlign:'center', height:48, fontSize:18}}/>
          <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:6}}>
            {['25%','50%','75%','MAX'].map(p=><button key={p} className="btn btn-ghost btn-sm" style={{justifyContent:'center'}} onClick={()=>setAmount((a.bal*({['25%']:0.25,'50%':0.5,'75%':0.75,'MAX':1}[p])).toFixed(isNgn?0:4))}>{p}</button>)}
          </div>
          <div className="spread dim" style={{fontSize:12}}><span>Available</span><span className="num">{isNgn?fmt.ngn(a.bal):`${fmt.num(a.bal,4)} ${asset}`}</span></div>
        </div>}
        {step===4 && <div className="col gap-3">
          {[
            ['Sending', isNgn?`₦${parseFloat(amount||0).toLocaleString()}`:`${amount} ${asset}`],
            ...(isNgn
              ? [['To bank', NG_BANKS.find(b=>b.code===bankCode)?.name],
                 ['Account', `${acctNo} · ${acctName}`]]
              : [['Network', network],
                 ['To address', addr ? `${addr.slice(0,12)}…${addr.slice(-6)}` : '—']]),
            ['Fee', feeLbl],
            ['Total', isNgn?`₦${(parseFloat(amount||0)+fee).toLocaleString()}`:`${(parseFloat(amount||0)+ (network==='Tron'||network==='BSC'||network==='Solana'?0:fee)).toFixed(4)} ${asset}`],
          ].map(([k,v])=>(
            <div key={k} className="spread" style={{fontSize:13.5, padding:'10px 0', borderBottom:'1px solid var(--c-line)'}}><span className="muted">{k}</span><span className="num" style={{fontWeight:600, textAlign:'right'}}>{v}</span></div>
          ))}
          <div className="dim" style={{fontSize:11.5, marginTop:4}}>By tapping Confirm, you authorise this transfer. {isNgn?'Bank transfers settle in under 60 seconds via NIP.':'Crypto transfers are irreversible once broadcast.'}</div>
        </div>}
        <div className="row gap-3" style={{marginTop:18}}>
          {step>1 && <button className="btn btn-ghost" style={{flex:1, justifyContent:'center'}} onClick={()=>setStep(step-1)}>Back</button>}
          <button
            className="btn btn-primary"
            disabled={(step===2 && !recipientValid) || (step===3 && !parseFloat(amount))}
            style={{flex:2, justifyContent:'center', opacity:((step===2 && !recipientValid)||(step===3 && !parseFloat(amount)))?0.5:1}}
            onClick={()=>step<4?setStep(step+1):alert('Sent!')}
          >{step===4?'Confirm send':'Continue →'}</button>
        </div>
      </Card>
    </div>
  );
};

/* ===== RECEIVE ===== */
const Receive = () => {
  const [asset, setAsset] = cS2('USDT');
  const a = ASSETS.find(x=>x.sym===asset);
  const addr = a.chain==='Tron'?'TQrZ8xY9k2PpVm5Lq6Wc3FjN1Hm4Bg7Aa':a.chain==='BSC'?'0x742d35Cc6634C0532925a3b8D8c4f5e88aB12345':'bc1qxy7j8k2vh9m6qz3ld4p5wn8r2bf9k';
  return (
    <div className="col gap-6" style={{maxWidth:560, margin:'0 auto', width:'100%'}}>
      <h1>Receive</h1>
      <Card pad>
        <div className="col gap-4">
          <div>
            <label className="dim" style={{fontSize:12}}>Asset & network</label>
            <div className="row gap-2" style={{flexWrap:'wrap'}}>{ASSETS.slice(0,6).map(x=>(
              <button key={x.sym} className="btn btn-ghost" style={{background: asset===x.sym?'var(--c-onyx-900)':'transparent', color: asset===x.sym?'var(--c-cream)':'var(--c-text)'}} onClick={()=>setAsset(x.sym)}><Coin sym={x.sym}/>{x.sym}</button>
            ))}</div>
          </div>
          <div style={{textAlign:'center', padding:'18px 0'}}>
            <div style={{width:220, height:220, margin:'0 auto', background:'var(--c-cream)', borderRadius:16, padding:14, boxShadow:'var(--sh-md)'}}>
              <QRPattern seed={addr} size={192}/>
            </div>
          </div>
          <div className="card card-pad" style={{background:'var(--c-surface-2)', padding:14}}>
            <div className="dim" style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>Your {asset} address ({a.chain})</div>
            <div className="row gap-2" style={{marginTop:6}}>
              <div className="mono trunc" style={{flex:1, fontSize:13}}>{addr}</div>
              <button className="btn btn-ghost btn-sm">{I.copy}Copy</button>
            </div>
          </div>
          <div className="card card-pad" style={{background:'var(--c-warn-soft)', border:'1px solid var(--c-warn)', padding:14, fontSize:12.5}}>
            <b>Send only {asset} on the {a.chain} network.</b><br/>Sending other assets may result in permanent loss.
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ===== WITHDRAW NGN ===== */
const Withdraw = () => {
  const [bank, setBank] = cS2('058');
  const [amt, setAmt] = cS2('');
  return (
    <div className="col gap-6" style={{maxWidth:560, margin:'0 auto', width:'100%'}}>
      <h1>Withdraw to Nigerian bank</h1>
      <div className="card card-pad" style={{background:'var(--c-onyx-900)', color:'var(--c-cream)', border:'none'}}>
        <div className="dim" style={{color:'rgba(244,241,234,0.6)', fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>Available NGN</div>
        <div className="display num" style={{fontSize:36, fontWeight:600}}>₦1,284,500.00</div>
      </div>
      <Card pad>
        <div className="col gap-4">
          <div>
            <label className="dim" style={{fontSize:12}}>Bank</label>
            <select className="input" value={bank} onChange={e=>setBank(e.target.value)}>{NG_BANKS.map(b=><option key={b.code} value={b.code}>{b.name}</option>)}</select>
          </div>
          <div>
            <label className="dim" style={{fontSize:12}}>Account number</label>
            <input className="input num" placeholder="0123456789" defaultValue="0234567890"/>
            <div className="row gap-2" style={{marginTop:6, fontSize:12}}><span className="up">{I.check}</span><span>ADAEZE OKONKWO</span></div>
          </div>
          <div>
            <label className="dim" style={{fontSize:12}}>Amount</label>
            <input className="input num display" style={{height:56, fontSize:24, fontWeight:600, textAlign:'center'}} placeholder="₦0.00" value={amt} onChange={e=>setAmt(e.target.value)}/>
            <div className="grid" style={{gridTemplateColumns:'repeat(4,1fr)', gap:6, marginTop:8}}>{['₦50K','₦100K','₦500K','MAX'].map(p=><button key={p} className="btn btn-ghost btn-sm" style={{justifyContent:'center'}} onClick={()=>setAmt({'₦50K':50000,'₦100K':100000,'₦500K':500000,'MAX':1284500}[p])}>{p}</button>)}</div>
          </div>
          <div className="card card-pad" style={{background:'var(--c-surface-2)', padding:14}}>
            <div className="spread" style={{fontSize:12.5}}><span className="muted">Fee</span><span className="num">₦100.00</span></div>
            <div className="spread" style={{fontSize:12.5, marginTop:6}}><span className="muted">Arrives</span><span>Instantly via NIBSS</span></div>
            <div className="spread" style={{fontSize:13.5, marginTop:8, borderTop:'1px solid var(--c-line)', paddingTop:8}}><span style={{fontWeight:600}}>You receive</span><span className="num display" style={{fontWeight:600}}>{fmt.ngn(parseFloat(amt||0)-100)}</span></div>
          </div>
          <button className="btn btn-primary" style={{justifyContent:'center', height:48, fontSize:15}}>Withdraw {amt?fmt.ngn(amt):''}</button>
        </div>
      </Card>
    </div>
  );
};

Object.assign(window, { Wallet, AssetDetail, Trade, Send, Receive, Withdraw });
