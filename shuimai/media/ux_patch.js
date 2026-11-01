/* ===== 水脉介休 · 体验补丁：新手渐进 / 快捷配水 / 触觉 / 灾年随机 ===== */
(function(){
'use strict';
if (window.__smUX) return; window.__smUX = true;
var KEYS = ['agriculture','industry','domestic','ecology'];
var lastRound = 0, lastBuzz = 0;

function $(id){ return document.getElementById(id); }
function buzz(ms){ try{ if (navigator.vibrate) navigator.vibrate(ms); }catch(e){} }
function isMobile(){ try{ return document.body.classList.contains('m-compact') || innerWidth < 760; }catch(e){ return false; } }

/* ---------- 样式 ---------- */
var st = document.createElement('style');
st.textContent = [
  '#ux-round-hint{display:flex;align-items:flex-start;gap:8px;margin:6px 0 8px;padding:7px 10px;border:2px solid #2b4a5e;border-left:5px solid #f4c95d;background:rgba(10,22,34,.92);color:#cfe6f2;font-size:11px;line-height:1.55;letter-spacing:1px}',
  '#ux-round-hint b{color:#ffeec8;flex:none}',
  '#ux-round-hint .ux-hint-close{margin-left:auto;background:none;border:0;color:#8fb6c8;font-size:14px;cursor:pointer;padding:0 2px;flex:none}',
  '#ux-round-hint.ux-warn{border-left-color:#e63946;background:rgba(40,12,16,.94)}',
  '#ux-round-hint.ux-warn b{color:#ffb3ba}',
  '.quick-actions{flex-wrap:wrap}',
  '.quick-actions .ux-quick{font-family:inherit;font-size:11px;letter-spacing:1px;color:#04101a;background:#7de2f2;border:2px solid #7de2f2;padding:7px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;font-weight:bold}',
  '.quick-actions .ux-quick:active{transform:translateY(1px)}',
  '.quick-actions .ux-quick.ux-ghost{background:transparent;color:#cfe6f2;border-color:#2b4a5e}',
  'body.ux-tut-active #ux-round-hint{display:none!important}',
  ' .ux-water-note{margin:10px 0 2px;padding:8px 10px;border:2px dashed #2b4a5e;background:rgba(244,201,93,.06);color:#cfe6f2;font-size:11px;line-height:1.6;letter-spacing:1px}',
  '#ux-wizard{position:fixed;inset:0;z-index:9990;background:rgba(3,8,14,.94);display:flex;align-items:center;justify-content:center;padding:16px}',
  '.ux-wz{width:min(92vw,420px);background:var(--panel);border:3px solid #f4c95d;box-shadow:0 8px 0 rgba(0,0,0,.55);padding:14px 16px;color:#dfe8f2;font-size:12px}',
  '.ux-wz-head{display:flex;align-items:center;gap:8px;color:#ffeec8;letter-spacing:1px;margin-bottom:8px}',
  '.ux-wz-head b{font-size:14px}.ux-wz-step{margin-left:auto;font-size:11px;color:#f4c95d}.ux-wz-close{background:none;border:0;color:#8fb6c8;font-size:18px;cursor:pointer}',
  '.ux-wz-dept{font-size:16px;color:#7de2f2;letter-spacing:2px;margin-top:6px}.ux-wz-role{font-size:11px;color:#8fb6c8;margin-bottom:8px}',
  '.ux-wz-demand{font-size:12px;color:#ffe0a3;margin-bottom:6px}.ux-wz-range{width:100%;margin:8px 0;accent-color:#2ec4b6}',
  '.ux-wz-value{font-size:20px;color:#7de2f2;text-align:center;letter-spacing:1px}.ux-wz-remain{font-size:11px;text-align:center;margin:4px 0 10px}',
  '.ux-wz-actions{display:flex;gap:8px}.ux-wz-actions button{flex:1;font-family:inherit;font-size:13px;padding:9px;cursor:pointer;border:2px solid #2b4a5e;background:#10202f;color:#cfe6f2}',
  '.ux-wz-actions .ux-wz-next{background:#7de2f2;color:#04101a;border-color:#7de2f2;font-weight:bold}',
  '.ux-wizard-launch{display:none;font-family:inherit;font-size:12px;letter-spacing:1px;color:#04101a;background:#f4c95d;border:2px solid #f4c95d;padding:8px;margin-bottom:6px;cursor:pointer;font-weight:bold}',
  '@media (max-width:760px){.ux-wizard-launch{display:block;width:100%}}',
  '.pr-title,.pc-nm{font-size:11px!important;line-height:1.25}',
  '.pc-cat{font-size:9px!important}',
  '.settle-fb{font-size:11px!important}',
  '.policy-card .pc-desc,.policy-card .pc-body{font-size:11px!important;line-height:1.55!important}',
  '.trust-row{font-size:11px!important}',
  '.event-log li{font-size:10.5px!important;line-height:1.55!important}',
  '.task-chip,.task-strip{font-size:11px!important}',
  '.npc-text{font-size:11.5px!important;line-height:1.65!important}',
  '.modal-desc.small{font-size:11.5px!important}',
  '@media (max-width:760px){.policy-card .pc-desc,.policy-card .pc-body{font-size:12px!important}.trust-row{font-size:12px!important}.event-log li{font-size:11.5px!important}.modal-desc.small{font-size:12px!important}}',
  '@media (max-width:760px){.tut-card{width:calc(100vw - 24px)!important;max-width:460px;bottom:calc(64px + env(safe-area-inset-bottom))!important;padding:12px 14px!important;z-index:9999!important}.tut-card p{font-size:12px!important;line-height:1.7!important}.tut-actions{gap:8px!important}.tut-actions button{flex:1;font-size:12px!important;padding:9px 6px!important}}',
  '@media (min-width:900px){.submit-dock{flex-wrap:nowrap;gap:6px;align-items:stretch}.submit-dock .quick-actions{flex:1 1 auto;display:flex;gap:5px;min-width:0}.submit-dock .quick-actions button{flex:1 1 0;min-width:0;font-size:10px;padding:8px 4px;letter-spacing:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.submit-dock .btn-submit{flex:0 0 46%;min-width:220px;white-space:nowrap;font-size:13px;letter-spacing:1px;padding:10px 8px}}',
  '.quick-actions .ux-quick{white-space:nowrap}',
  '.panel-title{padding-bottom:7px;border-bottom:1px dashed rgba(46,196,182,.2)}',
  'button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid #f4c95d;outline-offset:2px}',
  '.quick-actions button{transition:transform .08s steps(2),border-color .15s,background .15s}',
  '.quick-actions button:hover{transform:translateY(-1px)}',
  '@media (max-width:760px){.quick-actions{gap:6px}.quick-actions .ux-quick{flex:1 1 45%;justify-content:center;font-size:12px;padding:9px 8px}}',
  '.ux-tut-target{outline:3px solid #f4c95d!important;outline-offset:3px;animation:uxPulse 1.2s ease-in-out infinite}',
  '@keyframes uxPulse{0%,100%{box-shadow:0 0 0 0 rgba(244,201,93,.0)}50%{box-shadow:0 0 0 8px rgba(244,201,93,.16)}}'
].join('\n');
document.head.appendChild(st);

/* ---------- 回合提示 + 渐进解锁 ---------- */
function setRound(r){
  document.body.classList.toggle('ux-r1', r === 1);
  document.body.classList.toggle('ux-r2', r === 2);
  document.body.classList.toggle('ux-r3', r === 3);
  var texts = {
    1: '先看水平衡，四个滑块都可以拖；熟悉节奏后再提交',
    2: '政策卡已开放，先抽 1 张再配水',
    3: '任务条与「数据」面板已开放',
    4: '各方信任面板已开放'
  };
  if (texts[r] !== undefined) showHint('<b>第 ' + r + ' 回合</b><span>' + texts[r] + '</span>', false, 7000);
}

function showHint(html, warn, ms){
  var box = $('ux-round-hint');
  if (!box){
    box = document.createElement('div'); box.id = 'ux-round-hint';
    var cc = document.querySelector('.center-controls');
    if (cc) cc.insertBefore(box, cc.firstChild);
  }
  box.innerHTML = html + '<button type="button" class="ux-hint-close" aria-label="关闭">×</button>';
  box.classList.toggle('ux-warn', !!warn);
  box.style.display = 'flex';
  box.querySelector('.ux-hint-close').onclick = function(){ box.style.display = 'none'; };
  clearTimeout(box._t);
  if (ms) box._t = setTimeout(function(){ box.style.display = 'none'; }, ms);
}

/* ---------- 灾年 / 极端天气：诉求变异 ---------- */
function weather(kind){
  try{
    if (typeof state === 'undefined' || !state) return;
    if (state._uxWeatherRound === state.round && state._uxWeatherKind === kind) return;
    state._uxWeatherKind = kind;
    state._uxWeatherRound = state.round;
    var labels = {
      drought: '☀️ 极端旱冬：生活用水 +32%、生态诉求 +45%，泉眼在等你的水',
      storm: '🌧️ 暴雨年：农业诉求下降，工业却要求扩产——排涝与保供一起压过来',
      disaster: '⚠️ 灾年 · 生命线供水：生活诉求 +38%，农业要求保口粮，生态还在报警'
    };
    var label = labels[kind] || labels.disaster;
    state.eventLog = state.eventLog || [];
    state.eventLog.push({ round: state.round, text: label });
    try{ if (typeof computeDemands === 'function') state.demands = computeDemands(state); }catch(e){}
    if (typeof ui !== 'undefined' && ui){
      if (ui.syncSliders) ui.syncSliders(state);
      if (ui.toast) ui.toast(label, 'warn');
    }
    showHint('<b>灾年</b><span>' + label + '</span>', true, 8000);
    if (typeof refresh === 'function') refresh();
  }catch(e){}
}
window.__uxApplyWeather = weather;

function maybeWeather(r){
  if (r < 2) return;
  if (state._uxWeatherRound === r) return;
  var roll = Math.random();
  if (roll < 0.30){
    var kind = roll < 0.12 ? 'drought' : (roll < 0.22 ? 'storm' : 'disaster');
    setTimeout(function(){ weather(kind); }, 500);
  }
}

/* ---------- 快捷配水 ---------- */
function setAllocation(vals){
  try{
    var changed = false;
    KEYS.forEach(function(k){
      var inp = ui.sliderInputs[k]; if (!inp) return;
      var max = Number(inp.max) || 0;
      var v = Math.max(0, Math.min(max, Math.round(vals[k] || 0)));
      if (Number(inp.value) !== v){ inp.value = v; changed = true; }
    });
    if (changed) KEYS.forEach(function(k){ try{ ui._onSliderInput({key:k}); }catch(e){} });
    if (ui._refreshShares) ui._refreshShares();
    if (ui._updateRemaining) ui._updateRemaining(state);
    Audio8.click(); buzz(12);
  }catch(e){}
}
function equalAllocation(){
  try{
    var avail = Math.max(0, Math.round(Number(state.availableWater) || 0));
    var vals = {}, caps = {}, i, k;
    KEYS.forEach(function(kk){ vals[kk] = 0; caps[kk] = Number(ui.sliderInputs[kk] && ui.sliderInputs[kk].max) || 0; });
    var left = avail, guard = 0;
    while (left > 0 && guard++ < 20000){
      var progressed = false;
      for (i = 0; i < KEYS.length && left > 0; i++){
        k = KEYS[i];
        if (vals[k] < caps[k]){ vals[k]++; left--; progressed = true; }
      }
      if (!progressed) break;
    }
    setAllocation(vals);
    if (ui.toast) ui.toast('已按可用水量四部门均摊（' + (avail - left) + ' 万m³）', 'info');
  }catch(e){}
}
function lastAllocation(){
  try{
    var src = state._lastSubmittedAlloc || state.allocation || {};
    setAllocation(src);
    if (ui.toast) ui.toast('已沿用上回合配水比例', 'info');
  }catch(e){}
}

function addQuickButtons(){
  var qa = document.querySelector('.quick-actions');
  if (!qa || $('ux-equal')) return;
  var last = document.createElement('button');
  last.type = 'button'; last.id = 'ux-last'; last.className = 'ux-quick ux-ghost'; last.innerHTML = '↩ 沿用上回合';
  last.onclick = function(){ lastAllocation(); };
  var eq = document.createElement('button');
  eq.type = 'button'; eq.id = 'ux-equal'; eq.className = 'ux-quick'; eq.innerHTML = '⚖ 一键均摊';
  eq.onclick = function(){ equalAllocation(); };
  qa.insertBefore(last, qa.firstChild);
  qa.insertBefore(eq, qa.firstChild);
}

/* ---------- 结算页：水情札记（中性陈述，不评判） ---------- */
function waterNote(){
  try{
    if (typeof state === 'undefined' || !state) return '';
    var alloc = state.allocation || {}, dem = state.demands || {};
    var items = [
      { k:'agriculture', name:'农业', line:'老周村的麦田会少灌一些' },
      { k:'industry', name:'工业', line:'厂里可能要停一条线' },
      { k:'domestic', name:'生活', line:'居民会先感到水压' },
      { k:'ecology', name:'生态', line:'洪山泉的流量还在往下走' }
    ];
    var worst = null;
    items.forEach(function(it){
      var gap = Math.max(0, Math.round((dem[it.k] || 0) - (alloc[it.k] || 0)));
      if (!worst || gap > worst.gap) worst = { gap: gap, it: it };
    });
    var text;
    if (worst && worst.gap > 0) {
      text = '这一回合，' + worst.it.name + '比诉求少 ' + worst.gap + ' 万m³——' + worst.it.line + '。';
    } else {
      text = '这一回合，四个部门都接近诉求；代价写在水位、预算和别人的忍耐里。';
    }
    return '<div class="ux-water-note"><b>📝 水情札记</b><span>' + text + '</span></div>';
  }catch(e){ return ''; }
}
(function(){
  function initNote(){
    if (typeof ui === 'undefined' || !ui || !ui._openModal) return false;
    if (ui.__uxNoteWrapped) return true;
    ui.__uxNoteWrapped = true;
    var orig = ui._openModal;
    ui._openModal = function(html, opts){
      try{
        if (typeof html === 'string' && html.indexOf('settle-list') >= 0 && html.indexOf('本回合结算') >= 0 && html.indexOf('ux-water-note') < 0){
          var note = waterNote();
          var pos = html.indexOf('<div class="modal-actions">');
          if (note && pos >= 0) html = html.slice(0,pos) + note + html.slice(pos);
        }
      }catch(e){}
      return orig.call(this, html, opts);
    };
    return true;
  }
  if(!initNote()){ var t=setInterval(function(){ if(initNote()) clearInterval(t); },200); setTimeout(function(){clearInterval(t);},8000); }
})();

/* ---------- 手机分步配水向导 ---------- */
var WZ_NAMES = { agriculture:'农业灌溉', industry:'工业生产', domestic:'居民生活', ecology:'生态补水' };
var WZ_ROLES = { agriculture:'老周 · 义安村', industry:'安泰厂长 · 焦化厂', domestic:'街道大妈 · 文苑街', ecology:'监测员 · 洪山泉' };
function openWizard(){
  try{
    if (document.getElementById('ux-wizard')) return;
    var keys = KEYS.slice();
    var wz = { idx: 0, keys: keys };
    var ov = document.createElement('div'); ov.id = 'ux-wizard';
    ov.innerHTML = '<div class="ux-wz">' +
      '<div class="ux-wz-head"><b>🧭 分步配水</b><span class="ux-wz-step"></span><button type="button" class="ux-wz-close" aria-label="关闭">×</button></div>' +
      '<div class="ux-wz-dept"></div><div class="ux-wz-role"></div>' +
      '<div class="ux-wz-demand"></div>' +
      '<input type="range" class="ux-wz-range" min="0" step="1">' +
      '<div class="ux-wz-value"></div><div class="ux-wz-remain"></div>' +
      '<div class="ux-wz-actions"><button type="button" class="ux-wz-prev">上一步</button><button type="button" class="ux-wz-next">下一步 →</button></div></div>';
    document.body.appendChild(ov);
    ov.querySelector('.ux-wz-close').onclick = function(){ ov.remove(); };
    function render(){
      var k = wz.keys[wz.idx], inp = ui.sliderInputs[k];
      ov.querySelector('.ux-wz-step').textContent = (wz.idx + 1) + ' / ' + wz.keys.length;
      ov.querySelector('.ux-wz-dept').textContent = WZ_NAMES[k] || k;
      ov.querySelector('.ux-wz-role').textContent = WZ_ROLES[k] || '';
      ov.querySelector('.ux-wz-demand').textContent = '本回合诉求 ' + Math.round((state.demands && state.demands[k]) || 0) + ' 万m³';
      var r = ov.querySelector('.ux-wz-range'); r.max = inp.max; r.value = inp.value;
      function paint(){
        var total = 0; KEYS.forEach(function(kk){ total += Number(ui.sliderInputs[kk].value) || 0; });
        var remain = Math.round(state.availableWater - total);
        ov.querySelector('.ux-wz-value').textContent = Number(r.value) + ' 万m³';
        ov.querySelector('.ux-wz-remain').textContent = remain >= 0 ? '剩余可用 ' + remain + ' 万m³' : '已超配 ' + (-remain) + ' 万m³';
        ov.querySelector('.ux-wz-remain').style.color = remain >= 0 ? '#9fc0d2' : '#ff8f9a';
      }
      r.oninput = function(){ inp.value = r.value; ui._onSliderInput({key:k}); paint(); buzz(6); };
      paint();
      ov.querySelector('.ux-wz-prev').style.visibility = wz.idx === 0 ? 'hidden' : 'visible';
      ov.querySelector('.ux-wz-next').textContent = wz.idx === wz.keys.length - 1 ? '完成 ✓' : '下一步 →';
      ov.querySelector('.ux-wz-prev').onclick = function(){ if (wz.idx > 0){ wz.idx--; render(); } };
      ov.querySelector('.ux-wz-next').onclick = function(){
        if (wz.idx < wz.keys.length - 1){ wz.idx++; render(); }
        else { ov.remove(); if (ui.toast) ui.toast('分步配水完成，可以提交了', 'info'); }
      };
    }
    render();
    buzz(10);
  }catch(e){}
}
function addWizardButton(){
  var dock = document.querySelector('.submit-dock');
  if (!dock || document.getElementById('ux-wizard-launch')) return;
  var b = document.createElement('button');
  b.type = 'button'; b.id = 'ux-wizard-launch'; b.className = 'ux-wizard-launch';
  b.innerHTML = '🧭 分步配水';
  b.onclick = openWizard;
  dock.insertBefore(b, dock.firstChild);
}
setTimeout(addWizardButton, 900);
window.__uxOpenWizard = openWizard;

/* ---------- 交互反馈 ---------- */
document.addEventListener('input', function(e){
  var t = e.target;
  if (!t || !t.matches || !t.matches('#sliders input[type=range]')) return;
  var now = Date.now();
  if (now - lastBuzz > 55){ lastBuzz = now; buzz(7); }
}, true);
document.addEventListener('click', function(e){
  var t = e.target;
  if (!t || !t.closest) return;
  if (t.closest('#submit-btn')) buzz(22);
  if (t.closest('#ux-equal, #ux-last, #quick-base, #quick-fit')) buzz(12);
}, true);

/* 记录上回合实际提交的配水，供"沿用上回合" */
document.addEventListener('click', function(e){
  var t = e.target;
  if (!t || !t.closest || !t.closest('#submit-btn')) return;
  try{ state._lastSubmittedAlloc = ui.readAllocation(); }catch(err){}
}, true);

/* ---------- 回合轮询 ---------- */
setInterval(function(){
  try{
    if (typeof state === 'undefined' || !state) return;
    var r = state.round || 1;
    if (r !== lastRound){
      lastRound = r;
      setRound(r);
      maybeWeather(r);
    }
    if (!document.getElementById('ux-equal')) addQuickButtons();
    document.body.classList.toggle('ux-tut-active', !!document.querySelector('.tut-card'));
  }catch(e){}
}, 400);

setTimeout(function(){ try{ if (typeof state !== 'undefined' && state) setRound(state.round || 1); }catch(e){} }, 300);
})();
