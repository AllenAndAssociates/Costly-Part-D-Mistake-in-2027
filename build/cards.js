const { chromium } = require('playwright');
const NAVY='#0B1F3A', GOLD='#E8B54A', RED='#D7263D';
const base = `<style>
*{margin:0;box-sizing:border-box}
body{background:transparent;font-family:Inter,sans-serif;color:#fff;width:1080px}
.card{margin:0 60px;padding:56px 56px;border-radius:40px;background:rgba(255,255,255,.97);color:${NAVY};box-shadow:0 24px 60px rgba(0,0,0,.45);text-align:center}
.eyebrow{font-weight:800;letter-spacing:.14em;font-size:34px;text-transform:uppercase}
.big{font-weight:900;font-size:84px;line-height:1.02;letter-spacing:-.02em}
.sub{font-weight:600;font-size:44px;line-height:1.25;margin-top:24px;font-style:italic;color:#33465f}
.icon{display:flex;justify-content:center;margin-bottom:28px}
.tag{display:inline-block;margin-top:28px;padding:14px 34px;border-radius:999px;font-weight:800;font-size:40px}
</style>`;
const cards = {
1:`<div class="card" style="background:${RED};color:#fff">
  <div class="icon"><svg width="150" height="130" viewBox="0 0 24 21"><path d="M12 1 23 20H1z" fill="#fff"/><rect x="11" y="7" width="2" height="7" fill="${RED}"/><rect x="11" y="15.5" width="2" height="2" fill="${RED}"/></svg></div>
  <div class="big">DO NOT IGNORE<br>THIS MAIL</div>
  <div class="sub" style="color:#ffe3e6">The 2027 Part D Trap</div></div>`,
2:`<div class="card">
  <div class="eyebrow" style="color:${GOLD}">Your Medicare Advisor</div>
  <div class="big" style="margin-top:18px">ARRIC ALLEN</div>
  <div style="height:6px;width:160px;background:${GOLD};margin:30px auto;border-radius:3px"></div>
  <div style="font-weight:800;font-size:52px">30+ Years Experience</div>
  <div style="font-weight:600;font-size:40px;color:#33465f;margin-top:8px">Since 1994</div>
  <div class="tag" style="background:${NAVY};color:#fff">Allen &amp; Associates</div></div>`,
3:`<div class="card">
  <div class="icon"><svg width="140" height="140" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${RED}"/><path d="M7 7l10 10M17 7 7 17" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg></div>
  <div class="big" style="text-decoration:line-through;text-decoration-color:${RED};text-decoration-thickness:10px">$0 Premium<br>Part D Plans</div>
  <div class="tag" style="background:${RED};color:#fff">Eliminated for 2027</div></div>`,
4:`<div class="card">
  <div class="icon"><svg width="300" height="150" viewBox="0 0 60 30"><rect x="1" y="1" width="58" height="28" rx="3" fill="#e9f0f8" stroke="${NAVY}" stroke-width="1.5"/><text x="5" y="9" font-family="Inter" font-weight="800" font-size="4.6" fill="${NAVY}">SOCIAL SECURITY</text><rect x="5" y="13" width="30" height="1.6" fill="#9fb2c8"/><rect x="5" y="18" width="22" height="1.6" fill="#9fb2c8"/><rect x="40" y="12" width="15" height="7" rx="1" fill="#fff" stroke="${NAVY}" stroke-width=".8"/><text x="47.5" y="17.2" text-anchor="middle" font-family="Inter" font-weight="800" font-size="4.4" fill="${NAVY}">$</text><path d="M5 25h50" stroke="${NAVY}" stroke-width=".8"/></svg></div>
  <div class="tag" style="background:${GOLD};color:${NAVY};margin-top:0">MYTH</div>
  <div class="big" style="font-size:66px;margin-top:26px">“It comes out of my check automatically.”</div></div>`,
5:`<div class="card">
  <div class="icon"><svg width="190" height="140" viewBox="0 0 38 28"><rect x="1" y="1" width="36" height="26" rx="3" fill="#fff" stroke="${NAVY}" stroke-width="2"/><path d="M2 3l17 13L36 3" fill="none" stroke="${NAVY}" stroke-width="2"/><rect x="27" y="17" width="7" height="7" fill="${RED}"/></svg></div>
  <div class="tag" style="background:#1E8E5A;color:#fff;margin-top:0">FACT</div>
  <div class="big" style="font-size:64px;margin-top:26px">You will receive a <span style="color:${RED}">physical bill</span> in the mail.</div>
  <div class="sub">You must pay it manually.</div></div>`,
6:`<div class="card" style="background:${NAVY};color:#fff;border:8px solid ${GOLD}">
  <div class="icon"><svg width="150" height="130" viewBox="0 0 24 21"><path d="M12 1 23 20H1z" fill="${GOLD}"/><rect x="11" y="7" width="2" height="7" fill="${NAVY}"/><rect x="11" y="15.5" width="2" height="2" fill="${NAVY}"/></svg></div>
  <div class="big" style="color:${GOLD}">COVERAGE<br>CANCELED</div>
  <div class="sub" style="color:#fff;font-style:normal;font-weight:700">Locked out until 2028<br><span style="color:#ff9aa6">+ Lifetime Penalties</span></div></div>`,
7:`<div style="width:1080px;height:1920px;padding:110px 70px;background:linear-gradient(160deg,#0B1F3A 0%,#13325c 60%,#0B1F3A 100%);position:relative;text-align:left">
  <div style="font-weight:800;font-size:38px;letter-spacing:.14em;color:${GOLD}">FREE DOWNLOAD</div>
  <div style="display:flex;gap:40px;margin-top:36px;align-items:center">
   <div style="width:380px;height:490px;background:#fff;border-radius:18px;transform:rotate(-5deg);box-shadow:0 30px 60px rgba(0,0,0,.5);padding:34px;color:${NAVY};flex:none">
     <div style="font-weight:900;font-size:34px;line-height:1.1">2027 Medicare<br>AEP Action Guide</div>
     <div style="height:5px;width:90px;background:${GOLD};margin:18px 0"></div>
     ${['Review plan premium','Watch your mailbox','Pay the first bill','Check your drug list','Call before Dec 7'].map(t=>`<div style="display:flex;align-items:center;gap:14px;font-size:24px;font-weight:600;margin:16px 0"><svg width="30" height="30" viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="4" fill="none" stroke="${NAVY}" stroke-width="2.5"/><path d="M6 12l4 4 8-9" fill="none" stroke="#1E8E5A" stroke-width="3"/></svg>${t}</div>`).join('')}
   </div>
   <div style="font-weight:900;font-size:62px;line-height:1.05">Your 2027 Medicare Annual Enrollment Checklist</div>
  </div>
  <div style="margin-top:70px;background:${GOLD};color:${NAVY};border-radius:28px;padding:34px 40px;font-weight:900;font-size:76px;text-align:center">Comment “GUIDE” Below</div>
  <div style="margin-top:26px;font-size:40px;font-weight:600;text-align:center;color:#cfd9e6">or visit <b style="color:#fff">allenandassociates.agency</b></div>
  <div style="position:absolute;left:70px;bottom:120px;width:520px">
    <div style="font-weight:900;font-size:50px">Allen &amp; Associates</div>
    <div style="font-size:34px;font-style:italic;color:${GOLD};margin-top:6px">Making Medicare Easy</div>
    <div style="margin-top:34px;font-size:54px;font-weight:900">800-324-9986</div>
  </div></div>`
};
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  for(const [k,html] of Object.entries(cards)){
    await p.setContent(base+html); await p.evaluate(()=>document.fonts.ready);
    const el=await p.$('body > *'); await el.screenshot({path:`card${k}.png`,omitBackground:true});
  }
  await p.setContent(`<body style="margin:0;width:1080px;height:1920px;background:radial-gradient(ellipse at 50% 30%,#1b4378 0%,#0B1F3A 70%)"></body>`);
  await p.screenshot({path:'bg.png'}); await b.close();
})();
