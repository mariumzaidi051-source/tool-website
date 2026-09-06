(function(){
  var T = TOLVEXA;
  var VOID_TAGS = {area:1,base:1,br:1,col:1,embed:1,hr:1,img:1,input:1,link:1,meta:1,param:1,source:1,track:1,wbr:1};
  var PRE_TAGS = {pre:1, script:1, style:1, textarea:1};

  function minifyHTML(html){
    return html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function formatHTML(html){
    var clean = html.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();
    var tokens = clean.match(/<[^>]+>|[^<]+/g) || [];
    var indent = 0;
    var out = [];
    var pad = '  ';
    var inPre = 0;

    tokens.forEach(function(tok){
      if(/^<!/.test(tok) || /^<\?/.test(tok)){ out.push(pad.repeat(indent) + tok.trim()); return; }
      if(/^<\//.test(tok)){
        var tagName = (/^<\/([a-zA-Z0-9-]+)/.exec(tok) || [])[1] || '';
        if(PRE_TAGS[tagName.toLowerCase()] && inPre){ inPre--; }
        indent = Math.max(0, indent - 1);
        out.push(pad.repeat(indent) + tok.trim());
        return;
      }
      if(/^</.test(tok)){
        var tagMatch = /^<([a-zA-Z0-9-]+)/.exec(tok);
        var name = tagMatch ? tagMatch[1].toLowerCase() : '';
        var selfClose = /\/>\s*$/.test(tok) || VOID_TAGS[name];
        out.push(pad.repeat(indent) + tok.trim());
        if(!selfClose){
          indent++;
          if(PRE_TAGS[name]) inPre++;
        }
        return;
      }
      var text = tok.trim();
      if(text) out.push(pad.repeat(indent) + text);
    });
    return out.join('\n');
  }

  var input = document.getElementById('tool-input'), out = document.getElementById('tool-output');
  var modeEl = document.getElementById('html-mode');
  var lastResult = '';

  function run(){
    var value = input.value;
    if(!value.trim()){
      out.textContent = 'Paste HTML above to format or minify it.'; out.classList.add('empty'); lastResult=''; return;
    }
    var text;
    try{
      text = modeEl.value === 'minify' ? minifyHTML(value) : formatHTML(value);
    }catch(e){
      text = value;
    }
    out.classList.remove('empty'); out.textContent = text; lastResult = text;
  }
  document.addEventListener('DOMContentLoaded', function(){
    input.addEventListener('input', run);
    modeEl.addEventListener('change', run);
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-download').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to download yet','error'); return; }
      T.downloadText('formatted.html', lastResult, 'text/html');
    });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'html-result');
    });
    document.getElementById('btn-reset').addEventListener('click', function(){ input.value=''; run(); input.focus(); });
    run();
  });
})();
