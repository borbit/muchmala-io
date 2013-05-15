var cmn = require('muchmala-cmn');
var async = require('async');
var _ = require('lodash');
var e = cmn.errors;

module.exports = function(puzzles, users) {
  return function(socket, payload, next) {
    var req = payload.req;
    var res = payload.res;

    async.waterfall([
      function(cb) {
        if (req.puzzleId) {
          puzzles.getPuzzle(req.puzzleId, cb)
        } else {
          puzzles.getFirstPuzzle(cb);
        }
      },
      function(puzzle, cb) {
        if (!puzzle)
          return next(new e.NoPuzzle());
        
        res.puzzle = puzzle;
        
        var userIds = [];
        _.each(puzzle.selected, function(piece) {
          userIds.push(piece.userId);
        });
        if (!userIds.length) {
          return next();
        }
        users.getUsers(userIds, cb);
      },
      function(users) {
        var user = payload.user;
        _.each(res.puzzle.selected, function(piece) {
          piece.userName = users[piece.userId].name;
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