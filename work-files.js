(()=>{
const owner='peeyush-jangid',repo='peeyush-jangid.github.io',branch='main';
const grid=document.getElementById('work-file-grid'),count=document.getElementById('work-file-count');
if(!grid)return;
const tabs=document.querySelector('.file-tabs');if(tabs)tabs.style.display='none';
document.head.insertAdjacentHTML('beforeend','<style>.wf-back{grid-column:1/-1;display:flex;align-items:center;gap:1rem;margin-bottom:.4rem}.wf-back button{font:inherit;cursor:pointer;color:#d9bd7b;background:transparent;border:1px solid rgba(217,189,123,.4);border-radius:999px;padding:.55rem 1.1rem}.wf-back button:hover{background:rgba(217,189,123,.12)}.wf-back span{font-weight:700;font-size:1.15rem}.work-folder{cursor:pointer}.work-folder:focus-visible{outline:2px solid #d9bd7b;outline-offset:3px}.work-file-icon.cad{background:rgba(110,160,235,.14);color:#8fb8f0}.work-file-icon.ppt{background:rgba(232,128,92,.14);color:#f0a07c}.work-file-icon.pdf{background:rgba(235,100,100,.14);color:#f08a8a}</style>');
const types=['xlsx','xls','csv','docx','doc','rtf','odt','pptx','ppt','pps','ppsx','odp','pdf','dwg','dxf'];
const ext=n=>(n.split('.').pop()||'').toLowerCase();
const kind=n=>{const e=ext(n);return['xlsx','xls','csv'].includes(e)?'excel':['pptx','ppt','pps','ppsx','odp'].includes(e)?'ppt':e==='pdf'?'pdf':['dwg','dxf'].includes(e)?'cad':'word'};
const meta={excel:['▦','EXCEL SPREADSHEET','Excel files'],word:['▤','WORD DOCUMENT','Word files'],ppt:['▣','POWERPOINT PRESENTATION','PowerPoint files'],pdf:['▥','PDF DOCUMENT','PDF files'],cad:['◫','AUTOCAD DRAWING','AutoCAD files']};
const order=['excel','word','ppt','pdf','cad'];
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let files=[],open=null;
function render(){
 if(!open){
  const groups=order.map(k=>[k,files.filter(f=>kind(f.name)===k)]).filter(g=>g[1].length);
  count.textContent=`${groups.length} ${groups.length===1?'folder':'folders'} · ${files.length} ${files.length===1?'file':'files'}`;
  grid.innerHTML=groups.length?groups.map(([k,list])=>`<article class="work-file-card work-folder" role="button" tabindex="0" data-folder="${k}"><div class="work-file-icon ${k}">${meta[k][0]}</div><div class="work-file-type">FOLDER</div><h3>${meta[k][2]}</h3><span class="work-file-link">${list.length} ${list.length===1?'file':'files'} · Open folder ↗</span></article>`).join(''):'<div class="work-file-empty">No files uploaded yet.</div>';
 }else{
  const list=files.filter(f=>kind(f.name)===open);
  count.textContent=`${list.length} ${list.length===1?'file':'files'}`;
  grid.innerHTML=`<div class="wf-back"><button type="button" data-back>← All folders</button><span>${meta[open][2]}</span></div>`+(list.length?list.map(f=>`<article class="work-file-card"><div class="work-file-icon ${open}">${meta[open][0]}</div><div class="work-file-type">${meta[open][1]}</div><h3>${esc(f.name)}</h3><a class="work-file-link" href="${f.download_url||f.html_url}" target="_blank" rel="noopener">View / Download ↗</a></article>`).join(''):'<div class="work-file-empty">No files in this folder.</div>');
 }
}
function go(e){
 const f=e.target.closest('[data-folder]'),b=e.target.closest('[data-back]');
 if(f){open=f.dataset.folder;render();}else if(b){open=null;render();}
}
grid.addEventListener('click',go);
grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-folder]')){e.preventDefault();go(e);}});
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/documents?ref=${branch}`)
 .then(r=>r.ok?r.json():[])
 .then(a=>{files=Array.isArray(a)?a.filter(f=>f.type==='file'&&types.includes(ext(f.name))).sort((x,y)=>x.name.localeCompare(y.name)):[];render();})
 .catch(()=>{count.textContent='';grid.innerHTML='<div class="work-file-empty">Work samples are temporarily unavailable.</div>';});
})();
