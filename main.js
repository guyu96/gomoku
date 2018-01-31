const gomoku = new Gomoku(15);
const canvas = document.getElementById('canvas-board');
const div = document.getElementById('div-board');
const status = document.getElementById('status');
const undo = document.getElementById('undo');

// check canvas availability
const dummyCanvas = document.createElement('canvas');
if (!!(dummyCanvas.getContext && dummyCanvas.getContext('2d'))) {
  const gc = new GomokuCanvas(gomoku, canvas, status, undo);
} else {
  const gd = new GomokuDiv(gomoku, div, status, undo);
}
