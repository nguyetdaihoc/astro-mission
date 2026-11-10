async function clip(key){return window.ASTRO_MP3?.[key]?.trim() || null}
function feedback(text){if($('feedback'))$('feedback').textContent=text}
function guide(back=home){
 show('<p class="kicker">TRỢ LÝ PHI HÀNH</p><h2>Hỏi ASTRO</h2><div class="stage"><img src="img/astro.webp" alt="Robot ASTRO"><p>'+helpText+'</p></div><div class="actions" id="actions"></div>','guide');
 act('Quay lại',back,'gold');
}
