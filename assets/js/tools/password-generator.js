(function(){
  var T = TOLVEXA;
  var SETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}<>?/'
  };
  var SIMILAR = /[lI1O0]/g;

  var lengthEl = document.getElementById('pw-length'), lengthVal = document.getElementById('pw-length-val');
  var upperEl = document.getElementById('pw-upper'), lowerEl = document.getElementById('pw-lower');
  var numEl = document.getElementById('pw-numbers'), symEl = document.getElementById('pw-symbols'), simEl = document.getElementById('pw-similar');
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error'), stats = document.getElementById('tool-stats');
  var lastResult = '';

  function randInt(max){
    var arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function buildCharset(){
    var charset = '';
    if(upperEl.checked) charset += SETS.upper;
    if(lowerEl.checked) charset += SETS.lower;
    if(numEl.checked) charset += SETS.numbers;
    if(symEl.checked) charset += SETS.symbols;
    if(simEl.checked) charset = charset.replace(SIMILAR, '');
    return charset;
  }

  function estimateStrength(length, charsetSize){
    var bits = Math.round(length * Math.log2(charsetSize || 1));
    if(bits < 40) return 'Weak';
    if(bits < 60) return 'Fair';
    if(bits < 80) return 'Strong';
    return 'Very strong';
  }

  function generate(){
    var length = parseInt(lengthEl.value, 10);
    lengthVal.textContent = length;
    var charset = buildCharset();
    if(!charset){
      err.classList.add('show'); out.textContent=''; lastResult=''; stats.innerHTML=''; return;
    }
    err.classList.remove('show');
    var pw = '';
    for(var i=0;i<length;i++){ pw += charset[randInt(charset.length)]; }
    out.textContent = pw;
    lastResult = pw;
    stats.innerHTML = '<div class="stat"><div class="num">' + estimateStrength(length, charset.length) + '</div><div class="lbl">Estimated strength</div></div>';
  }

  document.addEventListener('DOMContentLoaded', function(){
    [lengthEl, upperEl, lowerEl, numEl, symEl, simEl].forEach(function(el){ el.addEventListener('input', generate); });
    document.getElementById('btn-generate').addEventListener('click', generate);
    document.getElementById('btn-copy').addEventListener('click', function(){
      if(!lastResult){ T.toast('Generate a password first', 'error'); return; }
      T.copyText(lastResult);
    });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Generate a password first', 'error'); return; }
      T.shareResult(lastResult, 'password');
    });
    generate();
  });
})();
