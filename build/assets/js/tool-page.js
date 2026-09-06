(function(){
  'use strict';
  var T = window.TOLVEXA;

  // Generic "type in a box, get a processed result" tool wiring.
  // computeFn(value) must return either a string (the result text) or
  // an object { output: string, error: string, stats: [{num, lbl}, ...] }.
  T.TextTool = function(cfg){
    var input = document.getElementById(cfg.inputId);
    var output = document.getElementById(cfg.outputId);
    var errorBox = cfg.errorId ? document.getElementById(cfg.errorId) : null;
    var statsBox = cfg.statsId ? document.getElementById(cfg.statsId) : null;
    var lastResult = '';

    function setError(msg){
      if(!errorBox) return;
      if(msg){ errorBox.textContent = msg; errorBox.classList.add('show'); }
      else { errorBox.textContent=''; errorBox.classList.remove('show'); }
    }

    function run(){
      var value = input.value;
      if(!value.trim()){
        output.textContent = cfg.emptyMessage || 'Your result will appear here.';
        output.classList.add('empty');
        setError(null);
        if(statsBox) statsBox.innerHTML = '';
        lastResult = '';
        return;
      }
      var res;
      try{ res = cfg.computeFn(value); }
      catch(e){ res = {error: 'Something went wrong processing that input.'}; }
      if(typeof res === 'string') res = {output: res};
      if(res.error){
        setError(res.error);
        output.textContent = 'Please fix the input above to see a result.';
        output.classList.add('empty');
        if(statsBox) statsBox.innerHTML = '';
        lastResult = '';
        return;
      }
      setError(null);
      output.classList.remove('empty');
      output.textContent = res.output;
      lastResult = res.output;
      if(statsBox && res.stats){
        statsBox.innerHTML = res.stats.map(function(s){
          return '<div class="stat"><div class="num">'+s.num+'</div><div class="lbl">'+s.lbl+'</div></div>';
        }).join('');
      }
    }

    input.addEventListener('input', run);
    run();

    if(cfg.copyBtnId){
      var copyBtn = document.getElementById(cfg.copyBtnId);
      copyBtn && copyBtn.addEventListener('click', function(){ T.copyText(lastResult); });
    }
    if(cfg.downloadBtnId){
      var dlBtn = document.getElementById(cfg.downloadBtnId);
      dlBtn && dlBtn.addEventListener('click', function(){
        if(!lastResult){ T.toast('Nothing to download yet', 'error'); return; }
        T.downloadText(cfg.downloadFilename || 'tolvexa-result.txt', lastResult, cfg.downloadMime);
      });
    }
    if(cfg.resetBtnId){
      var resetBtn = document.getElementById(cfg.resetBtnId);
      resetBtn && resetBtn.addEventListener('click', function(){
        input.value = '';
        run();
        input.focus();
      });
    }
    if(cfg.shareBtnId){
      var shareBtn = document.getElementById(cfg.shareBtnId);
      shareBtn && shareBtn.addEventListener('click', function(){
        if(!lastResult){ T.toast('Nothing to share yet', 'error'); return; }
        T.shareResult(lastResult, cfg.downloadFilename ? cfg.downloadFilename.replace(/\.[^.]+$/, '') : 'tolvexa-result');
      });
    }
    return { run: run, getInput: function(){ return input; } };
  };

  // Common wiring every tool page needs: track as "recently used", wire the
  // header favorite/share buttons (share here = share the tool page link itself).
  T.initToolPage = function(toolId){
    T.trackRecent(toolId);
    var shareToolBtn = document.querySelector('[data-share-tool]');
    if(shareToolBtn){
      shareToolBtn.addEventListener('click', function(){
        var url = window.location.href;
        if(navigator.share){
          navigator.share({title: document.title, url: url}).catch(function(){});
        } else {
          T.copyText(url);
          T.toast('Link copied to clipboard');
        }
      });
    }
  };
})();
