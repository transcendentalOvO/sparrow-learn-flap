import io
src = io.open(r'C:\Users\a\flap\index.html', encoding='utf-8').read()
driver = '''<script>
window.__fc=null;
window.requestAnimationFrame=function(cb){window.__fc=cb; return 1;};
window.cancelAnimationFrame=function(){};
</script>
'''
i=src.find('<script>'); src=src[:i]+driver+src[i:]
h='''<script>
setTimeout(function(){
  var cv=document.getElementById('game');
  var tl=function(lx,ly){ var r=cv.getBoundingClientRect();
    cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:r.left+lx*r.width/420,clientY:r.top+ly*r.height/640,bubbles:true})); };
  var S=function(){ return window.__LF.get(); };
  var drive=function(){ try{ if(window.__fc){ var f=window.__fc; window.__fc=null; f(performance.now()); } }catch(e){ window.__errs.push('DRIVE:'+e.message); } };
  tl(210,420);
  var log=[], taps=0, shaved=0, flySeen=0, maxStk=0, minStkSurvive=99;
  var lastLog=0;
  var iv=setInterval(function(){
    drive(); var now=performance.now(); var g=S();
    if(now>700 && now<26000){
      if(g.state==='run'){ var need=(g.nh||0); if(g.stk<need && g.stk<12){ tl(210,300); taps++; } }
      if(g.state==='fly'){ if(g.birdY>400){ tl(210,300); taps++; } }
    }
    if(g.stk>maxStk)maxStk=g.stk;
    if(g.state==='fly')flySeen++;
    if(now-lastLog>1500){ lastLog=now;
      log.push('t'+Math.round(now/1000)+' '+g.state+' E'+g.energy+' ft'+g.ft+' stk'+g.stk+' nh'+(g.nh||0)+' nx'+(g.nx||-1)+' y'+g.birdY); }
    if(now>29000){ clearInterval(iv);
      var f2=S();
      var res={final:f2.state,ft:f2.ft,best:Math.round(f2.best),flights:f2.flights,flySeen:flySeen,taps:taps,maxStk:maxStk,
        log:log,errs:window.__errs};
      document.title='LF3TEST:'+JSON.stringify(res); }
  },40);
},400);
</script>
</body>'''
src=src.replace('</body>',h,1)
io.open(r'C:\Users\a\flap\_lf3.html','w',encoding='utf-8').write(src)
print('written',len(src))
