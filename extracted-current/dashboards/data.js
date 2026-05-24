// Mock data: NG-realistic users, assets, txns, orders, KYC, wallets, audit, banks
const NG_BANKS = [
  { code:"044", name:"Access Bank" }, { code:"058", name:"GTBank" },
  { code:"011", name:"First Bank" }, { code:"033", name:"UBA" },
  { code:"057", name:"Zenith Bank" }, { code:"232", name:"Sterling Bank" },
  { code:"070", name:"Fidelity Bank" }, { code:"221", name:"Stanbic IBTC" },
  { code:"50211", name:"Kuda" }, { code:"100004", name:"Opay" },
  { code:"50515", name:"Moniepoint" }, { code:"999992", name:"Palmpay" },
];

const ASSETS = [
  { sym:"USDT", name:"Tether USD",  chain:"Tron",  networks:["Tron","BSC","Ethereum"], price:1.00, change:0.01, bal:1820.50, balNgn:2933025, color:"var(--c-usdt)" },
  { sym:"USDC", name:"USD Coin",    chain:"BSC",   networks:["BSC","Ethereum","Solana"], price:1.00, change:0.00, bal:980.00,  balNgn:1578290, color:"var(--c-usdc)" },
  { sym:"NGN",  name:"Naira",       chain:"Bank",  networks:["Bank transfer"], price:0.000621, change:0, bal:1284500, balNgn:1284500, color:"var(--c-lime-500)" },
  { sym:"BTC",  name:"Bitcoin",     chain:"BTC",   networks:["BTC"], price:71240, change:1.84, bal:0.0428, balNgn:4880000, color:"var(--c-btc)" },
  { sym:"ETH",  name:"Ethereum",    chain:"ERC20", networks:["Ethereum"], price:3568,  change:-0.84,bal:1.284, balNgn:7331000, color:"var(--c-eth)" },
  { sym:"BNB",  name:"BNB",         chain:"BSC",   networks:["BSC"], price:612,   change:2.10, bal:0.85,  balNgn:832200, color:"var(--c-bsc)" },
  { sym:"SOL",  name:"Solana",      chain:"SOL",   networks:["Solana"], price:182,   change:4.21, bal:12.4,  balNgn:3614400, color:"var(--c-sol)" },
  { sym:"TRX",  name:"Tron",        chain:"Tron",  networks:["Tron"], price:0.142, change:-1.10,bal:2400,  balNgn:545280,  color:"var(--c-tron)" },
];

const NAMES_NG = [
  "Adaeze Okonkwo","Tunde Bakare","Chinedu Eze","Aisha Mohammed","Folake Adeyemi",
  "Emeka Nwosu","Bisi Ajayi","Yusuf Ibrahim","Ngozi Obi","Damilola Owolabi",
  "Kemi Lawal","Ifeanyi Uche","Habiba Musa","Tobi Akinwumi","Chiamaka Eze",
  "Olumide Salami","Zainab Bello","Bola Tinubu","Hauwa Aliyu","Segun Onile",
];

const ADDRESSES_LAGOS = [
  "12 Adeola Hopewell, Victoria Island","48 Awolowo Rd, Ikoyi","32 Adeniran Ogunsanya, Surulere",
  "7 Bode Thomas, Surulere","19 Allen Avenue, Ikeja","56 Opebi Rd, Ikeja",
  "23 Admiralty Way, Lekki","9 Akin Adesola, V/I","134 Herbert Macaulay, Yaba",
];

function rand(seed){ let s = seed; return () => { s = (s*9301+49297)%233280; return s/233280; }; }

const USERS = NAMES_NG.map((n,i)=>{
  const r = rand(i+1);
  const tier = ["Tier 1","Tier 2","Tier 3"][Math.floor(r()*3)];
  const status = ["Active","Active","Active","Suspended","Pending"][Math.floor(r()*5)];
  return {
    id: `USR-${10042+i}`,
    name: n,
    email: n.toLowerCase().replace(/\s/g,'.')+"@"+(["gmail","yahoo","outlook"][i%3])+".com",
    phone: `+234 ${800+i} ${100+i*7} ${1000+i*13}`,
    tier, status,
    kyc: tier === "Tier 3" ? "Verified" : (i%4===0 ? "Pending" : (i%5===0 ? "Rejected" : "Verified")),
    bvn: `2210${String(100000+i*1117).slice(-7)}`,
    nin: `121${String(20000000+i*1991).slice(-8)}`,
    joined: `Mar ${(i%28)+1}, 2026`,
    bal: Math.floor(50000 + r()*8000000),
    address: ADDRESSES_LAGOS[i%ADDRESSES_LAGOS.length],
    bank: NG_BANKS[i%NG_BANKS.length],
    acctNo: `${1000000000 + Math.floor(r()*8999999999)}`,
    risk: Math.floor(r()*100),
    txns30d: Math.floor(r()*120)+5,
    flags: i%6===0 ? ["High velocity"] : (i%9===0 ? ["Sanctions match (cleared)"] : []),
  };
});

