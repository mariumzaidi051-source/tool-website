(function(){
  var T = TOLVEXA;
  var pickerEl = document.getElementById('cc-picker'), hexEl = document.getElementById('cc-hex');
  var rgbEl = document.getElementById('cc-rgb'), hslEl = document.getElementById('cc-hsl');
  var swatch = document.getElementById('cc-swatch'), out = document.getElementById('tool-output'), err = document.getElementById('tool-error');
  var lastResult = '';
  var updating = false;

  function hexToRgb(hex){
    hex = hex.replace('#','');
    if(hex.length === 3) hex = hex.split('').map(function(c){ return c+c; }).join('');
    if(!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
    var num = parseInt(hex, 16);
    return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
  }
  function rgbToHex(r,g,b){ return '#' + [r,g,b].map(function(v){ return v.toString(16).padStart(2,'0'); }).join(''); }
  function rgbToHsl(r,g,b){
    r/=255; g/=255; b/=255;
    var max=Math.max(r,g,b), min=Math.min(r,g,b), h,s,l=(max+min)/2;
    if(max===min){ h=s=0; } else {
      var d=max-min; s = l>0.5 ? d/(2-max-min) : d/(max+min);
      switch(max){
        case r: h=(g-b)/d+(g<b?6:0); break;
        case g: h=(b-r)/d+2; break;
        case b: h=(r-g)/d+4; break;
      }
      h/=6;
    }
    return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
  }
  function hslToRgb(h,s,l){
    h/=360; s/=100; l/=100;
    var r,g,b;
    if(s===0){ r=g=b=l; } else {
      var hue2rgb = function(p,q,t){
        if(t<0) t+=1; if(t>1) t-=1;
        if(t<1/6) return p+(q-p)*6*t;
        if(t<1/2) return q;
        if(t<2/3) return p+(q-p)*(2/3-t)*6;
        return p;
      };
      var q = l<0.5 ? l*(1+s) : l+s-l*s;
      var p = 2*l-q;
      r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
    }
    return { r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255) };
  }
  function parseRgbString(s){
    var m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(s);
    if(!m) return null;
    var r=+m[1], g=+m[2], b=+m[3];
    if(r>255||g>255||b>255) return null;
    return {r:r,g:g,b:b};
  }
  function parseHslString(s){
    var m = /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%/i.exec(s);
    if(!m) return null;
    return { h:+m[1], s:+m[2], l:+m[3] };
  }

  function applyRgb(rgb, source){
    var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    updating = true;
    if(source!=='hex') hexEl.value = hex.toUpperCase();
    if(source!=='rgb') rgbEl.value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    if(source!=='hsl') hslEl.value = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
    if(source!=='picker') pickerEl.value = hex;
    updating = false;
    swatch.style.background = hex;
    err.classList.remove('show');
    var text = 'HEX: ' + hex.toUpperCase() + '\nRGB: rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')\nHSL: hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
    out.textContent = text; lastResult = text;
  }

  document.addEventListener('DOMContentLoaded', function(){
    pickerEl.addEventListener('input', function(){ if(updating) return; var rgb = hexToRgb(pickerEl.value); if(rgb) applyRgb(rgb, 'picker'); });
    hexEl.addEventListener('input', function(){
      if(updating) return;
      var rgb = hexToRgb(hexEl.value);
      if(rgb) applyRgb(rgb, 'hex'); else err.classList.add('show');
    });
    rgbEl.addEventListener('input', function(){
      if(updating) return;
      var rgb = parseRgbString(rgbEl.value);
      if(rgb) applyRgb(rgb, 'rgb'); else err.classList.add('show');
    });
    hslEl.addEventListener('input', function(){
      if(updating) return;
      var hsl = parseHslString(hslEl.value);
      if(hsl){ applyRgb(hslToRgb(hsl.h, hsl.s, hsl.l), 'hsl'); } else err.classList.add('show');
    });
    document.getElementById('btn-copy').addEventListener('click', function(){ T.copyText(lastResult); });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastResult){ T.toast('Nothing to share yet','error'); return; }
      T.shareResult(lastResult, 'color');
    });
    applyRgb(hexToRgb('2e6bff'), 'init');
  });
})();
