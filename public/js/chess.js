var chessApp = angular.module("chessApp", ['ngAnimate']);

var piece = {};

piece.Piece = function(args) {
  args = args || {};
  this.name = "";
  this.short_name = "";

  this.color = args.color;
  this.col = args.col;
  this.row = args.row;
};
piece.Piece.prototype.getName = function() {
  return this.name;
};
piece.Piece.prototype.getShortName = function() {
  return this.short_name;
};
piece.Piece.prototype.setCoords = function(col, row) {
  this.coords.col = col;
  this.coords.row = row;
};
piece.Piece.prototype.getCoords = function() {
  return this.position;
};
piece.Piece.prototype.getValidMoves = function(board) {
  return [];
};
piece.Piece.prototype.getNotation = function(square, capture) {
  return this.short_name + (capture ? 'x' : '') + square.file + square.rank;
};

piece.Rook = function() {
  piece.Piece.apply(this, arguments);

  this.name = "Rook";
  this.short_name = "R";
};
piece.Rook.prototype = Object.create(piece.Piece.prototype);
piece.Rook.prototype.constructor = piece.Rook;
piece.Rook.prototype.getValidMoves = function(board) {
  var moves = [], rook = this, square;

  // up
  for(var i = rook.row + 1; i < 8; i++) {
    square = board[i][rook.col];
    if(!square.piece) {
      moves.push({ row: i, col: rook.col, moveable: true });
    }
    else if(square.piece.color != rook.color) {
      moves.push({ row: i, col: rook.col, killable: true });
      break;
    }
    else {
      break;
    }
  }

  // down
  for(var i = rook.row - 1; i > -1; i--) {
    square = board[i][rook.col];
    if(!square.piece) {
      moves.push({ row: i, col: rook.col, moveable: true });
    }
    else if(square.piece.color != rook.color) {
      moves.push({ row: i, col: rook.col, killable: true });
      break;
    }
    else {
      break;
    }
  }

  // right
  for(var i = rook.col + 1; i < 8; i++) {
    square = board[rook.row][i];
    if(!square.piece) {
      moves.push({ row: rook.row, col: i, moveable: true });
    }
    else if(square.piece.color != rook.color) {
      moves.push({ row: rook.row, col: i, killable: true });
      break;
    }
    else {
      break;
    }
  }

  // left
  for(var i = rook.col - 1; i > -1; i--) {
    square = board[rook.row][i];
    if(!square.piece) {
      moves.push({ row: rook.row, col: i, moveable: true });
    }
    else if(square.piece.color != rook.color) {
      moves.push({ row: rook.row, col: i, killable: true });
      break;
    }
    else {
      break;
    }
  }

  return moves;
};

piece.Knight = function() {
  piece.Piece.apply(this, arguments);

  this.name = "Knight";
  this.short_name = "N";
};
piece.Knight.prototype = Object.create(piece.Piece.prototype);
piece.Knight.prototype.constructor = piece.Knight;
piece.Knight.prototype.getValidMoves = function(board) {
  var moves = [], knight = this;

  var jumps = [[2, 1], [1, 2], [-1, 2], [-2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
  
  for(var i = 0, n = jumps.length, square, row, col; i < n; i++) {
    row = knight.row + jumps[i][0];
    col = knight.col + jumps[i][1];
    square = board[row] && board[row][col];
    if(square) {
      if(!square.piece) {
        moves.push({ row: row, col: col, moveable: true });
      }
      else if(square.piece.color != knight.color) {
        moves.push({ row: row, col: col, killable: true });
      }
    }
  }

  return moves;
};

piece.King = function() {
  piece.Piece.apply(this, arguments);

  this.name = "King";
  this.short_name = "K";
};
piece.King.prototype = Object.create(piece.Piece.prototype);
piece.King.prototype.constructor = piece.King;
piece.King.prototype.getValidMoves = function(board) {
  var moves = [], king = this;

  var possible = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  
  for(var i = 0, n = possible.length, square, row, col; i < n; i++) {
    row = king.row + possible[i][0];
    col = king.col + possible[i][1];
    square = board[row] && board[row][col];
    if(!square) {
      continue;
    }
    else if(!square.piece) {
      moves.push({ row: square.row, col: square.col, moveable: true });
    }
    else if(square.piece.color != king.color) {
      moves.push({ row: square.row, col: square.col, killable: true });
    }
  }

  return moves;
};

piece.Pawn = function() {
  piece.Piece.apply(this, arguments);

  this.name = "Pawn";
  this.short_name = "P";
};
piece.Pawn.prototype = Object.create(piece.Piece.prototype);
piece.Pawn.prototype.constructor = piece.Pawn;
piece.Pawn.prototype.getValidMoves = function(board) {
  var moves = [], pawn = this;

  var row, col, square;
  
  var forward = (this.color == 'black') ? 1 : -1;

  row = pawn.row + forward;
  square = board[row] && board[row][pawn.col];

  console.log(square);
  if(square && !square.piece) {
    moves.push({ row: square.row, col: square.col, moveable: true });
  }

  var possible = [1, -1];
  for(var i = 0, n = possible.length; i < n; i++) {
    col = pawn.col + possible[i];
    square = board[row] && board[row][col];
    if(square && square.piece && square.piece.color != pawn.color) {
      moves.push({row: square.row, col: square.col, killable: true });
    }
  }

  return moves;
};

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
  board[0][4].piece = new piece.King({ row: 0, col: 4, color: 'black' });
  board[0][6].piece = new piece.Knight({ row: 0, col: 6, color: 'black' });
  board[0][7].piece = new piece.Rook({ row: 0, col: 7, color: 'black' });

  for(var i = 0; i < 8; i++) {
    board[6][i].piece = new piece.Pawn({ row: 6, col: i, color: 'white' });
  }
  board[7][0].piece = new piece.Rook({ row: 7, col: 0, color: 'white' });
  board[7][1].piece = new piece.Knight({ row: 7, col: 1, color: 'white' });
  board[7][4].piece = new piece.King({ row: 7, col: 4, color: 'white' });
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
