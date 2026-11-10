const $=id=>document.getElementById(id);
const rhymes='ac at ăc ăt âc ât oc ot ôc ôt ơt uc ut ưc'.split(' ');
const words=['bật lửa','lọ mực','cột mốc','hạt thóc','xúc xắc','gót chân','đôi mắt','lác đác','giấc mơ','quả ớt'];
const titles=['Khởi động phi thuyền','Kích hoạt ma trận Vần','Giải cứu ngôi sao TỪ','Huấn luyện ASTRO','Kết nối chòm sao','Thiên hà tỏa sáng'];
const sceneIntros=titles.map((title,i)=>'Mở đầu Màn '+(i+1)+' – '+title);
const cardArt=['ship','reader','starguide','astro','scope','award'];
const motionSafe=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
function animateIn(el,frames,duration=280){
 if(el&&motionSafe()&&el.animate)el.animate(frames,{duration,easing:'cubic-bezier(.2,.8,.2,1)'});
}
function celebrate(){
 const target=$('feedback');if(!target||!motionSafe())return;
 const burst=document.createElement('span');burst.className='burst';burst.setAttribute('aria-hidden','true');target.append(burst);
 for(let i=0;i<9;i++){const dot=document.createElement('i');dot.textContent='✦';burst.append(dot);dot.style.setProperty('--x',Math.cos(i*.7)*80+'px');dot.style.setProperty('--y',Math.sin(i*.7)*45-26+'px');dot.style.color=['#7856E8','#FF86B5','#FFD65A'][i%3]}
 burst.addEventListener('animationend',()=>burst.remove(),{once:true});
}
function gameTile(i,title,cls){
 const level=i+1;
 return '<button type="button" class="'+cls+' play-tile" aria-label="Màn 0'+level+' · '+title+'"><img src="img/level-'+level+'.webp" alt="" draggable="false">'+(level===3?'<span class="star-title">Giải cứu<br>ngôi sao TỪ</span>':'')+'</button>';
}

