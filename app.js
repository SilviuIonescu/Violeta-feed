const feed=document.getElementById('feed');
const modal=document.getElementById('modal');
const inner=document.getElementById('modalInner');
const toast=document.getElementById('toast');
const packMeta=document.getElementById('packMeta');
const downloadBtn=document.getElementById('downloadFeed');
const overlay=document.getElementById('downloadOverlay');
const progress=document.getElementById('downloadProgress');
const count=document.getElementById('downloadCount');
const message=document.getElementById('downloadMessage');
const progressBar=document.getElementById('progressBar');
let pack=Number(localStorage.getItem('violetaPackIndex')||0)%2;
let saved=new Set(JSON.parse(localStorage.getItem('violetaSaved')||'[]'));
let currentCard=0;

const packB=[
 ['🌍 A wider view','WORLD · 25 sec','The Quiet Global Shift That Could Change Everyday Life','A slow-moving change is already reshaping how people work, travel and spend.'],
 ['🤖 Worth understanding','AI · 25 sec','AI Is Becoming Less Like a Tool—and More Like a Colleague','The biggest change may not be smarter software, but how naturally it joins daily work.'],
 ['🇮🇹 Around you','ITALY · 25 sec','Why Southern Evenings Feel Longer Than the Clock Says','Heat, light and social rhythm quietly stretch the day.'],
 ['🎭 Tonight’s idea','CULTURE · 25 sec','A Small Performance Can Stay With You Longer Than a Blockbuster','Intimacy often creates more memory than spectacle.'],
 ['🍋 Taste nearby','FOOD · 25 sec','The Ingredient Puglia Treats Like a Main Character','Simple cooking works when one ingredient is allowed to lead.'],
 ['🧠 A useful thought','PSYCHOLOGY · 25 sec','Why Anticipation Can Feel Better Than the Event Itself','The mind enjoys possibility before reality narrows it down.'],
 ['🚶 Slow discovery','WALK · 25 sec','The Best Part of a Town May Begin Where the Guide Stops','A wrong turn is sometimes the real itinerary.'],
 ['📚 One good idea','BOOKS · 25 sec','The Book That Explains Why We Remember Stories, Not Lists','Meaning gives memory somewhere to attach.'],
 ['🎬 No-scroll pick','STREAMING · 25 sec','Tonight’s Pick: Something Smart Without Feeling Heavy','A compact story for an evening with limited energy.'],
 ['🌿 Reset','WELLBEING · 25 sec','Doing Nothing Is Harder—and More Useful—Than It Looks','Rest becomes effective only when it stops being another task.'],
 ['🔭 Small wonder','SCIENCE · 25 sec','The Night Sky Is Showing You the Past in Real Time','Every point of light arrives from a different moment.'],
 ['🐦 Unexpected intelligence','NATURE · 25 sec','Crows Remember Faces—and Tell Their Friends','Intelligence evolved in forms very different from our own.']
];

