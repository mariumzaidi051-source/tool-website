(function(){
  var T = TOLVEXA;
  var dobEl = document.getElementById('age-dob'), asOfEl = document.getElementById('age-asof');
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error'), stats = document.getElementById('tool-stats');
  var lastResult = '';

  function todayISO(){ var d = new Date(); return d.toISOString().slice(0,10); }

  function run(){
    if(!dobEl.value){
      out.textContent = 'Enter a date of birth to calculate age.'; out.classList.add('empty');
      err.classList.remove('show'); stats.innerHTML=''; lastResult=''; return;
    }
    var dob = new Date(dobEl.value + 'T00:00:00');
    var asOf = asOfEl.value ? new Date(asOfEl.value + 'T00:00:00') : new Date();
    if(isNaN(dob.getTime()) || dob > asOf){
      err.classList.add('show'); out.textContent='Please fix the dates above.'; out.classList.add('empty');
      stats.innerHTML=''; lastResult=''; return;
    }
    err.classList.remove('show');

    var years = asOf.getFullYear() - dob.getFullYear();
    var months = asOf.getMonth() - dob.getMonth();
    var days = asOf.getDate() - dob.getDate();
    if(days < 0){
      months -= 1;
      var prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate();
      days += prevMonth;
    }
    if(months < 0){ years -= 1; months += 12; }

    var totalDays = Math.floor((asOf - dob) / 86400000);
    var totalWeeks = Math.floor(totalDays / 7);

    var nextBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
    if(nextBday < asOf) nextBday.setFullYear(asOf.getFullYear()+1);
    var daysToBday = Math.round((nextBday - asOf) / 86400000);

    var text = years + ' years, ' + months + ' months, ' + days + ' days old' + (asOfEl.value ? ' (as of ' + asOfEl.value + ')' : '') + '.';
    out.classList.remove('empty');
    out.textContent = text;
    lastResult = text;
    stats.innerHTML = [
      {num:years, lbl:'Years'}, {num:months, lbl:'Months'}, {num:days, lbl:'Days'},
      {num:totalDays.toLocaleString(), lbl:'Total days'}, {num:totalWeeks.toLocaleString(), lbl:'Total weeks'},
      {num:daysToBday, lbl:'Days to next birthday'}
    ].map(function(s){ return '<div class="stat"><div class="num">'+s.num+'</div><div class="lbl">'+s.lbl+'</div></div>'; }).join('');
  }

  document.addEventListener('DOMContentLoaded', function(){
    asOfEl.max = todayISO();
    dobEl.max = todayISO();
    dobEl.addEventListener('input', run);
    asOfEl.addEventListener('input', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'age-result');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ dobEl.value=''; asOfEl.value=''; run(); dobEl.focus(); });
    run();
  });
})();
