var chessApp = angular.module("chessApp", ['ngAnimate']);

var Square = function(args) {
  args = args || {};
  this.color = args.color || '';
  this.live = false;
  this.killable = false;
  this.moveable = false;
  this.piece = args.piece || null;
};

var Board = function() {
  Array.apply(this, arguments);

  var board = this; // row, column | y, x

  for(var i = 8, row; i > 0; i--) {
    row = [];

    for(var j = 0, c; j < 8; j++) {
      c = String.fromCharCode(97 + j);
      row.push({ file: c, rank: i, row: 8 - i, col: j, piece: null });
    }

    board.push(row);
  }
};
Board.prototype = Object.create(Array.prototype);
Board.prototype.constructor = Board;
Board.prototype.clear = function() {
  var board = this;

  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      board[i][j].moveable = false;
      board[i][j].killable = false;
      board[i][j].live = false;
    }
  }
};
Board.prototype.getLive = function() {
  var board = this;

  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      if(board[i][j].live) return board[i][j];
    }
  }
};

var Game = function() {
  this.board = new Board();

  this.whose_turn = 'white';
  this.history = { white: [], black: [] };
  this.captures = { by_white: [], by_black: [] };
  this.over = false;

  this.fillBoard();
};
Game.prototype.fillBoard = function() {
  var board = this.board;

  for(var i = 0; i < 8; i++) {
    board[1][i].piece = new piece.Pawn({ row: 1, col: i, color: 'black' });
  }
  board[0][0].piece = new piece.Rook({ row: 0, col: 0, color: 'black' });
  board[0][1].piece = new piece.Knight({ row: 0, col: 1, color: 'black' });
  board[0][2].piece = new piece.Bishop({ row: 0, col: 2, color: 'black' });
  board[0][3].piece = new piece.Queen({ row: 0, col: 3, color: 'black' });
  board[0][4].piece = new piece.King({ row: 0, col: 4, color: 'black' });
  board[0][5].piece = new piece.Bishop({ row: 0, col: 5, color: 'black' });
  board[0][6].piece = new piece.Knight({ row: 0, col: 6, color: 'black' });
  board[0][7].piece = new piece.Rook({ row: 0, col: 7, color: 'black' });

  for(var i = 0; i < 8; i++) {
    board[6][i].piece = new piece.Pawn({ row: 6, col: i, color: 'white' });
  }
  board[7][0].piece = new piece.Rook({ row: 7, col: 0, color: 'white' });
  board[7][1].piece = new piece.Knight({ row: 7, col: 1, color: 'white' });
  board[7][2].piece = new piece.Bishop({ row: 7, col: 2, color: 'white' });
  board[7][3].piece = new piece.Queen({ row: 7, col: 3, color: 'white' });
  board[7][4].piece = new piece.King({ row: 7, col: 4, color: 'white' });
  board[7][5].piece = new piece.Bishop({ row: 7, col: 5, color: 'white' });
  board[7][6].piece = new piece.Knight({ row: 7, col: 6, color: 'white' });
  board[7][7].piece = new piece.Rook({ row: 7, col: 7, color: 'white' });
};
Game.prototype.nextTurn = function() {
  if(this.whose_turn == 'white') this.whose_turn = 'black';
  else this.whose_turn = 'white';
};

chessApp.controller("ChessCtrl", function($scope) {
  var game = $scope.game = new Game();

  $scope.newGame = function() {
    game = $scope.game = new Game();
  };

  $scope.squareClick = function(square) {
    if(game.over) {
      return false;
    }
    else if(square.moveable) {
      var live = game.board.getLive();

      game.history[game.whose_turn].push(
        (live.piece.name == 'Pawn' ? '' : live.piece.short_name) + square.file + square.rank
      ); 

      square.piece = live.piece;
      square.piece.row = square.row;
      square.piece.col = square.col;
      square.piece.has_moved = true;
      live.piece = null;

      game.board.clear();

      game.nextTurn();

      return true;
    }
    else if(square.killable) {
      var live = game.board.getLive();

      if(square.piece.name == 'King') {
        game.over = true;
        game.winner = game.whose_turn;
      }

      game.history[game.whose_turn].push(
        (live.piece.name == 'Pawn' ? live.file : live.piece.short_name) + 'x' + square.file + square.rank
      );
      game.captures['by_' + game.whose_turn].push(square.piece);

      square.piece = live.piece;
      square.piece.row = square.row;
      square.piece.col = square.col;
      square.piece.has_moved = true;
      live.piece = null;

      game.board.clear();

      game.nextTurn();

      return true;
    }
    else if(square.live) {
      game.board.clear();
      return true;
    }

    game.board.clear();

    if(!square.piece) return false;
    if(square.piece.color != game.whose_turn) return false;

    var moves = square.piece.getValidMoves(game.board);
    for(var i = 0, n = moves.length; i < n; i++) {
      if(moves[i].moveable) game.board[moves[i].row][moves[i].col].moveable = true;
      if(moves[i].killable) game.board[moves[i].row][moves[i].col].killable = true;
    }

    square.live = true;
  };
});
