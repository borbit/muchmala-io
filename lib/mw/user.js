module.exports = function() {
  return function(socket, payload, next) {
    var user = payload.user;
    payload.res.user = {
      'id'     : user.id
    , 'name'   : user.data.name
    , 'email'  : user.data.email
    };
    next();
  };
};