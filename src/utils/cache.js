export default class Cache {
  constructor(fetchFn) {
    this.cache = {};
    this.cbs = {};
    this.fetchFn = fetchFn;
  }

  get(...args) {
    const cb = args.pop();
    const key = JSON.stringify(args);
    if (this.cache[key]) return cb(null, this.cache[key]);
    if (this.registerCallback(key, cb) > 1) return;
    this.fetch(key, args);
  }

  fetch(key, args) {
    this.fetchFn(...args, (error, result) => {
      if (!error) this.cache[key] = result;
      this.execCallbacks(key, error, result);
    });
  }

  registerCallback(key, cb) {
    this.cbs[key] = this.cbs[key] || [];
    this.cbs[key].push(cb);
    return this.cbs[key].length;
  }

  execCallbacks(key, ...args) {
    this.cbs[key].forEach(f => f(...args));
    delete this.cbs[key];
  }
}
