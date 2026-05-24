// Toast system, ⌘K command palette, and action modals
const { useState: oS, useEffect: oE, useRef: oR, useCallback: oC, useMemo: oM } = React;

/* ===== TOASTS — global imperative API: window.toast(msg, kind) ===== */
const ToastHost = () => {
  const [toasts, setToasts] = oS([]);
  oE(()=>{
    window.toast = (msg, kind='info') => {
      const id = Math.random().toString(36).slice(2);
      setToasts(t => [...t, { id, msg, kind }]);
      setTimeout(()=> setToasts(t => t.filter(x=>x.id!==id)), 3200);
    };
  }, []);
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <span>{t.kind==='success'?'✓':t.kind==='warn'?'!':'i'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

/* ===== COMMAND PALETTE — ⌘K / Ctrl-K ===== */
const CommandPalette = ({ go, items=[], adminMode=false }) => {
  const [open, setOpen] = oS(false);
  const [q, setQ] = oS('');
  const [idx, setIdx] = oS(0);
  const inputRef = oR(null);

  oE(()=>{
    const onKey = e => {
      if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); setOpen(o=>!o); setQ(''); setIdx(0); }
      if(e.key==='Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [open]);

  oE(()=>{ if(open) setTimeout(()=>inputRef.current?.focus(), 30); }, [open]);

  const allItems = oM(()=>{
    const navs = items.map(i => ({ ...i, kind:'Page', action: () => { go(i.id); window.toast?.(`Opened ${i.label}`); } }));
    const userMatches = USERS.slice(0, 30).map(u => ({ id:`user-${u.id}`, label:u.name, sub:u.email, kind:'User', icon: I.user || I.send, action: () => { window.toast?.(`Open user ${u.name}`); } }));
    const txnMatches = TXNS.slice(0, 20).map(t => ({ id:`txn-${t.id}`, label:`${t.type} ${t.amount.toFixed(2)} ${t.asset}`, sub:`${t.id} · ${t.date}`, kind:'Transaction', icon: I.history || I.send, action: () => { window.toast?.(`Open txn ${t.id}`); } }));
    const actions = adminMode ? [
      { id:'act-broadcast', label:'Send broadcast notification', kind:'Action', icon:I.bell, action:()=>window.toast?.('Broadcast composer opened') },
      { id:'act-sweep', label:'Sweep hot → cold wallet', kind:'Action', icon:I.wallet, action:()=>window.toast?.('Sweep modal opened') },
      { id:'act-freeze', label:'Freeze user account', kind:'Action', icon:I.shield, action:()=>window.toast?.('Pick user to freeze') },
    ] : [
      { id:'act-buy', label:'Buy USDT', kind:'Action', icon:I.up, action:()=>{go('trade'); window.toast?.('Buy flow opened');} },
      { id:'act-send', label:'Send crypto', kind:'Action', icon:I.send, action:()=>{go('send'); window.toast?.('Send flow opened');} },
      { id:'act-withdraw', label:'Withdraw to bank', kind:'Action', icon:I.bank, action:()=>{go('withdraw'); window.toast?.('Withdraw opened');} },
    ];
    return [...actions, ...navs, ...userMatches, ...txnMatches];
  }, [items, adminMode, go]);

  const filtered = oM(()=>{
    if(!q.trim()) return allItems.slice(0, 10);
    const ql = q.toLowerCase();
    return allItems.filter(i => i.label.toLowerCase().includes(ql) || (i.sub||'').toLowerCase().includes(ql) || i.kind.toLowerCase().includes(ql)).slice(0, 30);
  }, [q, allItems]);

  oE(()=>{ setIdx(0); }, [q]);

  const onKeyDown = e => {
    if(e.key==='ArrowDown'){ e.preventDefault(); setIdx(i => Math.min(i+1, filtered.length-1)); }
    if(e.key==='ArrowUp'){ e.preventDefault(); setIdx(i => Math.max(i-1, 0)); }
    if(e.key==='Enter'){ e.preventDefault(); const item = filtered[idx]; if(item){ item.action?.(); setOpen(false); }}
  };

  if(!open) return null;
  const grouped = filtered.reduce((acc, item) => { (acc[item.kind] = acc[item.kind] || []).push(item); return acc; }, {});
  let runIdx = -1;
  return (
    <div className="cmdk-back" onClick={()=>setOpen(false)}>
      <div className="cmdk" onClick={e=>e.stopPropagation()}>
        <input ref={inputRef} className="cmdk-input" placeholder="Search pages, users, transactions, or run an action..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={onKeyDown}/>
        <div className="cmdk-list">
          {filtered.length===0 && <div style={{padding:'40px 20px', textAlign:'center'}} className="dim">No results for "{q}"</div>}
          {Object.entries(grouped).map(([group, list]) => (
            <div key={group}>
              <div className="cmdk-group">{group}</div>
              {list.map(item => {
                runIdx++;
                const active = runIdx===idx;
                return (
                  <div key={item.id} className={`cmdk-item ${active?'active':''}`} onClick={()=>{item.action?.(); setOpen(false);}} onMouseEnter={()=>setIdx(runIdx)}>
                    <div style={{width:24, height:24, borderRadius:6, background:'var(--c-surface-2)', display:'flex', alignItems:'center', justifyContent:'center'}}>{item.icon || I.search || '·'}</div>
                    <div style={{flex:1, minWidth:0}}>
                      <div style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.label}</div>
                      {item.sub && <div className="muted" style={{fontSize:11, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{item.sub}</div>}
                    </div>
                    {active && <kbd>↵</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk-foot">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
          <span style={{marginLeft:'auto'}}>Clusteer · Quick actions</span>
        </div>
      </div>
    </div>
  );
};

/* ===== MODAL primitive ===== */
const Modal = ({ open, onClose, title, children, footer, width=440 }) => {
  oE(()=>{ if(!open) return; const k = e => e.key==='Escape' && onClose(); window.addEventListener('keydown', k); return ()=> window.removeEventListener('keydown', k); }, [open, onClose]);
  if(!open) return null;
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:width, animation:'modalIn .22s cubic-bezier(.2,.7,.2,1)'}}>
        {title && <div className="card-hd"><div style={{fontWeight:600, fontSize:15}}>{title}</div><button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button></div>}
        <div className="card-pad col gap-4">{children}</div>
        {footer && <div className="card-pad" style={{borderTop:'1px solid var(--c-line)', display:'flex', gap:8, justifyContent:'flex-end'}}>{footer}</div>}
      </div>
    </div>
  );
};

/* ===== SEND CONFIRM — with PIN/2FA placeholder ===== */
const SendConfirmModal = ({ open, onClose, payload, onConfirm }) => {
  const [pin, setPin] = oS('');
  const [step, setStep] = oS('review'); // review → pin → processing → done
  oE(()=>{ if(open){ setStep('review'); setPin(''); }}, [open]);
  if(!payload) return null;

  const submit = () => {
    if(pin.length !== 6) return;
    setStep('processing');
    setTimeout(()=>{ setStep('done'); window.toast?.('Transaction sent','success'); onConfirm?.(); }, 1200);
  };

  return (
    <Modal open={open} onClose={onClose} title={step==='done'?'Sent':step==='review'?'Confirm transaction':'Enter PIN'} width={420}>
      {step==='review' && <>
        <div style={{textAlign:'center', padding:'12px 0'}}>
          <div className="dim" style={{fontSize:12, textTransform:'uppercase'}}>You're sending</div>
          <div className="display num" style={{fontSize:34, fontWeight:600, marginTop:6}}>{payload.amount} {payload.asset}</div>
          <div className="muted num" style={{marginTop:4}}>≈ {fmt.ngn(payload.ngn || 0)}</div>
        </div>
        <div className="card" style={{padding:'4px 14px'}}>
          <KV k="To" v={payload.to} mono />
          <KV k="Network" v={payload.network || 'Tron (TRC20)'} />
          <KV k="Fee" v={payload.fee || '1.00 TRX'} mono />
          <KV k="Total" v={`${payload.amount} ${payload.asset}`} mono />
        </div>
        <div className="row gap-2" style={{padding:'10px 12px', background:'var(--c-warn-soft)', borderRadius:8, fontSize:12, color:'var(--c-warn)'}}>{I.alert}<span>Crypto transactions are irreversible. Double-check the address.</span></div>
        <div className="row gap-2" style={{justifyContent:'flex-end', marginTop:4}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>setStep('pin')}>Continue</button>
        </div>
      </>}

      {step==='pin' && <>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:14, marginBottom:14}}>Enter your 6-digit PIN to authorize</div>
          <div className="row gap-2" style={{justifyContent:'center'}}>{[0,1,2,3,4,5].map(i=>(
            <div key={i} style={{width:40, height:48, borderRadius:8, border:`1px solid ${pin.length>i?'var(--c-accent)':'var(--c-line)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:600, background: pin.length>i?'color-mix(in oklab, var(--c-accent) 8%, transparent)':'var(--c-bg)'}}>{pin[i]?'•':''}</div>
          ))}</div>
          <input autoFocus type="password" inputMode="numeric" maxLength={6} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))} style={{position:'absolute', opacity:0, pointerEvents:'none'}}/>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginTop:18, maxWidth:240, margin:'18px auto 0'}}>
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k,i)=>(
              <button key={i} onClick={()=>{ if(k==='⌫') setPin(p=>p.slice(0,-1)); else if(k && pin.length<6) setPin(p=>p+k); }} disabled={!k} style={{padding:'14px 0', borderRadius:8, border:'1px solid var(--c-line)', background: k?'var(--c-surface)':'transparent', color:'var(--c-text)', fontSize:18, fontWeight:500, cursor:k?'pointer':'default'}}>{k}</button>
            ))}
          </div>
          <button className="btn btn-primary" style={{marginTop:18, width:'100%'}} disabled={pin.length!==6} onClick={submit}>Authorize</button>
          <div className="muted" style={{fontSize:12, marginTop:10}}>Or use <button className="btn btn-ghost btn-sm" style={{padding:'2px 6px'}}>Face ID</button></div>
        </div>
      </>}

      {step==='processing' && <div style={{textAlign:'center', padding:'30px 0'}}>
        <div style={{width:56, height:56, borderRadius:'50%', border:'3px solid var(--c-line)', borderTopColor:'var(--c-accent)', margin:'0 auto', animation:'spin 0.8s linear infinite'}}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{marginTop:16, fontSize:14}}>Broadcasting transaction...</div>
        <div className="muted" style={{fontSize:12, marginTop:4}}>This usually takes 5-15 seconds</div>
      </div>}

      {step==='done' && <div style={{textAlign:'center', padding:'20px 0'}}>
        <div style={{width:64, height:64, borderRadius:'50%', background:'var(--c-up)', color:'#fff', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30}}>✓</div>
        <div style={{fontSize:18, fontWeight:600, marginTop:14}}>Sent successfully</div>
        <div className="muted" style={{fontSize:13, marginTop:4}}>{payload.amount} {payload.asset} is on its way</div>
        <button className="btn btn-primary" style={{marginTop:18, width:'100%'}} onClick={onClose}>Done</button>
      </div>}
    </Modal>
  );
};

/* ===== KYC APPROVE / REJECT ===== */
const KycApproveModal = ({ open, onClose, kase, onConfirm }) => {
  const [tier, setTier] = oS('Tier 2');
  const [note, setNote] = oS('');
  if(!kase) return null;
  return (
    <Modal open={open} onClose={onClose} title="Approve KYC" width={460}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={()=>{onConfirm?.({tier, note}); window.toast?.(`KYC approved · upgraded to ${tier}`,'success'); onClose();}}>Approve</button></>}>
      <div className="row gap-3" style={{alignItems:'center'}}><div className="avatar" style={{width:40,height:40}}>{kase.name.split(' ').map(n=>n[0]).join('')}</div><div><div style={{fontWeight:600}}>{kase.name}</div><div className="dim" style={{fontSize:12}}>{kase.email}</div></div></div>
      <div>
        <div className="dim" style={{fontSize:12, marginBottom:6}}>Approve to tier</div>
        <Seg opts={['Tier 1','Tier 2','Tier 3']} value={tier} onChange={setTier}/>
      </div>
      <div>
        <div className="dim" style={{fontSize:12, marginBottom:6}}>Internal note (optional)</div>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Visible to compliance only" style={{width:'100%', minHeight:60, padding:10, borderRadius:8, border:'1px solid var(--c-line)', background:'var(--c-bg)', color:'var(--c-text)', fontFamily:'inherit', fontSize:13, resize:'vertical'}}/>
      </div>
    </Modal>
  );
};

const KycRejectModal = ({ open, onClose, kase, onConfirm }) => {
  const [reason, setReason] = oS('Document mismatch');
  const [note, setNote] = oS('');
  if(!kase) return null;
  const reasons = ['Document mismatch','Expired ID','Image quality','Selfie liveness failed','BVN/NIN mismatch','Suspected fraud','Other'];
  return (
    <Modal open={open} onClose={onClose} title="Reject KYC" width={460}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" style={{background:'var(--c-down)'}} onClick={()=>{onConfirm?.({reason, note}); window.toast?.(`KYC rejected: ${reason}`,'warn'); onClose();}}>Reject</button></>}>
      <div className="row gap-3" style={{alignItems:'center'}}><div className="avatar" style={{width:40,height:40}}>{kase.name.split(' ').map(n=>n[0]).join('')}</div><div><div style={{fontWeight:600}}>{kase.name}</div><div className="dim" style={{fontSize:12}}>{kase.email}</div></div></div>
      <div>
        <div className="dim" style={{fontSize:12, marginBottom:6}}>Reason</div>
        <div className="col" style={{gap:6}}>{reasons.map(r=>(
          <label key={r} className="row gap-2" style={{padding:'8px 10px', borderRadius:8, border:`1px solid ${reason===r?'var(--c-accent)':'var(--c-line)'}`, background: reason===r?'color-mix(in oklab, var(--c-accent) 6%, transparent)':'transparent', cursor:'pointer', fontSize:13}}>
            <input type="radio" checked={reason===r} onChange={()=>setReason(r)} style={{margin:0}}/>
            <span>{r}</span>
          </label>
        ))}</div>
      </div>
      <div>
        <div className="dim" style={{fontSize:12, marginBottom:6}}>Message to user</div>
        <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Explain what they need to fix" style={{width:'100%', minHeight:70, padding:10, borderRadius:8, border:'1px solid var(--c-line)', background:'var(--c-bg)', color:'var(--c-text)', fontFamily:'inherit', fontSize:13, resize:'vertical'}}/>
      </div>
    </Modal>
  );
};

/* ===== FREEZE / SUSPEND USER ===== */
const FreezeUserModal = ({ open, onClose, user, onConfirm }) => {
  const [reason, setReason] = oS('Suspicious activity');
  const [duration, setDuration] = oS('24h');
  if(!user) return null;
  const reasons = ['Suspicious activity','Compliance review','User request','Failed verification','Charge-back','Other'];
  return (
    <Modal open={open} onClose={onClose} title="Freeze account" width={460}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" style={{background:'var(--c-down)'}} onClick={()=>{onConfirm?.({reason, duration}); window.toast?.(`${user.name} frozen · ${duration}`,'warn'); onClose();}}>Freeze account</button></>}>
      <div className="row gap-2" style={{padding:'10px 12px', background:'color-mix(in oklab, var(--c-down) 8%, transparent)', borderRadius:8, fontSize:13, color:'var(--c-down)'}}>{I.alert}<span>User will be logged out and unable to transact until unfrozen.</span></div>
      <div className="row gap-3" style={{alignItems:'center'}}><div className="avatar" style={{width:40,height:40}}>{user.name.split(' ').map(n=>n[0]).join('')}</div><div><div style={{fontWeight:600}}>{user.name}</div><div className="dim" style={{fontSize:12}}>{user.email} · {user.tier}</div></div></div>
      <div>
        <div className="dim" style={{fontSize:12, marginBottom:6}}>Duration</div>
        <Seg opts={['24h','7d','30d','Indefinite']} value={duration} onChange={setDuration}/>
      </div>
      <div>
        <div className="dim" style={{fontSize:12, marginBottom:6}}>Reason</div>
        <select value={reason} onChange={e=>setReason(e.target.value)} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid var(--c-line)', background:'var(--c-bg)', color:'var(--c-text)', fontSize:13}}>
          {reasons.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
    </Modal>
  );
};

/* ===== CONFIRM (generic) ===== */
const ConfirmModal = ({ open, onClose, title, message, confirmLabel='Confirm', danger=false, onConfirm }) => (
  <Modal open={open} onClose={onClose} title={title} width={400}
    footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" style={danger?{background:'var(--c-down)'}:{}} onClick={()=>{onConfirm?.(); onClose();}}>{confirmLabel}</button></>}>
    <div style={{fontSize:14, lineHeight:1.5}}>{message}</div>
  </Modal>
);

Object.assign(window, { ToastHost, CommandPalette, Modal, SendConfirmModal, KycApproveModal, KycRejectModal, FreezeUserModal, ConfirmModal });
