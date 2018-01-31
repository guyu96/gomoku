class GomokuDiv extends GomokuRenderer {
  constructor(gomoku, divElement, statusElement, undoElement) {
    super(gomoku, statusElement, undoElement);
    this.divElement = divElement;

    for (let i = 0; i < this.gomoku.boardSize; i++) {
      let row = document.createElement('div');
      for (let j = 0; j < this.gomoku.boardSize; j++) {
        let intersection = document.createElement('span');
        intersection.setAttribute('row', i);
        intersection.setAttribute('col', j);
        row.appendChild(intersection);
      }
      this.divElement.appendChild(row);
    }

    for (let i = 0; i < this.gomoku.boardSize; i++) {
      let row = this.divElement.children[i];
      for (let j = 0; j < this.gomoku.boardSize; j++) {
        let intersection = row.children[j];
        intersection.addEventListener('click', event => {
          this.makeMove(
            parseInt(intersection.getAttribute('row')),
            parseInt(intersection.getAttribute('col'))
          );
        });
      }
    }

    this.render();
  }

  render() {
    for (let i = 0; i < this.gomoku.boardSize; i++) {
      let row = this.divElement.children[i];
      for (let j = 0; j < this.gomoku.boardSize; j++) {
        let intersection = row.children[j];
        if (this.gomoku.board[i][j] === 'b') {
          intersection.className = 'black';
        } else if (this.gomoku.board[i][j] === 'w') {
          intersection.className = 'white';
        } else {
          intersection.className = 'empty';
        }
      }
    }
  }
}
