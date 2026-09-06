(function(){
  var T = TOLVEXA;
  var priceEl = document.getElementById('dc-price'), pctEl = document.getElementById('dc-percent');
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error'), stats = document.getElementById('tool-stats');
  var lastResult = '';

  function run(){
    var price = parseFloat(priceEl.value), pct = parseFloat(pctEl.value);
    if(priceEl.value.trim()==='' && pctEl.value.trim()===''){
      out.textContent='Enter a price and discount to see the sale price.'; out.classList.add('empty');
      err.classList.remove('show'); stats.innerHTML=''; lastResult=''; return;
    }
    if(isNaN(price) || isNaN(pct) || price < 0 || pct < 0 || pct > 100){
      err.classList.add('show'); out.textContent='Please fix the values above.'; out.classList.add('empty');
      stats.innerHTML=''; lastResult=''; return;
    }
    err.classList.remove('show');
    var saved = price * (pct/100);
    var final = price - saved;
    var text = 'Sale price: $' + final.toFixed(2) + ' — you save $' + saved.toFixed(2) + ' (' + pct + '% off $' + price.toFixed(2) + ').';
    out.classList.remove('empty'); out.textContent = text; lastResult = text;
    stats.innerHTML = [
      {num:'$'+final.toFixed(2), lbl:'Sale price'},
      {num:'$'+saved.toFixed(2), lbl:'You save'},
      {num:pct+'%', lbl:'Discount'}
    ].map(function(s){ return '<div class="stat"><div class="num">'+s.num+'</div><div class="lbl">'+s.lbl+'</div></div>'; }).join('');
  }
  document.addEventListener('DOMContentLoaded', function(){
    priceEl.addEventListener('input', run);
    pctEl.addEventListener('input', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'discount-result');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ priceEl.value=''; pctEl.value=''; run(); priceEl.focus(); });
    run();
  });
})();
