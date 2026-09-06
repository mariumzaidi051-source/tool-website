(function(){
  var T = TOLVEXA;
  var input = document.getElementById('tool-input'), out = document.getElementById('tool-output');
  var lastResult = '';

  function countLine(str, index){
    return str.slice(0, index).split('\n').length;
  }

  function run(){
    var value = input.value;
    if(!value.trim()){
      out.textContent = 'Paste JSON above to validate it.'; out.classList.add('empty'); lastResult=''; return;
    }
    try{
      var parsed = JSON.parse(value);
      var type = Array.isArray(parsed) ? 'array' : typeof parsed;
      var count = Array.isArray(parsed) ? parsed.length : (type === 'object' && parsed !== null ? Object.keys(parsed).length : null);
      var text = '✓ Valid JSON. Top-level type: ' + type + (count !== null ? ' with ' + count + ' ' + (type==='array' ? (count===1?'item':'items') : (count===1?'key':'keys')) : '') + '.';
      out.classList.remove('empty'); out.textContent = text; lastResult = text;
    }catch(e){
      var msg = e.message;
      var match = /position (\d+)/.exec(msg);
      var lineInfo = match ? ' (near line ' + countLine(value, parseInt(match[1],10)) + ')' : '';
      var text2 = '✗ Invalid JSON. ' + msg + lineInfo + '.';
      out.classList.remove('empty'); out.textContent = text2; lastResult = text2;
    }
  }
  document.addEventListener('DOMContentLoaded', function(){
    input.addEventListener('input', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'json-validation');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ input.value=''; run(); input.focus(); });
    run();
  });
})();
