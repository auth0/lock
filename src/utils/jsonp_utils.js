import jsonp from 'jsonp';

class JSONPUtils {
  get(...args) {
    return jsonp(...args);
  }
}

export default new JSONPUtils();
