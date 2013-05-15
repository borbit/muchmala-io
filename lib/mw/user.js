module.exports = function() {
  return function(socket, payload, next) {
    var user = payload.user;
    payload.res.user = {
      'id'    : user.id
    , 'pid'   : user.pid
    , 'name'  : user.name
    , 'email' : user.email
    };
    next();
  };
};