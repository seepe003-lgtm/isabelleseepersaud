// Tic-Tac-Toe Game JavaScript
// Game state variables
const gameBoard = ['', '', '', '', '', '', '', '', ''];
const bulldog = '🐶';  // Player symbol
const bone = '🦴';     // Computer symbol
let currentPlayer = bulldog;
let gameActive = true;
let autoRestartTimeout = null;

// Audio elements
const bgMusic = document.getElementById('bgMusic');
let musicStarted = false;

// Winning combinations for tic-tac-toe
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// DOM elements
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

/**
 * Start background music on first user interaction
 */
function startMusic() {
    if (!musicStarted) {
        bgMusic.volume = 0.5; // Set volume to 50%
        bgMusic.play()
            .then(() => {
                console.log('Music started successfully');
                musicStarted = true;
            })
            .catch(e => {
                console.warn('Could not start background music:', e);
                // Don't show alert, just log the warning
                musicStarted = true; // Prevent repeated attempts
            });
    }
}

/**
 * Handle cell click events
 * @param {Event} e - Click event
 */
function handleCellClick(e) {
    startMusic(); // Start music on first click
    
    const index = parseInt(e.target.getAttribute('data-index'));
    
    // Check if cell is already filled or game is not active or it's not player's turn
    if (gameBoard[index] !== '' || !gameActive || currentPlayer !== bulldog) {
        return;
    }
    
    // Make player's move
    makeMove(index, bulldog);
    
    // If game is still active, let computer make a move
    if (gameActive && !isDraw()) {
        currentPlayer = bone;
        message.textContent = "Computer's turn!";
        setTimeout(computerMove, 700); // Add delay for better UX
    }
}

/**
 * Make a move on the game board
 * @param {number} index - Cell index (0-8)
 * @param {string} player - Player symbol
 */
function makeMove(index, player) {
    // Update game board and display
    gameBoard[index] = player;
    cells[index].textContent = player;
    
    // Check for win condition
    if (checkWin()) {
        const winner = player === bulldog ? 'You' : 'Computer';
        message.textContent = `${winner} won! 🎉`;
        gameActive = false;
        scheduleRestart();
        return;
    }
    
    // Check for draw condition
    if (isDraw()) {
        message.textContent = "It's a draw! 🤝";
        gameActive = false;
        scheduleRestart();
        return;
    }
    
    // Switch current player
    currentPlayer = player === bulldog ? bone : bulldog;
    
    // Update message for next turn
    if (gameActive) {
        message.textContent = currentPlayer === bulldog ? "Your turn!" : "Computer's turn!";
    }
}

/**
 * Computer makes a move using simple AI
 */
function computerMove() {
    if (!gameActive) return;
    
    // Get all empty cells
    const availableIndices = gameBoard
        .map((val, idx) => val === '' ? idx : null)
        .filter(val => val !== null);
    
    if (availableIndices.length === 0) return;
    
    let moveIndex;
    
    // Try to win first
    moveIndex = findWinningMove(bone);
    if (moveIndex !== -1) {
        makeMove(moveIndex, bone);
        return;
    }
    
    // Block player from winning
    moveIndex = findWinningMove(bulldog);
    if (moveIndex !== -1) {
        makeMove(moveIndex, bone);
        return;
    }
    
    // Take center if available
    if (gameBoard[4] === '') {
        makeMove(4, bone);
        return;
    }
    
    // Take corners if available
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameBoard[index] === '');
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        makeMove(randomCorner, bone);
        return;
    }
    
    // Take any available edge
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    makeMove(randomIndex, bone);
}

/**
 * Find a winning move for the specified player
 * @param {string} player - Player symbol to check for winning move
 * @returns {number} Index of winning move or -1 if none found
 */
function findWinningMove(player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        const values = [gameBoard[a], gameBoard[b], gameBoard[c]];
        
        // Count how many cells the player occupies in this winning condition
        const playerCount = values.filter(val => val === player).length;
        const emptyCount = values.filter(val => val === '').length;
        
        // If player has 2 and there's 1 empty, that's the winning/blocking move
        if (playerCount === 2 && emptyCount === 1) {
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    return -1;
}

/**
 * Check if current player has won
 * @returns {boolean} True if current player won
 */
function checkWin() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return gameBoard[a] && 
               gameBoard[a] === gameBoard[b] && 
               gameBoard[b] === gameBoard[c];
    });
}

/**
 * Check if the game is a draw
 * @returns {boolean} True if all cells are filled
 */
function isDraw() {
    return gameBoard.every(cell => cell !== '');
}

/**
 * Reset the game to initial state
 */
function resetGame() {
    // Clear any pending auto-restart
    clearTimeout(autoRestartTimeout);
    
    // Reset game board
    for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i] = '';
        cells[i].textContent = '';
    }
    
    // Reset game state
    currentPlayer = bulldog;
    gameActive = true;
    message.textContent = "Your turn!";
}

/**
 * Schedule automatic game restart after win/draw
 */
function scheduleRestart() {
    autoRestartTimeout = setTimeout(() => {
        resetGame();
    }, 3000); // Restart after 3 seconds
}

/**
 * Add visual feedback for cell hover
 */
function addCellHoverEffects() {
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            if (cell.textContent === '' && gameActive && currentPlayer === bulldog) {
                cell.style.backgroundColor = '#b0d9ee';
            }
        });
        
        cell.addEventListener('mouseleave', () => {
            if (cell.textContent === '') {
                cell.style.backgroundColor = '#c0e9ff';
            }
        });
    });
}

/**
 * Initialize the game
 */
function initGame() {
    // Add event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', () => {
        startMusic();
        resetGame();
    });
    
    // Add hover effects
    addCellHoverEffects();
    
    // Set initial message
    message.textContent = "Your turn!";
    
    console.log('Tic-Tac-Toe game initialized successfully!');
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameBoard,
        checkWin,
        isDraw,
        findWinningMove,
        resetGame
    };
}
