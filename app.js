const gameArea = document.getElementById('game-area');
const player = document.querySelector('#player');
const beyonce = document.querySelectorAll('#beyonce')[0];
const audio = document.getElementById('audio');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const gameMessage = document.getElementById('game-message');
const timedModeButton = document.getElementById('timed-mode');
const chaseModeButton = document.getElementById('chase-mode');
const noobButton = document.getElementById('noob');
const normalButton = document.getElementById('normal');
const darkSoulsButton = document.getElementById('dark-souls');
const colorPicker = document.getElementById('color-picker');
const timer = document.getElementById('timer');
const timeRemaining = document.getElementById('time-remaining');

let isPlaying = false;
let isTimedMode = false;
let isChaseMode = false;
let difficulty = 'normal';
let playerPosition = { x: 0, y: 0 };
let beyoncePosition = { x: 300, y: 300 };
let timeLeft = 30;
let timerInterval;

const speeds = {
    noob: { player: 45, beyonce: 1.5, duration: 15 },
    normal: { player: 35, beyonce: 2.3, duration: 30 },
    darkSouls: { player: 45, beyonce: 4, duration: 60 }
};

colorPicker.addEventListener('input', (event) => {
    if (isChaseMode) {
        beyonce.style.backgroundColor = event.target.value;
    } else {
        player.style.backgroundColor = event.target.value;
    }
});

function detectCollision() {
    const deltaX = Math.abs(playerPosition.x - beyoncePosition.x);
    const deltaY = Math.abs(playerPosition.y - beyoncePosition.y);

    if (deltaX <= 50 && deltaY <= 50) {
        if (isChaseMode) {
            alert('Oh no hermano!');
            resetGame();
        } else {
            alert('Beyonce te atrapó! Rápido, dale las gracias para salvar tu vida');
            resetGame();
        }
    }
}

function gameLoop() {
    if (isPlaying) {
        if (isTimedMode) {
            moveBeyonce(); // Beyoncé persigue al jugador
        } else if (isChaseMode) {
            moveColorSquare(); // El cuadrado de color persigue a Beyoncé
        }
        requestAnimationFrame(gameLoop);
    }
}

function moveBeyonce() {
    if (beyoncePosition.x < playerPosition.x)
        beyoncePosition.x += speeds[difficulty].beyonce;
    else if (beyoncePosition.x > playerPosition.x)
        beyoncePosition.x -= speeds[difficulty].beyonce;

    if (beyoncePosition.y < playerPosition.y)
        beyoncePosition.y += speeds[difficulty].beyonce;
    else if (beyoncePosition.y > playerPosition.y)
        beyoncePosition.y -= speeds[difficulty].beyonce;

    updatePosition();
    detectCollision();
}

function moveColorSquare() {
    if (playerPosition.x < beyoncePosition.x)
        playerPosition.x += speeds[difficulty].beyonce;
    else if (playerPosition.x > beyoncePosition.x)
        playerPosition.x -= speeds[difficulty].beyonce;

    if (playerPosition.y < beyoncePosition.y)
        playerPosition.y += speeds[difficulty].beyonce;
    else if (playerPosition.y > beyoncePosition.y)
        playerPosition.y -= speeds[difficulty].beyonce;

    updatePosition();
    detectCollision();
}

function movePlayer(event) {
    if (isPlaying) {
        switch (event.key) {
            case 'ArrowUp':
                if (isChaseMode) {
                    if (beyoncePosition.y >= 25)
                        beyoncePosition.y -= speeds[difficulty].player;
                } else {
                    if (playerPosition.y >= 25)
                        playerPosition.y -= speeds[difficulty].player;
                }
                break;
            case 'ArrowDown':
                if (isChaseMode) {
                    if (beyoncePosition.y < gameArea.clientHeight - 70)
                        beyoncePosition.y += speeds[difficulty].player;
                } else {
                    if (playerPosition.y < gameArea.clientHeight - 70)
                        playerPosition.y += speeds[difficulty].player;
                }
                break;
            case 'ArrowLeft':
                if (isChaseMode) {
                    if (beyoncePosition.x >= 25)
                        beyoncePosition.x -= speeds[difficulty].player;
                } else {
                    if (playerPosition.x >= 25)
                        playerPosition.x -= speeds[difficulty].player;
                }
                break;
            case 'ArrowRight':
                if (isChaseMode) {
                    if (beyoncePosition.x < gameArea.clientWidth - 70)
                        beyoncePosition.x += speeds[difficulty].player;
                } else {
                    if (playerPosition.x < gameArea.clientWidth - 70)
                        playerPosition.x += speeds[difficulty].player;
                }
                break;
        }
        updatePosition();
        detectCollision();
    }
}

function updatePosition() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    beyonce.style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`;
}

function startGame() {
    isPlaying = true;
    gameMessage.style.display = 'none';
    if (isTimedMode) {
        timer.classList.remove('hidden');
        startTimer();
    } else {
        timer.classList.add('hidden');
    }
    audio.play();
    gameLoop();
}

function stopGame() {
    isPlaying = false;
    gameMessage.innerText = 'Pausa';
    gameMessage.style.display = 'block';
    audio.pause();
    clearInterval(timerInterval);
}

function resetGame() {
    playerPosition = { x: 0, y: 0 };
    beyoncePosition = { x: 300, y: 300 };
    updatePosition();
    stopGame();
    gameMessage.innerText = isTimedMode ? 'Felicidades, lograste escapar de Beyoncé' : 'Oh no hermano!';
}

function startTimer() {
    timeLeft = speeds[difficulty].duration;
    timeRemaining.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timeRemaining.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            resetGame();
            alert('Felicidades, lograste escapar de Beyoncé!');
        }
    }, 1000);
}

function selectButton(button) {
    // Remove 'selected' class from all buttons
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
    // Add 'selected' class to the clicked button
    button.classList.add('selected');
}

timedModeButton.addEventListener('click', () => {
    isTimedMode = true;
    isChaseMode = false;
    player.style.backgroundColor = colorPicker.value; 
    player.style.backgroundImage = 'none';
    beyonce.style.backgroundImage = 'url("img/beyonce.webp")'; 
    selectButton(timedModeButton);
});

chaseModeButton.addEventListener('click', () => {
    isTimedMode = false;
    isChaseMode = true;
    player.style.backgroundImage = 'url("img/beyonce.webp")'; 
    player.style.backgroundColor = 'transparent'; 
    beyonce.style.backgroundColor = colorPicker.value; 
    selectButton(chaseModeButton);
});

noobButton.addEventListener('click', () => {
    difficulty = 'noob';
    selectButton(noobButton);
});

normalButton.addEventListener('click', () => {
    difficulty = 'normal';
    selectButton(normalButton);
});

darkSoulsButton.addEventListener('click', () => {
    difficulty = 'darkSouls';
    selectButton(darkSoulsButton);
});

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
window.addEventListener('keydown', movePlayer);
