let clone = (o) => (
  Array.isArray(o)
    ? cloneArray(o)
    : typeof o === 'object' && o !== null
      ? cloneObj(o)
      : o
  );
let cloneObj = (o) => Object.assign({}, o);
let cloneArray = (o) => o.map(o => clone(o));

function wrapByType(o) {
  let value;

  if (Array.isArray(o)) {
    value = new List(o);
  }
  else if (o === null) {
    value = o;
  }
  else if (typeof o === 'object') {
    value = new Map(o);
  }
  else {
    value = o;
  }

  return value;
}

function isEmpty(o) {
  if (Array.isArray(o)) {
    return (o.length === 0)
  }
  return (Object.keys(o).length === 0)
}

function getIn(o, searchKeyPath) {
  const key = searchKeyPath.shift(); // get the first key

  if (!(o && o.hasOwnProperty(key))) {
    return undefined;
  }

  if (searchKeyPath.length === 0) { // if it was the last key, return the value
    return o[key];
  } else { // if not, iterate
    return getIn(o[key], searchKeyPath);
  }
}

function setIn(o, keyPath, value) {
  const key = keyPath.shift(); // get the first key
  if (keyPath.length === 0) { // if it is the last key, assign the value
    o[key] = value;
  } else { // if not, iterate and initialize the intermediate objects
    o[key] = o[key] || {};
    o[key] = setIn(o[key], keyPath, value)
  }
  return o; // return the updated map
}

function mergeIn(o, keyPath, value) {
  const key = keyPath.shift(); // get the first key
  if (keyPath.length === 0) { // if it is the last key, assign the value
    o[key] = Object.assign({}, o[key], value);
  } else { // if not, iterate and initialize the intermediate objects
    o[key] = o[key] || {};
    o[key] = setIn(o[key], keyPath, value)
  }
  return o; // return the updated map
}

function updateIn(o, keyPath, notSetValue, updater) {
  const key = keyPath.shift(); // get the first key

  if (keyPath.length === 0) { // if it is the last key, assign the value
    o[key] = updater(new Map(o[key] === undefined ? notSetValue : o[key]));
  } else { // if not, iterate and initialize the intermediate objects
    o[key] = o[key] || {};
    o[key] = updateIn(o[key], keyPath, notSetValue, updater)
  }
  return o; // return the updated map
}

function removeIn(o, keyPath) {
  const key = keyPath.shift(); // get the first key
  if (keyPath.length === 0) { // if it is the last key, delete the value
    delete o[key];
  } else if (o && o.hasOwnProperty(key)) { // if it is not set, ignore, if it is iterate
    o[key] = removeIn(o[key], keyPath)
  }
  return o; // return the updated map
}

function unwrapObject(value) {
  if (Immutable.isMap(value) || Immutable.isList(value)) {
    value = value.unwrap();
  }

  if (value === null) {
    return null
  }

  if (global.Array.isArray(value)) {
    value = value.reduce((p,c) => {
      let new_val = unwrapObject(c);
      if (c !== undefined) {
        p.push(c);
      }
      return p;
    }, []);
  }

  if (typeof value === 'object') {
    if (value['$$typeof']) {
      return value;
    }

    for (let key in value) {
      let new_value = unwrapObject(value[key]);
      value[key] = new_value;
    }
  }

  return value;
}

export class Map {

  constructor (data) {
    if (!data || isEmpty(data)) {
      this._data = {};
    } else {
      this._data = unwrapObject(data);
    }
  }

  get(key, notSetValue) {
    const value = this.getIn([key]);
    return value === undefined ? notSetValue : value;
  }
  set(key, value) {
    return this.setIn([key], value);
  }

  getIn(searchKeyPath, notSetValue) {
    notSetValue = notSetValue || undefined;
    const value = getIn(this._data, searchKeyPath, notSetValue);
    const wrapped = wrapByType(value);

    return wrapped === undefined ? notSetValue : wrapped;
  }

  updateIn(keyPath, notSetValue, updater) {
    notSetValue = notSetValue || null;
    const data = clone(this._data);
    const newData = updateIn(data, keyPath, notSetValue, updater);
    return new Map(newData);
  }

  setIn(keyPath, value) {
    const data = clone(this._data);
    const newData = setIn(data, keyPath, unwrapObject(value));
    return new Map(newData);
  }

