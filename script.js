// Scroll reveal
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Work Showcase: reads the list kept by admin.html (work-files.js).
// Tries common global names; adjust here if your work-files.js uses a different one.
(function(){
  const box=document.getElementById('work-list');if(!box)return;
  const src=window.WORK_FILES||window.workFiles||window.WORK_SHOWCASE||window.workShowcase||window.FILES||[];
  const list=Array.isArray(src)?src:(src.files||[]);
  if(!list.length)return; // keeps the "Coming soon" placeholder
  box.innerHTML='';
  list.forEach(f=>{
    const url=f.path||f.url||f.href||(f.name?'documents/'+encodeURIComponent(f.name):'#');
    const name=f.title||f.name||url.split('/').pop();
    const ext=(f.type||name.split('.').pop()||'file').toUpperCase();
    const a=document.createElement('a');a.className='card';a.href=url;a.setAttribute('download','');
    a.innerHTML='<span class="badge"></span><h3 style="margin-top:14px"></h3><p></p><p style="color:var(--deep);font-weight:500;opacity:1;margin-top:18px">Download ↓</p>';
    a.querySelector('.badge').textContent=ext;a.querySelector('h3').textContent=name;a.querySelector('p').textContent=f.description||f.note||'';
    box.appendChild(a);
  });
})();
