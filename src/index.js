import Core from './core';
import classic from './engine/classic';
import css from '../css/index.styl';

function injectStyles() {
  const styleId = 'auth0-lock-style';
  let style = document.getElementById(styleId);

  if (!style) {
    const head = document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('id', styleId);
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.innerHTML = css;
  }
}

export default class Auth0Lock extends Core {
  constructor(clientID, domain, options) {
    super(clientID, domain, options, classic);

    injectStyles();
  }
}

// telemetry
Auth0Lock.version = __VERSION__;
Auth0Lock.css = css;

// TODO: should we have different telemetry for classic/passwordless?
// TODO: should we set telemetry info before each request?
// TODO: should we inject styles here?
