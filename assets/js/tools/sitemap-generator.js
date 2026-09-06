(function(){
  var T = TOLVEXA;
  var urlsEl = document.getElementById('sm-urls'), freqEl = document.getElementById('sm-freq'), prioEl = document.getElementById('sm-priority');
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var lastResult = '';

  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function run(){
    var raw = urlsEl.value.split('\n').map(function(l){ return l.trim(); }).filter(Boolean);
    if(raw.length === 0){
      out.textContent = 'Add URLs above to generate a sitemap.'; out.classList.add('empty'); err.classList.remove('show'); lastResult=''; return;
    }
    var valid = [], skipped = 0;
    raw.forEach(function(u){
      if(/^https?:\/\/.+/i.test(u)) valid.push(u); else skipped++;
    });
    err.classList.toggle('show', skipped > 0);
    if(valid.length === 0){
      out.textContent = 'None of those lines look like valid URLs (must start with http:// or https://).'; out.classList.add('empty'); lastResult=''; return;
    }
    var today = new Date().toISOString().slice(0,10);
    var body = valid.map(function(u){
      var parts = ['  <url>', '    <loc>' + esc(u) + '</loc>', '    <lastmod>' + today + '</lastmod>'];
      if(freqEl.value) parts.push('    <changefreq>' + freqEl.value + '</changefreq>');
      if(prioEl.value) parts.push('    <priority>' + prioEl.value + '</priority>');
      parts.push('  </url>');
      return parts.join('\n');
    }).join('\n');
    var text = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>';
    out.classList.remove('empty'); out.textContent = text; lastResult = text;
  }
  document.addEventListener('DOMContentLoaded', function(){
    [urlsEl, freqEl, prioEl].forEach(function(el){ el.addEventListener('input', run); el.addEventListener('change', run); });
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-download').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to download yet','error'); return; }
      T.downloadText('sitemap.xml', lastResult, 'application/xml');
    });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'sitemap');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ urlsEl.value=''; run(); urlsEl.focus(); });
    run();
  });
})();
