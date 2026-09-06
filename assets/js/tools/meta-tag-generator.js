(function(){
  var T = TOLVEXA;
  var titleEl = document.getElementById('mt-title'), descEl = document.getElementById('mt-desc');
  var urlEl = document.getElementById('mt-url'), imgEl = document.getElementById('mt-image'), siteEl = document.getElementById('mt-site');
  var out = document.getElementById('tool-output');
  var lastResult = '';

  function esc(s){ return (s||'').replace(/"/g, '&quot;'); }

  function run(){
    document.getElementById('mt-title-count').textContent = titleEl.value.length + ' / 60 recommended characters';
    document.getElementById('mt-desc-count').textContent = descEl.value.length + ' / 160 recommended characters';
    var title = titleEl.value.trim(), desc = descEl.value.trim(), url = urlEl.value.trim(), img = imgEl.value.trim(), site = siteEl.value.trim();
    if(!title && !desc){
      out.textContent = 'Fill in the fields above to generate meta tags.'; out.classList.add('empty'); lastResult=''; return;
    }
    var lines = [];
    if(title) lines.push('<title>' + esc(title) + '</title>');
    if(desc) lines.push('<meta name="description" content="' + esc(desc) + '">');
    if(site) lines.push('<meta property="og:site_name" content="' + esc(site) + '">');
    if(title) lines.push('<meta property="og:title" content="' + esc(title) + '">');
    if(desc) lines.push('<meta property="og:description" content="' + esc(desc) + '">');
    if(url) lines.push('<meta property="og:url" content="' + esc(url) + '">');
    if(img) lines.push('<meta property="og:image" content="' + esc(img) + '">');
    lines.push('<meta property="og:type" content="website">');
    lines.push('<meta name="twitter:card" content="summary_large_image">');
    if(title) lines.push('<meta name="twitter:title" content="' + esc(title) + '">');
    if(desc) lines.push('<meta name="twitter:description" content="' + esc(desc) + '">');
    if(img) lines.push('<meta name="twitter:image" content="' + esc(img) + '">');
    if(url) lines.push('<link rel="canonical" href="' + esc(url) + '">');
    var text = lines.join('\n');
    out.classList.remove('empty'); out.textContent = text; lastResult = text;
  }
  document.addEventListener('DOMContentLoaded', function(){
    [titleEl, descEl, urlEl, imgEl, siteEl].forEach(function(el){ el.addEventListener('input', run); });
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-download').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to download yet','error'); return; }
      T.downloadText('meta-tags.html', lastResult, 'text/html');
    });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'meta-tags');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){
      [titleEl, descEl, urlEl, imgEl, siteEl].forEach(function(el){ el.value=''; }); run(); titleEl.focus();
    });
    run();
  });
})();
