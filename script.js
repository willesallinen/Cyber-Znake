const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startText = document.getElementById('startText');
const currentScoreText = document.getElementById('currentScore');
const bestScoresText = document.getElementById('bestScores');
const snakeColor = '#58B164';
const appleColor = '#B1299B';
const boxSize = 20;
let snake = [{ x: 300, y: 300 }];
let direction = { x: 0, y: 0 };
let apple = { x: 0, y: 0 };
let gameInterval;
let score = 0;
let bestScores = [0, 0, 0];

const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');
const backgroundMusic = new Audio('bitmusic.mp3');

document.addEventListener('keydown', handleKeydown);
startText.style.display = 'block';

// Ensure audio can play after user interaction
document.addEventListener('click', () => {
    eatSound.play().catch(() => {});
    gameOverSound.play().catch(() => {});
    backgroundMusic.play().catch(() => {});
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
});

function handleKeydown(event) {
    if (event.key === 'Enter') {
        startGame();
    } else if (event.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -boxSize };
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: boxSize };
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -boxSize, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: boxSize, y: 0 };
    }
}

function startGame() {
    startText.style.display = 'none';
    score = 0;
    updateScore();
    direction = { x: boxSize, y: 0 };
    placeApple();
    backgroundMusic.loop = true; // Loop the background music
    backgroundMusic.play(); // Play background music
    gameInterval = setInterval(updateGame, 60); // Reduced interval time for smoother gameplay
}

function updateGame() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkSelfCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        updateScore();
        placeApple();
        eatSound.play(); // Play sound when apple is eaten
    } else {
        snake.pop();
    }

    drawGame();
}

function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = snakeColor;
    ctx.shadowColor = snakeColor;
    ctx.shadowBlur = 50; // Adjust this value to change the glow effect
    snake.forEach(segment => {
        ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
    });

    ctx.fillStyle = appleColor;
    ctx.shadowColor = appleColor;
    ctx.shadowBlur = 10;
    ctx.fillRect(apple.x, apple.y, boxSize, boxSize);
}

function placeApple() {
    apple.x = Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize;
    apple.y = Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize;
}

function updateScore() {
    currentScoreText.textContent = `Score: ${score}`;
}

function updateBestScores() {
    bestScores.push(score);
    bestScores.sort((a, b) => b - a);
    bestScores = bestScores.slice(0, 3);
    bestScoresText.textContent = `Best Scores: ${bestScores.join(', ')}`;
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverSound.play(); // Play sound on game over
    backgroundMusic.pause(); // Pause background music
    backgroundMusic.currentTime = 0; // Reset music to start
    startText.style.display = 'block';
    updateBestScores();
    snake = [{ x: 300, y: 300 }];
    direction = { x: 0, y: 0 };
    score = 0;
    updateScore();
}
