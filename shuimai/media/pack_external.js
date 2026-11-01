/* ===== 水脉介休 · 新素材接入包（视频版，2026-10） =====
   所有过场走 media/video；概念图在 media/img；立绘在 media/portrait。
   旧 canvas MV / CG 引擎已移除，本文件是唯一的过场实现。
*/
(function(){
'use strict';
var V = {"prologue":"media/video/prologue.mp4","spring1950":"media/video/spring1950.mp4","opening":"media/video/opening.mp4","arrival":"media/video/arrival.mp4","drought":"media/video/drought.mp4","spring_choice":"media/video/spring_choice.mp4","flood":"media/video/flood.mp4","boat":"media/video/boat.mp4","spring_revive":"media/video/spring_revive.mp4"};
var I = {"cover":"media/img/cover.webp","panorama":"media/img/panorama.webp","ending":"media/img/ending.webp","zone_agriculture":"media/img/zone_agriculture.webp","zone_industry":"media/img/zone_industry.webp","zone_domestic":"media/img/zone_domestic.webp","zone_ecology":"media/img/zone_ecology.webp","dongshan":"media/img/dongshan.webp","reclaim":"media/img/reclaim.webp","poster_flood":"media/img/poster_flood.webp","poster_boat":"media/img/poster_boat.webp"};
var P = {"player_rookie":"media/portrait/player_rookie.webp","player_adapting":"media/portrait/player_adapting.webp","player_veteran":"media/portrait/player_veteran.webp","npc_agriculture":"media/portrait/npc_agriculture.webp","npc_industry":"media/portrait/npc_industry.webp","npc_domestic":"media/portrait/npc_domestic.webp","npc_ecology":"media/portrait/npc_ecology.webp","npc_chenzhou":"media/portrait/npc_chenzhou.webp","npc_zhanglaoshi":"media/portrait/npc_zhanglaoshi.webp","npc_xiaolin":"media/portrait/npc_xiaolin.webp","npc_wangshifu":"media/portrait/npc_wangshifu.webp","npc_xiaofang":"media/portrait/npc_xiaofang.webp"};
var ZONE_ART = { '农业灌溉':'zone_agriculture', '工业生产':'zone_industry', '居民生活':'zone_domestic', '生态补水':'zone_ecology' };
var NPC_ART = { agriculture:'npc_agriculture', industry:'npc_industry', domestic:'npc_domestic', ecology:'npc_ecology', chenzhou:'npc_chenzhou', zhanglaoshi:'npc_zhanglaoshi', xiaolin:'npc_xiaolin', wangshifu:'npc_wangshifu', xiaofang:'npc_xiaofang' };
var NAME_TO_NPC = { '老周':'agriculture','安泰厂长':'industry','街道大妈':'domestic','监测员':'ecology','陈舟':'chenzhou','张老师':'zhanglaoshi','小林':'xiaolin','王师傅':'wangshifu','小芳':'xiaofang' };

/* ---------- 样式 ---------- */
(function(){
  var st = document.createElement('style');
  st.textContent = [
    '#sm-video-overlay{position:fixed;inset:0;z-index:99998;background:#04070c;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .35s steps(5)}',
    '#sm-video-overlay.show{opacity:1}',
    '#sm-video-overlay video{width:100%;height:100%;object-fit:contain;background:#04070c;display:block}',
    '#sm-video-overlay .sm-video-skip{position:absolute;top:calc(14px + env(safe-area-inset-top));right:calc(14px + env(safe-area-inset-right));z-index:3;font-family:inherit;font-size:12px;color:#cfe6f2;background:rgba(8,14,24,.78);border:2px solid #2b4152;padding:7px 13px;cursor:pointer;letter-spacing:1px}',
    '#sm-video-overlay .sm-video-title{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:26px 18px calc(16px + env(safe-area-inset-bottom));text-align:center;font-size:13px;letter-spacing:2px;color:#e8f2f8;background:linear-gradient(0deg,rgba(3,8,14,.82),rgba(3,8,14,0));pointer-events:none}',
    '#sm-video-overlay .sm-video-title small{display:block;font-size:11px;color:#9fc0d2;letter-spacing:1px;margin-top:4px}',
    '#sm-video-overlay .sm-video-play{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:4;font-family:inherit;font-size:16px;letter-spacing:2px;color:#0a1220;background:#7de2f2;border:0;padding:12px 26px;cursor:pointer}',
    '#sm-still{position:fixed;inset:0;z-index:99996;background:#04070c;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s steps(4);cursor:pointer}',
    '#sm-still.show{opacity:1}',
    '#sm-still img{width:100%;height:100%;object-fit:cover;display:block;opacity:.92}',
    '#sm-still .sm-still-txt{position:absolute;left:0;right:0;bottom:7%;text-align:center;color:#ffeec8;text-shadow:2px 2px 0 #04101a;font-size:18px;letter-spacing:3px;padding:0 20px}',
    '#sm-still .sm-still-txt small{display:block;margin-top:8px;font-size:10px;line-height:1.6;letter-spacing:1px;color:#a9c8d8;text-shadow:none;max-height:4.8em;overflow:hidden}',
    '#cover{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important}',
    '.cover-desc{text-shadow:0 2px 0 rgba(3,8,14,.7)}',
    '.sm-portrait{width:100%;height:100%;object-fit:cover;display:block}',
    '.dlg-avatar .sm-portrait{width:100%;height:100%;object-fit:cover}',
    '.sm-art{width:100%;margin:0 0 10px;border:2px solid var(--line);background:#040a12}',
    '.sm-art img{width:100%;display:block}',
    '.sm-zone-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}',
    '.sm-zone-grid figure{margin:0;border:2px solid var(--line);background:#040a12}',
    '.sm-zone-grid img{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}',
    '.sm-zone-grid figcaption{font-size:10px;color:#9fc0d2;padding:3px 6px;letter-spacing:1px}',
    '.sm-gallery-banner{margin:8px 0 10px;border:2px solid var(--line);background:#040a12}',
    '.sm-gallery-banner img{width:100%;display:block;aspect-ratio:16/9;object-fit:cover}',
    '.sm-player-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0 12px}',
    '.sm-player-card{border:2px solid var(--line);background:var(--panel2);text-align:center;padding:6px}',
    '.sm-player-card img{width:100%;aspect-ratio:1/1;object-fit:cover;display:block}',
    '.sm-player-card b{display:block;font-size:11px;color:var(--light);margin-top:5px}',
    '.sm-player-card small{font-size:9px;color:var(--dim2)}',
    '@media (max-width:768px){#sm-concept-btn{flex:1 1 100%;justify-content:center}}',
    '.sm-npc-avatar{object-fit:cover;image-rendering:auto}',
    '.npc-portrait{width:160px;height:160px;object-fit:cover;display:block;border:3px solid var(--line2);background:#040a12;margin-bottom:14px;animation:npcBob 2.4s ease-in-out infinite}',
    '.modal.sm-ending{background-image:linear-gradient(rgba(5,12,20,.93),rgba(5,14,20,.93)),url("' + I.ending + '")!important;background-size:cover!important;background-position:center!important}'
  ].join('\n');
  document.head.appendChild(st);
})();

/* ---------- 视频 / 静帧 ---------- */
function playVideo(key, opts){
  opts = opts || {};
  return new Promise(function(resolve){
    var src = V[key];
    if(!src){ resolve({skipped:false}); return; }
    var ov = document.createElement('div');
    ov.id = 'sm-video-overlay';
    ov.style.zIndex = opts.z || 99998;
    var v = document.createElement('video');
    v.src = src; v.preload = 'auto'; v.playsInline = true;
    v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
    if (opts.poster && I[opts.poster]) v.poster = I[opts.poster];
    ov.appendChild(v);
    var skip = document.createElement('button');
    skip.type='button'; skip.className='sm-video-skip'; skip.textContent='跳过 ▶';
    ov.appendChild(skip);
    if (opts.title){
      var t = document.createElement('div'); t.className='sm-video-title';
      t.innerHTML = '<b>'+opts.title+'</b>'+(opts.line?'<small>'+opts.line+'</small>':'');
      ov.appendChild(t);
    }
    var playBtn = document.createElement('button');
    playBtn.type='button'; playBtn.className='sm-video-play'; playBtn.textContent='▶ 点击播放'; playBtn.style.display='none';
    ov.appendChild(playBtn);
    document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.classList.add('show'); });
    var done=false;
    function finish(skipped){
      if(done) return; done=true;
      try{ v.pause(); }catch(e){}
      ov.classList.remove('show');
      setTimeout(function(){ try{ ov.remove(); }catch(e){} resolve({skipped:!!skipped}); }, 360);
    }
    skip.onclick=function(e){ e.stopPropagation(); finish(true); };
    v.addEventListener('ended', function(){ finish(false); });
    v.addEventListener('error', function(){ finish(false); });
    playBtn.onclick=function(){ playBtn.style.display='none'; var p=v.play(); if(p&&p.catch)p.catch(function(){}); };
    var p=v.play();
    if(p&&p.catch) p.catch(function(){
      try{ v.muted=true; }catch(e){}
      var p2=v.play();
      if(p2&&p2.catch) p2.catch(function(){ playBtn.style.display='block'; });
    });
    setTimeout(function(){ if(!done && v.readyState===0) finish(false); }, 15000);
  });
}

