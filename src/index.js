import Renderer from './lock/renderer';
import RenderScheduler from './lock/render_scheduler';
import { subscribe, getUIState } from './store/index';
import Auth0Lock from './lock/auth0_lock';
import passwordlessEmailSpec from './passwordless-email/mode_spec';

Auth0Lock.registerMode(passwordlessEmailSpec);

// TODO temp for DEV only
global.window.Auth0Lock = Auth0Lock;

const renderer = new Renderer();
const renderScheduler = new RenderScheduler();
subscribe("renderScheduler", locks => {
  renderScheduler.schedule(() => renderer.render(getUIState()));
});

// TODO is it worth to follow the flux convention for naming things and
// organizing files? We can have just one dispatcher, store, constants ns and
// actions, but a lot of utils.
