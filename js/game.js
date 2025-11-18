let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '🐱';
let gameActive = true;
let musicStarted = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
];

function makeMove(index) {
    if (!musicStarted) {
        startMusic();
    }
    
    if (board[index] !== '' || !gameActive) return;
    
    board[index] = currentPlayer;
    document.querySelector(`[data-index="${index}"]`).textContent = currentPlayer;
    
    if (checkWin()) {
        document.getElementById('gameStatus').textContent = `Player ${currentPlayer} wins! 🎉`;
        gameActive = false;
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        document.getElementById('gameStatus').textContent = "It's a tie! 🤝";
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === '🐱' ? '🐶' : '🐱';
    document.getElementById('gameStatus').textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = '🐱';
    gameActive = true;
    document.getElementById('gameStatus').textContent = "Player 🐱's turn";
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled');
    });
}

function startMusic() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        audio.volume = 0.5;
        audio.play().then(() => {
            console.log('Music started successfully');
            musicStarted = true;
        }).catch(error => {
            console.log('Error playing music:', error);
            alert('Could not play background music. Please check if the audio file exists.');
        });
    }
}