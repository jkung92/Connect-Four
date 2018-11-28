/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor() {
    this.buildButton();
    this.boundHandleClick = this.handleClick.bind(this);
  }

  buildButton() {
    const gameElement = document.getElementById('game');
    const newButton = document.createElement('button');
    newButton.innerHTML = `Play Game`;
    newButton.setAttribute('id', 'gameButton');
    newButton.addEventListener('click', this.startGame.bind(this));
    gameElement.appendChild(newButton);
  }

  startGame() {
    const boundNewGame = this.createNewGame.bind(this);
    boundNewGame(6, 7);
  }

  clearBoard() {
    let tableRows = document.getElementById('board');
    tableRows.innerHTML = '';
  }

  // create new game / restart game
  createNewGame(height, width) {
    this.clearBoard();
    this.height = height;
    this.width = width;
    this.currPlayer = 1;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.boundHandleClick);
    top.classList.add('effects');

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }
  /** placeInTable: update DOM to place piece into HTML board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
    console.log(this);
    let top = document.getElementById('column-top');
    //const boundHandleClick = this.handleClick.bind(this);
    top.removeEventListener('click', this.boundHandleClick);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // check for win
    const boundCheckForWin = this.checkForWin.bind(this);
    if (boundCheckForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }
  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const boundWin = _win.bind(this);
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (
          boundWin(horiz) ||
          boundWin(vert) ||
          boundWin(diagDR) ||
          boundWin(diagDL)
        ) {
          return true;
        }
      }
    }
  }
}

let gameOne = new Game();
// gameOne.makeBoard();
// gameOne.makeHtmlBoard();
