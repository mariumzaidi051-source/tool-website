(function(){
  var T = TOLVEXA;
  var WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et " +
    "dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo " +
    "consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint " +
    "occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum").split(' ');

  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function makeWords(n){
    var out = [];
    for(var i=0;i<n;i++) out.push(rand(WORDS));
    return out;
  }
  function makeSentence(){
    var len = 6 + Math.floor(Math.random()*9);
    var words = makeWords(len);
    return cap(words.join(' ')) + '.';
  }
  function makeParagraph(){
    var count = 3 + Math.floor(Math.random()*4);
    var sentences = [];
    for(var i=0;i<count;i++) sentences.push(makeSentence());
    return sentences.join(' ');
  }

  var unitEl = document.getElementById('li-unit'), countEl = document.getElementById('li-count'), classicEl = document.getElementById('li-classic');
  var out = document.getElementById('tool-output');
  var lastResult = '';

  function generate(){
    var n = Math.min(50, Math.max(1, parseInt(countEl.value,10) || 1));
    var unit = unitEl.value;
    var text;
    if(unit === 'words'){
      var words = makeWords(n);
      if(classicEl.checked){ words = ('lorem ipsum dolor sit amet').split(' ').concat(words).slice(0, n); }
      text = cap(words.join(' ')) + '.';
    } else if(unit === 'sentences'){
      var sentences = [];
      for(var i=0;i<n;i++) sentences.push(makeSentence());
      if(classicEl.checked) sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      text = sentences.join(' ');
    } else {
      var paras = [];
      for(var j=0;j<n;j++) paras.push(makeParagraph());
      if(classicEl.checked) paras[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + paras[0];
      text = paras.join('\n\n');
    }
    out.textContent = text; lastResult = text;
  }

  document.addEventListener('DOMContentLoaded', function(){
    [unitEl, countEl, classicEl].forEach(function(el){ el.addEventListener('input', generate); el.addEventListener('change', generate); });
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-download').addEventListener('click', function(){ T.downloadText('lorem-ipsum.txt', lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){ T.shareResult(lastResult, 'lorem-ipsum'); });
    generate();
  });
})();
