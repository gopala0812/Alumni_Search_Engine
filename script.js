// script.js - single file for all pages
const backendURL ="https://alumni-search-engine-backend-wip4.onrender.com"
const FETCH_TIMEOUT = 60000; // ⏱ increased to 1 minute (was 10000)

// ---------- helpers ----------
function $(id){ return document.getElementById(id); }
function setStatus(id,msg){ const el=$(id); if(el) el.textContent = msg; }
function escapeHtml(s){ if(s===undefined||s===null) return ''; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

// fetch with timeout
async function fetchWithTimeout(url, opts={}, timeout=FETCH_TIMEOUT){
  const ctrl = new AbortController();
  opts.signal = ctrl.signal;
  const t = setTimeout(()=>ctrl.abort(), timeout);
  try {
    const res = await fetch(url, opts);
    clearTimeout(t);
    return res;
  } catch(e){
    clearTimeout(t);
    throw e;
  }
}

// ---------- sidebar & theme ----------
const sidebar = $('sidebar');
const hamburger = $('hamburger');
const closeSidebarBtn = $('closeSidebar');
const themeToggle = $('themeToggle');

function showSidebar(){ sidebar.classList.remove('hidden'); sidebar.classList.add('visible'); }
function hideSidebar(){ sidebar.classList.add('hidden'); sidebar.classList.remove('visible'); }
function toggleSidebar(){ if(sidebar.classList.contains('visible')) hideSidebar(); else showSidebar(); }
function closeSidebarIfMobile(){ if(window.innerWidth <= 900) hideSidebar(); }

hamburger?.addEventListener('click', ()=>toggleSidebar());
closeSidebarBtn?.addEventListener('click', ()=>hideSidebar());
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click', ()=>closeSidebarIfMobile()));

function loadTheme(){
  const t = localStorage.getItem('theme') || 'light';
  if(t==='dark') document.body.classList.add('dark');
}
function toggleTheme(){
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}
themeToggle?.addEventListener('click', toggleTheme);
loadTheme();

// modal
function openModal(html){ const m=$('modal'); $('modalBody').innerHTML = html; m.classList.remove('hidden'); }
function closeModal(){ const m=$('modal'); m.classList.add('hidden'); $('modalBody').innerHTML=''; }
$('modalClose')?.addEventListener('click', closeModal);
$('modal')?.addEventListener('click', (e)=>{ if(e.target.id==='modal') closeModal(); });

// ---------- stats ----------
async function fetchStats(){
  try {
    const res = await fetchWithTimeout(`${backendURL}/stats`);
    if(!res.ok) throw new Error('Server '+res.status);
    const data = await res.json();
    $('total') && ($('total').textContent = data.total_alumni ?? 0);
    $('recent') && ($('recent').textContent = data.recent_batch ?? 0);
    $('current') && ($('current').textContent = data.current_batch ?? 0);
    $('departments') && ($('departments').textContent = data.departments ?? 0);
  } catch(err){
    console.error('fetchStats error', err);
    setStatus('searchStatus', 'Unable to load stats.');
  }
}

// ---------- search (index.html) ----------
async function searchPageSearch(){
  const name = $('s_name')?.value || '';
  const department = $('s_department')?.value || '';
  const year = $('s_year')?.value || '';

  setStatus('searchStatus','Searching...');
  const params = new URLSearchParams();
  if(name) params.append('name', name);
  if(department) params.append('department', department);
  if(year) params.append('year', year);

  try {
    const res = await fetchWithTimeout(`${backendURL}/search?${params.toString()}`);
    if(!res.ok) throw new Error('Server '+res.status);
    const data = await res.json();
    renderSearchResults(data);
    setStatus('searchStatus', `Found ${Array.isArray(data)?data.length:0} result(s).`);
  } catch(err){
    console.error('search error', err);
    setStatus('searchStatus', 'Search failed. See console.');
  }
}

function renderSearchResults(data){
  const out = $('results');
  if(!out) return;
  out.innerHTML = '';
  if(!Array.isArray(data) || data.length===0){ out.textContent = 'No results found.'; return; }
  data.forEach(a=>{
    const card = document.createElement('div'); card.className='alumni-card';
    card.innerHTML = `
      <h3>${escapeHtml(a.name)}</h3>
      <p><strong>Dept:</strong> ${escapeHtml(a.department)} &nbsp; <strong>Batch:</strong> ${escapeHtml(a.year)}</p>
      <p><strong>Job:</strong> ${escapeHtml(a.job)} at ${escapeHtml(a.company)}</p>
      <button class="view-more">View More</button>
    `;
    card.querySelector('.view-more').addEventListener('click', ()=> showAlumniDetails(a));
    out.appendChild(card);
  });
}

function showAlumniDetails(a){
  let html = '<div style="padding:6px 0;">';
  ['id','name','department','year','email','phone','address','job','company','cgpa'].forEach(k=>{
    html += `<p><strong>${k}:</strong> ${escapeHtml(a[k])}</p>`;
  });
  html += '</div>';
  openModal(html);
}

// ---------- add-bulk (add.html) ----------
async function uploadJsonFile(){
  const f = $('jsonFile')?.files?.[0];
  const statusEl = $('addStatus');
  if(!f){ alert('Choose a JSON file'); return; }
  statusEl.textContent = 'Reading JSON...';
  try {
    const text = await f.text();
    let parsed = JSON.parse(text);
    if(!Array.isArray(parsed)) parsed = [parsed];
    statusEl.textContent = `Sending ${parsed.length} record(s)...`;
    const res = await fetchWithTimeout(`${backendURL}/add-bulk`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(parsed)
    });
    if(!res.ok){ const t=await res.text().catch(()=>null); throw new Error('Server '+res.status+(t?': '+t:'')); }
    const resp = await res.json().catch(()=>({status:'ok'}));
    statusEl.textContent = resp.status || 'Upload successful';
  } catch(err){
    console.error('uploadJsonFile error', err);
    statusEl.textContent = 'Upload failed. See console.';
  }
}

