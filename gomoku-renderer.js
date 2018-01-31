class GomokuRenderer {
  constructor(gomoku, statusElement, undoElement) {
    this.gomoku = gomoku;
    this.statusElement = statusElement;
    this.undoElement = undoElement;

    this.statusElement.textContent = 'Game ongoing';
    this.undoElement.addEventListener('click', event => {
      this.gomoku.undo();
      this.render();
    });
  }

  makeMove(row, col) {
    this.gomoku.makeMove(row, col);
    this.render();
    if (this.gomoku.winner !== '.') {
      this.statusElement.textContent = this.gomoku.winner === 'b' ? 'Black won' : 'White won';
      this.undoElement.disabled = true;
    }
  }
}
