
const d=window.reportData;
const fontColor='#6f6b66';
const gridColor='#00000010';
new Chart(document.getElementById('funnelChart'),{type:'bar',data:{labels:['Inscritos','Evaluados','Sprint 1','Sprint 2'],datasets:[{label:'Participación',data:[d.roster,d.evaluated,d.s1,d.s2],backgroundColor:['#d8d2c7','#321c72','#7d62d3','#d69422'],borderRadius:14}]},options:{plugins:{legend:{display:false}},scales:{x:{ticks:{color:fontColor},grid:{display:false}},y:{ticks:{color:fontColor},grid:{color:gridColor},beginAtZero:true}}}});
new Chart(document.getElementById('scoreChart'),{type:'radar',data:{labels:['Sprint 1','Sprint 2','Sprint 3','Sprint 4'],datasets:[{label:'Dominio técnico /4',data:[d.s1Avg,d.s2Avg,0,0],backgroundColor:'#321c7226',borderColor:'#321c72',pointBackgroundColor:'#d69422'}]},options:{plugins:{legend:{display:false}},scales:{r:{min:0,max:4,ticks:{color:fontColor,backdropColor:'transparent'},grid:{color:gridColor},angleLines:{color:gridColor},pointLabels:{color:'#151515'}}}}});
new Chart(document.getElementById('maturityChart'),{type:'doughnut',data:{labels:d.maturityLabels,datasets:[{data:d.maturityValues,backgroundColor:['#321c72','#7d62d3','#d69422','#628a48','#b36b6b','#d8d2c7']}]},options:{plugins:{legend:{position:'bottom',labels:{color:fontColor}}}}});
new Chart(document.getElementById('optimizationChart'),{type:'bar',data:{labels:d.optimizationLabels,datasets:[{data:d.optimizationValues,backgroundColor:'#321c72',borderRadius:10}]},options:{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{color:fontColor},grid:{color:gridColor}},y:{ticks:{color:fontColor},grid:{display:false}}}}});
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
function championLevel(signal){
  const level=String(signal?.level||'sin_evidencia').toLowerCase();
  if(level==='alto')return ['Alto','champion-high'];
  if(level==='medio')return ['Medio','champion-mid'];
  if(level==='bajo')return ['Bajo','champion-low'];
  return ['Por confirmar','champion-pending'];
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
function rubricTable(sprint){
  const rows=sprint.rubricBreakdown||[];
  if(!rows.length){
    return `<div class="rubric-explain rubric-pending"><h4>Criterios evaluados en esta misión</h4><p>La misión ya tiene score global, evidencia y recomendaciones. El desglose numérico por criterio se generará en la siguiente corrida de enriquecimiento de rúbrica.</p></div>`;
  }
  return `<div class="rubric-table-wrap">
    <div class="rubric-table-head"><div><h4>Criterios evaluados en esta misión</h4><p>${escapeHtml(sprint.rubricSummary||'Score calculado con los criterios aplicables a la entrega del sprint.')}</p></div><b>${Number(sprint.score||0).toFixed(2)}/4</b></div>
    <table class="rubric-table">
      <thead><tr><th>Criterio</th><th>Score</th><th>Nivel</th><th>Evidencia</th><th>Para subir</th></tr></thead>
      <tbody>${rows.map(row=>{
        const [label,cls]=scoreLevel(row.score);
        return `<tr><td><b>${escapeHtml(row.criterion)}</b></td><td><span class="score-mini">${Number(row.score||0).toFixed(1)}/4</span></td><td><span class="pill ${cls}">${escapeHtml(row.level||label)}</span></td><td>${escapeHtml(row.evidence)}</td><td>${escapeHtml(row.improvement)}</td></tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
}
function championPanel(signal){
  const [label,cls]=championLevel(signal);
  const evidence=signal?.evidence||{};
  const meta=String(evidence.metacognitionQuality||'').trim();
  const metaHtml=meta?`<span><b>Metacognición</b>${escapeHtml(meta)}</span>`:'';
  return `<div class="champion-panel">
    <div class="champion-panel-head"><h4>Potencial champion</h4><span class="pill ${cls}">${escapeHtml(label)}</span></div>
    <p>Esta señal no modifica el dominio técnico. Sirve para identificar potencial de adopción interna a partir de la evidencia disponible.</p>
    <ul>${list(signal?.reasons||[])}</ul>
    <div class="champion-evidence">
      <span><b>Dominio</b>${escapeHtml(evidence.technicalPerformance||'Sin datos')}</span>
      ${metaHtml}
      <span><b>Aplicación</b>${escapeHtml(evidence.workApplication||'Por confirmar')}</span>
      <span><b>Consistencia</b>${escapeHtml(evidence.consistency||'Por confirmar')}</span>
    </div>
  </div>`;
}
function openStudent(id){
  const student=(d.students||[]).find(item=>item.studentId===id);
  if(!student)return;
  const [championLabel,championCls]=championLevel(student.championSummary||{});
  modalContent.innerHTML=`
    <div class="modal-hero">
      <div class="person"><span>${escapeHtml(student.initials)}</span><div><p class="eyebrow">Reporte individual</p><h2 id="studentModalTitle">${escapeHtml(student.fullName)}</h2><small>${escapeHtml(student.maturity)}</small></div></div>
      <div class="modal-summary">
        <article><small>Promedio de dominio técnico</small><b>${Number(student.avgSubmitted||0).toFixed(2)}/4</b></article>
        <article><small>programScore técnico</small><b>${Number(student.programScore||0).toFixed(2)}/4</b></article>
        <article><small>Potencial champion</small><b><span class="pill ${championCls}">${escapeHtml(championLabel)}</span></b></article>
        <article><small>Área de optimización</small><b>${escapeHtml(student.summaryOptimizationArea)}</b></article>
      </div>
    </div>
    <div class="modal-body">
      ${championPanel(student.championSummary||{})}
      ${(student.sprints||[]).map(sprint=>`
        <article class="modal-sprint">
          <div class="modal-sprint-head"><div><p class="eyebrow">Sprint ${sprint.sprint}</p><h3>${escapeHtml(sprint.profession)}</h3></div><span class="modal-sprint-score">${Number(sprint.score||0).toFixed(2)}/4 <small>dominio técnico</small></span></div>
          ${domainScale(sprint.score)}
          <div class="modal-ai-grid">
            <p><b>Propósito detectado</b>${escapeHtml(sprint.purpose)}</p>
            <p><b>Logro esperado</b>${escapeHtml(sprint.achievement)}</p>
            <p><b>Área de optimización</b>${escapeHtml(sprint.optimizationArea)}</p>
            <p><b>Lectura</b>El dominio técnico corresponde a la entrega evaluada de este sprint. La metacognición se analiza por separado.</p>
          </div>
          ${rubricTable(sprint)}
          <div class="modal-lists">
            <div><h4>Evidencia observada</h4><ul>${list(sprint.evidence)}</ul></div>
            <div><h4>Por qué suma al score</h4><ul>${list(sprint.strengths)}</ul></div>
            <div><h4>Qué faltó para subir de nivel</h4><ul>${list(sprint.recommendations)}</ul></div>
          </div>
        </article>
      `).join('')}
      <article class="certification-panel">
        <div><p class="eyebrow">Diploma</p><h3>Estado de elegibilidad</h3></div>
        <p><b>${escapeHtml(student.certificationStatus||'En progreso')}</b></p>
        <p>La descarga del diploma debe vivir aquí, dentro del reporte individual, y sólo se habilitará al cierre cuando el estudiante demuestre las competencias requeridas.</p>
      </article>
    </div>`;
  document.body.classList.add('modal-open');
  modal.setAttribute('aria-hidden','false');
}
function closeStudent(){document.body.classList.remove('modal-open');modal.setAttribute('aria-hidden','true')}
document.querySelectorAll('tr[data-student], article[data-student]').forEach(row=>row.addEventListener('click',event=>{if(event.target.closest('button'))return;openStudent(row.dataset.student)}));
document.querySelectorAll('button[data-student]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();openStudent(button.dataset.student)}));
modalClose?.addEventListener('click',closeStudent);
modal?.addEventListener('click',event=>{if(event.target===modal)closeStudent()});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeStudent()});
