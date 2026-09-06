(function(){
  var toolApp;
  function compute(value){
    var collapseBlank = document.getElementById('opt-blanklines').checked;
    var out = value.split('\n').map(function(line){
      return line.replace(/[ \t]+/g, ' ').trim();
    }).join('\n');
    if(collapseBlank){ out = out.replace(/\n{3,}/g, '\n\n'); }
    return out.trim();
  }
  document.addEventListener('DOMContentLoaded', function(){
    toolApp = TOLVEXA.TextTool({
      inputId:'tool-input', outputId:'tool-output',
      copyBtnId:'btn-copy', downloadBtnId:'btn-download', downloadFilename:'cleaned-text.txt',
      resetBtnId:'btn-reset', shareBtnId:'btn-share',
      emptyMessage:'Your cleaned text will appear here.',
      computeFn: compute
    });
    document.getElementById('opt-blanklines').addEventListener('change', toolApp.run);
  });
})();