function showToast(text){toast.textContent=text;toast.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>toast.classList.remove('show'),2200)}
function cardInfo(card){return{reason:card.querySelector('.reason').textContent,category:card.querySelector('.category').textContent,title:card.querySelector('h2').textContent,hook:card.querySelector('.hook').textContent,image:card.querySelector('.hero').style.backgroundImage}}
function bind(){
 [...feed.querySelectorAll('.story-card')].forEach((card,i)=>{
  card.dataset.id=i;
  card.onclick=e=>{if(!e.target.closest('button'))openCard(i)};
  card.querySelectorAll('[data-open]').forEach(b=>b.onclick=e=>{e.stopPropagation();openCard(i)});
  card.querySelector('.save').onclick=e=>{e.stopPropagation();saved.has(i)?saved.delete(i):saved.add(i);e.currentTarget.textContent=saved.has(i)?'♥':'♡';localStorage.setItem('violetaSaved',JSON.stringify([...saved]));showToast(saved.has(i)?'Saved for offline reading':'Removed from Saved')};
  card.querySelector('.like').onclick=e=>{e.stopPropagation();e.currentTarget.classList.toggle('on');e.currentTarget.firstChild.textContent=e.currentTarget.classList.contains('on')?'♥':'♡'};
  card.querySelector('.share').onclick=e=>{e.stopPropagation();share(cardInfo(card))};
  card.querySelector('.save').textContent=saved.has(i)?'♥':'♡';
 });
}
function openCard(i){
 currentCard=i;const c=cardInfo(feed.querySelectorAll('.story-card')[i]);
 inner.innerHTML=`<div class="modal-hero" style="background-image:${c.image}"><div class="modal-gradient"></div><h1 class="modal-title">${c.title}</h1></div><div class="modal-content"><div class="category">${c.category}</div><div class="modal-hook">${c.hook}</div><div class="summary-label">AI SUMMARY</div><p class="modal-summary">This story was selected because it matches Violeta’s interests, current mood and location. The key idea is simple: ${c.hook}</p><div class="summary-label">THE 2-MINUTE VERSION</div><div class="modal-sections"><section class="modal-section"><h3>What matters</h3><p>${c.title} is less about one isolated fact and more about the change behind it.</p></section><section class="modal-section"><h3>Why it was selected</h3><p>It is timely, easy to understand and likely to create a useful conversation rather than more noise.</p></section><section class="modal-section"><h3>What to notice next</h3><p>Look for what changes in everyday life—not only in headlines.</p></section></div><div class="modal-actions"><button class="modal-like">♡ <span>Like</span></button><button class="modal-share">↗ <span>Share</span></button></div><a class="source-link" href="https://news.google.com" target="_blank" rel="noopener">Navigate to original story ↗<small>Public source</small></a><div class="summary-label">AI REACTIONS</div><div class="modal-comments"><div class="mini-comment"><div class="avatar">P</div><div><strong>Practical AI</strong><span>Useful when it helps you decide what matters next.</span></div></div><div class="mini-comment"><div class="avatar">S</div><div><strong>Skeptic AI</strong><span>The headline is only the beginning; context still matters.</span></div></div><div class="mini-comment"><div class="avatar">F</div><div><strong>Friend AI</strong><span>This one sounds worth discussing over coffee.</span></div></div></div></div>`;
 modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';modal.scrollTop=0;
 inner.querySelector('.modal-like').onclick=e=>{e.currentTarget.classList.toggle('on');e.currentTarget.firstChild.textContent=e.currentTarget.classList.contains('on')?'♥':'♡'};
 inner.querySelector('.modal-share').onclick=()=>share(c);
}
function closeCard(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
function share(c){if(navigator.share)navigator.share({title:c.title,text:c.hook,url:location.href}).catch(()=>{});else{navigator.clipboard?.writeText(c.title+' — '+location.href);showToast('Story link copied')}}
function applyPack(){
 const cards=[...feed.querySelectorAll('.story-card')];
 cards.forEach((card,i)=>{
  if(pack===0)return;
  const d=packB[i];card.querySelector('.reason').textContent=d[0];card.querySelector('.category').textContent=d[1];card.querySelector('h2').textContent=d[2];card.querySelector('.hook').textContent=d[3];card.querySelector('.hero').style.backgroundImage=`url('https://picsum.photos/seed/violeta-b-${i+1}/1200/900')`;
 });
 packMeta.textContent=`Pack ${pack?'B':'A'} · available offline`;
}
async function downloadFeed(){
 if(overlay.classList.contains('open'))return;overlay.classList.add('open');downloadBtn.disabled=true;progress.style.width='0%';count.textContent='0 / 12 stories';message.textContent='Selecting 12 stories for your interests…';
 for(let i=1;i<=12;i++){await new Promise(r=>setTimeout(r,110));progress.style.width=(i/12*100)+'%';count.textContent=i+' / 12 stories';if(i===5)message.textContent='Saving images and summaries…';if(i===10)message.textContent='Finalising your offline pack…'}
 pack=pack?0:1;localStorage.setItem('violetaPackIndex',pack);location.reload();
}

downloadBtn.onclick=downloadFeed;document.getElementById('close').onclick=closeCard;
modal.addEventListener('scroll',()=>{const max=modal.scrollHeight-modal.clientHeight;progressBar.style.width=(max?modal.scrollTop/max*100:0)+'%'},{passive:true});
let sy=0,sx=0;modal.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;sx=e.touches[0].clientX},{passive:true});modal.addEventListener('touchend',e=>{const dy=e.changedTouches[0].clientY-sy,dx=e.changedTouches[0].clientX-sx;if(dy>120)closeCard();else if(Math.abs(dx)>90)openCard((currentCard+(dx<0?1:-1)+12)%12)},{passive:true});
const nav=[...document.querySelectorAll('.nav button')];nav.find(x=>x.textContent.includes('Offline')).onclick=downloadFeed;nav.find(x=>x.textContent.includes('Saved')).onclick=()=>{[...feed.querySelectorAll('.story-card')].forEach((c,i)=>c.classList.toggle('hidden',!saved.has(i)));showToast(saved.size?`${saved.size} saved stories`:'You have not saved anything yet')};nav.find(x=>x.textContent.includes('Feed')).onclick=()=>{[...feed.querySelectorAll('.story-card')].forEach(c=>c.classList.remove('hidden'));showToast('Back to your full feed')};
applyPack();bind();