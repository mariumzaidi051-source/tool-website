(function(){
  var T = TOLVEXA;
  var defaultEl = document.getElementById('rt-default'), disallowEl = document.getElementById('rt-disallow');
  var sitemapEl = document.getElementById('rt-sitemap'), gptEl = document.getElementById('rt-block-gpt');
  var out = document.getElementById('tool-output');
  var lastResult = '';

  function run(){
    var lines = ['User-agent: *'];
    if(defaultEl.value === 'disallow'){
      lines.push('Disallow: /');
    } else {
      var paths = disallowEl.value.split('\n').map(function(p){ return p.trim(); }).filter(Boolean);
      if(paths.length === 0) lines.push('Disallow:');
      paths.forEach(function(p){ lines.push('Disallow: ' + (p.startsWith('/') ? p : '/' + p)); });
    }
    if(gptEl.checked){
      lines.push('');
      ['GPTBot','CCBot','Google-Extended'].forEach(function(bot){
        lines.push('User-agent: ' + bot); lines.push('Disallow: /');
      });
    }
    if(sitemapEl.value.trim()){
      lines.push('');
      lines.push('Sitemap: ' + sitemapEl.value.trim());
    }
    var text = lines.join('\n');
    out.classList.remove('empty'); out.textContent = text; lastResult = text;
  }
  document.addEventListener('DOMContentLoaded', function(){
    [defaultEl, disallowEl, sitemapEl, gptEl].forEach(function(el){ el.addEventListener('input', run); el.addEventListener('change', run); });
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-download').addEventListener('click', function(){ T.downloadText('robots.txt', lastResult, 'text/plain'); });
    document.getElementById('btn-share').addEventListener('click', function(){ T.shareResult(lastResult, 'robots-txt'); });
    document.getElementById('btn-reset').addEventListener('click', function(){
      defaultEl.value='allow'; disallowEl.value=''; sitemapEl.value=''; gptEl.checked=false; run();
    });
    run();
  });
})();
