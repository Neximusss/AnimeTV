(function(){
  if (window.__animeNexusTv) return;

  var current = null;
  function visible(el){
    if (!el) return false;
    var r=el.getBoundingClientRect(), s=getComputedStyle(el);
    if (s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity||'1')===0) return false;
    if (r.width<2||r.height<2) return false;
    if (el.closest && el.closest('[id*="comment" i],[class*="comment" i]')) return false;
    return true;
  }
  function items(){
    return Array.from(document.querySelectorAll(
      'button,a[href],input,select,textarea,[role="button"],[role="slider"],[tabindex],video'
    )).filter(visible);
  }
  function mark(el){
    if (!el) return;
    current=el;
    try{ el.focus({preventScroll:true}); }catch(e){ try{el.focus();}catch(_e){} }
    try{ el.scrollIntoView({block:"center",inline:"center",behavior:"smooth"}); }catch(e){}
  }
  function center(el){
    var r=el.getBoundingClientRect();
    return {x:r.left+r.width/2,y:r.top+r.height/2};
  }
  function move(dir){
    var list=items();
    if (!list.length) return;
    if (!current || !visible(current)){
      current=document.activeElement;
      if (!visible(current)) current=list[0];
      mark(current);
      return;
    }
    var c=center(current), best=null, bestScore=1e15;
    list.forEach(function(el){
      if (el===current) return;
      var p=center(el), dx=p.x-c.x, dy=p.y-c.y;
      if (dir==='left' && dx>=-2) return;
      if (dir==='right' && dx<=2) return;
      if (dir==='up' && dy>=-2) return;
      if (dir==='down' && dy<=2) return;
      var primary=(dir==='left'||dir==='right')?Math.abs(dx):Math.abs(dy);
      var secondary=(dir==='left'||dir==='right')?Math.abs(dy):Math.abs(dx);
      var score=primary + secondary*2.4;
      if (score<bestScore){bestScore=score;best=el;}
    });
    if (best) mark(best);
  }
  function activate(){
    if (!current || !visible(current)) current=document.activeElement;
    if (!current || current===document.body) { var a=items(); if(a.length) current=a[0]; }
    if (!current) return;
    if (current.tagName==='VIDEO'){
      if (current.paused) current.play(); else current.pause();
      return;
    }
    try{current.click();}catch(e){}
  }
  function media(cmd){
    var v=document.querySelector('video');
    if (!v) return;
    if (cmd==='toggle') { if(v.paused) v.play(); else v.pause(); }
    else if (cmd==='play') v.play();
    else if (cmd==='pause') v.pause();
    else if (cmd==='ff') v.currentTime=Math.min(v.duration||v.currentTime+10,v.currentTime+10);
    else if (cmd==='rew') v.currentTime=Math.max(0,v.currentTime-10);
  }

  var st=document.createElement('style');
  st.textContent=[
    ':focus{outline:4px solid #4dc3ff!important;outline-offset:4px!important;',
    'box-shadow:0 0 0 3px rgba(77,195,255,.35),0 0 24px rgba(77,195,255,.7)!important;}',
    '[id*="comment" i],[class*="comment" i]{display:none!important;}',
    'html,body{background:#000!important;}'
  ].join('');
  (document.head||document.documentElement).appendChild(st);

  window.__animeNexusTv={move:move,activate:activate,media:media};
})();