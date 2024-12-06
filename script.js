const N_SIZE = 3; // Board size (3x3 grid)
const EMPTY = '&nbsp;';
let boxes = [];
let turn = 'X';
let moves = 0;

// Initialize the game
function init() {
    const board = document.createElement('table');
    board.setAttribute('border', 1);
    board.setAttribute('cellspacing', 0);

    for (let i = 0; i < N_SIZE; i++) {
        const row = document.createElement('tr');
        board.appendChild(row);
        for (let j = 0; j < N_SIZE; j++) {
            const cell = document.createElement('td');
            cell.setAttribute('height', 120);
            cell.setAttribute('width', 120);
            cell.setAttribute('align', 'center');
            cell.setAttribute('valign', 'center');
            cell.addEventListener('click', makeMove);
            row.appendChild(cell);
            boxes.push(cell);
        }
    }

    document.getElementById('tictactoe').appendChild(board);
    resetGame();
}

// Reset the game board and variables
function resetGame() {
    turn = 'X';
    moves = 0;
    boxes.forEach(cell => {
        cell.innerHTML = EMPTY;
        cell.classList.remove('x', 'o', 'win');
    });
    updateTurnDisplay();
}

// Update turn display
function updateTurnDisplay() {
    document.getElementById('turn').textContent = `Player ${turn}`;
    document.getElementById('playerX-turn').style.display = turn === 'X' ? 'block' : 'none';
    document.getElementById('playerO-turn').style.display = turn === 'O' ? 'block' : 'none';
}

// Show celebration toast
function showCelebration(message) {
    const celebrationDiv = document.getElementById('celebration');
    const celebrationMessage = document.getElementById('celebration-message');
    celebrationMessage.textContent = message;
    celebrationDiv.style.display = 'block';
    startConfetti();
    setTimeout(() => {
        celebrationDiv.style.display = 'none';
        resetGame();
    }, 5000);
}

// Confetti effect
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let confetti = [];
    for (let i = 0; i < 200; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            speed: Math.random() * 3 + 1,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
            ctx.fillStyle = c.color;
            ctx.fillRect(c.x, c.y, c.w, c.h);
            c.y += c.speed;
            if (c.y > canvas.height) {
                c.y = -c.h;
                c.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(draw);
    }

    draw();
}

// Handle player moves
function makeMove() {
    if (this.innerHTML !== EMPTY) return;

    this.innerHTML = turn;
    this.classList.add(turn.toLowerCase());
    moves++;

    if (checkWin()) {
        showCelebration(`Congratulations Player ${turn}!`);
        return;
    }

    if (moves === N_SIZE * N_SIZE) {
        showCelebration('It\'s a Draw!');
        return;
    }

    turn = turn === 'X' ? 'O' : 'X';
    updateTurnDisplay();
}

// Check win condition
function checkWin() {
    const board = Array.from({ length: N_SIZE }, () => Array(N_SIZE).fill(null));
    boxes.forEach((cell, index) => {
        const row = Math.floor(index / N_SIZE);
        const col = index % N_SIZE;
        board[row][col] = cell.textContent.trim() === EMPTY ? null : cell.textContent.trim();
    });

    for (let i = 0; i < N_SIZE; i++) {
        if (board[i].every(cell => cell === turn)) return true;
        if (board.every(row => row[i] === turn)) return true;
    }

    if (board.every((row, i) => row[i] === turn)) return true;
    if (board.every((row, i) => row[N_SIZE - i - 1] === turn)) return true;

    return false;
}

// Initialize the game on page load
init();