  removeIn(keyPath) {
    const newData = removeIn(clone(this._data), keyPath);
    return new Map(newData);
  }

  isEmpty() {
    return isEmpty(this._data);
  }

  toJS() {
    return this.unwrap();
  }

  unwrap() {
    return this._data;
  }

  mergeIn(keyPath, o) {
    o = Immutable.isWrapped(o) ? o.unwrap() : o;
    const newData = mergeIn(clone(this._data), keyPath, o);
    return new Map(newData);
  }

  merge(o) {
    return this.mergeDeep(o);
  }

  mergeWith(o) {
    return this.mergeDeep(o);
  }

  mergeDeep(o) {
    const newData = clone(this._data);
    const newO = clone(unwrapObject(o));
    const mergedData = Object.assign({}, newData, newO);
    return new Map(mergedData);
  }

  filter(predicate, context) {
    const newData = Object.keys(this._data).reduce((p,k) => {
      if (predicate.apply(context, [new Map(this._data[k]), k])) {
        p[k] = this._data[k];
      }
      return p;
    }, {});
    return new Map(newData);
  }

  sort(comparator) { //todo
    return new Map(clone(this._data));
  }

  map(mapper, context) {
    const newData = Object.keys(this._data).reduce((p,k) => {
      let newValue = mapper.apply(context, [wrapByType(this._data[k]), k]);

      if (Immutable.isMap(newValue) || Immutable.isList(newValue)) {
        newValue = newValue.unwrap();
      }

      p[k] = newValue;
      return p;
    }, {});
    return new Map(newData);
  }

  reduce(reducer, initialReduction, context) {
    const newData = Object.keys(this._data).reduce((p,k) => {
      return reducer.apply(context, [p, wrapByType(this._data[k]), k]);
    }, initialReduction);
    return newData;
    // return new Map(newData);
  }

  valueSeq() {
    return new List(Object.values(this._data));
  }

  toList() {
    if (Array.isArray(this._data)) {
      return new List(this._data);
    }
    return new List(Object.values(this._data));
  }

  has(key) {
    return this._data.hasOwnProperty(key);
  }

  static isMap(o) {
    return o instanceof Map;
  }
}

export class List {
  constructor (data) {
    if (!data || isEmpty(data)) {
      this._data = [];
    } else {
      this._data = unwrapObject(data);
    }
  }

  filter(cb) {
    const newData = this._data.reduce((p,c) => {
      if (cb(new Map(c))) {
        p.push(c);
      }
      return p;
    }, []);
    return new List(newData);
  }

  map(mapper, context) {
    const newData = this._data.map((o) => {
      let newValue = mapper.apply(context, [wrapByType(o)]);

      if (Immutable.isMap(newValue) || Immutable.isList(newValue)) {
        newValue = newValue.unwrap();
      }

      return newValue;
    });
    return new List(newData);
  }

  reduce(reducer, initialReduction, context) {
    const newData = this._data.reduce((p,k) => {
      return reducer.apply(context, p, this._data[k], k);
    }, initialReduction);

    return newData;
    // return Array.isArray(newData) ? new List(newData) : new Map(newData);
  }

  count() {
    return this._data.length;
  }

  toJS() {
    return this.unwrap();
  }

  contains(key) {
    return this._data.indexOf(key) !== -1;
  }

  flatten() { //todo
    return this;
  }

  unwrap() {
    return this._data;
  }

  sort(comparator) { //todo
    return new List(clone(this._data));
  }

  get(index, notSetValue) {
    const value = wrapByType(this._data[index]);
    return value === undefined ? notSetValue : value;
  }

  find(predicate) {
    return wrapByType(this._data.find(o => predicate(wrapByType(o))))
  }

  [Symbol.iterator]() {
    // get the properties of the object
    let properties = this._data;
    let count = 0;
    // set to true when the loop is done
    let isDone = false;

    // define the next method, need for iterator
    let next = () => {
      // control on last property reach
      if(count >= properties.length){
         isDone = true;
      }

      return {done:isDone, value: properties[count++]};
    }

    // return the next method used to iterate
    return {next};
  }
}

const Immutable = {
  fromJS: o => Array.isArray(o) ? new List(clone(o)) : new Map(clone(o)),
  Map: o => new Map(clone(o)),
  isMap: o => o instanceof Map,
  isList: o => o instanceof List,
  isWrapped: o => o instanceof List || o instanceof Map,
};

export default Immutable;