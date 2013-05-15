var cmn = require('muchmala-cmn');
var async = require('async');
var _ = require('lodash');
var e = cmn.errors;

module.exports = function(redis) {
  var puzzle = new cmn.db.Puzzle(redis);
  
  return function(socket, payload, next) {
    var user = payload.user;
    var puzzleId = payload.req.puzzleId;
    var piece1Index = payload.req.piece1Index;
    var piece2Index = payload.req.piece2Index;

    if (!_.isString(puzzleId)) {
      return next(new e.BadRequest('No puzzleId'))
    }
    if (!_.isNumber(piece1Index)) {
      return next(new e.BadRequest('No piece1Index'))
    }
    if (!_.isNumber(piece2Index)) {
      return next(new e.BadRequest('No piece2Index'))
    }
    
    async.waterfall([
      function(cb) {
        puzzle.isSelected(puzzleId, piece1Index, user.id, cb);
      },
      function(selected, cb) {
        if (!selected) return next(new e.CannotSwap());
        puzzle.selectPiece(puzzleId, piece2Index, user.id, cb);
      },
      function(ttl, cb) {
        puzzle.swapPieces(puzzleId, piece1Index, piece2Index, cb);
      },
      function(pieces, cb) {
        payload.res.pieces = pieces;
        puzzle.releasePiece(puzzleId, piece1Index, cb);
      },
      function(cb) {
        puzzle.releasePiece(puzzleId, piece2Index, cb);
      }
    ], next);
  };
};