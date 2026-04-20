// ── THE NAPKIN — nav.js ─────────────────────────────────────────────────────
// Shared navigation: dropdown, drawer, prev/next, progress bar, localStorage
// Include after rough.js in every page.

(function(){

const NAPKINS = [
  { num:1, file:'tovagliolo-01-bias.html',       title:'I bias mentali',             sub:'Il cervello che ti fa perdere soldi' },
  { num:2, file:'tovagliolo-02-etf.html',         title:'ETF',                        sub:'Il carrello già pronto' },
  { num:3, file:'tovagliolo-03-pac.html',         title:'PAC',                        sub:'Investire ogni mese senza pensarci' },
  { num:4, file:'tovagliolo-04-inflazione.html',  title:'Inflazione',                 sub:'La tassa silenziosa' },
  { num:5, file:'tovagliolo-05-compound.html',    title:'Interesse composto',         sub:'L\'ottava meraviglia' },
  { num:6, file:'tovagliolo-06-diversificazione.html', title:'Diversificazione',      sub:'Non mettere tutto in un posto' },
  { num:7, file:'tovagliolo-07-rischio.html',     title:'Rischio vs Volatilità',      sub:'Non sono la stessa cosa' },
  { num:8, file:'tovagliolo-08-obbligazioni.html',title:'BTP e Obbligazioni',         sub:'Prestare soldi allo Stato' },
  { num:9, file:'tovagliolo-09-tasse.html',       title:'Tasse sugli investimenti',   sub:'Capital gain e regime amministrato' },
  { num:10,file:'tovagliolo-10-portafoglio.html', title:'Il portafoglio pigro',       sub:'3 ETF, zero pensieri' },
  { num:11,file:'tovagliolo-11-fire.html',        title:'FIRE',                       sub:'I numeri veri dell\'indipendenza' },
  { num:12,file:'tovagliolo-12-inizia.html',      title:'Come iniziare domani',       sub:'La checklist finale' },
];

const GREEN  = '#1d6b4a';
const INK    = '#1a1a18';
const BORDER = '#dddbd0';
const PAPER  = '#faf9f5';
const PAPER2 = '#f3f2ec';
const AMBER  = '#b8621a';

// ── localStorage helpers ──────────────────────────────────────────────────
function getDone() {
  try { return JSON.parse(localStorage.getItem('tn_done') || '[]'); } catch(e){ return []; }
}
function markDone(num) {
  const done = getDone();
  if (!done.includes(num)) { done.push(num); localStorage.setItem('tn_done', JSON.stringify(done)); }
}
function isDone(num) { return getDone().includes(num); }

// ── Current page detection ────────────────────────────────────────────────
function currentNum() {
  const f = window.location.pathname.split('/').pop();
  const m = NAPKINS.find(n => n.file === f);
  return m ? m.num : 0;
}

// ── Inject global CSS ─────────────────────────────────────────────────────
function injectCSS() {
  const style = document.createElement('style');
  style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

/* ── DROPDOWN ── */
.tn-nav-item{position:relative}
.tn-dropdown{
  display:none;position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);
  background:${PAPER};border:1px solid ${BORDER};border-radius:8px;
  padding:8px;min-width:300px;z-index:500;
  box-shadow:0 8px 24px rgba(0,0,0,.10);
}
.tn-nav-item:hover .tn-dropdown,
.tn-nav-item.open .tn-dropdown{display:block;animation:tnDrop .15s ease}
@keyframes tnDrop{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.tn-dd-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:6px;
  cursor:pointer;text-decoration:none;transition:background .1s}
.tn-dd-item:hover{background:${PAPER2}}
.tn-dd-num{width:24px;height:24px;border-radius:50%;font-family:'DM Mono',monospace;font-size:11px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:500}
.tn-dd-num.done{background:${GREEN};color:#fff}
.tn-dd-num.pending{background:${BORDER};color:#8a8a80}
.tn-dd-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:${INK};font-weight:500}
.tn-dd-sub{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;color:#8a8a80;font-weight:300}
.tn-dd-divider{height:1px;background:${BORDER};margin:4px 0}

/* ── DRAWER ── */
.tn-drawer-overlay{
  display:none;position:fixed;inset:0;background:rgba(26,26,24,.35);z-index:800;
}
.tn-drawer-overlay.open{display:block}
.tn-drawer{
  position:fixed;top:0;left:-300px;width:280px;height:100vh;
  background:${PAPER};border-right:1px solid ${BORDER};z-index:900;
  transition:left .25s ease;overflow-y:auto;
  display:flex;flex-direction:column;
}
.tn-drawer.open{left:0}
.tn-drawer-head{padding:20px 16px 14px;border-bottom:1px solid ${BORDER};display:flex;align-items:center;justify-content:space-between}
.tn-drawer-logo{font-family:'Playfair Display',Georgia,serif;font-size:18px;font-weight:700;color:${INK}}
.tn-drawer-close{background:none;border:none;font-size:20px;color:#8a8a80;cursor:pointer;line-height:1;padding:2px 6px}
.tn-drawer-section{font-family:'DM Mono',monospace;font-size:10px;color:#8a8a80;letter-spacing:.09em;text-transform:uppercase;padding:14px 16px 6px}
.tn-drawer-item{display:flex;align-items:center;gap:10px;padding:9px 16px;text-decoration:none;transition:background .1s;cursor:pointer}
.tn-drawer-item:hover{background:${PAPER2}}
.tn-drawer-item.active{background:#e8f5ee}
.tn-di-num{width:22px;height:22px;border-radius:50%;font-family:'DM Mono',monospace;font-size:10px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tn-di-num.done{background:${GREEN};color:#fff}
.tn-di-num.active{background:${INK};color:#fff}
.tn-di-num.pending{background:${BORDER};color:#8a8a80}
.tn-di-text{flex:1}
.tn-di-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:${INK};font-weight:500;line-height:1.3}
.tn-di-sub{font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;color:#8a8a80;font-weight:300}
.tn-drawer-link{display:flex;align-items:center;gap:8px;padding:9px 16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#4a4a44;text-decoration:none;transition:background .1s}
.tn-drawer-link:hover{background:${PAPER2};color:${INK}}
.tn-drawer-footer{margin-top:auto;padding:16px;border-top:1px solid ${BORDER}}
.tn-drawer-cta{display:block;text-align:center;background:${INK};color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;padding:11px;border-radius:4px;text-decoration:none;transition:background .15s}
.tn-drawer-cta:hover{background:${GREEN}}

/* ── INDICE BUTTON ── */
.tn-indice-btn{
  position:relative;background:none;border:none;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;color:#4a4a44;
  padding:7px 14px;display:flex;align-items:center;gap:6px;
}
.tn-indice-btn:hover{color:${INK}}
.tn-indice-rough{position:absolute;top:-4px;left:-4px;pointer-events:none}

/* ── PROGRESS BAR ── */
.tn-progress{padding:10px 40px;background:${PAPER2};border-bottom:1px solid ${BORDER};display:flex;align-items:center;gap:14px}
.tn-progress-label{font-family:'DM Mono',monospace;font-size:12px;color:#8a8a80;white-space:nowrap}
.tn-progress-track{flex:1;position:relative;height:18px}
.tn-progress-pct{font-family:'DM Mono',monospace;font-size:12px;color:${GREEN};font-weight:500;white-space:nowrap}

/* ── PREV/NEXT NAV ── */
.tn-prevnext{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:40px 0 0}
.tn-prev,.tn-next{display:flex;align-items:center;gap:12px;padding:18px 20px;
  background:${PAPER2};border:1px solid ${BORDER};border-radius:4px;
  text-decoration:none;transition:all .18s;cursor:pointer}
.tn-prev:hover,.tn-next:hover{border-color:${INK};transform:translateY(-2px)}
.tn-prev{justify-content:flex-start}
.tn-next{justify-content:flex-end;text-align:right}
.tn-pn-arrow{font-size:20px;color:${GREEN};flex-shrink:0}
.tn-pn-label{font-family:'DM Mono',monospace;font-size:10px;color:#8a8a80;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}
.tn-pn-title{font-family:'Playfair Display',Georgia,serif;font-size:17px;font-weight:700;color:${INK};line-height:1.2}
.tn-pn-empty{flex:1}

/* ── AUTOVALUTAZIONE ── */
.tn-autoval{background:${PAPER2};border-radius:4px;padding:28px 32px;margin:32px 0 0;border-left:3px solid ${GREEN}}
.tn-av-q{font-family:'Playfair Display',Georgia,serif;font-size:19px;font-weight:700;color:${INK};margin-bottom:18px;line-height:1.3}
.tn-av-btns{display:flex;gap:12px;flex-wrap:wrap}
.tn-av-yes{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:600;background:${GREEN};color:#fff;border:none;border-radius:4px;padding:12px 24px;cursor:pointer;transition:opacity .15s}
.tn-av-yes:hover{opacity:.85}
.tn-av-no{font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:400;background:${PAPER};color:${INK};border:1.5px solid ${BORDER};border-radius:4px;padding:12px 24px;cursor:pointer;transition:border-color .15s}
.tn-av-no:hover{border-color:${INK}}
.tn-av-feedback{margin-top:14px;font-family:'DM Mono',monospace;font-size:13px;display:none}
.tn-av-feedback.yes{color:${GREEN}}
.tn-av-feedback.no{color:${AMBER}}

@media(max-width:640px){
  .tn-progress{padding:10px 20px}
  .tn-prevnext{grid-template-columns:1fr}
  .tn-autoval{padding:20px}
}
`;
  document.head.appendChild(style);
}

// ── Build nav HTML ────────────────────────────────────────────────────────
function buildNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const done = getDone();
  const cur  = currentNum();
  const isHome = cur === 0;

  // Dropdown items
  let ddItems = NAPKINS.map(n => {
    const d = isDone(n.num);
    const active = n.num === cur;
    return `<a class="tn-dd-item" href="${n.file}">
      <div class="tn-dd-num ${d?'done':'pending'}">${d?'✓':n.num}</div>
      <div><div class="tn-dd-title">${n.title}</div><div class="tn-dd-sub">${n.sub}</div></div>
    </a>`;
  }).join('');

  // Replace nav-links
  const linksDiv = nav.querySelector('.nav-links');
  if (linksDiv) {
    linksDiv.innerHTML = `
      <div class="tn-nav-item">
        <button class="nb" style="display:flex;align-items:center;gap:4px" onclick="this.closest('.tn-nav-item').classList.toggle('open')">
          I Napkins <span style="font-size:10px;opacity:.5">▾</span>
        </button>
        <div class="tn-dropdown">${ddItems}</div>
      </div>
      <a class="nb nav-label" href="glossario.html">Glossario</a>
      <a class="nb nav-label" href="strumenti.html">Strumenti</a>
      ${!isHome ? `<button class="tn-indice-btn" id="tnIndiceBtn" onclick="TNNav.openDrawer()">
        <canvas class="tn-indice-rough" id="tnIndiceCanvas" width="100" height="34"></canvas>
        <span style="position:relative;z-index:1">≡ Indice</span>
      </button>` : ''}
      <a class="nb cta" href="https://thenapkin.beehiiv.com">Newsletter</a>
    `;
  }

  // Close dropdown on outside click
  document.addEventListener('click', e => {
    document.querySelectorAll('.tn-nav-item.open').forEach(el => {
      if (!el.contains(e.target)) el.classList.remove('open');
    });
  });

  // Draw rough border on Indice button
  if (!isHome) {
    setTimeout(() => {
      const btn = document.getElementById('tnIndiceBtn');
      const c   = document.getElementById('tnIndiceCanvas');
      if (!btn || !c || typeof rough === 'undefined') return;
      const bw = btn.offsetWidth + 8;
      const bh = btn.offsetHeight + 8;
      c.width = bw; c.height = bh;
      const rc = rough.canvas(c);
      rc.rectangle(3, 3, bw-6, bh-6, {stroke:INK, strokeWidth:1.5, roughness:2.5, fill:'none'});
    }, 200);
  }
}

// ── Build drawer ──────────────────────────────────────────────────────────
function buildDrawer() {
  const cur = currentNum();
  if (cur === 0) return; // no drawer on home

  const overlay = document.createElement('div');
  overlay.className = 'tn-drawer-overlay';
  overlay.id = 'tnDrawerOverlay';
  overlay.addEventListener('click', closeDrawer);

  const drawer = document.createElement('div');
  drawer.className = 'tn-drawer';
  drawer.id = 'tnDrawer';

  let items = NAPKINS.map(n => {
    const d = isDone(n.num);
    const active = n.num === cur;
    const cls = active ? 'active' : '';
    const numCls = d ? 'done' : active ? 'active' : 'pending';
    return `<a class="tn-drawer-item ${cls}" href="${n.file}">
      <div class="tn-di-num ${numCls}">${d?'✓':n.num}</div>
      <div class="tn-di-text">
        <div class="tn-di-title">${n.title}</div>
        <div class="tn-di-sub">${n.sub}</div>
      </div>
    </a>`;
  }).join('');

  drawer.innerHTML = `
    <div class="tn-drawer-head">
      <span class="tn-drawer-logo">The Napkin</span>
      <button class="tn-drawer-close" onclick="TNNav.closeDrawer()">×</button>
    </div>
    <div class="tn-drawer-section">I Napkins</div>
    ${items}
    <div class="tn-drawer-section">Risorse</div>
    <a class="tn-drawer-link" href="glossario.html">↗ Glossario</a>
    <a class="tn-drawer-link" href="strumenti.html">↗ Strumenti</a>
    <div class="tn-drawer-footer">
      <a class="tn-drawer-cta" href="https://thenapkin.beehiiv.com">Newsletter — è gratis</a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
}

function openDrawer()  {
  document.getElementById('tnDrawer')?.classList.add('open');
  document.getElementById('tnDrawerOverlay')?.classList.add('open');
}
function closeDrawer() {
  document.getElementById('tnDrawer')?.classList.remove('open');
  document.getElementById('tnDrawerOverlay')?.classList.remove('open');
}

// ── Progress bar ──────────────────────────────────────────────────────────
function buildProgressBar() {
  const cur = currentNum();
  if (cur === 0) return;

  const total = NAPKINS.length;
  const pct   = Math.round((cur / total) * 100);

  const bar = document.createElement('div');
  bar.className = 'tn-progress';
  bar.id = 'tnProgressBar';
  bar.innerHTML = `
    <span class="tn-progress-label">Napkin ${cur} di ${total}</span>
    <div class="tn-progress-track"><canvas id="tnProgCanvas" style="display:block;width:100%;height:18px"></canvas></div>
    <span class="tn-progress-pct">${pct}%</span>
  `;

  const nav = document.querySelector('nav');
  if (nav) nav.insertAdjacentElement('afterend', bar);

  setTimeout(() => {
    const c = document.getElementById('tnProgCanvas');
    if (!c || typeof rough === 'undefined') return;
    c.width = c.parentElement.offsetWidth;
    const rc = rough.canvas(c);
    rc.rectangle(0, 3, c.width, 12, {stroke:BORDER, strokeWidth:1.2, roughness:1.8, fill:PAPER2, fillStyle:'solid'});
    if (pct > 0) {
      rc.rectangle(0, 3, Math.round(c.width * pct / 100), 12, {stroke:GREEN, strokeWidth:1.2, roughness:1.8, fill:GREEN, fillStyle:'solid'});
    }
  }, 200);
}

// ── Prev / Next buttons ───────────────────────────────────────────────────
function buildPrevNext() {
  const cur = currentNum();
  if (cur === 0) return;

  const prev = NAPKINS.find(n => n.num === cur - 1);
  const next = NAPKINS.find(n => n.num === cur + 1);

  // Remove old next-card if present
  document.querySelectorAll('.next-card').forEach(el => el.remove());

  const wrap = document.createElement('div');
  wrap.className = 'tn-prevnext';

  wrap.innerHTML = `
    ${prev
      ? `<a class="tn-prev" href="${prev.file}">
          <span class="tn-pn-arrow">←</span>
          <div><div class="tn-pn-label">Precedente</div><div class="tn-pn-title">${prev.title}</div></div>
         </a>`
      : `<div class="tn-pn-empty"></div>`}
    ${next
      ? `<a class="tn-next" href="${next.file}">
          <div><div class="tn-pn-label">Successivo</div><div class="tn-pn-title">${next.title}</div></div>
          <span class="tn-pn-arrow">→</span>
         </a>`
      : `<a class="tn-next" href="index.html">
          <div><div class="tn-pn-label">Hai finito!</div><div class="tn-pn-title">Torna alla home</div></div>
          <span class="tn-pn-arrow">↩</span>
         </a>`}
  `;

  // Insert before beehiiv block or at end of .wrap
  const beehiiv = document.querySelector('.beehiiv');
  const wrapEl  = document.querySelector('.wrap');
  if (beehiiv) beehiiv.insertAdjacentElement('beforebegin', wrap);
  else if (wrapEl) wrapEl.appendChild(wrap);
}

// ── Autovalutazione ───────────────────────────────────────────────────────
const QUESTIONS = {
  1:  'Hai capito perché il tuo cervello ti fa vendere al momento sbagliato?',
  2:  'Hai capito perché tenere i soldi fermi sul conto ti costa ogni anno?',
  3:  'Hai capito cos\'è un ETF e perché batte la maggior parte dei fondi attivi?',
  4:  'Hai capito come il PAC elimina il problema del "momento giusto"?',
  5:  'Hai capito come funziona l\'interesse composto nel tempo?',
  6:  'Hai capito perché diversificare riduce il rischio senza ridurre il rendimento?',
  7:  'Hai capito la differenza tra rischio reale e semplice volatilità?',
  8:  'Hai capito come funzionano i BTP e quando ha senso usarli?',
  9:  'Hai capito come vengono tassati i tuoi investimenti in Italia?',
  10: 'Hai capito cos\'è un portafoglio pigro e perché funziona?',
  11: 'Hai capito come calcolare il tuo numero FIRE?',
  12: 'Hai tutto quello che ti serve per iniziare domani?',
};

function buildAutoval() {
  const cur = currentNum();
  if (cur === 0 || !QUESTIONS[cur]) return;

  const next = NAPKINS.find(n => n.num === cur + 1);

  const block = document.createElement('div');
  block.className = 'tn-autoval';
  block.id = 'tnAutoval';
  block.innerHTML = `
    <div class="tn-av-q">${QUESTIONS[cur]}</div>
    <div class="tn-av-btns">
      <button class="tn-av-yes" id="tnAvYes">Sì, andiamo avanti →</button>
      <button class="tn-av-no"  id="tnAvNo">No, rispiegamelo</button>
    </div>
    <div class="tn-av-feedback yes" id="tnAvFeedback"></div>
  `;

  const prevnext = document.querySelector('.tn-prevnext');
  if (prevnext) prevnext.insertAdjacentElement('beforebegin', block);
  else {
    const beehiiv = document.querySelector('.beehiiv');
    if (beehiiv) beehiiv.insertAdjacentElement('beforebegin', block);
  }

  document.getElementById('tnAvYes').addEventListener('click', () => {
    markDone(cur);
    const fb = document.getElementById('tnAvFeedback');
    fb.className = 'tn-av-feedback yes';
    fb.style.display = 'block';
    fb.textContent = next
      ? `Tappa ${cur} completata ✓  —  Prossimo: ${next.title} →`
      : 'Hai completato tutti i napkin. Bentornato alla home.';
    if (next) setTimeout(() => window.location.href = next.file, 1200);
    else setTimeout(() => window.location.href = 'index.html', 1200);
  });

  document.getElementById('tnAvNo').addEventListener('click', () => {
    const fb = document.getElementById('tnAvFeedback');
    fb.className = 'tn-av-feedback no';
    fb.style.display = 'block';
    fb.textContent = 'Nessun problema — rileggi la sezione qui sopra, poi torna qui.';
    window.scrollTo({top:0, behavior:'smooth'});
  });
}

// ── Init ──────────────────────────────────────────────────────────────────
function init() {
  injectCSS();
  buildNav();
  buildDrawer();
  buildProgressBar();
  buildPrevNext();
  buildAutoval();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose drawer controls globally
window.TNNav = { openDrawer, closeDrawer, markDone, isDone, getDone, NAPKINS };

})();
