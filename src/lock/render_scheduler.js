import { subscribe } from '../store/index';

export default class RenderScheduler {
  constructor(spec) {
    subscribe("main", (key, oldState, newState) => {
      spec.renderer.render(newState, spec.plugins.renderFns());
    });
  }
}
