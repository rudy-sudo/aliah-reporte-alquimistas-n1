
const d=window.reportData;
const fontColor='#6f6b66';
const gridColor='#00000010';
new Chart(document.getElementById('funnelChart'),{type:'bar',data:{labels:['Inscritos','Evaluados','Sprint 1','Sprint 2'],datasets:[{label:'Participación',data:[d.roster,d.evaluated,d.s1,d.s2],backgroundColor:['#d8d2c7','#321c72','#7d62d3','#d69422'],borderRadius:14}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:fontColor},grid:{display:false}},y:{ticks:{color:fontColor},grid:{color:gridColor},beginAtZero:true}}}});
new Chart(document.getElementById('scoreChart'),{type:'radar',data:{labels:['Sprint 1','Sprint 2','Sprint 3','Sprint 4'],datasets:[{label:'Score /4',data:[d.s1Avg,d.s2Avg,0,0],backgroundColor:'#321c7226',borderColor:'#321c72',pointBackgroundColor:'#d69422'}]},options:{plugins:{legend:{display:false}},scales:{r:{min:0,max:4,ticks:{color:fontColor,backdropColor:'transparent'},grid:{color:gridColor},angleLines:{color:gridColor},pointLabels:{color:'#151515'}}}}});
new Chart(document.getElementById('maturityChart'),{type:'doughnut',data:{labels:d.maturityLabels,datasets:[{data:d.maturityValues,backgroundColor:['#321c72','#7d62d3','#d69422','#628a48','#b36b6b','#d8d2c7']}]},options:{plugins:{legend:{position:'bottom',labels:{color:fontColor}}}}});
new Chart(document.getElementById('industryChart'),{type:'bar',data:{labels:d.industryLabels,datasets:[{data:d.industryValues,backgroundColor:'#321c72',borderRadius:10}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{color:fontColor},grid:{color:gridColor}},y:{ticks:{color:fontColor},grid:{display:false}}}}});
const modal=document.getElementById('studentModal');
const modalContent=document.getElementById('studentModalContent');
const modalClose=document.getElementById('modalClose');
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const list=items=>(items&&items.length?items:['Sin datos suficientes.']).map(item=>`<li>${escapeHtml(item)}</li>`).join('');
function scoreLevel(score){
  const value=Number(score||0);
  if(value>=3.5)return ['Destacado','level-high'];
  if(value>=2.5)return ['Competente','level-mid'];
  if(value>=1.5)return ['En desarrollo','level-low'];
  return ['Emergente','level-base'];
}
function domainScale(score){
  const value=Math.max(0,Math.min(4,Number(score||0)));
  const [label,cls]=scoreLevel(value);
  const left=value/4*100;
  return `<div class="domain-scale modal-domain" aria-label="Score ${value.toFixed(2)} de 4, nivel ${escapeHtml(label)}">
    <div class="domain-track"><span></span><span></span><span></span><span></span><i style="left:${left}%"></i></div>
    <div class="domain-labels"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div>
    <p class="domain-note"><b class="${cls}">${escapeHtml(label)}</b></p>
  </div>`;
}
function openStudent(id){
  const student=(d.students||[]).find(item=>item.studentId===id);
  if(!student)return;
  modalContent.innerHTML=`
    <div class="modal-hero">
      <div class="person"><span>${escapeHtml(student.initials)}</span><div><p class="eyebrow">Reporte individual</p><h2 id="studentModalTitle">${escapeHtml(student.fullName)}</h2><small>${escapeHtml(student.maturity)}</small></div></div>
      <div class="modal-summary">
        <article><small>Promedio de sprints evaluados</small><b>${Number(student.avgSubmitted||0).toFixed(2)}/4</b></article>
        <article><small>programScore</small><b>${Number(student.programScore||0).toFixed(2)}/4</b></article>
        <article><small>Industria síntesis</small><b>${escapeHtml(student.summaryIndustry)}</b></article>
      </div>
    </div>
    <div class="modal-body">
      ${(student.sprints||[]).map(sprint=>`
        <article class="modal-sprint">
          <div class="modal-sprint-head"><div><p class="eyebrow">Sprint ${sprint.sprint}</p><h3>${escapeHtml(sprint.profession)}</h3></div><span class="modal-sprint-score">${Number(sprint.score||0).toFixed(2)}/4</span></div>
          ${domainScale(sprint.score)}
          <div class="modal-ai-grid">
            <p><b>Propósito detectado</b>${escapeHtml(sprint.purpose)}</p>
            <p><b>Logro esperado</b>${escapeHtml(sprint.achievement)}</p>
            <p><b>Industria</b>${escapeHtml(sprint.industry)}</p>
            <p><b>Lectura</b>Esta información corresponde a la entrega evaluada de este sprint.</p>
          </div>
          <div class="rubric-explain">
            <h4>Cómo se evaluó esta misión</h4>
            <p>El score integra la calidad de la entrega frente a la misión del sprint: claridad del objetivo, contexto entregado al modelo, estructura del prompt o solución, aplicabilidad profesional, evidencia de resultado y oportunidad de mejora. El desglose numérico por criterio se incorporará como rúbrica estructurada en la siguiente versión del sistema.</p>
          </div>
          <div class="modal-lists">
            <div><h4>Evidencia observada</h4><ul>${list(sprint.evidence)}</ul></div>
            <div><h4>Por qué suma al score</h4><ul>${list(sprint.strengths)}</ul></div>
            <div><h4>Qué faltó para subir de nivel</h4><ul>${list(sprint.recommendations)}</ul></div>
          </div>
        </article>
      `).join('')}
    </div>`;
  document.body.classList.add('modal-open');
  modal.setAttribute('aria-hidden','false');
}
function closeStudent(){document.body.classList.remove('modal-open');modal.setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-student]').forEach(button=>button.addEventListener('click',()=>openStudent(button.dataset.student)));
modalClose?.addEventListener('click',closeStudent);
modal?.addEventListener('click',event=>{if(event.target===modal)closeStudent()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeStudent()});
