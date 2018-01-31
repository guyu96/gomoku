class GomokuCanvas extends GomokuRenderer {
  constructor(gomoku, canvasElement, statusElement, undoElement) {
    super(gomoku, statusElement, undoElement);
    this.canvasElement = canvasElement;
    this.renderOptions = {
      edge: 40,
      spacing: 30,
      lineWidth: 1,
      background: '#ffd76e',
      black: '#443d2f',
      white: '#ffffff'
    }
    // set canvas size
    this.canvasDimension = this.renderOptions.edge * 2 + this.gomoku.boardSize * this.renderOptions.lineWidth + (this.gomoku.boardSize - 1) * this.renderOptions.spacing;
    this.canvasElement.width = this.canvasDimension;
    this.canvasElement.height = this.canvasDimension;
    // canvas event listener
    this.canvasElement.addEventListener('click', event => {
      const rect = this.canvasElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const coordinates = this.canvasToBoard(x, y);
      this.makeMove(coordinates.row, coordinates.col);
    });
    // init status
    this.statusElement.statusElement;
    this.statusElement.textContent = 'Game ongoing';
    // initial render
    this.render();
  }

  boardToCanvas(row, col) {
    const options = this.renderOptions;
    return {
      x : options.edge + col * (options.spacing + options.lineWidth),
      y : options.edge + row * (options.spacing + options.lineWidth)
    }
  }

  canvasToBoard(x, y) {
    const options = this.renderOptions;
    const boardSize = this.gomoku.boardSize;
    let row = -1, col = -1;
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
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

  render() {
    // set up variables
    const ctx = this.canvasElement.getContext('2d');
    const options = this.renderOptions;
    const dim = this.canvasDimension;
    const edge = options.edge;
    const spacing = options.spacing;
    const lineWidth = options.lineWidth;
    const boardSize = this.gomoku.boardSize;

    // draw background
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, dim, dim);

    // draw horizontal lines
    ctx.fillStyle = options.black;
    ctx.lineWidth = options.lineWidth;
    for (let i = 0; i < boardSize; i++) {
      ctx.beginPath();
      ctx.moveTo(edge, edge + i * (spacing + lineWidth));
      ctx.lineTo(dim - edge - lineWidth, edge + i * (spacing + lineWidth));
      ctx.stroke();
    }

    // draw vertical lines
    for (let i = 0; i < boardSize; i++) {
      ctx.beginPath();
      ctx.moveTo(edge + i * (spacing + lineWidth), edge);
      ctx.lineTo(edge + i * (spacing + lineWidth), dim - edge - lineWidth);
      ctx.stroke();
    }

    // draw stones
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (this.gomoku.board[i][j] === 'b' || this.gomoku.board[i][j] === 'w') {
          ctx.fillStyle = this.gomoku.board[i][j] === 'b' ? options.black : options.white;
          const coordinates = this.boardToCanvas(i, j);
          ctx.beginPath();
          ctx.arc(coordinates.x, coordinates.y, spacing / 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }
      }
    }
  }
}
