import Auth0 from 'auth0-js';

if (!global.Auth0) {
  global.Auth0 = {};
}

const cbs = {};

export function load(attrs) {
  const { cb, check, method, url } = attrs;

  if (!cbs[method]) {
    cbs[method] = [];
    global.Auth0[method] = function(...args) {
      cbs[method] = cbs[method].filter(x => {
        if (x.check(...args)) {
          setTimeout(() => x.cb(null, ...args), 0);
          return false;
        } else {
          return true;
        }
      });
    };
  }

  cbs[method].push({ cb: cb, check: check, url: url });

  const count = cbs[method].reduce((r, x) => r + (x.url === url ? 1 : 0), 0);

  if (count > 1) return;

  const script = global.document.createElement('script');
  script.src = url;
  global.document.getElementsByTagName('head')[0].appendChild(script);

  const handleError = err => {
    cbs[method] = cbs[method].filter(x => {
      if (x.url === url) {
        setTimeout(() => x.cb(err), 0);
        return false;
      } else {
        return true;
      }
    });
  };

  const timeoutID = setTimeout(() => handleError(new Error(`${url} timed out`)), 20000);

  script.addEventListener('load', () => clearTimeout(timeoutID));

  script.addEventListener('error', () => {
    clearTimeout(timeoutID);
    handleError(new Error(`${url} could not be loaded.`));
  });
}

export function preload({ method, cb }) {
  global.Auth0[method] = cb;
}
