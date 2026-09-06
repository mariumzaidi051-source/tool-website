(function(){
  var T = TOLVEXA;
  var input = document.getElementById('tool-input'), out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var modeEl = document.getElementById('b64-mode');
  var lastResult = '';

  function utf8ToB64(str){ return btoa(unescape(encodeURIComponent(str))); }
  function b64ToUtf8(str){ return decodeURIComponent(escape(atob(str))); }

  function run(){
    var value = input.value;
    if(!value.trim()){
      out.textContent = 'Your result will appear here.'; out.classList.add('empty'); err.classList.remove('show'); lastResult=''; return;
    }
    try{
      var text = modeEl.value === 'encode' ? utf8ToB64(value) : b64ToUtf8(value.trim());
      out.classList.remove('empty'); out.textContent = text; lastResult = text; err.classList.remove('show');
    }catch(e){
      err.classList.add('show');
      out.textContent = 'Please fix the input above.'; out.classList.add('empty'); lastResult='';
    }
  }
  document.addEventListener('DOMContentLoaded', function(){
    input.addEventListener('input', run);
    modeEl.addEventListener('change', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-download').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to download yet','error'); return; }
      T.downloadText('base64-result.txt', lastResult);
    });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'base64-result');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ input.value=''; run(); input.focus(); });
    run();
  });
})();
