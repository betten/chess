window.piece = (function(piece) {
  piece = piece || {};

  console.log(piece);

  piece.Piece = function(args) {
    args = args || {};
    this.name = "";
    this.short_name = "";
    this.has_moved = false;

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

  piece.Bishop = function() {
    piece.Piece.apply(this, arguments);

    this.name = "Bishop";
    this.short_name = "B";
  };
  piece.Bishop.prototype = Object.create(piece.Piece.prototype);
  piece.Bishop.prototype.constructor = piece.Bishop;
  piece.Bishop.prototype.getValidMoves = function(board) {
    var moves = [], bishop = this;

    var square;

    var checkMove = function(square) {
      if(!square) {
        return false;
      }
      else if(!square.piece) {
        moves.push({ row: square.row, col: square.col, moveable: true });
        return true;
      }
      else if(square.piece.color != bishop.color) {
        moves.push({ row: square.row, col: square.col, killable: true });
        return false;
      }
      else { // same color
        return false;
      }
    };

    // +, +
    for(var i = 1; i < 8; i++) {
      row = bishop.row + i;
      col = bishop.col + i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
      }
    }

    // -, -
    for(var i = 1; i < 8; i++) {
      row = bishop.row - i;
      col = bishop.col - i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
      }
    }

    // +, -
    for(var i = 1; i < 8; i++) {
      row = bishop.row + i;
      col = bishop.col - i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
      }
    }

    // -, +
    for(var i = 1; i < 8; i++) {
      row = bishop.row - i;
      col = bishop.col + i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
      }
    }

    return moves;
  };

  piece.Queen = function() {
    piece.Piece.apply(this, arguments);

    this.name = "Queen";
    this.short_name = "Q";
  };
  piece.Queen.prototype = Object.create(piece.Piece.prototype);
  piece.Queen.prototype.constructor = piece.Queen;
  piece.Queen.prototype.getValidMoves = function(board) {
    var moves = [], queen = this;

    var square;

    var checkMove = function(square) {
      if(!square) {
        return false;
      }
      else if(!square.piece) {
        moves.push({ row: square.row, col: square.col, moveable: true });
        return true;
      }
      else if(square.piece.color != queen.color) {
        moves.push({ row: square.row, col: square.col, killable: true });
        return false;
      }
      else { // same color
        return false;
      }
    };

    // up
    for(var i = queen.row + 1; i < 8; i++) {
      square = board[i][queen.col];
      if(!checkMove(square)) {
        break;
      }
    }

    // down
    for(var i = queen.row - 1; i > -1; i--) {
      square = board[i][queen.col];
      if(!checkMove(square)) {
        break;
      }
    }

    // left
    for(var i = queen.col - 1; i > -1; i--) {
      square = board[queen.row][i];
      if(!checkMove(square)) {
        break;
      }
    }

    // right
    for(var i = queen.col + 1; i < 8; i++) {
      square = board[queen.row][i];
      if(!checkMove(square)) {
        break;
      }
    }

    // +, +
    for(var i = 1; i < 8; i++) {
      row = queen.row + i;
      col = queen.col + i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
      }
    }

    // -, -
    for(var i = 1; i < 8; i++) {
      row = queen.row - i;
      col = queen.col - i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
      }
    }

    // +, -
    for(var i = 1; i < 8; i++) {
      row = queen.row + i;
      col = queen.col - i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
      }
    }

    // -, +
    for(var i = 1; i < 8; i++) {
      row = queen.row - i;
      col = queen.col + i;
      square = board[row] && board[row][col];
      if(!checkMove(square)) {
        break;
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

    var row, col, square, possible;
    
    var forward = (this.color == 'black') ? 1 : -1;

    // check moveable
    possible = [forward]; // possible rows
    if(!pawn.has_moved) {
      possible.push(forward * 2);
    }
    for(var i = 0, n = possible.length; i < n; i++) {
      row = pawn.row + possible[i];
      square = board[row] && board[row][pawn.col];
      if(!square || square.piece) {
        break;
      }
      else if(!square.piece) {
        moves.push({ row: square.row, col: square.col, moveable: true });
      }
    }

    // check killable
    possible = [1, -1]; // possible columns
    row = pawn.row + forward;
    for(var i = 0, n = possible.length; i < n; i++) {
      col = pawn.col + possible[i];
      square = board[row] && board[row][col];
      if(square && square.piece && square.piece.color != pawn.color) {
        moves.push({row: square.row, col: square.col, killable: true });
      }
    }

    return moves;
  };

  return piece;

})(window.piece);
