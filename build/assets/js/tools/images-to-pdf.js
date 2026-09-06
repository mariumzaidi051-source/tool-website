(function(){
  var T = TOLVEXA;
  var out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var buildBtn = document.getElementById('btn-build'), resetBtn = document.getElementById('btn-reset');

  var fileList = T.wireFileList({
    dropzoneId: 'pdf-dropzone', inputId: 'pdf-file-input', listId: 'pdf-file-list',
    accept: ['image/jpeg', 'image/png'], acceptExt: ['.jpg', '.jpeg', '.png'], multiple: true, reorderable: true,
    onChange: function(files){
      err.classList.remove('show');
      out.classList.add('empty');
      out.textContent = files.length === 0
        ? 'Add images above to build a PDF.'
        : files.length + ' image' + (files.length===1?'':'s') + ' ready — reorder if needed, then create the PDF.';
    }
  });

  async function buildAndDownload(){
    var files = fileList.getFiles();
    if(files.length === 0){
      err.classList.add('show');
      return;
    }
    err.classList.remove('show');
    buildBtn.disabled = true; buildBtn.textContent = 'Building...';
    out.classList.remove('empty'); out.textContent = 'Loading PDF engine...';
    try{
      await T.loadScript(T.PDF_LIB_CDN);
      var PDFDocument = window.PDFLib.PDFDocument;
      var pdfDoc = await PDFDocument.create();
      for(var i=0; i<files.length; i++){
        out.textContent = 'Adding image ' + (i+1) + ' of ' + files.length + '...';
        var bytes = await files[i].arrayBuffer();
        var image;
        try{
          image = files[i].type === 'image/png' ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        }catch(e){
          throw new Error('"' + files[i].name + '" could not be read as an image.');
        }
        var page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {x:0, y:0, width:image.width, height:image.height});
      }
      var pdfBytes = await pdfDoc.save();
      T.downloadBlob('tolvexa-images.pdf', new Blob([pdfBytes], {type:'application/pdf'}));
      out.textContent = 'Done — created a ' + files.length + '-page PDF and downloaded it.';
    }catch(e){
      err.textContent = e.message || 'Something went wrong while building the PDF.';
      err.classList.add('show');
      out.textContent = 'Could not build the PDF. Please check your images and try again.';
    }finally{
      buildBtn.disabled = false; buildBtn.textContent = 'Create & download PDF';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    buildBtn.addEventListener('click', buildAndDownload);
    resetBtn.addEventListener('click', function(){ fileList.clear(); });
  });
})();