function showStill(key, opts){
  opts=opts||{};
  return new Promise(function(resolve){
    var src=I[key]; if(!src){ resolve(); return; }
    var ov=document.createElement('div'); ov.id='sm-still'; ov.style.zIndex=opts.z||99996;
    ov.innerHTML='<img src="'+src+'" alt=""><div class="sm-still-txt"><b></b><small></small></div>';
    ov.querySelector('b').textContent=opts.title||'';
    ov.querySelector('small').textContent=opts.line||'';
    document.body.appendChild(ov);
    requestAnimationFrame(function(){ ov.classList.add('show'); });
    var done=false;
    function finish(){ if(done)return; done=true; ov.classList.remove('show'); setTimeout(function(){ try{ov.remove();}catch(e){} resolve(); },320); }
    ov.onclick=finish;
    setTimeout(finish, opts.duration||2200);
  });
}

window.playShuimaiVideo = playVideo;
window.SM_ASSETS = { videos: V, images: I, portraits: P };

/* ---------- 开场：序 → 山泉 1950 → 开场 MV → 报到 ---------- */
function playVideoOpening(){
  if (window.__smOpeningPlayedOnce) { if (typeof startGameAfterCover === 'function') startGameAfterCover(); return; }
  window.__smOpeningPlayedOnce = true;
  var aborted=false;
  function step(key,title,line){
    return playVideo(key,{z:99999,title:title,line:line}).then(function(r){ if(r&&r.skipped) aborted=true; return aborted; });
  }
  function done(){
    window.__smArrivalPlayed = true;
    try{ if(typeof startGameAfterCover==='function') startGameAfterCover(); }catch(e){}
  }
  step('prologue','序','水脉介休 · 2003—2022')
    .then(function(ab){ return ab ? true : step('spring1950','山泉 · 1950','洪山泉，1.60 m³/s'); })
    .then(function(ab){ return ab ? true : step('opening','开场 MV','我是节水 CEO'); })
    .then(function(ab){ return ab ? true : step('arrival','报到','2022 年 9 月，水务局'); })
    .then(done).catch(done);
}
window.playOpeningSequence = playVideoOpening;

