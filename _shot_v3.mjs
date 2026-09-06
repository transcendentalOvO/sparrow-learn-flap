// 抓取 v3: 菜单 / 奔跑(叠冰越柱) / Flying 三帧
import fs from 'node:fs';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function cdp(ws,method,params={}){
  const id=++cdp.id; cdp.ws=ws;
  ws.send(JSON.stringify({id,method,params}));
  return new Promise((res,rej)=>{const h=(ev)=>{const m=JSON.parse(ev.data);if(m.id===id){ws.removeEventListener('message',h);res(m.result);}};ws.addEventListener('message',h);});
}
cdp.id=0;
async function main(){
  const tab=await fetch('http://127.0.0.1:9228/json/new?'+encodeURIComponent('http://127.0.0.1:8124/_lf3.html'),{method:'PUT'}).then(r=>r.json());
  const ws=new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);
  await cdp(ws,'Page.enable'); await cdp(ws,'Runtime.enable');
  await sleep(600);
  const shot=async(n)=>{const {data}=await cdp(ws,'Page.captureScreenshot',{format:'png'});fs.writeFileSync('C:/Users/a/flap/shot_'+n+'.png',Buffer.from(data,'base64'));};
  const state=async()=>{const r=await cdp(ws,'Runtime.evaluate',{expression:'window.__LF?window.__LF.get():null',returnByValue:true});return r.result.value;};
  const tap=async()=>{await cdp(ws,'Runtime.evaluate',{expression:'document.getElementById("game").dispatchEvent(new PointerEvent("pointerdown",{clientX:210,clientY:300,bubbles:true}))'});};
  // 菜单
  await shot('v3_menu');
  // 开始后控制到跑态有柱子+叠冰
  await tap();
  for(let i=0;i<180;i++){await sleep(30);const s=await state();if(s&&s.state==='run'&&s.stk>=2&&s.nh>=1)break;}
  let s=await state(); console.log('run shot',s&&s.state,'stk',s&&s.stk,'nh',s&&s.nh,'nx',s&&s.nx);
  await shot('v3_run');
  // 等到飞
  for(let i=0;i<260;i++){await sleep(30);s=await state();if(s&&s.state==='fly'&&s.energy>50)break;}
  await sleep(900);
  s=await state(); console.log('fly shot',s&&s.state,'E',s&&s.energy,'ft',s&&s.ft,'y',s&&s.birdY);
  await shot('v3_fly');
  process.exit(0);
}
main().catch(e=>{console.error(e);process.exit(1);});
