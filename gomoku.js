class Gomoku {
  constructor(boardSize, canvasElement, divElement, undoButton, statusParagraph) {
    this.boardSize = boardSize;
    // html elements
    this.canvasElement = canvasElement;
    this.divElement = divElement;
    this.undoButton = undoButton;
    this.statusParagraph = statusParagraph;

    // game states
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

    // rendering
    // first check if canvas is supported
    let dummyCanvas = document.createElement('canvas');
    if (!!(dummyCanvas.getContext && dummyCanvas.getContext('2d'))) {
      this.use = 'canvas';
    } else {
      this.use = 'div';
    }
    this.canvasRenderOptions = {
      edge: 40,
      spacing: 30,
      lineWidth: 1,
      background: '#ffd76e',
      black: '#443d2f',
      white: '#ffffff'
    };
    if (this.use === 'div') {
      this.initDiv();
    }
    this.render();
    this.mountListeners();
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
    // check if game is over
    this.winner = this.getWinner();
    if (this.winner !== '.') {
      this.statusParagraph.textContent = this.winner === 'b' ? 'Black won' : 'White won';
      this.undoButton.disabled = true;
    }
    this.render();
    return true;
  }

  undo() {
    if (this.history.length === 0 || this.winner !== '.') {
      return false;
    }
    let lastMove = this.history.pop();
    this.board[lastMove.row][lastMove.col] = '.';
    this.currentPlayer = this.currentPlayer === 'b' ? 'w' : 'b';
    this.render();
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

  initDiv() {
    for (let i = 0; i < this.boardSize; i++) {
      let row = document.createElement('div');
      for (let j = 0; j < this.boardSize; j++) {
        let intersection = document.createElement('span');
        intersection.setAttribute('row', i);
        intersection.setAttribute('col', j);
        row.appendChild(intersection);
      }
      this.divElement.appendChild(row);
    }
  }

  renderDiv() {
    for (let i = 0; i < this.boardSize; i++) {
      let row = this.divElement.children[i];
      for (let j = 0; j < this.boardSize; j++) {
        let intersection = row.children[j];
        if (this.board[i][j] === 'b') {
          intersection.className = 'black';
        } else if (this.board[i][j] === 'w') {
          intersection.className = 'white';
        } else {
          intersection.className = 'empty';
        }
      }
    }
  }

  canvasToBoard(x, y) {
    const options = this.canvasRenderOptions;
    let row = -1, col = -1;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        let coordinates = this.boardToCanvas(i, j);
        if ((x - coordinates.x) * (x - coordinates.x) + (y - coordinates.y) * (y - coordinates.y) < options.spacing * options.spacing / 4) {
          row = i;
          col = j;
          break;
        }
      }
    }
    return {
      row : row,
      col : col
    }
  }

  boardToCanvas(row, col) {
    const options = this.canvasRenderOptions;
    return {
      x : options.edge + col * (options.spacing + options.lineWidth),
      y : options.edge + row * (options.spacing + options.lineWidth)
    }
  }

  renderCanvas() {
    const ctx = this.canvasElement.getContext('2d');
    const options = this.canvasRenderOptions;
    const edge = options.edge;
    const spacing = options.spacing;
    const lineWidth = options.lineWidth;
    // set canvas size
    const canvasDimension = edge * 2 + this.boardSize * lineWidth + (this.boardSize - 1) * spacing;
    this.canvasElement.width = canvasDimension;
    this.canvasElement.height = canvasDimension;
    // draw background
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, canvasDimension, canvasDimension);
    // draw horizontal lines
    ctx.fillStyle = options.black;
    ctx.lineWidth = options.lineWidth;
    for (let i = 0; i < this.boardSize; i++) {
      ctx.beginPath();
      ctx.moveTo(edge, edge + i * (spacing + lineWidth));
      ctx.lineTo(canvasDimension - edge - lineWidth, edge + i * (spacing + lineWidth));
      ctx.stroke();
    }
    // draw vertical lines
    for (let i = 0; i < this.boardSize; i++) {
      ctx.beginPath();
      ctx.moveTo(edge + i * (spacing + lineWidth), edge);
      ctx.lineTo(edge + i * (spacing + lineWidth), canvasDimension - edge - lineWidth);
      ctx.stroke();
    }
    // draw stones
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 'b' || this.board[i][j] === 'w') {
          ctx.fillStyle = this.board[i][j] === 'b' ? options.black : options.white;
          const coordinates = this.boardToCanvas(i, j);
          ctx.beginPath();
          ctx.arc(coordinates.x, coordinates.y, spacing / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }
      }
    }
  }

  render() {
    if (this.use === 'canvas') {
      this.renderCanvas();
    } else {
      this.renderDiv();
    }
  }

  mountListeners() {
    if (this.use === 'canvas') {
      this.canvasElement.addEventListener('click', event => {
        const rect = this.canvasElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const coordinates = this.canvasToBoard(x, y);
        this.makeMove(coordinates.row, coordinates.col);
      });
    } else {
      for (let i = 0; i < this.boardSize; i++) {
        let row = this.divElement.children[i];
        for (let j = 0; j < this.boardSize; j++) {
          let intersection = row.children[j];
          intersection.addEventListener('click', event => {
            this.makeMove(
              parseInt(intersection.getAttribute('row')),
              parseInt(intersection.getAttribute('col'))
            );
          });
        }
      }
    }

    this.undoButton.addEventListener('click', event => {
      this.undo();
    });
  }
}

const gomoku = new Gomoku(
  15,
  document.getElementById('canvas-board'),
  document.getElementById('div-board'),
  document.getElementById('undo'),
  document.getElementById('status')
);