/* ---------- 幕间视频 ---------- */
(function(){
  var orig = window.playActOpening;
  window.playActOpening = function(state){
    var r = orig ? orig.apply(this, arguments) : null;
    try {
      if (!state || state.storyMode === 'off') return r;
      var round = state.round || 1;
      if (round >= 1 && round <= 2 && !window.__smArrivalPlayed && !state._smArr1) {
        state._smArr1 = true; window.__smArrivalPlayed = true;
        setTimeout(function(){ playVideo('arrival',{z:99998,title:'第一幕 · 接盘',line:'四部电话，一份水'}); }, 500);
      } else if (round >= 3 && round <= 5 && !state._smDrought) {
        state._smDrought = true;
        setTimeout(function(){ playVideo('drought',{z:99998,title:'第二幕 · 拉扯',line:'旱冬，渠底裂开'}); }, 500);
      } else if (round >= 6 && round <= 8 && !state._smFlood) {
        state._smFlood = true;
        setTimeout(function(){ playVideo('flood',{z:99998,title:'第三幕 · 决堤',line:'泉眼与工厂的二选一',poster:'poster_flood'}); }, 500);
      } else if (round >= 9 && round <= 10 && !state._smBoat) {
        state._smBoat = true;
        setTimeout(function(){ playVideo('boat',{z:99998,title:'第四幕 · 前夜',line:'你守着的，是什么',poster:'poster_boat'}); }, 500);
      }
    } catch(e){}
    return r;
  };
})();

