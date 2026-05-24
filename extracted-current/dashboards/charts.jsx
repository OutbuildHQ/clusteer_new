// Charts — pure SVG, no deps. Line, Area, Candle, Depth, Donut, Bars, Sparkline.
const { useMemo: uM } = React;

function gen(seed=1, n=60, base=100, vol=4){
  let s = seed; const out = [];
  for (let i=0;i<n;i++){ s = (s * 9301 + 49297) % 233280; const r = s/233280; out.push(base + (r-0.5)*vol*Math.sqrt(i+1)); }
  return out;
}

const Sparkline = ({ data, color="var(--c-up)", w=80, h=24 }) => {
  const d = data || gen(7, 30, 100, 6);
  const min = Math.min(...d), max = Math.max(...d);
  const path = d.map((v,i)=>{
    const x = (i/(d.length-1))*w;
    const y = h - ((v-min)/(max-min||1))*h;
    return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return <svg width={w} height={h} style={{display:'block'}}><path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>;
};

const AreaChart = ({ data, color="var(--c-lime-500)", h=240, showAxis=true }) => {
  const d = data || gen(3, 60, 1000, 80);
  const min = Math.min(...d), max = Math.max(...d);
  const w = 800;
  const pad = showAxis ? { l:48, r:8, t:8, b:24 } : { l:0, r:0, t:0, b:0 };
  const W = w - pad.l - pad.r, H = h - pad.t - pad.b;
  const pts = d.map((v,i)=>{
    const x = pad.l + (i/(d.length-1))*W;
    const y = pad.t + H - ((v-min)/(max-min||1))*H;
    return [x,y];
  });
  const line = pts.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length-1][0]},${pad.t+H} L${pad.l},${pad.t+H} Z`;
  const id = `g${Math.random().toString(36).slice(2,7)}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{display:'block'}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {showAxis && [0,0.25,0.5,0.75,1].map((p,i)=>(
        <line key={i} x1={pad.l} x2={w-pad.r} y1={pad.t+H*p} y2={pad.t+H*p} stroke="var(--c-line)" strokeDasharray="2 4"/>
      ))}
      {showAxis && [0,0.25,0.5,0.75,1].map((p,i)=>{
        const v = max - (max-min)*p;
        return <text key={i} x={pad.l-8} y={pad.t+H*p+4} fontSize="10" fill="var(--c-text-3)" textAnchor="end" fontFamily="var(--f-mono)">{v.toFixed(0)}</text>;
      })}
      <path d={area} fill={`url(#${id})`}/>
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

const LineChart = ({ series, h=240 }) => {
  const w = 800, pad = { l:48, r:8, t:8, b:24 };
  const W = w - pad.l - pad.r, H = h - pad.t - pad.b;
  const all = series.flatMap(s=>s.data);
  const min = Math.min(...all), max = Math.max(...all);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {[0,0.25,0.5,0.75,1].map((p,i)=>(
        <line key={i} x1={pad.l} x2={w-pad.r} y1={pad.t+H*p} y2={pad.t+H*p} stroke="var(--c-line)" strokeDasharray="2 4"/>
      ))}
      {series.map((s,si)=>{
        const path = s.data.map((v,i)=>{
          const x = pad.l + (i/(s.data.length-1))*W;
          const y = pad.t + H - ((v-min)/(max-min||1))*H;
          return `${i===0?'M':'L'}${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        return <path key={si} d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"/>;
      })}
    </svg>
  );
};

const CandleChart = ({ candles, h=300 }) => {
  const c = candles || Array.from({length:50}).map((_,i)=>{
    const o = 1530 + Math.sin(i/3)*40 + (Math.random()-0.5)*30;
    const close = o + (Math.random()-0.5)*60;
    const hi = Math.max(o,close)+Math.random()*20;
    const lo = Math.min(o,close)-Math.random()*20;
    return { o, c: close, h: hi, l: lo };
  });
  const w = 800, pad = { l:48, r:8, t:8, b:24 };
  const W = w-pad.l-pad.r, H = h-pad.t-pad.b;
  const min = Math.min(...c.map(x=>x.l)), max = Math.max(...c.map(x=>x.h));
  const cw = W/c.length;
  const y = v => pad.t + H - ((v-min)/(max-min||1))*H;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {[0,0.25,0.5,0.75,1].map((p,i)=>(
        <line key={i} x1={pad.l} x2={w-pad.r} y1={pad.t+H*p} y2={pad.t+H*p} stroke="var(--c-line)" strokeDasharray="2 4"/>
      ))}
      {[0,0.25,0.5,0.75,1].map((p,i)=>{
        const v = max - (max-min)*p;
        return <text key={i} x={pad.l-8} y={pad.t+H*p+4} fontSize="10" fill="var(--c-text-3)" textAnchor="end" fontFamily="var(--f-mono)">{v.toFixed(0)}</text>;
      })}
      {c.map((k,i)=>{
        const x = pad.l + i*cw + cw/2;
        const up = k.c >= k.o;
        const col = up ? "var(--c-up)" : "var(--c-down)";
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} stroke={col} strokeWidth="1"/>
            <rect x={x-cw*0.35} y={y(Math.max(k.o,k.c))} width={cw*0.7} height={Math.max(1, Math.abs(y(k.o)-y(k.c)))} fill={col}/>
          </g>
        );
      })}
    </svg>
  );
};

const DepthChart = ({ h=200 }) => {
  // Mirror buys/sells around mid
  const N = 30;
  const buys = Array.from({length:N}).map((_,i)=>({ p: 1620 - i*0.8, q: (N-i)*0.6 + Math.random()*5 }));
  const sells = Array.from({length:N}).map((_,i)=>({ p: 1622 + i*0.8, q: (N-i)*0.6 + Math.random()*5 }));
  let cum = 0; const buyCum = buys.map(b=>{ cum += b.q; return { p:b.p, q: cum }; }).reverse();
  cum = 0; const sellCum = sells.map(s=>{ cum += s.q; return { p:s.p, q: cum }; });
  const all = [...buyCum, ...sellCum];
  const w = 800, pad = { l:8, r:8, t:8, b:24 };
  const W = w-pad.l-pad.r, H = h-pad.t-pad.b;
  const minP = Math.min(...all.map(p=>p.p)), maxP = Math.max(...all.map(p=>p.p));
  const maxQ = Math.max(...all.map(p=>p.q));
  const X = p => pad.l + ((p-minP)/(maxP-minP))*W;
  const Y = q => pad.t + H - (q/maxQ)*H;
  const buyPath = buyCum.map((b,i)=>`${i===0?'M':'L'}${X(b.p)},${Y(b.q)}`).join(' ') + ` L${X(buyCum[buyCum.length-1].p)},${pad.t+H} L${X(buyCum[0].p)},${pad.t+H} Z`;
  const sellPath = sellCum.map((s,i)=>`${i===0?'M':'L'}${X(s.p)},${Y(s.q)}`).join(' ') + ` L${X(sellCum[sellCum.length-1].p)},${pad.t+H} L${X(sellCum[0].p)},${pad.t+H} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <path d={buyPath} fill="var(--c-up-soft)" stroke="var(--c-up)" strokeWidth="1.5"/>
      <path d={sellPath} fill="var(--c-down-soft)" stroke="var(--c-down)" strokeWidth="1.5"/>
    </svg>
  );
};

const Donut = ({ slices, size=180, thickness=20, label }) => {
  const total = slices.reduce((a,s)=>a+s.value, 0);
  const r = size/2 - thickness/2;
  const C = 2*Math.PI*r;
  let acc = 0;
  return (
    <div style={{position:'relative', width:size, height:size}}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--c-surface-3)" strokeWidth={thickness}/>
        {slices.map((s,i)=>{
          const len = (s.value/total)*C;
          const off = (acc/total)*C;
          acc += s.value;
          return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${len} ${C-len}`} strokeDashoffset={-off} transform={`rotate(-90 ${size/2} ${size/2})`}/>;
        })}
      </svg>
      {label && <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div className="dim" style={{fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em'}}>{label.title}</div>
        <div className="num display" style={{fontSize:24, fontWeight:600}}>{label.value}</div>
      </div>}
    </div>
  );
};

const Bars = ({ data, h=160, color="var(--c-lime-500)", labels }) => {
  const w = 800, pad = { l:32, r:8, t:8, b: labels?28:8 };
  const W = w-pad.l-pad.r, H = h-pad.t-pad.b;
  const max = Math.max(...data);
  const bw = W/data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {data.map((v,i)=>{
        const bh = (v/max)*H;
        return <rect key={i} x={pad.l + i*bw + bw*0.15} y={pad.t+H-bh} width={bw*0.7} height={bh} fill={color} rx="2"/>;
      })}
      {labels && labels.map((l,i)=>(
        <text key={i} x={pad.l + i*bw + bw/2} y={h-8} fontSize="10" fill="var(--c-text-3)" textAnchor="middle">{l}</text>
      ))}
    </svg>
  );
};

const StackedBars = ({ groups, h=160, colors=["var(--c-up)","var(--c-down)"], labels }) => {
  const w = 800, pad = { l:32, r:8, t:8, b: labels?28:8 };
  const W = w-pad.l-pad.r, H = h-pad.t-pad.b;
  const totals = groups.map(g=>g.reduce((a,b)=>a+b,0));
  const max = Math.max(...totals);
  const bw = W/groups.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {groups.map((g,i)=>{
        let yAcc = pad.t+H;
        return g.map((v,j)=>{
          const bh = (v/max)*H;
          yAcc -= bh;
          return <rect key={`${i}-${j}`} x={pad.l + i*bw + bw*0.15} y={yAcc} width={bw*0.7} height={bh} fill={colors[j%colors.length]}/>;
        });
      })}
      {labels && labels.map((l,i)=>(
        <text key={i} x={pad.l + i*bw + bw/2} y={h-8} fontSize="10" fill="var(--c-text-3)" textAnchor="middle">{l}</text>
      ))}
    </svg>
  );
};

Object.assign(window, { Sparkline, AreaChart, LineChart, CandleChart, DepthChart, Donut, Bars, StackedBars, gen });
