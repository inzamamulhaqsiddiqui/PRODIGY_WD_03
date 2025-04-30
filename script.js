let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let vsAI = false;

const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');

function startTwoPlayer() {
  vsAI = false;
  startGame();
}

function startVsAI() {
  vsAI = true;
  startGame();
}

function startGame() {
  document.getElementById('mode-selection').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  gameActive = true;
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  clearBoardStyles();
  updateBoard();
  setMessage(`Player ${currentPlayer}'s turn`);
}

function updateBoard() {
  document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.textContent = board[index];
    cell.classList.remove('winning-cell');
    cell.removeEventListener('click', handleCellClick);
    cell.addEventListener('click', () => handleCellClick(index));
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index] !== '') return;

  board[index] = currentPlayer;
  updateBoard();

  const winnerData = checkWinner();
  if (winnerData && winnerData.winner) {
    setMessage(`Player ${winnerData.winner} wins!`);
    gameActive = false;
    highlightWinner(winnerData);
    return;
  }

  if (board.every(cell => cell !== '')) {
    setMessage('Draw!');
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setMessage(`Player ${currentPlayer}'s turn`);

  if (vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  const bestMove = minimax(board, 0, true);
  handleCellClick(bestMove.index);
}

function minimax(newBoard, depth, isMaximizing) {
  const result = checkWinner(newBoard);
  if (result && result.winner) {
    return { score: result.winner === 'O' ? 1 : -1 };
  }
  if (newBoard.every(cell => cell !== '')) {
    return { score: 0 }; // Draw
  }

  const moves = getAvailableMoves(newBoard);
  let bestMove = {
    score: isMaximizing ? -Infinity : Infinity,
    index: null
  };

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    newBoard[move] = isMaximizing ? 'O' : 'X';
    const result = minimax(newBoard, depth + 1, !isMaximizing);
    newBoard[move] = '';

    if (isMaximizing && result.score > bestMove.score) {
      bestMove.score = result.score;
      bestMove.index = move;
    }
    if (!isMaximizing && result.score < bestMove.score) {
      bestMove.score = result.score;
      bestMove.index = move;
    }
  }
  return bestMove;
}

function getAvailableMoves(board) {
  return board.map((val, idx) => val === '' ? idx : null).filter(v => v !== null);
}

function checkWinner(b = board) {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let combo of winCombos) {
    const [a, bIndex, c] = combo;
    if (b[a] !== '' && b[a] === b[bIndex] && b[a] === b[c]) {
      return { winner: b[a], combo };
    }
  }
  return null;
}

function highlightWinner({ combo }) {
  combo.forEach(index => {
    document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning-cell');
  });
}

function setMessage(message) {
  messageElement.textContent = message;
}

function resetGame() {
  gameActive = false;
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  clearBoardStyles();
  updateBoard();
  setMessage(`Player ${currentPlayer}'s turn`);
  document.getElementById('mode-selection').style.display = 'block';
  document.getElementById('game').style.display = 'none';
}

function playAgain() {
  gameActive = true;
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  clearBoardStyles();
  updateBoard();
  setMessage(`Player ${currentPlayer}'s turn`);

  if (vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function clearBoardStyles() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('winning-cell');
  });
}
