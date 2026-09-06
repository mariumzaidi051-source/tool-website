(function(){
  var T = TOLVEXA;
  var mode = document.getElementById('pc-mode');
  var xEl = document.getElementById('pc-x'), yEl = document.getElementById('pc-y');
  var xLabel = document.getElementById('pc-x-label'), yLabel = document.getElementById('pc-y-label');
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var lastResult = '';

  var LABELS = {
    of: ['X (percent)', 'Y (value)'],
    isWhatPercent: ['X (part)', 'Y (whole)'],
    change: ['X (original)', 'Y (new value)']
  };

  function updateLabels(){
    var l = LABELS[mode.value];
    xLabel.textContent = l[0]; yLabel.textContent = l[1];
  }

  function run(){
    updateLabels();
    var x = parseFloat(xEl.value), y = parseFloat(yEl.value);
    if(xEl.value.trim()==='' && yEl.value.trim()===''){
      out.textContent = 'Enter numbers above to see the result.'; out.classList.add('empty');
      err.classList.remove('show'); lastResult=''; return;
    }
    if(isNaN(x) || isNaN(y)){
      err.classList.add('show');
      out.textContent = 'Please fix the values above.'; out.classList.add('empty');
      lastResult=''; return;
    }
    err.classList.remove('show');
    var text;
    if(mode.value === 'of'){
      var r = (x/100)*y;
      text = x + '% of ' + y + ' is ' + round(r) + '.';
    } else if(mode.value === 'isWhatPercent'){
      if(y === 0){ err.classList.add('show'); out.textContent='Y cannot be zero.'; out.classList.add('empty'); lastResult=''; return; }
      var p = (x/y)*100;
      text = x + ' is ' + round(p) + '% of ' + y + '.';
    } else {
      if(x === 0){ err.classList.add('show'); out.textContent='X cannot be zero for percentage change.'; out.classList.add('empty'); lastResult=''; return; }
      var c = ((y-x)/Math.abs(x))*100;
      var dir = c >= 0 ? 'increase' : 'decrease';
      text = 'That is a ' + round(Math.abs(c)) + '% ' + dir + ' (from ' + x + ' to ' + y + ').';
    }
    out.classList.remove('empty');
    out.textContent = text;
    lastResult = text;
  }
  function round(n){ return Math.round(n * 10000) / 10000; }

  document.addEventListener('DOMContentLoaded', function(){
    mode.addEventListener('change', run);
    xEl.addEventListener('input', run);
    yEl.addEventListener('input', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'percentage-result');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ xEl.value=''; yEl.value=''; run(); xEl.focus(); });
    run();
  });
})();
