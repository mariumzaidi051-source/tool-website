(function(){
  'use strict';
  var T = window.TOLVEXA = window.TOLVEXA || {};
  var DATA = window.TOLVEXA_DATA || { categories: [], tools: [], popular: [] };
  var TOOLS_BY_ID = {};
  DATA.tools.forEach(function(t){ TOOLS_BY_ID[t.id] = t; });
  var CATS_BY_ID = {};
  DATA.categories.forEach(function(c){ CATS_BY_ID[c.id] = c; });

  var FAV_KEY = 'tolvexa_favorites';
  var RECENT_KEY = 'tolvexa_recent';
  var THEME_KEY = 'tolvexa_theme';
  var RECENT_MAX = 10;

  /* ---------------- Storage helpers (all client-side, no data leaves the browser) ---------------- */
  function safeGet(key, fallback){
    try{
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function safeSet(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch(e){ return false; }
  }

  var Storage = {
    getFavorites: function(){ return safeGet(FAV_KEY, []); },
    isFavorite: function(id){ return Storage.getFavorites().indexOf(id) !== -1; },
    toggleFavorite: function(id){
      var favs = Storage.getFavorites();
      var idx = favs.indexOf(id);
      var nowFav;
      if(idx === -1){ favs.unshift(id); nowFav = true; }
      else{ favs.splice(idx,1); nowFav = false; }
      safeSet(FAV_KEY, favs);
      document.dispatchEvent(new CustomEvent('tolvexa:favorites-changed', {detail:{id:id, favorite:nowFav}}));
      return nowFav;
    },
    getRecent: function(){ return safeGet(RECENT_KEY, []); },
    addRecent: function(id){
      var list = Storage.getRecent().filter(function(r){ return r.id !== id; });
      list.unshift({id:id, ts: Date.now()});
      if(list.length > RECENT_MAX) list = list.slice(0, RECENT_MAX);
      safeSet(RECENT_KEY, list);
    },
    removeRecent: function(id){
      var list = Storage.getRecent().filter(function(r){ return r.id !== id; });
      safeSet(RECENT_KEY, list);
      document.dispatchEvent(new CustomEvent('tolvexa:recent-changed'));
    },
    clearRecent: function(){ safeSet(RECENT_KEY, []); document.dispatchEvent(new CustomEvent('tolvexa:recent-changed')); }
  };
  T.Storage = Storage;
  T.data = DATA;
  T.toolsById = TOOLS_BY_ID;
  T.catsById = CATS_BY_ID;

  /* ---------------- Toasts ---------------- */
  function ensureToastRegion(){
    var region = document.querySelector('.toast-region');
    if(!region){
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live','polite');
      region.setAttribute('role','status');
      document.body.appendChild(region);
    }
    return region;
  }
  function toast(message, type){
    var region = ensureToastRegion();
    var el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' err' : '');
    el.innerHTML = T.icon(type === 'error' ? 'alert' : 'check', 16) + '<span></span>';
    el.querySelector('span').textContent = message;
    region.appendChild(el);
    setTimeout(function(){
      el.style.transition = 'opacity 200ms ease';
      el.style.opacity = '0';
      setTimeout(function(){ el.remove(); }, 220);
    }, 2800);
  }
  T.toast = toast;

  /* ---------------- Theme ---------------- */
  function getTheme(){ return document.documentElement.getAttribute('data-theme') || 'dark'; }
  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    safeSet(THEME_KEY, theme);
    document.querySelectorAll('[data-theme-toggle]').forEach(updateThemeBtn);
  }
  function updateThemeBtn(btn){
    var dark = getTheme() === 'dark';
    btn.innerHTML = T.icon(dark ? 'sun' : 'moon', 19);
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function initTheme(){
    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
      updateThemeBtn(btn);
      btn.addEventListener('click', function(){ setTheme(getTheme() === 'dark' ? 'light' : 'dark'); });
    });
  }
  T.setTheme = setTheme;

  /* ---------------- Mobile drawer ---------------- */
  function initDrawer(){
    var drawer = document.querySelector('.mobile-drawer');
    var openBtn = document.querySelector('[data-drawer-open]');
    if(!drawer || !openBtn) return;
    var closeBtn = drawer.querySelector('[data-drawer-close]');
    var backdrop = drawer.querySelector('.backdrop');
    function open(){ drawer.classList.add('open'); document.body.style.overflow='hidden'; closeBtn && closeBtn.focus(); }
    function close(){ drawer.classList.remove('open'); document.body.style.overflow=''; openBtn.focus(); }
    openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    backdrop && backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && drawer.classList.contains('open')) close(); });
  }

  /* ---------------- Icon injection for elements with data-icon ---------------- */
  function initIcons(){
    document.querySelectorAll('[data-icon]').forEach(function(el){
      var size = el.getAttribute('data-icon-size') || 20;
      el.innerHTML = T.icon(el.getAttribute('data-icon'), size);
    });
  }

  /* ---------------- Favorite buttons ---------------- */
  function paintFavButton(btn){
    var id = btn.getAttribute('data-tool-id');
    var isFav = Storage.isFavorite(id);
    btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    btn.innerHTML = T.icon('star', 18);
    btn.setAttribute('aria-label', isFav ? 'Remove from favorites' : 'Add to favorites');
  }
  function initFavButtons(){
    // Paint whatever fav buttons exist in the statically-generated HTML right away.
    document.querySelectorAll('[data-fav-btn]').forEach(paintFavButton);
    // Single delegated listener: correctly handles buttons added later by
    // dynamic re-renders (favorites page, recent page, search results, related tools)
    // without ever double-attaching a handler to the same button.
    document.addEventListener('click', function(e){
      var btn = e.target.closest && e.target.closest('[data-fav-btn]');
      if(!btn) return;
      var id = btn.getAttribute('data-tool-id');
      var nowFav = Storage.toggleFavorite(id);
      document.querySelectorAll('[data-fav-btn][data-tool-id="'+id+'"]').forEach(paintFavButton);
      toast(nowFav ? 'Added to favorites' : 'Removed from favorites');
    });
  }

  /* ---------------- Recent tracking (call on tool pages) ---------------- */
  T.trackRecent = function(toolId){
    if(TOOLS_BY_ID[toolId]) Storage.addRecent(toolId);
  };

  /* ---------------- Card rendering helpers (shared by search, related, favorites, recent) ---------------- */
  function toolCardHTML(tool, opts){
    opts = opts || {};
    var cat = CATS_BY_ID[tool.category] || {};
    var isFav = Storage.isFavorite(tool.id);
    return (
      '<div class="tool-card" data-id="'+tool.id+'" data-category="'+tool.category+'" data-keywords="'+(tool.keywords||[]).join(' ')+'">' +
        '<div class="tool-card-top">' +
          '<div class="tool-icon" style="background:'+cat.accent+'22;color:'+cat.accent+'">'+T.icon(cat.icon||'grid',20)+'</div>' +
          '<button type="button" class="fav-btn" data-fav-btn data-tool-id="'+tool.id+'" aria-pressed="'+isFav+'" aria-label="'+(isFav?'Remove from favorites':'Add to favorites')+'">'+T.icon('star',18)+'</button>' +
        '</div>' +
        '<h3><a href="'+T.toolUrl(tool.id)+'">'+tool.name+'</a></h3>' +
        '<p>'+tool.short+'</p>' +
        '<div class="tool-card-foot">' +
          '<span class="tool-tag" style="background:'+cat.accent+'1a;color:'+cat.accent+'">'+cat.name+'</span>' +
          '<a class="btn btn-sm btn-ghost" href="'+T.toolUrl(tool.id)+'">Open tool</a>' +
        '</div>' +
      '</div>'
    );
  }
  T.toolCardHTML = toolCardHTML;

  // Root-relative tool URL — works whether the current page is at the root or inside /tools/<id>/
  T.toolUrl = function(id){
    var depth = (window.TOLVEXA_ROOT_PREFIX !== undefined) ? window.TOLVEXA_ROOT_PREFIX : '';
    return depth + 'tools/' + id + '/';
  };
  T.rootUrl = function(path){
    var depth = (window.TOLVEXA_ROOT_PREFIX !== undefined) ? window.TOLVEXA_ROOT_PREFIX : '';
    return depth + path;
  };

  /* ---------------- Global search (used by header modal + hero inline search) ---------------- */
  function searchTools(query){
    query = (query||'').trim().toLowerCase();
    if(!query) return [];
    return DATA.tools.filter(function(t){
      var hay = (t.name+' '+t.short+' '+t.category+' '+(t.keywords||[]).join(' ')).toLowerCase();
      return query.split(/\s+/).every(function(word){ return hay.indexOf(word) !== -1; });
    }).slice(0, 8);
  }
  T.searchTools = searchTools;

  function wireInstantSearch(input, resultsBox, opts){
    opts = opts || {};
    function render(){
      var q = input.value;
      var results = searchTools(q);
      if(!q.trim()){ resultsBox.classList.remove('show'); resultsBox.innerHTML=''; return; }
      resultsBox.classList.add('show');
      if(results.length === 0){
        resultsBox.innerHTML = '<div class="csr-empty">No tools found. Try another search term.</div>';
        return;
      }
      resultsBox.innerHTML = results.map(function(t){
        var cat = CATS_BY_ID[t.category] || {};
        return '<a class="csr-item" href="'+T.toolUrl(t.id)+'">' +
          '<div class="tool-icon" style="width:32px;height:32px;background:'+cat.accent+'22;color:'+cat.accent+'">'+T.icon(cat.icon||'grid',16)+'</div>' +
          '<span>'+t.name+'</span></a>';
      }).join('');
    }
    input.addEventListener('input', render);
    if(opts.focusRender) render();
  }
  T.wireInstantSearch = wireInstantSearch;

  function initGlobalSearchModal(){
    var trigger = document.querySelector('[data-search-open]');
    var modalRoot = document.getElementById('global-search-modal');
    if(!modalRoot) return;
    var input = modalRoot.querySelector('input');
    var resultsBox = modalRoot.querySelector('.command-search-results');
    function open(){
      modalRoot.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      input.value=''; resultsBox.innerHTML=''; resultsBox.classList.remove('show');
      setTimeout(function(){ input.focus(); }, 30);
    }
    function close(){ modalRoot.style.display = 'none'; document.body.style.overflow=''; }
    trigger && trigger.forEach ? null : null;
    document.querySelectorAll('[data-search-open]').forEach(function(t){ t.addEventListener('click', open); });
    modalRoot.querySelector('.modal-backdrop-search') && modalRoot.querySelector('.modal-backdrop-search').addEventListener('click', close);
    modalRoot.querySelectorAll('[data-search-close]').forEach(function(b){ b.addEventListener('click', close); });
    wireInstantSearch(input, resultsBox);
    document.addEventListener('keydown', function(e){
      if(e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){
        e.preventDefault(); open();
      } else if(e.key === 'Escape' && modalRoot.style.display === 'flex'){ close(); }
    });
  }

  /* ---------------- Copy / Download helpers ---------------- */
  T.copyText = function(text, onDone){
    if(!text){ toast('Nothing to copy yet', 'error'); return; }
    var done = function(ok){
      toast(ok ? 'Copied to clipboard' : 'Could not copy — select and copy manually', ok ? 'success' : 'error');
      onDone && onDone(ok);
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ done(true); }).catch(function(){ done(false); });
    } else {
      try{
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        done(ok);
      }catch(e){ done(false); }
    }
  };
  T.downloadText = function(filename, text, mime){
    var blob = new Blob([text], {type: mime || 'text/plain'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    toast('File downloaded');
  };
  T.downloadBlob = function(filename, blob){
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    toast('File downloaded');
  };

  /* ---------------- Share / QR modal (reusable) ---------------- */
  T.shareResult = function(text, filenameBase){
    var existing = document.getElementById('tolvexa-share-modal');
    if(existing) existing.remove();
    var wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.id = 'tolvexa-share-modal';
    wrap.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-label="Share result">' +
        '<div class="modal-head"><h3 class="mb-0">Share result</h3><button class="modal-close" aria-label="Close">'+T.icon('x',18)+'</button></div>' +
        '<div class="modal-qr" data-qr-slot></div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-sm" data-act="copy">'+T.icon('copy',15)+' Copy</button>' +
          '<button class="btn btn-sm" data-act="download">'+T.icon('download',15)+' Download</button>' +
          '<button class="btn btn-sm" data-act="native">'+T.icon('share',15)+' Share</button>' +
          '<button class="btn btn-sm" data-act="qrdownload">'+T.icon('qrcode',15)+' Download QR</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    var qrSlot = wrap.querySelector('[data-qr-slot]');
    function renderQR(){
      if(window.QRCode && qrSlot){
        qrSlot.innerHTML = '';
        try{
          new QRCode(qrSlot, {text: String(text).slice(0,900), width:180, height:180, correctLevel: QRCode.CorrectLevel.M});
        }catch(e){ qrSlot.parentElement.style.display='none'; }
      } else if(qrSlot){
        qrSlot.parentElement.style.display = 'none';
      }
    }
    renderQR();
    wrap.addEventListener('click', function(e){ if(e.target === wrap) wrap.remove(); });
    wrap.querySelector('.modal-close').addEventListener('click', function(){ wrap.remove(); });
    wrap.querySelector('[data-act="copy"]').addEventListener('click', function(){ T.copyText(String(text)); });
    wrap.querySelector('[data-act="download"]').addEventListener('click', function(){ T.downloadText((filenameBase||'tolvexa-result')+'.txt', String(text)); });
    wrap.querySelector('[data-act="qrdownload"]').addEventListener('click', function(){
      var canvas = qrSlot.querySelector('canvas');
      if(!canvas){ toast('QR code unavailable offline', 'error'); return; }
      canvas.toBlob(function(blob){ T.downloadBlob((filenameBase||'tolvexa-qr')+'.png', blob); });
    });
    wrap.querySelector('[data-act="native"]').addEventListener('click', function(){
      if(navigator.share){
        navigator.share({title:'TOLVEXA result', text: String(text).slice(0,500)}).catch(function(){});
      } else {
        T.copyText(String(text));
        toast('Native sharing isn\'t supported here — copied instead');
      }
    });
    document.addEventListener('keydown', function esc(e){ if(e.key==='Escape'){ wrap.remove(); document.removeEventListener('keydown', esc); } });
  };

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', function(){
    initIcons();
    initTheme();
    initDrawer();
    initFavButtons();
    initGlobalSearchModal();
    var heroInput = document.getElementById('hero-search-input');
    var heroResults = document.getElementById('hero-search-results');
    if(heroInput && heroResults) wireInstantSearch(heroInput, heroResults);
  });
})();
