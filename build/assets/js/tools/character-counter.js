(function(){
  function compute(value){
    var chars = value.length;
    var noSpaces = value.replace(/\s/g, '').length;
    var letters = (value.match(/[a-zA-Z]/g) || []).length;
    var digits = (value.match(/[0-9]/g) || []).length;
    var spaces = chars - noSpaces;
    return {
      output: chars + ' characters (' + noSpaces + ' without spaces).',
      stats: [
        {num: chars, lbl: 'Total'},
        {num: noSpaces, lbl: 'No spaces'},
        {num: letters, lbl: 'Letters'},
        {num: digits, lbl: 'Digits'},
        {num: spaces, lbl: 'Spaces'}
      ]
    };
  }
  document.addEventListener('DOMContentLoaded', function(){
    TOLVEXA.TextTool({
      inputId:'tool-input', outputId:'tool-output', statsId:'tool-stats',
      copyBtnId:'btn-copy', resetBtnId:'btn-reset', shareBtnId:'btn-share',
      emptyMessage:'Start typing to see the character count.',
      computeFn: compute
    });
  });
})();