/* ---------- CG / 仪式：全部走视频或静帧，不调用旧 canvas ---------- */
(function(){
  window.playDecisionCG = function(title, line, art){
    var t=String(title||''), l=String(line||'');
    if (/洪山泉重生/.test(t)) {
      if (window.__smSpringPlayed) return Promise.resolve();
      window.__smSpringPlayed = true;
      return playVideo('spring_revive',{z:99998,title:'洪山泉重生',line:l});
    }
    if (/任期结束/.test(t)) return playVideo('spring_choice',{z:99998,title:'任期结束',line:l});
    if (/东山并网/.test(t)) return showStill('dongshan',{title:t,line:l,duration:2200});
    if (/路线已定/.test(t)) {
      var img = art === 'spring_night' ? 'zone_ecology' : (art === 'rain' ? 'zone_industry' : 'zone_domestic');
      return showStill(img,{title:t,line:l,duration:1800});
    }
    return Promise.resolve();
  };
  window.playCeremony = function(art, line, opts){
    var l=String(line||'');
    if (/洪山泉/.test(l) && /(醒|复涌|重生)/.test(l)) {
      window.__smSpringPlayed = true;
      return playVideo('spring_revive',{z:99998,title:'洪山泉重生',line:l});
    }
    if (/离开|再无/.test(l)) return showStill('poster_boat',{title:'又一个人走了',line:l,duration:2400});
    return Promise.resolve();
  };
  window.playHongshanCeremony = function(){
    window.__smSpringPlayed = true;
    return playVideo('spring_revive',{z:99998,title:'洪山泉重生',line:'泉眼重新冒水'});
  };
})();

/* ---------- 结局前夜：静态概念图 + 诗句，不再用 canvas ---------- */
window.showFinalNight = function(state){
  if (typeof DialogBar !== 'undefined' && DialogBar._skipping) return Promise.resolve();
  return new Promise(function(resolve){
    var mask = document.createElement('div'); mask.className = 'night-mask';
    var img = document.createElement('img');
    img.src = I.poster_boat;
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;z-index:0';
    var box = document.createElement('div'); box.className = 'night-box'; box.style.cssText='position:relative;z-index:1';
    var verse = '';
    try { verse = (typeof buildFinalNightVerse === 'function') ? buildFinalNightVerse(state) : ''; } catch(e){}
    box.innerHTML = '<div class="night-title">🌙 任期前夜</div><div class="night-verse">' + verse + '</div><div class="night-actions"><button class="night-btn">迎接结局 ▶</button></div>';
    mask.appendChild(img); mask.appendChild(box); document.body.appendChild(mask);
    mask.querySelector('.night-btn').onclick = function(){ try{ Audio8.click(); }catch(e){} mask.remove(); resolve(); };
  });
};

/* ---------- 封面背景 ---------- */
(function(){
  function setCover(){
    var c = document.getElementById('cover'); if(!c) return false;
    c.style.backgroundImage = 'linear-gradient(180deg,rgba(4,10,18,.68) 0%,rgba(5,14,22,.52) 52%,rgba(4,18,18,.70) 100%), url("' + I.cover + '")';
    return true;
  }
  if(!setCover()){ var t=setInterval(function(){ if(setCover()) clearInterval(t); },120); setTimeout(function(){clearInterval(t);},4000); }
})();