const KYC_QUEUE = USERS.filter(u=>u.kyc==="Pending").map((u,i)=>({
  ...u, submitted: `${Math.floor(Math.random()*23)}h ago`,
  docs: { selfie:true, idFront:true, idBack:true, addressProof:i%3!==0 },
  liveness: 96 - i*3, faceMatch: 98 - i*2,
}));

const TXNS = Array.from({length:60}).map((_,i)=>{
  const r = rand(i+100);
  const types = ["Buy","Sell","Send","Receive","Swap","Withdraw","Deposit"];
  const t = types[Math.floor(r()*types.length)];
  const a = ASSETS[Math.floor(r()*ASSETS.length)];
  const status = ["Completed","Completed","Completed","Pending","Failed"][Math.floor(r()*5)];
  const amount = +(0.01 + r()*500).toFixed(4);
  return {
    id: `TX-${838201 - i*7}`,
    type: t, asset: a.sym, chain: a.chain,
    amount, ngn: Math.floor(amount * a.price * 1610),
    status,
    user: USERS[i%USERS.length],
    counterparty: t==="Send" ? "TQrZ...x9k2" : (t==="Receive" ? "TF8m...3pQa" : "—"),
    fee: +((amount * a.price * 0.001) + 0.5).toFixed(2),
    when: `${Math.floor(r()*23)}:${String(Math.floor(r()*59)).padStart(2,'0')}`,
    date: ["Today","Today","Yesterday","Mar 14","Mar 13","Mar 12","Mar 10"][Math.floor(r()*7)],
    hash: t==="Send"||t==="Receive"||t==="Swap" ? `0x${Math.floor(r()*1e16).toString(16).padStart(16,'0')}...${Math.floor(r()*1e8).toString(16).padStart(8,'0')}` : null,
  };
});

const ORDERS = Array.from({length:30}).map((_,i)=>{
  const r = rand(i+200);
  const side = r() > 0.5 ? "Buy" : "Sell";
  const a = ASSETS[Math.floor(r()*ASSETS.length)];
  return {
    id: `ORD-${44820 - i*3}`,
    pair: `${a.sym}/NGN`,
    side, type: ["Limit","Market","Stop"][Math.floor(r()*3)],
    price: a.price * (0.95 + r()*0.1),
    amount: +(1 + r()*200).toFixed(2),
    filled: Math.floor(r()*100),
    status: ["Open","Filled","Cancelled","Partial"][Math.floor(r()*4)],
    time: `${Math.floor(r()*23)}:${String(Math.floor(r()*59)).padStart(2,'0')}`,
    user: USERS[i%USERS.length],
  };
});

const NOTIFS = [
  { id:1, type:"tx", title:"Withdrawal completed", body:"₦450,000 to GTBank ••• 2847", when:"2 min ago", read:false, icon:"↓" },
  { id:2, type:"price", title:"BTC up 5.2%", body:"Your watchlist: BTC crossed ₦115M", when:"1 hr ago", read:false, icon:"↑" },
  { id:3, type:"security", title:"New device sign-in", body:"iPhone 15 · Lagos · Just now", when:"3 hr ago", read:false, icon:"⚠" },
  { id:4, type:"tx", title:"Buy order filled", body:"500 USDT @ ₦1,610.50", when:"Yesterday", read:true, icon:"✓" },
  { id:5, type:"system", title:"Scheduled maintenance", body:"USDT-Tron deposits paused 2:00–4:00 AM WAT", when:"Mar 14", read:true, icon:"i" },
  { id:6, type:"tx", title:"Deposit received", body:"+0.0125 BTC · 3 confirmations", when:"Mar 13", read:true, icon:"↓" },
];

const TICKETS = [
  { id:"#8472", subject:"Withdrawal stuck on pending", status:"Open", priority:"High", updated:"12 min ago", unread:2 },
  { id:"#8470", subject:"Can't verify NIN", status:"In progress", priority:"Medium", updated:"1 hr ago", unread:0 },
  { id:"#8451", subject:"Refund request – wrong network", status:"Resolved", priority:"High", updated:"Yesterday", unread:0 },
  { id:"#8442", subject:"Account limit increase", status:"Closed", priority:"Low", updated:"Mar 10", unread:0 },
];

