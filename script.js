(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
var op=$('#opening'),seen=false;
try{seen=sessionStorage.getItem('peeyush-series')==='1'}catch(e){}
function closeOp(){if(!op)return;op.classList.add('out');document.body.classList.remove('lock');try{sessionStorage.setItem('peeyush-series','1')}catch(e){}setTimeout(function(){op.remove()},900)}
if(seen||matchMedia('(prefers-reduced-motion: reduce)').matches){op&&op.remove()}else{document.body.classList.add('lock');$('#op-play').onclick=closeOp;$('#op-skip').onclick=closeOp;document.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key==='Escape')closeOp()})}
var nav=$('#nav'),b=$('#burger'),l=$('#nav-links'),last=0;
addEventListener('scroll',function(){var y=scrollY;nav.classList.toggle('solid',y>40);nav.classList.toggle('hide',y>400&&y>last&&!l.classList.contains('open'));last=y},{passive:true});
b.onclick=function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)};
$$('#nav-links a').forEach(function(a){a.onclick=function(){l.classList.remove('open');b.setAttribute('aria-expanded',false)}});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');var u=e.target.querySelector&&e.target.querySelector('u');if(u&&e.target.dataset.level)u.style.width=e.target.dataset.level+'%';io.unobserve(e.target)}})},{threshold:.15});
$$('.reveal,.bar').forEach(function(el){io.observe(el)});
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
})();
