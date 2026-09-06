// 抓取游玩画面(麻雀叠冰柱)
import fs from 'node:fs';
const CDP='http://127.0.0.1:9226';
async function main(){
  const tab=await fetch(CDP+'/json/new?'+encodeURIComponent('http://127.0.0.1:8124/_flaptest.html'),{method:'PUT'}).then(r=>r.json());
  const ws=new WebSocket(tab.webSocketDebuggerUrl);
  let id=0;const pending=new Map();
  const send=(m,p={})=>new Promise((res)=>{const mid=++id;pending.set(mid,res);ws.send(JSON.stringify({id:mid,method:m,params:p}));});
  ws.onmessage=ev=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m.result);pending.delete(m.id);}};
  await new Promise(r=>ws.onopen=r);
  await send('Runtime.enable');
  for(let i=0;i<200;i++){
    await new Promise(r=>setTimeout(r,300));
    const out=await send('Runtime.evaluate',{expression:'window.__FLAP?JSON.stringify(window.__FLAP.get()):null',returnByValue:true});
    let s=null; try{s=out.result&&out.result.value?JSON.parse(out.result.value):null;}catch(e){}
    if(s&&s.state==='play'&&s.stk>=3&&s.score>=6){
      await new Promise(r=>setTimeout(r,400));
      const sh=await send('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync('shot_play.png',Buffer.from(sh.data,'base64'));
      console.log('saved play shot, state:',JSON.stringify(s));
      ws.close();process.exit(0);
    }
  }
  console.log('timeout');ws.close();process.exit(1);
}
main().catch(e=>{console.error(e);process.exit(1);});
