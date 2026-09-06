(function(){
  var T = TOLVEXA;
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var grid = document.getElementById('pdf-image-grid');

  var fileList = T.wireFileList({
    dropzoneId: 'pdf-dropzone', inputId: 'pdf-file-input', listId: 'pdf-file-list',
    accept: ['application/pdf'], acceptExt: ['.pdf'], multiple: false, reorderable: false,
    onChange: function(files){
      grid.innerHTML = '';
      err.classList.remove('show');
      if(files.length === 0){
        out.textContent = 'Upload a PDF to convert its pages to images.'; out.classList.add('empty');
        return;
      }
      renderPages(files[0]);
    }
  });

  async function renderPages(file){
    out.classList.remove('empty');
    out.textContent = 'Loading PDF engine and rendering pages...';
    try{
      await T.loadScript(T.PDFJS_CDN);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = T.PDFJS_WORKER_CDN;
      var bytes = await file.arrayBuffer();
      var pdf = await window.pdfjsLib.getDocument({data: bytes}).promise;
      out.textContent = 'Rendering ' + pdf.numPages + ' page' + (pdf.numPages===1?'':'s') + '...';
      grid.innerHTML = '';
      for(var i=1; i<=pdf.numPages; i++){
        var page = await pdf.getPage(i);
        var viewport = page.getViewport({scale: 1.4});
        var canvas = document.createElement('canvas');
        canvas.width = viewport.width; canvas.height = viewport.height;
        canvas.style.width = '100%'; canvas.style.borderRadius = '8px'; canvas.style.border = '1px solid var(--border)';
        await page.render({canvasContext: canvas.getContext('2d'), viewport: viewport}).promise;

        var wrap = document.createElement('div');
        wrap.style.display = 'flex'; wrap.style.flexDirection = 'column'; wrap.style.gap = '8px';
        wrap.appendChild(canvas);
        var label = document.createElement('div');
        label.style.fontSize = '0.78rem'; label.style.color = 'var(--text-faint)'; label.style.textAlign = 'center';
        label.textContent = 'Page ' + i;
        wrap.appendChild(label);
        var dlBtn = document.createElement('button');
        dlBtn.className = 'btn btn-sm';
        dlBtn.type = 'button';
        dlBtn.textContent = 'Download PNG';
        dlBtn.addEventListener('click', function(cnv, pageNum){
          return function(){ cnv.toBlob(function(blob){ T.downloadBlob('page-' + pageNum + '.png', blob); }); };
        }(canvas, i));
        wrap.appendChild(dlBtn);
        grid.appendChild(wrap);
      }
      out.textContent = 'Done — ' + pdf.numPages + ' page' + (pdf.numPages===1?'':'s') + ' rendered below. Download each as PNG.';
    }catch(e){
      err.classList.add('show');
      out.textContent = 'Could not render that PDF.'; out.classList.add('empty');
      grid.innerHTML = '';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    out.textContent = 'Upload a PDF to convert its pages to images.';
  });
})();
