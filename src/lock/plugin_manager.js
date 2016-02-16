import { registerDict } from '../dict/index';

export default class PluginManager {

  constructor(proto) {
    this.proto = proto;
    this.plugins = {};
  }

  register(pluginClass) {
    const plugin = new pluginClass();
    const { dict, name } = plugin;
    this.plugins[name] = plugin;
    registerDict(name, dict);
  }

  execHook(pluginStr, hookStr, ...args) {
    this.plugins[pluginStr].execHook(hookStr, ...args);
  }

  renderFns() {
    const { plugins } = this;
    const r = {};

    Object.keys(plugins).forEach(k => r[k] = plugins[k].render);

    return r;
  }

  closeFn(str) {
    return this.plugins[str].close;
  }

}
