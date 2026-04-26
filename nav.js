(function(){

const LEVELS = [
  {
    label: 'Principiante',
    desc: 'Parti da zero',
    napkins: [
      { num:1,  file:'tovagliolo-01-bias.html',            title:'I bias mentali',           sub:'Perché il tuo cervello ti fa vendere al momento sbagliato' },
      { num:2,  file:'tovagliolo-02-etf.html',             title:'ETF',                      sub:'Il carrello già pronto della finanza' },
      { num:3,  file:'tovagliolo-03-pac.html',             title:'PAC',                      sub:'Investire ogni mese senza pensarci' },
      { num:4,  file:'tovagliolo-04-inflazione.html',      title:'Inflazione',               sub:'La tassa che non vedi ma paghi ogni anno' },
    ]
  },
  {
    label: 'Intermedio',
    desc: 'Sai già le basi',
    napkins: [
      { num:5,  file:'tovagliolo-05-compound.html',        title:'Interesse composto',       sub:'Perché aspettare è la strategia migliore' },
      { num:6,  file:'tovagliolo-06-diversificazione.html',title:'Diversificazione',         sub:'Non mettere tutto in un posto' },
      { num:7,  file:'tovagliolo-07-rischio.html',         title:'Rischio vs Volatilità',    sub:'Non sono la stessa cosa' },
      { num:8,  file:'tovagliolo-08-obbligazioni.html',    title:'BTP e Obbligazioni',       sub:'Quando ha senso prestare soldi allo Stato' },
    ]
  },
  {
    label: 'Avanzato',
    desc: 'Vuoi ottimizzare',
    napkins: [
      { num:9,  file:'tovagliolo-09-tasse.html',           title:'Tasse sugli investimenti', sub:'Capital gain, dividendi, regime amministrato' },
      { num:10, file:'tovagliolo-10-portafoglio.html',     title:'Il portafoglio pigro',     sub:'3 ETF, zero pensieri' },
      { num:11, file:'tovagliolo-11-fire.html',            title:'FIRE',                     sub:'Calcola il tuo numero' },
      { num:12, file:'tovagliolo-12-inizia.html',          title:'Come iniziare domani',     sub:'La checklist definitiva' },
    ]
  }
];

const NAPKINS = LEVELS.flatMap(l => l.napkins);

const GREEN='#1d6b4a', INK='#1a1a18', BORDER='#dddbd0', PAPER='#faf9f5', PAPER2='#f3f2ec', AMBER='#b8621a';

function getDone(){ try{ return JSON.parse(localStorage.getItem('tn_done')||'[]'); }catch(e){ return []; } }
function markDone(num){ const d=getDone(); if(!d.includes(num)){d.push(num);localStorage.setItem('tn_done',JSON.stringify(d));} }
function isDone(num){ return getDone().includes(num); }
function currentNum(){ const f=window.location.pathname.split('/').pop(); const m=NAPKINS.find(n=>n.file===f); return m?m.num:0; }

function injectCSS(){
  if(document.getElementById('tn-css')) return;
  const s=document.createElement('style');
  s.id='tn-css';
  s.textContent=`
nav{position:sticky;top:0;z-index:400;background:#faf9f5;border-bottom:1px solid #dddbd0;min-height:60px}
.tn-nav-right{display:flex;align-items:center;gap:2px;flex-wrap:nowrap}

/* DROPDOWN */
.tn-nav-item{position:relative}
.tn-dropdown{
  display:none;position:absolute;top:calc(100% + 6px);right:0;
  background:#faf9f5;border:1px solid #dddbd0;border-radius:8px;
  padding:6px;min-width:520px;z-index:500;
  box-shadow:0 8px 24px rgba(0,0,0,.09);
}
.tn-nav-item.open .tn-dropdown{display:flex;gap:0;animation:tnDrop .14s ease}
@keyframes tnDrop{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}

.tn-level-col{flex:1;padding:8px 6px;border-right:1px solid #dddbd0}
.tn-level-col:last-child{border-right:none}
.tn-level-head{padding:6px 8px 10px;border-bottom:1px solid #dddbd0;margin-bottom:4px}
.tn-level-label{font-family:'DM Mono',monospace;font-size:11px;font-weight:500;color:#1a1a18;letter-spacing:.04em}
.tn-level-desc{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;color:#8a8a80;font-weight:300;margin-top:2px}

.tn-dd-item{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:5px;cursor:pointer;text-decoration:none;transition:background .1s}
.tn-dd-item:hover{background:#f3f2ec}
.tn-dd-num{width:20px;height:20px;border-radius:50%;font-family:'DM Mono',monospace;font-size:10px;font-weight:500;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tn-dd-num.done{background:#1d6b4a;color:#fff}
.tn-dd-num.current{background:#1a1a18;color:#fff}
.tn-dd-num.pending{background:#dddbd0;color:#8a8a80}
.tn-dd-title{font-size:13px;color:#1a1a18;font-weight:500;line-height:1.2}
.tn-dd-sub{font-size:11px;color:#8a8a80;font-weight:300;margin-top:1px;line-height:1.3}

/* INDICE BUTTON */
.tn-indice-btn{position:relative;background:none;border:none;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#4a4a44;padding:7px 14px;display:flex;align-items:center;gap:6px}
.tn-indice-btn:hover{color:#1a1a18}
.tn-indice-rough{position:absolute;top:-4px;left:-4px;pointer-events:none}

/* DRAWER */
.tn-overlay{display:none;position:fixed;inset:0;background:rgba(26,26,24,.32);z-index:800}
.tn-overlay.open{display:block}
.tn-drawer{position:fixed;top:0;left:-300px;width:276px;height:100vh;background:#faf9f5;border-right:1px solid #dddbd0;z-index:900;transition:left .24s ease;display:flex;flex-direction:column;overflow-y:auto}
.tn-drawer.open{left:0}
.tn-drawer-head{display:flex;align-items:center;justify-content:space-between;padding:18px 16px 14px;border-bottom:1px solid #dddbd0;flex-shrink:0}
.tn-drawer-logo{font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1a1a18}
.tn-drawer-x{background:none;border:none;font-size:22px;color:#8a8a80;cursor:pointer;line-height:1;padding:0 4px}
.tn-drawer-level{font-family:'DM Mono',monospace;font-size:10px;color:#8a8a80;letter-spacing:.09em;text-transform:uppercase;padding:12px 16px 4px}
.tn-drawer-item{display:flex;align-items:center;gap:10px;padding:8px 16px;text-decoration:none;transition:background .1s}
.tn-drawer-item:hover{background:#f3f2ec}
.tn-drawer-item.active{background:#e8f5ee}
.tn-di-num{width:22px;height:22px;border-radius:50%;flex-shrink:0;font-family:'DM Mono',monospace;font-size:10px;display:flex;align-items:center;justify-content:center}
.tn-di-num.done{background:#1d6b4a;color:#fff}
.tn-di-num.active{background:#1a1a18;color:#fff}
.tn-di-num.pending{background:#dddbd0;color:#8a8a80}
.tn-di-title{font-size:13px;color:#1a1a18;font-weight:500;line-height:1.25}
.tn-di-sub{font-size:11px;color:#8a8a80;font-weight:300}
.tn-drawer-link{display:flex;align-items:center;gap:8px;padding:9px 16px;font-size:13px;color:#4a4a44;text-decoration:none;transition:background .1s}
.tn-drawer-link:hover{background:#f3f2ec;color:#1a1a18}
.tn-drawer-footer{margin-top:auto;padding:16px;border-top:1px solid #dddbd0;flex-shrink:0}
.tn-drawer-cta{display:block;text-align:center;background:#1a1a18;color:#fff;font-size:14px;font-weight:600;padding:11px;border-radius:4px;text-decoration:none;transition:background .15s}
.tn-drawer-cta:hover{background:#1d6b4a}

/* PROGRESS */
.tn-progress{display:flex;align-items:center;gap:12px;padding:9px 40px;background:#f3f2ec;border-bottom:1px solid #dddbd0}
.tn-progress-label{font-family:'DM Mono',monospace;font-size:12px;color:#8a8a80;white-space:nowrap}
.tn-progress-track{flex:1;position:relative;height:16px}
.tn-progress-pct{font-family:'DM Mono',monospace;font-size:12px;color:#1d6b4a;font-weight:500;white-space:nowrap}

/* PREV/NEXT */
.tn-prevnext{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:40px 0 0}
.tn-prev,.tn-next{display:flex;align-items:center;gap:12px;padding:18px 20px;background:#f3f2ec;border:1px solid #dddbd0;border-radius:4px;text-decoration:none;transition:all .18s}
.tn-prev:hover,.tn-next:hover{border-color:#1a1a18;transform:translateY(-2px)}
.tn-next{justify-content:flex-end;text-align:right}
.tn-pn-arrow{font-size:20px;color:#1d6b4a;flex-shrink:0}
.tn-pn-label{font-family:'DM Mono',monospace;font-size:10px;color:#8a8a80;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}
.tn-pn-title{font-family:'Playfair Display',Georgia,serif;font-size:17px;font-weight:700;color:#1a1a18;line-height:1.2}

/* TAKE HOME */
.tn-takehome{margin:40px 0 0;position:relative}
.tn-th-canvas{position:absolute;top:-10px;left:-10px;pointer-events:none;z-index:0}
.tn-th-inner{background:#f3f2ec;border-radius:4px;padding:28px 32px;position:relative;z-index:1}
.tn-th-eyebrow{font-family:'DM Mono',monospace;font-size:10px;color:#8a8a80;letter-spacing:.1em;text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px}
.tn-th-eyebrow::after{content:'';flex:1;height:1px;background:#dddbd0}
.tn-th-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.tn-th-col-head{display:flex;align-items:center;gap:8px;margin-bottom:12px}
.tn-th-icon{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}
.tn-th-icon.do{background:#e8f5ee;color:#1d6b4a}
.tn-th-icon.dont{background:#fdf0f0;color:#8b2a2a}
.tn-th-title{font-family:'Playfair Display',Georgia,serif;font-size:17px;font-weight:700}
.tn-th-title.do{color:#1d6b4a}
.tn-th-title.dont{color:#8b2a2a}
.tn-th-list{list-style:none}
.tn-th-list li{font-size:14px;color:#4a4a44;padding:7px 0;border-bottom:1px solid #dddbd0;display:flex;align-items:flex-start;gap:8px;line-height:1.45;font-weight:400}
.tn-th-list li:last-child{border-bottom:none}
.tn-th-list.do li::before{content:'→';font-family:'DM Mono',monospace;font-size:11px;color:#1d6b4a;flex-shrink:0;margin-top:2px}
.tn-th-list.dont li::before{content:'×';font-family:'DM Mono',monospace;font-size:13px;color:#8b2a2a;flex-shrink:0;line-height:1.2}

/* AUTOVAL */
.tn-autoval{background:#f3f2ec;border-radius:4px;padding:28px 32px;margin:24px 0 0;border-left:3px solid #1d6b4a}
.tn-av-q{font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:#1a1a18;margin-bottom:16px;line-height:1.3}
.tn-av-btns{display:flex;gap:12px;flex-wrap:wrap}
.tn-av-yes{font-size:15px;font-weight:600;background:#1d6b4a;color:#fff;border:none;border-radius:4px;padding:11px 22px;cursor:pointer;transition:opacity .15s;font-family:'Plus Jakarta Sans',sans-serif}
.tn-av-yes:hover{opacity:.85}
.tn-av-no{font-size:15px;font-weight:400;background:#faf9f5;color:#1a1a18;border:1.5px solid #dddbd0;border-radius:4px;padding:11px 22px;cursor:pointer;transition:border-color .15s;font-family:'Plus Jakarta Sans',sans-serif}
.tn-av-no:hover{border-color:#1a1a18}
.tn-av-feedback{margin-top:12px;font-family:'DM Mono',monospace;font-size:13px;display:none}
.tn-av-feedback.yes{color:#1d6b4a}
.tn-av-feedback.no{color:#b8621a}

@media(max-width:640px){
  .tn-progress{padding:9px 20px}
  .tn-prevnext{grid-template-columns:1fr}
  .tn-th-grid{grid-template-columns:1fr}
  .tn-autoval{padding:20px}
  .tn-th-inner{padding:20px}
  .tn-dropdown{min-width:320px;flex-direction:column}
  .tn-level-col{border-right:none;border-bottom:1px solid #dddbd0}
  .tn-level-col:last-child{border-bottom:none}
}
`;
  document.head.appendChild(s);
}

function buildNav(){
  const nav=document.querySelector('nav');
  if(!nav) return;
  const cur=currentNum();
  const isHome=cur===0;

  const ddCols=LEVELS.map(lev=>{
    const items=lev.napkins.map(n=>{
      const d=isDone(n.num);
      const active=n.num===cur;
      const cls=d?'done':active?'current':'pending';
      return `<a class="tn-dd-item" href="${n.file}">
        <div class="tn-dd-num ${cls}">${d?'✓':n.num}</div>
        <div>
          <div class="tn-dd-title">${n.title}</div>
          <div class="tn-dd-sub">${n.sub}</div>
        </div>
      </a>`;
    }).join('');
    return `<div class="tn-level-col">
      <div class="tn-level-head">
        <div class="tn-level-label">${lev.label}</div>
        <div class="tn-level-desc">${lev.desc}</div>
      </div>
      ${items}
    </div>`;
  }).join('');

  const right=document.createElement('div');
  right.className='tn-nav-right';
  right.innerHTML=`
    <div class="tn-nav-item">
      <button class="nb" style="display:flex;align-items:center;gap:5px"
        onclick="this.closest('.tn-nav-item').classList.toggle('open');event.stopPropagation()">
        I Napkins <span style="font-size:10px;opacity:.5;margin-left:2px">▾</span>
      </button>
      <div class="tn-dropdown">${ddCols}</div>
    </div>
    <a class="nb nav-label" href="strumenti.html">Strumenti</a>
    ${!isHome?`<button class="tn-indice-btn" id="tnIndiceBtn" onclick="TNNav.openDrawer()">
      <canvas class="tn-indice-rough" id="tnIndiceCanvas" width="100" height="34"></canvas>
      <span style="position:relative;z-index:1">≡ Indice</span>
    </button>`:''}
    <a class="nb cta" href="https://thenapkin.beehiiv.com">Newsletter</a>
  `;

  const existing=nav.querySelector('.nav-links');
  if(existing) existing.replaceWith(right);
  else nav.appendChild(right);

  document.addEventListener('click',()=>{
    document.querySelectorAll('.tn-nav-item.open').forEach(el=>el.classList.remove('open'));
  });

  if(!isHome){
    requestAnimationFrame(()=>setTimeout(()=>{
      const btn=document.getElementById('tnIndiceBtn');
      const c=document.getElementById('tnIndiceCanvas');
      if(!btn||!c||typeof rough==='undefined') return;
      const bw=btn.offsetWidth+8, bh=btn.offsetHeight+8;
      c.width=bw; c.height=bh;
      rough.canvas(c).rectangle(3,3,bw-6,bh-6,{stroke:INK,strokeWidth:1.5,roughness:2.5,fill:'none'});
    },150));
  }
}

function buildDrawer(){
  const cur=currentNum();
  if(cur===0) return;

  const overlay=document.createElement('div');
  overlay.className='tn-overlay';
  overlay.id='tnOverlay';
  overlay.onclick=closeDrawer;

  const drawer=document.createElement('div');
  drawer.className='tn-drawer';
  drawer.id='tnDrawer';

  const levSections=LEVELS.map(lev=>{
    const items=lev.napkins.map(n=>{
      const d=isDone(n.num);
      const active=n.num===cur;
      return `<a class="tn-drawer-item${active?' active':''}" href="${n.file}">
        <div class="tn-di-num ${d?'done':active?'active':'pending'}">${d?'✓':n.num}</div>
        <div>
          <div class="tn-di-title">${n.title}</div>
          <div class="tn-di-sub">${n.sub}</div>
        </div>
      </a>`;
    }).join('');
    return `<div class="tn-drawer-level">${lev.label}</div>${items}`;
  }).join('');

  drawer.innerHTML=`
    <div class="tn-drawer-head">
      <span class="tn-drawer-logo">The Napkin</span>
      <button class="tn-drawer-x" onclick="TNNav.closeDrawer()">×</button>
    </div>
    ${levSections}
    <div class="tn-drawer-level">Risorse</div>
    <a class="tn-drawer-link" href="strumenti.html">↗ Strumenti</a>
    <div class="tn-drawer-footer">
      <a class="tn-drawer-cta" href="https://thenapkin.beehiiv.com">Newsletter — è gratis</a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
}

function openDrawer(){ document.getElementById('tnDrawer')?.classList.add('open'); document.getElementById('tnOverlay')?.classList.add('open'); }
function closeDrawer(){ document.getElementById('tnDrawer')?.classList.remove('open'); document.getElementById('tnOverlay')?.classList.remove('open'); }

function buildProgress(){
  const cur=currentNum();
  if(cur===0) return;
  const total=NAPKINS.length;
  const pct=Math.round((cur/total)*100);
  const bar=document.createElement('div');
  bar.className='tn-progress';
  bar.innerHTML=`
    <span class="tn-progress-label">Napkin ${cur} di ${total}</span>
    <div class="tn-progress-track"><canvas id="tnProgCanvas" style="display:block;width:100%;height:16px"></canvas></div>
    <span class="tn-progress-pct">${pct}%</span>`;
  const nav=document.querySelector('nav');
  if(nav) nav.insertAdjacentElement('afterend',bar);
  requestAnimationFrame(()=>setTimeout(()=>{
    const c=document.getElementById('tnProgCanvas');
    if(!c||typeof rough==='undefined') return;
    c.width=c.parentElement.offsetWidth;
    const rc=rough.canvas(c);
    rc.rectangle(0,2,c.width,12,{stroke:BORDER,strokeWidth:1.2,roughness:1.8,fill:'#f3f2ec',fillStyle:'solid'});
    if(pct>0) rc.rectangle(0,2,Math.max(4,Math.round(c.width*pct/100)),12,{stroke:GREEN,strokeWidth:1.2,roughness:1.8,fill:GREEN,fillStyle:'solid'});
  },200));
}

function buildTakeHome(){
  const cur=currentNum();
  if(cur===0) return;
  const data=TAKEHOMES[cur];
  if(!data) return;

  const block=document.createElement('div');
  block.className='tn-takehome';
  block.innerHTML=`
    <canvas class="tn-th-canvas" id="tnThCanvas"></canvas>
    <div class="tn-th-inner">
      <div class="tn-th-eyebrow">Take home</div>
      <div class="tn-th-grid">
        <div>
          <div class="tn-th-col-head">
            <div class="tn-th-icon do">✓</div>
            <div class="tn-th-title do">Cosa fare</div>
          </div>
          <ul class="tn-th-list do">${data.do.map(t=>`<li>${t}</li>`).join('')}</ul>
        </div>
        <div>
          <div class="tn-th-col-head">
            <div class="tn-th-icon dont">×</div>
            <div class="tn-th-title dont">Cosa evitare</div>
          </div>
          <ul class="tn-th-list dont">${data.dont.map(t=>`<li>${t}</li>`).join('')}</ul>
        </div>
      </div>
    </div>`;

  const beehiiv=document.querySelector('.beehiiv');
  const wrap=document.querySelector('.wrap');
  if(beehiiv) beehiiv.insertAdjacentElement('beforebegin',block);
  else if(wrap) wrap.appendChild(block);

  requestAnimationFrame(()=>setTimeout(()=>{
    const inner=block.querySelector('.tn-th-inner');
    const c=document.getElementById('tnThCanvas');
    if(!c||!inner||typeof rough==='undefined') return;
    const w=inner.offsetWidth+20, h=inner.offsetHeight+20;
    c.width=w; c.height=h;
    rough.canvas(c).rectangle(4,4,w-8,h-8,{stroke:INK,strokeWidth:2,roughness:2.8,fill:'none'});
  },200));
}

function buildPrevNext(){
  const cur=currentNum();
  if(cur===0) return;
  const prev=NAPKINS.find(n=>n.num===cur-1);
  const next=NAPKINS.find(n=>n.num===cur+1);
  const wrap=document.createElement('div');
  wrap.className='tn-prevnext';
  wrap.innerHTML=`
    ${prev?`<a class="tn-prev" href="${prev.file}">
      <span class="tn-pn-arrow">←</span>
      <div><div class="tn-pn-label">Precedente</div><div class="tn-pn-title">${prev.title}</div></div>
    </a>`:'<div></div>'}
    ${next?`<a class="tn-next" href="${next.file}">
      <div><div class="tn-pn-label">Successivo</div><div class="tn-pn-title">${next.title}</div></div>
      <span class="tn-pn-arrow">→</span>
    </a>`:`<a class="tn-next" href="index.html">
      <div><div class="tn-pn-label">Hai finito!</div><div class="tn-pn-title">Torna alla home</div></div>
      <span class="tn-pn-arrow">↩</span>
    </a>`}`;
  const beehiiv=document.querySelector('.beehiiv');
  const wrapEl=document.querySelector('.wrap');
  if(beehiiv) beehiiv.insertAdjacentElement('beforebegin',wrap);
  else if(wrapEl) wrapEl.appendChild(wrap);
}

const QUESTIONS={
  1:'Hai capito perché il tuo cervello ti fa fare la cosa sbagliata al momento peggiore?',
  2:'Hai capito cos\'è un ETF e perché un fondo attivo ti costa molto di più?',
  3:'Hai capito come il PAC risolve il problema del "aspetto il momento giusto"?',
  4:'Hai capito quanto ti costa ogni anno tenere i soldi fermi sul conto?',
  5:'Hai capito perché l\'interesse composto premia chi aspetta?',
  6:'Hai capito perché diversificare abbassa il rischio senza abbassare il rendimento?',
  7:'Hai capito la differenza tra rischio reale e volatilità temporanea?',
  8:'Hai capito quando ha senso comprare BTP invece di un ETF?',
  9:'Hai capito come vengono tassati i tuoi guadagni in Italia?',
  10:'Hai capito cos\'è un portafoglio pigro e perché funziona?',
  11:'Hai capito come calcolare il tuo numero FIRE?',
  12:'Sai esattamente cosa fare domani mattina per iniziare?',
};

const TAKEHOMES={
  1:{
    do:['Imposta un PAC automatico — togli la decisione di mano','Scrivi oggi in quali condizioni venderesti, e rileggila prima di farlo','Guarda il portafoglio al massimo una volta al mese'],
    dont:['Vendere quando il mercato scende del 10-15% — è esattamente il momento sbagliato','Comprare un titolo perché "tutti ne parlano"','Fare market timing: nessuno ci riesce sistematicamente, nemmeno i professionisti']
  },
  2:{
    do:['Scegli un ETF su indice globale come SWDA o VWCE come punto di partenza','Controlla il TER: sotto 0,25% annuo è un buon segnale','Preferisci ETF ad accumulazione — reinveste i dividendi in automatico'],
    dont:['Comprare un fondo attivo senza confrontare i costi nel lungo periodo','Scegliere un ETF tematico come primo investimento — troppo concentrato','Cambiare ETF ogni anno inseguendo le performance passate']
  },
  3:{
    do:['Imposta il bonifico il 1° del mese, prima di spendere altro','Inizia con una cifra sostenibile — anche 50€ al mese contano','Continua a versare anche quando il mercato scende — compri quote più economiche'],
    dont:['Mettere in pausa il PAC quando il mercato crolla — è il momento migliore per comprare','Aspettare di avere "abbastanza soldi" per iniziare','Controllare le performance settimana per settimana']
  },
  4:{
    do:['Tieni sul conto solo 3-6 mesi di spese come fondo di emergenza','Investi il resto — anche solo in un ETF globale o un BTP Italia','Calcola ogni anno quanto hai "perso" tenendo fermo, come promemoria'],
    dont:['Lasciare grosse cifre ferme "in attesa del momento giusto" — il momento giusto non arriva mai','Pensare che un conto deposito al 2,5% risolva il problema se l\'inflazione è al 3%','Confondere il saldo del conto con il valore reale dei tuoi soldi']
  },
  5:{
    do:['Inizia prima possibile — ogni anno che aspetti ha un costo enorme a lungo termine','Reinvesti i dividendi automaticamente (ETF ad accumulazione)','Pensa in decenni, non in anni'],
    dont:['Prelevare i guadagni ogni anno invece di lasciarli comporre','Aspettare condizioni "migliori" per iniziare','Sottovalutare la differenza tra iniziare a 25 anni e iniziare a 35']
  },
  6:{
    do:['Distribuisci su almeno 2-3 asset class diverse (azioni, obbligazioni, geografiche)','Un ETF globale fa già diversificazione automatica su migliaia di aziende','Ribilancia il portafoglio una volta l\'anno se un asset è cresciuto troppo'],
    dont:['Mettere tutto su un singolo titolo o settore, anche se ti sembra sicuro','Diversificare comprando 10 ETF che replicano lo stesso indice','Confondere diversificazione con sicurezza assoluta — il rischio non sparisce, si riduce']
  },
  7:{
    do:['Distingui il rischio reale (perdita permanente) dalla volatilità (oscillazione temporanea)','Scegli un asset allocation in base al tuo orizzonte temporale, non alle emozioni','Accetta che il portafoglio scenderà — è normale e atteso'],
    dont:['Vendere in perdita durante una correzione — trasformi una perdita temporanea in permanente','Scegliere investimenti "sicuri" con rendimento zero per evitare la volatilità','Guardare il portafoglio ogni giorno quando il mercato è agitato']
  },
  8:{
    do:['Usa i BTP Italia per la parte del portafoglio che vuoi legata all\'inflazione italiana','Confronta sempre il rendimento netto (dopo tasse) con quello di un ETF obbligazionario','Considera i BTP per obiettivi a medio termine (3-7 anni)'],
    dont:['Mettere tutto in BTP perché "è garantito dallo Stato" — non sei diversificato','Comprare BTP a 30 anni se hai bisogno di liquidità nel medio periodo','Ignorare il rischio tasso: se i tassi salgono, il prezzo del BTP scende']
  },
  9:{
    do:['Usa il regime amministrato se non vuoi gestire la dichiarazione — il broker fa tutto','Compensa le minusvalenze con le plusvalenze entro 4 anni','Tieni traccia dei prezzi di carico — servono per calcolare la tassazione'],
    dont:['Ignorare la differenza tra ETF armonizzati e non armonizzati — la tassazione cambia','Vendere e ricomprare subito solo per "fare cassa" — paghi le tasse inutilmente','Dimenticare di dichiarare i redditi da investimento estero se usi il regime dichiarativo']
  },
  10:{
    do:['Scegli 2-3 ETF che coprono azioni globali, obbligazioni e magari liquidità','Ribilancia una volta l\'anno con pochi minuti di lavoro','Automatizza tutto quello che puoi — meno decisioni, meno errori'],
    dont:['Aggiungere ETF su ETF pensando di migliorare — spesso è solo rumore in più','Cambiare allocazione ogni volta che il mercato si muove','Complicare il portafoglio credendo che la complessità equivalga a rendimento']
  },
  11:{
    do:['Calcola il tuo numero FIRE: spese annuali × 25','Massimizza il tasso di risparmio — è la leva più potente che hai','Rivedi il numero ogni anno — le spese cambiano'],
    dont:['Puntare al FIRE senza un fondo di emergenza solido','Usare rendimenti ottimistici (più del 4% reale) nel calcolo','Pensare che il FIRE significhi non lavorare mai più — significa scegliere']
  },
  12:{
    do:['Apri un conto con un broker regolamentato oggi — ci vogliono 10 minuti','Imposta un PAC automatico, anche piccolo, entro questa settimana','Torna a rileggere i napkin quando hai un dubbio specifico'],
    dont:['Aspettare di "capire tutto" prima di iniziare — impari facendo','Iniziare con più di 2-3 strumenti diversi — mantieni semplice','Mettere a rischio soldi che potresti avere bisogno entro 12 mesi']
  }
};

function buildAutoval(){
  const cur=currentNum();
  if(cur===0||!QUESTIONS[cur]) return;
  const next=NAPKINS.find(n=>n.num===cur+1);
  const block=document.createElement('div');
  block.className='tn-autoval';
  block.innerHTML=`
    <div class="tn-av-q">${QUESTIONS[cur]}</div>
    <div class="tn-av-btns">
      <button class="tn-av-yes" id="tnAvYes">Sì, avanti →</button>
      <button class="tn-av-no" id="tnAvNo">No, rileggo</button>
    </div>
    <div class="tn-av-feedback" id="tnAvFeedback"></div>`;

  const pn=document.querySelector('.tn-prevnext');
  const b=document.querySelector('.beehiiv');
  if(pn) pn.insertAdjacentElement('beforebegin',block);
  else if(b) b.insertAdjacentElement('beforebegin',block);

  document.getElementById('tnAvYes').onclick=()=>{
    markDone(cur);
    const fb=document.getElementById('tnAvFeedback');
    fb.className='tn-av-feedback yes';
    fb.style.display='block';
    fb.textContent=next?`Tappa ${cur} completata ✓ — Prossimo: ${next.title}`:'Tutti i napkin completati. Ben fatto.';
    setTimeout(()=>window.location.href=next?next.file:'index.html',1400);
  };
  document.getElementById('tnAvNo').onclick=()=>{
    const fb=document.getElementById('tnAvFeedback');
    fb.className='tn-av-feedback no';
    fb.style.display='block';
    fb.textContent='Rileggi la sezione che non ti è chiara, poi torna qui.';
    window.scrollTo({top:0,behavior:'smooth'});
  };
}

function init(){
  injectCSS();
  buildNav();
  buildDrawer();
  buildProgress();
  buildTakeHome();
  buildPrevNext();
  buildAutoval();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();

window.TNNav={openDrawer,closeDrawer,markDone,isDone,getDone,NAPKINS,LEVELS};

})();
