var cmn = require('muchmala-cmn');
var async = require('async');
var _ = require('lodash');
var e = cmn.errors;

module.exports = function(redis) {
  var puzzle = new cmn.db.Puzzle(redis);
  var users = new cmn.Users(redis);

  return function(socket, payload, next) {
    var req = payload.req;
    var res = payload.res;
    var user = payload.user;

    async.waterfall([
      function(cb) {
        if (req.puzzleId) {
          puzzle.getPuzzle(req.puzzleId, cb)
        } else {
          puzzle.getFirstPuzzle(cb);
        }
      },
      function(puzzle, cb) {
        if (!puzzle)
          return next(new e.NoPuzzle());
        
        res.puzzle = puzzle;
        
        var userIds = _.map(puzzle.selected, function(piece) {
          return piece.userId;
        });
        if (!userIds.length) {
          return next();
        }
        users.getUsers(userIds, cb);
      },
      function(users) {
        _.each(res.puzzle.selected, function(piece) {
          piece.userName = users[piece.userId].data.name;
          if (piece.userId === user.id) {
            piece.my = 1;
          }
          delete piece.userId;
        });
        next();
      }
    ], next);
  };
};