async function uploadExcelFile(){
  const f = $('excelFile')?.files?.[0];
  const statusEl = $('addStatus');
  if(!f){ alert('Choose an Excel file'); return; }
  statusEl.textContent = 'Reading Excel...';
  try {
    const data = await f.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const first = workbook.SheetNames[0];
    const sheet = workbook.Sheets[first];
    const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    statusEl.textContent = `Sending ${raw.length} record(s)...`;
    const res = await fetchWithTimeout(`${backendURL}/add-bulk`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(raw)
    });
    if(!res.ok){ const t=await res.text().catch(()=>null); throw new Error('Server '+res.status+(t?': '+t:'')); }
    const resp = await res.json().catch(()=>({status:'ok'}));
    statusEl.textContent = resp.status || 'Upload successful';
  } catch(err){
    console.error('uploadExcelFile error', err);
    statusEl.textContent = 'Excel upload failed. See console.';
  }
}

// ---------- download (settings.html) ----------
async function downloadById(type='json'){
  const id = $('downloadId')?.value;
  const statusEl = $('downloadStatus');
  if(!id){ alert('Enter an Alumni ID'); return; }
  statusEl.textContent = 'Fetching data...';
  try {
    const res = await fetchWithTimeout(`${backendURL}/download?id=${encodeURIComponent(id)}`);
    if(!res.ok) throw new Error('Server '+res.status);
    const data = await res.json();
    if(!Array.isArray(data) || data.length===0){ statusEl.textContent = 'No record found'; return; }

    if(type==='json'){
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = `alumni_${id}.json`; a.click();
      statusEl.textContent = 'JSON downloaded';
    } else {
      if(!window.jspdf){ alert('PDF library not loaded'); statusEl.textContent='PDF library missing'; return; }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      let y = 12;
      data.forEach((al, idx)=>{
        for(const key of ['id','name','department','year','email','phone','address','job','company','cgpa']){
          const line = `${key}: ${al[key] !== undefined ? al[key] : ''}`;
          const lines = doc.splitTextToSize(line, 180);
          doc.text(lines, 10, y);
          y += lines.length * 7;
          if(y > 270){ doc.addPage(); y = 12; }
        }
        y += 6;
      });
      doc.save(`alumni_${id}.pdf`);
      statusEl.textContent = 'PDF downloaded';
    }
  } catch(err){
    console.error('downloadById error', err);
    statusEl.textContent = 'Download failed. See console.';
  }
}

// ---------- init ----------
(function init(){
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
  if($('total') || $('recent')) fetchStats();
  if(window.innerWidth <= 900) hideSidebar();
})();