const prompts=['Khởi động phi thuyền rồi lắng nghe ASTRO. Khi tín hiệu kết thúc, em sẽ đến trạm ghép vần.','Chọn nguyên âm rồi chọn c hoặc t. Hãy đọc và so sánh hai vần cùng hàng.','Chạm vào một ngôi sao, đọc cả cụm từ rồi tìm tiếng chứa vần được hỏi.','Em hãy chọn từ có tiếng chứa vần phù hợp và đọc đúng để giúp ASTRO sửa lỗi nhé!','Đọc vần, tiếng và cụm từ, sau đó chọn mức tự đánh giá.','Em đã hoàn thành chuyến bay. Hãy nhớ đọc rõ âm cuối c và t nhé!'];
const vowels=[...'aăâoôơuư'];
const targets=[['ât',''],['','ưc'],['ôt','ôc'],['at','oc'],['uc','ăc'],['ot',''],['','ăt'],['ac','ac'],['âc',''],['','ơt']];
const launchLine='Các ngôi sao ngôn ngữ đang mất năng lượng! Các phi hành gia nhí hãy cùng mình đọc đúng vần và từ để thắp sáng thiên hà nhé!';
let state={stars:[],rating:'',trained:false};try{Object.assign(state,JSON.parse(localStorage.astroGalaxy||'{}'))}catch{}
let helpText=prompts[0],audio=null,voiceJob=0,timers=[],synth=null,scene=0,vowel='',end='',wordIndex=0,turn=0,reading='Đọc cá nhân',trainingIndex=0,returnScene=home;
const panel=$('panel'),body=$('body');
function save(){try{localStorage.astroGalaxy=JSON.stringify(state)}catch{}dashboard()}
function stop(){timers.forEach(clearTimeout);timers=[];voiceJob++;if(audio){audio.pause();URL.revokeObjectURL(audio.src);audio=null}window.speechSynthesis?.cancel()}
function show(html,kind){stop();panel.dataset.kind=kind;body.innerHTML=html;if(!panel.open)panel.showModal();panel.scrollTop=0;panel.dataset.scene=String(scene);
 const from=kind==='map'?'scale(.95)':scene===2?'translateY(15px) scale(.98)':scene===3?'translateX(20px)':'translateY(12px)';
 animateIn(body,[{opacity:.35,transform:from},{opacity:1,transform:'none'}],320)
}
function button(text,fn,cls='minor'){const b=document.createElement('button');b.textContent=text;b.className=cls;b.onclick=fn;return b}
function add(id,label,fn,cls){const b=button(label,fn,cls);$(id).append(b);return b}
function act(label,fn,cls){return add('actions',label,fn,cls)}
function later(fn,time){timers.push(setTimeout(fn,time))}
function tone(notes){try{synth??=new AudioContext();synth.resume().catch(()=>{});notes.forEach(([freq,delay,length])=>{const t=synth.currentTime+delay,o=synth.createOscillator(),g=synth.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.065,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.connect(g);g.connect(synth.destination);o.start(t);o.stop(t+length)})}catch{}}
async function play(key,line='',after,optional=false){const id=++voiceJob;if(audio){audio.pause();if(audio.src.startsWith('blob:'))URL.revokeObjectURL(audio.src);audio=null}window.speechSynthesis?.cancel();const file=await clip(key);if(id!==voiceJob)return;let ended=false;const complete=()=>{if(!ended&&id===voiceJob){ended=true;after?.()}};
 if(file){audio=new Audio(typeof file === 'string' ? file : URL.createObjectURL(file));audio.onended=complete;audio.onerror=()=>{feedback('Chưa phát được bản thu.');complete()};audio.play().catch(()=>{feedback('Chạm Nghe lại để phát bản thu.');complete()});return}
 const v=window.speechSynthesis?.getVoices().find(v=>v.lang.toLowerCase().startsWith('vi'));
 if(line&&v){const u=new SpeechSynthesisUtterance(line);u.lang='vi-VN';u.voice=v;u.rate=.92;u.onend=complete;u.onerror=complete;speechSynthesis.speak(u);return}
 if(line)later(complete,5400);else if(optional)complete();else feedback('Chưa có MP3 cho nội dung này. Cô có thể gắn đường dẫn trong am-thanh.js.')
}
function dashboard(){
 $('points').textContent=state.stars.length;$('progress').textContent=state.stars.length+' / 10 sao đã sáng';
 $('cards').innerHTML=titles.map((title,i)=>gameTile(i,title,'card')).join('');
 [...$('cards').children].forEach((b,i)=>b.onclick=()=>openScene(i))
}
function home(){panel.close();dashboard()}
function page(n,html,back,kind='lesson'){
 scene=n;helpText=prompts[n];returnScene=back;
 show('<div class="hud"><img src="img/'+cardArt[n]+'.webp" alt=""><span>✦ &nbsp; ASTRO MISSION</span><span>MÀN 0'+(n+1)+' / 06</span></div><h2>'+titles[n]+'</h2>'+html+'<p id="feedback" role="status"></p><div class="actions" id="actions"></div><footer><button id="mapBtn">⌖ Bản đồ</button><button id="ask">Hướng dẫn📗</button></footer>',kind);
 $('mapBtn').onclick=map;$('ask').onclick=()=>guide(back)
}
function openScene(n){
 [launch,startMatrix,stars,startTraining,challenge,finish][n]();
 if(n===0)return;
 const notes=[[0],[392,494],[440,659],[523,698],[587,784],[392,494,587,784]][n];
 tone(notes.map((hz,i)=>[hz,i*.13,.23]));
 play(sceneIntros[n],'',undefined,true);
}
function map(){show('<p class="kicker">BUỒNG LÁI · ASTRO MISSION</p><h2>Bản đồ nhiệm vụ</h2><img class="mapbanner" src="img/mission.webp" alt="Bé phi hành gia và ASTRO khám phá thiên hà Vần"><p>Nhận diện và đọc đúng vần có âm cuối <b>c, t</b>. Đọc từ và phân biệt những vần dễ nhầm.</p><div class="mapnodes" id="nodes"></div><div class="actions" id="actions"></div>','map');$('nodes').innerHTML=titles.map((s,i)=>gameTile(i,s,'node')).join('');[...$('nodes').children].forEach((b,i)=>b.onclick=()=>openScene(i));act('Kích hoạt ma trận Vần →',()=>openScene(1),'gold')}
function launch(){scene=0;show('<div class="flight"><div class="sky"></div><img class="ship" src="img/ship.webp" alt="Phi thuyền tiến vào thiên hà"><div class="comm"><img src="img/astro.webp" alt="Robot ASTRO"><div><p class="kicker">TÍN HIỆU TỪ ASTRO</p><h2>Khởi động phi thuyền</h2><p>'+launchLine+'</p></div></div></div><div class="actions" id="actions"></div>','launch');act('Đến trạm ghép vần',()=>openScene(1),'minor');tone([[260,0,.25],[390,.3,.28],[585,.63,.6]]);const narrate=()=>later(async()=>{const id=voiceJob;const greeting=await clip('Lời chào ASTRO');if(id!==voiceJob)return;const announce=()=>play('Thông báo mất năng lượng',launchLine,()=>openScene(1));if(greeting)play('Lời chào ASTRO','',announce);else announce()},1900);play(sceneIntros[0],'',narrate,true)}
const discovered = new Set();

