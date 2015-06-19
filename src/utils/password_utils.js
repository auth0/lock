import trim from 'trim';

export default {
  validatePassword: function(password) {
    password = trim(password);
    return password.length > 3 ? password : null;
  }
}
