import Immutable, { Map } from 'immutable';
import { registerDict } from '../dict/index';

export default class PluginManager {

  constructor(proto) {
    this.proto = proto;
    this.plugins = new Map({});
  }

  register(pluginClass) {
    const plugin = new pluginClass();
    const { dict, name } = plugin;
    this.plugins = this.plugins.set(name, plugin);
    registerDict(name, dict);
  }

  execHook(pluginStr, hookStr, ...args) {
    this.plugins.get(pluginStr).execHook(hookStr, ...args);
  }

  execHookAll(str, ...args) {
    this.plugins.forEach(x => x.execHook(str, ...args));
  }

  renderFns() {
    return this.plugins.map(plugin => plugin.render);
  }

  closeFn(name) {
    return this.plugins.get(name).close;
  }

}