function startMatrix() {
 discovered.clear();
 discovered.add('ac');
 vowel = '';
 end = '';
 matrix();
}

function matrix() {
 page(1, '<p>Chọn nguyên âm rồi chọn âm cuối để đưa vần vào bảng.</p><div class="split matrix-board"><div><h3>Ghép vần</h3><p class="label">Nguyên âm</p><div class="chips" id="vowels"></div><p class="label">Âm cuối</p><div class="chips" id="ends"></div><div class="result blend-box"><span>Vần vừa ghép</span><div id="result" aria-live="polite"></div></div></div><div><table><caption>Bảng vần</caption><thead><tr><td></td><th scope="col">c</th><th scope="col">t</th></tr></thead><tbody id="rows"></tbody></table></div></div>', matrix);
 const cells = new Map();
 function fillCell(key) {
  const cell = cells.get(key);
  if (!cell.firstChild) cell.append(button(key, () => {
   [vowel, end] = key;
   zoom();
  }, 'cell'));
 }
 function updateResult(transfer = false) {
  for (const b of document.querySelectorAll('#vowels button,#ends button')) {
   b.setAttribute('aria-pressed', String(b.textContent === vowel || b.textContent === end));
  }
  const source = $('result');
  source.replaceChildren();
  if (!vowel || !end) {
   source.textContent = vowel ? vowel + ' + …' : end ? '… + ' + end : '… + …';
   return;
  }
  const key = vowel + end;
  if (!rhymes.includes(key)) {
   source.textContent = 'Hai âm này chưa ghép thành vần trong bảng của bài. Em chọn lại nhé!';
   return;
  }
  const chip = button(key, zoom, 'bigterm blend-token');
  chip.setAttribute('aria-label', 'Phóng to vần ' + key);
  source.append(document.createTextNode(vowel + ' + ' + end + ' = '), chip);
  if (!transfer) return;
  tone([[487,0,.11],[640,.08,.16]]);
  discovered.add(key);
  const cell = cells.get(key);
  const board = cell.closest('.matrix-board');
  if (!motionSafe() || !chip.animate) { fillCell(key); return; }
  const from = chip.getBoundingClientRect(), to = cell.getBoundingClientRect(), area = board.getBoundingClientRect();
  const token = document.createElement('span');
  token.textContent = key;
  token.className = 'flying-rhyme';
  token.setAttribute('aria-hidden', 'true');
  token.style.left = from.left + from.width/2 - area.left + 'px';
  token.style.top = from.top + from.height/2 - area.top + 'px';
  board.append(token);
  const x = to.left + to.width/2 - from.left - from.width/2;
  const y = to.top + to.height/2 - from.top - from.height/2;
  const flight = token.animate([
   {transform:'translate(-50%, -50%) scale(.9)'},
   {transform:'translate(calc(-50% + '+x*.5+'px),calc(-50% + '+(y*.5-25)+'px)) scale(1.15)'},
   {transform:'translate(calc(-50% + '+x+'px),calc(-50% + '+y+'px)) scale(.78)'}
  ], {duration:720,easing:'ease-in-out'});
  const land = () => {
   token.remove();
   if (!cell.isConnected) return;
   fillCell(key);
   animateIn(cell.firstChild,[{transform:'scale(1.15)'},{transform:'scale(1)'}]);
  };
  flight.onfinish = land;
  flight.oncancel = land;
 }
 for (const v of vowels) add('vowels',v,()=>{vowel=v;end='';updateResult()},'chip');
 for (const e of ['c','t']) add('ends',e,()=>{end=e;updateResult(true)},'chip');
 for (const v of vowels) {
  const row = $('rows').insertRow();
  row.innerHTML = '<th scope="row">'+v+'</th>';
  for (const e of ['c','t']) {
   const key = v+e;
   cells.set(key,row.insertCell());
   if (discovered.has(key)) fillCell(key);
  }
 }
 updateResult();
 act('Đến ngôi sao TỪ →',()=>openScene(2),'gold');
}
function zoom(){
 const pair=['c','t'].map(e=>vowel+e).filter(key=>rhymes.includes(key));
 page(1,'<p>Đọc từng vần và lắng nghe âm cuối.</p><div class="compare" id="pair"></div>',zoom);
 for(const key of pair){
  const card=document.createElement('div');
  card.innerHTML='<strong>'+key[0]+'<em>'+key[1]+'</em></strong>';
  card.append(button('▶ Nghe '+key,()=>play(key),'minor'));
  $('pair').append(card);
 }
 act('Về bảng vần',matrix);
}
const foundParts=new Set();
function stars(){page(2,'<p>Chạm vào một ngôi sao để đọc và tìm vần. <b>'+state.stars.length+' / 10</b> sao đã sáng.</p><div class="starfield" id="sky"></div>',stars);words.forEach((w,i)=>{const b=add('sky',w,()=>{wordIndex=i;turn=0;foundParts.clear();word()},'wordstar'+(state.stars.includes(i)?' lit':''));b.innerHTML='<img src="img/starguide.webp" alt=""><span>'+w+'</span>';b.setAttribute('aria-label',w+(state.stars.includes(i)?', đã sáng':''))});act('Huấn luyện ASTRO →',()=>openScene(3),'gold')}
function word(){const w=words[wordIndex],parts=w.split(' '),ts=targets[wordIndex],steps=[...new Set(ts.filter(Boolean))],target=steps[turn],matches=ts.map(x=>x===target);
 page(2,'<div class="modebar" id="modes"></div><div class="readout"><img src="img/reader.webp" alt="Bé phi hành gia"><strong>'+parts.map((s,i)=>'<span data-part="'+i+'" class="'+(foundParts.has(i)?'found-part':'')+'">'+s+'</span>').join(' ')+'</strong></div><p id="readPrompt"></p><h3>Chạm vào tiếng chứa vần <em>'+target+'</em>.</h3><div class="chips" id="answers"></div>',word);
 function setMode(m){reading=m;$('readPrompt').textContent=m==='Đọc cá nhân'?'Em đọc từng tiếng, sau đó đọc liền cả cụm từ.':'Bạn thứ nhất đọc “'+parts[0]+'”, bạn thứ hai đọc “'+parts[1]+'”. Cả nhóm đọc lại “'+w+'”.';[...$('modes').children].forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===m)))}
 for(const m of ['Đọc cá nhân','Đọc nối tiếp'])add('modes',m,()=>setMode(m),'chip');setMode(reading);
 parts.forEach((s,i)=>add('answers',s,()=>{if(!matches[i])return feedback('Em nhìn lại tiếng có vần '+target+' nhé.');foundParts.add(i);body.querySelector('[data-part="'+i+'"]').classList.add('found-part');if(turn+1<steps.length){turn++;word();feedback('Đúng rồi! Bây giờ em tìm vần '+steps[turn]+'.');return}if(!state.stars.includes(wordIndex)){state.stars.push(wordIndex);save()}tone([[660,0,.3],[880,.2,.4]]);feedback((matches.every(Boolean)?'Cả hai tiếng đều chứa vần '+target+'. ':'Đúng rồi! ' )+'Ngôi sao “'+w+'” đã sáng.');celebrate();[...$('answers').children].forEach(b=>b.disabled=true);$('skyback').className='gold'},'choice'));
 act('Nghe bản thu',()=>play(w));act('Về bầu trời sao',stars).id='skyback'
}
const errors=[['đôi','mắc','mắt','ăt'],['hạt','thót','thóc','oc'],['lọ','mựt','mực','ưc']];
function startTraining(){
 trainingIndex=0;
 train();
}
function train(){const [a,wrong,right,r]=errors[trainingIndex];page(3,'<p>Lượt '+(trainingIndex+1)+' / 3</p><div class="robotline"><img src="img/astro.webp" alt="ASTRO"><div>ASTRO ghép nhầm <strong class="training-error">'+a+' '+wrong+'</strong>.<br>Em hãy chọn từ đúng và đọc mẫu để ASTRO học cách đọc và ghép từ chính xác nhé!<span style="white-space:nowrap">nhé! <button type="button" class="minor" aria-label="Nghe đọc đề" title="Nghe đọc đề" onclick="play(&quot;Đề Huấn luyện ASTRO&quot;)" style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;vertical-align:middle;border-radius:50%;font-size:22px">🔊</button></span></div></div><div class="chips" id="answers"></div>',train);
 const options = trainingIndex % 2 ? [right, wrong] : [wrong, right];
 for (const ending of options) {
  const phrase = a+' '+ending;
  const incorrect = ending === wrong;
  add('answers',phrase,()=>{
   if (incorrect) {
    feedback('Em nhìn lại phần vần và âm cuối nhé.');
    return;
   }
   tone([[523,0,.14],[698,.11,.2]]);
   const dialog=document.createElement('dialog');
   dialog.className='answer-popup';
   dialog.setAttribute('aria-labelledby','correctPhrase');
   dialog.innerHTML='<p>Đúng rồi!</p><strong id="correctPhrase">'+phrase+'</strong><div class="popup-actions"></div>';
   body.append(dialog);

// =========
const phraseText = dialog.querySelector('#correctPhrase');
const phraseRow = document.createElement('div');
phraseRow.style.cssText =
  'display:flex; align-items:center; justify-content:center; gap:10px;';

const speaker = button('🔊', () => play(phrase), 'minor');
speaker.type = 'button';
speaker.title = 'Nghe ' + phrase;
speaker.setAttribute('aria-label', 'Nghe phát âm ' + phrase);
speaker.style.cssText =
  'flex:none; width:44px; height:44px; padding:0; border-radius:50%; font-size:22px;';
//============================


phraseText.replaceWith(phraseRow);
phraseRow.append(phraseText, speaker);

   const actions=dialog.querySelector('.popup-actions');
//    actions.append(button('Thử lại',()=>{dialog.close();train()}));
   const last=trainingIndex===errors.length-1;
   actions.append(button(last?'Kết nối chòm sao':'Lượt tiếp theo',()=>{
    dialog.close();
    if(last){state.trained=true;save();openScene(4)}
    else{trainingIndex++;train()}
   }));
   dialog.addEventListener('close',()=>dialog.remove(),{once:true});
   dialog.showModal();
  },'choice training-choice');
 }
}
function challenge(){page(4,'<p>Em đọc mỗi cụm dưới đây theo thứ tự từ vần đến tiếng, rồi đến từ.</p><div class="chains">'+[['ăt','mắt','đôi mắt'],['oc','thóc','hạt thóc'],['ăc','xắc','xúc xắc']].map(row=>'<div>'+row.map(s=>'<b>'+s+'</b>').join('<i>✦</i>')+'</div>').join('')+'</div><h3>Em đọc thế nào?</h3><div id="ratings" class="chips"></div>',challenge);
 const next=act('Trở về phi thuyền →',()=>openScene(5),'gold');next.disabled=!state.rating;const select=m=>{state.rating=m;save();[...$('ratings').children].forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===m)));next.disabled=false;feedback('Em đã chọn “'+m+'”.')};
 ['Đọc tốt','Cần luyện thêm','Cần cô hỗ trợ'].forEach(m=>add('ratings',m,()=>select(m),'chip'));if(state.rating)select(state.rating)
}
function finish(){page(5,'<div class="finalsky"><svg class="constellation" viewBox="0 0 500 90" aria-label="Hai chòm sao đang tỏa sáng"><path d="M15 60 51 23 97 44 135 12 165 48 M292 48 333 18 385 39 432 13 479 50"/>'.concat([[15,60],[51,23],[97,44],[135,12],[165,48],[292,48],[333,18],[385,39],[432,13],[479,50]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="4"/>').join(''))+'</svg><div class="medal"><img src="img/astro.webp" alt="ASTRO"><img src="img/award.webp" alt="Huy hiệu phi hành gia đọc vần"></div></div><h3>ASTRO tặng em huy hiệu Phi hành gia đọc vần!</h3><p>Chuyến bay đã về đích. Em đã thắp sáng '+state.stars.length+' / 10 ngôi sao Từ. '+(state.rating?'Mức em tự chọn: <b>'+state.rating+'</b>.':'')+'</p>',finish,'final');act('Kết thúc',home,'gold');act('Luyện tiếp',map);act('Chuyến bay mới',()=>{state={stars:[],rating:'',trained:false};vowel=end='';save();launch()})}
$('close').onclick=home;panel.onclose=stop;$('start').onclick=launch;$('help').onclick=()=>{helpText=prompts[0];guide(home)};$('scores').onclick=()=>openScene(2);window.speechSynthesis?.getVoices();dashboard();

const expand=$('expand');
expand.hidden=!document.fullscreenEnabled;
expand.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{expand.hidden=true}};
document.addEventListener('fullscreenchange',()=>{const label=document.fullscreenElement?'Thu nhỏ màn hình':'Toàn màn hình';expand.title=label;expand.setAttribute('aria-label',label)});
