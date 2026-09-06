(function(){
  var T = TOLVEXA;
  var input = document.getElementById('tool-input'), out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var indentSel = document.getElementById('json-indent');
  var minifyMode = false;
  var lastResult = '';

  function getIndent(){ var v = indentSel.value; return v === 'tab' ? '\t' : parseInt(v,10); }

  function run(){
    var value = input.value;
    if(!value.trim()){
      out.textContent = 'Paste JSON above to format it.'; out.classList.add('empty');
      err.classList.remove('show'); lastResult=''; return;
    }
    try{
      var parsed = JSON.parse(value);
      var text = minifyMode ? JSON.stringify(parsed) : JSON.stringify(parsed, null, getIndent());
      out.classList.remove('empty'); out.textContent = text; lastResult = text;
      err.classList.remove('show');
    }catch(e){
      err.textContent = 'Invalid JSON: ' + e.message;
      err.classList.add('show');
      out.textContent = 'Fix the JSON above to see a formatted result.'; out.classList.add('empty'); lastResult='';
    }
  }
  document.addEventListener('DOMContentLoaded', function(){
    input.addEventListener('input', run);
    indentSel.addEventListener('change', run);
    document.getElementById('btn-minify').addEventListener('click', function(){
      minifyMode = !minifyMode;
      this.textContent = minifyMode ? 'Format instead' : 'Minify instead';
      run();
    });
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-download').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to download yet','error'); return; }
      T.downloadText('formatted.json', lastResult, 'application/json');
    });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'json-result');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ input.value=''; run(); input.focus(); });
    run();
  });
})();
