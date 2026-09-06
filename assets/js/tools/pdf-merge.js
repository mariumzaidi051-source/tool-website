(function(){
  var T = TOLVEXA;
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var mergeBtn = document.getElementById('btn-merge'), resetBtn = document.getElementById('btn-reset');

  var fileList = T.wireFileList({
    dropzoneId: 'pdf-dropzone', inputId: 'pdf-file-input', listId: 'pdf-file-list',
    accept: ['application/pdf'], acceptExt: ['.pdf'], multiple: true, reorderable: true,
    onChange: function(files){
      err.classList.remove('show');
      if(files.length === 0){
        out.textContent = 'Add PDF files above, then merge them.'; out.classList.add('empty');
      } else {
        out.textContent = files.length + ' file' + (files.length===1?'':'s') + ' ready. Reorder with the arrows if needed, then merge.';
        out.classList.add('empty');
      }
    }
  });

  async function mergeAndDownload(){
    var files = fileList.getFiles();
    if(files.length < 2){
      err.textContent = 'Please add at least two PDF files to merge.';
      err.classList.add('show');
      return;
    }
    err.classList.remove('show');
    mergeBtn.disabled = true;
    mergeBtn.textContent = 'Merging...';
    out.classList.remove('empty');
    out.textContent = 'Loading PDF engine...';
    try{
      await T.loadScript(T.PDF_LIB_CDN);
      var PDFDocument = window.PDFLib.PDFDocument;
      out.textContent = 'Merging ' + files.length + ' files...';
      var merged = await PDFDocument.create();
      for(var i=0; i<files.length; i++){
        var bytes = await files[i].arrayBuffer();
        var src;
        try{
          src = await PDFDocument.load(bytes);
        }catch(e){
          throw new Error('"' + files[i].name + '" could not be read. It may be corrupted or password-protected.');
        }
        var pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(function(p){ merged.addPage(p); });
      }
      var mergedBytes = await merged.save();
      var blob = new Blob([mergedBytes], {type:'application/pdf'});
      T.downloadBlob('tolvexa-merged.pdf', blob);
      out.textContent = 'Done — merged ' + files.length + ' files into one PDF and downloaded it.';
    }catch(e){
      err.textContent = e.message || 'Something went wrong while merging. Please check your files and try again.';
      err.classList.add('show');
      out.textContent = 'Merge failed. Please check your files and try again.';
    }finally{
      mergeBtn.disabled = false;
      mergeBtn.textContent = 'Merge & download';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    mergeBtn.addEventListener('click', mergeAndDownload);
    resetBtn.addEventListener('click', function(){ fileList.clear(); });
  });
})();
