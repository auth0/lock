var yarn = require('./yarn');

module.exports = function () {
  var elem = yarn('/login.html', [ '/login.css' ]);

  return {
    body : function (x) {
        elem.querySelector('.body').textContent = x;
    },
    appendTo : function (e) { e.appendChild(elem); }
  };
};