const WALLETS = [
  { sym:"BTC", chain:"Bitcoin", hot: 4.821, cold: 38.42, hotNgn:343500000, coldNgn:2740000000, threshold:5.0, addr:"bc1qxy...8f9k" },
  { sym:"ETH", chain:"Ethereum", hot: 124.5, cold: 980.2, hotNgn:711000000, coldNgn:5598000000, threshold:150, addr:"0x742d35...88aB" },
  { sym:"USDT", chain:"Tron", hot: 482000, cold: 3200000, hotNgn:776020000, coldNgn:5152000000, threshold:500000, addr:"TQrZ8x...9k2P" },
  { sym:"USDT", chain:"BSC", hot: 218000, cold: 1100000, hotNgn:351000000, coldNgn:1771000000, threshold:250000, addr:"0xab47cd...12fE" },
  { sym:"SOL", chain:"Solana", hot: 1840, cold: 12400, hotNgn:535000000, coldNgn:3614000000, threshold:2000, addr:"7xKXy2...mPq8" },
  { sym:"BNB", chain:"BSC", hot: 312, cold: 1850, hotNgn:305000000, coldNgn:1809000000, threshold:400, addr:"0xff34cc...9bBe" },
];

const AUDIT = Array.from({length:40}).map((_,i)=>{
  const r = rand(i+300);
  const actors = ["adaeze.okonkwo@clusteer.ng","tunde.b@clusteer.ng","emeka.n@clusteer.ng","system","admin@clusteer.ng"];
  const actions = [
    "Approved KYC submission","Rejected KYC: blurry ID","Suspended user","Reset 2FA","Updated fee schedule",
    "Manual transaction approval","Rotated hot wallet key","Published banner","Triggered AML rescan",
  ];
  return {
    id: `AUD-${91038 - i}`,
    actor: actors[Math.floor(r()*actors.length)],
    action: actions[Math.floor(r()*actions.length)],
    target: USERS[i%USERS.length].id,
    ip: `102.89.${Math.floor(r()*255)}.${Math.floor(r()*255)}`,
    when: `Mar ${15-Math.floor(i/4)}, ${Math.floor(r()*23)}:${String(Math.floor(r()*59)).padStart(2,'0')}`,
  };
});

const FEE_SCHEDULE = [
  { type:"Buy crypto",  asset:"All", method:"Card",       fee:"1.5% + ₦100", min:"₦500" },
  { type:"Buy crypto",  asset:"All", method:"Bank transfer", fee:"0.5%", min:"₦500" },
  { type:"Sell crypto", asset:"All", method:"Bank withdrawal", fee:"₦100 flat", min:"₦1,000" },
  { type:"Send",        asset:"USDT-Tron", method:"On-chain", fee:"1.0 USDT", min:"5 USDT" },
  { type:"Send",        asset:"USDT-BSC",  method:"On-chain", fee:"0.6 USDT", min:"5 USDT" },
  { type:"Send",        asset:"BTC",       method:"On-chain", fee:"0.00012 BTC", min:"0.0005 BTC" },
  { type:"Swap",        asset:"All",       method:"Internal", fee:"0.25%", min:"—" },
];

const CMS_CONTENT = [
  { id:1, type:"Banner", title:"Earn 2% cashback on USDT deposits", status:"Published", audience:"All users", views:"12,840", updated:"2h ago" },
  { id:2, type:"Announcement", title:"BTC withdrawal fees lowered", status:"Published", audience:"Tier 2+", views:"8,210", updated:"Yesterday" },
  { id:3, type:"FAQ", title:"How to verify your NIN", status:"Draft", audience:"All users", views:"—", updated:"3d ago" },
  { id:4, type:"Banner", title:"Maintenance window — Mar 20", status:"Scheduled", audience:"All users", views:"—", updated:"5d ago" },
];

const STAFF = [
  { name:"Adaeze Okonkwo", role:"Admin", email:"adaeze@clusteer.ng", lastActive:"Just now", twoFa:true },
  { name:"Tunde Bakare",   role:"Compliance Lead", email:"tunde@clusteer.ng", lastActive:"5 min ago", twoFa:true },
  { name:"Emeka Nwosu",    role:"Support",  email:"emeka@clusteer.ng",  lastActive:"1 hr ago", twoFa:true },
  { name:"Folake Adeyemi", role:"Finance",  email:"folake@clusteer.ng", lastActive:"3 hr ago", twoFa:false },
  { name:"Yusuf Ibrahim",  role:"Read-only",email:"yusuf@clusteer.ng",  lastActive:"Yesterday",twoFa:true },
];

Object.assign(window, { ASSETS, NG_BANKS, USERS, KYC_QUEUE, TXNS, ORDERS, NOTIFS, TICKETS, WALLETS, AUDIT, FEE_SCHEDULE, CMS_CONTENT, STAFF });
