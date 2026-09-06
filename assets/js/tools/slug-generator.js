(function(){
  var T = TOLVEXA;
  var input = document.getElementById('tool-input'), out = document.getElementById('tool-output');
  var sepEl = document.getElementById('slug-separator'), lowerEl = document.getElementById('slug-lower');
  var lastResult = '';

  function slugify(str, sep, lower){
    var s = str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    if(lower) s = s.toLowerCase();
    s = s.replace(/[^a-zA-Z0-9]+/g, sep);
    var re = new RegExp('\\' + sep + '+', 'g');
    s = s.replace(re, sep);
    var trimRe = new RegExp('^\\' + sep + '+|\\' + sep + '+$', 'g');
    return s.replace(trimRe, '');
  }

  function run(){
    var value = input.value;
    if(!value.trim()){
      out.textContent = 'Your URL-friendly slug will appear here.'; out.classList.add('empty'); lastResult=''; return;
    }
    var text = slugify(value, sepEl.value, lowerEl.checked);
    out.classList.remove('empty'); out.textContent = text || '(empty — title had no letters or numbers)'; lastResult = text;
  }
  document.addEventListener('DOMContentLoaded', function(){
    input.addEventListener('input', run);
    sepEl.addEventListener('change', run);
    lowerEl.addEventListener('change', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'slug');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ input.value=''; run(); input.focus(); });
    run();
  });
})();
