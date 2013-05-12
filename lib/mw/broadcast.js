module.exports = function() {
  var events = {};
  // subscribe for puzzle updates
  events['puzzle'] = function(socket, payload, next) {
    socket.join(payload.res.puzzle.id);
    next();
  };
  // unsubscribe for puzzle updates
  events['left'] = function(socket, payload, next) {
    socket.leave(payload.req.puzzleId);
    next();
  };
  // broadcast selection data
  events['select'] = function(socket, payload, next) {
    socket.broadcast.to(payload.req.puzzleId).emit('select', {
      pieceIndex: payload.req.pieceIndex
    , userName: payload.user.data.name
    , ttl: payload.res.selected.ttl
    });
    next();
  };
  // broadcast release data
  events['release'] = function(socket, payload, next) {
    socket.broadcast.to(payload.req.puzzleId).emit('release',{
      pieceIndex: payload.req.pieceIndex
    });
    next();
  };
  // broadcast swap data
  events['swap'] = function(socket, payload, next) {
    socket.broadcast.to(payload.req.puzzleId).emit('swap',{
      pieces: payload.res.pieces
    });
    next();
  };

  return function(socket, payload, next) {
    events[payload.event] &&
    events[payload.event](socket, payload, next)
  };
};