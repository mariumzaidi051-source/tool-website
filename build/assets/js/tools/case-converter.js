(function(){
  function toTitle(s){ return s.toLowerCase().replace(/(^|\s|-|\/)\S/g, function(m){ return m.toUpperCase(); }); }
  function toSentence(s){ return s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, function(m){ return m.toUpperCase(); }); }
  function toWords(s){ return s.trim().split(/[\s_-]+/).filter(Boolean); }
  function toCamel(s){ var w = toWords(s.toLowerCase()); return w.map(function(x,i){ return i===0? x : x.charAt(0).toUpperCase()+x.slice(1); }).join(''); }
  function toSnake(s){ return toWords(s.toLowerCase()).join('_'); }
  function toKebab(s){ return toWords(s.toLowerCase()).join('-'); }

  var toolApp;
  function compute(value){
    var mode = document.getElementById('case-mode').value;
    var out;
    switch(mode){
      case 'upper': out = value.toUpperCase(); break;
      case 'lower': out = value.toLowerCase(); break;
      case 'title': out = toTitle(value); break;
      case 'sentence': out = toSentence(value); break;
      case 'camel': out = toCamel(value); break;
      case 'snake': out = toSnake(value); break;
      case 'kebab': out = toKebab(value); break;
      default: out = value;
    }
    return out;
  }
  document.addEventListener('DOMContentLoaded', function(){
    toolApp = TOLVEXA.TextTool({
      inputId:'tool-input', outputId:'tool-output',
      copyBtnId:'btn-copy', downloadBtnId:'btn-download', downloadFilename:'converted-text.txt',
      resetBtnId:'btn-reset', shareBtnId:'btn-share',
      emptyMessage:'Your converted text will appear here.',
      computeFn: compute
    });
    document.getElementById('case-mode').addEventListener('change', toolApp.run);
  });
})();
