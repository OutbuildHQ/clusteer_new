// Clusteer Mobile — mock data
// Realistic Nigerian-fintech values: NGN amounts, USDT rates, real banks.

const RATE_USDT_NGN = 1614.50; // 1 USDT = ₦1,614.50
const FEE_PCT = 0.005; // 0.5%

const ASSETS = [
  { symbol: 'USDT', name: 'Tether', balance: 1284.42, ngn: 2074500, change: 0.02, network: 'TRC20' },
  { symbol: 'USDC', name: 'USD Coin', balance: 320.10, ngn: 516961, change: 0.01, network: 'ERC20' },
];

const TX_HISTORY = [
  { id: 'TX-2401', kind: 'buy', asset: 'USDT', amount: 500, ngn: 807250, status: 'completed', date: 'Today, 9:42 AM', method: 'GTBank •• 4421', counterparty: 'Buy USDT' },
  { id: 'TX-2400', kind: 'send', asset: 'USDT', amount: 120, ngn: 193740, status: 'completed', date: 'Today, 8:15 AM', method: 'TRC20', counterparty: 'TYz...8kQ4' },
  { id: 'TX-2398', kind: 'sell', asset: 'USDT', amount: 250, ngn: 403625, status: 'pending', date: 'Yesterday, 6:33 PM', method: 'Access •• 1109', counterparty: 'Sell USDT' },
  { id: 'TX-2392', kind: 'receive', asset: 'USDC', amount: 80, ngn: 129140, status: 'completed', date: 'Yesterday, 2:01 PM', method: 'ERC20', counterparty: '0xa3...d12' },
  { id: 'TX-2387', kind: 'buy', asset: 'USDT', amount: 200, ngn: 322900, status: 'completed', date: 'Apr 28, 11:22 AM', method: 'Kuda •• 9988', counterparty: 'Buy USDT' },
  { id: 'TX-2380', kind: 'sell', asset: 'USDC', amount: 80, ngn: 129140, status: 'failed', date: 'Apr 27, 4:08 PM', method: 'GTBank •• 4421', counterparty: 'Sell USDC' },
  { id: 'TX-2375', kind: 'receive', asset: 'USDT', amount: 1000, ngn: 1614500, status: 'completed', date: 'Apr 26, 9:00 AM', method: 'TRC20', counterparty: 'TKp...3nM2' },
  { id: 'TX-2362', kind: 'buy', asset: 'USDT', amount: 100, ngn: 161450, status: 'completed', date: 'Apr 24, 10:14 AM', method: 'OPay •• 7711', counterparty: 'Buy USDT' },
];

const BANKS = [
  { id: 'b1', name: 'GTBank', acct: '0234421109', acctName: 'ADAEZE NWOSU', logo: 'GTB', primary: true },
  { id: 'b2', name: 'Kuda', acct: '2009988142', acctName: 'ADAEZE NWOSU', logo: 'Kuda' },
  { id: 'b3', name: 'OPay', acct: '8027711330', acctName: 'ADAEZE NWOSU', logo: 'Opay' },
];

const NOTIFICATIONS = [
  { id: 'n1', kind: 'success', title: 'Payment received', body: '₦807,250 from your Buy USDT order TX-2401', time: '2 min ago', unread: true },
  { id: 'n2', kind: 'price', title: 'USDT/NGN up 0.4%', body: 'Best rate of the week — sell now to lock in ₦1,621.', time: '1 hr ago', unread: true },
  { id: 'n3', kind: 'security', title: 'New device login', body: 'iPhone 15 Pro · Lagos, Nigeria · Just now', time: '3 hrs ago', unread: false },
  { id: 'n4', kind: 'info', title: 'KYC verification approved', body: 'Your identity has been verified. Daily limit raised to ₦10M.', time: 'Yesterday', unread: false },
  { id: 'n5', kind: 'promo', title: '0% fees this weekend 🎉', body: 'Trade up to ₦5M with zero fees from Fri 6PM to Sun midnight.', time: '2 days ago', unread: false },
];

const SUPPORT_CHAT = [
  { from: 'agent', name: 'Bisi · Clusteer Support', text: 'Hi Adaeze 👋 — I see your transfer hasn\'t arrived. Could you confirm the bank you sent from?', time: '9:42 AM' },
  { from: 'me', text: 'GTBank, account ending in 4421. Sent ₦200,000 about 18 minutes ago.', time: '9:43 AM' },
  { from: 'agent', name: 'Bisi · Clusteer Support', text: 'Got it. Pulling up the reference now…', time: '9:43 AM' },
  { from: 'agent', name: 'Bisi · Clusteer Support', text: 'Found it! NIBSS shows the transfer is settled on our end. Crediting your wallet now — should appear in under 60 seconds. ✅', time: '9:46 AM' },
];

// Generate a deterministic candle/line chart series
function genSeries(n = 60, base = 1614, vol = 8, seed = 1) {
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const arr = []; let v = base;
  for (let i = 0; i < n; i++) {
    const r = (rnd() - 0.5) * vol;
    v = Math.max(base * 0.95, Math.min(base * 1.05, v + r));
    const o = v;
    const cl = v + (rnd() - 0.5) * vol * 0.4;
    const h = Math.max(o, cl) + rnd() * vol * 0.3;
    const l = Math.min(o, cl) - rnd() * vol * 0.3;
    arr.push({ o, h, l, c: cl, t: i });
    v = cl;
  }
  return arr;
}

const RATE_SERIES = genSeries(60, 1614.5, 6, 7);
// Legacy aliases — kept so older imports don't break; both point at the USDT/NGN series.
const BTC_SERIES = RATE_SERIES;
const ETH_SERIES = RATE_SERIES;

const FAQ_TOPICS = [
  { id: 'kyc', title: 'How long does KYC take?', body: 'NIN-based verification is usually instant. BVN may take up to 5 minutes during banking hours.' },
  { id: 'limits', title: 'What are my daily limits?', body: 'Verified accounts can buy/sell up to ₦10,000,000 per day. Tier 2 unlocks ₦50,000,000.' },
  { id: 'fees', title: 'How much do you charge?', body: 'Flat 0.5% on every trade. No deposit fees. NGN withdrawals via NIP are free.' },
  { id: 'rates', title: 'Where do your rates come from?', body: 'We aggregate the top 5 P2P books every 15 seconds and lock your rate at order time.' },
  { id: 'speed', title: 'How fast are payouts?', body: 'NGN lands in under 5 min on banking days. USDT/USDC ships immediately on TRC20/ERC20.' },
];

const FMT_NGN = (n) => '₦' + Math.round(n).toLocaleString('en-NG');
const FMT_USDT = (n) => Number(n).toLocaleString('en-NG', { maximumFractionDigits: 2 }) + ' USDT';
const FMT_USD = (n) => '$' + Number(n).toLocaleString('en-NG', { maximumFractionDigits: 2 });

Object.assign(window, {
  RATE_USDT_NGN, FEE_PCT, ASSETS, TX_HISTORY, BANKS, NOTIFICATIONS, SUPPORT_CHAT,
  RATE_SERIES, BTC_SERIES, ETH_SERIES, FAQ_TOPICS, FMT_NGN, FMT_USDT, FMT_USD,
});
