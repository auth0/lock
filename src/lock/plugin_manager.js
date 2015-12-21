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
    this.proto[name] = function(...args) {
      const isOpen = plugin.open(this.id, ...args);
      if (isOpen) {
        this.plugin = name;
      }

      return isOpen;
    }
    registerDict(name, dict);
  }

  renderFns() {
    return this.plugins.map(plugin => plugin.render);
  }

  closeFn(name) {
    return this.plugins.get(name).close;
  }
}