/* ---------- 四区图鉴 ---------- */
function showConceptGallery(){
  try {
    if (typeof ui === 'undefined' || !ui || !ui._openModal) return;
    var html = '<div class="modal-head"><span class="modal-icon">🖼️</span><h2>城市与水源 · 概念图鉴</h2></div>' +
      '<div class="sm-gallery-banner"><img src="' + I.panorama + '" alt=""></div>' +
      '<div class="sm-zone-grid">' +
        '<figure><img src="' + I.zone_agriculture + '"><figcaption>农田灌区 · 老周麦田</figcaption></figure>' +
        '<figure><img src="' + I.zone_industry + '"><figcaption>工业园区 · 安泰工厂</figcaption></figure>' +
        '<figure><img src="' + I.zone_domestic + '"><figcaption>城市生活 · 水脉介休</figcaption></figure>' +
        '<figure><img src="' + I.zone_ecology + '"><figcaption>洪山泉 · 泉眼圣境</figcaption></figure>' +
        '<figure><img src="' + I.dongshan + '"><figcaption>东山供水 · 大沟水厂</figcaption></figure>' +
        '<figure><img src="' + I.reclaim + '"><figcaption>再生水 · 中水管网</figcaption></figure>' +
      '</div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-primary" data-close="0">关闭</button></div>';
    ui._openModal(html,{resolve:function(){}});
  } catch(e){}
}
function addConceptEntry(){
  try {
    var actions = document.querySelector('.cover-mini-actions');
    if (actions && !document.getElementById('sm-concept-btn')) {
      var b=document.createElement('button'); b.type='button'; b.className='btn-mini'; b.id='sm-concept-btn'; b.innerHTML='🖼 四区图鉴';
      b.addEventListener('click', function(ev){ ev.stopPropagation(); try{ if(window.Audio8&&Audio8.click) Audio8.click(); }catch(e){} showConceptGallery(); });
      actions.appendChild(b);
    }
    var grid=document.querySelector('.m-menu-grid');
    if (grid && !document.getElementById('sm-concept-menu')) {
      var mb=document.createElement('button'); mb.type='button'; mb.className='m-menu-btn'; mb.id='sm-concept-menu'; mb.innerHTML='🖼 四区图鉴';
      mb.addEventListener('click', function(){ var m=document.getElementById('m-menu'); if(m) m.classList.remove('open'); showConceptGallery(); });
      grid.insertBefore(mb, grid.firstChild);
    }
  } catch(e){}
}
setTimeout(addConceptEntry, 900);
window.showConceptGallery = showConceptGallery;

/* ---------- 弹窗装饰：区域图 / 立绘 / 结局背景 ---------- */
function decorateModal(m){
  if(!m || !m.overlay) return;
  var root=m.overlay;
  var cells=root.querySelectorAll('.char-cell[data-char]');
  for(var i=0;i<cells.length;i++){
    var cell=cells[i]; if(cell.classList.contains('locked')) continue;
    var key=cell.getAttribute('data-char'); var src=P['npc_'+key]; if(!src) continue;
    var av=cell.querySelector('.cc-avatar'); if(av) av.innerHTML='<img class="sm-portrait" src="'+src+'" alt="">';
  }
  if (root.querySelector('.character-grid') && !root.querySelector('.sm-player-row')) {
    var row=document.createElement('div'); row.className='sm-player-row';
    row.innerHTML='<div class="sm-player-card"><img src="'+P.player_rookie+'"><b>新任 CEO</b><small>第 1 年</small></div>'+
      '<div class="sm-player-card"><img src="'+P.player_adapting+'"><b>第 3 年</b><small>适应期</small></div>'+
      '<div class="sm-player-card"><img src="'+P.player_veteran+'"><b>任期将满</b><small>第 10 年</small></div>';
    var grid=root.querySelector('.character-grid'); grid.parentNode.insertBefore(row, grid);
  }
  var detail=root.querySelector('.char-detail');
  if (detail && detail.parentNode) {
    var nameEl=root.querySelector('.modal-head h2');
    var nm=nameEl?(nameEl.textContent||'').replace(/\s+/g,''):'';
    var nk=null; for(var cn in NAME_TO_NPC){ if(nm.indexOf(cn)>=0){ nk=NAME_TO_NPC[cn]; break; } }
    if(nk && P['npc_'+nk]){
      var holder=detail.parentNode.firstElementChild;
      if(holder && holder!==detail) holder.innerHTML='<img class="sm-portrait" style="width:96px;height:96px" src="'+P['npc_'+nk]+'">';
    }
  }
  if (root.querySelector('.final-kicker')) {
    var modal=root.querySelector('.modal'); if(modal) modal.classList.add('sm-ending');
  }
}
(function(){
  function initModal(){
    var U=(typeof ui!=='undefined')?ui:null;
    if(!U || !U._openModal) return false;
    if(U.__smWrapped) return true;
    U.__smWrapped=true;
    var orig=U._openModal;
    U._openModal=function(html, opts){
      try {
        if (typeof html==='string') {
          var zoneKey=null;
          for (var zn in ZONE_ART){ if(html.indexOf(zn)>=0 && html.indexOf('区域详情')>=0){ zoneKey=ZONE_ART[zn]; break; } }
          if (zoneKey && html.indexOf('<div class="sm-art"')<0) {
            html=html.replace('<div class="zone-modal">','<div class="sm-art"><img src="'+I[zoneKey]+'" alt=""></div><div class="zone-modal">');
          }
        }
      } catch(e){}
      var m=orig.call(this,html,opts);
      setTimeout(function(){ try{ decorateModal(m); }catch(e){} },30);
      return m;
    };
    return true;
  }
  if(!initModal()){ var t=setInterval(function(){ if(initModal()) clearInterval(t); },200); setTimeout(function(){clearInterval(t);},8000); }
})();

