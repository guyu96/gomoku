class Gomoku {
  constructor(boardSize) {
    this.boardSize = boardSize;
    // b for black, w for white, . for empty
    this.board = [];
    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        row.push('.');
      }
      this.board.push(row);
    }
    this.history = [];
    this.currentPlayer = 'b';
    this.winner = '.';
  }

  inRange(row, col) {
    if (row < 0 || row >= this.boardSize) {
      return false;
    }
    if (col < 0 || col >= this.boardSize) {
      return false;
    }
    return true;
  }

  makeMove(row, col) {
    if (!this.inRange(row, col) || this.board[row][col] !== '.' || this.winner !== '.') {
      return false;
    }
    this.board[row][col] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === 'b' ? 'w' : 'b';
    this.history.push({ row: row, col: col });
    // update game status
    this.winner = this.getWinner();
    return true;
  }

  undo() {
    if (this.history.length === 0 || this.winner !== '.') {
      return false;
    }
    let lastMove = this.history.pop();
    this.board[lastMove.row][lastMove.col] = '.';
    this.currentPlayer = this.currentPlayer === 'b' ? 'w' : 'b';
    return true;
  }

  getWinner() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let stone = this.board[i][j];
        if (stone !== '.') {
          // vertical
          if (i < this.boardSize - 4) {
            let vertical = true;
            for (let k = 1; k < 5; k++) {
              if (this.board[i + k][j] !== stone) {
                vertical = false;
                break;
              }
            }
            if (vertical) {
              return stone;
            }
          }
          // horizontal
          if (j < this.boardSize - 4) {
            let horizontal = true;
            for (let k = 1; k < 5; k++) {
              if (this.board[i][j + k] !== stone) {
                horizontal = false;
                break;
              }
            }
            if (horizontal) {
              return stone;
            }
          }
          // northeast diagonoal
          if (i >= 4 && j < this.boardSize - 4) {
            let ne = true;
            for (let k = 1; k < 5; k++) {
              if (this.board[i - k][j + k] !== stone) {
                ne = false;
                break;
              }
            }
            if (ne) {
              return stone;
            }
          }
          // southeast diagonal
          if (i < this.boardSize - 4 && j < this.boardSize - 4) {
            let se = true;
            for (let k = 1; k < 5; k++) {
              if (this.board[i + k][j + k] !== stone) {
                se = false;
                break;
              }
            }
            if (se) {
              return stone;
            }
          }
        }
      }
    }

    return '.';
  }
}
