(function(){
  var T = TOLVEXA;
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var rangeEl = document.getElementById('split-range'), hint = document.getElementById('split-hint');
  var splitBtn = document.getElementById('btn-split'), resetBtn = document.getElementById('btn-reset');
  var currentDoc = null, currentPageCount = 0;

  function parseRange(str, maxPage){
    var indices = [];
    var parts = str.split(',').map(function(p){ return p.trim(); }).filter(Boolean);
    if(parts.length === 0) return null;
    for(var i=0;i<parts.length;i++){
      var m = /^(\d+)(?:-(\d+))?$/.exec(parts[i]);
      if(!m) return null;
      var start = parseInt(m[1],10), end = m[2] ? parseInt(m[2],10) : start;
      if(start < 1 || end < 1 || start > maxPage || end > maxPage || start > end) return null;
      for(var p=start; p<=end; p++){ if(indices.indexOf(p-1) === -1) indices.push(p-1); }
    }
    return indices;
  }

  var fileList = T.wireFileList({
    dropzoneId: 'pdf-dropzone', inputId: 'pdf-file-input', listId: 'pdf-file-list',
    accept: ['application/pdf'], acceptExt: ['.pdf'], multiple: false, reorderable: false,
    onChange: async function(files){
      err.classList.remove('show');
      currentDoc = null;
      if(files.length === 0){
        rangeEl.disabled = true; rangeEl.value = '';
        hint.textContent = 'Upload a PDF to see its page count.';
        out.textContent = 'Upload a PDF and choose pages to extract.'; out.classList.add('empty');
        return;
      }
      out.textContent = 'Reading PDF...'; out.classList.remove('empty');
      try{
        await T.loadScript(T.PDF_LIB_CDN);
        var bytes = await files[0].arrayBuffer();
        currentDoc = await window.PDFLib.PDFDocument.load(bytes);
        currentPageCount = currentDoc.getPageCount();
        rangeEl.disabled = false;
        hint.textContent = 'This PDF has ' + currentPageCount + ' page' + (currentPageCount===1?'':'s') + '. Example: 1-3, 5';
        out.textContent = 'Enter a page range above, then extract.'; out.classList.add('empty');
      }catch(e){
        err.textContent = 'That PDF could not be read. It may be corrupted or password-protected.';
        err.classList.add('show');
        out.textContent = 'Could not read that PDF.'; out.classList.add('empty');
      }
    }
  });

  async function splitAndDownload(){
    if(!currentDoc){
      err.textContent = 'Please upload a PDF first.'; err.classList.add('show'); return;
    }
    var indices = parseRange(rangeEl.value, currentPageCount);
    if(!indices){
      err.textContent = 'Please enter a valid page range within the document (e.g. 1-3, 5).';
      err.classList.add('show');
      return;
    }
    err.classList.remove('show');
    splitBtn.disabled = true; splitBtn.textContent = 'Extracting...';
    try{
      var PDFDocument = window.PDFLib.PDFDocument;
      var newDoc = await PDFDocument.create();
      var pages = await newDoc.copyPages(currentDoc, indices);
      pages.forEach(function(p){ newDoc.addPage(p); });
      var bytes = await newDoc.save();
      T.downloadBlob('tolvexa-extracted.pdf', new Blob([bytes], {type:'application/pdf'}));
      out.classList.remove('empty');
      out.textContent = 'Done — extracted ' + indices.length + ' page' + (indices.length===1?'':'s') + ' and downloaded the file.';
    }catch(e){
      err.textContent = 'Something went wrong while extracting those pages.';
      err.classList.add('show');
    }finally{
      splitBtn.disabled = false; splitBtn.textContent = 'Extract & download';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    splitBtn.addEventListener('click', splitAndDownload);
    resetBtn.addEventListener('click', function(){ fileList.clear(); });
  });
})();