/* ---------- 全站 NPC 头像：用新立绘替换旧 32×32 SVG ---------- */
(function(){
  var orig = window.npcAvatar;
  if (typeof orig !== 'function') return;
  window.npcAvatar = function(dept, mood){
    if (P['npc_' + dept]) return '<img class="npc-avatar sm-npc-avatar" src="' + P['npc_' + dept] + '" alt="">';
    return orig.apply(this, arguments);
  };
})();

/* ---------- 结算后的 NPC 叙事场景：用新立绘 + 概念图，替换 pixel canvas ---------- */
(function(){
  var orig = window.showNarrativeScene;
  if (typeof orig !== 'function') return;
  window.showNarrativeScene = function(key, state, result){
    var p = orig.apply(this, arguments);
    setTimeout(function(){
      try {
        var mask = document.querySelector('.narrative-mask'); if (!mask) return;
        var sc = (typeof NARRATIVE_SCENES !== 'undefined') ? NARRATIVE_SCENES[key] : null;
        var dept = sc && sc.dept;
        if (dept) {
          var zone = { agriculture:'zone_agriculture', industry:'zone_industry', domestic:'zone_domestic', ecology:'zone_ecology' }[dept] || 'zone_domestic';
          mask.style.backgroundImage = 'linear-gradient(rgba(3,8,14,.78),rgba(3,8,14,.88)), url("' + I[zone] + '")';
          mask.style.backgroundSize = 'cover';
          mask.style.backgroundPosition = 'center';
          var cv = mask.querySelector('.npc-canvas');
          if (cv && P['npc_' + dept]) {
            var img = document.createElement('img');
            img.className = 'npc-portrait';
            img.src = P['npc_' + dept];
            img.alt = sc.name || '';
            cv.replaceWith(img);
          }
        }
      } catch(e){}
    }, 20);
    return p;
  };
})();

/* ---------- 对话栏立绘 ---------- */
(function(){
  function initDialog(){
    if(typeof DialogBar==='undefined' || !DialogBar || !DialogBar.show) return false;
    if(DialogBar.__smWrapped) return true;
    DialogBar.__smWrapped=true;
    var orig=DialogBar.show;
    DialogBar.show=function(e){
      var p=orig.apply(this,arguments);
      var self=this;
      setTimeout(function(){
        try{
          var av=self.el && self.el.querySelector('.dlg-avatar'); if(!av||!e) return;
          var src=null;
          if(e.isPlayer) src=P['player_'+(e.stage||'rookie')];
          else if(e.dept) src=P['npc_'+e.dept];
          if(src) av.innerHTML='<img class="sm-portrait" src="'+src+'" alt="">';
        }catch(err){}
      },0);
      return p;
    };
    return true;
  }
  if(!initDialog()){ var t=setInterval(function(){ if(initDialog()) clearInterval(t); },200); setTimeout(function(){clearInterval(t);},8000); }
})();

})();
