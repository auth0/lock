function forceLogout (domain, callback) {
  var endpoint = 'https://' + domain + '/logout';
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.onload = function () {
    if (this.src !== endpoint) return;
    callback();
  };

  document.body.appendChild(iframe).src = endpoint;
}
