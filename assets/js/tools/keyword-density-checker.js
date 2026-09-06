(function(){
  var T = TOLVEXA;
  var STOPWORDS = ('a an the and or but of to in on for with is are was were be been being this that these those ' +
    'as at by from it its it\'s not no so if then than into about over under after before you your we our i they their he she his her').split(' ');
  var STOP = {}; STOPWORDS.forEach(function(w){ STOP[w]=1; });

  var input = document.getElementById('tool-input'), out = document.getElementById('tool-output'), modeEl = document.getElementById('kd-mode');
  var lastResult = '';

  function run(){
    var value = input.value;
    if(!value.trim()){
      out.textContent = 'Paste content above to see keyword density.'; out.classList.add('empty'); lastResult=''; return;
    }
    var words = value.toLowerCase().replace(/[^a-z0-9'\s-]/g, ' ').split(/\s+/).filter(Boolean);
    var n = parseInt(modeEl.value, 10);
    var counts = {};
    var total = 0;
    for(var i=0; i <= words.length - n; i++){
      var gram = words.slice(i, i+n);
      if(gram.some(function(w){ return STOP[w]; })) continue;
      if(gram.some(function(w){ return w.length < 2; })) continue;
      var key = gram.join(' ');
      counts[key] = (counts[key]||0) + 1;
      total++;
    }
    var entries = Object.keys(counts).map(function(k){ return {word:k, count:counts[k]}; })
      .sort(function(a,b){ return b.count - a.count; }).slice(0, 15);
    if(entries.length === 0){
      out.classList.add('empty'); out.textContent = 'No repeated keywords found (try longer content).'; lastResult=''; return;
    }
    var lines = entries.map(function(e){
      var pct = total ? ((e.count/total)*100).toFixed(1) : '0.0';
      return e.word + ' — ' + e.count + 'x (' + pct + '%)';
    });
    var text = lines.join('\n');
    out.classList.remove('empty'); out.textContent = text; lastResult = text;
  }
  document.addEventListener('DOMContentLoaded', function(){
    input.addEventListener('input', run);
    modeEl.addEventListener('change', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'keyword-density');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ input.value=''; run(); input.focus(); });
    run();
  });
})();
