(function(){
  var T = TOLVEXA;
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error'), stats = document.getElementById('tool-stats');

  T.wireFileList({
    dropzoneId: 'pdf-dropzone', inputId: 'pdf-file-input', listId: 'pdf-file-list',
    accept: ['application/pdf'], acceptExt: ['.pdf'], multiple: false, reorderable: false,
    onChange: async function(files){
      err.classList.remove('show'); stats.innerHTML = '';
      if(files.length === 0){
        out.textContent = 'Upload a PDF to count its pages.'; out.classList.add('empty'); return;
      }
      out.classList.remove('empty'); out.textContent = 'Reading PDF...';
      try{
        await T.loadScript(T.PDF_LIB_CDN);
        var bytes = await files[0].arrayBuffer();
        var doc = await window.PDFLib.PDFDocument.load(bytes);
        var count = doc.getPageCount();
        stats.innerHTML = '<div class="stat"><div class="num">' + count + '</div><div class="lbl">Page' + (count===1?'':'s') + '</div></div>';
        out.textContent = '"' + files[0].name + '" has ' + count + ' page' + (count===1?'':'s') + '.';
      }catch(e){
        err.classList.add('show');
        out.textContent = 'Could not read that PDF.'; out.classList.add('empty');
      }
    }
  });
})();
