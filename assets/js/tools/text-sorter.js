(function(){
  var toolApp;
  function compute(value){
    var mode = document.getElementById('sort-mode').value;
    var dedupe = document.getElementById('opt-dedupe').checked;
    var lines = value.split('\n').filter(function(l){ return l.trim().length; });
    if(dedupe){ lines = lines.filter(function(l, i){ return lines.indexOf(l) === i; }); }
    switch(mode){
      case 'az': lines.sort(function(a,b){ return a.localeCompare(b, undefined, {sensitivity:'base'}); }); break;
      case 'za': lines.sort(function(a,b){ return b.localeCompare(a, undefined, {sensitivity:'base'}); }); break;
      case 'len-asc': lines.sort(function(a,b){ return a.length - b.length; }); break;
      case 'len-desc': lines.sort(function(a,b){ return b.length - a.length; }); break;
      case 'reverse': lines.reverse(); break;
      case 'shuffle':
        for(var i=lines.length-1;i>0;i--){ var j = Math.floor(Math.random()*(i+1)); var t=lines[i]; lines[i]=lines[j]; lines[j]=t; }
        break;
    }
    return lines.join('\n');
  }
  document.addEventListener('DOMContentLoaded', function(){
    toolApp = TOLVEXA.TextTool({
      inputId:'tool-input', outputId:'tool-output',
      copyBtnId:'btn-copy', downloadBtnId:'btn-download', downloadFilename:'sorted-text.txt',
      resetBtnId:'btn-reset', shareBtnId:'btn-share',
      emptyMessage:'Your sorted list will appear here.',
      computeFn: compute
    });
    document.getElementById('sort-mode').addEventListener('change', toolApp.run);
    document.getElementById('opt-dedupe').addEventListener('change', toolApp.run);
  });
})();
