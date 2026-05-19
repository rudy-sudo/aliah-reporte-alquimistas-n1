
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
function openStudent(id){
  const student=(d.students||[]).find(item=>item.studentId===id);
  if(!student)return;
  modalContent.innerHTML=`
    <div class="modal-hero">
      <div class="person"><span>${escapeHtml(student.initials)}</span><div><p class="eyebrow">Reporte individual</p><h2 id="studentModalTitle">${escapeHtml(student.fullName)}</h2><small>${escapeHtml(student.maturity)}</small></div></div>
      <div class="modal-summary">
        <article><small>Promedio entregado</small><b>${Number(student.avgSubmitted||0).toFixed(2)}/4</b></article>
        <article><small>programScore</small><b>${Number(student.programScore||0).toFixed(2)}/4</b></article>
        <article><small>Industria síntesis</small><b>${escapeHtml(student.summaryIndustry)}</b></article>
      </div>
    </div>
    <div class="modal-body">
      ${(student.sprints||[]).map(sprint=>`
        <article class="modal-sprint">
          <div class="modal-sprint-head"><div><p class="eyebrow">Sprint ${sprint.sprint}</p><h3>${escapeHtml(sprint.profession)}</h3></div><span class="modal-sprint-score">${Number(sprint.score||0).toFixed(2)}/4</span></div>
          <div class="modal-ai-grid">
            <p><b>Propósito detectado</b>${escapeHtml(sprint.purpose)}</p>
            <p><b>Logro esperado</b>${escapeHtml(sprint.achievement)}</p>
            <p><b>Industria</b>${escapeHtml(sprint.industry)}</p>
            <p><b>Lectura</b>Esta información corresponde a la entrega evaluada de este sprint.</p>
          </div>
          <div class="modal-lists">
            <div><h4>Evidencia</h4><ul>${list(sprint.evidence)}</ul></div>
            <div><h4>Fortalezas</h4><ul>${list(sprint.strengths)}</ul></div>
            <div><h4>Siguientes pasos</h4><ul>${list(sprint.recommendations)}</ul></div>
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
