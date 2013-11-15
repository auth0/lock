//ie9 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
module.exports = Object.create || (function(){
  function F(){}

  return function(o){
    if (arguments.length != 1) {
        throw new Error('Object.create implementation only accepts one parameter.');
    }
    F.prototype = o;
    return new F();
  };
})();