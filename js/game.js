// Tic-Tac-Toe Game JavaScript
// Game state variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '🔥';
let gameActive = true;
let musicStarted = false;
let autoRestartTimeout = null;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM elements will be selected when DOM is ready

function startMusic() {
    if (!musicStarted) {
        const audio = document.getElementById('bgMusic');
        if (audio) {
            audio.volume = 0.5;
            audio.play().then(() => {
                console.log('Music started successfully');
                musicStarted = true;
            }).catch(error => {
                console.log('Error playing music:', error);
            });
        }
    }
}

function makeMove(cellIndex) {
    startMusic();
    
    if (board[cellIndex] !== '' || !gameActive) {
        return;
    }

    board[cellIndex] = currentPlayer;
    document.getElementsByClassName('cell')[cellIndex].textContent = currentPlayer;

    if (checkWinner()) {
        document.getElementById('message').textContent = `Player ${currentPlayer} wins! 🎉`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        document.getElementById('message').textContent = "It's a draw! 🤝";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === '🔥' ? '💧' : '🔥';
    document.getElementById('message').textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

function resetGame() {
    startMusic();
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = '🔥';
    gameActive = true;
    document.getElementById('message').textContent = "Player 🔥's turn";
    
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = '';
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all cells
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', function() {
            makeMove(i);
        });
    }
    
    // Add reset button listener
    document.getElementById('resetButton').addEventListener('click', resetGame);
    
    console.log('Tic-tac-toe game initialized!');
});
