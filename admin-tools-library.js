/* Admin manager for the public PJ Tools Knowledge Library. Uses the GitHub Contents API. */
(function () {
  const FILE = 'pj-tools-library.json';
  const mount = document.querySelector('.admin-card');
  if (!mount) return;
  const wrap = document.createElement('section');
  wrap.id = 'admin-tools-library';
  wrap.style.cssText = 'margin-top:34px;padding-top:24px;border-top:1px solid #ffffff24';
  wrap.innerHTML = `
    <h2 style="margin:0 0 6px">Tools & Knowledge Manager</h2>
    <p class="admin-intro">Manage formulas, AutoCAD commands, MS Word tips and custom sections. Published entries appear in the public Tools Hub. Existing site fonts and design are not changed.</p>
    <div class="security-note"><b>Publishing:</b> A GitHub token with repository Contents read/write access is required. Token is used in this tab only and is not stored by this manager.</div>
    <label for="lib-token">GitHub token for Tools Library</label><input id="lib-token" type="password" autocomplete="off" placeholder="Paste a fine-grained token (Contents: Read and write)">
    <div class="admin-two"><div><label for="lib-owner">Repository owner</label><input id="lib-owner" value="peeyush-jangid"></div><div><label for="lib-repo">Repository</label><input id="lib-repo" value="peeyush-jangid.github.io"></div></div>
    <label for="lib-branch">Branch</label><input id="lib-branch" value="main">
    <div class="admin-two"><div><label for="lib-category">Section</label><select id="lib-category" style="width:100%;box-sizing:border-box;border:1px solid #34465c;border-radius:9px;background:#071321;color:white;padding:13px;font:inherit"><option>Formula</option><option>AutoCAD</option><option>MS Word</option><option>Excel</option><option>HVAC</option><option>Other</option></select></div><div><label for="lib-custom-category">Custom section (optional)</label><input id="lib-custom-category" placeholder="e.g. Electrical"></div></div>
    <label for="lib-title">Title / command / formula name</label><input id="lib-title" placeholder="e.g. Duct Area Calculation or OFFSET">
    <label for="lib-content">Formula / command / shortcut</label><textarea id="lib-content" rows="3" placeholder="Paste formula, command, shortcut or steps" style="width:100%;box-sizing:border-box;border:1px solid #34465c;border-radius:9px;background:#071321;color:white;padding:13px;font:inherit"></textarea>
    <label for="lib-description">Description</label><textarea id="lib-description" rows="2" placeholder="What it does / where to use it" style="width:100%;box-sizing:border-box;border:1px solid #34465c;border-radius:9px;background:#071321;color:white;padding:13px;font:inherit"></textarea>
    <label for="lib-example">Example (optional)</label><textarea id="lib-example" rows="2" placeholder="Example input or use case" style="width:100%;box-sizing:border-box;border:1px solid #34465c;border-radius:9px;background:#071321;color:white;padding:13px;font:inherit"></textarea>
    <div style="display:flex;flex-wrap:wrap;gap:8px"><button id="lib-save" class="admin-button" type="button" style="flex:1;min-width:150px">Publish Entry ↗</button><button id="lib-cancel" class="admin-refresh" type="button" style="display:none;margin-top:22px">Cancel edit</button><button id="lib-load" class="admin-refresh" type="button" style="margin-top:22px">Load / Refresh Library</button></div>
    <div id="lib-status" class="admin-status" aria-live="polite"></div>
    <div class="admin-list-head"><h2>Published Library Entries</h2><span id="lib-count" class="admin-files"></span></div><div id="lib-items" class="admin-files">Enter token and load entries.</div>`;
  mount.appendChild(wrap);
  const $ = id => wrap.querySelector('#'+id);
  let items = [], sha = '', editing = null;
  const say = (s, good=false) => { $('lib-status').textContent=s; $('lib-status').style.color=good?'#9fdb9e':'#d9bd7b'; };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function creds() { return {token:$('lib-token').value.trim(), owner:$('lib-owner').value.trim(), repo:$('lib-repo').value.trim(), branch:$('lib-branch').value.trim()}; }
  function endpoint(c) { return `https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${FILE}`; }
  async function fetchRepoFile() {
    const c=creds(); if(!c.token) throw new Error('Paste GitHub token first.');
    const res=await fetch(endpoint(c),{headers:{Authorization:`Bearer ${c.token}`,Accept:'application/vnd.github+json'}});
    if(res.status===404){sha='';items=[];render();return;}
    if(!res.ok) throw new Error(`GitHub read failed (${res.status}). Check token, repository and permissions.`);
    const file=await res.json(); sha=file.sha;
    const raw=new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\n/g,'')),ch=>ch.charCodeAt(0)));
    const data=JSON.parse(raw); items=Array.isArray(data.items)?data.items:[]; render(); say('Library loaded successfully.',true);
  }
  async function saveRepoFile() {
    const c=creds(); if(!c.token) throw new Error('Paste GitHub token first.');
    const json=JSON.stringify({items},null,2); const bytes=new TextEncoder().encode(json); let binary=''; bytes.forEach(b=>binary+=String.fromCharCode(b)); const content=btoa(binary);
    const payload={message:'Update PJ Tools knowledge library',content,branch:c.branch}; if(sha) payload.sha=sha;
    const res=await fetch(endpoint(c),{method:'PUT',headers:{Authorization:`Bearer ${c.token}`,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err.message||`Publish failed (${res.status}).`)}
    const result=await res.json();sha=result.content?.sha||sha;
  }
  function render() {
    $('lib-count').textContent=`${items.length} entries`;
    if(!items.length){$('lib-items').innerHTML='<p>No entries published yet.</p>';return;}
    $('lib-items').innerHTML=items.map((x,i)=>`<div class="admin-file" style="align-items:center"><div><b>${esc(x.title)}</b><div style="opacity:.7;margin-top:4px">${esc(x.category)} · ${esc(x.content)}</div>${x.description?`<div style="opacity:.65;margin-top:4px">${esc(x.description)}</div>`:''}</div><div style="display:flex;gap:8px;flex-shrink:0"><button type="button" data-edit="${i}" class="admin-refresh">Edit</button><button type="button" data-delete="${i}" class="admin-refresh">Delete</button></div></div>`).join('');
    $('lib-items').querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.edit,x=items[i];editing=i;$('lib-category').value=x.category||'Other';$('lib-custom-category').value=['Formula','AutoCAD','MS Word','Excel','HVAC','Other'].includes(x.category)?'':x.category;$('lib-title').value=x.title||'';$('lib-content').value=x.content||'';$('lib-description').value=x.description||'';$('lib-example').value=x.example||'';$('lib-save').textContent='Update Entry ↗';$('lib-cancel').style.display='inline-block';window.scrollTo({top:wrap.offsetTop+window.scrollY-50,behavior:'smooth'}); }));
    $('lib-items').querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',async()=>{const i=+b.dataset.delete;if(!confirm(`Delete “${items[i].title}” from public library?`))return;items.splice(i,1);render();say('Publishing deletion…');try{await saveRepoFile();say('Deleted and published successfully.',true);}catch(e){say(e.message);}}));
  }
  function clearForm(){editing=null;$('lib-title').value='';$('lib-content').value='';$('lib-description').value='';$('lib-example').value='';$('lib-custom-category').value='';$('lib-category').value='Formula';$('lib-save').textContent='Publish Entry ↗';$('lib-cancel').style.display='none';}
  $('lib-save').addEventListener('click',async()=>{const title=$('lib-title').value.trim(),content=$('lib-content').value.trim();if(!title||!content){say('Please enter a title and formula / command / content.');return;}const category=$('lib-custom-category').value.trim()||$('lib-category').value;const record={id:editing===null?(crypto.randomUUID?.()||String(Date.now())):items[editing].id,category,title,content,description:$('lib-description').value.trim(),example:$('lib-example').value.trim(),updatedAt:new Date().toISOString()};if(editing===null)items.unshift(record);else items[editing]=record;render();say('Publishing…');try{await saveRepoFile();say('Published! Refresh your public Tools Hub after GitHub Pages updates.',true);clearForm();}catch(e){say(e.message);}});
  $('lib-cancel').addEventListener('click',clearForm);
  $('lib-load').addEventListener('click',async()=>{say('Loading…');try{await fetchRepoFile();}catch(e){say(e.message);}});
  render();
})();
