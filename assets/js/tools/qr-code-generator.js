(function(){
  var T = TOLVEXA;
  var typeEl = document.getElementById('qr-type');
  var preview = document.getElementById('qr-preview');
  var sizeEl = document.getElementById('qr-size'), eccEl = document.getElementById('qr-ecc');
  var lastContent = '';

  var FIELD_GROUPS = { url:'qr-fields-url', email:'qr-fields-email', phone:'qr-fields-phone', wifi:'qr-fields-wifi' };

  function showFieldsFor(type){
    Object.keys(FIELD_GROUPS).forEach(function(t){
      document.getElementById(FIELD_GROUPS[t]).style.display = (t === type) ? 'block' : 'none';
    });
  }

  function buildContent(){
    var type = typeEl.value;
    if(type === 'url'){
      var text = document.getElementById('qr-text').value.trim();
      return text || null;
    }
    if(type === 'email'){
      var addr = document.getElementById('qr-email').value.trim();
      if(!addr) return null;
      var subject = document.getElementById('qr-email-subject').value.trim();
      return 'mailto:' + addr + (subject ? '?subject=' + encodeURIComponent(subject) : '');
    }
    if(type === 'phone'){
      var phone = document.getElementById('qr-phone').value.trim();
      return phone ? 'tel:' + phone.replace(/\s+/g,'') : null;
    }
    if(type === 'wifi'){
      var ssid = document.getElementById('qr-wifi-ssid').value.trim();
      if(!ssid) return null;
      var pass = document.getElementById('qr-wifi-pass').value;
      var enc = document.getElementById('qr-wifi-enc').value;
      var passPart = enc === 'nopass' ? '' : ('P:' + pass + ';');
      return 'WIFI:T:' + enc + ';S:' + ssid + ';' + passPart + ';';
    }
    return null;
  }

  function render(){
    var content = buildContent();
    preview.innerHTML = '';
    if(!content){
      preview.innerHTML = '<span style="color:#999;font-size:0.9rem;">Enter details to generate a QR code.</span>';
      lastContent = '';
      return;
    }
    lastContent = content;
    if(!window.QRCode){
      preview.innerHTML = '<span style="color:#c0392b;font-size:0.85rem;">QR library failed to load — check your connection and reload the page.</span>';
      return;
    }
    try{
      new QRCode(preview, {
        text: content,
        width: parseInt(sizeEl.value,10),
        height: parseInt(sizeEl.value,10),
        correctLevel: QRCode.CorrectLevel[eccEl.value]
      });
    }catch(e){
      preview.innerHTML = '<span style="color:#c0392b;font-size:0.85rem;">Could not generate a QR code for that input.</span>';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    typeEl.addEventListener('change', function(){ showFieldsFor(typeEl.value); render(); });
    document.querySelectorAll('#qr-fields-url input, #qr-fields-url textarea, #qr-fields-email input, #qr-fields-phone input, #qr-fields-wifi input, #qr-fields-wifi select')
      .forEach(function(el){ el.addEventListener('input', render); el.addEventListener('change', render); });
    sizeEl.addEventListener('change', render);
    eccEl.addEventListener('change', render);

    document.getElementById('btn-copy').addEventListener('click', function(){
      if(!lastContent){ T.toast('Nothing to copy yet', 'error'); return; }
      T.copyText(lastContent);
    });
    document.getElementById('btn-download').addEventListener('click', function(){
      var canvas = preview.querySelector('canvas');
      var img = preview.querySelector('img');
      if(canvas){
        canvas.toBlob(function(blob){ T.downloadBlob('tolvexa-qr-code.png', blob); });
      } else if(img){
        var a = document.createElement('a'); a.href = img.src; a.download = 'tolvexa-qr-code.png';
        document.body.appendChild(a); a.click(); a.remove();
        T.toast('File downloaded');
      } else {
        T.toast('Generate a QR code first', 'error');
      }
    });
    document.getElementById('btn-share').addEventListener('click', function(){
      if(!lastContent){ T.toast('Nothing to share yet', 'error'); return; }
      if(navigator.share){ navigator.share({title:'QR code content', text: lastContent}).catch(function(){}); }
      else { T.copyText(lastContent); T.toast('Native sharing isn\'t supported here — copied instead'); }
    });
    document.getElementById('btn-reset').addEventListener('click', function(){
      document.querySelectorAll('#qr-fields-url input, #qr-fields-url textarea, #qr-fields-email input, #qr-fields-phone input, #qr-fields-wifi input')
        .forEach(function(el){ el.value=''; });
      render();
    });

    showFieldsFor(typeEl.value);
    render();
  });
})();
