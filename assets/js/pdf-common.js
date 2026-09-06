(function(){
  'use strict';
  var T = window.TOLVEXA;

  // Wires a dropzone + hidden file input + a chip list showing selected files.
  // Returns { getFiles(), setFiles(files), clear() }.
  T.wireFileList = function(cfg){
    var dropzone = document.getElementById(cfg.dropzoneId);
    var input = document.getElementById(cfg.inputId);
    var list = document.getElementById(cfg.listId);
    var files = [];

    function render(){
      list.innerHTML = files.map(function(f, i){
        var sizeKb = (f.size/1024).toFixed(0);
        var moveButtons = cfg.reorderable ? (
          '<button type="button" data-move="up" data-idx="'+i+'" aria-label="Move up" '+(i===0?'disabled':'')+'>'+T.icon('chevron-right',14).replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" style="transform:rotate(-90deg)"')+'</button>' +
          '<button type="button" data-move="down" data-idx="'+i+'" aria-label="Move down" '+(i===files.length-1?'disabled':'')+'>'+T.icon('chevron-right',14).replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" style="transform:rotate(90deg)"')+'</button>'
        ) : '';
        return '<div class="file-chip">' +
          (cfg.reorderable ? '<span style="color:var(--text-faint);font-size:0.78rem;">'+(i+1)+'.</span>' : '') +
          '<span class="name">'+f.name+'</span>' +
          '<span style="color:var(--text-faint);font-size:0.78rem;">'+sizeKb+' KB</span>' +
          moveButtons +
          '<button type="button" data-remove="'+i+'" aria-label="Remove '+f.name+'">'+T.icon('x',15)+'</button>' +
        '</div>';
      }).join('');
      cfg.onChange && cfg.onChange(files.slice());
    }

    function addFiles(fileList){
      var arr = Array.prototype.slice.call(fileList);
      arr.forEach(function(f){
        if(cfg.accept && cfg.accept.indexOf(f.type) === -1 && !(cfg.acceptExt && cfg.acceptExt.some(function(ext){ return f.name.toLowerCase().endsWith(ext); }))){
          T.toast("That file type isn't supported: " + f.name, 'error');
          return;
        }
        if(!cfg.multiple) files = [];
        files.push(f);
      });
      render();
    }

    dropzone.addEventListener('click', function(){ input.click(); });
    dropzone.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); input.click(); } });
    dropzone.addEventListener('dragover', function(e){ e.preventDefault(); dropzone.classList.add('drag'); });
    dropzone.addEventListener('dragleave', function(){ dropzone.classList.remove('drag'); });
    dropzone.addEventListener('drop', function(e){
      e.preventDefault(); dropzone.classList.remove('drag');
      if(e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });
    input.addEventListener('change', function(){ addFiles(input.files); input.value = ''; });
    list.addEventListener('click', function(e){
      var rm = e.target.closest('[data-remove]');
      if(rm){ files.splice(parseInt(rm.getAttribute('data-remove'),10), 1); render(); return; }
      var mv = e.target.closest('[data-move]');
      if(mv){
        var idx = parseInt(mv.getAttribute('data-idx'), 10);
        var dir = mv.getAttribute('data-move');
        var swapWith = dir === 'up' ? idx - 1 : idx + 1;
        if(swapWith >= 0 && swapWith < files.length){
          var tmp = files[idx]; files[idx] = files[swapWith]; files[swapWith] = tmp;
          render();
        }
      }
    });

    return {
      getFiles: function(){ return files.slice(); },
      clear: function(){ files = []; render(); }
    };
  };

  // Loads a script from CDN once, returns a Promise. Used to lazy-load pdf-lib / pdf.js
  // only on the PDF tool pages that actually need them (performance requirement).
  var loaded = {};
  T.loadScript = function(src){
    if(loaded[src]) return loaded[src];
    loaded[src] = new Promise(function(resolve, reject){
      var s = document.createElement('script');
      s.src = src;
      s.onload = function(){ resolve(); };
      s.onerror = function(){ reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
    return loaded[src];
  };

  T.PDF_LIB_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
  T.PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  T.PDFJS_WORKER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
})();
